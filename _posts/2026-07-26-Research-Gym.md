---
layout: post
title: "Building ResearchGym: Learning Modern ML by Reimplementing It"
date: 2026-07-26
tags: ["Hobby Projects", "Machine Learning", "Open Source"]
description: "Why I built ResearchGym, an open-source learning environment for reimplementing foundational language-model, world-model, and diffusion-model ideas from scratch."
---

## Building ResearchGym: Learning Modern ML by Reimplementing It

Over the past few years, I’ve spent a lot of time reading papers, following courses, and taking notes about modern machine learning. These resources are incredibly useful, but I often encounter the same gap: understanding an idea conceptually is not the same as being able to implement it.

It is easy to recognize the equations behind attention, variational autoencoders, diffusion, or preference optimization. It is much harder to sit down with an empty Python file and correctly implement the tensor operations, objectives, sampling loops, and tests.

That gap motivated me to build [ResearchGym](https://github.com/peimengsui/research-gym), an open-source learning environment for reimplementing foundational machine-learning ideas from scratch.

ResearchGym is not intended to be another model library. It is a guided implementation gym where the learner reads a concept, completes a scaffold, runs focused tests, executes a tiny demo, and compares the result with a readable reference implementation.

In this post, I’ll share why I started the project, how the learning workflow works, what has been implemented so far, and how others can contribute.

### Learning by Reimplementation

When learning a new research idea, I usually want to answer three different questions:

1. What is the conceptual idea?
2. How does it translate into tensors and code?
3. How can I verify that my implementation is actually correct?

Many learning resources answer the first question very well. Some provide a complete implementation for the second. Fewer create a structured environment where the learner is responsible for connecting the two.

ResearchGym is designed around that connection.

Each lesson follows the same loop:

```text
read the concept
→ inspect the scaffold
→ implement the TODOs
→ run focused tests
→ run a tiny demo
→ request hints when needed
→ review the implementation
→ compare with the reference
→ generate a report
```

The scaffold intentionally does not hide the important implementation. Learners work in ordinary Python files, with explicit tensor shapes and small CPU-friendly examples.

There are no notebooks with hidden execution state, large training jobs, or framework abstractions that make it difficult to see what is happening.

### What a Lesson Looks Like

A lesson is a small, self-contained learning unit. It includes:

- a concept explanation
- an implementation guide
- a Python scaffold with focused TODOs
- progressive hints
- CPU-friendly tests
- a tiny demonstration script
- review questions
- a readable reference solution

For example, the classifier-free guidance lesson asks the learner to implement a learned null condition, condition dropout, and the guidance equation. The DDIM machinery from the previous lesson is already populated so the learner does not need to rewrite unrelated code.

This became an important design principle for the project: each lesson should ask the learner to implement the new idea, while carrying forward supporting code from earlier lessons.

The goal is not to maximize the number of TODOs. The goal is to isolate the concept that matters.

### A CLI-First Learning Workflow

ResearchGym provides a small command-line interface for discovering and running lessons.

After cloning the repository and installing the locked environment with `uv`, learners can list the available lessons:

```bash
git clone https://github.com/peimengsui/research-gym.git
cd research-gym
uv sync --locked
uv run rgym list
```

They can inspect a lesson before starting it:

```bash
uv run rgym inspect diffusion.09_flow_matching
```

Starting a lesson creates a disposable workspace:

```bash
uv run rgym start diffusion.09_flow_matching
cd workspace/diffusion.09_flow_matching
```

The learner edits `implementation.py` without modifying the source lesson. From the workspace, they can run:

```bash
uv run rgym test
uv run rgym run
uv run rgym hint
uv run rgym report
```

The first test run is expected to fail. That failure is part of the learning process: it makes the required behavior concrete and gives the learner a fast feedback loop.

<!-- Optional: add a screenshot or diagram here.

![ResearchGym CLI lesson workflow](/assets/images/ResearchGymWorkflow.png)

-->

### The Current Learning Tracks

ResearchGym currently contains 23 lessons across three tracks.

The language-model track begins with a bigram model and tokenizer, then builds toward causal attention, transformer blocks, a tiny GPT, KV caching, supervised fine-tuning data, direct preference optimization, and LoRA.

The world-model track covers variational autoencoders, latent dynamics, MDN-RNNs, an end-to-end world-model loop, and planning with the cross-entropy method.

The diffusion-model track starts with noise schedules and the forward process, then progresses through epsilon prediction, DDPM sampling, a tiny U-Net, DDIM, classifier-free guidance, latent diffusion, cross-attention conditioning, and flow matching.

I wanted the lesson sequence to feel cumulative. Earlier lessons establish small, reusable pieces; later lessons combine them into recognizable research systems.

For example, the diffusion track develops roughly like this:

```text
forward noising
→ epsilon prediction
→ DDPM sampling
→ Tiny U-Net
→ DDIM
→ classifier-free guidance
→ latent diffusion
→ cross-attention conditioning
→ flow matching
```

Each step is still small enough to run and test on CPU.

### Building ResearchGym with Coding Agents

ResearchGym has also been an experiment in collaborating with modern coding agents.

I began with a project design and roadmap, then implemented the CLI and lesson structure incrementally. For every new lesson, I worked through the same questions:

- What is the smallest useful version of this research idea?
- Which code should the learner implement?
- Which earlier code should already be populated?
- What tests demonstrate understanding rather than implementation trivia?
- Can the entire lesson remain fast and readable on CPU?

Coding agents were especially useful for maintaining the repeated lesson structure, updating repository integration, and running verification across the growing project.

### What Comes Next

I would like ResearchGym to be easier for others to extend.

There are several useful ways to contribute:

- try a lesson and share where the guide or scaffold is confusing
- propose a new lesson for an existing track
- improve tests, explanations, hints, or demonstrations
- contribute lessons for additional research areas
- review reference implementations for correctness and readability
- suggest better ways to structure the learner workflow

If you are studying a paper or research topic and think, “I wish there were a small implementation exercise for this,” that may be a good lesson proposal.

The project is available on GitHub:

[github.com/peimengsui/research-gym](https://github.com/peimengsui/research-gym)

Feedback, issues, and pull requests are welcome.

### Closing Thoughts

Machine-learning research can feel abstract when it is experienced only through papers, diagrams, or large production libraries. Reimplementation creates a different kind of understanding. It forces us to make shapes explicit, translate objectives into code, investigate failures, and recognize which details are essential.

My goal with ResearchGym is to make that process more structured and approachable.

You should not need a large GPU cluster to understand the foundation of a research idea. Sometimes the most useful learning environment is a small Python file, a failing test, and enough guidance to help you figure out why.

ResearchGym is still evolving, but I hope it can become a useful place for people who want to move from reading machine-learning ideas to truly implementing them.

---
