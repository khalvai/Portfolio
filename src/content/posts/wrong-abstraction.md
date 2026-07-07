---
title: "Wrong Abstractions: The Type Safety Trap"
description: "Why most TypeScript interfaces in modern web apps aren't real abstractions—and how overusing them for 'type safety' leads to code coupling and anti-patterns. Learn better approaches, with practical NestJS/TypeScript examples."
draft: false
tags: ["abstraction", "typescript", "architecture", "nestjs", "anti-patterns"]
date: 2025-04-21
---



# Wrong Abstractions: The Type Safety Trap

## The Problem

In the NestJS ecosystem, developers tend to write interfaces like:

```ts
export interface Order {
  id: number
  totalPrice: Decimal
  createdAt: Date
  updatedAt: Date
}
```

And they simply place this interface in `common/interfaces/order`.

Then for UI purposes, they have to introduce other interfaces:

```ts
export interface OrderWithItems extends Order {
  items: { productId: number }[]
}
```

## The Core Issue

So, what is wrong with these abstractions?

Let's ask this: **Why are they used?** Are they here for abstracting a concept or implementation? **No, they are here for just type safety.**

This is a fundamental misunderstanding of what abstractions should be.

## Why These Abstractions Are Wrong

### 1. **They Don't Abstract Behavior**

These interfaces only describe data structure, not behavior or concepts. They're essentially glorified type definitions.

### 2. **They Create Artificial Coupling**

By placing these in `common/interfaces`, you're creating unnecessary dependencies between modules that shouldn't know about each other. You are exposing the implementation details to other modules that should not be aware. When you separately implement order and item, you are telling others about implementation detail of database.

### 4. **They Lead to Interface Explosion**

You end up with multiple variations: `Order`, `OrderWithItems`, `OrderSummary`, `OrderWithItemAndDiscount`, etc.

## What Abstractions Should Be

### 1. **Domain Concepts**

Abstractions should represent business concepts, not data structures.

```ts
export interface UserRepository {
  findById(id: UserId): Promise<User | null>
  save(user: User): Promise<void>
  findByEmail(email: Email): Promise<User | null>
}

export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly profile: UserProfile
  ) {}

  changeEmail(newEmail: Email): void {
    // Business logic here
  }

  isActive(): boolean {
    // Business logic here
  }
}
```

### 2. **Service Contracts**

Abstractions should define what services can do, not what data they contain.

```ts
export interface PaymentService {
  processPayment(amount: Money, method: PaymentMethod): Promise<PaymentResult>
  refundPayment(paymentId: PaymentId): Promise<RefundResult>
}


export interface NotificationService {
  sendEmail(to: EmailAddress, template: EmailTemplate): Promise<void>
  sendSms(to: PhoneNumber, message: string): Promise<void>
}
```

### 3. **Ports and Adapters**

Abstractions should define interfaces between your application and external systems.

```ts

export interface EmailProvider {
  send(template: EmailTemplate, recipient: EmailAddress): Promise<EmailResult>
}


export interface OrderRepository {
  save(order: Order): Promise<void>
  findById(id: OrderId): Promise<Order | null>
  findByCustomerId(customerId: CustomerId): Promise<Order[]>
}
```

## Better Alternatives

### 1. **Use Classes for Domain Entities**

```ts
export class Order {
  constructor(
    private readonly id: OrderId,
    private readonly customerId: CustomerId,
    private readonly items: OrderItem[],
    private readonly status: OrderStatus
  ) {}

  addItem(item: OrderItem): void {
    // Business logic
  }

  calculateTotal(): Money {
    // Business logic
  }

  canBeCancelled(): boolean {
    // Business logic
  }
}
```

### 2. **Use Value Objects**

```ts
export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new InvalidEmailError(value)
    }
  }

  private isValid(email: string): boolean {
    // Validation logic
  }

  toString(): string {
    return this.value
  }
}

export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: Currency
  ) {}

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError()
    }
    return new Money(this.amount + other.amount, this.currency)
  }
}
```

### 4. **Use Types for Simple Data**

```ts
export type OrderSummary = {
  id: string
  total: number
  status: string
  createdAt: Date
}

export type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

## Best Practices

### 1. **Ask "Why?" Before Creating Interfaces**

- Are you abstracting behavior or just data structure?
- Does this solve a real problem or just provide type safety?
- Would this interface exist in a non-TypeScript codebase?
- Would the abstraction change with change in the implementation?

### 2. **Prefer Classes for Domain Logic**

- Use classes when you have behavior and state
- Use value objects for domain concepts
- Use DTOs for data transfer

### 3. **Keep Interfaces Close to Their Usage**

- Don't put everything in `common/interfaces`
- Use dependency injection to provide implementations

## Conclusion

The key insight is that **abstractions should hide complexity and provide a clean interface to complex behavior**, not just provide type safety for data structures.

When you find yourself creating interfaces that only describe data, ask yourself:

- What behavior am I abstracting?
- What complexity am I hiding?
- What problem am I actually solving?

If the answer is "just type safety," then you probably don't need an interface - you need a type or a class with actual behavior.

Remember: **Good abstractions make complex things simple. Bad abstractions make simple things complex.**