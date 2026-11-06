# PhraseCut Website

Static, localized marketing and help pages, plus a browser-based sentence study
workspace at `/study`, `/zh-hans/study`, `/zh-hant/study`, `/hi/study`, `/id/study`,
`/vi/study`, `/pt-br/study`, `/fr/study`, `/de/study`, `/es/study`, `/ja/study`,
and `/ko/study`.

The workspace supports sentence translation, word breakdown, pronunciation,
random recommendations with automatic analysis, and selected-word CSV / Anki
CSV exports. It does not use accounts, cookies, browser storage, or a study
database. Browser voices may need an online connection. Sentence and individual
word translation use the keyless Google web translation implementation from
SafariTranslateSearch, using Google's CORS-enabled translation-client host.
Browser requests go directly to Google. Network failures may use the existing
Worker proxy; Google refusals/rate limits do not trigger proxy retries.
There are no Workers AI calls or paid-provider fallbacks. This differs from the
Apple Translation engine used by the native app, and individual word meanings
are not contextual AI explanations.

Recommendations come from dynamic RSS/API sources and can be filtered by nine
interest topics, source, and sentence length. Supported providers are Wikipedia,
Global Voices, NASA (science/technology), and Wikivoyage (travel). The source
registry is maintained by the companion Worker, with hourly R2 caches under
`apps/Quotes/feeds/`. There are no fixed practice sentences in online responses.
The UI displays author, original article link, source date, and license above
the excerpt. CSV and Anki CSV retain attribution in additional columns. Stale
cached material is explicitly labeled. Publication frequency varies by source.
The API excludes the last recommended ID to avoid immediate repeats. The browser
offers 0.5–1.5x pronunciation and one, three, or five repetitions of the full
sentence. These settings stay in the tab; there is no browser storage. The
native app additionally implements listening-first review and
labeled fixed practice samples as an offline fallback. Native offline translation
requires a supported source/target pair and installed language packs. Optional
sentence explanations additionally require iOS 26/macOS 26 or later, eligible
Apple Intelligence hardware, an enabled feature and a ready model. Local review
reminders need notification permission. Exports are files for manual import,
not automatic account sync. Consult the App Store listing for current release
availability; screenshot version labels describe captured interfaces. Online source
recommendations currently use English; pasted text supports twenty translation
languages. Cache refresh time must not be presented as the publication date.

## Development

```sh
npm ci
npm run build
npm run check
STUDY_API_URL=http://127.0.0.1:8787/study/analyze npm run dev
```

Run the companion Worker from the main app repository's `server/` directory:

```sh
npm ci
npm run dev
```

The local Worker forwards translation requests to Google's web endpoint. It
needs no Google API key or billing account and uses no AI binding. Google may
rate-limit or change this undocumented endpoint; unavailable translations are
reported instead of switching to a paid service. The existing Cloudflare
hosting/request allowance still applies. The production frontend uses
`https://quote.luopeike.com/study/analyze` only as a network-failure fallback.

## Cloudflare Pages deployment

- Build command: `npm run build`
- Output directory: `dist`
- Deploy the companion Worker before publishing the new workspace.

Only public pages and assets are copied into `dist`; dependencies, tests, and
source-generation scripts are excluded. Generated pages are committed so the
existing static deployment can continue to work, but `dist` is the recommended
output directory after adding a package manager build. Never publish
`node_modules` from the repository root.

Edit the localized workspace text in `scripts/study-locales.mjs`, then run
`npm run build`. The generator updates the workspace pages, localized entry
links, web privacy sections, reciprocal hreflang, and sitemap. Canonical URLs
remain extensionless, matching Cloudflare Pages routes.

UI text is separate from translation languages: the twelve localized interfaces
offer twenty translation languages. No user text is placed in public webpage URL parameters,
SEO metadata, or public cache keys.

## Search and AI discovery

`scripts/native-copy.mjs` maintains localized native-app introductions,
home/help SEO fields and six factual answers about context, local study data,
spaced review, CSV exports, supported offline pairs and optional explanations.
Home FAQs, help sections, native JSON-LD and product facts use this source.
Keep it aligned with Fastlane descriptions and the actual app, not unverified
release claims. App Store keyword lists are not copied into meta-keywords.

French, German, Spanish, Japanese and Korean source text lives in
`translations/{fr,de,es,ja,ko}.json`. `extra-locales.mjs` adds those entries to
the existing copy registries. `localized-shell.mjs` generates their base pages;
the normal builder supplies the real workspace, FAQ and shared navigation.
These source JSON files do not enter `dist`. Their native screenshot captions
explicitly identify the English interface preview until localized captures are
available; an English screenshot is never relabeled as a localized native UI.

`scripts/search-copy.mjs` maintains localized tool titles, descriptions,
feature boundaries, and FAQ answers. FAQs are server-rendered HTML and the same
answers generate FAQ JSON-LD. The site does not use meta-keyword stuffing, fake
ratings, or invented App Store prices. FAQ markup does not imply eligibility
for Google's restricted FAQ rich results.

`scripts/source-copy.mjs` maintains the localized, visible source overview and
language-boundary FAQ. Dynamic-source features belong to the web application's
structured data, not the released native app's feature list. Keep release
boundaries in the generated product facts current when a native update ships.

The build also generates a small `llms.txt` navigation aid and `product-facts.md`
from the same product facts and language definitions. They distinguish the
stateless online Google translation tool from the native local study library,
spaced repetition, and offline Apple Translation. These auxiliary files are
readable by agents but excluded from search indexing with `X-Robots-Tag`;
the human HTML pages contain the indexable content. They are not ranking
requirements, robots policies, or a replacement for sitemap/canonical metadata.
See [Google's AI search guidance](https://developers.google.com/search/docs/appearance/ai-features):
crawlable, useful text and structured data matching visible content remain the
foundation; a special AI text file does not guarantee indexing or citations.

The Pages configuration publishes only `dist`. Keep the translation Worker
deployed before releasing the study pages. The 38-URL sitemap includes canonical
extensionless HTML routes, not old `.html` redirects or auxiliary text files.

## Website Design

The homepage and dedicated study route mount `scripts/study-layout.mjs` and
the same `js/study.mjs` engine. Do not introduce a separate fake translator
or a decorative UI mockup on the homepage. Native screenshots are original,
localized, uncropped interface examples, compressed as lightweight WebP.

`design-system/README.md` and `design-system/tokens.json` document the native
brand colors, accessible action colors, typography, spacing, and layout rules.
The build emits `style/theme.css` and content-versioned stylesheet URLs.
Source-only design-system previews never enter the Pages `dist` directory or
the public sitemap. Design draft files are maintained in the parent project's
`design/phrasecut-website/` directory and are not deployment inputs.
