const { chromium } = require("playwright");

const BASE = "http://localhost:8000";
const routes = [
  "#/lectures",
  "#/lecture/lec-001",
  "#/lecture/lec-004", // Fiqh w/ 4 madhhabs
  "#/lecture/lec-005", // rejected
  "#/scholars",
  "#/scholar/sch-002",
  "#/curation",
  "#/settings",
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push("PAGEERROR: " + err.message));

  await page.goto(BASE + "/index.html");
  await page.waitForTimeout(300);

  for (const route of routes) {
    await page.evaluate((r) => { location.hash = r; }, route);
    await page.waitForTimeout(200);
    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 80));
    console.log("ROUTE", route, "| title:", title, "| snippet:", JSON.stringify(bodyText));
    const shotName = "shot" + route.replace(/[^a-zA-Z0-9]/g, "_") + ".png";
    await page.screenshot({ path: "/home/claude/project/test/" + shotName, fullPage: true });
  }

  // --- Interaction test 1: filters ---
  await page.evaluate(() => { location.hash = "#/lectures"; });
  await page.waitForTimeout(200);
  await page.click('input[data-filter="coreTopics"][value="Fiqh"]');
  await page.waitForTimeout(150);
  const resultsCountText = await page.locator(".results-count span").first().innerText();
  console.log("After Fiqh filter:", resultsCountText);

  // --- Interaction test 2: search ---
  await page.fill("#nav-search-input", "Zakat");
  await page.waitForTimeout(400);
  const afterSearch = await page.locator(".results-count span").first().innerText();
  console.log("After search 'Zakat':", afterSearch);
  await page.screenshot({ path: "/home/claude/project/test/shot_search.png", fullPage: true });

  // --- Interaction test 3: tag editor modal + validation ---
  await page.evaluate(() => { location.hash = "#/lecture/lec-001"; });
  await page.waitForTimeout(200);
  await page.click('[data-action="edit-tags"]');
  await page.waitForTimeout(150);
  console.log("Modal visible:", await page.locator(".modal-overlay").isVisible());
  // Select Fiqh as an additional core topic -> should now require a Madhhab and show error
  await page.click('[data-modal-pick="core"][data-value="Fiqh"]');
  await page.waitForTimeout(150);
  const modalErrorsVisible = await page.locator(".modal-errors").count();
  console.log("Modal shows validation error after adding Fiqh w/o madhhab:", modalErrorsVisible > 0);
  const saveDisabled = await page.locator('[data-action="save-tags"]').isDisabled();
  console.log("Save button disabled while invalid:", saveDisabled);
  await page.screenshot({ path: "/home/claude/project/test/shot_modal_invalid.png", fullPage: true });
  // Now pick a madhhab tag -> error should clear
  await page.click('[data-modal-pick="madhhab"][data-value="Hanafi"]');
  await page.waitForTimeout(150);
  const modalErrorsAfter = await page.locator(".modal-errors").count();
  console.log("Modal errors after picking Hanafi:", modalErrorsAfter);
  const saveEnabled = await page.locator('[data-action="save-tags"]').isEnabled();
  console.log("Save enabled after fix:", saveEnabled);
  await page.click('[data-action="close-modal"]');
  await page.waitForTimeout(100);

  // --- Interaction test 4: curation workflow (rejected due to unapproved scholar) ---
  await page.evaluate(() => { location.hash = "#/curation"; });
  await page.waitForTimeout(200);
  await page.fill("#cf-title", "Test Lecture On Sincerity");
  await page.fill("#cf-scholar", "Ustadha Maryam Farooqi"); // not approved
  await page.fill("#cf-views", "500000"); // above threshold
  await page.fill("#cf-duration", "20:00");
  await page.click('[data-pick="core"][data-value="Tazkiyah"]');
  await page.waitForTimeout(100);
  await page.click('[data-pick="sub"][data-value="Sincerity"]');
  await page.waitForTimeout(100);
  await page.click("#cf-check-btn");
  await page.waitForTimeout(150);
  const checkResultText = await page.locator("#cf-check-result").innerText();
  console.log("Check result (expect REJECTED, unapproved scholar):", checkResultText.replace(/\n/g, " | "));
  await page.screenshot({ path: "/home/claude/project/test/shot_curation_check.png", fullPage: true });

  await page.click("#cf-add-btn");
  await page.waitForTimeout(300);
  const tableText = await page.locator(".curation-table").innerText();
  console.log("Curation table contains new rejected entry:", tableText.includes("Test Lecture On Sincerity"));
  await page.screenshot({ path: "/home/claude/project/test/shot_curation_after_add.png", fullPage: true });

  // Confirm the rejected lecture does NOT show up in public lectures list
  await page.evaluate(() => { location.hash = "#/lectures"; });
  await page.waitForTimeout(200);
  const lecturesBody = await page.evaluate(() => document.body.innerText);
  console.log("Rejected lecture absent from public Lectures page:", !lecturesBody.includes("Test Lecture On Sincerity"));

  // --- Interaction test 5: language switch ---
  await page.evaluate(() => { location.hash = "#/settings"; });
  await page.waitForTimeout(200);
  await page.selectOption("#set-language", "ar");
  await page.waitForTimeout(200);
  const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
  console.log("Dir attribute after switching to Arabic:", dir);
  await page.evaluate(() => { location.hash = "#/lectures"; });
  await page.waitForTimeout(200);
  const navText = await page.evaluate(() => document.querySelector(".nav-links").innerText);
  console.log("Nav text in Arabic:", navText.replace(/\n/g, " | "));
  await page.screenshot({ path: "/home/claude/project/test/shot_arabic.png", fullPage: true });
  // switch back to English for subsequent tests
  await page.evaluate(() => { location.hash = "#/settings"; });
  await page.waitForTimeout(150);
  await page.selectOption("#set-language", "en");
  await page.waitForTimeout(150);

  // --- Interaction test 6: glossary hover tooltip present ---
  await page.evaluate(() => { location.hash = "#/lecture/lec-001"; });
  await page.waitForTimeout(200);
  const glossaryCount = await page.locator(".glossary-term").count();
  console.log("Glossary terms found on lec-001 page:", glossaryCount);

  // --- Interaction test 7: mobile viewport check ---
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { location.hash = "#/lectures"; });
  await page.waitForTimeout(200);
  await page.screenshot({ path: "/home/claude/project/test/shot_mobile_lectures.png", fullPage: true });
  await page.evaluate(() => { location.hash = "#/lecture/lec-001"; });
  await page.waitForTimeout(200);
  await page.screenshot({ path: "/home/claude/project/test/shot_mobile_detail.png", fullPage: true });

  console.log("\n=== CONSOLE/PAGE ERRORS ===");
  console.log(errors.length ? errors.join("\n") : "(none)");

  await browser.close();
})();
