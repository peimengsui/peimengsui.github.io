---
layout: post
title: "Resources to Learn Diffusion Models: From Theory to Practice"
date: 2026-01-25
tags: []
---

## Resources to Learn Diffusion Models: From Theory to Practice
Diffusion models are everywhere today, powering many of the most exciting image and video generation systems. There are plenty of papers, blog posts, and codebases available, but getting started isn’t always straightforward. Personally, I found that reading academic diffusion papers early on can be intimidating without a strong foundation in the underlying math.

Beyond theory, there is also the challenge of turning conceptual understanding into working code and concrete applications. In this post, I share a curated set of learning resources and practical tips based on my own learning path, which helped me build intuition from first principles and eventually complete a small, hands-on project.

---
### Theory and Mathematical Foundations

When I first started learning about diffusion models, I went straight to the foundational academic papers. I quickly found myself getting lost in the details and struggling to identify the common ideas shared across different formulations. Stepping back, I realized that I needed resources operating at a higher level of abstraction—ones that frame diffusion models within the broader context of generative modeling and machine learning.
Below are several resources that I found especially helpful for building a solid mathematical foundation for diffusion models.

#### MIT Course 6.S184: Introduction to Flow Matching and Diffusion Models

Link: https://diffusion.csail.mit.edu/2025/index.html

This is the best course I’ve found so far for building a rigorous mathematical foundation in modern flow-matching and diffusion models for image and video generation. Starting with ODEs and SDEs, the course provides a step-by-step introduction to the core components of these models, including training target construction, optimization procedures, and inference algorithms for simulating both stochastic and deterministic dynamics.

What I especially appreciate is the course's “multi-modal” resources. Peter’s lectures are exceptionally well-organized and clearly delivered, complemented by rigorous written notes that cover all of the mathematical details, as well as hands-on labs that guide you through implementing models from scratch. The 2026 edition has just begun to be released and already includes new material on discrete diffusion and consistency models, reflecting the latest developments in the field. I am very much looking forward to the open release of the lecture videos, as was done for the 2025 edition, and I am grateful to the MIT teaching team for preparing and open-sourcing such a high-quality course for the community.

#### For Chinese Folks

“跟李沐学AI” on Bilibili offers a rich collection of high-quality Chinese-language content, including in-depth paper reviews and hands-on tutorials. Among them, I particularly recommend two paper deep dives related to image and video generation for readers who are just beginning to explore this area. These talks provide a helpful introduction to some of the most influential works at the time and serve as strong motivation to continue learning more deeply.

Beyond generative modeling, the channel also covers many other areas of AI, and I highly encourage readers to explore additional content based on their own interests.

【DALL·E 2（内含扩散模型介绍）【论文精读】】 https://www.bilibili.com/video/BV17r4y1u77B/?share_source=copy_web

【视频生成·上【论文精读·55】】 https://www.bilibili.com/video/BV1VdcxesEAt/?share_source=copy_web

#### Major Publications


---
### From Equations to Code: Hands-on Implementation

---
