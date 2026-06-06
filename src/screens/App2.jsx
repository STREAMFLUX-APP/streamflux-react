import { useState } from 'react'
import { G, GL, SF, apiClaude, inputStyle, cardStyle, labelStyle, btnStyle } from '../globals.js'
import { CopyCard } from '../components/shared/CopyCard.jsx'
import { Chips } from '../components/shared/Chips.jsx'
import { Field, TextArea } from '../components/shared/Field.jsx'

// ── CONTACT REASON ARRAYS ────────────────────────────────
const REASONS_BUYER_EN = [
  {value:"new_listing",label:"New Listing Match",desc:"Property matches criteria"},
  {value:"price_drop",label:"Price Reduction",desc:"Property they liked dropped"},
  {value:"first_contact",label:"First Outreach",desc:"Never contacted before"},
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"open_house",label:"Open House Invite",desc:"Invite to view"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"off_market",label:"Off-Market Deal",desc:"Exclusive property"},
  {value:"just_sold",label:"Just Sold Nearby",desc:"Builds credibility"},
  {value:"viewing_followup",label:"Viewing Follow-Up",desc:"After showing a property"},
  {value:"financing_update",label:"Financing Update",desc:"Rates changed, time to act"},
  {value:"offer_strategy",label:"Offer Strategy",desc:"Ready to make an offer"},
  {value:"objection_handle",label:"Handle Objection",desc:"They said no"},
]
const REASONS_SELLER_EN = [
  {value:"first_contact",label:"First Outreach",desc:"Never contacted before"},
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"free_valuation",label:"Free Valuation Offer",desc:"No obligation appraisal"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"just_sold",label:"Just Sold Nearby",desc:"Builds credibility"},
  {value:"price_discussion",label:"Price Reduction Discussion",desc:"Help adjust expectations"},
  {value:"expired_listing",label:"Expired Listing",desc:"Their property didn't sell"},
  {value:"buyer_match",label:"Buyer Match Found",desc:"I have an interested buyer"},
  {value:"timeline_checkin",label:"Timeline Check-In",desc:"Has their timeline changed?"},
  {value:"neighbour_sale",label:"Neighbourhood Sale Alert",desc:"Property sold near them"},
  {value:"prelisting_prep",label:"Pre-Listing Preparation",desc:"Help them prepare to list"},
  {value:"fsbo_outreach",label:"FSBO Outreach",desc:"Selling without an agent"},
  {value:"objection_handle",label:"Handle Objection",desc:"They said no"},
]
const REASONS_COLD_EN = [
  {value:"first_contact",label:"First Outreach",desc:"Never contacted before"},
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"just_sold",label:"Just Sold Nearby",desc:"Builds credibility"},
  {value:"free_valuation",label:"Free Valuation Offer",desc:"No obligation appraisal"},
  {value:"re_engagement",label:"Re-Engagement",desc:"Last attempt to reconnect"},
  {value:"objection_handle",label:"Handle Objection",desc:"They said no"},
]
const REASONS_PAST_EN = [
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"referral_request",label:"Referral Request",desc:"Ask after a deal"},
  {value:"anniversary",label:"Home Anniversary",desc:"1 year+ since they bought"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"just_sold",label:"Just Sold Nearby",desc:"Builds credibility"},
  {value:"market_value_update",label:"Market Value Update",desc:"Their home is worth more now"},
  {value:"neighbourhood_news",label:"Neighbourhood News",desc:"Something affecting their property"},
  {value:"objection_handle",label:"Handle Objection",desc:"They said no"},
]

const CLIENT_TYPES_EN = [
  {value:"buyer_active",label:"🔥 Active Buyer",desc:"Looking now, ready to move"},
  {value:"buyer_passive",label:"👀 Passive Buyer",desc:"Interested but not urgent"},
  {value:"seller_motivated",label:"⚡ Motivated Seller",desc:"Wants to sell fast"},
  {value:"seller_exploring",label:"🤔 Exploring Seller",desc:"Considering selling"},
  {value:"investor",label:"💰 Investor",desc:"ROI opportunity"},
  {value:"cold_lead",label:"❄️ Cold Lead",desc:"No prior contact"},
  {value:"past_client",label:"🤝 Past Client",desc:"Already closed together"},
]

const TONES_EN = [
  {value:"warm",label:"Warm & Personal",desc:"Friendly, relationship-first"},
  {value:"professional",label:"Professional",desc:"Polished, credible"},
  {value:"urgent",label:"Urgent & Direct",desc:"Time-sensitive"},
  {value:"casual",label:"Casual & Relaxed",desc:"Low pressure"},
  {value:"luxury",label:"Luxury & Prestige",desc:"High-end, exclusive"},
]

const URGENCY_EN = [
  {value:"high",label:"🔥 High Urgency",desc:"Must act now"},
  {value:"medium",label:"⏳ Medium Urgency",desc:"1-3 months"},
  {value:"low",label:"🌱 Low Urgency",desc:"Building relationship"},
]

const SELLER_SITUATION_EN = ["Wants Quick Sale","Flexible on Timeline","Needs Top Dollar","Downsizing","Upsizing","Relocating","Divorce Settlement","Inherited Property","Investment Property Sale","Already Found New Home","Testing the Market"]
const BUYER_CRITERIA_EN = ["Under $500K","$500K–$1M","$1M–$2M","$2M–$5M","$5M+","1 Bedroom","2 Bedrooms","3 Bedrooms","4+ Bedrooms","House","Apartment","Condo","Villa","Townhouse","Pool Wanted","Garden Wanted","Sea View Wanted","City Center","Quiet Area","Good Schools Nearby","Pet Friendly","Investment Purpose","Primary Residence"]

const TABS_EN = [
  {id:"messages",label:"💬 Messages"},
  {id:"voice",label:"🎙️ Voice"},
  {id:"email",label:"📧 Email"},
  {id:"letter",label:"✉️ Letter"},
  {id:"followups",label:"🔄 Follow-Ups"},
  {id:"schedule",label:"📅 Schedule"},
]

const SYSTEM = "You are an elite real estate sales coach. You MUST respond with ONLY a raw valid JSON object. Start your response with { and end with }. No markdown. No backticks. No explanation. Nothing else."

// ── INITIAL STATE ────────────────────────────────────────
const initState = () => ({
  language:"English", clientName:"", clientType:"", contactReason:"",
  urgency:"", tone:"", objection:"",
  propAddress:"", propPrice:"", propType:"", propHighlights:"",
  propBeds:"", propBaths:"", propSqft:"", propCondition2:"",
  propInterior:[], propOutdoor:[], propBuilding:[],
  cmaSubject:{address:"",price:"",beds:"",baths:"",sqft:"",condition:"",features:""},
  cmaComps:[
    {address:"",salePrice:"",saleDate:"",beds:"",baths:"",sqft:"",condition:"",notes:""},
    {address:"",salePrice:"",saleDate:"",beds:"",baths:"",sqft:"",condition:"",notes:""},
    {address:"",salePrice:"",saleDate:"",beds:"",baths:"",sqft:"",condition:"",notes:""},
  ],
  matcherProps:[{address:"",price:"",type:"",highlights:""},{address:"",price:"",type:"",highlights:""},{address:"",price:"",type:"",highlights:""}],
  buyerNeeds:"", buyerCriteria:[], sellerSituation:[],
  agentName:"", agentPhone:"", agencyName:"",
  customSituation:"", anniversaryYears:"",
  // workflow fields
  marketLocation:"", marketDirection:[], marketInsight:"",
  financingNews:"", lookingFor:"", leadSource:null,
  knownAboutProperty:"",
  soldNearbyAddress:"", soldNearbyPrice:"", soldNearbyBeds:"", soldNearbyBaths:"", soldNearbyType:"",
  daysOnMarket:"", priceReasons:[], expOrigPrice:"", expDays:"", expiredReasons:[],
  preListingItems:[], originalTimeline:"", buyerBudget:"", buyerType:"",
  regenContext:"", regenLoading:false,
  loading:false, loadingMsg:"", result:null, error:"", activeTab:"messages",
})

// ── MAIN COMPONENT ───────────────────────────────────────
export default function App2({ state: appState, setScreen }) {
  const [s, setS] = useState({...initState(), language: appState.lang||"English"})
  const update = (updates) => setS(prev => ({...prev, ...updates}))
  const tog = (arr, val) => arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]

  const isSpa = s.language === "Spanish"
  const isBuyer = () => s.clientType.includes("buyer") || s.clientType==="investor"
  const isSeller = () => s.clientType.includes("seller")
  const isMatcher = () => s.contactReason==="new_listing" && isBuyer()
  const canGenerate = () => s.clientName && s.clientType && s.contactReason

  // ── WORKFLOW FLAGS ───────────────────────────────────────
  const isNoPropertyReason = ["first_contact","reconnect","market_update","financing_update","re_engagement"].includes(s.contactReason)
  const isSoldNearby = s.contactReason==="just_sold" || s.contactReason==="neighbour_sale"
  const isMarketUpdate = s.contactReason==="market_update"
  const isFinancingUpdate = s.contactReason==="financing_update"
  const isPriceDiscussion = s.contactReason==="price_discussion"
  const isExpiredListing = s.contactReason==="expired_listing"
  const isPreListing = s.contactReason==="prelisting_prep"
  const isTimelineCheckin = s.contactReason==="timeline_checkin"
  const isBuyerMatch = s.contactReason==="buyer_match"
  const isCMA = s.contactReason==="free_valuation"
  const isFirstContactSeller = s.contactReason==="first_contact" && isSeller()
  const isReconnect = s.contactReason==="reconnect" || s.contactReason==="re_engagement"
  const isSellerFullFeatures = ["buyer_match","fsbo_outreach","neighbour_sale"].includes(s.contactReason)
  const isBuyerFullFeatures = ["new_listing","price_drop","off_market","open_house","viewing_followup","offer_strategy"].includes(s.contactReason)
  const showFullFeatures = (isBuyer()&&isBuyerFullFeatures)||(isSeller()&&isSellerFullFeatures)
  const showBuyerCriteria = isBuyer() && ["new_listing","off_market"].includes(s.contactReason)

  // Contact reasons by type
  const CONTACT_REASONS = isSeller() ? REASONS_SELLER_EN :
    s.clientType==="past_client" ? REASONS_PAST_EN :
    s.clientType==="cold_lead" ? REASONS_COLD_EN : REASONS_BUYER_EN

  // ── GENERATE ─────────────────────────────────────────────
  const generate = async () => {
    update({loading:true, error:"", result:null})
    const langInstr = isSpa ? "\n\nCRÍTICO: Escribe TODO el contenido completamente en español. Ni una sola palabra en inglés." : ""
    const safeClaude = async (prompt, sys, tokens) => {
      try { const r = await apiClaude(prompt, sys, tokens); return r||{}; }
      catch(e) { console.warn("Claude failed:", e.message); return {}; }
    }

    const ctx = `CLIENT: ${s.clientName} | TYPE: ${s.clientType} | REASON: ${s.contactReason} | URGENCY: ${s.urgency||"not specified"} | TONE: ${s.tone}
PROPERTY: ${s.propAddress||"N/A"} | $${s.propPrice||"N/A"} | ${s.propType||""} | ${s.propHighlights||""}
${isBuyer()?`BUYER CRITERIA: ${s.buyerCriteria.join(",")||"not specified"}`:""}${isSeller()?`SELLER SITUATION: ${s.sellerSituation.join(",")||"not specified"}`:""}`

    try {
      update({loadingMsg:"✦ Writing messages..."})
      let p1 = `${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp. Warm, personal, use ${s.clientName}'s first name. End with easy question.","sms":"SMS max 160 chars. Punchy and personal.","voice_script":"Call script: OPENING, REASON FOR CALL, VALUE PITCH, CLOSE. Labelled.","email_subject":"Personal email subject under 10 words.","email_body":"130-160 word email. Personal opener, opportunity, CTA. Signed by ${s.agentName}${s.agencyName?` from ${s.agencyName}`:""}."}`;
      if(s.contactReason==="objection_handle") p1=`${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp objection response. Acknowledge, reframe, keep door open.","sms":"SMS objection response max 160 chars.","voice_script":"Objection handling: OPENING, REFRAME, QUESTION, CLOSE. Labelled.","email_subject":"Non-salesy subject under 9 words.","email_body":"130-150 word email handling objection. Signed by ${s.agentName}."}`;
      if(s.contactReason==="referral_request") p1=`${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word referral request WhatsApp. Warm, celebrate success, ask naturally.","sms":"Referral SMS max 160 chars.","voice_script":"Referral call: OPENING, CELEBRATION, ASK, CLOSE. Labelled.","email_subject":"Referral subject under 9 words.","email_body":"120-140 word referral email. Signed by ${s.agentName}."}`;
      if(s.contactReason==="anniversary") p1=`${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word anniversary WhatsApp. Warm, celebratory, no hard sell.","sms":"Anniversary SMS max 160 chars.","voice_script":"Anniversary call: OPENING, UPDATE, CHECK-IN, SOFT CTA. Labelled.","email_subject":"Anniversary subject under 9 words.","email_body":"120-140 word anniversary email. Signed by ${s.agentName}."}`;
      const part1 = await safeClaude(p1, SYSTEM, 1500)

      update({loadingMsg:"✦ Writing letter & follow-ups..."})
      let p2 = `${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"formal_letter":"Full formal letter 260-300 words. Dear ${s.clientName}, 4 paragraphs. Sign: Warm regards,\\n${s.agentName}${s.agencyName?`\\n${s.agencyName}`:""}${s.agentPhone?`\\n${s.agentPhone}`:""}","followup_1":"Follow-up Day 3. 50-60 words.","followup_2":"Follow-up Week 1. 50-60 words.","followup_3":"Follow-up Week 2. 40-50 words.","followup_4":"Follow-up Month 1. 40-50 words."}`;
      const part2 = await safeClaude(p2, SYSTEM, 1600)

      update({loadingMsg:"✦ Building schedule..."})
      const p3 = `CLIENT: ${s.clientName} | TYPE: ${s.clientType} | REASON: ${s.contactReason}\n\nReturn ONLY JSON:\n{"schedule":[{"day":"Today — First Contact","icon":"🚀","tasks":["Send the WhatsApp message","If no reply after 2 hours, send SMS","Save client in CRM with today's date"]},{"day":"Day 3 — First Follow-Up","icon":"💬","tasks":["Send Follow-Up #1 if no reply","Check if they opened your email","Note response in CRM"]},{"day":"Day 7 — Week 1","icon":"📞","tasks":["Send Follow-Up #2 with new angle","Make a phone call","Listen first — ask questions before pitching"]},{"day":"Day 14 — Two Week Touch","icon":"🔄","tasks":["Send Follow-Up #3 — casual, no pressure","Share relevant market update if available","Update CRM"]},{"day":"Day 30 — Monthly Touch","icon":"🌱","tasks":["Send Follow-Up #4 — final warm message","Move to monthly newsletter if still no reply","Do not give up — timing is everything"]},{"day":"Ongoing","icon":"📅","tasks":["Add to monthly market update list","Check in every 90 days for long-term leads"]}]}`
      const part3 = await safeClaude(p3, SYSTEM, 1200)

      const result = {...part1,...part2,...part3}
      update({result, activeTab:"messages"})
      SF.addClient({clientName:s.clientName, clientType:s.clientType, contactReason:s.contactReason, language:s.language, agentName:s.agentName, result})
    } catch(err) { update({error:"Error: "+err.message}) }
    update({loading:false})
  }

  // ── RESULTS VIEW ─────────────────────────────────────────
  if (s.result) {
    return (
      <div style={{minHeight:"100vh",background:G.bg}}>
        <div style={{background:G.bg1,borderBottom:`1px solid ${G.border}`,padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000"}}>
          <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:G.white}}>STREAM<span style={{color:G.aqua}}>FLUX</span></span>
          <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>← Dashboard</button>
        </div>
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"22px 16px 60px"}}>
          <p style={{color:G.muted,fontSize:"13px",margin:"0 0 18px"}}>Every message personalised for {s.clientName} in {s.language}.</p>
          {/* Tabs */}
          <div style={{display:"flex",gap:"4px",marginBottom:"20px",flexWrap:"wrap",background:G.bg1,padding:"4px",borderRadius:"10px",border:`1px solid ${G.aquaBorder}`}}>
            {TABS_EN.map(tab=>(
              <button key={tab.id} onClick={()=>update({activeTab:tab.id})}
                style={{background:s.activeTab===tab.id?G.aqua:"#0d0d0d",color:s.activeTab===tab.id?"#060608":G.muted,border:s.activeTab===tab.id?`1px solid ${G.border2}`:"1px solid transparent",borderRadius:"8px",padding:"7px 12px",fontSize:"11px",fontWeight:s.activeTab===tab.id?"700":"500",fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab content */}
          {s.activeTab==="messages" && <><CopyCard title="WhatsApp" content={s.result.whatsapp} icon="💬" lang={s.language}/><CopyCard title="SMS" content={s.result.sms} icon="📱" lang={s.language}/></>}
          {s.activeTab==="voice" && <><p style={{color:G.muted,fontSize:"13px",margin:"0 0 12px"}}>Read naturally — don't sound like you're reading a script.</p><CopyCard title="Phone Call Script" content={s.result.voice_script} icon="🎙️" lang={s.language}/></>}
          {s.activeTab==="email" && <><CopyCard title="Email Subject" content={s.result.email_subject} icon="📧" lang={s.language}/><CopyCard title="Email Body" content={s.result.email_body} icon="📨" lang={s.language}/></>}
          {s.activeTab==="letter" && <><p style={{color:G.muted,fontSize:"13px",margin:"0 0 12px"}}>Replace anything in brackets before printing.</p><CopyCard title="Formal Letter" content={s.result.formal_letter} icon="✉️" lang={s.language}/></>}
          {s.activeTab==="followups" && (
            <>
              <p style={{color:G.muted,fontSize:"13px",margin:"0 0 12px"}}>Send in order if no reply.</p>
              <CopyCard title="Follow-Up #1" content={s.result.followup_1} icon="💬" lang={s.language}/>
              <CopyCard title="Follow-Up #2" content={s.result.followup_2} icon="💬" lang={s.language}/>
              <CopyCard title="Follow-Up #3" content={s.result.followup_3} icon="💬" lang={s.language}/>
              <CopyCard title="Follow-Up #4" content={s.result.followup_4} icon="💬" lang={s.language}/>
              {/* Regen box */}
              <div style={{background:"rgba(42,184,212,0.08)",border:"1.5px solid rgba(42,184,212,0.4)",borderRadius:"10px",padding:"18px",marginTop:"20px"}}>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:G.aqua,marginBottom:"6px"}}>✨ What Happened After Your First Message?</div>
                <p style={{fontSize:"12px",color:"rgba(42,184,212,0.85)",marginBottom:"10px",lineHeight:"1.6"}}>Describe what happened. The AI will generate 4 brand new follow-ups tailored to exactly what happened.</p>
                <textarea placeholder="e.g. She replied and said she liked it but her husband isn't convinced..." rows={3}
                  value={s.regenContext} onChange={e=>update({regenContext:e.target.value})}
                  style={{...inputStyle,resize:"vertical",borderColor:"rgba(42,184,212,0.4)",background:"#0d0d0d",marginBottom:"10px"}}/>
                <button onClick={async()=>{
                  if(!s.regenContext||s.regenLoading) return
                  update({regenLoading:true})
                  try {
                    const prompt = `Original context: CLIENT ${s.clientName} | ${s.contactReason}\nWhat happened: ${s.regenContext}\n\nGenerate 4 fresh follow-up messages. Return ONLY JSON:\n{"followup_1":"New Day 3 follow-up. 50-60 words.","followup_2":"New Week 1 follow-up. 50-60 words.","followup_3":"New Week 2 follow-up. 40-50 words.","followup_4":"New Month 1 follow-up. 40-50 words."}`
                    const regen = await apiClaude(prompt, "You are an elite real estate sales coach. Return ONLY raw JSON.", 800)
                    update({result:{...s.result,...regen}, regenContext:""})
                  } catch(e) { update({error:"Regeneration failed: "+e.message}) }
                  update({regenLoading:false})
                }} style={{...btnStyle(s.regenLoading),background:s.regenLoading?"#1a1a1a":G.aqua,color:s.regenLoading?G.muted:"#fff",width:"100%"}}>
                  {s.regenLoading?"Regenerating...":"✦ Regenerate Follow-Ups"}
                </button>
              </div>
            </>
          )}
          {s.activeTab==="schedule" && s.result.schedule && (
            <>
              <p style={{color:G.muted,fontSize:"13px",margin:"0 0 18px"}}>Your exact follow-up plan for {s.clientName}.</p>
              {s.result.schedule.map((day,i)=>(
                <div key={i} style={{background:G.bg1,border:`1px solid ${G.border2}`,borderRadius:"10px",padding:"14px 16px",marginBottom:"8px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                    <span style={{fontSize:"20px"}}>{day.icon}</span>
                    <span style={{fontSize:"14px",fontWeight:"700",color:G.aqua}}>{day.day}</span>
                  </div>
                  {(day.tasks||[]).map((t,j)=>(
                    <div key={j} style={{display:"flex",gap:"8px",marginBottom:"6px"}}>
                      <span style={{color:G.aqua,fontWeight:"700",flexShrink:"0"}}>→</span>
                      <span style={{fontSize:"14px",color:"#ccc",lineHeight:"1.6"}}>{t}</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          <button onClick={()=>update({result:null,...initState(),language:s.language})} style={{...btnStyle(false),marginTop:"16px"}}>← New Client</button>
        </div>
      </div>
    )
  }

  // ── FORM VIEW ─────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      {/* Nav */}
      <div style={{background:G.bg1,borderBottom:`1px solid ${G.border}`,padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000"}}>
        <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:G.white}}>STREAM<span style={{color:G.aqua}}>FLUX</span></span>
        <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>← Dashboard</button>
      </div>

      <div style={{maxWidth:"660px",margin:"0 auto",padding:"30px 18px 60px"}}>

        {/* Language */}
        <div style={{...cardStyle,marginBottom:"8px"}}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:G.white}}>🌐 Output Language</h2>
          <select value={s.language} onChange={e=>update({language:e.target.value,contactReason:""})} style={{...inputStyle,cursor:"pointer"}}>
            <option value="English">🇺🇸 English</option>
            <option value="Spanish">🇪🇸 Español</option>
          </select>
        </div>

        {/* Client info */}
        <div style={cardStyle}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>👤 Who Are You Contacting?</h2>
          <Field label="Client First Name" value={s.clientName} onChange={v=>update({clientName:v})} placeholder={isSpa?"María":"Sarah"}/>
          <Chips label="Client Type" options={CLIENT_TYPES_EN} selected={s.clientType} onToggle={v=>update({clientType:v,contactReason:""})} single/>
          <Chips label="Reason for Contacting" options={CONTACT_REASONS} selected={s.contactReason} onToggle={v=>update({contactReason:v,marketDirection:[],marketInsight:"",financingNews:"",lookingFor:"",leadSource:null,soldNearbyAddress:"",soldNearbyPrice:"",soldNearbyBeds:"",soldNearbyBaths:"",soldNearbyType:"",daysOnMarket:"",priceReasons:[],expOrigPrice:"",expDays:"",expiredReasons:[],preListingItems:[],originalTimeline:"",buyerBudget:"",buyerType:""})} single/>
          <Chips label="Urgency Level" options={URGENCY_EN} selected={s.urgency} onToggle={v=>update({urgency:v})} single/>
          <Chips label="Communication Tone" options={TONES_EN} selected={s.tone} onToggle={v=>update({tone:v})} single/>
        </div>

        {/* Objection card */}
        {s.contactReason==="objection_handle" && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🛡️ What Objection Did They Raise?</h2>
            <Chips options={isSeller()?[{value:"price_too_low",label:"Price Too Low"},{value:"not_right_time",label:"Not the Right Time"},{value:"already_have_agent",label:"Already Have an Agent"},{value:"need_more_time",label:"Need More Time"},{value:"market_too_slow",label:"Market Too Slow"},{value:"want_fsbo",label:"Want to Try FSBO"},{value:"not_ready",label:"Not Ready to Sell"},{value:"thinks_worth_more",label:"Think It's Worth More"}]:[{value:"too_expensive",label:"Too Expensive"},{value:"not_interested",label:"Not Interested"},{value:"happy_where_i_am",label:"Happy Where I Am"},{value:"already_have_agent",label:"Already Have an Agent"},{value:"need_more_time",label:"Need More Time"},{value:"bad_timing",label:"Bad Timing"}]} selected={s.objection} onToggle={v=>update({objection:v})} single/>
          </div>
        )}

        {/* Anniversary */}
        {s.contactReason==="anniversary" && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:G.white}}>🎉 Anniversary Details</h2>
            <Field label="Years Since Purchase" type="number" value={s.anniversaryYears} onChange={v=>update({anniversaryYears:v})} placeholder="1"/>
          </div>
        )}

        {/* ── WORKFLOW CARDS ─────────────────────────────── */}

        {/* Market Update */}
        {isMarketUpdate && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>📊 Market Data</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>The AI will use this to personalise every message with real market context.</p>
            <Field label="City / Market Area" value={s.marketLocation} onChange={v=>update({marketLocation:v})} placeholder="e.g. Miami Beach, South Florida"/>
            <Chips label="Market Direction" options={["📈 Rising","📊 Stable","📉 Cooling","🔥 High Demand","📦 Low Inventory","⏱️ Good Opportunities"]} selected={s.marketDirection} onToggle={v=>update({marketDirection:tog(s.marketDirection,v)})}/>
            <TextArea label="Your Market Insight (optional)" value={s.marketInsight} onChange={v=>update({marketInsight:v})} placeholder="e.g. Prices up 3% this month in South Beach, inventory tightening..." rows={3}/>
          </div>
        )}

        {/* Financing Update */}
        {isFinancingUpdate && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>💰 Financing Update</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>What's changed with rates or financing conditions?</p>
            <TextArea label="Financing News" value={s.financingNews} onChange={v=>update({financingNews:v})} placeholder="e.g. Rates dropped to 6.2%, Fed cut rates by 0.25%, qualifying is easier now..." rows={4}/>
          </div>
        )}

        {/* First Contact Seller */}
        {isFirstContactSeller && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>📋 Contact Details</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Tell us more about this lead to personalise every message.</p>
            <Chips label="How Did You Get This Lead?" options={[{value:"door_knock",label:"🚪 Door Knock"},{value:"cold_call",label:"📞 Cold Call"},{value:"referral",label:"👥 Referral"},{value:"online_lead",label:"🌐 Online Lead"},{value:"direct_mail",label:"📮 Direct Mail"},{value:"area_farming",label:"🏘️ Area Farming"}]} selected={s.leadSource} onToggle={v=>update({leadSource:v})} single/>
            <TextArea label="What You Know About Their Property" value={s.knownAboutProperty} onChange={v=>update({knownAboutProperty:v})} placeholder="e.g. 3-bed on Oak Street, has been sitting a while, visible garden needs work..." rows={3}/>
          </div>
        )}

        {/* Reconnect */}
        {isReconnect && !isFirstContactSeller && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🔄 Reconnecting</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Help the AI recall the context of this relationship.</p>
            <TextArea label="What Were They Looking For?" value={s.lookingFor} onChange={v=>update({lookingFor:v})} placeholder="e.g. They wanted to sell in spring but delayed. Looking for a 4-bed house with garden..." rows={4}/>
          </div>
        )}

        {/* Just Sold / Neighbour Sale */}
        {isSoldNearby && (
          <div style={{...cardStyle,background:"rgba(42,184,212,0.04)",border:"1px solid rgba(42,184,212,0.2)"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🏘️ Sold Property Details</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>The AI will use this data to show your command of the local market.</p>
            <Field label="Address of Sold Property" value={s.soldNearbyAddress} onChange={v=>update({soldNearbyAddress:v})} placeholder="e.g. 14 Maple Street, Austin TX"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"10px"}}>
              {[["soldNearbyPrice","Sold Price ($)","485,000"],["soldNearbyBeds","Beds","3"],["soldNearbyBaths","Baths","2"],["soldNearbyType","Type","Condo"]].map(([key,label,ph])=>(
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input type="text" placeholder={ph} style={inputStyle} value={s[key]||""} onChange={e=>update({[key]:e.target.value})}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Discussion */}
        {isPriceDiscussion && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>💬 Price Discussion</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>The AI will frame the price reduction with data and empathy.</p>
            <Field label="Days on Market" type="number" value={s.daysOnMarket} onChange={v=>update({daysOnMarket:v})} placeholder="45"/>
            <Chips label="Why Consider a Reduction?" options={["No offers yet","Similar homes sold lower","Market shifting","Showings but no offers","Overpriced vs market","Too much competition"]} selected={s.priceReasons} onToggle={v=>update({priceReasons:tog(s.priceReasons,v)})}/>
          </div>
        )}

        {/* Expired Listing */}
        {isExpiredListing && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>📋 Expired Listing Details</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>The AI will position your services as the solution.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div><label style={labelStyle}>Original Asking Price ($)</label><input type="text" placeholder="680,000" style={inputStyle} value={s.expOrigPrice||""} onChange={e=>update({expOrigPrice:e.target.value})}/></div>
              <div><label style={labelStyle}>Days Listed</label><input type="number" placeholder="90" style={inputStyle} value={s.expDays||""} onChange={e=>update({expDays:e.target.value})}/></div>
            </div>
            <Chips label="Why Do You Think It Didn't Sell?" options={["Overpriced","Poor marketing","Bad timing","Needs repairs","Wrong agent","Poor presentation","Market shifted"]} selected={s.expiredReasons} onToggle={v=>update({expiredReasons:tog(s.expiredReasons,v)})}/>
          </div>
        )}

        {/* Pre-Listing */}
        {isPreListing && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>✅ Pre-Listing Preparation</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Select what you're recommending. The AI will personalise every message around the prep plan.</p>
            <Chips label="Recommended Items" options={["📸 Professional Photos","🎨 Home Staging","🔧 Minor Repairs","🧹 Deep Clean","📦 Declutter","💎 Value Improvements","🏡 Kitchen / Bath Update","🌿 Curb Appeal","🎬 Virtual Tour","📐 Floor Plan","💡 New Lighting","🚪 Interior Paint"]} selected={s.preListingItems} onToggle={v=>update({preListingItems:tog(s.preListingItems,v)})}/>
          </div>
        )}

        {/* Timeline Check-In */}
        {isTimelineCheckin && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>📅 Timeline Check-In</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>The AI will reference the original plan vs current situation for a highly relevant message.</p>
            <Field label="When Did They Originally Want to Sell?" value={s.originalTimeline} onChange={v=>update({originalTimeline:v})} placeholder="e.g. Spring 2024, 6 months ago..."/>
          </div>
        )}

        {/* Buyer Match */}
        {isBuyerMatch && isSeller() && (
          <div style={{...cardStyle,background:"rgba(42,184,212,0.04)",border:"1px solid rgba(42,184,212,0.2)"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🎯 Buyer Profile</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Including buyer details makes the message much more compelling.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div><label style={labelStyle}>Buyer's Budget</label><input type="text" placeholder="e.g. $500K–$650K" style={inputStyle} value={s.buyerBudget||""} onChange={e=>update({buyerBudget:e.target.value})}/></div>
              <div><label style={labelStyle}>Buyer Type</label><input type="text" placeholder="e.g. Young family, works from home" style={inputStyle} value={s.buyerType||""} onChange={e=>update({buyerType:e.target.value})}/></div>
            </div>
          </div>
        )}

        {/* CMA Form */}
        {isCMA && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🏡 Comparative Market Analysis (CMA)</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"18px"}}>Enter the client's property and up to 3 recent comparable sales.</p>
            <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color:G.aqua,marginBottom:"10px"}}>🏠 Subject Property</div>
            <Field label="Address" value={s.cmaSubject.address} onChange={v=>update({cmaSubject:{...s.cmaSubject,address:v}})} placeholder="123 Main St, Miami FL"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
              {[["beds","Beds","3"],["baths","Baths","2"],["sqft","Sq Ft","1,800"]].map(([k,l,p])=>(
                <div key={k}><label style={labelStyle}>{l}</label><input type="text" placeholder={p} style={inputStyle} value={s.cmaSubject[k]||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,[k]:e.target.value}})}/></div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginTop:"10px"}}>
              <div><label style={labelStyle}>Estimated Value ($)</label><input type="text" placeholder="450,000" style={inputStyle} value={s.cmaSubject.price||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,price:e.target.value}})}/></div>
              <div><label style={labelStyle}>Condition</label><input type="text" placeholder="Good condition, updated kitchen" style={inputStyle} value={s.cmaSubject.condition||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,condition:e.target.value}})}/></div>
            </div>
            <div style={{marginTop:"10px",marginBottom:"16px"}}>
              <label style={labelStyle}>Key Features</label>
              <input type="text" placeholder="Pool, garden, double garage" style={inputStyle} value={s.cmaSubject.features||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,features:e.target.value}})}/>
            </div>
            {s.cmaComps.map((comp,i)=>(
              <div key={i}>
                <div style={{height:"1px",background:G.border,margin:"8px 0 16px"}}/>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color:G.aqua,marginBottom:"10px"}}>📊 Comparable {i+1}</div>
                <Field label="Address" value={comp.address} onChange={v=>{const c=[...s.cmaComps];c[i]={...c[i],address:v};update({cmaComps:c})}} placeholder={`${100+i*10} Nearby St, Miami`}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
                  {[["salePrice","Sale Price ($)","430,000"],["saleDate","Sale Date","Jan 2025"],["sqft","Sq Ft","1,750"]].map(([k,l,p])=>(
                    <div key={k}><label style={labelStyle}>{l}</label><input type="text" placeholder={p} style={inputStyle} value={comp[k]||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],[k]:e.target.value};update({cmaComps:c})}}/></div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginTop:"10px"}}>
                  {[["beds","Beds","3"],["baths","Baths","2"],["condition","Condition","Good"]].map(([k,l,p])=>(
                    <div key={k}><label style={labelStyle}>{l}</label><input type="text" placeholder={p} style={inputStyle} value={comp[k]||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],[k]:e.target.value};update({cmaComps:c})}}/></div>
                  ))}
                </div>
                <div style={{marginTop:"10px"}}>
                  <label style={labelStyle}>Key Differences</label>
                  <input type="text" placeholder="No pool, original kitchen" style={inputStyle} value={comp.notes||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],notes:e.target.value};update({cmaComps:c})}}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Property Card */}
        {!isCMA && !isNoPropertyReason && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>
              {isSoldNearby ? "🏘️ Property Sold Nearby" : isBuyer() ? "🏠 Property You're Offering" : "🏠 Their Property"}
            </h2>
            <Field label="Property Address" value={s.propAddress} onChange={v=>update({propAddress:v})} placeholder="42 Palm Drive, Miami Beach, FL 33139"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div><label style={labelStyle}>Asking Price ($)</label><input type="text" placeholder="1,100,000" style={inputStyle} value={s.propPrice||""} onChange={e=>update({propPrice:e.target.value})}/></div>
              <div><label style={labelStyle}>Property Type</label><input type="text" placeholder="4-bed villa with pool" style={inputStyle} value={s.propType||""} onChange={e=>update({propType:e.target.value})}/></div>
            </div>
            {showFullFeatures && (
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",marginTop:"12px"}}>
                  {[["propBeds","Beds","4"],["propBaths","Baths","3"],["propSqft","Sq Ft","2,400"]].map(([key,label,ph])=>(
                    <div key={key}><label style={labelStyle}>{label}</label><input type="text" placeholder={ph} style={inputStyle} value={s[key]||""} onChange={e=>update({[key]:e.target.value})}/></div>
                  ))}
                </div>
                <Chips label="Interior Features" options={["Open Plan Living","High Ceilings","Hardwood Floors","Modern Kitchen","Chef's Kitchen","Kitchen Island","High-End Appliances","Master Suite","Walk-in Wardrobe","En-suite Bathrooms","Sauna","Home Office","Media Room","Indoor Gym","Fireplace","Wet Bar","Smart Home System","Solar Panels","Underfloor Heating","Private Elevator"]} selected={s.propInterior} onToggle={v=>update({propInterior:tog(s.propInterior,v)})}/>
                <Chips label="Outdoor Features" options={["Private Pool","Infinity Pool","Hot Tub","Rooftop Terrace","Private Garden","Full Outdoor Kitchen","BBQ / Grill","Private Boat Dock","Private Beach Access","Tennis Court","Padel Court","Guest House","Garage (2 Car)","Garage (3+ Car)","EV Charging","Gated Entry"]} selected={s.propOutdoor} onToggle={v=>update({propOutdoor:tog(s.propOutdoor,v)})}/>
                <Chips label="Building Amenities" options={["24/7 Concierge","Rooftop Pool","Full Fitness Center","Yoga Studio","Spa","Co-working Space","Community Cinema","Dog Park","Pet-Friendly","Low HOA Fees","No HOA","Covered Parking","EV Charging in Parking","LEED Certified"]} selected={s.propBuilding} onToggle={v=>update({propBuilding:tog(s.propBuilding,v)})}/>
              </>
            )}
            <TextArea label="Key Highlights" value={s.propHighlights} onChange={v=>update({propHighlights:v})} placeholder="Ocean views, private pool, just reduced by $50K" rows={2} hint="Top 2-3 things perfect for this client"/>
          </div>
        )}

        {/* Buyer Criteria */}
        {showBuyerCriteria && !isMatcher() && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🔍 Buyer Criteria</h2>
            <Chips options={BUYER_CRITERIA_EN} selected={s.buyerCriteria} onToggle={v=>update({buyerCriteria:tog(s.buyerCriteria,v)})}/>
          </div>
        )}

        {/* Seller Situation */}
        {isSeller() && (
          <div style={{...cardStyle,background:"rgba(42,184,212,0.03)",border:`1px solid rgba(42,184,212,0.15)`}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🏷️ Seller Situation</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"14px",lineHeight:"1.6"}}>Select all that apply — the AI tailors every message to their exact situation:</p>
            <Chips options={SELLER_SITUATION_EN} selected={s.sellerSituation} onToggle={v=>update({sellerSituation:tog(s.sellerSituation,v)})}/>
          </div>
        )}

        {/* Personal Context */}
        <div style={{background:"rgba(42,184,212,0.08)",border:"1.5px solid rgba(42,184,212,0.4)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
          <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:G.aqua,marginBottom:"6px"}}>✨ Personal Context</div>
          <p style={{fontSize:"12px",color:"rgba(42,184,212,0.75)",marginBottom:"10px",lineHeight:"1.6"}}>Prior contact history, personal notes — anything about this client you want woven into every message.</p>
          <textarea
            placeholder="e.g. Sarah has been a lead for 2 months — very interested but hesitant. Two kids, tight timeline, husband needs convincing. Met twice. Responds well to WhatsApp."
            rows={4}
            value={s.customSituation||""}
            onChange={e=>update({customSituation:e.target.value})}
            style={{...inputStyle,resize:"vertical",borderColor:"rgba(42,184,212,0.4)",background:"#0d0d0d"}}
          />
        </div>

        {/* Agent Details */}
        <div style={cardStyle}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🏷️ Your Details</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <Field label="Your Name" value={s.agentName} onChange={v=>update({agentName:v})} placeholder="James Rivera"/>
            <Field label="Your Phone" value={s.agentPhone} onChange={v=>update({agentPhone:v})} placeholder="+1 305 555 0199"/>
          </div>
          <Field label="Agency / Company Name" value={s.agencyName} onChange={v=>update({agencyName:v})} placeholder="Rivera Real Estate Group"/>
        </div>

        {/* Error */}
        {s.error && <div style={{background:"#1a0808",border:"1px solid #3a1010",borderRadius:"8px",padding:"12px 16px",color:"#f87171",fontSize:"13px",marginBottom:"16px"}}>{s.error}</div>}

        {/* Loading */}
        {s.loading && (
          <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:"10px",padding:"18px 22px",marginBottom:"16px",textAlign:"center"}}>
            <p style={{color:G.aqua,fontSize:"14px",margin:"0",fontWeight:"600"}}>{s.loadingMsg}</p>
            <p style={{color:G.muted,fontSize:"12px",margin:"6px 0 0"}}>Generating. Please wait...</p>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={()=>{if(canGenerate()&&!s.loading) generate()}}
          style={{...btnStyle(!canGenerate()||s.loading),width:"100%",fontSize:"15px",background:canGenerate()&&!s.loading?G.aqua:"#1a1a1a",color:canGenerate()&&!s.loading?"#060608":G.muted}}
        >
          {s.loading?"Generating...":"✦ Generate Full Outreach Package"}
        </button>
        {!canGenerate() && <p style={{color:G.muted,fontSize:"12px",marginTop:"8px",textAlign:"center"}}>Fill in client name, type, contact reason, tone and your name to continue.</p>}

      </div>
    </div>
  )
}
