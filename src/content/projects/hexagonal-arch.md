---
title: "Order Management System — Hexagonal Architecture"
description: "A production-grade order processing service built with TypeScript, NestJS, and Hexagonal Architecture. Demonstrates strict domain isolation, port/adapter boundaries, and event-driven side effects."
stack: ["TypeScript", "NestJS", "PostgreSQL", "RabbitMQ", "Docker"]
date: 2024-03-15
featured: true
repo: "https://github.com/khalvai/order-management"
---

## Overview

This service handles the full lifecycle of an order: creation, payment confirmation,
fulfilment, and cancellation. The domain layer knows nothing about HTTP, databases, or
message queues — it only speaks its own language of aggregates, value objects, and domain events.

## Architecture decisions

**Why Hexagonal?** The business rules change less frequently than the delivery mechanisms.
By keeping the domain isolated, you can swap PostgreSQL for MongoDB, or replace RabbitMQ with
Kafka, without touching a single line of business logic.

**Domain events over direct calls** When an order is confirmed, the domain emits an
`OrderConfirmedEvent`. The infrastructure layer picks this up and dispatches the email,
updates inventory, and notifies the warehouse — all independently, without the domain caring.

## Key patterns used

- **Aggregate Root** — `Order` is the consistency boundary
- **Value Objects** — `Money`, `OrderId`, `CustomerId` are immutable and validated on construction
- **Repository pattern** — `IOrderRepository` port, `PostgresOrderRepository` adapter
- **CQRS** — separate read models for the listing queries; write model handles commands
