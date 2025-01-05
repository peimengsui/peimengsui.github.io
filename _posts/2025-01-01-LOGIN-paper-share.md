---
layout: post
title: "Paper Share: `LOGIN: A Large Language Model Consulted Graph Neural Network Training Framework`"
date: 2025-01-01
tags: ["Paper Share"]
---

## Paper Share: `LOGIN: A Large Language Model Consulted Graph Neural Network Training Framework`
I start to read papers being published at [WSDM 2025](https://www.wsdm-conference.org/2025/accepted-papers/). Specifically, I am interested in those applying advanced large foundation models in domains such as recommendations and search. 
This share is about a LLM application in Graph Neural Network (GNN) training: [LOGIN: A Large Language Model Consulted Graph Neural Network Training Framework](https://arxiv.org/abs/2405.13902)

---
### Introduction
Graph-structured data commonly exists in many fields, such as social networks, financial transfers, etc. Graph neural networks (GNNs) have become a highly active field in designing different model architectures to adapt to different graph types. Meanwhile, LLMs, as they evolved with emerging capabilities, have demonstrated promising insights in domains in addition to NLP, such as computer vision and recommendation systems. This paper proposes a framework, named LLM cOnsulted GNN traINing (LOGIN), empowering the interactive utilization of LLMs within the GNNs training process. Experiments on six node classification tasks with both homophilic and heterophilic graphs demonstrate the effectiveness and generalizability of LOGIN.

---
### Methodology
#### LLMS-AS-CONSULTANTS PARADIGM
Existing research on integrating LLM with graphs can be categorized into either LLMs-as-Predictors, which harnesses the zero/few-shot capability of LLMs to predict node labels directly, or LLMs-as-Enhancers, which applies instruction/prefix tuning to adapt LLMs specifically for graph tasks. In contrast, this paper introduces a new paradigm, LLMs-as-Consultants, where LLMs provide valuable insights influencing the GNNs learnings.

<img width="638" alt="Screen Shot 2025-01-04 at 4 11 05 PM" src="https://github.com/user-attachments/assets/b40506fb-73f1-44a3-96c7-f1c5dad7a958" />

>**Note:** This paper assumes some standard procedures for Graph data, e.g., nodes are attributed by text, homophily metrics, and GNNs operations, e.g., AGGREGATED and UPDATE. And it focuses on the problem of node classification, formulated as:

$$f_{W|LLM} : (A, \\{s_n\\}_{n \in V}) \to Y.$$

One can refer to Section 4 of the original paper.

#### LOGIN in details

<img width="791" alt="Screen Shot 2025-01-04 at 4 33 50 PM" src="https://github.com/user-attachments/assets/e1052756-fb68-4b1b-916a-3cc46f3a89d3" />


The pipeline of LOGIN can be summarized into 4 steps:
1. Node Selection Based on Uncertainty

Given a graph dataset with an initially trained GNN, a Bayesian estimation of node uncertainty is obtained. Specifically, the GNN is trained with dropout, and each node's predicted score variance during inference is used.

2. Prompt Construction

As shown as a general example in Figure 2 and detailed in Appendix A, the prompt includes instructions explaining the node classification task, the input data including target node, text, two-hop neighborhood descriptions, neighbor labels, and the output format indicator. The output in JSON format is prompted to include the most probable classification outcome along with its explanation.

3. LLM Consultation

LLM consultation is in a zero-shot node-by-node manner, i.e., constructing a single prompt for each uncertain node without classification examples provided.

4. LLM Response Feedback

The LLM predicted pseudo labels and the corresponding explanations are used two ways after comparing against the ground truth labels. 

  a. When LLM is current, append the explanation parsed from the LLM response to its original text and attain the new node embedding.

  b. When LLM is wrong, prune edges based on node similarity scores to denoise the local structure.


After the LLM response feedback stage, LOGIN is set to retrain GNN. This process can be iteratively repeated until the maximum number of iterations is reached or the performance of the GNN has achieved an acceptable level.

---

