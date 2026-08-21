/**
 * app.js - application shell, router, and all page rendering.
 * No build step, no framework - plain DOM + innerHTML templating so the
 * whole project runs by opening index.html directly in a browser.
 */
(function () {
  "use strict";

  const T = window.TaggingSystem;
  const D = window.AppData;
  const I18N = window.I18N;

  // --------------------------------------------------------------------
  // Persistence helpers
  // --------------------------------------------------------------------
  const STORE_KEY_LECTURES = "itp_lectures_v1";
  const STORE_KEY_CURATION_LOG = "itp_curation_log_v1";
  const STORE_KEY_SETTINGS = "itp_settings_v1";

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* best-effort; app still works without persistence */
    }
  }

  // --------------------------------------------------------------------
  // Application state
  // --------------------------------------------------------------------
  const defaultSettings = {
    language: "en",
    defaultTier: "tldr", // which accordion tier opens by default
    showGlossary: true,
    autoplay: false,
  };

  const state = {
    route: { name: "lectures", params: {} },
    lectures: loadJSON(STORE_KEY_LECTURES, null) || JSON.parse(JSON.stringify(D.LECTURES)),
    curationLog: loadJSON(STORE_KEY_CURATION_LOG, null) || JSON.parse(JSON.stringify(D.CURATION_LOG)),
    settings: Object.assign({}, defaultSettings, loadJSON(STORE_KEY_SETTINGS, {})),
    filters: { search: "", coreTopics: new Set(), madhhabs: new Set(), levels: new Set() },
    modal: null, // { type: 'tagEditor', lectureId }
    lastCheck: null, // in-progress curation check result on the Add Lecture form
  };

  function persistLectures() { saveJSON(STORE_KEY_LECTURES, state.lectures); }
  function persistCurationLog() { saveJSON(STORE_KEY_CURATION_LOG, state.curationLog); }
  function persistSettings() { saveJSON(STORE_KEY_SETTINGS, state.settings); }

  function tr(key) { return I18N.t(key, state.settings.language); }
  function trFmt(key, vars) { return I18N.tFormat(key, state.settings.language, vars); }

  // --------------------------------------------------------------------
  // Small utilities
  // --------------------------------------------------------------------
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function slugTopic(topic) { return topic.replace(/[^A-Za-z]/g, "-"); }

  function formatViews(n) {
    return Number(n).toLocaleString("en-US");
  }

  function formatDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    return m + ":" + String(s).padStart(2, "0");
  }

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function findLecture(id) { return state.lectures.find((l) => l.id === id); }
  function findScholar(id) { return D.SCHOLARS.find((s) => s.id === id); }
  function publicLectures() { return state.lectures.filter((l) => l.curation.status === "approved"); }

  function toast(message) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = starIcon() + " " + esc(message);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  function starIcon() { return '<span class="star8" aria-hidden="true"></span>'; }

  function iconSvg(name) {
    const icons = {
      eye: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
      clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      book: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      scroll: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M9 3H4a1 1 0 0 0-1 1v3a2 2 0 0 0 2 2h1M15 3h5a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2h-1M9 3v14a2 2 0 0 0 2 2M15 3v14a2 2 0 0 1-2 2"/></svg>',
      graduation: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>',
      check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>',
      x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>',
      play: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
      external: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>',
      globe: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>',
      sliders: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>',
      chevron: '<svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
    };
    return icons[name] || "";
  }

  // Wrap the first occurrence of each known glossary term in a text block
  // with a hoverable tooltip span, if the setting is enabled. Matches are
  // found once against the original plain text (longer terms win ties),
  // then the marked-up string is assembled in a single pass - so a term
  // can never be matched again inside another term's own tooltip text.
  function withGlossary(text) {
    if (!state.settings.showGlossary) return esc(text);
    const terms = Object.keys(D.GLOSSARY).sort((a, b) => b.length - a.length);
    const matches = []; // {start, end, term}
    terms.forEach((term) => {
      const escaped = term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const re = new RegExp("(^|[^\\w'-])(" + escaped + ")(?=[^\\w'-]|$)");
      const m = re.exec(text);
      if (!m) return;
      const start = m.index + m[1].length;
      const end = start + m[2].length;
      const overlaps = matches.some((x) => start < x.end && end > x.start);
      if (!overlaps) matches.push({ start: start, end: end, term: term });
    });
    matches.sort((a, b) => a.start - b.start);

    let out = "";
    let cursor = 0;
    matches.forEach((mObj) => {
      out += esc(text.slice(cursor, mObj.start));
      const shown = text.slice(mObj.start, mObj.end);
      out += '<span class="glossary-term" tabindex="0">' + esc(shown) +
        '<span class="tooltip">' + esc(D.GLOSSARY[mObj.term]) + '</span></span>';
      cursor = mObj.end;
    });
    out += esc(text.slice(cursor));
    return out;
  }

  // --------------------------------------------------------------------
  // Router
  // --------------------------------------------------------------------
  function parseHash() {
    const hash = location.hash.replace(/^#\/?/, "");
    const parts = hash.split("/").filter(Boolean);
    if (parts.length === 0) return { name: "lectures", params: {} };
    if (parts[0] === "lecture" && parts[1]) return { name: "lecture-detail", params: { id: parts[1] } };
    if (parts[0] === "scholars" && !parts[1]) return { name: "scholars", params: {} };
    if (parts[0] === "scholar" && parts[1]) return { name: "scholar-detail", params: { id: parts[1] } };
    if (parts[0] === "curation") return { name: "curation", params: {} };
    if (parts[0] === "settings") return { name: "settings", params: {} };
    return { name: "lectures", params: {} };
  }

  function navigate(hash) {
    if (location.hash === hash) { render(); } else { location.hash = hash; }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  window.addEventListener("hashchange", () => {
    state.route = parseHash();
    state.modal = null;
    render();
  });

  // --------------------------------------------------------------------
  // Root render
  // --------------------------------------------------------------------
  const root = document.getElementById("app");

  function render() {
    applyLanguageAttrs();
    root.innerHTML = renderNav() + renderPage() + renderFooter();
    renderModal();
    attachHandlers();
  }

  function applyLanguageAttrs() {
    const lang = state.settings.language;
    const meta = I18N.LANGUAGES.find((l) => l.code === lang) || I18N.LANGUAGES[0];
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", meta.dir);
  }

  // --------------------------------------------------------------------
  // Nav
  // --------------------------------------------------------------------
  function renderNav() {
    const r = state.route.name;
    const isActive = (name) => (r === name || (name === "lectures" && r === "lecture-detail") || (name === "scholars" && r === "scholar-detail")) ? "active" : "";
    return `
    <header class="topnav">
      <div class="container topnav-inner">
        <button class="brand" data-nav="#/lectures" aria-label="Go to Lectures home">
          ${starIcon()} <span>Noor Notes</span>
        </button>
        <nav class="nav-links" aria-label="Primary">
          <button class="nav-link ${isActive("lectures")}" data-nav="#/lectures">${esc(tr("nav_lectures"))}</button>
          <button class="nav-link ${isActive("scholars")}" data-nav="#/scholars">${esc(tr("nav_scholars"))}</button>
          <button class="nav-link ${isActive("curation")}" data-nav="#/curation">${esc(tr("nav_curation"))}</button>
          <button class="nav-link ${r === "settings" ? "active" : ""}" data-nav="#/settings">${esc(tr("nav_settings"))}</button>
        </nav>
        <form class="nav-search" id="nav-search-form" role="search">
          ${iconSvg("search")}
          <input type="search" id="nav-search-input" placeholder="${esc(tr("search_placeholder"))}" value="${esc(state.filters.search)}" aria-label="${esc(tr("search_placeholder"))}">
        </form>
        <button class="nav-avatar" data-nav="#/settings" aria-label="Account settings" title="Settings">A</button>
      </div>
    </header>`;
  }

  function renderFooter() {
    return `<footer class="site-footer container">Noor Notes — a local demo build. Tagging system integration:
      Core topics, Madhhab tags, and validation rules are enforced from the supplied tagging module.</footer>`;
  }

  // --------------------------------------------------------------------
  // Page dispatch
  // --------------------------------------------------------------------
  function renderPage() {
    switch (state.route.name) {
      case "lectures": return renderLecturesPage();
      case "lecture-detail": return renderLectureDetailPage(state.route.params.id);
      case "scholars": return renderScholarsPage();
      case "scholar-detail": return renderScholarDetailPage(state.route.params.id);
      case "curation": return renderCurationPage();
      case "settings": return renderSettingsPage();
      default: return renderLecturesPage();
    }
  }

  // --------------------------------------------------------------------
  // Lectures page
  // --------------------------------------------------------------------
  function lectureMatchesFilters(l) {
    const f = state.filters;
    if (f.search) {
      const q = f.search.toLowerCase();
      const hay = (l.title + " " + l.scholar + " " + l.tags.coreTopics.join(" ") + " " + l.tags.subTags.join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.coreTopics.size && !l.tags.coreTopics.some((t) => f.coreTopics.has(t))) return false;
    if (f.madhhabs.size && !((l.tags.madhhabTags || []).some((m) => f.madhhabs.has(m)))) return false;
    if (f.levels.size && !f.levels.has(l.audienceLevel)) return false;
    return true;
  }

  function renderLecturesPage() {
    const all = publicLectures();
    const filtered = all.filter(lectureMatchesFilters);
    return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">${starIcon()} Noor Notes</span>
        <h1>${esc(tr("lectures_heading"))}</h1>
        <p class="sub">${esc(tr("lectures_sub"))}</p>
      </div>
    </section>
    <section class="section">
      <div class="container lectures-layout">
        ${renderFilterSidebar()}
        <div>
          <div class="flex-between results-count">
            <span>${esc(trFmt("results_count", { n: filtered.length, total: all.length }))}</span>
            ${(state.filters.search || state.filters.coreTopics.size || state.filters.madhhabs.size || state.filters.levels.size)
              ? `<button class="btn btn-ghost btn-sm" data-action="clear-filters">${esc(tr("clear_filters"))}</button>` : ""}
          </div>
          ${filtered.length ? `<div class="lecture-grid">${filtered.map(renderLectureCard).join("")}</div>` : renderEmptyLectures()}
        </div>
      </div>
    </section>`;
  }

  function renderEmptyLectures() {
    return `<div class="empty-state panel">
      ${starIcon()}
      <h3>No lectures match those filters</h3>
      <p>Try clearing a filter or searching a different term.</p>
      <button class="btn btn-secondary btn-sm" data-action="clear-filters">${esc(tr("clear_filters"))}</button>
    </div>`;
  }

  function renderFilterSidebar() {
    const f = state.filters;
    const topicOptions = T.CORE_TOPICS.map((topic) => `
      <label class="filter-option">
        <input type="checkbox" data-filter="coreTopics" value="${esc(topic)}" ${f.coreTopics.has(topic) ? "checked" : ""}>
        ${esc(topic)}
      </label>`).join("");
    const madhhabOptions = T.MADHHABS.map((m) => `
      <label class="filter-option">
        <input type="checkbox" data-filter="madhhabs" value="${esc(m)}" ${f.madhhabs.has(m) ? "checked" : ""}>
        ${esc(m)}
      </label>`).join("");
    const levels = ["Beginner", "Intermediate", "Advanced"];
    const levelOptions = levels.map((lv) => `
      <label class="filter-option">
        <input type="checkbox" data-filter="levels" value="${esc(lv)}" ${f.levels.has(lv) ? "checked" : ""}>
        ${esc(lv)}
      </label>`).join("");
    return `
    <aside class="panel on-alt" aria-label="${esc(tr("filters"))}">
      <h3 class="mt-0">${iconSvg("sliders")} ${esc(tr("filters"))}</h3>
      <div class="filter-group">
        <h4>${esc(tr("core_topic"))}</h4>
        ${topicOptions}
      </div>
      <div class="filter-group">
        <h4>${esc(tr("madhhab"))}</h4>
        ${madhhabOptions}
      </div>
      <div class="filter-group">
        <h4>${esc(tr("audience_level"))}</h4>
        ${levelOptions}
      </div>
    </aside>`;
  }

  function renderLectureCard(l) {
    const topic = l.tags.coreTopics[0] || "Aqeedah";
    return `
    <button class="lecture-card" data-nav="#/lecture/${esc(l.id)}" aria-label="Open ${esc(l.title)}">
      <div class="lecture-thumb thumb-${slugTopic(topic)}">
        ${starIcon()}
        <span class="duration-pill">${formatDuration(l.durationSeconds)}</span>
      </div>
      <div class="lecture-body">
        <h3>${esc(l.title)}</h3>
        <div class="lecture-scholar">${esc(l.scholar)}</div>
        <div class="chip-row">
          ${l.tags.coreTopics.map((t) => `<span class="chip chip-topic">${esc(t)}</span>`).join("")}
          ${(l.tags.madhhabTags || []).slice(0, 1).map((m) => `<span class="chip chip-madhhab">${esc(m)}</span>`).join("")}
        </div>
        <div class="lecture-meta">
          <span>${iconSvg("eye")} ${formatViews(l.views)}</span>
          <span class="badge badge-level">${esc(l.audienceLevel)}</span>
        </div>
      </div>
    </button>`;
  }

  // --------------------------------------------------------------------
  // Lecture detail page
  // --------------------------------------------------------------------
  function renderLectureDetailPage(id) {
    const l = findLecture(id);
    if (!l) return `<div class="container section"><div class="empty-state panel">${starIcon()}<h3>Lecture not found</h3><a href="#/lectures">${esc(tr("nav_lectures"))}</a></div></div>`;
    const topic = l.tags.coreTopics[0] || "Aqeedah";
    const dd = l.summaries.deepDive;

    return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow"><a href="#/lectures" data-nav="#/lectures" style="color:inherit">${esc(tr("nav_lectures"))}</a> / ${esc(l.tags.coreTopics.join(", "))}</span>
        <h1>${esc(l.title)}</h1>
        <div class="hero-meta-row">
          <span><button class="btn-ghost" style="background:none;border:none;padding:0;cursor:pointer;color:var(--accent);font-weight:700" data-nav="#/scholar/${esc(l.scholarId)}">${esc(l.scholar)}</button></span>
          <span>${iconSvg("eye")} ${formatViews(l.views)} views</span>
          <span>${iconSvg("clock")} ${formatDuration(l.durationSeconds)}</span>
          <span class="badge badge-level">${esc(l.audienceLevel)}</span>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container detail-layout">
        <div>
          <div class="video-frame thumb-${slugTopic(topic)}">
            <button class="play-btn" aria-label="Play (demo placeholder)">${iconSvg("play")}</button>
            <a class="yt-link" href="${esc(l.youtubeUrl)}" target="_blank" rel="noopener">${iconSvg("external")} ${esc(tr("view_on_youtube"))}</a>
          </div>

          <div class="summary-accordion">
            <details ${state.settings.defaultTier === "tldr" ? "open" : ""}>
              <summary><span><span class="tier-tag">20s</span>${esc(tr("tldr"))}</span>${iconSvg("chevron")}</summary>
              <div class="accordion-body"><p>${withGlossary(l.summaries.tldr20s)}</p></div>
            </details>
            <details ${state.settings.defaultTier === "exec" ? "open" : ""}>
              <summary><span><span class="tier-tag">2m</span>${esc(tr("exec_summary"))}</span>${iconSvg("chevron")}</summary>
              <div class="accordion-body"><p>${withGlossary(l.summaries.exec2min)}</p></div>
            </details>
            <details ${state.settings.defaultTier === "deep" ? "open" : ""}>
              <summary><span><span class="tier-tag">10m</span>${esc(tr("deep_dive"))}</span>${iconSvg("chevron")}</summary>
              <div class="accordion-body">
                ${dd ? `
                <strong>Key takeaways</strong>
                <ul>${dd.keyTakeaways.map((k) => `<li>${withGlossary(k)}</li>`).join("")}</ul>
                <strong>Timestamps</strong>
                <ul class="timestamp-list">
                  ${dd.timestamps.map((t) => `<li><a class="ts-time" href="${esc(l.youtubeUrl)}${l.youtubeUrl.includes("?") ? "&" : "?"}t=${t.seconds}s" target="_blank" rel="noopener">${formatDuration(t.seconds)}</a> ${esc(t.label)}</li>`).join("")}
                </ul>` : `<p class="text-soft">No deep-dive notes yet for this lecture.</p>`}
              </div>
            </details>
          </div>

          <div class="divider-ornament">${starIcon()}</div>

          <h2>${esc(tr("further_learning"))}</h2>
          <div class="further-learning-grid">
            ${renderFurtherLearningCard(iconSvg("book"), tr("books"), l.furtherLearning.books, (b) => b.title, (b) => b.author)}
            ${renderFurtherLearningCard(iconSvg("scroll"), tr("classical_texts"), l.furtherLearning.classicalTexts, (b) => b.title, (b) => b.author)}
            ${renderFurtherLearningCard(iconSvg("graduation"), tr("courses"), l.furtherLearning.courses, (c) => c.title, (c) => c.provider)}
          </div>

          ${renderRelatedLectures(l)}
        </div>

        <aside class="sidebar-stack">
          <div class="panel on-alt">
            <h3 class="mt-0">${esc(tr("curation_status"))}</h3>
            ${renderStatusBlock(l.curation)}
          </div>
          <div class="panel on-alt">
            <h3 class="mt-0">${esc(tr("lecture_info"))}</h3>
            <div class="info-row"><span class="label">YouTube ID</span><span class="value">${esc(l.youtubeId)}</span></div>
            <div class="info-row"><span class="label">Duration</span><span class="value">${formatDuration(l.durationSeconds)}</span></div>
            <div class="info-row"><span class="label">Language</span><span class="value">${esc(l.language)}</span></div>
            <div class="info-row"><span class="label">Published</span><span class="value">${formatDate(l.publishedDate)}</span></div>
          </div>
          <div class="panel on-alt">
            <div class="flex-between mt-0" style="margin-bottom:10px">
              <h3 class="mt-0" style="margin-bottom:0">${esc(tr("tags"))}</h3>
              <button class="btn btn-ghost btn-sm" data-action="edit-tags" data-id="${esc(l.id)}">+ Edit</button>
            </div>
            <div class="chip-row">
              ${l.tags.coreTopics.map((t) => `<span class="chip chip-topic">${esc(t)}</span>`).join("")}
              ${(l.tags.madhhabTags || []).map((m) => `<span class="chip chip-madhhab">${esc(m)}</span>`).join("")}
              ${l.tags.subTags.map((s) => `<span class="chip chip-sub">${esc(s)}</span>`).join("")}
            </div>
          </div>
          <div class="panel on-alt">
            <h3 class="mt-0">${esc(tr("actions"))}</h3>
            <div style="display:flex;flex-direction:column;gap:8px">
              <a class="btn btn-secondary" href="${esc(l.youtubeUrl)}" target="_blank" rel="noopener">${iconSvg("external")} ${esc(tr("view_on_youtube"))}</a>
              <button class="btn btn-primary" data-action="edit-tags" data-id="${esc(l.id)}">${esc(tr("manage_lecture"))}</button>
            </div>
          </div>
        </aside>
      </div>
    </section>`;
  }

  function renderStatusBlock(curation) {
    if (curation.status === "approved") {
      return `<div class="status-block approved"><span>${iconSvg("check")}</span><div><strong>Approved</strong><p>This lecture meets the current curation criteria.</p></div></div>`;
    }
    if (curation.status === "rejected") {
      return `<div class="status-block rejected"><span>${iconSvg("x")}</span><div><strong>Rejected</strong><p>${esc(curation.rejectionReason || "Does not meet curation criteria.")}</p></div></div>`;
    }
    return `<div class="status-block pending"><span>${iconSvg("clock")}</span><div><strong>Pending review</strong><p>Awaiting a curation check.</p></div></div>`;
  }

  function renderFurtherLearningCard(icon, title, items, primary, secondary) {
    return `<div class="fl-card">
      <h4>${icon} ${esc(title)}</h4>
      ${items && items.length ? `<ul>${items.map((it) => `<li>${esc(primary(it))}<span class="fl-author">${esc(secondary(it))}</span></li>`).join("")}</ul>`
        : `<p class="empty">None recommended yet.</p>`}
    </div>`;
  }

  function renderRelatedLectures(l) {
    const related = (l.relatedLectureIds || []).map(findLecture).filter((r) => r && r.curation.status === "approved");
    if (!related.length) return "";
    return `<h2>${esc(tr("related_lectures"))}</h2><div class="related-grid">${related.map(renderLectureCard).join("")}</div>`;
  }

  // --------------------------------------------------------------------
  // Scholars pages
  // --------------------------------------------------------------------
  function initials(name) { return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join(""); }
  function scholarColor(id) {
    const palette = ["#0e6b57", "#3b2a1c", "#ad7f3b", "#6b4326", "#274a45"];
    let sum = 0; for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    return palette[sum % palette.length];
  }

  function renderScholarsPage() {
    const scholars = D.SCHOLARS.filter((s) => s.approved);
    return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">${starIcon()} Noor Notes</span>
        <h1>${esc(tr("scholars_heading"))}</h1>
        <p class="sub">${esc(tr("scholars_sub"))}</p>
      </div>
    </section>
    <section class="section container">
      <div class="scholar-grid">
        ${scholars.map((s) => {
          const count = publicLectures().filter((l) => l.scholarId === s.id).length;
          return `
          <button class="scholar-card" data-nav="#/scholar/${esc(s.id)}">
            <div class="scholar-avatar" style="background:${scholarColor(s.id)}">${esc(initials(s.name))}</div>
            <h3>${esc(s.name)}</h3>
            <div class="scholar-title">${esc(s.title)}</div>
            <div class="scholar-count">${count} lecture${count === 1 ? "" : "s"}</div>
          </button>`;
        }).join("")}
      </div>
    </section>`;
  }

  function renderScholarDetailPage(id) {
    const s = findScholar(id);
    if (!s) return `<div class="container section"><div class="empty-state panel">${starIcon()}<h3>Scholar not found</h3></div></div>`;
    const lectures = publicLectures().filter((l) => l.scholarId === s.id);
    return `
    <section class="page-hero">
      <div class="container scholar-hero">
        <div class="scholar-avatar" style="background:${scholarColor(s.id)}">${esc(initials(s.name))}</div>
        <div>
          <span class="eyebrow"><a href="#/scholars" data-nav="#/scholars" style="color:inherit">${esc(tr("nav_scholars"))}</a></span>
          <h1>${esc(s.name)}</h1>
          <p class="sub">${esc(s.title)}</p>
          <ul class="credentials">${s.credentials.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
    <section class="section container">
      <p style="max-width:70ch">${esc(s.bio)}</p>
      <div class="divider-ornament">${starIcon()}</div>
      <h2>${lectures.length} lecture${lectures.length === 1 ? "" : "s"} on the platform</h2>
      ${lectures.length ? `<div class="lecture-grid">${lectures.map(renderLectureCard).join("")}</div>` : `<p class="text-soft">No published lectures yet.</p>`}
    </section>`;
  }

  // --------------------------------------------------------------------
  // Curation page
  // --------------------------------------------------------------------
  function renderCurationPage() {
    const rules = D.CURATION_RULES;
    const check = state.lastCheck;
    return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">${starIcon()} Noor Notes</span>
        <h1>${esc(tr("curation_heading"))}</h1>
        <p class="sub">${esc(tr("curation_sub"))}</p>
      </div>
    </section>
    <section class="section container">
      <div class="panel on-alt" style="margin-bottom:18px">
        <div class="panel-title"><h3>${esc(tr("curation_rules"))}</h3></div>
        <div class="rule-row"><span><span class="icon">${iconSvg("eye")}</span>Minimum YouTube views</span><strong>${formatViews(rules.minYoutubeViews)}</strong></div>
        <div class="rule-row"><span><span class="icon">${starIcon()}</span>Scholar must be on the approved scholar list</span><strong>Enforced</strong></div>
        <div class="rule-row"><span><span class="icon">${iconSvg("check")}</span>Tags must pass the tagging-system validator</span><strong>Enforced</strong></div>
      </div>

      <div class="curation-grid">
        <div class="panel">
          <div class="panel-title"><h3>${esc(tr("add_lecture"))}</h3></div>
          <form id="curation-form">
            <div class="field">
              <label for="cf-url">YouTube URL</label>
              <input id="cf-url" name="url" type="text" placeholder="https://youtube.com/watch?v=...">
            </div>
            <div class="field">
              <label for="cf-title">Title</label>
              <input id="cf-title" name="title" type="text" required>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="cf-scholar">Scholar / Speaker name</label>
                <input id="cf-scholar" name="scholar" type="text" list="scholar-list" required>
                <datalist id="scholar-list">${D.SCHOLARS.map((s) => `<option value="${esc(s.name)}">`).join("")}</datalist>
                <div class="hint">Must match an approved scholar exactly to pass curation.</div>
              </div>
              <div class="field">
                <label for="cf-views">YouTube views</label>
                <input id="cf-views" name="views" type="number" min="0" required>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="cf-duration">Duration (mm:ss)</label>
                <input id="cf-duration" name="duration" type="text" placeholder="45:00" required>
              </div>
              <div class="field">
                <label for="cf-level">Audience level</label>
                <select id="cf-level" name="level">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label>${esc(tr("core_topic"))}</label>
              <div class="tag-picker-options" id="cf-core-topics">
                ${T.CORE_TOPICS.map((t) => `<button type="button" class="tag-pick" data-pick="core" data-value="${esc(t)}">${esc(t)}</button>`).join("")}
              </div>
            </div>
            <div class="field">
              <label>Sub-tags</label>
              <div class="tag-picker-options" id="cf-sub-tags"><span class="hint">Choose a core topic first.</span></div>
            </div>
            <div class="field hidden" id="cf-madhhab-field">
              <label>${esc(tr("madhhab"))} <span class="hint">(required for Fiqh)</span></label>
              <div class="tag-picker-options" id="cf-madhhabs">
                ${T.MADHHABS.map((m) => `<button type="button" class="tag-pick madhhab-pick" data-pick="madhhab" data-value="${esc(m)}">${esc(m)}</button>`).join("")}
              </div>
            </div>
            <div id="cf-tag-errors"></div>

            <div style="display:flex;gap:10px;margin-top:6px">
              <button type="button" class="btn btn-secondary" id="cf-check-btn">${esc(tr("check_lecture"))}</button>
              <button type="submit" class="btn btn-primary" id="cf-add-btn" disabled>${esc(tr("add_lecture"))}</button>
            </div>
          </form>
          <div id="cf-check-result">${check ? renderCheckResult(check) : ""}</div>
        </div>

        <div class="panel">
          <div class="panel-title"><h3>${esc(tr("recent_curation"))}</h3></div>
          ${renderCurationTable()}
        </div>
      </div>
    </section>`;
  }

  function renderCheckResult(check) {
    const cls = check.approved ? "pass" : "fail";
    return `<div class="check-result ${cls}">
      <strong>${check.approved ? "APPROVED" : "REJECTED"}</strong>
      <div class="check-row">${check.scholarApproved ? iconSvg("check") : iconSvg("x")} Scholar is on the approved list</div>
      <div class="check-row">${check.viewsOk ? iconSvg("check") : iconSvg("x")} Meets the ${formatViews(D.CURATION_RULES.minYoutubeViews)} view threshold (${formatViews(check.views)})</div>
      <p style="margin:8px 0 0;font-size:0.82rem">${check.approved ? "This lecture meets the current curation criteria." : "This lecture will be logged as rejected and kept out of the public listing."}</p>
    </div>`;
  }

  function renderCurationTable() {
    const rows = state.curationLog.slice(0, 12);
    if (!rows.length) return `<p class="text-soft">No curation activity yet.</p>`;
    return `<table class="curation-table">
      <thead><tr><th>Lecture</th><th>Scholar</th><th>Views</th><th>Status</th><th>Checked</th></tr></thead>
      <tbody>
        ${rows.map((r) => `
        <tr class="clickable" data-nav="#/lecture/${esc(r.lectureId)}">
          <td>${esc(r.title)}</td>
          <td>${esc(r.scholar)}</td>
          <td>${formatViews(r.views)}</td>
          <td><span class="badge badge-${r.status}">${esc(r.status)}</span></td>
          <td>${formatDate(r.checkedOn)}</td>
        </tr>`).join("")}
      </tbody>
    </table>`;
  }

  // --------------------------------------------------------------------
  // Settings page
  // --------------------------------------------------------------------
  function renderSettingsPage() {
    const s = state.settings;
    return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">${starIcon()} Noor Notes</span>
        <h1>${esc(tr("settings_heading"))}</h1>
      </div>
    </section>
    <section class="section container">
      <div class="settings-grid">
        <div class="settings-section general">
          <h3>${iconSvg("sliders")} ${esc(tr("settings_general"))}</h3>
          <div class="setting-row">
            <div>
              <div>Default summary tier</div>
              <div class="desc">Which summary opens automatically on a lecture page.</div>
            </div>
            <select id="set-default-tier">
              <option value="tldr" ${s.defaultTier === "tldr" ? "selected" : ""}>20-Second TL;DR</option>
              <option value="exec" ${s.defaultTier === "exec" ? "selected" : ""}>2-Minute Summary</option>
              <option value="deep" ${s.defaultTier === "deep" ? "selected" : ""}>10-Minute Deep Dive</option>
            </select>
          </div>
          <div class="setting-row">
            <div>
              <div>Glossary hover definitions</div>
              <div class="desc">Show a quick translation when hovering an Arabic term.</div>
            </div>
            <label class="toggle"><input type="checkbox" id="set-glossary" ${s.showGlossary ? "checked" : ""}><span class="track"></span></label>
          </div>
          <div class="setting-row">
            <div>
              <div>Autoplay video</div>
              <div class="desc">Start playback automatically when opening a lecture.</div>
            </div>
            <label class="toggle"><input type="checkbox" id="set-autoplay" ${s.autoplay ? "checked" : ""}><span class="track"></span></label>
          </div>
        </div>

        <div class="settings-section language">
          <h3>${iconSvg("globe")} ${esc(tr("settings_language"))}</h3>
          <div class="setting-row">
            <div>
              <div>Interface language</div>
              <div class="desc">Translates navigation and page labels. Lecture content stays in its original language.</div>
            </div>
            <select id="set-language">
              ${I18N.LANGUAGES.map((l) => `<option value="${l.code}" ${s.language === l.code ? "selected" : ""}>${esc(l.label)}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>
    </section>`;
  }

  // --------------------------------------------------------------------
  // Tag editor modal
  // --------------------------------------------------------------------
  function renderModal() {
    let overlay = document.getElementById("modal-root");
    if (overlay) overlay.remove();
    if (!state.modal) return;

    if (state.modal.type === "tagEditor") {
      const l = findLecture(state.modal.lectureId);
      if (!l) { state.modal = null; return; }
      const draft = state.modal.draft;
      const errors = T.validateLectureTags(draft).errors;
      const allowedSubs = new Set(draft.coreTopics.flatMap((t) => T.SUB_TAGS_BY_TOPIC[t] || []));

      const el = document.createElement("div");
      el.id = "modal-root";
      el.className = "modal-overlay";
      el.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-label="Edit tags for ${esc(l.title)}">
          <div class="modal-header">
            <h3 class="mt-0">${esc(tr("manage_lecture"))}</h3>
            <button class="modal-close" data-action="close-modal" aria-label="Close">&times;</button>
          </div>
          <p class="text-soft mt-0" style="margin-top:-8px">${esc(l.title)}</p>

          ${errors.length ? `<div class="modal-errors"><strong>Fix before saving:</strong><ul>${errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>` : ""}

          <div class="tag-picker-group">
            <h4>${esc(tr("core_topic"))}</h4>
            <div class="tag-picker-options">
              ${T.CORE_TOPICS.map((t) => `<button type="button" class="tag-pick ${draft.coreTopics.includes(t) ? "selected" : ""}" data-modal-pick="core" data-value="${esc(t)}">${esc(t)}</button>`).join("")}
            </div>
          </div>
          <div class="tag-picker-group">
            <h4>Sub-tags</h4>
            <div class="tag-picker-options">
              ${allowedSubs.size ? Array.from(allowedSubs).map((s) => `<button type="button" class="tag-pick ${draft.subTags.includes(s) ? "selected" : ""}" data-modal-pick="sub" data-value="${esc(s)}">${esc(s)}</button>`).join("")
                : `<span class="hint">Choose a core topic first.</span>`}
            </div>
          </div>
          ${draft.coreTopics.includes("Fiqh") ? `
          <div class="tag-picker-group">
            <h4>${esc(tr("madhhab"))}</h4>
            <div class="tag-picker-options">
              ${T.MADHHABS.map((m) => `<button type="button" class="tag-pick madhhab-pick ${draft.madhhabTags.includes(m) ? "selected" : ""}" data-modal-pick="madhhab" data-value="${esc(m)}">${esc(m)}</button>`).join("")}
            </div>
          </div>` : ""}

          <div class="modal-actions">
            <button class="btn btn-secondary" data-action="close-modal">Cancel</button>
            <button class="btn btn-primary" data-action="save-tags" ${errors.length ? "disabled" : ""}>${esc(tr("save_changes"))}</button>
          </div>
        </div>`;
      document.body.appendChild(el);
    }
  }

  // --------------------------------------------------------------------
  // Event handling (delegated)
  // --------------------------------------------------------------------
  function attachHandlers() {
    // Nav / card navigation
    root.querySelectorAll("[data-nav]").forEach((elx) => {
      elx.addEventListener("click", (e) => {
        e.preventDefault();
        navigate(elx.getAttribute("data-nav"));
      });
    });

    // Search
    const searchForm = document.getElementById("nav-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        state.filters.search = document.getElementById("nav-search-input").value.trim();
        if (state.route.name !== "lectures") navigate("#/lectures"); else render();
      });
    }
    const searchInput = document.getElementById("nav-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        state.filters.search = searchInput.value;
        if (state.route.name === "lectures") {
          clearTimeout(window.__searchDebounce);
          window.__searchDebounce = setTimeout(() => {
            const focusWasHere = document.activeElement === searchInput;
            render();
            if (focusWasHere) {
              const again = document.getElementById("nav-search-input");
              if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
            }
          }, 180);
        }
      });
    }

    // Lecture filters
    root.querySelectorAll("[data-filter]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const group = cb.getAttribute("data-filter");
        const val = cb.value;
        const set = state.filters[group];
        if (cb.checked) set.add(val); else set.delete(val);
        render();
      });
    });
    const clearBtn = root.querySelector('[data-action="clear-filters"]');
    if (clearBtn) clearBtn.addEventListener("click", () => {
      state.filters = { search: "", coreTopics: new Set(), madhhabs: new Set(), levels: new Set() };
      render();
    });

    // Tag editor open/save/close
    root.querySelectorAll('[data-action="edit-tags"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const l = findLecture(id);
        state.modal = {
          type: "tagEditor",
          lectureId: id,
          draft: {
            coreTopics: l.tags.coreTopics.slice(),
            subTags: l.tags.subTags.slice(),
            madhhabTags: (l.tags.madhhabTags || []).slice(),
          },
        };
        renderModal();
        attachModalHandlers();
      });
    });

    // Curation form
    setupCurationForm();

    // Settings
    setupSettingsHandlers();

    attachModalHandlers();
  }

  function attachModalHandlers() {
    const overlay = document.getElementById("modal-root");
    if (!overlay) return;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
    overlay.querySelectorAll('[data-action="close-modal"]').forEach((b) => b.addEventListener("click", closeModal));
    overlay.querySelectorAll("[data-modal-pick]").forEach((b) => {
      b.addEventListener("click", () => {
        const kind = b.getAttribute("data-modal-pick");
        const value = b.getAttribute("data-value");
        const draft = state.modal.draft;
        if (kind === "core") {
          const i = draft.coreTopics.indexOf(value);
          if (i >= 0) {
            draft.coreTopics.splice(i, 1);
            // drop now-invalid sub-tags / madhhab tags tied only to this topic
            const stillAllowed = new Set(draft.coreTopics.flatMap((t) => T.SUB_TAGS_BY_TOPIC[t] || []));
            draft.subTags = draft.subTags.filter((s) => stillAllowed.has(s));
            if (!draft.coreTopics.includes("Fiqh")) draft.madhhabTags = [];
          } else {
            draft.coreTopics.push(value);
          }
        } else if (kind === "sub") {
          const i = draft.subTags.indexOf(value);
          if (i >= 0) draft.subTags.splice(i, 1); else draft.subTags.push(value);
        } else if (kind === "madhhab") {
          const i = draft.madhhabTags.indexOf(value);
          if (i >= 0) draft.madhhabTags.splice(i, 1); else draft.madhhabTags.push(value);
        }
        renderModal();
        attachModalHandlers();
      });
    });
    const saveBtn = overlay.querySelector('[data-action="save-tags"]');
    if (saveBtn) saveBtn.addEventListener("click", () => {
      const l = findLecture(state.modal.lectureId);
      const draft = state.modal.draft;
      const result = T.validateLectureTags(draft);
      if (!result.valid) return; // button is disabled in this state, but guard anyway
      l.tags = {
        coreTopics: draft.coreTopics.slice(),
        subTags: draft.subTags.slice(),
        madhhabTags: draft.madhhabTags.slice(),
      };
      persistLectures();
      state.modal = null;
      render();
      toast(tr("saved"));
    });
  }

  function closeModal() { state.modal = null; renderModal(); }

  // ---- Curation form logic --------------------------------------------
  function setupCurationForm() {
    const form = document.getElementById("curation-form");
    if (!form) return;
    const draftTags = { coreTopics: [], subTags: [], madhhabTags: [] };

    function renderSubTagPicker() {
      const container = document.getElementById("cf-sub-tags");
      const allowed = new Set(draftTags.coreTopics.flatMap((t) => T.SUB_TAGS_BY_TOPIC[t] || []));
      if (!allowed.size) { container.innerHTML = `<span class="hint">Choose a core topic first.</span>`; return; }
      container.innerHTML = Array.from(allowed).map((s) =>
        `<button type="button" class="tag-pick ${draftTags.subTags.includes(s) ? "selected" : ""}" data-pick="sub" data-value="${esc(s)}">${esc(s)}</button>`
      ).join("");
      container.querySelectorAll("[data-pick]").forEach(bindPick);
    }

    function renderTagErrors() {
      const box = document.getElementById("cf-tag-errors");
      const result = T.validateLectureTags(draftTags);
      box.innerHTML = result.errors.length
        ? `<div class="modal-errors"><ul>${result.errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>` : "";
      return result.valid;
    }

    function bindPick(btn) {
      btn.addEventListener("click", () => {
        const kind = btn.getAttribute("data-pick");
        const value = btn.getAttribute("data-value");
        if (kind === "core") {
          const i = draftTags.coreTopics.indexOf(value);
          if (i >= 0) {
            draftTags.coreTopics.splice(i, 1);
            const stillAllowed = new Set(draftTags.coreTopics.flatMap((t) => T.SUB_TAGS_BY_TOPIC[t] || []));
            draftTags.subTags = draftTags.subTags.filter((s) => stillAllowed.has(s));
          } else {
            draftTags.coreTopics.push(value);
          }
          document.querySelectorAll('#cf-core-topics [data-pick="core"]').forEach((b) => {
            b.classList.toggle("selected", draftTags.coreTopics.includes(b.getAttribute("data-value")));
          });
          document.getElementById("cf-madhhab-field").classList.toggle("hidden", !draftTags.coreTopics.includes("Fiqh"));
          renderSubTagPicker();
        } else if (kind === "sub") {
          const i = draftTags.subTags.indexOf(value);
          if (i >= 0) draftTags.subTags.splice(i, 1); else draftTags.subTags.push(value);
          btn.classList.toggle("selected", draftTags.subTags.includes(value));
        } else if (kind === "madhhab") {
          const i = draftTags.madhhabTags.indexOf(value);
          if (i >= 0) draftTags.madhhabTags.splice(i, 1); else draftTags.madhhabTags.push(value);
          btn.classList.toggle("selected", draftTags.madhhabTags.includes(value));
        }
        renderTagErrors();
        state.lastCheck = null;
        document.getElementById("cf-check-result").innerHTML = "";
        document.getElementById("cf-add-btn").disabled = true;
      });
    }

    document.querySelectorAll('#cf-core-topics [data-pick="core"]').forEach(bindPick);
    document.querySelectorAll('#cf-madhhabs [data-pick="madhhab"]').forEach(bindPick);

    document.getElementById("cf-check-btn").addEventListener("click", () => {
      const title = form.title.value.trim();
      const scholarName = form.scholar.value.trim();
      const views = parseInt(form.views.value, 10) || 0;
      if (!title || !scholarName || !form.views.value) {
        toast("Fill in title, scholar, and views first.");
        return;
      }
      const tagsValid = renderTagErrors();
      if (!tagsValid) { document.getElementById("cf-add-btn").disabled = true; return; }

      const scholarMatch = D.SCHOLARS.find((s) => s.name.toLowerCase() === scholarName.toLowerCase());
      const scholarApproved = !!(scholarMatch && scholarMatch.approved);
      const viewsOk = views >= D.CURATION_RULES.minYoutubeViews;
      const check = { approved: scholarApproved && viewsOk, scholarApproved, viewsOk, views };
      state.lastCheck = check;
      document.getElementById("cf-check-result").innerHTML = renderCheckResult(check);
      document.getElementById("cf-add-btn").disabled = false;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!state.lastCheck) return;
      const title = form.title.value.trim();
      const scholarName = form.scholar.value.trim();
      const views = parseInt(form.views.value, 10) || 0;
      const durationRaw = form.duration.value.trim();
      const parts = durationRaw.split(":").map((p) => parseInt(p, 10) || 0);
      let durationSeconds = 0;
      if (parts.length === 3) durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      else if (parts.length === 2) durationSeconds = parts[0] * 60 + parts[1];
      else durationSeconds = parts[0] || 0;

      const scholarMatch = D.SCHOLARS.find((s) => s.name.toLowerCase() === scholarName.toLowerCase());
      const newId = "lec-" + String(Date.now()).slice(-6);
      const today = new Date().toISOString().slice(0, 10);
      const newLecture = {
        id: newId,
        title: title,
        scholar: scholarName,
        scholarId: scholarMatch ? scholarMatch.id : null,
        youtubeUrl: form.url.value.trim() || "https://youtube.com/watch?v=" + newId,
        youtubeId: newId,
        tags: {
          coreTopics: draftTags.coreTopics.slice(),
          subTags: draftTags.subTags.slice(),
          madhhabTags: draftTags.madhhabTags.slice(),
        },
        views: views,
        durationSeconds: durationSeconds || 60,
        publishedDate: today,
        language: "English",
        audienceLevel: form.level.value,
        summaries: {
          tldr20s: "Summary pending - added via the Curation workflow demo.",
          exec2min: "This lecture was added through the Curation page and doesn't have full editorial summaries yet.",
          deepDive: { keyTakeaways: [], timestamps: [] },
        },
        furtherLearning: { books: [], classicalTexts: [], courses: [] },
        curation: {
          status: state.lastCheck.approved ? "approved" : "rejected",
          checkedBy: "A. Admin",
          checkedOn: today,
          rejectionReason: state.lastCheck.approved ? undefined :
            (!state.lastCheck.scholarApproved ? "Scholar is not on the approved list." : "Below the " + formatViews(D.CURATION_RULES.minYoutubeViews) + " minimum view threshold."),
        },
        relatedLectureIds: [],
      };
      state.lectures.unshift(newLecture);
      state.curationLog.unshift({
        lectureId: newId, title: title, scholar: scholarName, views: views,
        status: newLecture.curation.status, checkedOn: today,
      });
      persistLectures();
      persistCurationLog();
      state.lastCheck = null;
      toast(newLecture.curation.status === "approved" ? "Lecture added and approved." : "Lecture logged as rejected.");
      render();
    });
  }

  // ---- Settings handlers -----------------------------------------------
  function setupSettingsHandlers() {
    const langSel = document.getElementById("set-language");
    if (langSel) langSel.addEventListener("change", () => {
      state.settings.language = langSel.value;
      persistSettings();
      render();
      toast(tr("saved"));
    });
    const tierSel = document.getElementById("set-default-tier");
    if (tierSel) tierSel.addEventListener("change", () => {
      state.settings.defaultTier = tierSel.value;
      persistSettings();
      toast(tr("saved"));
    });
    const glossaryToggle = document.getElementById("set-glossary");
    if (glossaryToggle) glossaryToggle.addEventListener("change", () => {
      state.settings.showGlossary = glossaryToggle.checked;
      persistSettings();
      toast(tr("saved"));
    });
    const autoplayToggle = document.getElementById("set-autoplay");
    if (autoplayToggle) autoplayToggle.addEventListener("change", () => {
      state.settings.autoplay = autoplayToggle.checked;
      persistSettings();
      toast(tr("saved"));
    });
  }

  // --------------------------------------------------------------------
  // Init
  // --------------------------------------------------------------------
  function init() {
    state.route = parseHash();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
