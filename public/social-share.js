(()=>{"use strict";

const APP_URL="https://askperiyava.in/#ask";
const MAX_EXCERPT=420;

function isTamil(){return document.documentElement.lang==="ta";}
function labels(){return isTamil()?{share:"பகிர்",copied:"பகிரும் உரை நகலெடுக்கப்பட்டது",copyFailed:"பகிரும் உரையை நகலெடுக்க முடியவில்லை"}:{share:"Share",copied:"Share text copied",copyFailed:"Could not copy share text"};}
function compact(text){return String(text||"").replace(/\s+/g," ").trim();}
function excerpt(text){const value=compact(text);return value.length<=MAX_EXCERPT?value:`${value.slice(0,MAX_EXCERPT-1).trimEnd()}…`;}

function currentSharePayload(){
  const question=compact(document.querySelector("#question")?.value);
  const answer=excerpt(document.querySelector(".answer .prose")?.textContent);
  const intro=isTamil()?"Ask Mahaperiyava-வில் கிடைத்த ஆதார அடிப்படையிலான பதில்:":"An evidence-grounded answer from Ask Mahaperiyava:";
  const sourceNote=isTamil()?"தெய்வத்தின் குரல் · சரிபார்க்கப்பட்ட ஆதாரங்களுடன்":"Deivathin Kural · with verified supporting evidence";
  const parts=[intro,question?`“${question}”`:"",answer,sourceNote].filter(Boolean);
  return {title:"Ask Mahaperiyava · Deivathin Kural",text:parts.join("\n\n"),url:APP_URL};
}

async function copyFallback(payload){
  const text=`${payload.text}\n\n${payload.url}`;
  if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return true;}
  const area=document.createElement("textarea");
  area.value=text;area.setAttribute("readonly","");area.style.position="fixed";area.style.opacity="0";
  document.body.append(area);area.select();const ok=document.execCommand("copy");area.remove();return ok;
}

async function shareAnswer(status){
  const payload=currentSharePayload();
  try{
    if(navigator.share){await navigator.share(payload);status.textContent="";return;}
    const copied=await copyFallback(payload);status.textContent=copied?labels().copied:labels().copyFailed;
  }catch(error){
    if(error?.name==="AbortError"){status.textContent="";return;}
    try{const copied=await copyFallback(payload);status.textContent=copied?labels().copied:labels().copyFailed;}catch{status.textContent=labels().copyFailed;}
  }
}

function enhanceShareAction(){
  const answerTop=document.querySelector(".answer .answer-top");
  if(!answerTop||answerTop.querySelector(".share-answer"))return;

  const button=document.createElement("button");
  button.type="button";
  button.className="share-answer";
  button.textContent=labels().share;
  button.setAttribute("aria-label",labels().share);

  const status=document.createElement("span");
  status.className="social-share-status";
  status.setAttribute("aria-live","polite");

  button.addEventListener("click",()=>shareAnswer(status));
  answerTop.append(button,status);
}

const root=document.querySelector("#app");
if(root){
  const observer=new MutationObserver(()=>queueMicrotask(enhanceShareAction));
  observer.observe(root,{childList:true,subtree:true});
  enhanceShareAction();
}
})();
