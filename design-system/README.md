# PhraseCut

Learn words from sentences you like. Use a working sentence workspace first,
then explain the native app's local library, spaced review, and exports.
Do not position PhraseCut as English-only, an AI tutor, or a full news reader.
Do not invent reviews, user counts, pricing, or translations for marketing.

## Visual Foundations

`tokens.json` is the source of truth. Brand colors `main`, `main-deep`,
`main-soft`, `success`, and `warning` retain the exact native App values from
`DualTranslator/Color+PK.swift`. Neutral surfaces are website refinements.
The website build compiles these tokens into `style/theme.css`.
Use `text` and `muted` on `bg` or `surface-strong`. Use light `main-deep`
with white primary-button text; dark primary buttons use `main` with dark ink.
Do not put small white text on `main`: that original brand pairing misses
the 4.5:1 normal-text threshold. `warning` is an icon color, not body text.

Use system Avenir Next with multilingual system fallbacks. No web font is
downloaded. Use the six Interface text styles, zero letter spacing, four
spacing steps and three radius steps. Tool headings stay compact. Controls
are at least 44px high; all keyboard focus is visible. Respect reduced motion.

## Layout And Icons

Sections are unframed full-width bands with a constrained inner width.
Only actual inputs and individual word tiles have framed surfaces.
Use the existing Lucide sprite for commands and the original App icon for
the brand. Never redraw the book-and-scissors logo or use emoji as icons.
Preserve the original screenshot content and boundaries. WebP compression is
allowed; use contain, not a UI-cropping cover, and never redraw the product UI.

## Inventory And Limitations

13 color tokens in two themes, six text styles, four spacing tokens and three
radius tokens. This is a foundations system, not a React component library;
there is no runtime bundle/global namespace to mount.
Asset import and native design-system checking are not available in this
session. The production website keeps its original logo and Lucide files;
no uploaded asset records or proprietary preview validation are claimed.
The design draft uses a labeled screenshot placeholder for this limitation.

Not synced: the old decorative gradient/shadow variables and fake preview
components are intentionally retired. No downloadable font or React component
bundle is introduced. Existing error-state colors remain in the tool stylesheet.

## Consuming This System

Read this file and `tokens.json`. The production build emits `style/theme.css`
before `style/base.css`. Keep generated CSS synchronized through `npm run build`.
Design drafts install a copy of tokens under `ds/phrasecut/`. Their static
markup is a specification, not another translation engine.
