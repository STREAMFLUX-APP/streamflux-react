import { useState } from 'react'
import { G, GL, SF, apiClaude, inputStyle, cardStyle, labelStyle, btnStyle } from '../globals.js'
import { CopyCard } from '../components/shared/CopyCard.jsx'
import { Chips } from '../components/shared/Chips.jsx'

// ── FULL FEATURE LISTS ───────────────────────────────────
const INTERIOR_EN = ["Open Plan Living","High Ceilings","Double Height Ceilings","Exposed Beams","Hardwood Floors","Marble Floors","Porcelain Floors","Polished Concrete Floors","Radiant Floor Heating","Modern Kitchen","Chef's Kitchen","Gourmet Kitchen","Granite Countertops","Quartz Countertops","Marble Countertops","Kitchen Island","Butler's Pantry","Scullery / Second Kitchen","Stainless Steel Appliances","High-End Appliances","Wine Refrigerator","Built-in Coffee Machine","Master Suite","Suite with Terrace","Walk-in Wardrobe","His & Hers Wardrobes","En-suite Bathrooms","Double Vanity","Freestanding Soaking Tub","Jetted / Whirlpool Tub","Rainfall Shower","Frameless Glass Shower","Sauna","Steam Room","Home Office","Media Room / Cinema","Game Room","Music Room","Library / Study","Art Studio","Indoor Gym","Flex / Bonus Room","Fireplace","Double-Sided Fireplace","Wet Bar","Climate-Controlled Wine Cellar","Tasting Room","Laundry Room","Laundry Room with Sink","Finished Basement","Finished Attic / Loft","Smart Home System","Multi-Zone Audio","Smart Lighting","Motorized Blinds / Shades","Smart Thermostat","Video Intercom","App-Controlled Home","Cat6 / Fibre Wiring","Security Alarm System","Surveillance Cameras","Fingerprint / Keypad Entry","Built-in Safe","Solar Panels","Solar Battery Storage","Whole-Home Generator","Premium Insulation","Triple-Glazed Windows","Underfloor Heating","Multi-Zone A/C","Heat Recovery Ventilation","Wheelchair Accessible","Private Elevator","Access Ramp","Adapted Bathroom","Wide Doorways"]
const OUTDOOR_EN = ["Private Pool","Heated Pool","Infinity Pool","Overflow Pool","Pool with Waterfall","Natural / Bio Pool","Hot Tub / Outdoor Spa","Outdoor Shower","Rooftop Terrace","Terrace with Views","Covered Patio / Pergola","Rear Patio","Front Porch","Private Garden","Landscaped Yard","Zen Garden","Tropical Garden","Winter Garden / Greenhouse","Full Outdoor Kitchen","Built-in BBQ / Grill","Wood-Fired Pizza Oven","Fire Pit / Outdoor Fireplace","Outdoor Bar","Outdoor Dining Area","Private Boat Dock","Marina Slip","Boat Launch Ramp","Boat Storage","Private Beach Access","Private Ocean Access","Private Lake Access","Tennis Court","Padel Court","Basketball Court","Putting Green","Boules / Petanque Court","Playground / Play Area","Guest House / Casita","Pool House","Garden Studio / Office","Garage (1 Car)","Garage (2 Car)","Garage (3+ Car)","Boat / RV Garage","Workshop / Storage","EV Charging Station","Gated Entry","Automatic Gate","Outdoor Security Cameras","Landscape Lighting","Solar Lighting","Paved Driveway","Green Roof","Vegetable Garden / Orchard","Private Well","Automated Irrigation System","Running / Jogging Track"]
const BUILDING_EN = ["24/7 Concierge Service","Digital Concierge","Doorman","Overnight Doorman","Valet Parking","24/7 Security","Private Security Guard","Access Control System","Key Fob / App Access","Rooftop Pool","Indoor Pool","Outdoor Community Pool","Jacuzzi / Hot Tub Area","Sundeck / Solarium","Private Beach Club","Full Fitness Center","Yoga Studio","Pilates Studio","Boxing Gym","Squash Court","Full-Service Spa","Shared Sauna","Massage Room","Beauty Salon","Co-working Space","Meeting Rooms","Conference Center","Business Center","Community Library","Community Cinema","Party / Event Room","Social Lounge","Community Rooftop Terrace","BBQ Area","Children's Play Area","Dog Park","Pet-Friendly","Pet Care Services","Housekeeping Service","Laundry Service","Private Storage Unit","Bike Storage","Low HOA Fees","No HOA","Utilities Included","Maintenance Service Included","Covered Parking","Double Parking","Visitor Parking","EV Charging in Parking","LEED Certified","Energy Class A Building","BREEAM Certified","Community Solar Panels","Disability Access","High-Capacity Elevator","Smart Package Lockers","Bike Share / E-Bike Program"]

// ── CONTACT REASONS ──────────────────────────────────────
const REASONS_BUYER_EN = [
  {value:"new_listing",label:"New Listing Match",desc:"Property matches their criteria"},
  {value:"price_drop",label:"Price Reduction",desc:"Property they liked dropped in price"},
  {value:"first_contact",label:"First Outreach",desc:"Never contacted before"},
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"open_house",label:"Open House Invite",desc:"Invite to view a property"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"off_market",label:"Off-Market Deal",desc:"Exclusive property opportunity"},
  {value:"viewing_followup",label:"Viewing Follow-Up",desc:"After showing a property"},
  {value:"financing_update",label:"Financing Update",desc:"Rates or terms changed"},
  {value:"offer_strategy",label:"Offer Strategy",desc:"Ready to make an offer"},
  {value:"objection_handle",label:"Handle Objection",desc:"They said no"},
]
const REASONS_SELLER_EN = [
  {value:"first_contact",label:"First Outreach",desc:"Never contacted before"},
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"free_valuation",label:"Free Valuation Offer",desc:"No obligation appraisal"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"just_sold",label:"Property Sold Nearby",desc:"Builds credibility"},
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
  {value:"just_sold",label:"Property Sold Nearby",desc:"Builds credibility"},
  {value:"free_valuation",label:"Free Valuation Offer",desc:"No obligation appraisal"},
  {value:"re_engagement",label:"Re-Engagement",desc:"Last attempt to reconnect"},
  {value:"objection_handle",label:"Handle Objection",desc:"They said no"},
]
const REASONS_PAST_EN = [
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"referral_request",label:"Referral Request",desc:"Ask after closing a deal"},
  {value:"anniversary",label:"Home Anniversary",desc:"1 year+ since they bought"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"just_sold",label:"Property Sold Nearby",desc:"Builds credibility"},
  {value:"market_value_update",label:"Market Value Update",desc:"Their home is worth more now"},
  {value:"neighbourhood_news",label:"Neighbourhood News",desc:"Something affecting their property"},
  {value:"objection_handle",label:"Handle Objection",desc:"They said no"},
]

const CLIENT_TYPES_EN = [
  {value:"buyer_active",label:"🔥 Active Buyer",desc:"Looking now, ready to move"},
  {value:"buyer_passive",label:"👀 Passive Buyer",desc:"Interested but not urgent"},
  {value:"seller_motivated",label:"⚡ Motivated Seller",desc:"Wants to sell fast"},
  {value:"seller_exploring",label:"🤔 Exploring Seller",desc:"Considering selling"},
  {value:"investor",label:"💰 Investor",desc:"ROI-focused opportunity"},
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
const TABS_EN = [
  {id:"messages",label:"💬 Messages"},{id:"voice",label:"🎙️ Voice"},
  {id:"email",label:"📧 Email"},{id:"letter",label:"✉️ Letter"},
  {id:"followups",label:"🔄 Follow-Ups"},{id:"schedule",label:"📅 Schedule"},
]
const SYSTEM = "You are an elite real estate sales coach. You MUST respond with ONLY a raw valid JSON object. Start with { end with }. No markdown. No backticks. No explanation."

// ── INITIAL STATE ────────────────────────────────────────
const initState = (lang) => ({
  language:lang||"English", clientName:"", clientType:"", contactReason:"",
  urgency:"", tone:"", objection:"", objectionText:"",
  propAddress:"", propPrice:"", propOldPrice:"", propNewPrice:"", propType:"",
  propBeds:"", propBaths:"", propSqft:"", propCondition:"", propHighlights:"",
  propInterior:[], propOutdoor:[], propBuilding:[],
  buyerCriteria:[], buyerNeeds:"",
  sellerSituation:[],
  // sold nearby
  soldAddress:"", soldPrice:"", soldBeds:"", soldBaths:"", soldType:"",
  soldDaysOnMarket:"", soldAboveBelow:"", soldDate:"", soldCondition:"",
  clientPropAddress:"", clientPropPrice:"", clientPropBeds:"", clientPropBaths:"",
  clientPropSqft:"", clientPropYearsOwned:"", clientPropCondition:"",
  // market
  marketLocation:"", marketDirection:[], marketInsight:"", marketStats:"",
  // financing
  financingOptions:[], financingNews:"",
  // reconnect
  reconnectSituation:[], lookingFor:"",
  // first contact
  introStyle:[], introComeAcross:[], leadSource:null, knownAboutProperty:"",
  // price discussion
  daysOnMarket:"", priceReasons:[], sellerUrgency:[],
  // expired
  expOrigPrice:"", expDays:"", expiredReasons:[], relistStrategy:[],
  relistDifferent:"",
  // pre-listing
  preListingItems:[],
  // timeline
  originalTimeline:"", timelineChanges:[], timelineEmotion:[], newTimeline:"",
  timelineContext:"",
  // buyer match
  buyerBudget:"", buyerType:"", buyerWants:[],
  // offer strategy
  offerBudget:"", offerPosition:[], offerLevers:[], offerMarket:[], sellerPriorities:"",
  // fsbo
  fsboReasons:"", fsboAdvantages:[],
  // anniversary
  anniversaryYears:"",
  // CMA
  cmaSubject:{address:"",price:"",beds:"",baths:"",sqft:"",yearBuilt:"",parking:"",condition:"",recentRenovations:"",hoaFees:"",features:""},
  cmaComps:[
    {address:"",salePrice:"",saleDate:"",daysOnMarket:"",beds:"",baths:"",sqft:"",pricePerSqft:"",aboveBelow:"",condition:"",notes:""},
    {address:"",salePrice:"",saleDate:"",daysOnMarket:"",beds:"",baths:"",sqft:"",pricePerSqft:"",aboveBelow:"",condition:"",notes:""},
    {address:"",salePrice:"",saleDate:"",daysOnMarket:"",beds:"",baths:"",sqft:"",pricePerSqft:"",aboveBelow:"",condition:"",notes:""},
  ],
  agentName:"", agentPhone:"", agencyName:"",
  customSituation:"",
  regenContext:"", regenLoading:false,
  loading:false, loadingMsg:"", result:null, error:"", activeTab:"messages",
})

// ── SHARED STYLES ────────────────────────────────────────
const inp = {width:"100%",background:"#060608",border:"1px solid #252530",borderRadius:"8px",color:"rgba(255,255,255,0.65)",fontSize:"14px",padding:"11px 14px",outline:"none",fontFamily:"inherit",boxSizing:"border-box",WebkitTextFillColor:"rgba(255,255,255,0.55)"}
const lbl = {display:"block",fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",color:"#ffffff",textTransform:"uppercase",marginBottom:"5px"}
const card = {background:"#0c0c10",border:"1px solid #252530",borderRadius:"12px",padding:"22px",marginBottom:"16px"}
// Personal context box uses GREY not aqua
const contextBoxStyle = {background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}

// ── PROP FEATURES CARD ───────────────────────────────────
function PropCard({ s, update, tog, title, showFullFeatures }) {
  return (
    <div style={card}>
      <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>{title||"🏠 Property Details"}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
        <div><label style={lbl}>Address</label><input type="text" placeholder="42 Palm Drive, Miami FL" style={inp} value={s.propAddress||""} onChange={e=>update({propAddress:e.target.value})}/></div>
        <div><label style={lbl}>Property Type</label><input type="text" placeholder="Villa, Apartment, Condo..." style={inp} value={s.propType||""} onChange={e=>update({propType:e.target.value})}/></div>
        <div><label style={lbl}>Asking Price ($)</label><input type="text" placeholder="1,200,000" style={inp} value={s.propPrice||""} onChange={e=>update({propPrice:e.target.value})}/></div>
        <div><label style={lbl}>Condition</label><input type="text" placeholder="Good, renovated kitchen" style={inp} value={s.propCondition||""} onChange={e=>update({propCondition:e.target.value})}/></div>
        <div><label style={lbl}>Beds</label><input type="text" placeholder="4" style={inp} value={s.propBeds||""} onChange={e=>update({propBeds:e.target.value})}/></div>
        <div><label style={lbl}>Baths</label><input type="text" placeholder="3" style={inp} value={s.propBaths||""} onChange={e=>update({propBaths:e.target.value})}/></div>
      </div>
      <div style={{marginBottom:"12px"}}><label style={lbl}>Size (sq ft)</label><input type="text" placeholder="2,400" style={inp} value={s.propSqft||""} onChange={e=>update({propSqft:e.target.value})}/></div>
      {showFullFeatures && <>
        <Chips label="Interior Features" options={INTERIOR_EN} selected={s.propInterior} onToggle={v=>update({propInterior:tog(s.propInterior,v)})}/>
        <Chips label="Outdoor Features" options={OUTDOOR_EN} selected={s.propOutdoor} onToggle={v=>update({propOutdoor:tog(s.propOutdoor,v)})}/>
        <Chips label="Building Amenities" options={BUILDING_EN} selected={s.propBuilding} onToggle={v=>update({propBuilding:tog(s.propBuilding,v)})}/>
      </>}
      <div style={{marginTop:"4px"}}><label style={lbl}>Key Highlights</label>
        <textarea placeholder="Top 2-3 things that make this property stand out..." rows={2} style={{...inp,resize:"vertical"}} value={s.propHighlights||""} onChange={e=>update({propHighlights:e.target.value})}/>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────
export default function App2({ state: appState, setScreen }) {
  const [s, setS] = useState(initState(appState.lang))
  const update = u => setS(prev=>({...prev,...u}))
  const tog = (arr,val) => arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]

  const isSpa = s.language==="Spanish"
  const isBuyer = () => s.clientType.includes("buyer")||s.clientType==="investor"
  const isSeller = () => s.clientType.includes("seller")
  const canGenerate = () => s.clientName&&s.clientType&&s.contactReason

  // flags
  const isCMA = s.contactReason==="free_valuation"
  const isSoldNearby = s.contactReason==="just_sold"||s.contactReason==="neighbour_sale"
  const isMarketUpdate = s.contactReason==="market_update"
  const isFinancingUpdate = s.contactReason==="financing_update"
  const isPriceDiscussion = s.contactReason==="price_discussion"
  const isExpiredListing = s.contactReason==="expired_listing"
  const isPreListing = s.contactReason==="prelisting_prep"
  const isTimelineCheckin = s.contactReason==="timeline_checkin"
  const isBuyerMatch = s.contactReason==="buyer_match"
  const isFSBO = s.contactReason==="fsbo_outreach"
  const isReconnect = s.contactReason==="reconnect"||s.contactReason==="re_engagement"
  const isFirstContact = s.contactReason==="first_contact"
  const isOfferStrategy = s.contactReason==="offer_strategy"
  const isObjection = s.contactReason==="objection_handle"
  const isViewingFollowUp = s.contactReason==="viewing_followup"
  const isPriceDrop = s.contactReason==="price_drop"
  const isNoProperty = ["market_update","financing_update","re_engagement","referral_request","anniversary","neighbourhood_news","market_value_update","reconnect","first_contact"].includes(s.contactReason)
  const showProp = !isNoProperty && !isSoldNearby && !isCMA
  const showFullFeatures = showProp && !isObjection && !isPriceDiscussion && !isExpiredListing && !isPreListing && !isFSBO && !isBuyerMatch && !isTimelineCheckin

  const CONTACT_REASONS = isSeller()?REASONS_SELLER_EN:s.clientType==="past_client"?REASONS_PAST_EN:s.clientType==="cold_lead"?REASONS_COLD_EN:REASONS_BUYER_EN

  // ── GENERATE ─────────────────────────────────────────────
  const generate = async () => {
    update({loading:true,error:"",result:null})
    const langI = isSpa?"\n\nCRÍTICO: Escribe TODO el contenido completamente en español.":""
    const safe = async(p,s,t)=>{try{return await apiClaude(p,s,t)||{}}catch(e){return{}}}
    const ag = s.agentName||"Agent"
    const ctx = `CLIENT: ${s.clientName}|TYPE:${s.clientType}|REASON:${s.contactReason}|URGENCY:${s.urgency||"medium"}|TONE:${s.tone||"professional"}
PROPERTY: ${s.propAddress||"N/A"}|$${s.propPrice||"N/A"}|${s.propType||""}|Beds:${s.propBeds||""}|Baths:${s.propBaths||""}|${s.propHighlights||""}
${s.propInterior.length?`INTERIOR:${s.propInterior.slice(0,8).join(",")}`:""} ${s.propOutdoor.length?`OUTDOOR:${s.propOutdoor.slice(0,6).join(",")}`:""} ${s.propBuilding.length?`BUILDING:${s.propBuilding.slice(0,5).join(",")}`:""} 
${isBuyer()?`BUYER CRITERIA:${s.buyerCriteria.map(b=>typeof b==="object"?b.label:b).join(",")||"not specified"}`:""}${isSeller()?`SELLER SITUATION:${s.sellerSituation.join(",")||"not specified"}`:""}
${s.customSituation?"AGENT CONTEXT (use above all else): "+s.customSituation:""}
AGENT:${ag}${s.agentPhone?"|"+s.agentPhone:""}${s.agencyName?"|"+s.agencyName:""}`
    try {
      update({loadingMsg:"✦ Writing messages..."})
      let p1=`${ctx}${langI}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp. Warm, use ${s.clientName}'s first name. End with easy question.","sms":"SMS max 160 chars. Punchy and personal.","voice_script":"Call script: OPENING, REASON FOR CALL, VALUE PITCH, CLOSE. Labelled.","email_subject":"Personal subject under 10 words.","email_body":"130-160 word email. Personal opener, opportunity, CTA. Signed by ${ag}${s.agencyName?" from "+s.agencyName:""}."}`;
      if(isObjection) p1=`${ctx}${langI}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp objection response. Acknowledge, reframe, keep door open.","sms":"SMS objection response max 160 chars.","voice_script":"Objection handling: OPENING, EMPATHISE, REFRAME, QUESTION, CLOSE. Labelled.","email_subject":"Non-salesy subject under 9 words.","email_body":"130-150 word email handling objection: '${s.objectionText||s.objection}'. Signed by ${ag}."}`;
      if(s.contactReason==="referral_request") p1=`${ctx}${langI}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word referral request WhatsApp. Warm, celebrate success, ask naturally.","sms":"Referral SMS max 160 chars.","voice_script":"Referral call: OPENING, CELEBRATION, ASK, CLOSE. Labelled.","email_subject":"Referral subject under 9 words.","email_body":"120-140 word referral email. Signed by ${ag}."}`;
      if(s.contactReason==="anniversary") p1=`${ctx}${langI}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word anniversary WhatsApp. Warm, celebratory, no hard sell.","sms":"Anniversary SMS max 160 chars.","voice_script":"Anniversary call: OPENING, CELEBRATE, MARKET UPDATE, SOFT CTA. Labelled.","email_subject":"Anniversary subject under 9 words.","email_body":"120-140 word anniversary email. Signed by ${ag}."}`;
      if(isCMA) p1=`${ctx}\nSUBJECT:${s.cmaSubject.address}|$${s.cmaSubject.price}|${s.cmaSubject.beds}bed/${s.cmaSubject.baths}bath\nCOMPS:${s.cmaComps.map((c,i)=>`${i+1}. ${c.address} sold $${c.salePrice} ${c.saleDate}`).join("|")}${langI}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp. Warm, mention free valuation complete. End with booking question.","sms":"SMS max 160 chars. Mention free valuation ready.","voice_script":"Call: OPENING, CMA COMPLETE, MARKET INSIGHT, BOOK MEETING. Labelled.","email_subject":"Free valuation subject under 10 words.","email_body":"140-160 word email. Lead with valuation, share insight, invite no-obligation meeting. Signed by ${ag}."}`;
      const part1=await safe(p1,SYSTEM,1500)

      update({loadingMsg:"✦ Writing letter & follow-ups..."})
      const p2=`${ctx}${langI}\n\nReturn ONLY JSON:\n{"formal_letter":"Full formal letter 260-300 words. Dear ${s.clientName}, 4 paragraphs. Sign: Warm regards,\\n${ag}${s.agencyName?"\\n"+s.agencyName:""}${s.agentPhone?"\\n"+s.agentPhone:""}","followup_1":"Follow-up Day 3. 50-60 words. Different angle.","followup_2":"Follow-up Week 1. 50-60 words. New value or insight.","followup_3":"Follow-up Week 2. 40-50 words. Casual check-in.","followup_4":"Follow-up Month 1. 40-50 words. Final warm touch."}`
      const part2=await safe(p2,SYSTEM,1600)

      update({loadingMsg:"✦ Building schedule..."})
      const p3=`CLIENT:${s.clientName}|TYPE:${s.clientType}|REASON:${s.contactReason}\n\nReturn ONLY JSON:\n{"schedule":[{"day":"Today — First Contact","icon":"🚀","tasks":["Send the WhatsApp message","If no reply after 2 hours, send SMS","Save client in CRM with today's date"]},{"day":"Day 3 — First Follow-Up","icon":"💬","tasks":["Send Follow-Up #1 if no reply","Check if they opened your email","Note response in CRM"]},{"day":"Day 7 — Week 1","icon":"📞","tasks":["Send Follow-Up #2 with new angle","Make a phone call","Listen first — ask questions before pitching"]},{"day":"Day 14 — Two Week Touch","icon":"🔄","tasks":["Send Follow-Up #3 — casual, no pressure","Share relevant market update","Update CRM"]},{"day":"Day 30 — Monthly Touch","icon":"🌱","tasks":["Send Follow-Up #4 — final warm message","Move to monthly newsletter if still no reply","Timing is everything — do not give up"]},{"day":"Ongoing","icon":"📅","tasks":["Add to monthly market update list","Check in every 90 days for long-term leads","80% of deals close between touch 5 and 12"]}]}`
      const part3=await safe(p3,SYSTEM,1200)

      const result={...part1,...part2,...part3}
      update({result,activeTab:"messages"})
      SF.addClient({clientName:s.clientName,clientType:s.clientType,contactReason:s.contactReason,language:s.language,agentName:s.agentName,result})
    }catch(err){update({error:"Error: "+err.message})}
    update({loading:false})
  }

  // ── RESULTS VIEW ─────────────────────────────────────────
  if(s.result){
    const G2 = {aqua:"#2AB8D4",muted:"rgba(255,255,255,0.5)",border:"#222",bg1:"#0c0c10",border2:"#252530",aquaBorder:"rgba(42,184,212,0.25)",aquaDim:"rgba(42,184,212,0.1)"}
    return (
      <div style={{minHeight:"100vh",background:"#060608"}}>
        <div style={{background:"#0c0c10",borderBottom:"1px solid #222",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000"}}>
          <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:"#fff"}}>STREAM<span style={{color:"#2AB8D4"}}>FLUX</span></span>
          <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:"rgba(255,255,255,0.5)",border:"1px solid #222",borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>← Dashboard</button>
        </div>
        {/* Follow-up reminder banner */}
        <div style={{background:"rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"10px 22px",display:"flex",alignItems:"center",gap:"10px"}}>
          <span style={{fontSize:"13px",color:"rgba(255,255,255,0.7)"}}>📲 Package sent? Come back here to <strong style={{color:"#fff"}}>log the response</strong> and get your full follow-up plan.</span>
        </div>
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"22px 16px 60px"}}>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 18px"}}>Every message personalised for {s.clientName} in {s.language}.</p>
          <div style={{display:"flex",gap:"4px",marginBottom:"20px",flexWrap:"wrap",background:"#0c0c10",padding:"4px",borderRadius:"10px",border:"1px solid rgba(42,184,212,0.25)"}}>
            {TABS_EN.map(tab=>(
              <button key={tab.id} onClick={()=>update({activeTab:tab.id})}
                style={{background:s.activeTab===tab.id?"#2AB8D4":"#0d0d0d",color:s.activeTab===tab.id?"#060608":"rgba(255,255,255,0.5)",border:s.activeTab===tab.id?"1px solid #252530":"1px solid transparent",borderRadius:"8px",padding:"7px 12px",fontSize:"11px",fontWeight:s.activeTab===tab.id?"700":"500",fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>
                {tab.label}
              </button>
            ))}
          </div>
          {s.activeTab==="messages"&&<><CopyCard title="WhatsApp" content={s.result.whatsapp} icon="💬" lang={s.language}/><CopyCard title="SMS" content={s.result.sms} icon="📱" lang={s.language}/></>}
          {s.activeTab==="voice"&&<><p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 12px"}}>Read naturally — don't sound like you're reading a script.</p><CopyCard title="Phone Call Script" content={s.result.voice_script} icon="🎙️" lang={s.language}/></>}
          {s.activeTab==="email"&&<><CopyCard title="Email Subject" content={s.result.email_subject} icon="📧" lang={s.language}/><CopyCard title="Email Body" content={s.result.email_body} icon="📨" lang={s.language}/></>}
          {s.activeTab==="letter"&&<><p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 12px"}}>Replace anything in brackets before printing.</p><CopyCard title="Formal Letter" content={s.result.formal_letter} icon="✉️" lang={s.language}/></>}
          {s.activeTab==="followups"&&(
            <>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 12px"}}>Send in order if no reply. 80% of deals close between touch 5–12. Don't give up.</p>
              <CopyCard title="Follow-Up #1 — Day 3" content={s.result.followup_1} icon="💬" lang={s.language}/>
              <CopyCard title="Follow-Up #2 — Week 1" content={s.result.followup_2} icon="💬" lang={s.language}/>
              <CopyCard title="Follow-Up #3 — Week 2" content={s.result.followup_3} icon="💬" lang={s.language}/>
              <CopyCard title="Follow-Up #4 — Month 1" content={s.result.followup_4} icon="💬" lang={s.language}/>
              {/* Regen box */}
              <div style={{background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:"10px",padding:"18px",marginTop:"20px"}}>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:"6px"}}>📲 Log What Happened & Get New Follow-Ups</div>
                <p style={{fontSize:"12px",color:"rgba(255,255,255,0.55)",marginBottom:"10px",lineHeight:"1.6"}}>Describe what happened after your first message. The AI generates 4 brand new follow-ups tailored to exactly what occurred.</p>
                <textarea placeholder="e.g. She replied and said she liked it but her husband isn't convinced yet. She asked if we could do anything on price..." rows={3}
                  value={s.regenContext||""} onChange={e=>update({regenContext:e.target.value})}
                  style={{...inp,resize:"vertical",borderColor:"rgba(255,255,255,0.2)",background:"#0d0d0d",marginBottom:"10px"}}/>
                <button onClick={async()=>{
                  if(!s.regenContext||s.regenLoading)return
                  update({regenLoading:true})
                  try{
                    const r=await apiClaude(`Original: CLIENT ${s.clientName}|${s.contactReason}\nWhat happened: ${s.regenContext}\n${isSpa?"CRITICAL: All content in Spanish.":""}\n\nReturn ONLY JSON:\n{"followup_1":"New Day 3 follow-up based on what happened. 50-60 words.","followup_2":"New Week 1 with fresh angle. 50-60 words.","followup_3":"New Week 2 casual. 40-50 words.","followup_4":"New Month 1 final. 40-50 words."}`,SYSTEM,800)
                    update({result:{...s.result,...r},regenContext:""})
                  }catch(e){update({error:"Failed: "+e.message})}
                  update({regenLoading:false})
                }} style={{background:s.regenLoading?"#1a1a1a":"#2AB8D4",color:s.regenLoading?"rgba(255,255,255,0.5)":"#060608",border:"none",borderRadius:"8px",padding:"13px 24px",fontSize:"14px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
                  {s.regenLoading?"Regenerating...":"✦ Regenerate Follow-Ups Based on Response"}
                </button>
              </div>
            </>
          )}
          {s.activeTab==="schedule"&&s.result.schedule&&(
            <>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 18px"}}>Your exact follow-up plan for {s.clientName}.</p>
              {s.result.schedule.map((day,i)=>(
                <div key={i} style={{background:"#0c0c10",border:"1px solid #252530",borderRadius:"10px",padding:"14px 16px",marginBottom:"8px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                    <span style={{fontSize:"20px"}}>{day.icon}</span>
                    <span style={{fontSize:"14px",fontWeight:"700",color:"#2AB8D4"}}>{day.day}</span>
                  </div>
                  {(day.tasks||[]).map((t,j)=>(
                    <div key={j} style={{display:"flex",gap:"8px",marginBottom:"6px"}}>
                      <span style={{color:"#2AB8D4",fontWeight:"700",flexShrink:"0"}}>→</span>
                      <span style={{fontSize:"14px",color:"#ccc",lineHeight:"1.6"}}>{t}</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          <button onClick={()=>update({...initState(s.language)})} style={{background:"transparent",color:"rgba(255,255,255,0.5)",border:"1px solid #222",borderRadius:"8px",padding:"13px 24px",fontSize:"14px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",marginTop:"16px"}}>← New Client</button>
        </div>
      </div>
    )
  }

  // ── FORM VIEW ─────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#060608"}}>
      <div style={{background:"#0c0c10",borderBottom:"1px solid #222",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000"}}>
        <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:"#fff"}}>STREAM<span style={{color:"#2AB8D4"}}>FLUX</span></span>
        <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:"rgba(255,255,255,0.5)",border:"1px solid #222",borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>← Dashboard</button>
      </div>
      <div style={{maxWidth:"660px",margin:"0 auto",padding:"30px 18px 60px"}}>

        {/* Language */}
        <div style={{...card,marginBottom:"8px"}}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:"#fff"}}>🌐 Output Language</h2>
          <select value={s.language} onChange={e=>update({language:e.target.value,contactReason:""})} style={{...inp,cursor:"pointer"}}>
            <option value="English">🇺🇸 English</option>
            <option value="Spanish">🇪🇸 Español</option>
          </select>
        </div>

        {/* Client Info */}
        <div style={card}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>👤 Who Are You Contacting?</h2>
          <div style={{marginBottom:"16px"}}><label style={lbl}>Client First Name</label><input type="text" placeholder="Sarah" style={inp} value={s.clientName||""} onChange={e=>update({clientName:e.target.value})}/></div>
          <Chips label="Client Type" options={CLIENT_TYPES_EN} selected={s.clientType} onToggle={v=>update({clientType:v,contactReason:""})} single/>
          {s.clientType&&<Chips label="Reason for Contacting" options={CONTACT_REASONS} selected={s.contactReason} onToggle={v=>update({contactReason:v})} single/>}
          {s.contactReason&&<>
            <Chips label="Urgency Level" options={URGENCY_EN} selected={s.urgency} onToggle={v=>update({urgency:v})} single/>
            <Chips label="Communication Tone" options={TONES_EN} selected={s.tone} onToggle={v=>update({tone:v})} single/>
          </>}
        </div>

        {/* ── BUYER WORKFLOWS ──────────────────────────────── */}

        {/* First Contact Buyer */}
        {isFirstContact && isBuyer() && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>👋 Introduction Style</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Help the AI craft the perfect opening for this first touch.</p>
            <Chips label="How Did You Get This Contact?" options={[{value:"cold",label:"Cold — Never Met"},{value:"referral",label:"👥 Referral"},{value:"met_briefly",label:"🤝 Met Briefly"},{value:"social",label:"📱 Social Media"},{value:"open_house",label:"🏠 Open House"},{value:"event",label:"🎉 Event / Networking"},{value:"online_lead",label:"🌐 Online Lead"},{value:"door_knock",label:"🚪 Door Knock"}]} selected={s.introStyle} onToggle={v=>update({introStyle:tog(s.introStyle,v)})}/>
            <Chips label="How Do You Want to Come Across?" options={[{value:"expert",label:"🎯 Confident Expert"},{value:"friendly",label:"😊 Friendly Neighbour"},{value:"data",label:"📊 Data-Driven Analyst"},{value:"luxury",label:"💎 Luxury Specialist"},{value:"relationship",label:"🤝 Relationship Builder"},{value:"local",label:"📍 Local Market Expert"}]} selected={s.introComeAcross} onToggle={v=>update({introComeAcross:tog(s.introComeAcross,v)})}/>
          </div>
        )}

        {/* First Contact Seller */}
        {isFirstContact && isSeller() && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>📋 Lead Details</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>How did you find this lead and what do you know about them?</p>
            <Chips label="How Did You Get This Lead?" options={[{value:"door_knock",label:"🚪 Door Knock"},{value:"cold_call",label:"📞 Cold Call"},{value:"referral",label:"👥 Referral"},{value:"online",label:"🌐 Online Lead"},{value:"direct_mail",label:"📮 Direct Mail"},{value:"farming",label:"🏘️ Area Farming"},{value:"social_media",label:"📱 Social Media"},{value:"open_house",label:"🏠 Open House"},{value:"networking",label:"🎉 Networking Event"}]} selected={s.leadSource?[s.leadSource]:[]} onToggle={v=>update({leadSource:v})} single/>
            <div style={{marginTop:"8px"}}><label style={lbl}>What Do You Know About Their Property?</label><textarea placeholder="e.g. 3-bed on Oak Street, has been vacant a while, garden needs work, neighbours say they're thinking of selling..." rows={3} style={{...inp,resize:"vertical"}} value={s.knownAboutProperty||""} onChange={e=>update({knownAboutProperty:e.target.value})}/></div>
          </div>
        )}

        {/* Reconnecting — BOTH buyer and seller, NO personal context box */}
        {isReconnect && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🔄 Reconnecting Details</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Help the AI recall and reference the history with this client.</p>
            <Chips label="Why Did They Go Quiet?" options={[{value:"life_happened",label:"🌀 Life Happened"},{value:"changed_budget",label:"💰 Budget Changed"},{value:"market_fear",label:"📉 Scared of Market"},{value:"partner_disagreed",label:"🤝 Partner Disagreed"},{value:"found_something",label:"🏠 Found Something Themselves"},{value:"timing",label:"⏰ Bad Timing"},{value:"overwhelmed",label:"😓 Overwhelmed"},{value:"lost_touch",label:"📵 Just Lost Touch"},{value:"not_ready",label:"🛑 Wasn't Ready"}]} selected={s.reconnectSituation} onToggle={v=>update({reconnectSituation:tog(s.reconnectSituation,v)})}/>
            <div style={{marginTop:"8px"}}><label style={lbl}>What Was the Situation? What Were They Looking For?</label><textarea placeholder="e.g. They were actively searching for a 4-bed in the suburbs, budget $650K. We spoke 3 months ago, they went quiet after viewing 2 properties. Very interested but hesitant about the market..." rows={4} style={{...inp,resize:"vertical"}} value={s.lookingFor||""} onChange={e=>update({lookingFor:e.target.value})}/></div>
          </div>
        )}

        {/* Market Update */}
        {isMarketUpdate && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>📊 Market Update Details</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>The more specific the data, the more powerful the message.</p>
            <div style={{marginBottom:"12px"}}><label style={lbl}>City / Market Area</label><input type="text" placeholder="e.g. Miami Beach, South Florida" style={inp} value={s.marketLocation||""} onChange={e=>update({marketLocation:e.target.value})}/></div>
            <Chips label="Market Direction" options={["📈 Rising Prices","📊 Stable Market","📉 Cooling Down","🔥 High Demand","📦 Low Inventory","⏱️ Good Time to Buy","🏆 Seller's Market","🤝 Buyer's Market","🏗️ Infrastructure Development","📊 Record Sales Volume","🌍 International Buyer Interest","💼 Job Market Growing","🏫 New Schools Opening","🚇 New Transport Links","🏢 New Commercial Development","📉 Motivated Sellers"]} selected={s.marketDirection||[]} onToggle={v=>update({marketDirection:tog(s.marketDirection||[],v)})}/>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Your Market Insight</label><textarea placeholder="e.g. Prices up 3% this month, inventory tightening, average days on market dropped to 22..." rows={3} style={{...inp,resize:"vertical"}} value={s.marketInsight||""} onChange={e=>update({marketInsight:e.target.value})}/></div>
            <div><label style={lbl}>Specific Data / Stats (optional)</label><input type="text" placeholder="e.g. Median price $850K, 12% more sales than last year, 3 multiple offer situations this week" style={inp} value={s.marketStats||""} onChange={e=>update({marketStats:e.target.value})}/></div>
          </div>
        )}

        {/* Financing Update */}
        {isFinancingUpdate && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>💰 Financing Update</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Select what's changed — the AI crafts every message around this opportunity.</p>
            <Chips label="What Changed?" options={[{value:"rates_dropped",label:"📉 Rates Dropped"},{value:"fed_cut",label:"🏦 Fed Rate Cut"},{value:"easier_qualify",label:"✅ Easier to Qualify"},{value:"new_products",label:"💡 New Loan Products"},{value:"low_down",label:"💰 Low Down Payment Options"},{value:"rates_rising",label:"📈 Rates Rising — Act Now"},{value:"investor_loans",label:"🏢 Investor Loan Options"},{value:"first_buyer",label:"🏠 First-Time Buyer Incentives"},{value:"bank_loosened",label:"🏦 Bank Policy Loosened"},{value:"foreign_buyer",label:"🌍 Foreign Buyer Financing Available"},{value:"govt_scheme",label:"📋 New Government Scheme"},{value:"bridge_loan",label:"⚡ Bridge Loan Options"},{value:"rate_lock",label:"🔒 Rate Lock Opportunity"},{value:"dti_change",label:"📊 Debt-to-Income Rules Changed"}]} selected={s.financingOptions||[]} onToggle={v=>update({financingOptions:tog(s.financingOptions||[],v)})}/>
            <div style={{marginTop:"8px"}}><label style={lbl}>Specific Details (optional)</label><textarea placeholder="e.g. Rates dropped to 6.2%, qualifying is now easier, 10% down payment available for first-time buyers..." rows={3} style={{...inp,resize:"vertical"}} value={s.financingNews||""} onChange={e=>update({financingNews:e.target.value})}/></div>
          </div>
        )}

        {/* Viewing Follow-Up */}
        {isViewingFollowUp && (
          <PropCard s={s} update={update} tog={tog} title="🏠 Property Viewed" showFullFeatures={true}/>
        )}

        {/* Price Drop - Buyer */}
        {isPriceDrop && isBuyer() && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:"#fff"}}>📉 Price Reduction Details</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div><label style={lbl}>New Price ($)</label><input type="text" placeholder="895,000" style={inp} value={s.propNewPrice||""} onChange={e=>update({propNewPrice:e.target.value})}/></div>
              <div><label style={lbl}>Was ($)</label><input type="text" placeholder="995,000" style={inp} value={s.propOldPrice||""} onChange={e=>update({propOldPrice:e.target.value})}/></div>
            </div>
            <PropCard s={s} update={update} tog={tog} title="🏠 Property" showFullFeatures={true}/>
          </div>
        )}

        {/* Offer Strategy */}
        {isOfferStrategy && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🎯 Offer Strategy</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Build the full offer context so the AI crafts a message that positions your buyer to win.</p>
            <Chips label="Offer Position" options={[{value:"first_offer",label:"1️⃣ First Offer"},{value:"counter",label:"🔄 Counter Offer"},{value:"competing",label:"⚔️ Competing with Others"},{value:"final_best",label:"🏁 Final Best Offer"},{value:"pre_offer",label:"📋 Pre-Offer Conversation"}]} selected={s.offerPosition} onToggle={v=>update({offerPosition:tog(s.offerPosition,v)})} single/>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Buyer's Budget / Offer Range</label><input type="text" placeholder="e.g. $480K–$510K" style={inp} value={s.offerBudget||""} onChange={e=>update({offerBudget:e.target.value})}/></div>
            <Chips label="Negotiation Levers to Highlight" options={[{value:"clean_offer",label:"✅ Clean Offer — No Conditions"},{value:"quick_close",label:"⚡ Quick Closing"},{value:"escalation",label:"📈 Escalation Clause"},{value:"personal_letter",label:"💌 Personal Letter to Seller"},{value:"larger_deposit",label:"💰 Larger Deposit"},{value:"furniture",label:"🛋️ Include Furniture"},{value:"leaseback",label:"🔑 Seller Leaseback Option"},{value:"inspection_waived",label:"🔍 Inspection Waived"},{value:"flexible_date",label:"📅 Flexible Move-In Date"},{value:"cash",label:"💵 All Cash Offer"},{value:"pre_approved",label:"🏦 Pre-Approved Financing"},{value:"appraisal_gap",label:"📊 Appraisal Gap Coverage"}]} selected={s.offerLevers} onToggle={v=>update({offerLevers:tog(s.offerLevers,v)})}/>
            <Chips label="Market Situation" options={[{value:"multiple_offers",label:"⚔️ Multiple Offer Situation"},{value:"motivated_seller",label:"🔥 Motivated Seller"},{value:"long_on_market",label:"📅 Long Days on Market"},{value:"price_reduction",label:"📉 Already Reduced Price"},{value:"fresh_listing",label:"🆕 Fresh Listing"}]} selected={s.offerMarket} onToggle={v=>update({offerMarket:tog(s.offerMarket,v)})}/>
            <div style={{marginTop:"8px"}}><label style={lbl}>What Matters Most to the Seller? (optional)</label><input type="text" placeholder="e.g. Quick closing, no repairs, they need to stay 30 days after sale" style={inp} value={s.sellerPriorities||""} onChange={e=>update({sellerPriorities:e.target.value})}/></div>
            <PropCard s={s} update={update} tog={tog} title="🏠 The Property" showFullFeatures={true}/>
          </div>
        )}

        {/* Objection — BUYER */}
        {isObjection && isBuyer() && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>🛡️ What Objection Did They Raise?</h2>
            <Chips options={[{value:"too_expensive",label:"💰 Too Expensive"},{value:"rates_too_high",label:"📈 Mortgage Rates Too High"},{value:"not_right_property",label:"🏠 Haven't Found the Right Property"},{value:"partner_not_convinced",label:"🤝 Partner Not Convinced"},{value:"waiting_prices_drop",label:"📉 Waiting for Prices to Drop"},{value:"market_uncertain",label:"🌊 Market Too Uncertain"},{value:"happy_renting",label:"🏠 Happy Renting for Now"},{value:"need_to_sell_first",label:"🔄 Need to Sell First"},{value:"bad_timing",label:"⏰ Bad Timing"},{value:"not_pre_approved",label:"📋 Not Pre-Approved Yet"},{value:"already_have_agent",label:"👤 Already Have an Agent"},{value:"need_more_time",label:"🕐 Need More Time to Think"},{value:"scared_of_commitment",label:"😰 Scared of the Commitment"},{value:"location",label:"📍 Not Sure About the Location"}]} selected={s.objection} onToggle={v=>update({objection:v})} single/>
            <div style={{marginTop:"12px"}}><label style={lbl}>Write the Exact Objection in Their Words (optional)</label><textarea placeholder="e.g. She said: 'I just feel like prices are going to drop more, and I don't want to buy now and regret it in 6 months...'" rows={3} style={{...inp,resize:"vertical"}} value={s.objectionText||""} onChange={e=>update({objectionText:e.target.value})}/></div>
            <PropCard s={s} update={update} tog={tog} title="🏠 The Property" showFullFeatures={true}/>
          </div>
        )}

        {/* Objection — SELLER */}
        {isObjection && isSeller() && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>🛡️ What Objection Did They Raise?</h2>
            <Chips options={[{value:"price_too_low",label:"💰 Price Too Low"},{value:"not_right_time",label:"⏰ Not the Right Time"},{value:"already_have_agent",label:"👤 Already Have an Agent"},{value:"need_more_time",label:"🕐 Need More Time"},{value:"market_too_slow",label:"📉 Market Too Slow"},{value:"want_fsbo",label:"🏷️ Want to Try FSBO"},{value:"not_ready",label:"🛑 Not Ready to Sell"},{value:"thinks_worth_more",label:"💎 Think It's Worth More"},{value:"bad_experience",label:"😤 Bad Past Experience with Agents"},{value:"no_rush",label:"🌱 No Rush to Sell"},{value:"renovating_first",label:"🔨 Want to Renovate First"},{value:"waiting_market",label:"📈 Waiting for Better Market"},{value:"family_decision",label:"👨‍👩‍👧 Family Decision — Not Just Mine"},{value:"emotional_attachment",label:"💔 Emotional Attachment to Home"}]} selected={s.objection} onToggle={v=>update({objection:v})} single/>
            <div style={{marginTop:"12px"}}><label style={lbl}>Write the Exact Objection in Their Words (optional)</label><textarea placeholder="e.g. He said: 'We love this home, we've lived here 15 years. It's just really hard to imagine leaving it...'" rows={3} style={{...inp,resize:"vertical"}} value={s.objectionText||""} onChange={e=>update({objectionText:e.target.value})}/></div>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFullFeatures={true}/>
          </div>
        )}

        {/* Anniversary */}
        {s.contactReason==="anniversary" && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:"#fff"}}>🎉 Anniversary Details</h2>
            <label style={lbl}>Years Since Purchase</label>
            <input type="number" placeholder="1" style={inp} value={s.anniversaryYears||""} onChange={e=>update({anniversaryYears:e.target.value})}/>
          </div>
        )}

        {/* ── SELLER WORKFLOWS ─────────────────────────────── */}

        {/* Just Sold Nearby / Neighbourhood Sale */}
        {isSoldNearby && (
          <div style={{...card,background:"rgba(42,184,212,0.03)",border:"1px solid rgba(42,184,212,0.2)"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏘️ Property Sold Nearby</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Enter the full details of the sold property — the AI uses this to demonstrate your market knowledge.</p>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Address of Sold Property</label><input type="text" placeholder="e.g. 14 Maple Street, Austin TX" style={inp} value={s.soldAddress||""} onChange={e=>update({soldAddress:e.target.value})}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              <div><label style={lbl}>Sold Price ($)</label><input type="text" placeholder="485,000" style={inp} value={s.soldPrice||""} onChange={e=>update({soldPrice:e.target.value})}/></div>
              <div><label style={lbl}>Beds</label><input type="text" placeholder="3" style={inp} value={s.soldBeds||""} onChange={e=>update({soldBeds:e.target.value})}/></div>
              <div><label style={lbl}>Baths</label><input type="text" placeholder="2" style={inp} value={s.soldBaths||""} onChange={e=>update({soldBaths:e.target.value})}/></div>
              <div><label style={lbl}>Property Type</label><input type="text" placeholder="Condo" style={inp} value={s.soldType||""} onChange={e=>update({soldType:e.target.value})}/></div>
              <div><label style={lbl}>Days on Market</label><input type="text" placeholder="12" style={inp} value={s.soldDaysOnMarket||""} onChange={e=>update({soldDaysOnMarket:e.target.value})}/></div>
              <div><label style={lbl}>Sale Date</label><input type="text" placeholder="March 2025" style={inp} value={s.soldDate||""} onChange={e=>update({soldDate:e.target.value})}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}}>
              <div><label style={lbl}>Sold Above / Below Asking</label><input type="text" placeholder="e.g. $15K above asking" style={inp} value={s.soldAboveBelow||""} onChange={e=>update({soldAboveBelow:e.target.value})}/></div>
              <div><label style={lbl}>Property Condition</label><input type="text" placeholder="Good, original fixtures" style={inp} value={s.soldCondition||""} onChange={e=>update({soldCondition:e.target.value})}/></div>
            </div>
            <div style={{paddingTop:"14px",borderTop:"1px solid #252530"}}>
              <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"12px"}}>Optional: Add your contact's property details for comparison and to personalise the message.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                <div><label style={lbl}>Their Property Address</label><input type="text" placeholder="22 Oak Ave" style={inp} value={s.clientPropAddress||""} onChange={e=>update({clientPropAddress:e.target.value})}/></div>
                <div><label style={lbl}>Estimated Value ($)</label><input type="text" placeholder="520,000" style={inp} value={s.clientPropPrice||""} onChange={e=>update({clientPropPrice:e.target.value})}/></div>
                <div><label style={lbl}>Beds</label><input type="text" placeholder="3" style={inp} value={s.clientPropBeds||""} onChange={e=>update({clientPropBeds:e.target.value})}/></div>
                <div><label style={lbl}>Baths</label><input type="text" placeholder="2" style={inp} value={s.clientPropBaths||""} onChange={e=>update({clientPropBaths:e.target.value})}/></div>
                <div><label style={lbl}>Sq Ft</label><input type="text" placeholder="1,800" style={inp} value={s.clientPropSqft||""} onChange={e=>update({clientPropSqft:e.target.value})}/></div>
                <div><label style={lbl}>Years They've Owned</label><input type="text" placeholder="7 years" style={inp} value={s.clientPropYearsOwned||""} onChange={e=>update({clientPropYearsOwned:e.target.value})}/></div>
              </div>
              <div><label style={lbl}>Their Property Condition</label><input type="text" placeholder="Good, updated kitchen 2022" style={inp} value={s.clientPropCondition||""} onChange={e=>update({clientPropCondition:e.target.value})}/></div>
            </div>
          </div>
        )}

        {/* Price Discussion */}
        {isPriceDiscussion && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>💬 Price Reduction Discussion</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>The AI will frame the reduction with data, empathy, and strategy.</p>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Days on Market</label><input type="number" placeholder="45" style={inp} value={s.daysOnMarket||""} onChange={e=>update({daysOnMarket:e.target.value})}/></div>
            <Chips label="Why Consider a Reduction?" options={["No offers received","Similar homes sold lower","Market has shifted","Showings but no offers","Overpriced vs market","Too much competition","Buyer feedback on price","Agent recommendation","Motivated to sell faster"]} selected={s.priceReasons||[]} onToggle={v=>update({priceReasons:tog(s.priceReasons||[],v)})}/>
            <Chips label="Seller's Urgency" options={[{value:"30days",label:"🔥 Must Sell Within 30 Days"},{value:"60days",label:"⚡ Within 60 Days"},{value:"90days",label:"📅 Within 90 Days"},{value:"flexible",label:"🌱 Flexible Timeline"},{value:"bought_new",label:"🏠 Already Bought New Home"},{value:"relocating",label:"✈️ Relocating for Work"},{value:"divorce",label:"⚖️ Divorce Settlement"},{value:"financial",label:"💰 Financial Pressure"},{value:"inheritance",label:"🏛️ Inherited Property"}]} selected={s.sellerUrgency||[]} onToggle={v=>update({sellerUrgency:tog(s.sellerUrgency||[],v)})}/>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFullFeatures={true}/>
          </div>
        )}

        {/* Expired Listing */}
        {isExpiredListing && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>📋 Expired Listing</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Position yourself as the agent with the strategy to get it sold this time.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div><label style={lbl}>Original Asking Price ($)</label><input type="text" placeholder="680,000" style={inp} value={s.expOrigPrice||""} onChange={e=>update({expOrigPrice:e.target.value})}/></div>
              <div><label style={lbl}>Days It Was Listed</label><input type="number" placeholder="90" style={inp} value={s.expDays||""} onChange={e=>update({expDays:e.target.value})}/></div>
            </div>
            <Chips label="Why Do You Think It Didn't Sell?" options={["Overpriced","Poor online presence","No professional photography","Weak marketing strategy","No video or virtual tour","Bad timing / seasonal","Wrong target audience","Needs repairs or staging","Limited MLS exposure","No social media marketing","Poor property description","No open houses","Previous agent underperformed","Market shifted during listing"]} selected={s.expiredReasons||[]} onToggle={v=>update({expiredReasons:tog(s.expiredReasons||[],v)})}/>
            <div style={{paddingTop:"14px",borderTop:"1px solid #252530",marginTop:"8px"}}>
              <p style={{fontSize:"12px",fontWeight:"700",color:"#2AB8D4",marginBottom:"12px"}}>🔄 Re-List Strategy — What Will You Do Differently?</p>
              <Chips label="Your New Approach" options={[{value:"new_price",label:"💰 New Pricing Strategy"},{value:"pro_photos",label:"📸 Professional Photography"},{value:"video",label:"🎬 Property Video"},{value:"virtual_tour",label:"🏠 Virtual Tour"},{value:"staging",label:"🎨 Professional Staging"},{value:"social_media",label:"📱 Social Media Campaign"},{value:"digital_ads",label:"🎯 Digital Advertising"},{value:"open_house",label:"🚪 Open House Series"},{value:"buyer_network",label:"👥 Targeted Buyer Outreach"},{value:"price_compete",label:"📊 Price to Create Competition"},{value:"drone",label:"🚁 Drone Photography"},{value:"new_description",label:"✍️ Compelling New Description"},{value:"floor_plan",label:"📐 Floor Plan"},{value:"off_market_first",label:"🔒 Off-Market Pre-Launch"}]} selected={s.relistStrategy||[]} onToggle={v=>update({relistStrategy:tog(s.relistStrategy||[],v)})}/>
              <div style={{marginTop:"8px"}}><label style={lbl}>What Will You Specifically Do Differently? (optional)</label><textarea placeholder="e.g. I'll relaunch with professional photography, a targeted Facebook ad campaign, and price it $20K below market to generate multiple offers..." rows={3} style={{...inp,resize:"vertical"}} value={s.relistDifferent||""} onChange={e=>update({relistDifferent:e.target.value})}/></div>
            </div>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFullFeatures={true}/>
          </div>
        )}

        {/* Pre-Listing */}
        {isPreListing && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>✅ Pre-Listing Preparation</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Select what you're recommending to maximise their sale price.</p>
            <Chips label="Recommended Preparations" options={["📸 Professional Photography","🎬 Video Tour","🎨 Home Staging","🔧 Minor Repairs","🧹 Deep Clean","📦 Declutter & Depersonalise","💡 New Lighting","🎨 Interior Paint","🌿 Curb Appeal","🏡 Kitchen Update","🚿 Bathroom Update","💎 Value-Add Improvements","📐 Floor Plan","🏠 Virtual Tour","📊 Pre-Sale Inspection","🔑 Smart Lock / Security","⚡ Electrical Check","🪟 Window Cleaning","🚗 Driveway Pressure Wash","🌳 Landscaping"]} selected={s.preListingItems||[]} onToggle={v=>update({preListingItems:tog(s.preListingItems||[],v)})}/>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFullFeatures={true}/>
          </div>
        )}

        {/* Timeline Check-In */}
        {isTimelineCheckin && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>📅 Timeline Check-In</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Reference their original plan and check what's changed. Shows you've been paying attention.</p>
            <div style={{marginBottom:"12px"}}><label style={lbl}>When Did They Originally Want to Sell?</label><input type="text" placeholder="e.g. Spring 2025, Q1, 6 months ago..." style={inp} value={s.originalTimeline||""} onChange={e=>update({originalTimeline:e.target.value})}/></div>
            <div style={{marginBottom:"12px"}}><label style={lbl}>What's Their New Timeline?</label><input type="text" placeholder="e.g. Now thinking end of year, or still unsure..." style={inp} value={s.newTimeline||""} onChange={e=>update({newTimeline:e.target.value})}/></div>
            <Chips label="What May Have Changed?" options={[{value:"life_circumstances",label:"🌀 Life Circumstances Changed"},{value:"market_shift",label:"📊 Market Conditions Shifted"},{value:"found_property",label:"🏠 Found a New Property"},{value:"family_situation",label:"👨‍👩‍👧 Family Situation"},{value:"work_relocation",label:"✈️ Work Relocation"},{value:"financial_change",label:"💰 Financial Situation"},{value:"partner_disagreement",label:"🤝 Partner Disagreement"},{value:"mortgage_change",label:"🏦 Mortgage Situation Changed"},{value:"renovation_delay",label:"🔨 Renovation Delay"},{value:"still_deciding",label:"🤔 Still Deciding"}]} selected={s.timelineChanges||[]} onToggle={v=>update({timelineChanges:tog(s.timelineChanges||[],v)})}/>
            <Chips label="Where Are They Emotionally?" options={[{value:"motivated",label:"🔥 Motivated — Ready"},{value:"hesitant",label:"🤔 Hesitant"},{value:"frustrated",label:"😤 Frustrated with Market"},{value:"excited",label:"😊 Excited About Moving"},{value:"scared",label:"😰 Nervous / Scared"},{value:"confused",label:"😕 Confused"},{value:"patient",label:"🌱 Patient — No Rush"},{value:"urgent",label:"⚡ More Urgent Now"}]} selected={s.timelineEmotion||[]} onToggle={v=>update({timelineEmotion:tog(s.timelineEmotion||[],v)})}/>
            <div style={{marginTop:"8px"}}><label style={lbl}>Any Additional Context</label><textarea placeholder="e.g. They originally wanted to sell by April but their renovation took longer. Now they seem more motivated since prices went up..." rows={3} style={{...inp,resize:"vertical"}} value={s.timelineContext||""} onChange={e=>update({timelineContext:e.target.value})}/></div>
          </div>
        )}

        {/* Buyer Match */}
        {isBuyerMatch && isSeller() && (
          <div style={{...card,background:"rgba(42,184,212,0.03)",border:"1px solid rgba(42,184,212,0.2)"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🎯 Buyer Profile</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Including buyer details makes this message far more compelling.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
              <div><label style={lbl}>Buyer's Budget</label><input type="text" placeholder="e.g. $500K–$650K" style={inp} value={s.buyerBudget||""} onChange={e=>update({buyerBudget:e.target.value})}/></div>
              <div><label style={lbl}>Buyer Profile</label><input type="text" placeholder="e.g. Young family, works from home" style={inp} value={s.buyerType||""} onChange={e=>update({buyerType:e.target.value})}/></div>
            </div>
            <Chips label="What They're Looking For" options={[{value:"3bed",label:"3+ Bedrooms"},{value:"4bed",label:"4+ Bedrooms"},{value:"garden",label:"Large Garden"},{value:"pool",label:"Pool"},{value:"schools",label:"Good Schools Nearby"},{value:"home_office",label:"Home Office"},{value:"move_in_ready",label:"Move-In Ready"},{value:"modern_kitchen",label:"Modern Kitchen"},{value:"open_plan",label:"Open Plan Living"},{value:"quiet_street",label:"Quiet Street"},{value:"transport",label:"Near Transport"},{value:"garage",label:"Garage / Parking"},{value:"investment",label:"Investment Property"},{value:"specific_timeline",label:"Specific Timeline"},{value:"cash_buyer",label:"💵 Cash Buyer"},{value:"pre_approved",label:"✅ Pre-Approved Finance"},{value:"flexible_close",label:"📅 Flexible Closing"},{value:"no_chain",label:"⚡ No Chain"},{value:"primary_residence",label:"🏠 Primary Residence"},{value:"quick_move",label:"🚀 Quick Move-In"},{value:"school_district",label:"🏫 Specific School District"},{value:"pet_owner",label:"🐾 Pet Owner"},{value:"work_from_home",label:"💻 Work From Home"},{value:"waterfront",label:"🌊 Waterfront"},{value:"new_build",label:"🏗️ New Build Only"}]} selected={s.buyerWants||[]} onToggle={v=>update({buyerWants:tog(s.buyerWants||[],v)})}/>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFullFeatures={true}/>
          </div>
        )}

        {/* FSBO */}
        {isFSBO && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏷️ FSBO Outreach</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Position yourself as the professional partner who gets them more money with less stress.</p>
            <div style={{marginBottom:"14px"}}><label style={lbl}>Why Should They Work With You?</label><textarea placeholder="e.g. I sold 3 homes on their street this year, average 8% above asking. I have 15 pre-qualified buyers actively looking in this area right now..." rows={3} style={{...inp,resize:"vertical"}} value={s.fsboReasons||""} onChange={e=>update({fsboReasons:e.target.value})}/></div>
            <Chips label="Key Advantages to Highlight" options={["📊 Access to More Buyers","💰 Higher Sale Price (avg 6-18% more)","🤝 Professional Negotiation","⚖️ Legal & Contract Protection","🌐 MLS & Portal Exposure","📸 Professional Photography & Staging","⏰ No Hassle — Time Saved","👥 Pre-Qualified Buyer Network","📍 Deep Market Expertise","⚡ Faster Sale","📋 Contract Management","🎯 Zero Upfront Cost","🔄 Post-Sale Support","🤝 Referral Network Access","📱 Social Media Marketing","🎬 Video & Virtual Tour Production","💡 Pricing Strategy Expertise","🏆 Track Record in This Area","🔒 Privacy & Security During Showings","🌍 International Buyer Access"]} selected={s.fsboAdvantages||[]} onToggle={v=>update({fsboAdvantages:tog(s.fsboAdvantages||[],v)})}/>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFullFeatures={true}/>
          </div>
        )}

        {/* CMA Form */}
        {isCMA && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏡 Comparative Market Analysis (CMA)</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"18px"}}>Enter the client's property and up to 3 recent comparable sales.</p>
            <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color:"#2AB8D4",marginBottom:"10px"}}>🏠 Subject Property</div>
            <div style={{marginBottom:"10px"}}><label style={lbl}>Address</label><input type="text" placeholder="123 Main St, Miami FL" style={inp} value={s.cmaSubject.address||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,address:e.target.value}})}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              {[["beds","Beds","3"],["baths","Baths","2"],["sqft","Sq Ft","1,800"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={s.cmaSubject[k]||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,[k]:e.target.value}})}/></div>))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              {[["price","Est. Value ($)","450,000"],["yearBuilt","Year Built","2005"],["parking","Parking","2 car garage"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={s.cmaSubject[k]||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,[k]:e.target.value}})}/></div>))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              {[["condition","Condition","Good, updated kitchen"],["hoaFees","HOA Fees","$350/month"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={s.cmaSubject[k]||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,[k]:e.target.value}})}/></div>))}
            </div>
            <div style={{marginBottom:"16px"}}><label style={lbl}>Recent Renovations</label><input type="text" placeholder="e.g. New kitchen 2022, roof 2020, HVAC 2021" style={inp} value={s.cmaSubject.recentRenovations||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,recentRenovations:e.target.value}})}/></div>
            <div style={{marginBottom:"16px"}}><label style={lbl}>Key Features</label><input type="text" placeholder="Pool, garden, double garage, ocean view" style={inp} value={s.cmaSubject.features||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,features:e.target.value}})}/></div>
            {s.cmaComps.map((comp,i)=>(
              <div key={i}>
                <div style={{height:"1px",background:"#252530",margin:"12px 0"}}/>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color:"#2AB8D4",marginBottom:"10px"}}>📊 Comparable {i+1}</div>
                <div style={{marginBottom:"10px"}}><label style={lbl}>Address</label><input type="text" placeholder={`${100+i*10} Nearby St`} style={inp} value={comp.address||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],address:e.target.value};update({cmaComps:c})}}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  {[["salePrice","Sale Price ($)","430,000"],["saleDate","Sale Date","Jan 2025"],["daysOnMarket","Days on Market","18"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={comp[k]||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],[k]:e.target.value};update({cmaComps:c})}}/></div>))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  {[["beds","Beds","3"],["baths","Baths","2"],["sqft","Sq Ft","1,750"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={comp[k]||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],[k]:e.target.value};update({cmaComps:c})}}/></div>))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  {[["pricePerSqft","Price/Sq Ft","$246"],["aboveBelow","Above/Below Asking","$5K above"],["condition","Condition","Good"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={comp[k]||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],[k]:e.target.value};update({cmaComps:c})}}/></div>))}
                </div>
                <div><label style={lbl}>Key Differences from Subject Property</label><input type="text" placeholder="No pool, original kitchen, smaller lot" style={inp} value={comp.notes||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],notes:e.target.value};update({cmaComps:c})}}/></div>
              </div>
            ))}
          </div>
        )}

        {/* Regular Property Card */}
        {showProp && !isObjection && !isPriceDiscussion && !isExpiredListing && !isPreListing && !isFSBO && !isBuyerMatch && !isOfferStrategy && !isViewingFollowUp && !isPriceDrop && (
          <PropCard s={s} update={update} tog={tog}
            title={isBuyer()?"🏠 Property You're Offering":isSeller()?"🏠 Their Property":"🏠 Property Details"}
            showFullFeatures={showFullFeatures}
          />
        )}

        {/* Buyer Criteria */}
        {isBuyer() && !["financing_update","market_update","reconnect","first_contact","re_engagement","offer_strategy","just_sold"].includes(s.contactReason) && (
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"8px",color:"#fff"}}>🔍 Buyer Criteria</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"12px"}}>What is this buyer specifically looking for?</p>
            <Chips options={[{value:"u500",label:"Under $500K"},{value:"500_1m",label:"$500K–$1M"},{value:"1m_2m",label:"$1M–$2M"},{value:"2m_5m",label:"$2M–$5M"},{value:"5m_plus",label:"$5M+"},{value:"1bed",label:"1 Bedroom"},{value:"2bed",label:"2 Bedrooms"},{value:"3bed",label:"3 Bedrooms"},{value:"4bed",label:"4+ Bedrooms"},{value:"house",label:"House"},{value:"apt",label:"Apartment"},{value:"condo",label:"Condo"},{value:"villa",label:"Villa"},{value:"townhouse",label:"Townhouse"},{value:"pool",label:"Pool"},{value:"garden",label:"Garden"},{value:"seaview",label:"Sea View"},{value:"investment",label:"Investment"},{value:"primary",label:"Primary Home"},{value:"schools",label:"Good Schools"},{value:"quiet",label:"Quiet Area"},{value:"citycenter",label:"City Center"},{value:"petfriendly",label:"Pet Friendly"},{value:"new_build",label:"New Build"},{value:"turnkey",label:"Turn-Key Ready"},{value:"fixer",label:"Fixer Upper"},{value:"parking",label:"Parking"},{value:"elevator",label:"Elevator"},{value:"waterfront",label:"Waterfront"},{value:"gated",label:"Gated Community"},{value:"home_office",label:"Home Office"},{value:"no_hoa",label:"No HOA"}]} selected={s.buyerCriteria} onToggle={v=>update({buyerCriteria:tog(s.buyerCriteria,v)})}/>
            <div style={{marginTop:"8px"}}><label style={lbl}>Specific Requirements (optional)</label><textarea placeholder="e.g. Must be walking distance to good schools, needs a home office, dog-friendly, partner works in downtown..." rows={2} style={{...inp,resize:"vertical"}} value={s.buyerNeeds||""} onChange={e=>update({buyerNeeds:e.target.value})}/></div>
          </div>
        )}

        {/* Seller Situation */}
        {isSeller() && (
          <div style={{...card,background:"rgba(42,184,212,0.03)",border:"1px solid rgba(42,184,212,0.15)"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏷️ Seller Situation</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"14px",lineHeight:"1.6"}}>Select all that apply — the AI tailors every message to their exact situation.</p>
            <Chips options={SELLER_SITUATION_EN} selected={s.sellerSituation} onToggle={v=>update({sellerSituation:tog(s.sellerSituation,v)})}/>
          </div>
        )}

        {/* Personal Context — GREY, not aqua, hidden for reconnect */}
        {!isReconnect && (
          <div style={contextBoxStyle}>
            <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,0.6)",marginBottom:"6px"}}>✨ Personal Context</div>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.45)",marginBottom:"10px",lineHeight:"1.6"}}>Prior contact history, personal notes — anything about this client you want woven into every message.</p>
            <textarea
              placeholder="e.g. Sarah has been a lead for 2 months — very interested but hesitant. Two kids, tight timeline, husband needs convincing. Met twice. Responds well to WhatsApp."
              rows={4}
              value={s.customSituation||""}
              onChange={e=>update({customSituation:e.target.value})}
              style={{...inp,resize:"vertical",borderColor:"rgba(255,255,255,0.15)",background:"#0d0d0d"}}
            />
          </div>
        )}

        {/* Agent Details */}
        <div style={card}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>🏷️ Your Details</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
            <div><label style={lbl}>Your Name</label><input type="text" placeholder="James Rivera" style={inp} value={s.agentName||""} onChange={e=>update({agentName:e.target.value})}/></div>
            <div><label style={lbl}>Your Phone</label><input type="text" placeholder="+1 305 555 0199" style={inp} value={s.agentPhone||""} onChange={e=>update({agentPhone:e.target.value})}/></div>
          </div>
          <div><label style={lbl}>Agency / Company Name</label><input type="text" placeholder="Rivera Real Estate Group" style={inp} value={s.agencyName||""} onChange={e=>update({agencyName:e.target.value})}/></div>
        </div>

        {/* Error */}
        {s.error&&<div style={{background:"#1a0808",border:"1px solid #3a1010",borderRadius:"8px",padding:"12px 16px",color:"#f87171",fontSize:"13px",marginBottom:"16px"}}>{s.error}</div>}

        {/* Loading */}
        {s.loading&&(
          <div style={{background:"#111",border:"1px solid #222",borderRadius:"10px",padding:"18px 22px",marginBottom:"16px",textAlign:"center"}}>
            <p style={{color:"#2AB8D4",fontSize:"14px",margin:"0",fontWeight:"600"}}>{s.loadingMsg}</p>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",margin:"6px 0 0"}}>Generating. Please wait...</p>
          </div>
        )}

        {/* Generate */}
        <button
          onClick={()=>{if(canGenerate()&&!s.loading)generate()}}
          style={{background:canGenerate()&&!s.loading?"#2AB8D4":"#1a1a1a",color:canGenerate()&&!s.loading?"#060608":"rgba(255,255,255,0.5)",border:"none",borderRadius:"8px",padding:"13px 24px",fontSize:"15px",fontWeight:"700",cursor:canGenerate()&&!s.loading?"pointer":"not-allowed",fontFamily:"inherit",width:"100%"}}
        >
          {s.loading?"Generating...":"✦ Generate Full Outreach Package"}
        </button>
        {!canGenerate()&&<p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",marginTop:"8px",textAlign:"center"}}>Fill in client name, type, and contact reason to continue.</p>}

      </div>
    </div>
  )
}
