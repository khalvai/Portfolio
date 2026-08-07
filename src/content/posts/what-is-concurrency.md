

---
title: "What is concurrency?"
description: "Overlapping execution time."
date: 2026-08-07
draft: false
tags: ["Concurrency", "Parallelism", "Node.js"]
image: "/small-umbrella.png"
---




![](/small-umbrella.png)

Concurrency is an umbral term in computer science, that we have no single formal standardized definition( like Algorithm, Service ...).

[Wikipedia](<https://en.wikipedia.org/wiki/Concurrency_(computer_science)>):

> Concurrency refers to the ability of a system to execute multiple tasks through simultaneous execution or time-sharing (context switching), sharing resources and managing interactions.

[Rust documentation](https://doc.rust-lang.org/book/ch16-00-concurrency.html#fearless-concurrency):

> Concurrent programming, in which different parts of a program execute independently, and parallel programming, in which different parts of a program execute at the same time,

Rob Pike, co-creator of the Go programming language:

> Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once.

### Are _dealing_ as same as _doing_? short answer no :)

Imagine we have a single core (single threaded) CPU, therefore we are able to execute just one instruction at a time. However, we have three tasks of playing music, messaging on Slack, downloading a file.

We have two options available for execution:

1. Sequential execution, wait one finishes and then start the second (this is not what happens on a real OS)

- ![sequential execution](/sequential-execution.png)

<br>

2. Switch between execution of tasks, a scheduler gives each task a tiny slice of CPU time(milliseconds), and forcibly interrupts it and switch to the next task.

- Your keystrokes in Slack get their own tiny slice to be processed.
- The music player's audio buffer gets its own tiny slice to keep decoding/streaming samples.
- The download gets its own tiny slice to receive network packets.

Intuitively, it feels like the song is playing and stops, the other tasks turn, and a chunk of song is played ..., However, when we do the context switching so many times in a second. Every task is being interrupted and resumed extremely rapidly, not blocked-until-you're-done.

#### Are they concurrent?

yes, based on this assumption:

> Two tasks are concurrent if their execution intervals overlap in time, task A starts before task B finishes. Just that, overlapping time periods.

The definition says nothing about whether a single core is switching between them or whether they're on separate cores. It only cares about the interval relationship.

#### What happens if we did not need to interrupt task while execution?

If we had enough execution units(cores, threads) each of them gets a task, therefore we are executing the task without an interruption. It is called parallelism.

[Wikipedia](https://en.wikipedia.org/wiki/Parallel_computing):

> Parallel computing is a type of computation in which many calculations or processes are carried out simultaneously.

Core 1 (Task A): |-----------------|

Core 2 (Task B): |-----------------|

##### Aren't there execution times overlap?

Yes there are. That is the maximal possible overlap, so by the definition, it is a form of concurrency.

Therefore, we can claim:

- All parallel execution is concurrent
- Not all concurrent execution is parallel (the single-core music/Slack/download example proves this. Overlap exists (interval-wise))

- Parallelism ⊂ Concurrency

#### Concurrency model in Node.js:

In node.js Concurrency is achieved by non-blocking I/O: when you call fs.readFile or make an HTTP request, Node hands the work off to the OS/libuv thread pool (or OS async APIs) and immediately moves to the next task in the queue. When the I/O completes, a callback is queued back onto the event loop.

#### What is async/await?

Async/await doesn't change any of the above.it's syntax sugar over the concurrency model, specifically designed to make non-blocking, callback-based concurrency read like sequential code.

#### Race condition: shared/mutable/state

A race condition happens when the correctness of a program depends on the timing or ordering of operations that access shared, mutable state and that ordering isn't guaranteed.

##### When exactly does it occur?

A race condition requires three ingredients simultaneously:

1. Shared state: two or more tasks access the same variable, object, file, DB row, etc.
2. At least one write: if everyone's only reading, there's nothing to race over.
3. No enforced ordering: nothing guarantees task A's read-modify-write completes atomically before task B's does.

Concurrency is the necessary condition, not the cause.
