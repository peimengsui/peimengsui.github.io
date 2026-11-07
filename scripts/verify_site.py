"""Check rendered posts, comments, and locally hosted media before publishing."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.posts = 0
        self.comment_issues = []
        self.assets = []
        self.comment_scripts = 0

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        classes = attrs.get("class", "").split()
        if tag == "article" and "h-entry" in classes:
            self.posts += 1
        if "post-comments" in classes:
            assert attrs.get("data-comments-repository") == "peimengsui/peimengsui.github.io"
            self.comment_issues.append(int(attrs["data-comments-issue"]))
        if tag == "script" and attrs.get("src") == "/js/comments.js":
            self.comment_scripts += 1
        if tag in ("img", "source", "video"):
            for key in ("src", "poster"):
                if attrs.get(key, "").startswith("/"):
                    self.assets.append(attrs[key])


site = Path("_site")
posts = [p for p in Path("_posts").glob("*.md")
         if not re.search(r"(?m)^published:\s*false\s*$", p.read_text().split("---", 2)[1])]
issues = []
rendered = 0
for path in site.rglob("*.html"):
    page = Page()
    page.feed(path.read_text())
    if not page.posts:
        continue
    assert page.posts == 1, path
    assert len(page.comment_issues) == page.comment_scripts == 1, path
    issues.extend(page.comment_issues)
    rendered += 1
    for asset in page.assets:
        assert (site / unquote(urlsplit(asset).path).lstrip("/")).is_file(), (path, asset)

assert rendered == len(posts), (rendered, len(posts))
assert len(set(issues)) == len(issues), "Posts must have separate comment threads"
new_post = site / "2026/11/07/can-predicted-futures-improve-robot-policies/index.html"
html = new_post.read_text()
assert "Implementation details" in html
assert "Can Predicted Futures Improve Robot Policies?" in html
assert "Comparing pixel prediction, latent prediction, and action refinement" in html
assert html.count("<video") == 2
assert html.count("<table") == 2, "Only the two results tables should remain"
assert not re.search(r"\bWeek\s+\d+", html)
assert "https://github.com/peimengsui/eventground-wam" in html
assert not list(site.glob("_drafts/*"))
assert not (site / "scripts").exists()
assert not (site / "2021/03/08/blog-post-title-from-file-name.html").exists()
print(f"Verified {rendered} published posts with unique comments, plus article tables, videos and local media.")
