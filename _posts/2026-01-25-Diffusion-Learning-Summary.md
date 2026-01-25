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

With a comprehensive understanding of the mathematical foundations, it is always a good idea to read a list of major publications in the field to better understand how the modeling approach evolves from a theoretical idea into a practically viable, popular generative modeling method. Most of the papers are also cited in the MIT Course 6.S184 notes, which you can refer to for a better understanding of the relationships of these major papers and their contributions. 

- [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) DPPM: a diffusion process, which is a Markov chain that gradually adds noise to the data in the opposite direction of sampling until the signal is destroyed.
- [Improved Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2102.09672) IDDPM: improved log-likelihood, cosine noise scheduling
- [Denoising Diffusion Implicit Models](https://arxiv.org/abs/2010.02502) DDIM: Less iterations than DDPM, non-Markovian, same training objectives
- [Flow Matching for Generative Modeling](https://arxiv.org/pdf/2112.10752) Flow Matching: used in many follow-up works, e.g., Stable Diffusion 3, Meta Movie Gen
- [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752) Stable Diffusion: two-stages: Compression with an autoencoder, generative modeling of the latent space. Let generative models focus on the important, semantic parts of the data and train in a lower-dimensional, much more computationally efficient space. More flexible conditional image generators by augmenting their underlying UNet backbone with the cross-attention mechanism.
- [Adding Conditional Control to Text-to-Image Diffusion Models](https://arxiv.org/pdf/2302.05543) ControlNet
- [Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748) Based on Latent Diffusion, UNet -> ViT
variants of standard transformer blocks that incorporate conditioning via adaptive layer norm, cross-attention, and extra input tokens. Adaptive layer norm works best. H-params: patch size, transformer block architecture, model size.
- [Classifier-Free Diffusion Guidance] (https://arxiv.org/abs/2207.12598) Classifier-Free Guidance: jointly train a conditional and an unconditional diffusion model, and we combine the resulting conditional and unconditional score estimates to attain a trade-off between sample quality and diversity.
- [Consistency Models](https://arxiv.org/pdf/2303.01469) self-consistency: points on the same trajectory map to the same initial point.
- [Diffusion Meets Flow Matching: Two Sides of the Same Coin](https://diffusionflow.github.io/) Finally, there is this blog post by Google DeepMind team, trying to demystify some common misunderstandings or confusions about Flow Matching vs Diffusion. This blog post can be a good wrap-up of your learning journey and publications, with a clear summary of related work comparisons. 
---
### From Equations to Code: Hands-on Implementation

---
