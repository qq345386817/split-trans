# App Interface Examples

These images are the project's actual macOS app screenshots, not HTML mockups
or generated app interfaces. They illustrate the sentence and word-result
layout. Captions identify these as interface previews, not a claim that the
preview version is already publicly available on the App Store.

Source: `macos_screenshots/raw/mac_<locale>_<mode>_learn.png` in the parent app
project, freshly captured from native version 1.4.1 (34) in October 2026.
Each locale has its own real light/dark image. Sample translations are stable
Apple Translation results; no HTML UI or UI-test placeholder meanings are used.
They are converted with `cwebp -q 88 -m 6`, retaining the complete frame and alpha.
Never crop away words, result controls, or source attribution to fit a layout.
Use a picture element with light and dark sources, meaningful localized alt
text, explicit dimensions, lazy loading, and `object-fit: contain`.

Run the parent project's `scripts/sync_website_app_screenshots.mjs` after a
fresh native capture. It rejects images older than the built App and records
dimensions, hashes, capture times and version in `manifest.json`. The site
build verifies these hashes and versions image URLs to avoid stale CDN images.
