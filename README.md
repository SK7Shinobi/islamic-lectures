# Noor Notes — Tiered Islamic Lecture Summary Platform

A local, runnable prototype built from the project brief and wireframes,
with the supplied Advanced Tagging System integrated throughout.

## Run it

No install, no build step, no server required.

**Option A — just open it:** double-click `index.html`. It runs as a
static file directly in your browser.

**Option B — local server** (nicer for testing, avoids any browser's
file:// quirks):

```bash
cd noor-notes
python3 -m http.server 8000
# then open http://localhost:8000
```

Everything is plain HTML/CSS/JS - no npm install, no internet connection
required after the first load (the two Google Fonts are optional; the
page falls back to system serif/sans fonts if they can't load).

## Project structure

```
index.html                        entry point
css/styles.css                    design tokens + all component styles
js/tagging-system.js              ported from your types.ts/tags.ts/validation.ts
js/data.js                        demo lectures, scholars, curation state (builds on your seed-data.ts)
js/i18n.js                        Settings > Language string translations
js/app.js                         router + page rendering + interactions
original-tagging-system/          your five files, unmodified, for reference
docs/TAGGING_SYSTEM_INTEGRATION.md  exactly what changed vs. your files, and why
```

## What's implemented

**Core requirements**
- Tiered summaries (20-second / 2-minute / 10-minute) on every lecture,
  shown as expandable dropdowns rather than tabs.
- Curation workflow: minimum view-count threshold + approved-scholar list,
  with a live "Check Lecture" → APPROVED/REJECTED panel and a Recent
  Curation log.
- Advanced tagging: core topics, granular sub-tags, and Madhhab tags for
  Fiqh content, fully enforced by your `validateLectureTags()` logic in
  both the Curation "Add Lecture" form and the lecture detail page's
  "Manage lecture" tag editor.
- Further Learning section (books, classical texts, courses) on every
  lecture.

**Optional requirements implemented**
- Audience level badges (Beginner / Intermediate / Advanced), filterable.
- Scholar profiles with bio, credentials, and their lecture library.
- Timestamp integration: Deep Dive timestamps link out to
  `youtube.com/...&t=123s`.
- Glossary hover: dotted-underline Arabic/technical terms (e.g. Tawheed,
  nisab, tawakkul) show a definition on hover/focus - toggleable in
  Settings.

**Requested UI changes**
- Same cream/brown color scheme, decluttered layout.
- Section backgrounds alternate (cream → parchment → deeper parchment)
  instead of relying on large white-space gutters.
- Duplicate stats removed (views/duration appear once, in the header row).
- Summary tiers use `<details>` dropdowns instead of tabs.
- Tags are driven end-to-end from the canonical tagging-system lists, so
  the same topic/Madhhab/sub-tag options appear identically in filters,
  the tag editor, and the curation form.
- Settings page has a distinct, visually separated Language section
  (gold left border) from the General settings block.

## Data persistence

Lectures you add via Curation, tag edits, and Settings changes are saved
to the browser's `localStorage`, so they survive a page reload on the
same machine/browser. There's no backend - this is intentionally a
frontend-only prototype for presentation, per the brief ("run locally on
desktop for now").

## QA

`test/smoke-test.js` is a headless-browser test script (Playwright) that
exercises every route and the key interactive flows: filtering, search,
the tag-editor validation, the curation approve/reject workflow, and the
language switch. It's not required to run the app - included in case
you want to verify changes later:

```bash
npm install -g playwright && npx playwright install chromium
python3 -m http.server 8000 &
node test/smoke-test.js
```

## Known simplifications (prototype scope)

- Video playback is a styled placeholder (no real YouTube embed/API
  calls), since the app has no network dependency.
- "Check Lecture" curation rules cover the two stated in the brief
  (approved scholar + view threshold); tag validity is enforced
  separately as a data-integrity gate before a lecture can be added.
- Language translation covers interface chrome (nav, headings, labels);
  lecture summary content stays in its original authored language.
