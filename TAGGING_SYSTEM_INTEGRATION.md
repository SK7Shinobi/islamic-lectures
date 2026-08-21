# Tagging System Integration

The `/original-tagging-system/` folder contains your five files exactly as
supplied (`types.ts`, `tags.ts`, `validation.ts`, `seed-data.ts`, `index.ts`,
plus your `README.md`). They're framework-agnostic, so they weren't
runnable directly in a zero-build static app - this doc explains what
changed, and what didn't.

## What did NOT change

- **The canonical lists**: `CORE_TOPICS` (7 topics), `MADHHABS` (4 schools),
  and `SUB_TAGS_BY_TOPIC` are copied verbatim.
- **The validation rules** in `validateLectureTags()`:
  1. at least one core topic is required
  2. every sub-tag must belong to one of the lecture's chosen core topics
  3. any lecture tagged `Fiqh` must carry at least one Madhhab tag
  These three rules, and their exact error messages, are unchanged.
- **The four sample lectures** from `seed-data.ts` (`lec-001`–`lec-004`) -
  same `id`, `title`, `scholar`, `youtubeUrl`, and `tags` - are the first
  four entries in `js/data.js`. Four more demo lectures were added so the
  Curation, Related Lectures, and filtering UI had enough content to
  demonstrate against (see `js/data.js` header comment).

## What changed, and why

| Original | Ported to | Why |
|---|---|---|
| `types.ts` (TypeScript interfaces) | JSDoc comments in `js/tagging-system.js` | No build step runs in this project, so there's nothing to compile `.ts` type annotations with. The shapes they describe (`LectureTags`, `TaggedLecture`) are unchanged - only enforced at runtime instead of compile time. |
| `export const X = ...` | `window.TaggingSystem = { X, ... }` | Without a bundler, ES module `import`/`export` doesn't reliably resolve over `file://` in every browser. A single global namespace keeps the app runnable by double-clicking `index.html`. |
| `validation.ts` logic | `TaggingSystem.validateLectureTags()` | Byte-for-byte the same rules and messages, wrapped in the namespace above. |

## Where it's actually used in the app

- **Curation page** (`#/curation`): the "Add Lecture" tag picker calls
  `validateLectureTags()` on every click and blocks "Add Lecture" until it
  returns `valid: true` - same behavior a form handler would have if wired
  up server-side.
- **Lecture detail page → Manage lecture**: the tag-editor modal runs the
  same validator live as you pick core topics / sub-tags / Madhhabs, and
  disables Save while there are errors.
- **Filters sidebar**: topic and Madhhab checkboxes are generated directly
  from `CORE_TOPICS` and `MADHHABS`, so the filter UI can never drift out
  of sync with the canonical lists.

## Migrating this to the real app scaffold later

Per your original README's integration notes, once the team scaffolds
Next.js + a DB/ORM:

1. Drop `types.ts`, `tags.ts`, `validation.ts`, `seed-data.ts`, `index.ts`
   back in as-is (they were never modified in substance).
2. Replace the two `window.*` globals (`TaggingSystem`, `AppData`) with
   real `import` statements from those files.
3. `CORE_TOPICS` / `MADHHABS` / `SUB_TAGS_BY_TOPIC` become DB enums or
   lookup tables; `validateLectureTags()` moves to run on the API route
   that handles lecture create/update, exactly as the README described.
4. The demo `js/data.js` content (views, curation state, summaries) maps
   almost directly onto whatever `Lecture` DB table you design - it's
   already shaped close to a normalized row per lecture.
