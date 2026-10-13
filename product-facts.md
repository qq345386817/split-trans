# PhraseCut

> Learn words from sentences you like: your own text or English excerpts from updating public sources. The free online tool translates sentences and words, offers listening practice, and exports CSV. Native apps add local saving and spaced repetition.

## Online tool

The website translates a whole sentence and individual words, offers browser pronunciation with adjustable speed and repeats, and exports selected words to CSV or Anki-compatible CSV. No account is needed. Translation is online Google machine translation from the browser, with a Cloudflare proxy available for network failures. The web endpoint can be rate-limited. Provider refusals are not retried through the proxy. Each analysis accepts up to 400 Unicode characters and 40 words. The website does not save history or maintain a review library. Individual word translations are not contextual AI tutor explanations. Available browser voices depend on the user's device; pronunciation is synthesized speech, not a publisher recording.

## Updating content sources

Online suggestions are English-language short excerpts or labeled headlines from Wikipedia's public daily/article APIs, Global Voices RSS, NASA RSS, and Wikivoyage's public API. Users can select interests and sentence length. Topic compatibility differs by provider: NASA covers science and technology, and Wikivoyage covers travel. This is a vocabulary practice tool, not a complete news reader. Fixed practice samples are not part of online recommendations.

Source pools are cached in R2 and refreshed after one hour on demand. A scheduled job also refreshes general source pools every six hours. During outages, previously retrieved content can be served for up to seven days with an explicit stale-cache label. Publication/update dates differ from retrieval dates: dynamically fetched content is not necessarily newly published or from today.

Original publisher, article link, available author and publication/update date, and license are displayed above excerpts. Machine translations are identified as PhraseCut output, not publisher translations. Original and adapted text retain their indicated licenses. Source information is also retained in source-based exports.

Public sources: [Wikipedia](https://en.wikipedia.org/), [Global Voices](https://globalvoices.org/), [NASA](https://www.nasa.gov/rss-feeds/), [Wikivoyage](https://en.wikivoyage.org/).

## Languages and exports

Recommendations are currently in English, but users can paste text in any of the 20 supported translation languages. Translation languages: English, Simplified Chinese, Traditional Chinese, Spanish, French, German, Hindi, Indonesian, Vietnamese, Portuguese, Japanese, Korean, Arabic, Italian, Dutch, Polish, Russian, Thai, Turkish, and Ukrainian. Website interfaces are available in English, Simplified Chinese, Traditional Chinese, Hindi, Indonesian, Vietnamese, and Brazilian Portuguese.

The base CSV columns are Word, Meaning, Sentence, Translation, Source language, and Target language. Source-based CSV/Anki CSV exports additionally include Publisher, Author, Original URL, License, License URL, and Attribution. Anki export is CSV, not an APKG deck; importing uses Anki's own note fields and scheduling.

## Native apps and release boundary

The iPhone, iPad, and Mac apps add a local study library, saved words and sentences, spaced repetition, and library exports. They use Apple Translation, which can work offline after the required language packs are downloaded. They are not limited to learning English. The website and native app use different translation engines.

As of October 13, 2026, interest-based dynamic sources are live on the website and implemented in the native app's development code, but that native update has not been released. Existing installed versions continue to use the legacy quote interface. Do not infer App Store or TestFlight availability from the website feature list.

## Canonical pages

- [Online sentence translator](https://phrase-cut.luopeike.com/study): The working web tool.
- [App and website overview](https://phrase-cut.luopeike.com/): Product overview.
- [Help](https://phrase-cut.luopeike.com/help): Native app help.
- [Privacy](https://phrase-cut.luopeike.com/privacy-policy): Text processing and local storage boundaries.
- [App Store](https://apps.apple.com/app/id6740488386): The native app listing.
