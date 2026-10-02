(()=>{"use strict";

const meta=document.querySelector('meta[name="askperiyava-ga4-id"]');
const measurementId=(meta?.content||"").trim();
const enabled=/^G-[A-Z0-9]+$/i.test(measurementId)&&!measurementId.includes("REPLACE");
const safeKeys=new Set(["route","language","result_state","latency_bucket","source","rating","kind","availability"]);
const queue=[];
let loaded=false;
let pendingAnswerKind="question";

function route(){const value=location.hash.slice(1);return ["home","ask","explore","saved"].includes(value)?value:"home";}
function language(){return document.documentElement.lang==="ta"?"ta":"en";}
function latencyBucket(ms){if(ms<10000)return "lt_10s";if(ms<30000)return "10_30s";if(ms<60000)return "30_60s";return "gte_60s";}
function sanitize(params={}){const safe={};for(const [key,value] of Object.entries(params)){if(!safeKeys.has(key))continue;if(["string","number","boolean"].includes(typeof value))safe[key]=value;}return safe;}
function send(name,params={}){const event={name,params:sanitize({...params,route:route(),language:language()})};if(!loaded){queue.push(event);return;}window.gtag("event",event.name,event.params);}
function flush(){while(queue.length){const event=queue.shift();window.gtag("event",event.name,event.params);}}

function load(){
  if(!enabled)return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag("consent","default",{
    analytics_storage:"denied",
    ad_storage:"denied",
    ad_user_data:"denied",
    ad_personalization:"denied",
    wait_for_update:500,
  });
  window.gtag("js",new Date());
  window.gtag("config",measurementId,{
    send_page_view:false,
    allow_google_signals:false,
    allow_ad_personalization_signals:false,
  });
  const script=document.createElement("script");
  script.async=true;
  script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.onload=()=>{loaded=true;flush();send("page_view",{route:route()});};
  document.head.append(script);
}

const nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init){
  const url=typeof input==="string"?input:input?.url||"";
  const method=(init?.method||input?.method||"GET").toUpperCase();
  if(!(url.endsWith("/api/answer")&&method==="POST"))return nativeFetch(input,init);
  const started=performance.now();
  try{
    const response=await nativeFetch(input,init);
    const elapsed=performance.now()-started;
    let resultState=response.ok?"unknown":"error";
    if(response.ok){
      try{const payload=await response.clone().json();if(["supported","qualified","abstain"].includes(payload?.state))resultState=payload.state;}catch{}
    }
    send("answer_result",{kind:pendingAnswerKind,result_state:resultState,latency_bucket:latencyBucket(elapsed)});
    return response;
  }catch(error){
    send("answer_result",{kind:pendingAnswerKind,result_state:"network_error",latency_bucket:latencyBucket(performance.now()-started)});
    throw error;
  }
};

document.addEventListener("submit",event=>{
  const form=event.target;
  if(form?.id==="question-form"){pendingAnswerKind="question";send("question_submitted",{kind:"question"});}
  if(form?.id==="followup-form"){pendingAnswerKind="followup";send("followup_started",{kind:"followup"});}
},true);

document.addEventListener("click",event=>{
  const target=event.target instanceof Element?event.target.closest("button,a"):null;
  if(!target)return;
  if(target.matches("[data-language]"))send("language_selected",{language:target.dataset.language||language()});
  else if(target.id==="dictate")send("dictation_started",{availability:target.disabled?"unavailable":"available"});
  else if(target.id==="save-answer")send("answer_saved");
  else if(target.classList.contains("share-answer"))send("answer_shared");
  else if(target.matches("[data-rating]"))send("feedback_submitted",{rating:target.dataset.rating||"unknown"});
  else if(target.id==="show-feedback-review")send("feedback_review_opened");
  else if(target.id==="send-feedback-review")send("feedback_submitted",{rating:"needs_review"});
  else if(target.classList.contains("topic"))send("explore_topic_clicked",{source:"explore"});
  else if(target.matches("[data-inspiration]"))send("explore_topic_clicked",{source:"inspiration"});
},true);

window.addEventListener("hashchange",()=>send("page_view",{route:route()}));
window.__ASK_PERIYAVA_ANALYTICS__={enabled,measurementId:enabled?measurementId:null,track:send};
load();
})();
