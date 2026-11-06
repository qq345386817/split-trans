# App Interface Examples

These images are the project's actual macOS app screenshots, not HTML mockups
or generated app interfaces. They illustrate the sentence and word-result
layout. Captions identify these as interface previews, not a claim that the
preview version is already publicly available on the App Store.

Source: `macos_screenshots/raw/mac_<locale>_<mode>_learn.png` in the parent app
project. The original seven locale sets were captured from native version
1.4.1 (34) in October 2026; additional captures record their own version/build.
Each locale requires its own real light/dark image. Sample translations are stable
Apple Translation results; no HTML UI or UI-test placeholder meanings are used.
They are converted with `cwebp -q 88 -m 6`, retaining the complete frame and alpha.
Never crop away words, result controls, or source attribution to fit a layout.
Use a picture element with light and dark sources, meaningful localized alt
text, explicit dimensions, lazy loading, and `object-fit: contain`.

The twelve website-to-capture locale mappings are:

| Website | Capture filename locale |
| --- | --- |
| en | en_US |
| zh-Hans | zh_Hans |
| zh-Hant | zh_Hant |
| hi | hi |
| id | id |
| vi | vi |
| pt-BR | pt_BR |
| fr | fr_FR |
| de | de_DE |
| es | es_ES |
| ja | ja |
| ko | ko |

After the native capture owner has generated and inspected the new five locale
sets, run from the parent app project:

```sh
LOCALES="fr-FR de-DE es-ES ja ko" node scripts/sync_website_app_screenshots.mjs
node --test scripts/sync_website_app_screenshots.test.mjs
```

`LOCALES` accepts space- or comma-separated native locale IDs, filename IDs such
as `fr_FR`, or website aliases such as `fr`. With no filter, it syncs all twelve
locales (24 images), requiring fresh raw captures for every selected locale.
The default App is `build/native-design/Build/Products/Debug/PhraseCut.app`;
set `DUALTRANSLATOR_MACOS_APP_PATH` to the exact App used for the captures if
different. Both light and dark `learn` captures are required. Do not rebuild
the App between capturing and syncing: images older than its executable fail.

Syncing merges the selected entries into `manifest.json` without modifying
unselected entries or assets. All requested captures are checked and WebP
conversions staged before replacing any images. It records dimensions, hashes,
capture times and per-image `version`/`build`. The top-level version/build stay
as the legacy defaults for older entries without those fields; they are not a
claim that every image depicts the latest App. Captions use each image's version,
and each light/dark pair must share a version and build.

From this website checkout, after syncing the real assets:

```sh
npm run build
npm run check
```

The build preflights all 24 manifest entries and image hashes before writing
generated files, and versions image URLs to avoid stale CDN images. Missing
localized images fail the build; there is no English-image fallback. Inspect
the five localized homepages in both color schemes before publishing `dist`.
