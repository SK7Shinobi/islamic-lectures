/**
 * tagging-system.js
 * ------------------------------------------------------------------
 * Direct port of the supplied Advanced Tagging System module:
 *   types.ts, tags.ts, validation.ts, seed-data.ts (base samples)
 *
 * The validation rules and canonical lists below are UNCHANGED from
 * the provided files - only the syntax is converted from TypeScript
 * to plain JS (no build step) so it can run in a static, offline app.
 * See /docs/TAGGING_SYSTEM_INTEGRATION.md for a line-by-line mapping
 * back to the original .ts sources.
 * ------------------------------------------------------------------
 */
(function (global) {
  "use strict";

  // ---- types.ts -----------------------------------------------------
  // CoreTopic: "Aqeedah" | "Seerah" | "Tazkiyah" | "Fiqh" | "Tafsir" |
  //            "Hadith" | "Islamic History"
  // Madhhab:   "Hanafi" | "Maliki" | "Shafi'i" | "Hanbali"
  // LectureTags: { coreTopics: CoreTopic[], subTags: string[], madhhabTags?: Madhhab[] }
  // TaggedLecture: { id, title, scholar, youtubeUrl, tags: LectureTags }

  // ---- tags.ts --------------------------------------------------------
  const CORE_TOPICS = [
    "Aqeedah",
    "Seerah",
    "Tazkiyah",
    "Fiqh",
    "Tafsir",
    "Hadith",
    "Islamic History",
  ];

  const MADHHABS = ["Hanafi", "Maliki", "Shafi'i", "Hanbali"];

  const SUB_TAGS_BY_TOPIC = {
    Aqeedah: ["Tawheed", "Names & Attributes", "Qadr", "Afterlife"],
    Seerah: ["Meccan Period", "Medinan Period", "Companions", "Battles"],
    Tazkiyah: ["Sincerity", "Patience", "Gratitude", "Heart Diseases"],
    Fiqh: ["Salah", "Zakat", "Fasting", "Marriage & Family", "Halal & Haram"],
    Tafsir: ["Surah-specific", "Thematic Tafsir", "Asbab al-Nuzul"],
    Hadith: ["Hadith Terminology", "Hadith Commentary", "Chains of Narration"],
    "Islamic History": ["Rashidun Era", "Ottoman Era", "Al-Andalus"],
  };

  // ---- validation.ts --------------------------------------------------
  /**
   * Enforces the tagging rules from the Advanced Tagging System requirement:
   * - at least one recognized core topic
   * - sub-tags must belong to one of the lecture's core topics
   * - any lecture tagged "Fiqh" must carry at least one Madhhab tag
   * @param {{coreTopics: string[], subTags: string[], madhhabTags?: string[]}} tags
   * @returns {{valid: boolean, errors: string[]}}
   */
  function validateLectureTags(tags) {
    const errors = [];
    const coreTopics = (tags && tags.coreTopics) || [];
    const subTags = (tags && tags.subTags) || [];
    const madhhabTags = tags && tags.madhhabTags;

    if (coreTopics.length === 0) {
      errors.push("At least one core topic is required.");
    }

    for (const topic of coreTopics) {
      if (!CORE_TOPICS.includes(topic)) {
        errors.push('"' + topic + '" is not a recognized core topic.');
      }
    }

    const allowedSubTags = new Set(
      coreTopics.flatMap((topic) => SUB_TAGS_BY_TOPIC[topic] || [])
    );
    for (const subTag of subTags) {
      if (!allowedSubTags.has(subTag)) {
        errors.push(
          'Sub-tag "' +
            subTag +
            '" does not belong to any of this lecture\'s core topics.'
        );
      }
    }

    if (coreTopics.includes("Fiqh")) {
      if (!madhhabTags || madhhabTags.length === 0) {
        errors.push("Fiqh content must carry at least one Madhhab tag.");
      } else {
        for (const madhhab of madhhabTags) {
          if (!MADHHABS.includes(madhhab)) {
            errors.push('"' + madhhab + '" is not a recognized Madhhab.');
          }
        }
      }
    }

    return { valid: errors.length === 0, errors: errors };
  }

  // Public namespace
  global.TaggingSystem = {
    CORE_TOPICS: CORE_TOPICS,
    MADHHABS: MADHHABS,
    SUB_TAGS_BY_TOPIC: SUB_TAGS_BY_TOPIC,
    validateLectureTags: validateLectureTags,
  };
})(typeof window !== "undefined" ? window : globalThis);
