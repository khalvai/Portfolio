---
title: "Clean Architecture with NestJS: A practical guide"
description: "NestJS modules map naturally to Clean Architecture layers — here's how to structure your project so that your domain stays framework-free and your tests stay fast."
date: 2024-02-28
draft: false
tags: ["nestjs", "typescript", "clean-architecture"]
---

## Why framework-free domain code matters

If your domain classes import from `@nestjs/common`, you've coupled your business logic to
a specific version of a specific framework. When NestJS releases a breaking change, your
domain tests break — even if your business rules didn't change.

## The folder structure

```
src/
├── domain/          # framework-free: entities, value objects, interfaces
├── application/     # use cases — depends only on domain interfaces
├── infrastructure/  # NestJS modules, controllers, typeorm repos
└── main.ts          # bootstrap only
```

The rule: **imports always point inward**. Infrastructure imports application. Application
imports domain. Domain imports nothing external.

## NestJS modules as layer boundaries

Each `@Module` in NestJS naturally becomes an adapter. Your `HttpModule` contains controllers
and DTOs. Your `PersistenceModule` contains repositories. Neither knows about each other —
they're wired together only in the root `AppModule`.

This means you can test your use cases with in-memory repositories, completely bypassing
NestJS, TypeORM, and your database. Fast, deterministic, parallel tests.
