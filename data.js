/**
 * data.js
 * ------------------------------------------------------------------
 * Demo content for the platform. The four lectures marked
 * "from provided seed-data.ts" carry the exact same id / title /
 * scholar / youtubeUrl / tags as the file you supplied - every other
 * field here (summaries, views, curation state, etc.) is demo data
 * added so the UI has something real to render locally.
 * ------------------------------------------------------------------
 */
(function (global) {
  "use strict";

  const SCHOLARS = [
    {
      id: "sch-001",
      name: "Shaykh Ibrahim Al-Ansari",
      title: "Islamic Studies Teacher & Aqeedah Instructor",
      credentials: [
        "Ijazah in Aqeedah, Madinah Islamic University (fictional demo profile)",
        "10+ years teaching Islamic creed & theology",
      ],
      bio: "Focuses on grounding beginners and students of knowledge in classical Aqeedah, with an emphasis on clear, jargon-free explanations of core creedal texts.",
      approved: true,
    },
    {
      id: "sch-002",
      name: "Dr. Amina Hassan",
      title: "Fiqh Researcher, Comparative Madhhab Studies",
      credentials: [
        "PhD, Comparative Islamic Law (fictional demo profile)",
        "Author of introductory fiqh course material",
      ],
      bio: "Specializes in presenting the four Sunni madhhabs side by side, helping students understand where and why classical jurists differed.",
      approved: true,
    },
    {
      id: "sch-003",
      name: "Ustadh Bilal Rahman",
      title: "Seerah & Islamic History Instructor",
      credentials: [
        "Certified Seerah instructor (fictional demo profile)",
        "Halaqah leader, 8 years",
      ],
      bio: "Teaches the life of the Prophet ﷺ and early Islamic history with a focus on practical lessons for modern life.",
      approved: true,
    },
    {
      id: "sch-004",
      name: "Dr. Khalid Siddiqui",
      title: "Tafsir & Qur'anic Studies",
      credentials: ["PhD, Qur'anic Exegesis (fictional demo profile)"],
      bio: "Delivers thematic tafsir series aimed at students who want depth without needing prior Arabic study.",
      approved: true,
    },
    {
      id: "sch-005",
      name: "Ustadha Maryam Farooqi",
      title: "Tazkiyah & Spiritual Development",
      credentials: ["Certified spiritual development instructor (fictional demo profile)"],
      bio: "Speaks on purification of the heart and practical steps for consistency in worship.",
      approved: false,
    },
  ];

  const CURATION_RULES = {
    minYoutubeViews: 100000,
    requireApprovedScholar: true,
  };

  // Each lecture below carries: id, title, scholar, youtubeUrl, tags
  // (unchanged shape from types.ts / TaggedLecture) plus app-specific
  // fields (views, duration, summaries, furtherLearning, curation...).
  const LECTURES = [
    {
      // from provided seed-data.ts (lec-001)
      id: "lec-001",
      title: "The Reality of Tawheed",
      scholar: "Shaykh Ibrahim Al-Ansari",
      scholarId: "sch-001",
      youtubeUrl: "https://youtube.com/watch?v=example1",
      youtubeId: "example1",
      tags: {
        coreTopics: ["Aqeedah"],
        subTags: ["Tawheed", "Names & Attributes"],
      },
      views: 512442,
      durationSeconds: 3876, // 1:04:36
      publishedDate: "2024-06-12",
      language: "English",
      audienceLevel: "Beginner",
      summaries: {
        tldr20s:
          "Tawheed means recognizing Allah alone as Creator, Sustainer, and the only One deserving worship - it's the foundation every other Islamic teaching builds on.",
        exec2min:
          "This lecture breaks Tawheed into three classical categories: Tawheed ar-Rububiyyah (affirming Allah alone as Creator and Sustainer), Tawheed al-Uluhiyyah (directing all worship to Allah alone), and Tawheed al-Asma was-Sifat (affirming His names and attributes as they've come, without distortion or resemblance to creation). The scholar explains why acknowledging Allah's lordship alone (Rububiyyah) was not enough to make the Makkan disbelievers Muslim - the missing piece was Uluhiyyah, directing worship itself to Him alone. Practical examples are given for how each category shows up in daily life, from dua to reliance on Allah in hardship.",
        deepDive: {
          keyTakeaways: [
            "Tawheed is divided into three classical categories, each addressing a different dimension of belief.",
            "Affirming Allah as Creator (Rububiyyah) alone does not equate to Islam without also worshipping Him alone.",
            "Names & Attributes are affirmed as they appear in text, without asking 'how' and without comparing them to creation.",
            "Everyday acts - dua, hope, fear, reliance - are all forms of worship that belong to Allah alone.",
          ],
          timestamps: [
            { seconds: 95, label: "Why Tawheed is the starting point of the religion" },
            { seconds: 640, label: "Tawheed ar-Rububiyyah explained" },
            { seconds: 1510, label: "Tawheed al-Uluhiyyah and why Quraysh rejected it" },
            { seconds: 2430, label: "Tawheed al-Asma was-Sifat and the middle path" },
            { seconds: 3300, label: "Practical takeaways for daily worship" },
          ],
        },
      },
      furtherLearning: {
        books: [
          { title: "The Three Fundamental Principles", author: "Muhammad ibn Abd al-Wahhab" },
          { title: "Kitab at-Tawheed", author: "Muhammad ibn Abd al-Wahhab" },
        ],
        classicalTexts: [{ title: "Al-Aqidah Al-Wasitiyyah", author: "Ibn Taymiyyah" }],
        courses: [{ title: "Foundations of Aqeedah", provider: "SeekersGuidance" }],
      },
      curation: {
        status: "approved",
        checkedBy: "A. Admin",
        checkedOn: "2026-08-20",
      },
      relatedLectureIds: ["lec-003", "lec-006"],
    },
    {
      // from provided seed-data.ts (lec-002)
      id: "lec-002",
      title: "Rulings on Fasting in Ramadan",
      scholar: "Dr. Amina Hassan",
      scholarId: "sch-002",
      youtubeUrl: "https://youtube.com/watch?v=example2",
      youtubeId: "example2",
      tags: {
        coreTopics: ["Fiqh"],
        subTags: ["Fasting"],
        madhhabTags: ["Shafi'i"],
      },
      views: 284231,
      durationSeconds: 2760, // 46:00
      publishedDate: "2025-02-18",
      language: "English",
      audienceLevel: "Intermediate",
      summaries: {
        tldr20s:
          "A Shafi'i-focused rundown of what breaks a fast, who is exempt, and how to make up missed days - with the underlying principles explained, not just the rulings.",
        exec2min:
          "The lecture walks through the pillars of a valid fast in the Shafi'i school: intention (niyyah) made before Fajr, abstaining from food, drink, and marital relations from dawn to sunset, and the categories of people exempt (the sick, travelers, the elderly, pregnant or nursing women) along with what's owed in each case - qada (make-up days) versus fidyah (compensation). Special attention is given to edge cases that commonly cause confusion, such as accidental eating, using an inhaler, and cupping.",
        deepDive: {
          keyTakeaways: [
            "Niyyah (intention) for an obligatory fast must be made before Fajr each night in the Shafi'i view.",
            "Accidental eating or drinking out of forgetfulness does not break the fast.",
            "Chronic illness and old age warrant fidyah rather than qada, since making up the days isn't expected to become possible.",
            "Pregnant and nursing women may owe qada, fidyah, or both depending on the specific concern - the lecture unpacks each case.",
          ],
          timestamps: [
            { seconds: 60, label: "What makes a fast valid" },
            { seconds: 420, label: "Intention (niyyah) rules" },
            { seconds: 980, label: "Who is exempt, and what they owe" },
            { seconds: 1740, label: "Common edge cases: forgetfulness, medication, cupping" },
            { seconds: 2380, label: "Q&A: travel and fasting" },
          ],
        },
      },
      furtherLearning: {
        books: [{ title: "Reliance of the Traveller (Fasting chapter)", author: "Ahmad ibn Naqib al-Misri" }],
        classicalTexts: [{ title: "Matn Abi Shuja'", author: "Al-Qadi Abu Shuja'" }],
        courses: [{ title: "Fiqh of Fasting", provider: "SeekersGuidance" }],
      },
      curation: {
        status: "approved",
        checkedBy: "A. Admin",
        checkedOn: "2026-08-19",
      },
      relatedLectureIds: ["lec-004", "lec-005"],
    },
    {
      // from provided seed-data.ts (lec-003)
      id: "lec-003",
      title: "The Battle of Badr: Lessons for Today",
      scholar: "Ustadh Bilal Rahman",
      scholarId: "sch-003",
      youtubeUrl: "https://youtube.com/watch?v=example3",
      youtubeId: "example3",
      tags: {
        coreTopics: ["Seerah"],
        subTags: ["Battles", "Meccan Period"],
      },
      views: 245832,
      durationSeconds: 6516, // 1:48:36
      publishedDate: "2024-01-05",
      language: "English",
      audienceLevel: "Beginner",
      summaries: {
        tldr20s:
          "Badr wasn't just a military turning point - it's a case study in trusting Allah's plan while still doing everything within your control.",
        exec2min:
          "The lecture retells the events leading to Badr: the caravan, the Muslims' preparation, the moment of dua before the battle, and the outcome against overwhelming numbers. The scholar draws out recurring lessons - consultation (shura) before the battle, the balance between tawakkul (reliance on Allah) and practical planning, and how the Qur'an frames the victory as a mercy rather than a purely military achievement. The lecture closes by applying these lessons to modern struggles that feel disproportionate.",
        deepDive: {
          keyTakeaways: [
            "Badr is framed as a test of tawakkul alongside practical preparation, not a substitute for it.",
            "Shura (consultation) shaped the decision to advance and meet the Quraysh caravan's escort.",
            "The Qur'an describes the victory as a mercy and a sign, not merely a military outcome.",
            "The lecture applies these lessons to facing modern hardships that feel disproportionately large.",
          ],
          timestamps: [
            { seconds: 80, label: "The caravan and the road to Badr" },
            { seconds: 1450, label: "Shura before the battle" },
            { seconds: 3200, label: "The dua before the fighting began" },
            { seconds: 5100, label: "How the Qur'an frames the victory" },
            { seconds: 6100, label: "Modern lessons from Badr" },
          ],
        },
      },
      furtherLearning: {
        books: [{ title: "The Sealed Nectar", author: "Safiyyur Rahman Al-Mubarakpuri" }],
        classicalTexts: [{ title: "Al-Bidayah wan-Nihayah (Badr chapter)", author: "Ibn Kathir" }],
        courses: [{ title: "Seerah of the Prophet", provider: "SeekersGuidance" }],
      },
      relatedLectureIds: ["lec-001", "lec-007"],
    },
    {
      // from provided seed-data.ts (lec-004)
      id: "lec-004",
      title: "Zakat Across the Four Madhhabs",
      scholar: "Dr. Amina Hassan",
      scholarId: "sch-002",
      youtubeUrl: "https://youtube.com/watch?v=example4",
      youtubeId: "example4",
      tags: {
        coreTopics: ["Fiqh"],
        subTags: ["Zakat"],
        madhhabTags: ["Hanafi", "Maliki", "Shafi'i", "Hanbali"],
      },
      views: 178904,
      durationSeconds: 3120, // 52:00
      publishedDate: "2025-04-02",
      language: "English",
      audienceLevel: "Advanced",
      summaries: {
        tldr20s:
          "A side-by-side look at how the four Sunni madhhabs calculate zakat on gold, business assets, and modern income - same obligation, different mechanics.",
        exec2min:
          "The lecture compares nisab thresholds and calculation methods across the Hanafi, Maliki, Shafi'i, and Hanbali schools, focusing on areas of practical divergence: whether personal-use jewelry is zakatable, how business inventory is valued, and how the Hanafi school's distinct nisab approach for gold and silver compares to the other three. The scholar stresses that these are legitimate differences from independent ijtihad, not contradictions to be alarmed by.",
        deepDive: {
          keyTakeaways: [
            "All four madhhabs agree zakat is 2.5% of qualifying wealth held for a full lunar year, but differ on what counts as 'qualifying'.",
            "The Hanafi school treats personal jewelry as zakatable; the majority of the other three schools generally do not.",
            "Business inventory is valued at current market price in all four schools, but timing conventions differ slightly.",
            "Differences between madhhabs stem from differing methodologies (usul al-fiqh), not from error - understanding this reduces unnecessary anxiety when moving between schools.",
          ],
          timestamps: [
            { seconds: 70, label: "Why the madhhabs differ on zakat mechanics" },
            { seconds: 560, label: "Nisab: Hanafi approach vs. the majority view" },
            { seconds: 1290, label: "Zakat on jewelry across the four schools" },
            { seconds: 2040, label: "Zakat on business assets and inventory" },
            { seconds: 2700, label: "How to choose a school to follow in practice" },
          ],
        },
      },
      furtherLearning: {
        books: [{ title: "Zakat Calculation: A Comparative Fiqh Guide", author: "Introductory demo reading list" }],
        classicalTexts: [{ title: "Al-Mughni (Zakat chapters)", author: "Ibn Qudamah" }],
        courses: [{ title: "Fiqh of Zakat", provider: "AlMaghrib Institute" }],
      },
      curation: {
        status: "approved",
        checkedBy: "A. Admin",
        checkedOn: "2026-08-18",
      },
      relatedLectureIds: ["lec-002", "lec-005"],
    },
    {
      id: "lec-005",
      title: "Fiqh of Salah: A Practical Walkthrough",
      scholar: "Dr. Amina Hassan",
      scholarId: "sch-002",
      youtubeUrl: "https://youtube.com/watch?v=example5",
      youtubeId: "example5",
      tags: {
        coreTopics: ["Fiqh"],
        subTags: ["Salah"],
        madhhabTags: ["Hanafi"],
      },
      views: 84231,
      durationSeconds: 2280, // 38:00
      publishedDate: "2025-09-10",
      language: "English",
      audienceLevel: "Beginner",
      summaries: {
        tldr20s:
          "A step-by-step walkthrough of the five daily prayers from the Hanafi school - conditions, pillars, and what invalidates the prayer.",
        exec2min:
          "This lecture covers the conditions that must be met before praying (purity, covering the awrah, facing the qiblah, entering the prayer time), then walks through the pillars (arkan) of the prayer itself and the difference between fard, wajib, and sunnah elements in the Hanafi school. It closes with a list of common mistakes that can invalidate the prayer and how to correct them.",
        deepDive: {
          keyTakeaways: [
            "Conditions (shurut) must be met before the prayer starts; missing one invalidates the prayer from the outset.",
            "The Hanafi school distinguishes fard, wajib, and sunnah acts within the prayer, each with different rulings if omitted.",
            "A missed wajib can often be corrected with sujud as-sahw (the prostration of forgetfulness).",
            "Common beginner mistakes include rushing the tuma'ninah (stillness) in each position.",
          ],
          timestamps: [
            { seconds: 50, label: "Conditions before you begin praying" },
            { seconds: 480, label: "Pillars of the prayer" },
            { seconds: 1100, label: "Fard vs. wajib vs. sunnah acts" },
            { seconds: 1650, label: "Sujud as-sahw: when and how" },
          ],
        },
      },
      furtherLearning: {
        books: [{ title: "Maraqi al-Falah", author: "Hasan ibn Ammar Ash-Shurunbulali" }],
        classicalTexts: [{ title: "Al-Hidayah (Salah chapters)", author: "Al-Marghinani" }],
        courses: [{ title: "Salah: Foundations", provider: "SeekersGuidance" }],
      },
      curation: {
        status: "rejected",
        checkedBy: "A. Admin",
        checkedOn: "2026-08-21",
        rejectionReason: "Below the 100,000 minimum view threshold.",
      },
      relatedLectureIds: ["lec-002", "lec-004"],
    },
    {
      id: "lec-006",
      title: "Understanding Tawheed: An Introduction to Islamic Monotheism",
      scholar: "Shaykh Ibrahim Al-Ansari",
      scholarId: "sch-001",
      youtubeUrl: "https://youtube.com/watch?v=example6",
      youtubeId: "example6",
      tags: {
        coreTopics: ["Aqeedah"],
        subTags: ["Tawheed", "Afterlife"],
      },
      views: 512442,
      durationSeconds: 2640, // 44:00
      publishedDate: "2024-11-20",
      language: "English",
      audienceLevel: "Beginner",
      summaries: {
        tldr20s:
          "A gentle, jargon-free introduction to what Muslims believe about God - built for someone with no prior background in Islamic theology.",
        exec2min:
          "Aimed squarely at newcomers, this lecture introduces the concept of Tawheed (Islamic monotheism) without assuming any prior vocabulary. It compares the Islamic concept of God to common misconceptions, explains why Islam rejects intermediaries in worship, and briefly touches on the afterlife as the logical consequence of a just, all-powerful Creator. The tone is conversational and welcomes questions rather than assuming agreement.",
        deepDive: {
          keyTakeaways: [
            "Tawheed is introduced as a response to a simple question: who deserves to be worshipped, and why?",
            "Common misconceptions about the Islamic concept of God are addressed directly and respectfully.",
            "The afterlife is framed as a matter of divine justice rather than fear alone.",
            "The lecture ends with an invitation to ask questions rather than a call to immediate conclusions.",
          ],
          timestamps: [
            { seconds: 40, label: "Why start with the concept of God" },
            { seconds: 520, label: "Addressing common misconceptions" },
            { seconds: 1380, label: "Why Islam rejects intermediaries in worship" },
            { seconds: 2100, label: "The afterlife as divine justice" },
          ],
        },
      },
      furtherLearning: {
        books: [{ title: "Being Muslim", author: "Asad Tarsin" }],
        classicalTexts: [],
        courses: [{ title: "Islam 101", provider: "SeekersGuidance" }],
      },
      curation: {
        status: "approved",
        checkedBy: "A. Admin",
        checkedOn: "2026-08-20",
      },
      relatedLectureIds: ["lec-001", "lec-003"],
    },
    {
      id: "lec-007",
      title: "The Meccan Period: How the Companions Endured",
      scholar: "Ustadh Bilal Rahman",
      scholarId: "sch-003",
      youtubeUrl: "https://youtube.com/watch?v=example7",
      youtubeId: "example7",
      tags: {
        coreTopics: ["Seerah", "Tazkiyah"],
        subTags: ["Meccan Period", "Companions", "Patience"],
      },
      views: 132442,
      durationSeconds: 4020, // 1:07:00
      publishedDate: "2025-01-15",
      language: "English",
      audienceLevel: "Intermediate",
      summaries: {
        tldr20s:
          "The thirteen Meccan years weren't a delay before 'real' success - they were where the Companions' patience was built.",
        exec2min:
          "This lecture surveys the persecution faced by early Muslims in Makkah and how the Prophet ﷺ guided the Companions through it - through Surah recitation for steadfastness, gradual community-building, and eventually the two migrations. The scholar connects specific incidents (Bilal's torture, the boycott of the Prophet's clan) to broader principles of patience under hardship that remain relevant for personal trials today.",
        deepDive: {
          keyTakeaways: [
            "The thirteen-year Meccan period built the internal resilience the ummah needed before public power arrived.",
            "Early revelation focused heavily on aqeedah and patience before detailed legislation.",
            "The boycott of Banu Hashim is presented as a model of collective sacrifice for principle.",
            "Modern application: enduring a difficult season doesn't mean it's the wrong season.",
          ],
          timestamps: [
            { seconds: 90, label: "Why Makkah came before Madinah" },
            { seconds: 700, label: "The boycott of Banu Hashim" },
            { seconds: 1900, label: "Bilal (RA) and the meaning of steadfastness" },
            { seconds: 3200, label: "Applying Meccan patience today" },
          ],
        },
      },
      furtherLearning: {
        books: [{ title: "The Sealed Nectar", author: "Safiyyur Rahman Al-Mubarakpuri" }],
        classicalTexts: [{ title: "Al-Bidayah wan-Nihayah", author: "Ibn Kathir" }],
        courses: [{ title: "Seerah of the Prophet", provider: "SeekersGuidance" }],
      },
      curation: {
        status: "approved",
        checkedBy: "A. Admin",
        checkedOn: "2026-08-17",
      },
      relatedLectureIds: ["lec-003", "lec-001"],
    },
    {
      id: "lec-008",
      title: "Reading the Qur'an Thematically: Justice",
      scholar: "Dr. Khalid Siddiqui",
      scholarId: "sch-004",
      youtubeUrl: "https://youtube.com/watch?v=example8",
      youtubeId: "example8",
      tags: {
        coreTopics: ["Tafsir"],
        subTags: ["Thematic Tafsir"],
      },
      views: 61204,
      durationSeconds: 1980,
      publishedDate: "2026-03-02",
      language: "English",
      audienceLevel: "Intermediate",
      summaries: {
        tldr20s:
          "Tracing the theme of justice ('adl) across the Qur'an, from individual conduct to how disputes and governance are addressed.",
        exec2min:
          "Rather than working surah-by-surah, this lecture pulls together verses on justice across the Qur'an, grouping them into personal conduct, family relations, testimony and courts, and governance. The scholar highlights how 'adl is repeatedly commanded even toward those one dislikes, using it as a test of sincerity rather than convenience.",
        deepDive: {
          keyTakeaways: [
            "Thematic tafsir groups verses by topic rather than by surah order.",
            "Justice is commanded even toward those one has personal enmity with.",
            "Testimony and courts receive specific Qur'anic guidance distinct from general ethical commands.",
            "The lecture treats justice as inseparable from sincerity of intention.",
          ],
          timestamps: [
            { seconds: 60, label: "What thematic tafsir is and why use it" },
            { seconds: 520, label: "Justice in personal conduct" },
            { seconds: 1080, label: "Justice in testimony and courts" },
            { seconds: 1650, label: "Justice toward those you dislike" },
          ],
        },
      },
      furtherLearning: {
        books: [{ title: "In the Shade of the Qur'an (selected volumes)", author: "Sayyid Qutb" }],
        classicalTexts: [{ title: "Tafsir Ibn Kathir (selected verses)", author: "Ibn Kathir" }],
        courses: [{ title: "Thematic Tafsir Series", provider: "AlMaghrib Institute" }],
      },
      curation: {
        status: "pending",
        checkedBy: null,
        checkedOn: null,
      },
      relatedLectureIds: ["lec-001", "lec-006"],
    },
  ];

  // Fix lec-003's curation object (kept above only to illustrate the
  // in-progress shape while drafting) with its real, final value.
  LECTURES[2].curation = {
    status: "approved",
    checkedBy: "A. Admin",
    checkedOn: "2026-08-21",
  };

  // Recent curation log - mirrors the "Recent Curation" table in the wireframe.
  const CURATION_LOG = LECTURES.filter((l) => l.curation.status !== "pending")
    .map((l) => ({
      lectureId: l.id,
      title: l.title,
      scholar: l.scholar,
      views: l.views,
      status: l.curation.status,
      checkedOn: l.curation.checkedOn,
    }))
    .sort((a, b) => (a.checkedOn < b.checkedOn ? 1 : -1));

  // Minimal glossary for the hover feature. Terms are matched
  // case-sensitively as whole words in summary text.
  const GLOSSARY = {
    Tawheed: "The Oneness of Allah - the foundational concept of Islamic monotheism.",
    Rububiyyah: "Lordship - Allah's role as sole Creator and Sustainer of everything that exists.",
    Uluhiyyah: "Godship / worship - directing all acts of worship to Allah alone.",
    "niyyah": "Intention - the internal resolve that must accompany an act of worship for it to count.",
    qada: "Making up a missed obligatory act of worship (e.g. a fast or prayer) at a later time.",
    fidyah: "A compensatory payment (often feeding the poor) owed in place of an act of worship one cannot perform.",
    nisab: "The minimum threshold of wealth a person must own before zakat becomes obligatory.",
    tawakkul: "Reliance on Allah, paired with taking the practical means available to you.",
    shura: "Mutual consultation, especially before a decision affecting a group.",
    "sujud as-sahw": "The prostration of forgetfulness, performed to correct certain mistakes in prayer.",
    awrah: "The parts of the body that must be covered during prayer and in front of others.",
    "'adl": "Justice - giving each person and situation exactly what is due.",
  };

  global.AppData = {
    SCHOLARS: SCHOLARS,
    CURATION_RULES: CURATION_RULES,
    LECTURES: LECTURES,
    CURATION_LOG: CURATION_LOG,
    GLOSSARY: GLOSSARY,
  };
})(typeof window !== "undefined" ? window : globalThis);
