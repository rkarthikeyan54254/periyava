const app = document.querySelector("#app");

const STORAGE_KEY = "just-periyava:saved:v1";
const examplePrompts = [
  "What did Periyava say about the unity of Shiva and Vishnu?",
  "What did Periyava say about Sandhyavandanam?",
  "What did Periyava say about a student's duties and education?",
];

const topics = [
  ["Bhakti & prayer", "What did Periyava say about bhakti and prayer?"],
  ["Dharma in daily life", "What did Periyava say about living according to dharma in daily life?"],
  ["Student life", "What did Periyava say about a student's duties and education?"],
  ["Shiva & Vishnu", "Does Mahaperiyava teach the essential unity of Shiva and Vishnu?"],
  ["Vedic practice", "What did Periyava say about Sandhyavandanam?"],
  ["Tamil & Sanskrit", "What did Periyava say about Tamil and Sanskrit?"],
];

const state = {
  route: readRoute(),
  question: "",
  answer: null,
  loading: false,
  error: null,
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readRoute() {
  const value = location.hash.slice(1);
  return ["home", "ask", "explore", "saved"].includes(value) ? value : "home";
}

function go(route) {
  location.hash = route;
}

function savedItems() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveCurrent() {
  if (!state.answer?.question) return;
  const items = savedItems().filter((item) => item.question !== state.answer.question);
  items.unshift({ ...state.answer, savedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
  render();
}

function composer() {
  return `
    <form class="composer" id="question-form">
      <label class="sr-only" for="question">Ask a question</label>
      <textarea id="question" maxlength="2000" placeholder="What did Periyava say about…">${escapeHtml(state.question)}</textarea>
      <div class="composer-actions">
        <span>English · தமிழ் · Roman Tamil</span>
        <button type="submit" class="primary" ${state.loading ? "disabled" : ""}>
          ${state.loading ? "Checking evidence…" : "Ask Periyava"}
        </button>
      </div>
    </form>
  `;
}

function homePage() {
  return `
    <section class="hero">
      <p class="eyebrow">A question. A documented teaching. A clear boundary.</p>
      <h1>What did Periyava say?</h1>
      <p class="lead">Ask naturally. Just Periyava looks only for evidence we can responsibly attribute.</p>
      ${composer()}
      <div class="chips">
        ${examplePrompts.map((prompt) => `<button data-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt.replace("What did Periyava say about ", ""))}</button>`).join("")}
      </div>
    </section>
    <section class="trust">
      <h2>Grounded, or clearly limited.</h2>
      <p>Direct evidence produces a direct answer. Partial evidence shows its boundary first. Weak evidence produces an abstention.</p>
    </section>
    <section class="integrity">
      <strong>About the voice of this product</strong>
      <p>Just Periyava is an evidence-based curated representation of documented teachings. It does not present AI as Mahaperiyava speaking to you.</p>
    </section>
  `;
}

function askPage() {
  return `
    <section class="page-head">
      <p class="eyebrow">Ask</p>
      <h1>Bring a question.</h1>
      <p>We will bring back only what the curated evidence can support.</p>
    </section>
    ${composer()}
    <section class="answer-zone">
      ${state.loading ? loadingCard() : state.error ? errorCard() : state.answer ? answerCard(state.answer) : emptyCard()}
    </section>
  `;
}

function loadingCard() {
  return '<div class="card loading"><div></div><div></div><div></div><p>Checking the curated evidence and its boundaries…</p></div>';
}

function errorCard() {
  return `<div class="card"><h2>Couldn’t complete the lookup.</h2><p>${escapeHtml(state.error)}</p></div>`;
}

function emptyCard() {
  return '<div class="card empty"><h2>No answer yet</h2><p>Try a question about a teaching, practice, text, value or tradition.</p></div>';
}

function teachingList(answer) {
  if (!answer.teachings?.length) return "";
  return `
    <div class="teachings">
      ${answer.teachings.map((item, index) => `
        <article>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><p>${escapeHtml(item.text)}</p><small>${escapeHtml(item.sourceLabel || "")}</small></div>
        </article>
      `).join("")}
    </div>
  `;
}

function answerCard(answer) {
  if (answer.state === "abstain") {
    return `
      <article class="card answer">
        <span class="pill">Not enough verified evidence yet</span>
        <h2>We can’t responsibly attribute a direct answer.</h2>
        <p class="prose">${escapeHtml(answer.message)}</p>
        <p class="muted">${escapeHtml(answer.corpusBoundary)}</p>
      </article>
    `;
  }

  const boundary = answer.state === "qualified"
    ? `<section class="boundary"><strong>Evidence boundary</strong><p>${escapeHtml(answer.limitation || "")}</p></section>`
    : "";

  const supportedText = answer.state === "supported" && answer.answerText
    ? `<p class="prose">${escapeHtml(answer.answerText)}</p>`
    : "";

  const isSaved = savedItems().some((item) => item.question === answer.question);

  return `
    <article class="card answer">
      <div class="answer-top">
        <span class="pill">${answer.state === "qualified" ? "Qualified answer" : "Supported by curated evidence"}</span>
        <button id="save-answer" ${isSaved ? "disabled" : ""}>${isSaved ? "Saved" : "Save"}</button>
      </div>
      ${boundary}
      <h2>${answer.state === "qualified" ? "What the teachings do support" : "What the teachings support"}</h2>
      ${supportedText}
      ${teachingList(answer)}
      <footer>${escapeHtml(answer.trustNote || "")}</footer>
    </article>
  `;
}

function explorePage() {
  return `
    <section class="page-head">
      <p class="eyebrow">Explore</p>
      <h1>Verified paths into the teachings.</h1>
      <p>Choose a theme. Each opens a source-grounded question rather than a canned summary.</p>
    </section>
    <div class="topic-grid">
      ${topics.map(([title, prompt]) => `
        <button class="topic" data-prompt="${escapeHtml(prompt)}">
          <small>Explore</small><h2>${escapeHtml(title)}</h2><span>→</span>
        </button>
      `).join("")}
    </div>
  `;
}

function savedPage() {
  const items = savedItems();
  return `
    <section class="page-head">
      <p class="eyebrow">Saved</p>
      <h1>Your quiet shelf.</h1>
      <p>Saved answers stay in this browser only.</p>
    </section>
    <div class="saved-list">
      ${items.length ? items.map((item) => `
        <article class="card saved-card">
          <small>${escapeHtml(item.state)}</small>
          <h2>${escapeHtml(item.question)}</h2>
          <button data-reopen="${escapeHtml(item.question)}">Open answer →</button>
        </article>
      `).join("") : '<div class="card empty"><h2>Nothing saved yet</h2><p>Save a useful supported or qualified answer and it will appear here.</p></div>'}
    </div>
  `;
}

function nav() {
  return `
    <nav>
      ${["home", "ask", "explore", "saved"].map((route) => `
        <button data-route="${route}" class="${state.route === route ? "active" : ""}">${route[0].toUpperCase() + route.slice(1)}</button>
      `).join("")}
    </nav>
  `;
}

function render() {
  state.route = readRoute();
  const page = state.route === "ask" ? askPage()
    : state.route === "explore" ? explorePage()
    : state.route === "saved" ? savedPage()
    : homePage();

  app.innerHTML = `
    <header><button class="brand" data-route="home"><span class="mark"></span><span><b>Just Periyava</b><small>Evidence before eloquence</small></span></button></header>
    <main>${page}</main>
    ${nav()}
  `;

  app.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => go(button.dataset.route));
  });

  app.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      state.question = button.dataset.prompt;
      state.answer = null;
      state.error = null;
      go("ask");
    });
  });

  const form = app.querySelector("#question-form");
  const field = app.querySelector("#question");
  if (field) field.addEventListener("input", (event) => { state.question = event.target.value; });
  if (form) form.addEventListener("submit", submitQuestion);

  const saveButton = app.querySelector("#save-answer");
  if (saveButton) saveButton.addEventListener("click", saveCurrent);

  app.querySelectorAll("[data-reopen]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = savedItems().find((entry) => entry.question === button.dataset.reopen);
      if (!item) return;
      state.question = item.question;
      state.answer = item;
      state.error = null;
      go("ask");
    });
  });
}

async function submitQuestion(event) {
  event.preventDefault();
  const question = state.question.trim();
  if (!question || state.loading) return;

  state.loading = true;
  state.error = null;
  state.answer = null;
  history.replaceState(null, "", "#ask");
  render();

  try {
    const response = await fetch("/api/answer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "The evidence lookup could not be completed.");
    state.answer = payload;
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
    render();
    scrollTo({ top: 0, behavior: "smooth" });
  }
}

addEventListener("hashchange", render);
render();
