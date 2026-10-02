(()=>{"use strict";
const marker="__ASK_MAHAPERIYAVA_ANSWER_RECOVERY_INSTALLED__";
if(globalThis[marker]||typeof globalThis.fetch!=="function")return;
globalThis[marker]=true;

const nativeFetch=globalThis.fetch.bind(globalThis);
const retryableStatus=new Set([502,503,504]);
const defaultDelays=[1200,2500];

function delays(){
  const override=globalThis.__ASK_MAHAPERIYAVA_RETRY_DELAYS__;
  return Array.isArray(override)&&override.length?override:defaultDelays;
}

function isAnswerRequest(input,init={}){
  const method=String(init.method||((input&&typeof input==="object"&&input.method)||"GET")).toUpperCase();
  if(method!=="POST")return false;
  const raw=typeof input==="string"?input:(input&&input.url)||"";
  try{
    const url=new URL(raw,globalThis.location?.href||"https://askperiyava.in/");
    return url.pathname==="/api/answer";
  }catch{
    return raw==="/api/answer";
  }
}

function wait(ms){
  return new Promise(resolve=>setTimeout(resolve,Math.max(0,Number(ms)||0)));
}

function retryableNetworkError(error){
  return error?.name==="AbortError"||error?.name==="TypeError";
}

globalThis.fetch=async function recoveredFetch(input,init){
  if(!isAnswerRequest(input,init))return nativeFetch(input,init);

  const retryDelays=delays();
  let lastError=null;

  for(let attempt=0;attempt<=retryDelays.length;attempt+=1){
    try{
      const response=await nativeFetch(input,init);
      if(!retryableStatus.has(response.status)||attempt===retryDelays.length){
        return response;
      }
      lastError=null;
    }catch(error){
      if(!retryableNetworkError(error)||attempt===retryDelays.length)throw error;
      lastError=error;
    }

    await wait(retryDelays[attempt]);
  }

  if(lastError)throw lastError;
  return nativeFetch(input,init);
};
})();
