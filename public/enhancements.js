(() => {
  const THEME_KEY = "ask-mahaperiyava:theme:v1";
  const WELCOME_KEY = "ask-mahaperiyava:welcome:v1";

  const productCopy = {
    en: {
      brandTitle: "Ask Mahaperiyava",
      brandSub: "Deivathin Kural · Volumes 1–7 · evidence-grounded",
      beta: "Beta",
      themeDark: "Dark",
      themeLight: "Light",
      inspire: "Explore another question",
      onboardingTitle: "Before you ask",
      onboardingBody: [
        "This is not a general chatbot or an oracle. Every answer is re-grounded in the verified Deivathin Kural corpus.",
        "Current coverage is Volumes 1–7. If the verified corpus does not establish a direct answer, the site will say so rather than invent one.",
        "Generated wording is a synthesis of cited teachings, not Sri Mahaperiyava’s verbatim wording unless explicitly marked.",
      ],
      onboardingRespect: "Sensitive subjects are welcome when asked respectfully.",
      onboardingStart: "Start asking",
      onboardingMore: "How Pramāṇa works",
      followupTitle: "Ask one follow-up",
      followupLead: "Refine this answer once. The follow-up is checked against the evidence again; it does not create an open-ended chat.",
      followupPlaceholder: "For example: Which two practices should I begin with?",
      followupButton: "Check this follow-up",
      followupLoading: "Checking the sources again…",
      followupContext: "One-step follow-up to",
      interpretation: "We interpreted your wording as",
      savedNote: "No account is required. Saved answers remain on this browser and device; clearing site data or changing devices will remove them.",
      respectfulTitle: "Please rephrase the question",
      footerBeta: "Independent beta · evidence-first · not an official Kanchi Matha website",
      coverage: "7 verified volumes",
      coverageDetail: "Deivathin Kural / Voice of God",
      languageDetail: "English + தமிழ்",
      evidenceDetail: "Direct evidence boundaries shown",
    },
    ta: {
      brandTitle: "மஹாபெரியவாவைக் கேளுங்கள்",
      brandSub: "தெய்வத்தின் குரல் · தொகுதிகள் 1–7 · ஆதார அடிப்படையில்",
      beta: "பீட்டா",
      themeDark: "இருள்",
      themeLight: "ஒளி",
      inspire: "இன்னொரு கேள்வியைப் பாருங்கள்",
      onboardingTitle: "கேட்பதற்கு முன்",
      onboardingBody: [
        "இது பொதுவான சாட்பாட் அல்ல; ஜோதிடமோ தனிப்பட்ட தீர்ப்பளிப்போ செய்யாது. ஒவ்வொரு பதிலும் சரிபார்க்கப்பட்ட தெய்வத்தின் குரல் ஆதாரங்களுடன் மீண்டும் பொருத்திப் பார்க்கப்படுகிறது.",
        "தற்போதைய ஆதார வரம்பு தெய்வத்தின் குரல் தொகுதிகள் 1–7. நேரடி ஆதாரம் இல்லையெனில் ஊகிக்காமல் அதையே தெளிவாகச் சொல்வோம்.",
        "வாசிக்க எளிதாக உருவாக்கப்படும் உரை, வெளிப்படையாகச் சொல்லப்படாத வரை, ஸ்ரீ மஹாபெரியவாவின் சொற்சொறான மேற்கோள் அல்ல.",
      ],
      onboardingRespect: "நுணுக்கமான விஷயங்களையும் மரியாதையுடன் கேட்கலாம்.",
      onboardingStart: "கேட்கத் தொடங்குங்கள்",
      onboardingMore: "பிரமாணம் எப்படி செயல்படுகிறது?",
      followupTitle: "ஒரு தொடர்க் கேள்வி கேளுங்கள்",
      followupLead: "இந்தப் பதிலை ஒரு முறை மட்டும் மேலும் தெளிவுபடுத்தலாம். தொடர்க் கேள்வியும் ஆதாரங்களுடன் புதிதாகச் சரிபார்க்கப்படும்; இது திறந்த சாட் உரையாடல் அல்ல.",
      followupPlaceholder: "உதாரணம்: நான் முதலில் தொடங்க வேண்டிய இரண்டு அனுஷ்டானங்கள் எவை?",
      followupButton: "தொடர்க் கேள்வியைச் சரிபார்க்க",
      followupLoading: "ஆதாரங்களை மீண்டும் பார்க்கிறோம்…",
      followupContext: "இந்தக் கேள்வியின் ஒரே தொடர்ச்சி",
      interpretation: "உங்கள் சொல்லை இவ்வாறு புரிந்துகொண்டோம்",
      savedNote: "கணக்கு தேவையில்லை. சேமித்த பதில்கள் இந்த உலாவி மற்றும் சாதனத்தில் மட்டுமே இருக்கும்; தளத் தரவை அழித்தாலோ சாதனம் மாறினாலோ அவை கிடைக்காது.",
      respectfulTitle: "கேள்வியை மரியாதையுடன் மாற்றிக் கேளுங்கள்",
      footerBeta: "சுயாதீன பீட்டா · ஆதார முன்னுரிமை · காஞ்சி மடத்தின் அதிகாரப்பூர்வ தளம் அல்ல",
      coverage: "7 சரிபார்க்கப்பட்ட தொகுதிகள்",
      coverageDetail: "தெய்வத்தின் குரல்",
      languageDetail: "தமிழ் + English",
      evidenceDetail: "ஆதார வரம்புகள் வெளிப்படையாக",
    },
  };

  const inspiration = {
    en: [
      "Why should I give importance to nithya karma?",
      "What did Periyava say about controlling anger?",
      "How should a student deal with a wandering mind?",
      "What do the teachings say about fear and worry?",
      "How should I build discipline in daily spiritual practice?",
      "What did Periyava say about prayer and regularity?",
      "What does dharma mean in ordinary daily life?",
      "What responsibilities do parents have in shaping a child's religious life?",
      "What did Periyava say about Tamil and Sanskrit?",
      "What age is discussed for Upanayana?",
    ],
    ta: [
      "நித்ய கர்மாவுக்கு ஏன் முக்கியத்துவம் கொடுக்க வேண்டும்?",
      "கோபத்தை கட்டுப்படுத்துவது பற்றி பெரியவா என்ன சொன்னார்?",
      "மனம் அலைபாயும் போது ஒரு மாணவன் என்ன செய்ய வேண்டும்?",
      "பயம் மற்றும் கவலை பற்றி உபதேசம் என்ன சொல்கிறது?",
      "அன்றாட ஆன்மிக அனுஷ்டானத்தில் ஒழுக்கத்தை எப்படி வளர்ப்பது?",
      "பிரார்த்தனையின் தொடர்ச்சி பற்றி பெரியவா என்ன சொன்னார்?",
      "அன்றாட வாழ்க்கையில் தர்மம் என்றால் என்ன?",
      "குழந்தைகளின் சம்ஸ்கார வளர்ச்சியில் பெற்றோரின் கடமை என்ன?",
      "தமிழும் சமஸ்கிருதமும் பற்றி பெரியவா என்ன சொன்னார்?",
      "உபநயன வயது பற்றி தெய்வத்தின் குரலில் என்ன வருகிறது?",
    ],
  };

  let inspirationIndex = 0;
  let inspirationTimer = null;

  function lang() { return state?.language === "ta" ? "ta" : "en"; }
  function pc(key) { return productCopy[lang()][key]; }

  function patchCopy() {
    copy.en.brandSub = productCopy.en.brandSub;
    copy.en.homeEyebrow = "Ask Mahaperiyava · Deivathin Kural Volumes 1–7";
    copy.en.homeTitle = "Ask Mahaperiyava";
    copy.en.homeLead = "Ask naturally in English or Tamil. Each answer is grounded in the verified teachings we currently hold, with sources and evidence boundaries kept close at hand.";
    copy.en.askTitle = "Ask Mahaperiyava";
    copy.en.askLead = "Ask in your own words. We search the verified Deivathin Kural corpus and answer only to the extent the evidence supports.";
    copy.en.loading = "Checking the verified Deivathin Kural corpus. Beta responses may take a few seconds…";
    copy.en.savedLead = productCopy.en.savedNote;

    copy.ta.brandSub = productCopy.ta.brandSub;
    copy.ta.homeEyebrow = "மஹாபெரியவாவைக் கேளுங்கள் · தெய்வத்தின் குரல் தொகுதிகள் 1–7";
    copy.ta.homeTitle = "மஹாபெரியவாவைக் கேளுங்கள்";
    copy.ta.homeLead = "தமிழிலோ ஆங்கிலத்திலோ இயல்பாகக் கேளுங்கள். தற்போது சரிபார்க்கப்பட்ட தெய்வத்தின் குரல் ஆதாரங்கள் சொல்லும் அளவுக்கே பதில் தருகிறோம்; ஆதாரமும் வரம்பும் அருகிலேயே இருக்கும்.";
    copy.ta.askTitle = "மஹாபெரியவாவைக் கேளுங்கள்";
    copy.ta.askLead = "உங்கள் சொற்களில் கேளுங்கள். தெய்வத்தின் குரல் தொகுதிகள் 1–7-ல் சரிபார்க்கப்பட்ட ஆதாரம் எவ்வளவு இருக்கிறதோ அவ்வளவுக்கே பதில் தருகிறோம்.";
    copy.ta.loading = "சரிபார்க்கப்பட்ட தெய்வத்தின் குரல் ஆதாரங்களில் பார்க்கிறோம். பீட்டா பதிலுக்கு சில விநாடிகள் ஆகலாம்…";
    copy.ta.savedLead = productCopy.ta.savedNote;
  }

  function preferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  }

  function setTheme(theme, persist = true) {
    document.documentElement.dataset.theme = theme;
    if (persist) localStorage.setItem(THEME_KEY, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#181715" : "#f7f4ee";
  }

  function applyBrand() {
    const title = document.querySelector(".brand b");
    const sub = document.querySelector(".brand small");
    if (title) title.textContent = pc("brandTitle");
    if (sub) sub.textContent = pc("brandSub");
    document.title = `${pc("brandTitle")} · Pramāṇa`;
  }

  function injectHeaderTools() {
    const header = document.querySelector("#app > header");
    const tabs = header?.querySelector(".language-tabs");
    if (!header || !tabs || header.querySelector(".theme-toggle")) return;
    let tools = header.querySelector(".header-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "header-tools";
      tabs.replaceWith(tools);
      tools.append(tabs);
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
      updateThemeButton(button);
    });
    tools.append(button);
    updateThemeButton(button);
  }

  function updateThemeButton(button = document.querySelector(".theme-toggle")) {
    if (!button) return;
    const dark = document.documentElement.dataset.theme === "dark";
    button.innerHTML = `<span aria-hidden="true">${dark ? "☀" : "☾"}</span><span>${dark ? pc("themeLight") : pc("themeDark")}</span>`;
    button.setAttribute("aria-label", dark ? pc("themeLight") : pc("themeDark"));
  }

  function injectBetaBadge() {
    const brand = document.querySelector(".brand");
    if (!brand || brand.querySelector(".beta-badge")) return;
    const badge = document.createElement("span");
    badge.className = "beta-badge";
    badge.textContent = pc("beta");
    brand.append(badge);
  }

  function injectCoverageStrip() {
    if (state.route !== "home") return;
    const hero = document.querySelector(".home-hero");
    if (!hero || document.querySelector(".coverage-strip")) return;
    const strip = document.createElement("section");
    strip.className = "coverage-strip";
    strip.setAttribute("aria-label", "Current corpus coverage");
    strip.innerHTML = `<div><strong>${pc("coverage")}</strong><span>${pc("coverageDetail")}</span></div><div><strong>${pc("languageDetail")}</strong><span>${pc("evidenceDetail")}</span></div>`;
    hero.insertAdjacentElement("afterend", strip);
  }

  function currentPrompt() { const prompts = inspiration[lang()]; return prompts[inspirationIndex % prompts.length]; }
  function advanceInspiration() {
    inspirationIndex += 1;
    const button = document.querySelector(".inspiration-question");
    if (button) button.textContent = currentPrompt();
  }
  function usePrompt(prompt) {
    state.question = prompt;
    state.answer = null;
    state.error = null;
    state.feedback = null;
    state.feedbackMode = null;
    if (state.route === "ask") { render(); queueMicrotask(() => document.querySelector("#question")?.focus()); }
    else go("ask");
  }

  function injectInspiration() {
    if (!["home", "ask"].includes(state.route) || document.querySelector(".inspiration-rail")) return;
    const aside = document.createElement("aside");
    aside.className = "inspiration-rail";
    aside.innerHTML = `<span>${pc("inspire")}</span><button type="button" class="inspiration-question">${currentPrompt()}</button><button type="button" class="inspiration-next" aria-label="Next question">↻</button>`;
    aside.querySelector(".inspiration-question").addEventListener("click", (event) => usePrompt(event.currentTarget.textContent.trim()));
    aside.querySelector(".inspiration-next").addEventListener("click", advanceInspiration);
    document.body.append(aside);
    clearInterval(inspirationTimer);
    inspirationTimer = setInterval(advanceInspiration, 8000);
  }

  function removeStaleInspiration() {
    if (!["home", "ask"].includes(state.route)) { document.querySelector(".inspiration-rail")?.remove(); clearInterval(inspirationTimer); }
  }

  function injectSavedNote() {
    if (state.route !== "saved" || document.querySelector(".saved-storage-note")) return;
    const head = document.querySelector(".page-head");
    if (!head) return;
    const note = document.createElement("p");
    note.className = "saved-storage-note";
    note.textContent = pc("savedNote");
    head.insertAdjacentElement("afterend", note);
  }

  function interpretationText(answer) {
    const interpretation = answer?.interpretation;
    if (!interpretation?.corrections?.length) return "";
    const changes = interpretation.corrections.map((item) => `“${item.from}” → “${item.to}”`).join(", ");
    return `${pc("interpretation")}: ${changes}.`;
  }

  function injectAnswerMeta() {
    const card = document.querySelector(".card.answer");
    if (!card || !state.answer) return;
    const text = interpretationText(state.answer);
    if (text && !card.querySelector(".interpretation-note")) {
      const note = document.createElement("p"); note.className = "interpretation-note"; note.textContent = text;
      card.querySelector(".answer-top")?.insertAdjacentElement("afterend", note);
    }
    if (state.answer._followupParent && !card.querySelector(".followup-context")) {
      const note = document.createElement("p"); note.className = "followup-context"; note.textContent = `${pc("followupContext")}: “${state.answer._followupParent}”`;
      card.querySelector(".answer-top")?.insertAdjacentElement("afterend", note);
    }
  }

  async function submitFollowup(form) {
    const input = form.querySelector("textarea");
    const button = form.querySelector("button[type=submit]");
    const status = form.querySelector(".followup-status");
    const followup = input?.value?.trim() || "";
    if (!followup || !state.answer || state.answer._followupDepth) return;
    const parentQuestion = state.answer.question || state.question;
    const contextualQuestion = `Follow-up to the earlier question "${parentQuestion}": ${followup}`;
    button.disabled = true; status.textContent = pc("followupLoading");
    try {
      const response = await fetch("/api/answer", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: contextualQuestion, responseLanguage: responseLanguageFor(followup) }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "The evidence lookup could not be completed.");
      payload._followupDepth = 1; payload._followupParent = parentQuestion; payload._followupQuestion = followup; payload.question = followup;
      state.question = followup; state.answer = payload; state.error = null; state.feedback = null; state.feedbackMode = null;
      render(); scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) { status.textContent = error.message; button.disabled = false; }
  }

  function injectFollowup() {
    if (state.route !== "ask" || !state.answer || state.answer.state === "abstain" || state.answer._followupDepth || document.querySelector(".followup-box")) return;
    const footer = document.querySelector(".card.answer .answer-footer");
    if (!footer) return;
    const section = document.createElement("section");
    section.className = "followup-box";
    section.innerHTML = `<strong>${pc("followupTitle")}</strong><p>${pc("followupLead")}</p><form><label class="sr-only" for="followup-question">${pc("followupTitle")}</label><textarea id="followup-question" maxlength="800" rows="2" placeholder="${pc("followupPlaceholder")}"></textarea><div class="followup-actions"><span class="followup-status" aria-live="polite"></span><button class="primary" type="submit">${pc("followupButton")}</button></div></form>`;
    section.querySelector("form").addEventListener("submit", (event) => { event.preventDefault(); submitFollowup(event.currentTarget); });
    footer.insertAdjacentElement("beforebegin", section);
  }

  function injectRespectfulErrorTitle() {
    if (!state.error || !/rephrase|மரியாதையுடன்/i.test(state.error)) return;
    const title = document.querySelector(".card h2"); if (title) title.textContent = pc("respectfulTitle");
  }

  function injectFooter() {
    const root = document.querySelector("#app");
    if (!root || root.querySelector(".site-footer")) return;
    const nav = root.querySelector("nav");
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `<div><strong>Pramāṇa</strong><span>${pc("footerBeta")}</span></div><div class="footer-links"><a href="/about.html">${lang() === "ta" ? "பற்றி" : "About"}</a><a href="/privacy.html">${lang() === "ta" ? "தனியுரிமை" : "Privacy"}</a><a href="/about.html#contact">${lang() === "ta" ? "தொடர்பு" : "Contact"}</a></div>`;
    root.insertBefore(footer, nav || null);
  }

  function showWelcome() {
    if (localStorage.getItem(WELCOME_KEY) === "seen" || document.querySelector(".welcome-overlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "welcome-overlay"; overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-labelledby", "welcome-title");
    overlay.innerHTML = `<div class="welcome-card"><span class="beta-badge standalone">${pc("beta")}</span><h2 id="welcome-title">${pc("onboardingTitle")}</h2><ol>${pc("onboardingBody").map((item) => `<li>${item}</li>`).join("")}</ol><p class="welcome-respect">${pc("onboardingRespect")}</p><div class="welcome-actions"><button type="button" class="secondary" data-welcome-more>${pc("onboardingMore")}</button><button type="button" class="primary" data-welcome-start>${pc("onboardingStart")}</button></div></div>`;
    document.body.append(overlay);
    const close = () => { localStorage.setItem(WELCOME_KEY, "seen"); overlay.remove(); };
    overlay.querySelector("[data-welcome-start]").addEventListener("click", close);
    overlay.querySelector("[data-welcome-more]").addEventListener("click", () => { localStorage.setItem(WELCOME_KEY, "seen"); location.href = "/about.html"; });
  }

  let enhancing = false;
  function enhanceDom() {
    if (enhancing) return; enhancing = true;
    try { applyBrand(); injectHeaderTools(); updateThemeButton(); injectBetaBadge(); injectCoverageStrip(); removeStaleInspiration(); injectInspiration(); injectSavedNote(); injectAnswerMeta(); injectFollowup(); injectRespectfulErrorTitle(); injectFooter(); }
    finally { enhancing = false; }
  }

  patchCopy(); setTheme(preferredTheme(), false);
  const observer = new MutationObserver(() => queueMicrotask(enhanceDom));
  observer.observe(document.querySelector("#app"), { childList: true, subtree: true });
  render(); enhanceDom(); setTimeout(showWelcome, 250);
})();
