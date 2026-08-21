# Advanced Tagging System

Standalone module for the Advanced Tagging System requirement. It is framework-agnostic on purpose — the app scaffold (Next.js, DB/ORM) hasn't been set up by the team yet, so this can be dropped into whatever structure ends up being scaffolded, or wired into a database schema later.

## Contents

- `types.ts` — `CoreTopic`, `Madhhab`, `LectureTags`, `TaggedLecture` types
- `tags.ts` — canonical lists of core topics, Madhhabs, and sub-tags per topic
- `validation.ts` — `validateLectureTags()`, which enforces:
  - at least one core topic
  - sub-tags must belong to one of the lecture's core topics
  - any lecture tagged `Fiqh` must carry at least one Madhhab tag (Hanafi, Maliki, Shafi'i, Hanbali)
- `seed-data.ts` — sample tagged lectures for testing/demo, including a Fiqh example with Madhhab tags
- `index.ts` — barrel export

## Integration notes

Once the app scaffold and DB/ORM choice are in place:
- `CoreTopic` / `Madhhab` / sub-tag lists can become DB enums or lookup tables
- `validateLectureTags()` can be called on lecture create/update (API route or form handler)
- `SEED_LECTURES` can seed the database or be replaced by fixtures
