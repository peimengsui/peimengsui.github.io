(() => {
  "use strict";

  const section = document.querySelector(".post-comments");
  if (!section) return;
  const repository = section.dataset.commentsRepository;
  const issue = section.dataset.commentsIssue;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository) || !/^[1-9]\d*$/.test(issue)) return;

  const status = section.querySelector(".comments-status");
  const list = section.querySelector(".comments-list");

  async function loadComments() {
    status.hidden = false;
    status.textContent = "Loading comments…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repository}/issues/${issue}/comments?per_page=100`,
        {
          headers: { Accept: "application/vnd.github.text+json" },
          credentials: "omit",
          signal: controller.signal,
        }
      );
      if (!response.ok) throw new Error("Comments unavailable");
      const comments = await response.json();
      if (!Array.isArray(comments)) throw new Error("Invalid response");
      for (const comment of comments) {
        if (!Number.isSafeInteger(comment.id)) continue;
        const card = document.createElement("article");
        card.className = "comment-card";
        const author = document.createElement("strong");
        author.textContent = comment.user?.login || "GitHub user";
        const link = document.createElement("a");
        link.href = `https://github.com/${repository}/issues/${issue}#issuecomment-${comment.id}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        const date = new Date(comment.created_at);
        link.textContent = Number.isNaN(date.valueOf())
          ? "View comment"
          : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
        const meta = document.createElement("p");
        meta.className = "comment-meta";
        meta.append(author, document.createTextNode(" · "), link);
        const body = document.createElement("p");
        body.className = "comment-body";
        // Render visitor content as text, never executable HTML.
        body.textContent = comment.body_text ?? comment.body ?? "";
        card.append(meta, body);
        list.append(card);
      }
      const hasMore = (response.headers.get("Link") || "").includes('rel="next"');
      status.textContent = comments.length === 0
        ? "No comments yet. Be the first to join the discussion."
        : hasMore ? "Showing the first 100 comments. Read the full conversation on GitHub." : "";
      status.hidden = status.textContent === "";
    } catch (_) {
      status.textContent = "Comments are available on GitHub. Use the link above to read or reply.";
    } finally {
      clearTimeout(timeout);
    }
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        loadComments();
      }
    }, { rootMargin: "300px" });
    observer.observe(section);
  } else {
    loadComments();
  }
})();
