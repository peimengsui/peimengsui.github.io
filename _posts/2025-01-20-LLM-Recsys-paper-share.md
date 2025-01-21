---
layout: post
title: "Paper Share: LLM Applications in Recommender Systems"
date: 2025-01-20
tags: ["Paper Share"]
---

# Paper Share: LLM Applications in Recommender Systems
## Introduction
LLM is definitely the most actively growing research area in machine learning and artificial intelligence. With surprisingly powerful foundational LLMs available, we have seen their applications during the last couple years, not limited to its original NLP domain. In this paper blog post, I would like to share a few papers being published at [WSDM 2025](https://www.wsdm-conference.org/2025/accepted-papers/) about applications of LLMs in recommender systems. As we will see, there are various inspiring ways to integrate LLMs with its super power of semantic understanding and world knowledge to improve different aspects of recommender systems, such as cold start mitigation, explainability, diversity and conversational recommendations. We will focus on core innovative ideas of each paper, and detailed results can be further referred in the original publications.

## Large Language Model Simulator for Cold-Start Recommendation
The [paper](https://arxiv.org/abs/2402.09176) introduces a LLM simulator framework, which leverages large language models to simulate user interactions for cold items, fundamentally addressing the cold-start problem. To manage the computational complexity scaling to real world recommender systems, it proposes a coupled funnel ColdLLM framework for online recommendation, reducing the number of candidate users from billions to hundreds using a trained coupled filter, allowing the LLM to operate efficiently and effectively on the filtered set.
>NOTE: This paper focuses on the most challenging strict cold-start problem, where the cold items do not have any historical behaviors.

The overall framework is based on behavior simulation and embedding optimization. The behavior simulation employs LLM to analyze all the positive historical behaviors to act as a simulator for generating user sequences for cold items, transforming them into warm items. Then the simulated behaviors are leveraged together with trained user and warm item embeddings for optimizing the cold item embedding.
<img width="773" alt="Screen Shot 2025-01-20 at 8 58 50 PM" src="https://github.com/user-attachments/assets/955d1b15-9547-485d-8f23-e3603b86349d" />

The LLM suffers from heavy computational complexity, unsuitable for billion-scale recommendations. Coupled Funnel ColdLLM is proposed to address it.

 1. **Filtering Simulation.**  Mean pooling is applied to derive the content feature
embedding from LLM for any given cold item. To filter users who are likely to interact with the cold item, the dot product of the mapped user embedding and the mapped item embedding to identify the top-𝐾 highest score candidates is used. It considers both content embeddings and behavioral embeddings. The item/user mapping functions need to be trained to bridge two embedding spaces.  After filtering, the candidate user pool will decrease from billions to tens or hundreds.
 2.  **Refining Simulation** LLMs are employed for examination and enhancement. 
	 a. User-item interaction is judged by constructing a length-L user context, where top L items among all user interacted items are selected based on embedding similarities against the query item.
	 b. Prompt for LLM refinement:
	 “Given the user interacted with [Text(user context)], determine whether the user will interact the [Text(item)] by answering Yes or No.”
	 c. The filtered user set is traversed and only maintain the users that are predicted as “yes” by the LLM simulator.

After obtaining the refined user simulation results, the sequence can be fed into the behavior embedding optimization framework.

Here are some noticeable implementation details:

 - A a Low-Rank finetuning strategy is utilized for the base LLM Simulator training. 
 - When new items are uploaded to the platform, the LLM model simulates user interactions for embedding updates. These simulated user-item pairs are then fed into the online embedding updating structure, updating only the embeddings of the cold items. Finally, the updated cold item embeddings are transmitted to the online recommendation service.

To conclude, in this paper LLM is used as a simulator of user-item interactions applied on cold-start items. Specifically, its power of judgement on user context vs item relevance is leveraged to filter and refine user-item interactions. Both offline and online results provide evidence of its effectiveness especially in the cold-start recommendation scenarios.

## Explainable CTR Prediction via LLM Reasoning
Explainable recommendations provide numerous benefits: building user trust and satisfaction, enhancing persuasiveness, and enabling effective debugging and refinement. Currently, the prevailing approach to explainable recommendation relies on a post-hoc paradigm, where explanations are generated independently of the recommendation model after its predictions are made. Consequently, there is no assurance that the produced explanations accurately reflect the recommender’s internal decision-making process. [The paper](https://arxiv.org/abs/2412.02588)'s method seamlessly integrates LLM-driven explanation generation with the CTR prediction process. This approach simultaneously improves CTR prediction performance and RS interpretability.

It consists of three primary components: (1) Explanation Generation leverages a LLM to produce textual explanations for recommendations. (2) Reward Design utilizes CTR prediction processes to provide quality assessments for the generated explanations that serve as reward signals. (3) Training Paradigm introduces Lora lightweight finetuning techniques along with an iterative training process.
<img width="937" alt="Screen Shot 2025-01-20 at 9 02 13 PM" src="https://github.com/user-attachments/assets/47029c26-ac41-490e-943f-3d5445a7f4df" />

 1. Explanation Generation: design a prompt template to guide the LLM to generate effective. This structured prompt empowers the LLM to effectively utilize its knowledge base to infer more nuanced user preferences from the liked and disliked items and generate rationales for why a user might like or dislike a particular target item. By applying this methodology to all user-item interaction pairs D, we obtain a set of explanations Z, where each explanation Z𝑢,𝑖 ∈ Z corresponds to a specific user-item pair.
 2. Reward Design: leverage a reinforcement learning paradigm to optimize LLM with a well-designed reward function, where PPO algorithm is utilized. The core concept behind our reward function design is to leverage real-world CTR prediction feedback to enhance explanation quality. The reward function is decomposed into two key components: Explanation and LLM-CTR Alignment, and Explanation and ID-CTR Alignment.
	a. Explanation and LLM-CTR Alignment (LC Alignment). The LLM is guided by a prompt template to predict CTR. 
	b. Explanation and ID-CTR Alignment (IC Alignment). A dense textual representation for each generated explanation is obtained by a pre-trained language model (PLM). Subsequently, these textual representations with an original ID-based CTR model architecture, after concatenation and feeding into the existing CTR model. 
 3. Training Paradigm: three stages 1) LC Alignment. This stage persists for
a predetermined number of iterations to accumulate fresh explanations for each user-item pair. 2) CTR Model Training with Textual Features. Accumulated explanations are integrated as textual features with the original ID dataset for training the CTR model. 3) IC Alignment. In the final stage, we further refine the explanation generation model by incorporating the IC alignment reward.

In summary, this paper leverages reinforcement learning to align LLM reasoning with both user preferences and the recommender system’s internal workings and opens up new avenues for future research in explainable recommendations.

## DLCRec: A Novel Approach for Managing Diversity in LLM-Based Recommender Systems
This [paper](https://arxiv.org/abs/2408.12470) designed a framework to enable finegrained control over diversity in LLM-based recommendations. The recommendation task is broken down into three sequential sub-tasks: (1) predicting the genres of future recommendations, (2) filling in the genres, and (3) predicting the future. The three sub-tasks are trained separately and during inference, they are executed in sequence to generate personalized recommendations that match users’ diversity preference. Instruction tuning with Parameter-Efficient FineTuning (PEFT) is employed for each sub-task to enable LLMs to perform specific tasks effectively. The embeddings generated by the fine-tuned LLM are mapped to their nearest neighbors within the real item embeddings encoded by the original LLM, ensuring that the model generates valid items from the datasets.

In the training framework, similar to alpaca’s instruction-tuning format, each sample comprises three essential components: instruction, input and output.  The instruction and input are combined into a prompt and then feed it into the model to generate the output. Detailed prompt templates for each sub-task can be found in the paper.

 - Genre Prediction (GP): The goal is to capture patterns and relationships between items and genres, enabling the model to make informed predictions about which genres are likely to appear in the future recommendation list.
 - Genre Filling (GF): This stage ensures that the model has a clear understanding of the genres that should be represented in the list, allowing it to generate items that align with these genres.
 - Item Prediction (IP): The filled genre placeholders from the Genre Filling task serve as guidance, enabling the model to generate items that achieve the desired genre coverage.
<img width="786" alt="Screen Shot 2025-01-20 at 9 04 23 PM" src="https://github.com/user-attachments/assets/88584a54-c841-46a5-9401-37e10af64844" />

The primary objective of the control framework during inference is to generate recommendation lists that meet varying diversity requirements, where users can specify how many or exactly which genres the lists should contain. 

 - Genre Prediction (GP): By modifying this prompt and using the control number to specify the number of target genres, we can effectively guide the output of GP.
 - Genre Filling (GF): The output of task GF is managed by limiting the target genres in the instruction prompt, which dictates the genres used to fill the future genre tokens.
 - Item Prediction (IP): The output of task IP is governed by modifying the future genres in the input prompt.

During the inference phase, control targets may be unseen or fall outside the distribution of the training data, potentially compromising the model’s ability to generalize to novel controlled recommendation results. To address this challenge and mitigate the sparsity and skewness of diversity signals in the data, two data augmentation methods are tailored for the genre filling and item prediction tasks. First, noise is injected into the training
samples to simulate errors in preceding tasks. Second, the distributions of control numbers are modified to include underrepresented or extreme cases to better handle scenarios that are rarely encountered during training.

Overall, this work presents a promising approach to fine-tuning LLMs for controllable recommendations. However, it will be better to see more comparisons against non-LLM baselines for recommendation diversity metrics.

## Reindex-Then-Adapt: Improving Large Language Models for Conversational Recommendation
Conversational Recommender Systems (CRS) are an emerging recommendation task aiming to suggest relevant and personalized items via interactive dialogues between users and systems. Although  LLMs are potentially adequate to understand complex conversation contexts and address many conversational recommendation scenarios, but they exhibit misalignment with data distributions from target platforms. This [paper](https://arxiv.org/abs/2405.12119) is trying to mitigate the distribution misalignment by proposing a Reindex-Then-Adapt (RTA) framework, which converts multi-token item titles into single tokens within LLMs, and then adjusts the probability distributions over these single-token item titles accordingly. 

There are two major components in the proposed framework:

 1. Reindex: Single-Token Items in LLMs
Tokens sequence corresponding to items being recommended is first identified, then their token embeddings will be aggregated into a new single item token embedding. Many existing model architectures can be used as Aggregator, such as RNN-based, Transformer-based models, or even Weighted Pooling. The Aggregator can be learned via contrastive loss, looping over the training set consisting of query <> item pairs. Query is the contextual embedding of the last position from a LLM, which is originally used to generate the first token of original indexed items. The training corpus is a mixture of conversations and item textual Metadata.
 2. Adapt
 After re-indexing, all the items are represented by single-token embeddings. It makes recommendation as easy as one-step decoding in LLMs, and also enables multiple efficient ways to adjust the recommendation item distributions to adapt towards target platforms or specific data distributions. The paper presents two ways as examples to adapt the logit vectors predicted by the LLM over the items: an affine transformation named as bias term adjustment and a learnable scalar weighting LLM and another Recsys mode predictions, named as Traditional RecSys Gating. The learning of Adapt step uses maximum likelihood type loss, same as traditional Recsys training, and the LLMs parameters are not involved in this step, ensuring an efficient learning process. 
<img width="863" alt="Screen Shot 2025-01-20 at 9 07 06 PM" src="https://github.com/user-attachments/assets/ae8d25c2-2c1e-4561-860f-a3ea4d4fa4ea" />

By combining the strengths of LLMs and traditional RecSys, the RTA framework achieves improved recommendation accuracy metrics across various conversational recommendation datasets and adaptation settings. I feel like the success of LLMs applied to conversational recommendations will highly depend on whether LLMs already have strong abilities to understand the items being recommended. E.g. this paper focuses on movie recommendations only since LLMs already have strong knowledge about movies from their pre-training stage. This may often not be true for specific applications in the industry. However, the framework presented in this paper to adapt LLM predictions better aligned with item popularity being recommended is still relevant and valuable for further explorations in my opinion.

## After Thoughts
It is very exciting to so a wide range of LLM applications in the Recsys domain. The powerful foundational LLMs are good candidates to tackle problems such as
cold start, conversational capabilities, where traditional recommender systems face challenges. However, it becomes important to measure the performance of 
LLM-based vs tranditional recommender systems, and potentially combine them to leverage their own strengths. In order to have impact in the real-world 
industry set up, LLM-based recommender systems also need to improve on its efficiency to justify its value with acceptable costs. 
