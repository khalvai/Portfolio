---
title: "DDD in Practice: The Value Object you're not writing"
description: "Most teams adopt DDD vocabulary but skip Value Objects because they feel like boilerplate. Here's why that's a mistake and how to introduce them without rewriting your codebase."
date: 2024-05-10
draft: false
tags: ["ddd", "typescript", "architecture"]
---

## The problem with primitive obsession

You have a `userId: string`. It arrives from an HTTP header, a database row, and a Kafka
message. Each source might format it differently, validate it differently, or mean something
slightly different by "user ID".

When you pass raw strings around, you have no way to tell — at the type level — whether a
string is a validated user ID or just any string someone passed in.

## The Value Object fix

```typescript
class UserId {
  private constructor(private readonly value: string) {}

  static create(raw: string): UserId {
    if (!raw.match(/^usr_[a-z0-9]{16}$/)) {
      throw new InvalidUserIdError(raw);
    }
    return new UserId(raw);
  }

  toString(): string {
    return this.value;
  }
}
```

Now `UserId` carries its own validation. You construct it once at the boundary (HTTP handler
or database mapper) and the rest of your application only ever sees valid `UserId` instances.

## Practical rollout

You don't need to refactor everything at once. Pick one aggregate that causes the most bugs,
introduce Value Objects there first, and see how it feels. The type system will guide you
toward the right boundaries.
