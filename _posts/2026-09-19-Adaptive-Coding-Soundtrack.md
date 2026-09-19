---
layout: post
title: "Adaptive Coding Soundtrack: Music That Follows Your Coding Flow"
date: 2026-09-19
tags: ["Hobby Projects", "Open Source"]
description: "A local-first Cursor and VS Code extension that infers what is happening in your editor and reshapes a procedurally generated soundtrack around it — built end to end by vibe coding with Codex."
---

## Adaptive Coding Soundtrack: Music That Follows Your Coding Flow

I almost always have music on while I code. For years the setup was simple: pick a playlist, put on headphones, and start working. But since I began coding with agents, my sessions stopped having one single rhythm. A coding session now swings between writing code myself, reading a large diff an agent just produced, waiting on a long test run, and reacting to something that failed. A static playlist is indifferent to all of that. It plays the same energetic track while I am carefully reviewing an agent's changes, and the same sleepy one while I am deep in a refactor.

That observation turned into a small idea: what if the editor itself scored the session? Not by watching what I write, but by noticing the *shape* of the activity — how fast edits arrive, how many files they touch, whether something is running, whether I just came back from a failed task — and reshaping the music around that.

The result is [Adaptive Coding Soundtrack](https://github.com/peimengsui/adaptive-coding-soundtrack), a local-first extension for Cursor and VS Code. You start a session, pick **Ambient**, **Jazz**, or **Lo-fi**, and keep working. The status bar tells you what it inferred — something like `♫ Jazz · Deep Focus` — while the music quietly follows along. There is no account, no API key, no network call, and no bundled audio file. Everything you hear is synthesized on the fly inside the editor.

It is also the first project I have built start to finish by vibe coding with Codex, which I will come back to later in this post.

### How It Is Structured

The design goal that shaped everything else was this: **the thing that listens to your editor and the thing that makes sound should never need to know anything about your code.** Once that is a hard constraint, the architecture mostly falls out of it as a one-way pipeline where each stage hands down a smaller, less identifying summary than it received.

![Adaptive Coding Soundtrack architecture](/assets/images/AdaptiveCodingSoundtrackArchitecture.png)

Reading top to bottom:

**ActivityCollector** is the only component that touches editor APIs. It subscribes to ordinary public events — document changes, saves, navigation, task and debug lifecycle, shell-integrated terminal commands, window focus, diagnostic severity counts — and immediately throws away the interesting parts. What survives is a timestamp, an aggregate character count, a process-local document number, and an outcome flag. No text, no paths, no commands, no output.

**Context Engine v2** turns that stream into two separate answers rather than one. The first is *what phase is this?* — Idle, Composing, Executing, Waiting, Reviewing, Completed, or Needs Attention. The second is *who is probably doing it?* — Human, Likely Agent, Mixed, or Unknown. Keeping these apart matters more than I expected. A burst of fast edits is not automatically an agent, and a running test suite is not automatically a human waiting. Each dimension carries its own confidence score, and low-confidence conclusions are simply not allowed to change the music.

**MusicDirector** converts context into musical intent: tempo, energy, density, brightness, harmonic stability, and whether a one-shot cue should fire. It is deliberately a pure function with no editor imports and no audio code, which makes the interesting logic trivial to unit test.

**AdaptiveMusicProvider** resolves that intent into something playable. By default it produces a deterministic procedural recipe — scale, chord progression, swing, humanization, timbre, filter, reverb, and a variation seed. If you have opted into a remote provider and already generated a track for the current style, it returns that cached MP3 instead.

**The Webview player** does the actual sound, scheduling tones and seeded noise with the Web Audio API that already ships inside the editor's Chromium runtime. That is why there is no audio fee and no bundled recording.

The dashed boundary in the diagram is the part I care about most. Everything inside it runs locally with no telemetry and no runtime npm dependencies. The only thing outside it is the optional music API, and it is reachable exactly twice: when you test a key, and when you confirm a paid generation in a modal dialog.

### What It Actually Does

In day-to-day use, the extension is mostly invisible, which is the point. A few behaviors are worth calling out.

**It adapts without restarting.** This was the hardest thing to get right and the difference between "pleasant" and "unusable." Early versions changed tracks whenever context changed, and the constant restarting was far more distracting than silence. Now, when context shifts within a style, the sequence keeps its musical position and morphs its synthesis recipe at the next beat boundary. Only an explicit style change crossfades, and completion cues play on a separate one-shot layer so they never interrupt the background arrangement.

**It is agent-aware without spying on the agent.** Standard editor APIs do not expose another extension's chat or agent lifecycle, and I did not want to scrape Cursor internals to fake it. Instead, the engine infers from shape alone. The default conservative profile needs at least three documents and 300 aggregate changed characters within four seconds before it will say **Likely Agent**; a two-document burst has to be three times larger than that. When an agent burst is followed by navigation, it reports a **Mixed** human-review handoff. The labels are deliberately hedged — "Likely Agent," never a claim of direct knowledge — and if the heuristic annoys you, `Calibrate Agent Awareness` retunes it or turns it off entirely, and `Correct Current Actor` overrides it for ten minutes in memory.

**It explains itself.** Any ambient inference system will eventually be wrong, and the failure mode of an unexplainable one is that you stop trusting it. Hovering the status item, or running `Adaptive Music: Show Current State`, shows the workflow phase, the likely actor, both confidence values, the reasons for the last transition, and the names of the signals that contributed. The same information goes to a content-free output channel.

**It handles terminals carefully.** Short commands deliberately do nothing: no state change, no cue. A command running for at least five seconds can move the session into Waiting and plays one throttled cue when it finishes, with a different cue for failure. Where Cursor does not expose the full shell lifecycle, a coarse terminal-focus signal is still enough to wake a session that auto-paused for inactivity. `Check Terminal Detection` reports which level you are getting.

**Generated audio is opt-in and never automatic.** Version 0.3 added bring-your-own-key adapters for ElevenLabs Music v2, Google Lyria 3 Pro Preview, and Stability's Stable Audio 3. Choosing a provider spends nothing. A cache miss spends nothing and falls back to clearly labeled local audio. Only the explicit `Generate and Cache Current Style` command, behind a modal credit warning, makes a paid request — and the result is cached once per provider, model, style, and duration, then adapted locally with filters and gain for every subsequent context change. Keys live in VS Code Secret Storage, and there is a one-generation-per-day default ceiling so a stray keystroke cannot drain credits.

### What a Session Looks Like

The clearest way to understand the extension is to watch the status bar during an ordinary hour of agent-assisted work. A single Jazz session, from the first keystroke to walking away, reads roughly like this:

```text
♫ Jazz · Human Flow              typing in one file
♫ Jazz · Deep Focus              sustained editing; the sequence opens up and settles
♫ Jazz · Agent Working           a fast edit burst lands across four files
♫ Jazz · Human Review Handoff    clicking through the resulting diff
♫ Jazz · Executing               a test task starts
♫ Jazz · Waiting                 editing pauses while the run continues
♫ Jazz · Completed               one short cue over the arrangement
♫ Jazz · Needs Attention         ...or that, if the run failed instead
♫ Jazz · Idle · Auto-paused      two minutes with nothing happening
```

The important detail is what does *not* happen between those lines. It is one continuous piece of music the whole way down. Nothing restarts, nothing fades out and back in, and the completion cue plays over the arrangement rather than replacing it. Hovering the status item at any point tells you the phase, the likely actor, both confidence numbers, and which signals produced the label.

<!-- TODO: record a short Cursor demo and embed it here.

<video width="720" controls>
  <source src="/assets/videos/AdaptiveCodingSoundtrackDemo.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

-->

### Building It Entirely with Codex

Every line of this extension was written through vibe coding with Codex. I had never shipped a VS Code extension before, and the parts I knew least about — the extension manifest, Webview messaging, the Extension Host test harness, Web Audio scheduling — turned out to be the parts where an agent helped most, because they are well-documented domains where my main cost was unfamiliarity rather than judgment.

A few things made the collaboration work better than my earlier attempts:

I wrote a short release plan before each version and kept it in the repository as `PLAN.md`, rewriting it for every release with an explicit objective, an implemented scope, a manual acceptance checklist, and — the most useful section — an **explicitly out of scope** list. Naming the things I did not want, like telemetry, scraping editor internals, or background paid generation, prevented far more drift than describing the things I did want.

I gave each release its own branch (`codex/0.3.0-ai-providers`, `codex/0.2.1-terminal-continuity`) and kept releases small enough to hold in my head. Six releases across about three and a half weeks, each with its own changelog entry, was much easier to review than one large one would have been.

I leaned on determinism for verification. The core engine takes synthetic event traces and returns contexts, so most of the behavior I cared about is checkable by a fast unit test rather than by listening. That gave the agent a real feedback signal, and a single `npm run verify` chain — clean, lint, unit test, package, validate the VSIX contents — meant the loop could close without me.

The limits showed up where you would expect. Nothing about "does this actually sound good while I work" is testable, and several musically wrong decisions passed every check: an early version restarted the track on every transition, another treated every quick `ls` as a celebration-worthy completion. Those took real listening sessions, not prompts, and the fixes are what most of 0.2.1 and 0.4.0 are about. The privacy boundary also needed me to hold the line more than once, because the shortest path to a feature usually runs straight through the data I had decided not to touch.

### What Comes Next

There are a handful of directions I find genuinely interesting.

The most obvious one is a **real agent lifecycle adapter**. Today's actor inference is a heuristic standing in for information the editor does not expose. The code already defines a content-free `AgentContextAdapter` contract, so if Cursor or VS Code ships a supported public agent API, the engine can consume accurate start, progress, and completion signals without any change to the music logic.

I would also like to make the engine **learn your rhythm locally**. Right now the thresholds are global defaults that you calibrate by hand. A small on-device model of your own editing cadence could replace the manual profiles, as long as the personalization stays entirely on the machine.

On the audio side, the procedural engine is deliberately simple, and I want **richer arrangements and more styles** — something closer to a small generative ensemble, with better voice leading and more interesting harmonic movement over long sessions. Longer-lived or streaming generation is also worth exploring, but only where it can preserve continuity and bounded cost, which today's APIs make awkward.

Smaller items on the list: per-provider cost estimates that reveal nothing about your workspace, an official Suno adapter once its terms and documentation are stable, and a Marketplace release so installing does not require a VSIX.

Longer term, the piece I would most like to test is whether the soundtrack can be **useful rather than only pleasant** — whether a distinct musical signature for "your agent finished and is waiting on you" genuinely shortens the gap between an agent finishing and a human noticing. That is a real and growing dead time in agent-assisted work, and an ambient audio cue is a surprisingly good fit for it, because it reaches you when your eyes are somewhere else.

### Closing Thoughts

This started as a toy, and in many ways it still is. But building it changed how I think about ambient software. The interesting constraint was never the audio synthesis; it was deciding how little the system was allowed to know and then making it useful anyway. Almost every design decision in the project — content-free signals, hedged labels, confidence gating, explainable transitions, opt-in generation — came from taking that constraint seriously rather than from the music.

It also convinced me that vibe coding works best when you supply the taste and the boundaries. Codex wrote the code, and it wrote a lot of it well. What it could not do was sit in a long coding session, notice that the music restarting every ninety seconds was quietly making the tool worse, and decide that continuity mattered more than responsiveness.

The extension is MIT licensed and available on GitHub:

[github.com/peimengsui/adaptive-coding-soundtrack](https://github.com/peimengsui/adaptive-coding-soundtrack)

Feedback, issues, and pull requests are welcome — especially from people who code with music on and have opinions about what the soundtrack should do when the agent takes over.

---
