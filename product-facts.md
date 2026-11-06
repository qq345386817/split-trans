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

Recommendations are currently in English, but users can paste text in any of the 20 supported translation languages. Translation languages: English, Simplified Chinese, Traditional Chinese, Spanish, French, German, Hindi, Indonesian, Vietnamese, Portuguese, Japanese, Korean, Arabic, Italian, Dutch, Polish, Russian, Thai, Turkish, and Ukrainian. Website interfaces: English, 简体中文, 繁體中文, हिन्दी, Indonesia, Tiếng Việt, Português, Français, Deutsch, Español, 日本語, and 한국어.

The base CSV columns are Word, Meaning, Sentence, Translation, Source language, and Target language. Source-based CSV/Anki CSV exports additionally include Publisher, Author, Original URL, License, License URL, and Attribution. Anki export is CSV, not an APKG deck; importing uses Anki's own note fields and scheduling.

## Native apps and release boundary

On iPhone, iPad and Mac, understand a sentence you want to read, save useful words with the original context, and return when they are due. Search your local library, add notes, and export CSV for your own study workflow.

### Understand before memorizing

Paste text, choose a source and target language, and read the whole-sentence translation before exploring individual words. Listen to pronunciation and save a word, phrase or the whole sentence. Individual machine-translated words may have other meanings; compare them with the original sentence rather than treating them as a contextual explanation.

### Keep the original context

Study items retain the source sentence, translation and language pair. Search your local library, filter by words, phrases or sentences, and add personal notes. The app is for English and other supported languages, not only difficult English sentences. Interface languages do not guarantee support for every translation direction.

### Return when items are due

The app uses a lightweight spaced-review plan. Reveal the answer, then give feedback such as Again, Hard, Good or Easy to adjust the next review time. Optional local reminders require notification permission; delivery also depends on system settings. The website has no saved review library or reminders.

### Export a file, not an account

Export a standard CSV or an Anki-compatible CSV from the app's Library. Saved context and notes remain in the file. Import it manually into your chosen workflow; this is not automatic account sync or an APKG deck. Native Anki CSV uses Front and Back, unlike the website's Word and Meaning columns.

### Prepare offline language resources

The native app uses Apple Translation. Offline translation requires a supported source/target pair and installed language packs on the device. Downloading resources and fetching new recommended sentences need internet access. The website uses online Google machine translation instead; its language list does not describe Apple's translation availability.

### Optional sentence explanations

Optional explanations use Apple's system model on iOS 26 or macOS 26 and later, with eligible Apple Intelligence hardware, the feature enabled, and a ready model. Availability varies by device and system language support. This is separate from sentence and word translation and is not offered by the website. Check translations and generated explanations against the original.

Native library CSV includes Kind, Title, Meaning, Source Sentence, Sentence Translation, Notes, Language From, Language To and review metadata. Native Anki CSV contains Front, Back, Source Sentence, Sentence Translation, Notes and Tags. Map those columns to your own Anki note type; importing does not transfer PhraseCut review scheduling. Exports are files, not automatic account sync or a cloud backup service.

The native app and website both offer interest-based dynamic sources. New recommendations need internet access. Fixed native offline practice samples are labeled as samples, not fresh articles. Consult the App Store listing for the version available in your region and on your platform; screenshot version labels identify captured interfaces, not release availability. UI localization and web translation languages do not guarantee Apple's native language-pair or model support.

## Canonical pages

- [Online sentence translator](https://phrase-cut.luopeike.com/study): The working web tool.
- [App and website overview](https://phrase-cut.luopeike.com/): Product overview.
- [Help](https://phrase-cut.luopeike.com/help): Native app help.
- [Privacy](https://phrase-cut.luopeike.com/privacy-policy): Text processing and local storage boundaries.
- [App Store](https://apps.apple.com/app/id6740488386): The native app listing.
