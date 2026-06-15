---
title: "Internal API Gateway"
description: "A lightweight TypeScript API gateway that handles routing, JWT validation, rate limiting, and request tracing for a microservices cluster."
stack: ["TypeScript", "Node.js", "Redis", "Docker", "Prometheus"]
date: 2023-11-20
featured: false
---

## Overview

Teams working with microservices often bolt authentication and rate limiting onto each
service individually. This gateway centralises those cross-cutting concerns so services
can focus on their business logic.

## What it does

- **JWT validation** — verifies tokens and injects a `x-user-id` header downstream
- **Rate limiting** — sliding-window counter stored in Redis; configurable per route
- **Request tracing** — stamps every request with a `x-trace-id` that propagates through all hops
- **Metrics** — exposes a `/metrics` endpoint in Prometheus format

## Lessons learned

The hardest part was not the technical implementation — it was agreeing on the contract between
the gateway and the services. Documenting the injected headers in an ADR (Architecture Decision
Record) saved a lot of back-and-forth later.
