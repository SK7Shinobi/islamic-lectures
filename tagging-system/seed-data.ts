import type { TaggedLecture } from "./types";

// Sample tagged lectures demonstrating the tagging system, including a
// Fiqh entry with a required Madhhab tag.
export const SEED_LECTURES: TaggedLecture[] = [
  {
    id: "lec-001",
    title: "The Reality of Tawheed",
    scholar: "Example Scholar A",
    youtubeUrl: "https://youtube.com/watch?v=example1",
    tags: {
      coreTopics: ["Aqeedah"],
      subTags: ["Tawheed", "Names & Attributes"],
    },
  },
  {
    id: "lec-002",
    title: "Rulings on Fasting in Ramadan",
    scholar: "Example Scholar B",
    youtubeUrl: "https://youtube.com/watch?v=example2",
    tags: {
      coreTopics: ["Fiqh"],
      subTags: ["Fasting"],
      madhhabTags: ["Shafi'i"],
    },
  },
  {
    id: "lec-003",
    title: "The Battle of Badr: Lessons for Today",
    scholar: "Example Scholar C",
    youtubeUrl: "https://youtube.com/watch?v=example3",
    tags: {
      coreTopics: ["Seerah"],
      subTags: ["Battles", "Meccan Period"],
    },
  },
  {
    id: "lec-004",
    title: "Zakat Across the Four Madhhabs",
    scholar: "Example Scholar D",
    youtubeUrl: "https://youtube.com/watch?v=example4",
    tags: {
      coreTopics: ["Fiqh"],
      subTags: ["Zakat"],
      madhhabTags: ["Hanafi", "Maliki", "Shafi'i", "Hanbali"],
    },
  },
];
