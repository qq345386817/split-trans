#!/usr/bin/env python3
"""Check static Pages URLs, canonical metadata, and internal links."""

import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parent.parent
ORIGIN = "https://phrase-cut.luopeike.com"


def public_url(file):
    path = file.relative_to(ROOT)
    if path.name == "index.html":
        return f"{ORIGIN}/{path.parent.as_posix().strip('.')}{'/' if path.parent != Path('.') else ''}"
    return f"{ORIGIN}/{path.with_suffix('').as_posix()}"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = []
        self.alternates = {}
        self.links = []
        self.og_url = []
        self.json_ld = []
        self.in_json_ld = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs["href"])
        if tag == "link" and attrs.get("rel") == "alternate" and "hreflang" in attrs:
            self.alternates.setdefault(attrs["hreflang"], []).append(attrs["href"])
        if tag == "meta" and attrs.get("property") == "og:url":
            self.og_url.append(attrs["content"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_json_ld = True
        if tag in ("a", "link", "img", "script"):
            self.links.append(attrs.get("href") or attrs.get("src"))
        if tag == "option" and attrs.get("value"):
            self.links.append(attrs["value"])

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_json_ld = False

    def handle_data(self, data):
        if self.in_json_ld:
            self.json_ld.append(json.loads(data))


def local_file(url):
    path = urlsplit(url).path.lstrip("/")
    file = ROOT / path
    if not path or path.endswith("/"):
        return file / "index.html"
    if file.suffix:
        return file
    return file.with_suffix(".html")


def main():
    xml = ElementTree.parse(ROOT / "sitemap.xml")
    urls = [node.text for node in xml.findall(".//{*}loc")]
    pages = sorted(
        file for file in ROOT.rglob("*.html")
        if ".git" not in file.parts and file.name != "404.html"
        and not file.name.startswith("google")
    )
    expected_urls = {public_url(file) for file in pages}
    errors = []
    if len(urls) != len(set(urls)) or set(urls) != expected_urls:
        errors.append(f"sitemap mismatch: missing={expected_urls - set(urls)}, extra={set(urls) - expected_urls}")

    alternates = {}
    for file in pages:
        url = public_url(file)
        page = Page()
        page.feed(file.read_text(encoding="utf-8"))
        if page.canonical != [url] or page.og_url != [url]:
            errors.append(f"{file}: canonical or og:url differs from {url}")
        structured_urls = [item["url"] for item in page.json_ld if "url" in item]
        if not structured_urls or any(item != url for item in structured_urls):
            errors.append(f"{file}: structured data URL differs from {url}")
        if any(len(targets) != 1 or targets[0] not in expected_urls for targets in page.alternates.values()):
            errors.append(f"{file}: invalid hreflang target")
        if page.alternates.get("x-default") != page.alternates.get("en"):
            errors.append(f"{file}: x-default must match English")
        alternates[url] = page.alternates

        for ref in filter(None, page.links):
            resolved = urljoin(url, ref)
            parsed = urlsplit(resolved)
            if parsed.netloc != urlsplit(ORIGIN).netloc:
                continue
            if parsed.path.endswith(".html"):
                errors.append(f"{file}: redirecting HTML link {ref}")
            elif not local_file(resolved).is_file():
                errors.append(f"{file}: broken local link {ref}")

    for url, group in alternates.items():
        for lang, targets in group.items():
            target = targets[0]
            if target in alternates and alternates[target] != group:
                errors.append(f"{url}: hreflang not reciprocal for {lang} ({target})")

    if errors:
        raise SystemExit("\n".join(errors))
    print(f"SEO check passed: {len(pages)} pages, {len(urls)} sitemap URLs")


if __name__ == "__main__":
    main()
