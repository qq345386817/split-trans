# PhraseCut

> PhraseCut helps people learn vocabulary from sentences they like. It provides a free online sentence translator and native apps for iPhone, iPad, and Mac.

## Online tool

The website translates a whole sentence and individual words, offers browser pronunciation, and exports selected words to CSV or Anki-compatible CSV. No account is needed. Translation is online Google machine translation from the browser, with a Cloudflare proxy available for network failures. The web endpoint can be rate-limited. Provider refusals are not retried through the proxy. Each analysis accepts up to 400 Unicode characters and 40 words. The website does not save history or maintain a review library. Individual word translations are not contextual AI tutor explanations.

The CSV columns are Word, Meaning, Sentence, Translation, Source language, and Target language. Anki export is CSV, not an APKG deck. Translation languages: English, Simplified Chinese, Traditional Chinese, Spanish, French, German, Hindi, Indonesian, Vietnamese, Portuguese, Japanese, Korean, Arabic, Italian, Dutch, Polish, Russian, Thai, Turkish, and Ukrainian.

## Native apps

The iPhone, iPad, and Mac apps add a local study library, saved words and sentences, spaced repetition, and library exports. They use Apple Translation, which can work offline after the required language packs are downloaded. They are not limited to learning English. The website and native app use different translation engines.

## Canonical pages

- [Online sentence translator](https://phrase-cut.luopeike.com/study): The working web tool.
- [App and website overview](https://phrase-cut.luopeike.com/): Product overview.
- [Help](https://phrase-cut.luopeike.com/help): Native app help.
- [Privacy](https://phrase-cut.luopeike.com/privacy-policy): Text processing and local storage boundaries.
- [App Store](https://apps.apple.com/app/id6740488386): The native app listing.

## Updating content sources

Online suggestions come from Wikipedia's public daily/article APIs, Global Voices RSS, NASA RSS, and Wikivoyage's public API. Topic compatibility differs by provider. Public source pools are refreshed hourly on demand, cached in R2, and can be served with an explicit stale-cache label during outages. Publication dates differ from retrieval dates. Fixed practice samples are not part of online recommendations.

Original author, publisher, article link, publication/update date, and license are displayed above excerpts. Source-based CSV/Anki CSV exports add publisher, author, original URL, license, license URL, and attribution columns. Machine translations are identified as PhraseCut output, not publisher translations. Original and adapted text retain their indicated licenses. Wikinews is not used because it became read-only in May 2026.
