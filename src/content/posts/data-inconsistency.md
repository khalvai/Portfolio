
---
title: "Data Inconsistency in Distributed Systems: Problem Patterns & Practical Solutions"
description: "Explore why data inconsistency happens in modern distributed systems, and learn proven patterns to tackle cross-service consistency, from basic transactions to inbox/outbox and saga patterns. Includes practical TypeScript examples."
draft: false
tags: ["distributed-systems", "data-consistency", "transactions", "patterns", "typescript"]
date: 2025-04-21
---

# Data Inconsistency: Common Problems and Solutions

## The Problem

What is wrong with these two lines of code?

```ts
const order = await this.prisma.order.create({data:...})
const payment = await this.prisma.payment.update({data:{
    status: "SUCCEED"
}})
```

### Issues Identified

- **Lack of transactional behavior**
  - This issue involves multiple updates without an overarching transaction
  - If any issue occurs after updating the record in the order table, the system will end up in an inconsistent state
  - **Why might there be an issue during the execution of the second query?**

    The issue can be due to anything from a network outage to a database timeout or deadlock, or even a crash of the server executing the process.

## Simple Solution: Database Transactions

This can be fixed by introducing a proper transaction encompassing both data changes:

```ts
const result = await this.prisma.$transaction(async (tx) => {
    const order = await tx.order.create({data: ...})
    const payment = await tx.payment.update({
        where: { id: paymentId },
        data: { status: "SUCCEED" }
    })
    return { order, payment }
})
```

## Complex Scenarios: Cross-Service Operations

However, it is not always this easy to solve the problem:

```ts
const invitation = await this.prisma.invitation.create({data: ...})
await this.mailingService.sendInvitation({data})
```

### The Challenge

- **What happens if the mailing service cannot deliver the email?**
- The invitation is created but the email is not sent
- This creates an inconsistent state across services

### Solution Approaches

The choice of solution depends on answering this question: **How severe is it if the second instruction goes wrong?**

#### 1. Ignore the Problem (Simplest)

Simply ignore the problem and let the user fix it by requesting again.

**When to use:** When the operation is idempotent and user-initiated.

```ts
// User can retry if email fails
const invitation = await this.prisma.invitation.create({data: ...})
try {
    await this.mailingService.sendInvitation({data})
} catch (error) {
    // Log error but don't fail the operation
    console.error('Failed to send invitation email:', error)
}
```

#### 2. Reorganize Business Logic

Arrange the business logic in a way that there is no need for transactional behavior.

**When to use:** When you can make the operation naturally idempotent.

```ts
// Only create invitation after email is sent
const emailSent = await this.mailingService.sendInvitation({data})
if (emailSent) {
    await this.prisma.invitation.create({data: ...})
}
```

#### 3. Inbox and Outbox Pattern (Recommended)

The Inbox and Outbox pattern provides a reliable way to handle cross-service operations while maintaining data consistency.

**How it works:**

- **Outbox**: Store events that need to be processed in the same transaction as your business data
- **Inbox**: Process incoming events reliably, ensuring idempotency

```ts
// Outbox Pattern - Publishing events
await this.prisma.$transaction(async (tx) => {
    const invitation = await tx.invitation.create({data: ...})

    // Store the event in the outbox table
    await tx.outboxEvent.create({
        data: {
            eventType: 'INVITATION_CREATED',
            payload: { invitationId: invitation.id, email: invitation.email },
            processed: false
        }
    })
})

// Separate process handles outbox events
async processOutboxEvents() {
    const events = await this.prisma.outboxEvent.findMany({
        where: { processed: false }
    })

    for (const event of events) {
        try {
            await this.mailingService.sendInvitation(event.payload)
            await this.prisma.outboxEvent.update({
                where: { id: event.id },
                data: { processed: true }
            })
        } catch (error) {
            // Event remains unprocessed for retry
            console.error('Failed to process outbox event:', error)
        }
    }
}
```

**Benefits:**

- Guarantees eventual consistency
- Handles failures gracefully
- Provides audit trail
- Enables retry mechanisms

#### 4. Distributed Transactions (Avoid When Possible)

Use distributed transactions as a last resort due to their overhead and complexity.

**When to use:** Only when you absolutely need immediate consistency across services.

```ts
// Example using Saga pattern
async function createInvitationWithEmail(data) {
  const saga = new InvitationSaga()

  try {
    await saga.execute([
      () => this.prisma.invitation.create({ data }),
      () => this.mailingService.sendInvitation({ data })
    ])
  } catch (error) {
    await saga.compensate() // Rollback all operations
    throw error
  }
}
```

## Best Practices Summary

1. **Start Simple**: Use database transactions for single-database operations
2. **Design for Failure**: Assume external services will fail
3. **Prefer Inbox/Outbox**: For cross-service operations requiring consistency
4. **Avoid Distributed Transactions**: Unless absolutely necessary
5. **Make Operations Idempotent**: When possible, design operations to be safely retryable
6. **Monitor and Alert**: Set up monitoring for failed operations and inconsistent states

## Conclusion

Data inconsistency is a common challenge in distributed systems. The key is to choose the right approach based on your specific requirements:

- **Single Database**: Use transactions
- **Cross-Service**: Use Inbox/Outbox pattern
- **User-Initiated**: Consider idempotent operations
- **Critical Consistency**: Use distributed transactions (sparingly)

Remember: **Consistency is not always the highest priority**. Sometimes eventual consistency is sufficient and much simpler to achieve.