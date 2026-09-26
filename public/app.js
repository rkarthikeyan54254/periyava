const app = document.querySelector("#app");

const STORAGE_KEY = "arulurai:saved:v2";
const LANGUAGE_KEY = "arulurai:language:v1";
const THEME_KEY = "ask-mahaperiyava:theme:v1";
const WELCOME_KEY = "ask-mahaperiyava:welcome:v1";

function responseLanguageFor(question) {
  return /[\u0B80-\u0BFF]/u.test(question || "") ? "ta" : state.language;
}

const copy = {
  en: {
    brandTitle: "Ask Mahaperiyava",
    brandSub: "Deivathin Kural · Volumes 1–7 · evidence-grounded",
    beta: "Beta",
    homeEyebrow: "Pramāṇa · verified Deivathin Kural corpus",
    homeTitle: "Ask Mahaperiyava",
    homeLead: "Ask naturally in English or Tamil. Each answer is grounded in the seven currently verified volumes of Deivathin Kural / Voice of God, with supporting teachings and evidence boundaries kept close at hand.",
    askLabel: "Ask",
    askTitle: "Ask Mahaperiyava",
    askLead: "Ask in your own words. We search the verified Deivathin Kural corpus and answer only to the extent the evidence supports.",
    placeholder: "What did Periyava say about…",
    dictate: "Dictate",
    listening: "Listening…",
    dictateUnavailable: "Dictation unavailable",
    dictateNote: "Dictation remains editable and never submits on its own.",
    seek: "Seek guidance",
    consulting: "Checking the sources…",
    qualityNote: "Beta · the evidence lookup may take a few seconds. Questions and optional feedback may be retained for quality review; they never become source evidence.",
    loading: "Checking the seven verified volumes of Deivathin Kural / Voice of God. Beta responses may take a few seconds…",
    lookupErrorTitle: "Couldn’t complete the lookup.",
    respectfulErrorTitle: "Please rephrase the question",
    emptyTitle: "No answer yet",
    emptyText: "Try a question about a teaching, practice, text, value, emotion, family life or tradition.",
    evidenceSummary: "Sources & supporting teachings",
    notEnough: "No sufficiently direct evidence in the verified corpus",
    cannotAttribute: "We can’t responsibly attribute a direct answer.",
    qualified: "Qualified answer",
    supported: "Supported by curated evidence",
    save: "Save",
    saved: "Saved",
    boundary: "Evidence boundary",
    guidanceQualified: "Guidance within the evidence",
    guidance: "Guidance from the teachings",
    aboutAnswer: "About this answer",
    applicationTitle: "A way to apply this today",
    applicationNote: "This is an app-generated application of the cited teaching, not Mahaperiyava’s literal wording or a personal ruling.",
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
    savedLead: "No account is required. Saved answers remain on this browser and device; clearing site data or changing devices will remove them.",
    nothingSaved: "Nothing saved yet",
    nothingSavedText: "Save a useful supported or qualified answer and it will appear here.",
    openAnswer: "Open answer →",
    trustTitle: "Guidance first. Evidence close at hand.",
    trustText: "When the seven verified volumes support an answer, the response should feel natural and useful. When they do not, Pramāṇa states that boundary instead of filling the gap.",
    integrityTitle: "About the voice of this product",
    integrityText: "Responses are grounded in documented teachings and clearly separated from verbatim quotations. Generated prose is not presented as Sri Mahaperiyava’s literal wording.",
    coverage: "7 verified volumes",
    coverageDetail: "Deivathin Kural / Voice of God",
    languageDetail: "English + தமிழ்",
    evidenceDetail: "Direct evidence boundaries shown",
    inspire: "Explore another question",
    nextQuestion: "Next question",
    themeDark: "Dark",
    themeLight: "Light",
    onboardingTitle: "Before you ask",
    onboardingBody: [
      "This is an evidence-grounded research experience, not a general chatbot or an oracle.",
      "Current source coverage is Deivathin Kural / Voice of God, Volumes 1–7. If those verified records do not establish a direct answer, the site will say so rather than invent one.",
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
    footerBeta: "Independent beta · evidence-first · not an official Kanchi Matha website",
    nav: { home: "Home", ask: "Ask", explore: "Explore", saved: "Saved" },
    feedbackTags: {
      "wrong evidence": "wrong evidence",
      "didn't answer": "didn't answer",
      "unsupported conclusion": "unsupported conclusion",
      "hard to understand": "hard to understand",
      "should have abstained": "should have abstained",
    },
    examples: [
      "Why should I give importance to nithya karma?",
      "What did Periyava say about controlling anger?",
      "How should a student deal with a wandering mind?",
      "What did Periyava say about bhakti and prayer?",
    ],
    inspiration: [
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
      "What did Periyava say about marriage?",
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
    brandTitle: "மஹாபெரியவாவைக் கேளுங்கள்",
    brandSub: "தெய்வத்தின் குரல் · தொகுதிகள் 1–7 · ஆதார அடிப்படையில்",
    beta: "பீட்டா",
    homeEyebrow: "பிரமாணம் · சரிபார்க்கப்பட்ட தெய்வத்தின் குரல் ஆதாரங்கள்",
    homeTitle: "மஹாபெரியவாவைக் கேளுங்கள்",
    homeLead: "தமிழிலோ ஆங்கிலத்திலோ இயல்பாகக் கேளுங்கள். தற்போது சரிபார்க்கப்பட்ட தெய்வத்தின் குரல் தொகுதிகள் 1–7 சொல்லும் அளவுக்கே பதில் தருகிறோம்; ஆதாரமும் அதன் வரம்பும் அருகிலேயே இருக்கும்.",
    askLabel: "கேள்வி",
    askTitle: "மஹாபெரியவாவைக் கேளுங்கள்",
    askLead: "உங்கள் சொற்களில் கேளுங்கள். தெய்வத்தின் குரல் தொகுதிகள் 1–7-ல் சரிபார்க்கப்பட்ட ஆதாரம் எவ்வளவு இருக்கிறதோ அவ்வளவுக்கே பதில் தருகிறோம்.",
    placeholder: "உங்கள் கேள்வியை இங்கே எழுதுங்கள்…",
    dictate: "பேசிக் கேளுங்கள்",
    listening: "கேட்டுக் கொண்டிருக்கிறது…",
    dictateUnavailable: "குரல் உள்ளீடு கிடைக்கவில்லை",
    dictateNote: "குரல் மூலம் வந்த உரையை அனுப்புவதற்கு முன் நீங்கள் திருத்தலாம்; அது தானாக அனுப்பப்படாது.",
    seek: "ஆதாரத்தில் பார்க்க",
    consulting: "ஆதாரங்களைப் பார்க்கிறோம்…",
    qualityNote: "பீட்டா · ஆதாரங்களைச் சரிபார்க்க சில விநாடிகள் ஆகலாம். தரத்தை மேம்படுத்த கேள்விகளும் விருப்பத்தேர்வு பின்னூட்டமும் சேமிக்கப்படலாம்; அவை ஒருபோதும் ஆதார நூலாக மாறாது.",
    loading: "சரிபார்க்கப்பட்ட தெய்வத்தின் குரல் தொகுதிகள் 1–7-ல் பார்க்கிறோம். பீட்டா பதிலுக்கு சில விநாடிகள் ஆகலாம்…",
    lookupErrorTitle: "இப்போது பதிலைத் தர முடியவில்லை.",
    respectfulErrorTitle: "கேள்வியை மரியாதையுடன் மாற்றிக் கேளுங்கள்",
    emptyTitle: "இன்னும் கேள்வி கேட்கப்படவில்லை",
    emptyText: "உபதேசம், அனுஷ்டானம், நூல், தர்மம், மனநிலை, குடும்ப வாழ்க்கை அல்லது சமய வழக்கம் பற்றி கேளுங்கள்.",
    evidenceSummary: "இந்தப் பதிலுக்கான உபதேச ஆதாரங்கள்",
    notEnough: "சரிபார்க்கப்பட்ட ஆதாரங்களில் போதுமான நேரடி ஆதாரம் இல்லை",
    cannotAttribute: "இந்தக் கேள்விக்கு மஹாபெரியவா சொன்னதாக பொறுப்புடன் நேரடியாகக் கூற முடியவில்லை.",
    qualified: "சில வரம்புகளுடன்",
    supported: "உபதேச ஆதாரத்துடன்",
    save: "சேமிக்க",
    saved: "சேமிக்கப்பட்டது",
    boundary: "எவ்வளவு வரை சொல்ல முடியும்",
    guidanceQualified: "ஆதாரம் சொல்லும் அளவு",
    guidance: "உபதேசத்தின் சாரம்",
    aboutAnswer: "இந்தப் பதிலின் ஆதாரம்",
    applicationTitle: "இன்றைக்கு பயன்படுத்திப் பார்க்க",
    applicationNote: "இது உபதேசத்தின் அடிப்படையில் தளம் தொகுத்த நடைமுறை யோசனை; மஹாபெரியவாவின் சொற்சொறான வாக்கல்ல.",
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
    exploreTitle: "தலைப்புகளாகப் பார்க்கலாம்.",
    exploreLead: "ஒரு தலைப்பைத் தேர்ந்தெடுங்கள். அதைப் பற்றிய கேள்விக்கு தெய்வத்தின் குரலில் இருந்து ஆதாரத்துடன் பதில் தேடப்படும்.",
    savedLabel: "சேமித்தவை",
    savedTitle: "நீங்கள் சேமித்த பதில்கள்.",
    savedLead: "கணக்கு தேவையில்லை. சேமித்த பதில்கள் இந்த உலாவி மற்றும் சாதனத்தில் மட்டுமே இருக்கும்; தளத் தரவை அழித்தாலோ சாதனம் மாறினாலோ அவை கிடைக்காது.",
    nothingSaved: "இன்னும் எதுவும் சேமிக்கப்படவில்லை",
    nothingSavedText: "பயனுள்ள பதிலைச் சேமித்தால் அது இங்கே தோன்றும்.",
    openAnswer: "பதிலைத் திறக்க →",
    trustTitle: "பதில் முதலில்; ஆதாரம் உடனே.",
    trustText: "சரிபார்க்கப்பட்ட ஏழு தொகுதிகளில் கேள்விக்கு பொருத்தமான உபதேசம் இருந்தால் அதை எளிதாகப் புரியும்படி சொல்கிறோம். நேரடி ஆதாரம் போதாத இடத்தில் அந்த வரம்பை ஊகமின்றி தெளிவாகக் காட்டுகிறோம்.",
    integrityTitle: "இந்தப் பதில்கள் எப்படி உருவாகின்றன?",
    integrityText: "பதிலின் கருத்து தெய்வத்தின் குரலில் உள்ள உபதேச ஆதாரத்திலிருந்து வருகிறது. வாசிக்க எளிதாகத் தொகுக்கப்படும் உரை, மஹாபெரியவாவின் சொற்சொறான மேற்கோளாகக் காட்டப்படாது.",
    coverage: "7 சரிபார்க்கப்பட்ட தொகுதிகள்",
    coverageDetail: "தெய்வத்தின் குரல்",
    languageDetail: "தமிழ் + English",
    evidenceDetail: "ஆதார வரம்புகள் வெளிப்படையாக",
    inspire: "இன்னொரு கேள்வியைப் பாருங்கள்",
    nextQuestion: "அடுத்த கேள்வி",
    themeDark: "இருள்",
    themeLight: "ஒளி",
    onboardingTitle: "கேட்பதற்கு முன்",
    onboardingBody: [
      "இது ஆதார அடிப்படையிலான தேடல் அனுபவம்; பொதுவான சாட்பாட் அல்லது ஜோதிடத் தீர்ப்பளிப்பு அல்ல.",
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
    footerBeta: "சுயாதீன பீட்டா · ஆதார முன்னுரிமை · காஞ்சி மடத்தின் அதிகாரப்பூர்வ தளம் அல்ல",
    nav: { home: "முகப்பு", ask: "கேளுங்கள்", explore: "தேடல்", saved: "சேமித்தவை" },
    feedbackTags: {
      "wrong evidence": "தவறான ஆதாரம்",
      "didn't answer": "கேள்விக்குப் பதில் இல்லை",
      "unsupported conclusion": "ஆதாரமற்ற முடிவு",
      "hard to understand": "புரிய கடினம்",
      "should have abstained": "பதில் சொல்லாமல் இருந்திருக்க வேண்டும்",
    },
    examples: [
      "நித்ய கர்மாவுக்கு ஏன் முக்கியத்துவம் கொடுக்க வேண்டும்?",
      "கோபத்தை கட்டுப்படுத்துவது பற்றி பெரியவா என்ன சொன்னார்?",
      "மனம் அலைபாயும் போது ஒரு மாணவன் என்ன செய்ய வேண்டும்?",
      "பக்தியும் பிரார்த்தனையும் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?",
    ],
    inspiration: [
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
      "திருமணம் பற்றி பெரியவா என்ன சொன்னார்?",
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
  theme: readTheme(),
  question: "",
  answer: null,
  loading: false,
  error: null,
  feedback: null,
  feedbackMode: null,
  showWelcome: localStorage.getItem(WELCOME_KEY) !== "seen",
  inspirationIndex: 0,
  followupLoading: false,
  followupError: null,
};

let inspirationTimer = null;

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

function readTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function applyTheme(theme, persist = false) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#181715" : "#f7f4ee";
  if (persist) localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  applyTheme(state.theme === "dark" ? "light" : "dark", true);
  render();
}

function setLanguage(language) {
  if (!["en", "ta"].includes(language)) return;
  state.language = language;
  state.inspirationIndex = 0;
  localStorage.setItem(LANGUAGE_KEY, language);
  document.documentElement.lang = language === "ta" ? "ta" : "en";
  state.answer = null;
  state.error = null;
  state.feedback = null;
  state.feedbackMode = null;
  state.followupLoading = false;
  state.followupError = null;
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

function themeToggle() {
  const dark = state.theme === "dark";
  return `
    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="${escapeHtml(dark ? t("themeLight") : t("themeDark"))}">
      <span aria-hidden="true">${dark ? "☀" : "☾"}</span>
      <span>${escapeHtml(dark ? t("themeLight") : t("themeDark"))}</span>
    </button>
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

function coverageStrip() {
  return `
    <section class="coverage-strip" aria-label="${escapeHtml(t("coverage"))}">
      <div><strong>${escapeHtml(t("coverage"))}</strong><span>${escapeHtml(t("coverageDetail"))}</span></div>
      <div><strong>${escapeHtml(t("languageDetail"))}</strong><span>${escapeHtml(t("evidenceDetail"))}</span></div>
    </section>
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
    ${coverageStrip()}
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
        <p class="eyebrow">${escapeHtml(t("askLabel"))} · ${escapeHtml(t("beta"))}</p>
        <h1>${escapeHtml(t("askTitle"))}</h1>
        <p>${escapeHtml(t("askLead"))}</p>
      </div>
      <div class="ask-head-art" aria-hidden="true">
        <img src="/assets/mahaperiyava-hero.webp" alt="" loading="eager" decoding="async">
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
  const title = /rephrase|மரியாதையுடன்/u.test(state.error || "")
    ? t("respectfulErrorTitle")
    : t("lookupErrorTitle");
  return `<div class="card"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(state.error)}</p></div>`;
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

function abstainCopy(answer) {
  if (answer.message || answer.corpusBoundary) {
    return { message: answer.message || "", boundary: answer.corpusBoundary || "" };
  }
  if (state.language === "ta") {
    return {
      message: "தற்போது சரிபார்க்கப்பட்ட தெய்வத்தின் குரல் தொகுதிகள் 1–7-ல் இந்தக் கேள்விக்கு பொறுப்புடன் நேரடி பதில் கூற போதுமான, தெளிவான ஆதாரம் கிடைக்கவில்லை.",
      boundary: "பிரமாணம் தற்போது தெய்வத்தின் குரல் தொகுதிகள் 1–7-இல் இருந்து சரிபார்க்கப்பட்ட உபதேச பதிவுகளைத் தேடுகிறது. இங்கு நேரடி பதில் கிடைக்காதது அந்த தற்போதைய ஆதாரத் தொகுப்பின் வரம்பைக் குறிக்கிறது; ஸ்ரீ மஹாபெரியவா இந்த விஷயத்தை வேறு இடத்தில் எப்போதும் பேசவில்லை என்ற பொருள் அல்ல.",
    };
  }
  return {
    message: "We could not find sufficiently direct evidence in the seven currently verified volumes of Deivathin Kural (Voice of God) to answer this question responsibly.",
    boundary: "Pramāṇa currently searches curated teaching records from Deivathin Kural Volumes 1–7. This result means the verified corpus did not establish a direct answer; it does not mean Sri Mahaperiyava never spoke about the subject elsewhere.",
  };
}

function interpretationNote(answer) {
  const corrections = answer?.interpretation?.corrections;
  if (!Array.isArray(corrections) || !corrections.length) return "";
  const changes = corrections
    .map((item) => `“${escapeHtml(item.from)}” → “${escapeHtml(item.to)}”`)
    .join(", ");
  return `<p class="interpretation-note">${escapeHtml(t("interpretation"))}: ${changes}.</p>`;
}

function followupContext(answer) {
  if (!answer?._followupParent) return "";
  return `<p class="followup-context">${escapeHtml(t("followupContext"))}: “${escapeHtml(answer._followupParent)}”</p>`;
}

function followupBox(answer) {
  if (answer.state === "abstain" || answer._followupDepth) return "";
  return `
    <section class="followup-box">
      <strong>${escapeHtml(t("followupTitle"))}</strong>
      <p>${escapeHtml(t("followupLead"))}</p>
      <form id="followup-form">
        <label class="sr-only" for="followup-question">${escapeHtml(t("followupTitle"))}</label>
        <textarea id="followup-question" maxlength="800" rows="2" placeholder="${escapeHtml(t("followupPlaceholder"))}" ${state.followupLoading ? "disabled" : ""}></textarea>
        <div class="followup-actions">
          <span class="followup-status" aria-live="polite">${escapeHtml(state.followupError || (state.followupLoading ? t("followupLoading") : ""))}</span>
          <button class="primary" type="submit" ${state.followupLoading ? "disabled" : ""}>${escapeHtml(t("followupButton"))}</button>
        </div>
      </form>
    </section>
  `;
}

function answerCard(answer) {
  if (answer.state === "abstain") {
    const abstain = abstainCopy(answer);
    return `
      <article class="card answer">
        <span class="pill">${escapeHtml(t("notEnough"))}</span>
        <h2>${escapeHtml(t("cannotAttribute"))}</h2>
        ${interpretationNote(answer)}
        ${followupContext(answer)}
        <p class="prose">${escapeHtml(abstain.message)}</p>
        <p class="muted">${escapeHtml(abstain.boundary)}</p>
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

  const application = answer.applicationText
    ? `<section class="application">
        <strong>${escapeHtml(t("applicationTitle"))}</strong>
        <p>${escapeHtml(answer.applicationText)}</p>
        <small>${escapeHtml(t("applicationNote"))}</small>
      </section>`
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
      ${interpretationNote(answer)}
      ${followupContext(answer)}
      ${boundary}
      <h2>${escapeHtml(answer.state === "qualified" ? t("guidanceQualified") : t("guidance"))}</h2>
      ${supportedText}
      ${application}
      ${teachingList(answer)}
      ${followupBox(answer)}
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
    <p class="saved-storage-note">${escapeHtml(t("savedLead"))}</p>
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

function inspirationRail() {
  if (!["home", "ask"].includes(state.route)) return "";
  const prompts = t("inspiration");
  const prompt = prompts[state.inspirationIndex % prompts.length];
  return `
    <aside class="inspiration-rail" aria-label="${escapeHtml(t("inspire"))}">
      <span>${escapeHtml(t("inspire"))}</span>
      <button type="button" class="inspiration-question" data-inspiration="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>
      <button type="button" class="inspiration-next" id="inspiration-next" aria-label="${escapeHtml(t("nextQuestion"))}">↻</button>
    </aside>
  `;
}

function siteFooter() {
  return `
    <footer class="site-footer">
      <div><strong>Pramāṇa</strong><span>${escapeHtml(t("footerBeta"))}</span></div>
      <div class="footer-links">
        <a href="/about.html">${state.language === "ta" ? "பற்றி" : "About"}</a>
        <a href="/privacy.html">${state.language === "ta" ? "தனியுரிமை" : "Privacy"}</a>
        <a href="/about.html#contact">${state.language === "ta" ? "தொடர்பு" : "Contact"}</a>
      </div>
    </footer>
  `;
}

function welcomeOverlay() {
  if (!state.showWelcome) return "";
  return `
    <div class="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div class="welcome-card">
        <span class="beta-badge standalone">${escapeHtml(t("beta"))}</span>
        <h2 id="welcome-title">${escapeHtml(t("onboardingTitle"))}</h2>
        <ol>${t("onboardingBody").map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        <p class="welcome-respect">${escapeHtml(t("onboardingRespect"))}</p>
        <div class="welcome-actions">
          <button type="button" class="secondary" id="welcome-more">${escapeHtml(t("onboardingMore"))}</button>
          <button type="button" class="primary" id="welcome-start">${escapeHtml(t("onboardingStart"))}</button>
        </div>
      </div>
    </div>
  `;
}

function advanceInspiration() {
  const prompts = t("inspiration");
  state.inspirationIndex = (state.inspirationIndex + 1) % prompts.length;
  const button = app.querySelector(".inspiration-question");
  if (button) {
    const prompt = prompts[state.inspirationIndex];
    button.textContent = prompt;
    button.dataset.inspiration = prompt;
  }
}

function manageInspirationTimer() {
  clearInterval(inspirationTimer);
  inspirationTimer = null;
  if (!["home", "ask"].includes(state.route)) return;
  inspirationTimer = setInterval(() => {
    if (document.hidden) return;
    advanceInspiration();
  }, 8000);
}

function usePrompt(prompt) {
  state.question = prompt;
  state.answer = null;
  state.error = null;
  state.feedback = null;
  state.feedbackMode = null;
  state.followupLoading = false;
  state.followupError = null;
  if (state.route === "ask") {
    render();
    queueMicrotask(() => app.querySelector("#question")?.focus());
  } else {
    go("ask");
  }
}

function closeWelcome() {
  localStorage.setItem(WELCOME_KEY, "seen");
  state.showWelcome = false;
  render();
}

function render() {
  state.route = readRoute();
  document.documentElement.lang = state.language === "ta" ? "ta" : "en";
  document.documentElement.dataset.theme = state.theme;
  document.title = `${t("brandTitle")} · Pramāṇa`;

  const page = state.route === "ask" ? askPage()
    : state.route === "explore" ? explorePage()
    : state.route === "saved" ? savedPage()
    : homePage();

  app.innerHTML = `
    <header>
      <button class="brand" data-route="home">
        <span class="mark"><img src="/assets/mahaperiyava-mark.webp" alt="" aria-hidden="true"></span>
        <span><b>${escapeHtml(t("brandTitle"))}</b><small>${escapeHtml(t("brandSub"))}</small></span>
        <span class="beta-badge">${escapeHtml(t("beta"))}</span>
      </button>
      <div class="header-tools">
        ${languageTabs()}
        ${themeToggle()}
      </div>
    </header>
    <main>${page}</main>
    ${inspirationRail()}
    ${siteFooter()}
    ${nav()}
    ${welcomeOverlay()}
  `;

  app.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  app.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => go(button.dataset.route));
  });

  app.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => usePrompt(button.dataset.prompt));
  });

  const inspirationButton = app.querySelector("[data-inspiration]");
  if (inspirationButton) {
    inspirationButton.addEventListener("click", () => usePrompt(inspirationButton.dataset.inspiration));
  }

  const inspirationNext = app.querySelector("#inspiration-next");
  if (inspirationNext) inspirationNext.addEventListener("click", advanceInspiration);

  const themeButton = app.querySelector("#theme-toggle");
  if (themeButton) themeButton.addEventListener("click", toggleTheme);

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

  const followupForm = app.querySelector("#followup-form");
  if (followupForm) followupForm.addEventListener("submit", submitFollowup);

  app.querySelectorAll("[data-reopen]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = savedItems().find(
        (entry) => entry.question === button.dataset.reopen && (entry.language || "en") === state.language,
      );
      if (!item) return;
      state.question = item.question;
      state.answer = item;
      state.error = null;
      state.followupLoading = false;
      state.followupError = null;
      go("ask");
    });
  });

  const welcomeStart = app.querySelector("#welcome-start");
  if (welcomeStart) welcomeStart.addEventListener("click", closeWelcome);
  const welcomeMore = app.querySelector("#welcome-more");
  if (welcomeMore) {
    welcomeMore.addEventListener("click", () => {
      localStorage.setItem(WELCOME_KEY, "seen");
      state.showWelcome = false;
      location.href = "/about.html";
    });
  }

  manageInspirationTimer();
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
  state.followupLoading = false;
  state.followupError = null;
  history.replaceState(null, "", "#ask");
  render();

  try {
    const response = await fetch("/api/answer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question,
        responseLanguage: responseLanguageFor(question),
      }),
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

async function submitFollowup(event) {
  event.preventDefault();
  if (!state.answer || state.answer.state === "abstain" || state.answer._followupDepth || state.followupLoading) {
    return;
  }

  const input = app.querySelector("#followup-question");
  const followup = input?.value?.trim() || "";
  if (!followup) return;

  const parentQuestion = state.answer.question || state.question;
  const contextualQuestion = `Earlier question: ${parentQuestion}\nFollow-up question: ${followup}`;

  state.followupLoading = true;
  state.followupError = null;
  render();

  try {
    const response = await fetch("/api/answer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: contextualQuestion,
        responseLanguage: responseLanguageFor(followup),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "The evidence lookup could not be completed.");

    payload._followupDepth = 1;
    payload._followupParent = parentQuestion;
    payload._followupQuestion = followup;
    payload.question = followup;

    state.question = followup;
    state.answer = payload;
    state.error = null;
    state.feedback = null;
    state.feedbackMode = null;
    state.followupError = null;
  } catch (error) {
    state.followupError = error.message;
  } finally {
    state.followupLoading = false;
    render();
    if (!state.followupError) scrollTo({ top: 0, behavior: "smooth" });
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

applyTheme(state.theme, false);
addEventListener("hashchange", render);
addEventListener("beforeunload", () => clearInterval(inspirationTimer));
render();
