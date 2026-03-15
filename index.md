---
layout: default
title: "Peimeng Sui | Document Anything"
description: "Peimeng Sui — ML Engineer & Personal Blog. Technical writing, AI and recommendation systems, and reflections on music, travel, and more."
image: "/assets/images/avatar.jpg"
---

<p class="profile-photo"><img src="/assets/images/avatar.jpg" alt="Peimeng Sui" width="200"></p>

This is Peimeng Sui. I'm originally from China, and came to the US for undergrad study at UCLA. I'm now living in the US with [my lovely wife](https://mandyxia.com/) and our cat. We also spent two years in Switzerland. I work as a machine learning engineer, passionate about AI applications for positive impact in recommendation systems, search relevance, advertisement, and AR/VR.

**Document Anything** is a space where I want to share various topics, including but not limited to technical learnings, skill shares, music/book/movie reflections, travel highlights, sports, etc.

## Recent posts

{% assign recent_posts = site.posts | where_exp: "post", "post.published != false" %}
{% for post in recent_posts limit:5 %}
- [{{ post.title }}]({{ post.url }})
{% endfor %}
