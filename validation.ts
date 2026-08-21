import type { LectureTags } from "./types";
import { CORE_TOPICS, MADHHABS, SUB_TAGS_BY_TOPIC } from "./tags";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Enforces the tagging rules from the Advanced Tagging System requirement:
// - at least one recognized core topic
// - sub-tags must belong to one of the lecture's core topics
// - any lecture tagged "Fiqh" must carry at least one Madhhab tag
export function validateLectureTags(tags: LectureTags): ValidationResult {
  const errors: string[] = [];

  if (tags.coreTopics.length === 0) {
    errors.push("At least one core topic is required.");
  }

  for (const topic of tags.coreTopics) {
    if (!CORE_TOPICS.includes(topic)) {
      errors.push(`"${topic}" is not a recognized core topic.`);
    }
  }

  const allowedSubTags = new Set(
    tags.coreTopics.flatMap((topic) => SUB_TAGS_BY_TOPIC[topic] ?? [])
  );
  for (const subTag of tags.subTags) {
    if (!allowedSubTags.has(subTag)) {
      errors.push(
        `Sub-tag "${subTag}" does not belong to any of this lecture's core topics.`
      );
    }
  }

  if (tags.coreTopics.includes("Fiqh")) {
    if (!tags.madhhabTags || tags.madhhabTags.length === 0) {
      errors.push("Fiqh content must carry at least one Madhhab tag.");
    } else {
      for (const madhhab of tags.madhhabTags) {
        if (!MADHHABS.includes(madhhab)) {
          errors.push(`"${madhhab}" is not a recognized Madhhab.`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
