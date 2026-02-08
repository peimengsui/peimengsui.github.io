---
layout: post
title: "Building Music Learning App: A Vibe Coding Experience"
date: 2026-02-08
tags: ["Hobby Projects"]
---

## Building Music Learning App: A Vibe Coding Experience

Music has always played an important role in my life outside of work. I learned piano as a kid, and last year I started picking up acoustic guitar. Along the way, I’ve taken lessons with several instructors who run their own private studios.

One thing I noticed is that many teachers have accumulated amazing teaching content over the years — sheet music, exercises, practice routines, and assignments. However, a common pain point is that these materials are often difficult to organize and share with students in a structured, reusable way. As a result, instructors end up spending a lot of time repeating lesson preparation instead of maximizing the impact of the content they’ve already created.

Recently, “vibe coding” tools powered by large language models have become incredibly popular and surprisingly powerful. As a Machine Learning Engineer, I’ve never felt more inspired to build and ship software end-to-end, turning product ideas into real applications faster than ever before.

That motivation led me to start building my own MVP: a teacher-first [music learning platform](https://music-learning-app-g8df.vercel.app/) designed to help instructors digitize lesson plans, share materials, assign homework, collect student submissions, and provide feedback — all in one place.

In this post, I’ll share how I’ve been building the app through vibe coding, give a quick demo of its current functionality, and discuss some future improvements I’m excited to explore.

### Vibe Coding Experience
As a machine learning engineer in large tech companies, I’ve often collaborated with engineers across the stack — but I rarely had the chance to build and ship a full product completely on my own. Tools like ChatGPT and modern coding agents have made it genuinely feasible to learn by doing and to go through the entire software development cycle with much less friction.

My vibe coding setup isn’t the fanciest, but it has worked extremely well for building this app end-to-end:

- I started by chatting with GPT to brainstorm ideas and narrow down the first MVP goals. It felt like working with a product partner — iterating quickly on what would be both impactful and realistically achievable.

- Next, I prompted GPT to generate an initial full-stack design document. GPT-5.2 (Auto mode) did a surprisingly strong job outlining the architecture, component choices, and tradeoffs. For parts of the stack that I hadn’t touched much in my day-to-day work, this became a valuable learning process. With enough context and tool-calling ability, GPT can justify decisions clearly and act much like a senior engineer you can bounce ideas off of.
  ![Music Learning App MVP Architecture](/assets/images/MusicLearningAppArchitecture.png)

- For implementation, I combined GPT with Cursor’s coding agents in Plan mode to create step-by-step execution roadmaps. I intentionally chose an IDE-native agent workflow over purely CLI-based tools (like Claude Code) because I wanted to stay close to the building process and learn from each step—not just generate the final result. Cursor handled most tasks smoothly, and I especially appreciated how it produced lightweight Markdown documentation along the way (for example, how to test new components locally). When something didn’t look right, I could iterate quickly with follow-up prompts and concrete UI/text adjustments.

- Deployment turned out to be the most time-consuming part. The stack itself is pragmatic and developer-friendly — Render for hosting the FastAPI backend, Neon for managed Postgres, and Vercel for the Next.js frontend. But as a first-timer managing deployment alone, debugging environment variables, secrets, and configuration issues took more time than building much of the MVP itself. This feels like an area where AI-assisted automation could go further, especially with agents that have deeper deployment tooling. I’m also actively exploring better workflows and would love suggestions for improving this setup. 

### App Demo
Imagine a guitar teacher onboarding a new student. The teacher creates a studio, sends an invite, and sets up a lesson series. They upload a warm-up exercise PDF as a material, create a weekly assignment, and then use the AI assistant to draft a lesson plan that aligns with the student's level and focus. After the lesson, the student uploads practice recordings, and the teacher reviews submissions and logs before the next session. The teacher stays in control, the student gets structured guidance, and the entire learning loop becomes visible and actionable.

<video width="720" controls>
  <source src="/assets/videos/MusicLearningAppDemo.webm" type="video/webm">
  Your browser does not support the video tag.
</video>


### What Comes Next

The next step is to put this in front of real instructors, collect feedback from a small set of music teachers, and iterate on the core UX. From there, I plan to add more AI-enabled functionality that stays grounded in real teaching workflows, not just generic productivity features.

### Closing Thoughts

Vibe coding is not about replacing people. It is about empowering people to create and iterate faster, especially in domains that matter. When software helps educators do their job more effectively, that is a net gain for students, teachers, and communities. I see this project as a small but meaningful step toward democratizing software development and using technology to strengthen education.

---
