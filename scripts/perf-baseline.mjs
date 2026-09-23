const apiBase = String(process.env.PRAMANA_API_BASE_URL || "").replace(/\/$/, "");
const token = String(process.env.PRAMANA_PROXY_TOKEN || "").trim();
if (!apiBase || !token) throw new Error("Pramana backend configuration is required.");

const cases = [
  {
    "id": "B001",
    "category": "direct",
    "language": "en",
    "query": "Why is Pillaiyar especially associated with Tamil devotional culture?"
  },
  {
    "id": "B005",
    "category": "direct",
    "language": "en",
    "query": "What does the wooden-elephant analogy teach about appearance and reality?"
  },
  {
    "id": "B008",
    "category": "direct",
    "language": "en",
    "query": "What is the difference between guru, acharya and teacher?"
  },
  {
    "id": "B012",
    "category": "direct",
    "language": "en",
    "query": "How is the Suklambaradharam verse understood in Ganesha worship?"
  },
  {
    "id": "B015",
    "category": "direct",
    "language": "en",
    "query": "How is Vedic discipline connected with stable happiness or bliss?"
  },
  {
    "id": "B019",
    "category": "direct",
    "language": "en",
    "query": "Does restraint of the senses mean becoming passive or inert?"
  },
  {
    "id": "B022",
    "category": "direct",
    "language": "en",
    "query": "What qualities are said to characterize a realized yogi?"
  },
  {
    "id": "B026",
    "category": "direct",
    "language": "en",
    "query": "How can Brahman be actionless while Isvara governs the world?"
  },
  {
    "id": "B029",
    "category": "direct",
    "language": "en",
    "query": "Are Shankara's devotional hymns presented as incompatible with Advaita?"
  },
  {
    "id": "B033",
    "category": "direct",
    "language": "en",
    "query": "Why is Ganesha invoked before beginning an undertaking?"
  },
  {
    "id": "B036",
    "category": "direct",
    "language": "en",
    "query": "What does the name Sumukha convey about Ganesha?"
  },
  {
    "id": "B040",
    "category": "direct",
    "language": "en",
    "query": "Does happiness really reside in external objects according to the teaching?"
  },
  {
    "id": "B041",
    "category": "paraphrase",
    "language": "en",
    "query": "Why do people begin important work with Pillaiyar?"
  },
  {
    "id": "B044",
    "category": "paraphrase",
    "language": "en",
    "query": "What is Periyava trying to show with the example of a wooden elephant?"
  },
  {
    "id": "B046",
    "category": "paraphrase",
    "language": "en",
    "query": "Is controlling the senses the same as suppressing all activity?"
  },
  {
    "id": "B049",
    "category": "paraphrase",
    "language": "en",
    "query": "How does doing one's duty without attachment affect the mind?"
  },
  {
    "id": "B052",
    "category": "paraphrase",
    "language": "en",
    "query": "What exactly is Panchayatana puja trying to bring together?"
  },
  {
    "id": "B055",
    "category": "paraphrase",
    "language": "en",
    "query": "What makes the desire for moksha strong enough to count as mumukshutva?"
  },
  {
    "id": "B057",
    "category": "paraphrase",
    "language": "en",
    "query": "Why does Periyava insist that students learn to carry the load of study?"
  },
  {
    "id": "B060",
    "category": "paraphrase",
    "language": "en",
    "query": "If happiness is not inside objects, why do possessions seem to make us happy?"
  },
  {
    "id": "B061",
    "category": "qualified",
    "language": "en",
    "query": "Can women do Sandhyavandhana?"
  },
  {
    "id": "B062",
    "category": "qualified",
    "language": "en",
    "query": "Are children allowed to perform Sandhyavandhana?"
  },
  {
    "id": "B063",
    "category": "qualified",
    "language": "en",
    "query": "Which is older, Sanskrit or Tamil?"
  },
  {
    "id": "B064",
    "category": "qualified",
    "language": "en",
    "query": "What is the single primary duty of every Hindu?"
  },
  {
    "id": "B065",
    "category": "qualified",
    "language": "en",
    "query": "What is the one foremost duty of every teacher?"
  },
  {
    "id": "B066",
    "category": "qualified",
    "language": "en",
    "query": "I cannot concentrate on my studies. What exact method did Periyava prescribe for focus?"
  },
  {
    "id": "B067",
    "category": "qualified",
    "language": "en",
    "query": "If I miss Sandhyavandhana every day, what exact consequence does Periyava say will happen to me?"
  },
  {
    "id": "B068",
    "category": "inference_stretch",
    "language": "en",
    "query": "Does prayer guarantee that God will remove my suffering?"
  },
  {
    "id": "B069",
    "category": "inference_stretch",
    "language": "en",
    "query": "Does guru bhakti guarantee moksha even if I make no spiritual effort?"
  },
  {
    "id": "B070",
    "category": "inference_stretch",
    "language": "en",
    "query": "Because temples and kadigais were connected, does that mean all education outside temples is wrong?"
  },
  {
    "id": "B071",
    "category": "unsupported",
    "language": "en",
    "query": "What is the significance of Thiruppavai according to Periyava?"
  },
  {
    "id": "B073",
    "category": "unsupported",
    "language": "en",
    "query": "What did Periyava say about smartphones?"
  },
  {
    "id": "B076",
    "category": "unsupported",
    "language": "en",
    "query": "What did Periyava say about artificial intelligence?"
  },
  {
    "id": "B078",
    "category": "unsupported",
    "language": "en",
    "query": "What did Periyava say about binge-watching Netflix?"
  },
  {
    "id": "B081",
    "category": "unsupported",
    "language": "en",
    "query": "Did Periyava prefer electric cars to petrol cars?"
  },
  {
    "id": "B083",
    "category": "unsupported",
    "language": "en",
    "query": "What is Periyava's advice for remote-work productivity?"
  },
  {
    "id": "B085",
    "category": "unsupported",
    "language": "en",
    "query": "What did Periyava say about Instagram reels?"
  },
  {
    "id": "B088",
    "category": "unsupported",
    "language": "en",
    "query": "What did Periyava say about nuclear-power policy?"
  },
  {
    "id": "B090",
    "category": "unsupported",
    "language": "en",
    "query": "Can I wear a smartwatch while doing puja according to Periyava?"
  },
  {
    "id": "B091",
    "category": "multilingual",
    "language": "roman_ta",
    "query": "Sandhyavandhanam pannaama irundha enna aagum?"
  },
  {
    "id": "B092",
    "category": "multilingual",
    "language": "roman_ta",
    "query": "Veetla poojai panren; appo kovilukku yen poganum?"
  },
  {
    "id": "B093",
    "category": "qualified",
    "language": "roman_ta",
    "query": "Padippula concentrate panna mudila. Student-aa en duty-a eppadi fulfill panradhu?"
  },
  {
    "id": "B094",
    "category": "qualified",
    "language": "roman_ta",
    "query": "Tamil-aa Sanskrit-aa edhu pazhamaiyana mozhi?"
  },
  {
    "id": "B095",
    "category": "unsupported",
    "language": "roman_ta",
    "query": "Thiruppavai pathi Periyava enna sonnar?"
  },
  {
    "id": "B096",
    "category": "multilingual",
    "language": "ta",
    "query": "வீட்டில் பூஜை செய்யும்போது கோவிலுக்கு ஏன் போக வேண்டும்?"
  },
  {
    "id": "B097",
    "category": "multilingual",
    "language": "ta",
    "query": "அத்வைதத்தில் பக்திக்கு இடமுண்டா?"
  },
  {
    "id": "B098",
    "category": "multilingual",
    "language": "ta",
    "query": "மாணவனின் கடமை என்ன?"
  },
  {
    "id": "B099",
    "category": "unsupported",
    "language": "ta",
    "query": "திருப்பாவை பற்றி பெரியவா என்ன சொன்னார்?"
  },
  {
    "id": "B100",
    "category": "multilingual",
    "language": "ta",
    "query": "சந்தியாவந்தனம் செய்யாமல் இருந்தால் என்ன ஆகும்?"
  },
  {
    "id": "LIVE-NITHYA-KARMA",
    "category": "live_beta",
    "language": "en",
    "query": "I want to understand the importance of nithya karma in my life. I am not convinced that I should follow it. Please explain."
  }
];
const publicIds = new Set(["B001","B040","B061","B071","B083","B091","B096","B099","B100","LIVE-NITHYA-KARMA"]);
const publicUrl = "https://mahaperiyava.netlify.app/api/answer";

function pct(values, q) {
  if (!values.length) return null;
  const s=[...values].sort((a,b)=>a-b);
  return Math.round(s[Math.round((s.length-1)*q)]*1000)/1000;
}
function summary(values) {
  return {count:values.length,p50_ms:pct(values,.5),p75_ms:pct(values,.75),p90_ms:pct(values,.9),p95_ms:pct(values,.95),max_ms:values.length?Math.max(...values):null};
}
async function timedFetch(url, options) {
  const started=performance.now();
  try {
    const response=await fetch(url,{...options,signal:AbortSignal.timeout(25000)});
    const payload=await response.json().catch(()=>({}));
    return {http_status:response.status,client_ms:Math.round((performance.now()-started)*1000)/1000,payload,error:null};
  } catch (error) {
    return {http_status:null,client_ms:Math.round((performance.now()-started)*1000)/1000,payload:{},error:String(error?.name||error)};
  }
}

const direct=[];
for (let i=0;i<cases.length;i++) {
  const c=cases[i];
  const responseLanguage=(c.language==="ta"||c.language==="roman_ta")?"ta":"en";
  const r=await timedFetch(`${apiBase}/v1/mahaperiyava/answer`,{
    method:"POST",
    headers:{"content-type":"application/json","x-pramana-proxy-token":token},
    body:JSON.stringify({query:c.query,top_k:8,response_language:responseLanguage})
  });
  const p=r.payload||{};
  const row={
    i:i+1,id:c.id,category:c.category,language:c.language,http_status:r.http_status,
    client_ms:r.client_ms,status:p.status||null,answerable:p.answerable,
    evidence_state:p?.policy?.question_evidence_sufficiency||null,
    generated:p?.llm_synthesis?.status==="presentation_valid",
    llm_status:p?.llm_synthesis?.status||null,
    provider_calls:p?.llm_synthesis?.provider_calls??null,
    provider_latency_ms:p?.llm_synthesis?.provider_latency_ms??null,
    timing:p.performance_timing||null,error:r.error
  };
  direct.push(row);
  console.log("PERF_DIRECT_CASE="+JSON.stringify(row));
  await new Promise(resolve=>setTimeout(resolve,150));
}

const stages=["retrieval_ms","evidence_pipeline_ms","facet_alignment_ms","grounded_generation_ms","dispatch_total_ms","queue_wait_ms","operation_execution_ms","operation_total_ms","ledger_write_ms","answer_endpoint_ms"];
const stageSummary={};
for (const stage of stages) {
  stageSummary[stage]=summary(direct.map(x=>x.timing?.[stage]).filter(x=>Number.isFinite(x)));
}
const directSummary={
  attempted:direct.length,
  http_200:direct.filter(x=>x.http_status===200).length,
  generated:direct.filter(x=>x.generated).length,
  fallback:direct.filter(x=>x.http_status===200&&!x.generated).length,
  client:summary(direct.filter(x=>x.http_status===200).map(x=>x.client_ms)),
  provider:summary(direct.map(x=>x.provider_latency_ms).filter(x=>Number.isFinite(x))),
  stages:stageSummary,
  statuses:Object.fromEntries([...new Set(direct.map(x=>String(x.http_status)))].map(k=>[k,direct.filter(x=>String(x.http_status)===k).length]))
};
console.log("PERF_DIRECT_SUMMARY="+JSON.stringify(directSummary));

const publicRows=[];
for (const c of cases.filter(x=>publicIds.has(x.id))) {
  const responseLanguage=(c.language==="ta"||c.language==="roman_ta")?"ta":"en";
  const r=await timedFetch(publicUrl,{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({question:c.query,responseLanguage})
  });
  const p=r.payload||{};
  const row={id:c.id,language:c.language,http_status:r.http_status,client_ms:r.client_ms,state:p.state||null,generated:p.generated??null,error:r.error};
  publicRows.push(row);
  console.log("PERF_PUBLIC_CASE="+JSON.stringify(row));
  await new Promise(resolve=>setTimeout(resolve,300));
}
const publicSummary={
  attempted:publicRows.length,
  http_200:publicRows.filter(x=>x.http_status===200).length,
  generated:publicRows.filter(x=>x.generated===true).length,
  client:summary(publicRows.filter(x=>x.http_status===200).map(x=>x.client_ms)),
  statuses:Object.fromEntries([...new Set(publicRows.map(x=>String(x.http_status)))].map(k=>[k,publicRows.filter(x=>String(x.http_status)===k).length]))
};
console.log("PERF_PUBLIC_SUMMARY="+JSON.stringify(publicSummary));
