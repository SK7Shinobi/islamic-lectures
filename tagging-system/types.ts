// Core topic categories every lecture is classified under.
export type CoreTopic =
  | "Aqeedah"
  | "Seerah"
  | "Tazkiyah"
  | "Fiqh"
  | "Tafsir"
  | "Hadith"
  | "Islamic History";

// The four Madhhabs. Required on any lecture tagged with the "Fiqh" core topic.
export type Madhhab = "Hanafi" | "Maliki" | "Shafi'i" | "Hanbali";

export interface LectureTags {
  coreTopics: CoreTopic[];
  subTags: string[];
  madhhabTags?: Madhhab[];
}

export interface TaggedLecture {
  id: string;
  title: string;
  scholar: string;
  youtubeUrl: string;
  tags: LectureTags;
}
