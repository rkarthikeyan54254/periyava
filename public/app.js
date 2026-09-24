const app = document.querySelector("#app");

const STORAGE_KEY = "arulurai:saved:v2";
const LANGUAGE_KEY = "arulurai:language:v1";

const copy = {
  en: {
    brandSub: "Guidance grounded in documented teachings",
    homeEyebrow: "Sri Mahaperiyava Arulurai · documented teachings",
    homeTitle: "What do Mahaperiyava’s teachings say?",
    homeLead: "Ask naturally. Receive a clear, grounded answer first — with the supporting teaching and source available underneath.",
    askLabel: "Ask",
    askTitle: "Seek guidance from the teachings.",
    askLead: "Ask in your own words. The answer stays within what the documented evidence can support.",
    placeholder: "What did Periyava say about…",
    dictate: "Dictate",
    listening: "Listening…",
    dictateUnavailable: "Dictation unavailable",
    dictateNote: "Dictation remains editable and never submits on its own.",
    seek: "Seek guidance",
    consulting: "Consulting the teachings…",
    qualityNote: "Questions and optional feedback may be retained for quality review. They never become source evidence.",
    loading: "Consulting the documented teachings and their evidence boundaries…",
    lookupErrorTitle: "Couldn’t complete the lookup.",
    emptyTitle: "No answer yet",
    emptyText: "Try a question about a teaching, practice, text, value or tradition.",
    evidenceSummary: "Sources & supporting teachings",
    notEnough: "Not enough verified evidence yet",
    cannotAttribute: "We can’t responsibly attribute a direct answer.",
    qualified: "Qualified answer",
    supported: "Supported by curated evidence",
    save: "Save",
    saved: "Saved",
    boundary: "Evidence boundary",
    guidanceQualified: "Guidance within the evidence",
    guidance: "Guidance from the teachings",
    aboutAnswer: "About this answer",
    useful: "Was this useful?",
    yes: "Yes",
    needsReview: "Needs review",
    reviewThanks: "Thank you — this is in the quality review queue.",
    thanks: "Thank you.",
    feedbackError: "Feedback could not be saved.",
    reviewPrompt: "What should we review?",
    note: "Optional note",
    notePlaceholder: "Tell us what felt wrong or incomplete.",
    sendReview: "Send review",
    explore: "Explore",
    exploreTitle: "Verified paths into the teachings.",
    exploreLead: "Choose a theme. Each opens a source-grounded question rather than a canned summary.",
    savedLabel: "Saved",
    savedTitle: "Your quiet shelf.",
    savedLead: "Saved answers stay in this browser only.",
    nothingSaved: "Nothing saved yet",
    nothingSavedText: "Save a useful supported or qualified answer and it will appear here.",
    openAnswer: "Open answer →",
    trustTitle: "Guidance first. Evidence close at hand.",
    trustText: "When the sources support an answer, the response should feel natural and useful. Boundaries appear only when the evidence genuinely requires them.",
    integrityTitle: "About the voice of this product",
    integrityText: "Responses are grounded in documented teachings and clearly separated from verbatim quotations. The product does not present generated prose as Sri Mahaperiyava’s literal words.",
    nav: { home: "Home", ask: "Ask", explore: "Explore", saved: "Saved" },
    feedbackTags: {
      "wrong evidence": "wrong evidence",
      "didn't answer": "didn't answer",
      "unsupported conclusion": "unsupported conclusion",
      "hard to understand": "hard to understand",
      "should have abstained": "should have abstained",
    },
    examples: [
      "What did Periyava say about the unity of Shiva and Vishnu?",
      "What did Periyava say about Sandhyavandanam?",
      "What did Periyava say about a student's duties and education?",
      "What did Periyava say about bhakti and prayer?",
    ],
    topics: [
      ["Bhakti & prayer", "What did Periyava say about bhakti and prayer?"],
      ["Dharma in daily life", "What did Periyava say about living according to dharma in daily life?"],
      ["Student life", "What did Periyava say about a student's duties and education?"],
      ["Shiva & Vishnu", "Does Mahaperiyava teach the essential unity of Shiva and Vishnu?"],
      ["Vedic practice", "What did Periyava say about Sandhyavandanam?"],
      ["Tamil & Sanskrit", "What did Periyava say about Tamil and Sanskrit?"],
    ],
  },
  ta: {
    brandSub: "ஆவணப்படுத்தப்பட்ட உபதேசங்களை ஆதாரமாகக் கொண்ட வழிகாட்டல்",
    homeEyebrow: "ஸ்ரீ மஹாபெரியவா அருளுரை · ஆவணப்படுத்தப்பட்ட உபதேசங்கள்",
    homeTitle: "மஹாபெரியவா என்ன உபதேசித்திருக்கிறார்?",
    homeLead: "உங்கள் கேள்வியை இயல்பாகக் கேளுங்கள். முதலில் தெளிவான பதில்; அதன் கீழ் அதற்கான உபதேச ஆதாரங்களையும் பார்க்கலாம்.",
    askLabel: "கேளுங்கள்",
    askTitle: "மஹாபெரியவாவின் உபதேசங்களில் வழிகாட்டலைத் தேடுங்கள்.",
    askLead: "உங்கள் சொற்களிலேயே கேளுங்கள். கிடைத்துள்ள ஆவண ஆதாரம் எவ்வளவு வரை உறுதிப்படுத்துகிறதோ அவ்வளவு வரையிலேயே பதில் இருக்கும்.",
    placeholder: "மஹாபெரியவா இதைப் பற்றி என்ன சொல்லியிருக்கிறார்…",
    dictate: "பேசிக் கேளுங்கள்",
    listening: "கேட்டுக் கொண்டிருக்கிறது…",
    dictateUnavailable: "குரல் உள்ளீடு கிடைக்கவில்லை",
    dictateNote: "குரல் மூலம் வந்த உரையை அனுப்புவதற்கு முன் நீங்கள் திருத்தலாம்; அது தானாக அனுப்பப்படாது.",
    seek: "அருளுரையை நாடுங்கள்",
    consulting: "உபதேசங்களைப் பார்க்கிறோம்…",
    qualityNote: "தரத்தை மேம்படுத்த கேள்விகளும் விருப்பத்தேர்வு பின்னூட்டமும் சேமிக்கப்படலாம். அவை ஒருபோதும் ஆதார நூலாக மாறாது.",
    loading: "ஆவணப்படுத்தப்பட்ட உபதேசங்களையும் அவற்றின் ஆதார எல்லைகளையும் பார்க்கிறோம்…",
    lookupErrorTitle: "இப்போது பதிலைத் தர முடியவில்லை.",
    emptyTitle: "இன்னும் கேள்வி கேட்கப்படவில்லை",
    emptyText: "உபதேசம், அனுஷ்டானம், நூல், தர்மம் அல்லது சமய வழக்கம் பற்றி கேளுங்கள்.",
    evidenceSummary: "ஆதாரங்களும் தொடர்புடைய உபதேசங்களும்",
    notEnough: "இப்போதைக்கு போதுமான உறுதியான ஆதாரம் இல்லை",
    cannotAttribute: "இந்தக் கேள்விக்கு மஹாபெரியவாவின் பெயரில் நேரடி பதிலைச் சொல்ல போதுமான ஆதாரம் இல்லை.",
    qualified: "ஆதார எல்லையுடன் பதில்",
    supported: "ஆதாரத்தால் உறுதிப்படுத்தப்பட்ட பதில்",
    save: "சேமிக்க",
    saved: "சேமிக்கப்பட்டது",
    boundary: "ஆதாரத்தின் எல்லை",
    guidanceQualified: "ஆதாரம் உறுதிப்படுத்தும் வரையிலான வழிகாட்டல்",
    guidance: "உபதேசங்களில் இருந்து வழிகாட்டல்",
    aboutAnswer: "இந்தப் பதிலைப் பற்றி",
    useful: "இந்தப் பதில் பயனாக இருந்ததா?",
    yes: "ஆம்",
    needsReview: "மீளாய்வு தேவை",
    reviewThanks: "நன்றி — இது தர மீளாய்வுக்குச் சேர்க்கப்பட்டது.",
    thanks: "நன்றி.",
    feedbackError: "பின்னூட்டத்தைச் சேமிக்க முடியவில்லை.",
    reviewPrompt: "எதை மீளாய்வு செய்ய வேண்டும்?",
    note: "விருப்பத்தேர்வு குறிப்பு",
    notePlaceholder: "எது தவறாகவோ முழுமையற்றதாகவோ தோன்றியது என்பதை எழுதுங்கள்.",
    sendReview: "மீளாய்வுக்கு அனுப்புங்கள்",
    explore: "தேடிப் பாருங்கள்",
    exploreTitle: "உபதேசங்களுக்குள் ஆதாரமுள்ள வழிகள்.",
    exploreLead: "ஒரு தலைப்பைத் தேர்ந்தெடுக்கவும். தயாராக வைத்த சுருக்கமல்ல; ஆதாரத்திலிருந்து பதில் தேடும் கேள்வியாக அது திறக்கும்.",
    savedLabel: "சேமித்தவை",
    savedTitle: "நீங்கள் சேமித்த பதில்கள்.",
    savedLead: "சேமித்த பதில்கள் இந்த உலாவியிலேயே இருக்கும்.",
    nothingSaved: "இன்னும் எதுவும் சேமிக்கப்படவில்லை",
    nothingSavedText: "பயனுள்ள பதிலைச் சேமித்தால் அது இங்கே தோன்றும்.",
    openAnswer: "பதிலைத் திறக்க →",
    trustTitle: "முதலில் வழிகாட்டல். அருகிலேயே ஆதாரம்.",
    trustText: "ஆதாரம் பதிலை உறுதிப்படுத்தும் போது, பதில் இயல்பாகவும் புரியும்படியாகவும் இருக்க வேண்டும். உண்மையில் தேவையான இடத்தில்தான் ஆதார எல்லை வெளிப்படையாகக் காட்டப்படும்.",
    integrityTitle: "இந்தத் தளத்தின் குரல் பற்றி",
    integrityText: "பதில்கள் ஆவணப்படுத்தப்பட்ட உபதேசங்களை ஆதாரமாகக் கொண்டவை. உருவாக்கப்பட்ட உரை மஹாபெரியவாவின் சொற்சொறான வாக்காகக் காட்டப்படாது.",
    nav: { home: "முகப்பு", ask: "கேளுங்கள்", explore: "தேடல்", saved: "சேமித்தவை" },
    feedbackTags: {
      "wrong evidence": "தவறான ஆதாரம்",
      "didn't answer": "கேள்விக்குப் பதில் இல்லை",
      "unsupported conclusion": "ஆதாரமற்ற முடிவு",
      "hard to understand": "புரிய கடினம்",
      "should have abstained": "பதில் சொல்லாமல் இருந்திருக்க வேண்டும்",
    },
    examples: [
      "சிவனும் விஷ்ணுவும் ஒன்றே என்று மஹாபெரியவா உபதேசித்திருக்கிறாரா?",
      "சந்தியாவந்தனம் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?",
      "மாணவரின் கடமையும் கல்வியும் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?",
      "பக்தியும் பிரார்த்தனையும் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?",
    ],
    topics: [
      ["பக்தியும் பிரார்த்தனையும்", "பக்தியும் பிரார்த்தனையும் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?"],
      ["அன்றாட வாழ்வில் தர்மம்", "அன்றாட வாழ்வில் தர்மத்தைப் பின்பற்றுவது பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?"],
      ["மாணவர் வாழ்க்கை", "மாணவரின் கடமையும் கல்வியும் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?"],
      ["சிவன் — விஷ்ணு", "சிவனும் விஷ்ணுவும் ஒரே பரம்பொருளின் வடிவங்கள் என்று மஹாபெரியவா உபதேசித்திருக்கிறாரா?"],
      ["வைதிக அனுஷ்டானம்", "சந்தியாவந்தனம் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?"],
      ["தமிழும் சமஸ்கிருதமும்", "தமிழும் சமஸ்கிருதமும் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?"],
    ],
  },
};

const feedbackTags = [
  "wrong evidence",
  "didn't answer",
  "unsupported conclusion",
  "hard to understand",
  "should have abstained",
];

const state = {
  route: readRoute(),
  language: readLanguage(),
  question: "",
  answer: null,
  loading: false,
  error: null,
  feedback: null,
  feedbackMode: null,
};

function t(key) {
  return copy[state.language][key];
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readLanguage() {
  const value = localStorage.getItem(LANGUAGE_KEY);
  return value === "ta" ? "ta" : "en";
}

function setLanguage(language) {
  if (!["en", "ta"].includes(language)) return;
  state.language = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  document.documentElement.lang = language === "ta" ? "ta" : "en";
  state.answer = null;
  state.error = null;
  state.feedback = null;
  state.feedbackMode = null;
  render();
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
  const items = savedItems().filter(
    (item) => !(item.question === state.answer.question && item.language === state.language),
  );
  items.unshift({ ...state.answer, language: state.language, savedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
  render();
}

function languageTabs() {
  return `
    <div class="language-tabs" role="tablist" aria-label="Language">
      <button role="tab" aria-selected="${state.language === "en"}" class="${state.language === "en" ? "active" : ""}" data-language="en">English</button>
      <button role="tab" aria-selected="${state.language === "ta"}" class="${state.language === "ta" ? "active" : ""}" data-language="ta">தமிழ்</button>
    </div>
  `;
}

function composer() {
  return `
    <form class="composer" id="question-form">
      <label class="sr-only" for="question">${escapeHtml(t("askLabel"))}</label>
      <textarea id="question" maxlength="2000" placeholder="${escapeHtml(t("placeholder"))}">${escapeHtml(state.question)}</textarea>
      <div class="composer-actions">
        <button type="button" id="dictate" class="dictate">${escapeHtml(t("dictate"))}</button>
        <button type="submit" class="primary" ${state.loading ? "disabled" : ""}>
          ${escapeHtml(state.loading ? t("consulting") : t("seek"))}
        </button>
      </div>
      <small class="dictation-note">${escapeHtml(t("dictateNote"))}</small>
    </form>
  `;
}

function homePage() {
  return `
    <section class="hero home-hero">
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(t("homeEyebrow"))}</p>
        <h1>${escapeHtml(t("homeTitle"))}</h1>
        <p class="lead">${escapeHtml(t("homeLead"))}</p>
      </div>
      <div class="hero-emblem" aria-hidden="true">
        <img src="/assets/mahaperiyava-mark.webp" alt="" loading="eager" decoding="async">
      </div>
      <div class="hero-compose">
        ${composer()}
        <div class="chips">
          ${t("examples").map((prompt) => `<button data-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`).join("")}
        </div>
      </div>
    </section>
    <section class="trust">
      <h2>${escapeHtml(t("trustTitle"))}</h2>
      <p>${escapeHtml(t("trustText"))}</p>
    </section>
    <section class="integrity">
      <strong>${escapeHtml(t("integrityTitle"))}</strong>
      <p>${escapeHtml(t("integrityText"))}</p>
    </section>
  `;
}

function askPage() {
  return `
    <section class="page-head ask-head">
      <div class="ask-head-copy">
        <p class="eyebrow">${escapeHtml(t("askLabel"))}</p>
        <h1>${escapeHtml(t("askTitle"))}</h1>
        <p>${escapeHtml(t("askLead"))}</p>
      </div>
    </section>
    ${composer()}
    <p class="quality-note">${escapeHtml(t("qualityNote"))}</p>
    <section class="answer-zone">
      ${state.loading ? loadingCard() : state.error ? errorCard() : state.answer ? answerCard(state.answer) : emptyCard()}
    </section>
  `;
}

function loadingCard() {
  return `<div class="card loading"><div></div><div></div><div></div><p>${escapeHtml(t("loading"))}</p></div>`;
}

function errorCard() {
  return `<div class="card"><h2>${escapeHtml(t("lookupErrorTitle"))}</h2><p>${escapeHtml(state.error)}</p></div>`;
}

function emptyCard() {
  return `<div class="card empty"><h2>${escapeHtml(t("emptyTitle"))}</h2><p>${escapeHtml(t("emptyText"))}</p></div>`;
}

function teachingList(answer) {
  if (!answer.teachings?.length) return "";
  return `
    <details class="evidence-details">
      <summary>${escapeHtml(t("evidenceSummary"))}</summary>
      <div class="teachings">
        ${answer.teachings.map((item, index) => `
          <article>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div><p>${escapeHtml(item.text)}</p><small>${escapeHtml(item.sourceLabel || "")}</small></div>
          </article>
        `).join("")}
      </div>
    </details>
  `;
}

function localizedAbstain(answer) {
  if (state.language === "ta") {
    return {
      message: "நமக்குக் கிடைத்துள்ள உறுதிப்படுத்தப்பட்ட பதிவுகள் இந்தக் கேள்விக்கு நேரடி பதிலைச் சொல்லும் அளவுக்கு இப்போது போதவில்லை.",
      boundary: "இது தற்போது சரிபார்க்கப்பட்டுள்ள தொகுப்பின் எல்லை மட்டுமே; மஹாபெரியவா இந்த விஷயத்தைப் பற்றி எப்போதும் பேசவில்லை என்ற முடிவு அல்ல.",
    };
  }
  return { message: answer.message, boundary: answer.corpusBoundary };
}

function answerCard(answer) {
  if (answer.state === "abstain") {
    const abstain = localizedAbstain(answer);
    return `
      <article class="card answer">
        <span class="pill">${escapeHtml(t("notEnough"))}</span>
        <h2>${escapeHtml(t("cannotAttribute"))}</h2>
        <p class="prose">${escapeHtml(abstain.message || "")}</p>
        <p class="muted">${escapeHtml(abstain.boundary || "")}</p>
        ${answerFooter(answer)}
      </article>
    `;
  }

  const boundary = answer.state === "qualified" && answer.limitation
    ? `<section class="boundary"><strong>${escapeHtml(t("boundary"))}</strong><p>${escapeHtml(answer.limitation)}</p></section>`
    : "";

  const supportedText = answer.answerText
    ? `<p class="prose">${escapeHtml(answer.answerText)}</p>`
    : "";

  const isSaved = savedItems().some(
    (item) => item.question === answer.question && item.language === state.language,
  );

  return `
    <article class="card answer">
      <div class="answer-top">
        <span class="pill">${escapeHtml(answer.state === "qualified" ? t("qualified") : t("supported"))}</span>
        <button id="save-answer" ${isSaved ? "disabled" : ""}>${escapeHtml(isSaved ? t("saved") : t("save"))}</button>
      </div>
      ${boundary}
      <h2>${escapeHtml(answer.state === "qualified" ? t("guidanceQualified") : t("guidance"))}</h2>
      ${supportedText}
      ${teachingList(answer)}
      ${answerFooter(answer)}
    </article>
  `;
}

function answerFooter(answer) {
  return `
    <footer class="answer-footer">
      <details class="trust-details">
        <summary>${escapeHtml(t("aboutAnswer"))}</summary>
        <p>${escapeHtml(answer.trustNote || "")}</p>
      </details>
      ${answer.interactionId ? `
        <div class="feedback">
          <span>${escapeHtml(t("useful"))}</span>
          <button type="button" data-rating="up">${escapeHtml(t("yes"))}</button>
          <button type="button" id="show-feedback-review">${escapeHtml(t("needsReview"))}</button>
          ${state.feedback ? `<em>${escapeHtml(state.feedback)}</em>` : ""}
        </div>
        ${state.feedbackMode === "review" && !state.feedback ? `
          <div class="feedback-review">
            <strong>${escapeHtml(t("reviewPrompt"))}</strong>
            <div class="feedback-tags">
              ${feedbackTags.map((tag) => `<label><input type="checkbox" value="${escapeHtml(tag)}"> <span>${escapeHtml(t("feedbackTags")[tag])}</span></label>`).join("")}
            </div>
            <label class="feedback-comment">
              <span>${escapeHtml(t("note"))}</span>
              <textarea id="feedback-comment" maxlength="1000" rows="3" placeholder="${escapeHtml(t("notePlaceholder"))}"></textarea>
            </label>
            <button type="button" class="primary feedback-submit" id="send-feedback-review">${escapeHtml(t("sendReview"))}</button>
          </div>
        ` : ""}
      ` : ""}
    </footer>
  `;
}

function explorePage() {
  return `
    <section class="page-head">
      <p class="eyebrow">${escapeHtml(t("explore"))}</p>
      <h1>${escapeHtml(t("exploreTitle"))}</h1>
      <p>${escapeHtml(t("exploreLead"))}</p>
    </section>
    <div class="topic-grid">
      ${t("topics").map(([title, prompt]) => `
        <button class="topic" data-prompt="${escapeHtml(prompt)}">
          <small>${escapeHtml(t("explore"))}</small><h2>${escapeHtml(title)}</h2><span>→</span>
        </button>
      `).join("")}
    </div>
  `;
}

function savedPage() {
  const items = savedItems().filter((item) => (item.language || "en") === state.language);
  return `
    <section class="page-head">
      <p class="eyebrow">${escapeHtml(t("savedLabel"))}</p>
      <h1>${escapeHtml(t("savedTitle"))}</h1>
      <p>${escapeHtml(t("savedLead"))}</p>
    </section>
    <div class="saved-list">
      ${items.length ? items.map((item) => `
        <article class="card saved-card">
          <small>${escapeHtml(item.state)}</small>
          <h2>${escapeHtml(item.question)}</h2>
          <button data-reopen="${escapeHtml(item.question)}">${escapeHtml(t("openAnswer"))}</button>
        </article>
      `).join("") : `<div class="card empty"><h2>${escapeHtml(t("nothingSaved"))}</h2><p>${escapeHtml(t("nothingSavedText"))}</p></div>`}
    </div>
  `;
}

function nav() {
  return `
    <nav>
      ${["home", "ask", "explore", "saved"].map((route) => `
        <button data-route="${route}" class="${state.route === route ? "active" : ""}">${escapeHtml(t("nav")[route])}</button>
      `).join("")}
    </nav>
  `;
}

function render() {
  state.route = readRoute();
  document.documentElement.lang = state.language === "ta" ? "ta" : "en";
  const page = state.route === "ask" ? askPage()
    : state.route === "explore" ? explorePage()
    : state.route === "saved" ? savedPage()
    : homePage();

  app.innerHTML = `
    <header>
      <button class="brand" data-route="home"><span class="mark"><img src="/assets/mahaperiyava-mark.webp" alt="" aria-hidden="true"></span><span><b>ஸ்ரீ மஹாபெரியவா அருளுரை</b><small>${escapeHtml(t("brandSub"))}</small></span></button>
      ${languageTabs()}
    </header>
    <main>${page}</main>
    ${nav()}
  `;

  app.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  app.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => go(button.dataset.route));
  });

  app.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      state.question = button.dataset.prompt;
      state.answer = null;
      state.error = null;
      state.feedback = null;
      state.feedbackMode = null;
      go("ask");
    });
  });

  const form = app.querySelector("#question-form");
  const field = app.querySelector("#question");
  if (field) field.addEventListener("input", (event) => { state.question = event.target.value; });
  if (form) form.addEventListener("submit", submitQuestion);

  const dictateButton = app.querySelector("#dictate");
  if (dictateButton) dictateButton.addEventListener("click", startDictation);

  const saveButton = app.querySelector("#save-answer");
  if (saveButton) saveButton.addEventListener("click", saveCurrent);

  app.querySelectorAll("[data-rating]").forEach((button) => {
    button.addEventListener("click", () => sendFeedback(button.dataset.rating));
  });

  const reviewButton = app.querySelector("#show-feedback-review");
  if (reviewButton) {
    reviewButton.addEventListener("click", () => {
      state.feedbackMode = "review";
      render();
    });
  }

  const reviewSubmit = app.querySelector("#send-feedback-review");
  if (reviewSubmit) {
    reviewSubmit.addEventListener("click", () => {
      const tags = [...app.querySelectorAll(".feedback-tags input:checked")].map((input) => input.value);
      const comment = app.querySelector("#feedback-comment")?.value?.trim() || null;
      sendFeedback("down", tags, comment);
    });
  }

  app.querySelectorAll("[data-reopen]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = savedItems().find(
        (entry) => entry.question === button.dataset.reopen && (entry.language || "en") === state.language,
      );
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
  state.feedback = null;
  state.feedbackMode = null;
  history.replaceState(null, "", "#ask");
  render();

  try {
    const response = await fetch("/api/answer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, responseLanguage: state.language }),
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

async function sendFeedback(rating, tags = [], comment = null) {
  if (!state.answer?.interactionId || state.feedback) return;

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        interactionId: state.answer.interactionId,
        rating,
        tags,
        comment,
      }),
    });
    state.feedback = response.ok
      ? (rating === "down" ? t("reviewThanks") : t("thanks"))
      : t("feedbackError");
    state.feedbackMode = null;
  } catch {
    state.feedback = t("feedbackError");
  }

  render();
}

function startDictation() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const button = app.querySelector("#dictate");
  const field = app.querySelector("#question");

  if (!Recognition) {
    if (button) {
      button.textContent = t("dictateUnavailable");
      button.disabled = true;
    }
    return;
  }

  const recognition = new Recognition();
  const baseline = (field?.value || "").trim();
  recognition.lang = state.language === "ta" ? "ta-IN" : "en-IN";
  recognition.interimResults = true;
  recognition.continuous = false;

  if (button) {
    button.textContent = t("listening");
    button.disabled = true;
  }

  recognition.onresult = (event) => {
    let transcript = "";
    for (let index = 0; index < event.results.length; index += 1) {
      transcript += event.results[index][0].transcript;
    }

    state.question = [baseline, transcript.trim()].filter(Boolean).join(" ");
    if (field) field.value = state.question;
  };

  recognition.onend = () => {
    if (button) {
      button.textContent = t("dictate");
      button.disabled = false;
    }
    if (field) field.focus();
  };

  recognition.onerror = () => {
    if (button) {
      button.textContent = t("dictate");
      button.disabled = false;
    }
  };

  recognition.start();
}

addEventListener("hashchange", render);
render();
