# App Interface Examples

These images are the project's actual macOS app screenshots, not HTML mockups
or generated app interfaces. They illustrate the sentence and word-result
layout; they do not claim to show every control in the latest app release.

Source: `macos_screenshots/raw/mac_<locale>_<mode>_learn.png` in the parent app
project, captured September 2026. Each locale has its own real light/dark image.
They are converted with `cwebp -q 88 -m 6`, retaining the complete frame and alpha.
Never crop away words, result controls, or source attribution to fit a layout.
Use a picture element with light and dark sources, meaningful localized alt
text, explicit dimensions, lazy loading, and `object-fit: contain`.
