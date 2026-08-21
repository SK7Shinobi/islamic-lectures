import type { CoreTopic, Madhhab } from "./types";

// Canonical list of core topics, used for validation and for populating
// filter UI once the app scaffold exists.
export const CORE_TOPICS: CoreTopic[] = [
  "Aqeedah",
  "Seerah",
  "Tazkiyah",
  "Fiqh",
  "Tafsir",
  "Hadith",
  "Islamic History",
];

export const MADHHABS: Madhhab[] = ["Hanafi", "Maliki", "Shafi'i", "Hanbali"];

// Example granular sub-tags per core topic. Not exhaustive — meant as a
// starting taxonomy the team can extend as more lectures are added.
export const SUB_TAGS_BY_TOPIC: Record<CoreTopic, string[]> = {
  Aqeedah: ["Tawheed", "Names & Attributes", "Qadr", "Afterlife"],
  Seerah: ["Meccan Period", "Medinan Period", "Companions", "Battles"],
  Tazkiyah: ["Sincerity", "Patience", "Gratitude", "Heart Diseases"],
  Fiqh: ["Salah", "Zakat", "Fasting", "Marriage & Family", "Halal & Haram"],
  Tafsir: ["Surah-specific", "Thematic Tafsir", "Asbab al-Nuzul"],
  Hadith: ["Hadith Terminology", "Hadith Commentary", "Chains of Narration"],
  "Islamic History": ["Rashidun Era", "Ottoman Era", "Al-Andalus"],
};
