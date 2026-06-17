import { useState, useEffect } from 'react'
import { G, SF, apiClaude, inputStyle, cardStyle, labelStyle, btnStyle, followUpStatus, STATUS_META } from '../globals.js'
import { CopyCard } from '../components/shared/CopyCard.jsx'
import { Chips } from '../components/shared/Chips.jsx'


const INTERIOR_EN = ["Open Plan Living","High Ceilings","Double Height Ceilings","Exposed Beams","Hardwood Floors","Marble Floors","Porcelain Floors","Polished Concrete Floors","Radiant Floor Heating","Modern Kitchen","Chef's Kitchen","Gourmet Kitchen","Granite Countertops","Quartz Countertops","Marble Countertops","Kitchen Island","Butler's Pantry","Scullery / Second Kitchen","Stainless Steel Appliances","High-End Appliances","Wine Refrigerator","Built-in Coffee Machine","Master Suite","Suite with Terrace","Walk-in Wardrobe","His & Hers Wardrobes","En-suite Bathrooms","Double Vanity","Freestanding Soaking Tub","Jetted / Whirlpool Tub","Rainfall Shower","Frameless Glass Shower","Sauna","Steam Room","Home Office","Media Room / Cinema","Game Room","Music Room","Library / Study","Art Studio","Indoor Gym","Flex / Bonus Room","Fireplace","Double-Sided Fireplace","Wet Bar","Climate-Controlled Wine Cellar","Tasting Room","Laundry Room","Laundry Room with Sink","Finished Basement","Finished Attic / Loft","Smart Home System","Multi-Zone Audio","Smart Lighting","Motorized Blinds / Shades","Smart Thermostat","Video Intercom","App-Controlled Home","Cat6 / Fibre Wiring","Security Alarm System","Surveillance Cameras","Fingerprint / Keypad Entry","Built-in Safe","Solar Panels","Solar Battery Storage","Whole-Home Generator","Premium Insulation","Triple-Glazed Windows","Underfloor Heating","Multi-Zone A/C","Heat Recovery Ventilation","Wheelchair Accessible","Private Elevator","Access Ramp","Adapted Bathroom","Wide Doorways"]
const OUTDOOR_EN = ["Private Pool","Heated Pool","Infinity Pool","Overflow Pool","Pool with Waterfall","Natural / Bio Pool","Hot Tub / Outdoor Spa","Outdoor Shower","Rooftop Terrace","Terrace with Views","Covered Patio / Pergola","Rear Patio","Front Porch","Private Garden","Landscaped Yard","Zen Garden","Tropical Garden","Winter Garden / Greenhouse","Full Outdoor Kitchen","Built-in BBQ / Grill","Wood-Fired Pizza Oven","Fire Pit / Outdoor Fireplace","Outdoor Bar","Outdoor Dining Area","Private Boat Dock","Marina Slip","Boat Launch Ramp","Boat Storage","Private Beach Access","Private Ocean Access","Private Lake Access","Tennis Court","Padel Court","Basketball Court","Putting Green","Boules / Petanque Court","Playground / Play Area","Guest House / Casita","Pool House","Garden Studio / Office","Garage (1 Car)","Garage (2 Car)","Garage (3+ Car)","Boat / RV Garage","Workshop / Storage","EV Charging Station","Gated Entry","Automatic Gate","Outdoor Security Cameras","Landscape Lighting","Solar Lighting","Paved Driveway","Green Roof","Vegetable Garden / Orchard","Private Well","Automated Irrigation System","Running / Jogging Track"]
const BUILDING_EN = ["24/7 Concierge Service","Digital Concierge","Doorman","Overnight Doorman","Valet Parking","24/7 Security","Private Security Guard","Access Control System","Key Fob / App Access","Rooftop Pool","Indoor Pool","Outdoor Community Pool","Jacuzzi / Hot Tub Area","Sundeck / Solarium","Private Beach Club","Full Fitness Center","Yoga Studio","Pilates Studio","Boxing Gym","Squash Court","Full-Service Spa","Shared Sauna","Massage Room","Beauty Salon","Co-working Space","Meeting Rooms","Conference Center","Business Center","Community Library","Community Cinema","Party / Event Room","Social Lounge","Community Rooftop Terrace","BBQ Area","Children's Play Area","Dog Park","Pet-Friendly","Pet Care Services","Housekeeping Service","Laundry Service","Private Storage Unit","Bike Storage","Low HOA Fees","No HOA","Utilities Included","Maintenance Service Included","Covered Parking","Double Parking","Visitor Parking","EV Charging in Parking","LEED Certified","Energy Class A Building","BREEAM Certified","Community Solar Panels","Disability Access","High-Capacity Elevator","Smart Package Lockers","Bike Share / E-Bike Program"]

const REASONS_BUYER_EN = [
  {value:"new_listing",label:"New Listing Match",desc:"Property matches their criteria"},
  {value:"price_drop",label:"Price Reduction",desc:"Property they liked dropped"},
  {value:"first_contact",label:"First Outreach",desc:"Never contacted before"},
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"open_house",label:"Open House Invite",desc:"Invite to view"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"off_market",label:"Off-Market Deal",desc:"Exclusive property"},
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
  {value:"buyer_active",label:"Active Buyer",desc:"Looking now, ready to move"},
  {value:"buyer_passive",label:"Passive Buyer",desc:"Interested but not urgent"},
  {value:"seller_motivated",label:"Motivated Seller",desc:"Wants to sell fast"},
  {value:"seller_exploring",label:"Exploring Seller",desc:"Considering selling"},
  {value:"investor",label:"Investor",desc:"ROI-focused opportunity"},
  {value:"cold_lead",label:"Cold Lead",desc:"No prior contact"},
  {value:"past_client",label:"Past Client",desc:"Already closed together"},
]
const TONES_EN = [
  {value:"warm",label:"Warm & Personal",desc:"Friendly, relationship-first"},
  {value:"professional",label:"Professional",desc:"Polished, credible"},
  {value:"urgent",label:"Urgent & Direct",desc:"Time-sensitive"},
  {value:"casual",label:"Casual & Relaxed",desc:"Low pressure"},
  {value:"luxury",label:"Luxury & Prestige",desc:"High-end, exclusive"},
  {value:"consultative",label:"Consultative",desc:"Advisory, thoughtful"},
  {value:"empathetic",label:"Empathetic",desc:"Understanding, compassionate"},
  {value:"confident_bold",label:"Confident & Bold",desc:"Strong, assertive"},
  {value:"educational",label:"Educational",desc:"Informative, helpful"},
  {value:"straight_talking",label:"Straight Talking",desc:"Direct, no fluff"},
]
const URGENCY_EN = [
  {value:"high",label:"High Urgency",desc:"Must act now"},
  {value:"medium",label:"Medium Urgency",desc:"1-3 months"},
  {value:"low",label:"Low Urgency",desc:"Building relationship"},
]
const TABS_EN = [
  {id:"messages",label:"Messages"},
  {id:"email",label:"Email"},
  {id:"voice",label:"Voice"},
]
const SYSTEM = "You are an elite real estate sales coach. Respond with ONLY a raw valid JSON object. Start with { end with }. No markdown. No backticks. No explanation."

const initState = (lang) => ({
  language:lang||"English", clientName:"", clientType:"", contactReason:"",
  urgency:"", tone:"", objection:"", objectionText:"", objectionSituation:"",
  visitedProperty:null,
  propAddress:"", propPrice:"", propOldPrice:"", propNewPrice:"", propType:"",
  propBeds:"", propBaths:"", propSqft:"", propCondition:"", propHighlights:"", propKeyFeatures:"",
  propInterior:[], propOutdoor:[], propBuilding:[],
  compAddress:"", compPrice:"", compBeds:"", compBaths:"", compSqft:"",
  compCondition:"", compKeyFeatures:"", compDaysOnMarket:"", compAboveBelow:"",
  buyerBudget:"", buyerCriteria:[], buyerNeeds:"", buyerProfile:[], buyerWhatLookingFor:"", buyerMotivations:[], buyerWishlist:"",
  buyerMatchBeds:"", buyerMatchBaths:"", buyerMatchSqft:"", buyerMatchType:"", buyerMatchCondition:"",
  buyerSpecificReqs:"", buyerProfileOther:"", customSituation:"",
  partnerNotConvincedReason:"",
  seenProperties:"", missingFromViewed:[], missingFromViewedOther:"",
  uncertaintyReasons:[], uncertaintyOther:"",
  rentAmount:"", rentingYears:"",
  currentPropAddress:"", currentPropValue:"", currentPropBeds:"", currentPropBaths:"",
  currentPropSqft:"", currentPropCondition:"", currentPropKeyFeatures:"",
  currentPropMortgage:"", currentPropTargetPrice:"",
  currentPropListedStatus:null, currentPropAgentStatus:null,
  currentPropMotivation:[], currentPropConcern:[], currentPropBuyerContext:"",
  badTimingReasons:[], badTimingHowLong:null, badTimingOther:"",
  notApprovedReason:"", spokeToLender:null, approvalConcerns:[],
  needMoreTimeReasons:[], needMoreTimeHowLong:null, needMoreTimeOther:"",
  scaredReasons:[], scaredOther:"",
  locationConcerns:[], locationOther:"",
  pressuredWhatHappened:"",
  waitingReasons:[], waitingOther:"",
  agentSatisfaction:null, agentSwitchReason:"",
  financingRateQuoted:"", financingLoanAmount:"",
  financingOptions:[], financingNews:"",
  sellerSituation:[], sellerPersonalContext:"", sellerWhatGoals:"", sellerExpectedPrice:"", sellerProfileOther:"",
  soldAddress:"", soldPrice:"", soldBeds:"", soldBaths:"", soldType:"",
  soldDaysOnMarket:"", soldAboveBelow:"", soldDate:"", soldCondition:"",
  soldPricePerSqft:"", soldKeyFeatures:"",
  marketLocation:"", marketDirection:[], marketInsight:"", marketStats:"",
  reconnectSituation:[], reconnectOther:"", lookingFor:"",
  introSource:null, introSourceContext:"", introComeAcross:[],
  leadSource:null, leadSourceContext:"", knownAboutProperty:"", firstOutcomeGoal:"",
  daysOnMarket:"", priceReasons:[], sellerUrgency:[],
  expOrigPrice:"", expDays:"", expiredReasons:[], expiredReasonsOther:"", relistStrategy:[], relistDifferent:"",
  preListingItems:[],
  originalTimeline:"", timelineChanges:[], timelineEmotion:[], newTimeline:"", timelineContext:"",
  buyerType:"", buyerWantsInterior:[], buyerWantsOutdoor:[], buyerWantsBuilding:[],
  offerAskingPrice:"", offerAmount:"", offerDaysOnMarket:"",
  offerPosition:null, offerMarket:[], offerLevers:[], offerDeposit:"", offerClosing:"", sellerPriorities:"",
  fsboReasons:"", fsboAdvantages:[],
  anniversaryYears:"",
  cmaSubject:{address:"",price:"",beds:"",baths:"",sqft:"",yearBuilt:"",parking:"",condition:"",recentRenovations:"",hoaFees:"",features:""},
  cmaComps:[
    {address:"",salePrice:"",saleDate:"",daysOnMarket:"",beds:"",baths:"",sqft:"",pricePerSqft:"",aboveBelow:"",condition:"",notes:""},
    {address:"",salePrice:"",saleDate:"",daysOnMarket:"",beds:"",baths:"",sqft:"",pricePerSqft:"",aboveBelow:"",condition:"",notes:""},
    {address:"",salePrice:"",saleDate:"",daysOnMarket:"",beds:"",baths:"",sqft:"",pricePerSqft:"",aboveBelow:"",condition:"",notes:""},
  ],
  agentName:"", agentPhone:"", agencyName:"",
  regenContext:"", regenLoading:false, fuSubTab:"noreply",
  savedClientId:null, fuStatus:"new",
  loading:false, loadingMsg:"", result:null, error:"", activeTab:"messages",
})

const inp = {width:"100%",background:"#060608",border:"1px solid #252530",borderRadius:"8px",color:"rgba(255,255,255,0.65)",fontSize:"14px",padding:"11px 14px",outline:"none",fontFamily:"inherit",boxSizing:"border-box",WebkitTextFillColor:"rgba(255,255,255,0.55)"}
const lbl = {display:"block",fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",color:"#ffffff",textTransform:"uppercase",marginBottom:"5px"}
const card = {background:"#0c0c10",border:"1px solid #252530",borderRadius:"12px",padding:"22px",marginBottom:"16px"}
const ctxStyle = {background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}

function BuyerProfileBox({ s, update, tog, hideLooking }) {
  return (
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"12px",padding:"22px",marginBottom:"16px"}}>
      <h2 style={{fontSize:"16px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>👤 Buyer Profile, Criteria & Context</h2>
      <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>The more detail here, the more precisely the AI handles this.</p>
      <Chips label="Buyer Profile" options={[
        {value:"cash_buyer",label:"Cash Buyer"},{value:"pre_approved",label:"Pre-Approved"},
        {value:"first_time",label:"First-Time Buyer"},{value:"chain_free",label:"Chain-Free"},
        {value:"self_employed",label:"Self-Employed"},{value:"high_net_worth",label:"High Net Worth"},
        {value:"foreign_national",label:"Foreign National"},{value:"buy_to_let",label:"Buy-to-Let"},
        {value:"mortgage_in_principle",label:"Mortgage in Principle"},{value:"relocating",label:"Relocating"},
        {value:"investor",label:"Investor"},{value:"recently_divorced",label:"Recently Divorced"},
        {value:"inheritance",label:"Using Inheritance"},{value:"corporate_relocation",label:"Corporate Relocation"},
      ]} selected={s.buyerProfile||[]} onToggle={v=>update({buyerProfile:tog(s.buyerProfile||[],v)})}/>
      <div style={{marginBottom:"12px"}}>
        <label style={lbl}>Anything else about this buyer not listed above?</label>
        <input type="text" placeholder="e.g. Needs to complete before school term, partner is non-resident..." style={inp} value={s.buyerProfileOther||""} onChange={e=>update({buyerProfileOther:e.target.value})}/>
      </div>
      {!hideLooking&&<div style={{marginBottom:"14px"}}>
        <label style={lbl}>What Are They Looking For & Why?</label>
        <textarea placeholder="e.g. 3-bed house with garden near good schools, wants to upsize because they are starting a family, needs a home office..." rows={3} style={{...inp,resize:"vertical",marginTop:"6px"}} value={s.buyerWhatLookingFor||""} onChange={e=>update({buyerWhatLookingFor:e.target.value})}/>
      </div>}
      <div style={{marginBottom:"12px"}}>
        <label style={lbl}>Budget Value</label>
        <input type="text" placeholder="e.g. $800,000" style={inp} value={s.buyerBudget||""} onChange={e=>update({buyerBudget:e.target.value})}/>
      </div>
      <div>
        <label style={lbl}>Personal Context</label>
        <textarea placeholder="e.g. Sarah has been looking 3 months. Two kids, tight timeline, husband needs convincing. Responds well to WhatsApp." rows={3} style={{...inp,resize:"vertical"}} value={s.customSituation||""} onChange={e=>update({customSituation:e.target.value})}/>
      </div>
    </div>
  )
}

function SellerProfileBox({ s, update, tog }) {
  return (
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"12px",padding:"22px",marginBottom:"16px"}}>
      <h2 style={{fontSize:"16px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏡 Seller Profile, Criteria & Context</h2>
      <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>The more detail here, the more personalised and powerful the AI message.</p>
      <Chips label="Seller Profile" options={[
        {value:"quick_sale",label:"Wants Quick Sale"},{value:"top_dollar",label:"Needs Top Dollar"},
        {value:"flexible",label:"Flexible on Timeline"},{value:"downsizing",label:"Downsizing"},
        {value:"upsizing",label:"Upsizing"},{value:"relocating",label:"Relocating"},
        {value:"divorce",label:"Divorce Settlement"},{value:"inherited",label:"Inherited Property"},
        {value:"investment",label:"Investment Property Sale"},{value:"found_new",label:"Already Found New Home"},
        {value:"testing",label:"Testing the Market"},{value:"financial_pressure",label:"Financial Pressure"},
        {value:"retirement",label:"Retirement"},{value:"empty_nester",label:"Empty Nester"},
      ]} selected={s.sellerSituation} onToggle={v=>update({sellerSituation:tog(s.sellerSituation,v)})}/>
      <div style={{marginBottom:"12px"}}>
        <label style={lbl}>Anything else about this seller not listed above?</label>
        <input type="text" placeholder="e.g. Recently retired, needs a ground floor property, open to lease back..." style={inp} value={s.sellerProfileOther||""} onChange={e=>update({sellerProfileOther:e.target.value})}/>
      </div>
      <div style={{marginBottom:"14px"}}>
        <label style={lbl}>What Are Their Goals & Why Are They Selling?</label>
        <textarea placeholder="e.g. Wants to downsize after kids left home, needs to sell within 3 months due to work relocation, prioritising speed over maximum price..." rows={3} style={{...inp,resize:"vertical",marginTop:"6px"}} value={s.sellerWhatGoals||""} onChange={e=>update({sellerWhatGoals:e.target.value})}/>
      </div>
      <div style={{marginBottom:"12px"}}>
        <label style={lbl}>Expected Sale Price</label>
        <input type="text" placeholder="e.g. $650,000" style={inp} value={s.sellerExpectedPrice||""} onChange={e=>update({sellerExpectedPrice:e.target.value})}/>
      </div>
      <div>
        <label style={lbl}>Personal Context</label>
        <textarea placeholder="e.g. Been thinking about selling for 6 months. Wife is motivated but husband is hesitant. Two kids in local school. Need to move by summer." rows={3} style={{...inp,resize:"vertical"}} value={s.sellerPersonalContext||""} onChange={e=>update({sellerPersonalContext:e.target.value})}/>
      </div>
    </div>
  )
}

function PropCard({ s, update, tog, title, showFeatures }) {
  return (
    <div style={card}>
      <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>{title||"🏠 Property Details"}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
        <div><label style={lbl}>Address</label><input type="text" placeholder="42 Palm Drive, Miami FL" style={inp} value={s.propAddress||""} onChange={e=>update({propAddress:e.target.value})}/></div>
        <div><label style={lbl}>Property Type</label><input type="text" placeholder="Villa, Apartment..." style={inp} value={s.propType||""} onChange={e=>update({propType:e.target.value})}/></div>
        <div><label style={lbl}>Asking Price ($)</label><input type="text" placeholder="1,200,000" style={inp} value={s.propPrice||""} onChange={e=>update({propPrice:e.target.value})}/></div>
        <div><label style={lbl}>Condition</label><input type="text" placeholder="Good, renovated kitchen" style={inp} value={s.propCondition||""} onChange={e=>update({propCondition:e.target.value})}/></div>
        <div><label style={lbl}>Beds</label><input type="text" placeholder="4" style={inp} value={s.propBeds||""} onChange={e=>update({propBeds:e.target.value})}/></div>
        <div><label style={lbl}>Baths</label><input type="text" placeholder="3" style={inp} value={s.propBaths||""} onChange={e=>update({propBaths:e.target.value})}/></div>
      </div>
      <div style={{marginBottom:"12px"}}><label style={lbl}>Size (sq ft)</label><input type="text" placeholder="2,400" style={inp} value={s.propSqft||""} onChange={e=>update({propSqft:e.target.value})}/></div>
      {showFeatures&&<>
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

function FollowUpBar({ status, onSent, onResponded, onClosed, onReopen }) {
  const meta = STATUS_META[status] || STATUS_META.new
  const isNew = status==="new"
  const wrap = {background:"rgba(255,255,255,0.02)",border:"1px solid #1c1c24",borderRadius:"10px",padding:"9px 13px",marginBottom:"18px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"}
  const left = {display:"flex",alignItems:"center",gap:"8px",minWidth:"0"}
  const btn = (bg,col,brd) => ({background:bg,color:col,border:brd||"none",borderRadius:"7px",padding:"7px 11px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"})
  const btnRow = {display:"flex",gap:"7px",flexWrap:"wrap"}
  return (
    <div style={wrap}>
      <div style={left}>
        <span style={{width:"8px",height:"8px",borderRadius:"50%",background:meta.dot,flexShrink:"0"}}/>
        <span style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.03em",color:isNew?"rgba(255,255,255,0.6)":"#fff"}}>
          {isNew ? "Send your outreach to activate" : "Follow-Up Status: "+meta.label}
        </span>
      </div>
      <div style={btnRow}>
        {status==="new" && <button onClick={onSent} style={btn("#2AB8D4","#060608")}>📤 I sent it</button>}
        {(status==="new"||status==="awaiting"||status==="overdue"||status==="active") &&
          <button onClick={onResponded} style={btn("rgba(42,184,212,0.12)","#2AB8D4","1px solid rgba(42,184,212,0.4)")}>📲 They responded</button>}
        {(status==="awaiting"||status==="overdue"||status==="active") &&
          <button onClick={onClosed} style={btn("transparent","rgba(255,255,255,0.55)","1px solid #2a2a33")}>✓ Mark closed</button>}
        {status==="closed" && <button onClick={onReopen} style={btn("transparent","rgba(255,255,255,0.55)","1px solid #2a2a33")}>↩ Reopen</button>}
      </div>
    </div>
  )
}

export default function App2({ state: appState, setScreen }) {
  const [s, setS] = useState(initState(appState.lang))
  const update = u => setS(prev=>({...prev,...u}))
  const tog = (arr,val) => arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]

  // When a result first appears, jump to the top so the user starts at "Important message".
  useEffect(() => {
    if (s.result) window.scrollTo(0, 0)
  }, [s.result])

  const isSpa = s.language==="Spanish"
  const isBuyer = () => s.clientType.includes("buyer")||s.clientType==="investor"
  const isSeller = () => s.clientType.includes("seller")
  const canGenerate = () => s.clientName&&s.clientType&&s.contactReason

  const isCMA = s.contactReason==="free_valuation"
  const isSoldNearby = s.contactReason==="just_sold"
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
  const isNewListing = s.contactReason==="new_listing"
  const isOffMarket = s.contactReason==="off_market"
  const showWishlist = isNewListing||isPriceDrop||isViewingFollowUp||isOffMarket
  const isNoProperty = ["market_update","financing_update","re_engagement","referral_request","anniversary","neighbourhood_news","market_value_update","reconnect","first_contact"].includes(s.contactReason)
  const showProp = !isNoProperty&&!isSoldNearby&&!isCMA&&!isBuyerMatch&&!isObjection
  const showFeatures = showProp&&!isPriceDiscussion&&!isExpiredListing&&!isPreListing&&!isFSBO&&!isTimelineCheckin
  const hideUrgencyTone = isFirstContact&&isBuyer()
  const showSellerProfile = isSeller()&&!isFirstContact&&!isObjection&&!isReconnect&&!isBuyerMatch
  const CONTACT_REASONS = isSeller()?REASONS_SELLER_EN:s.clientType==="past_client"?REASONS_PAST_EN:s.clientType==="cold_lead"?REASONS_COLD_EN:REASONS_BUYER_EN

  const generate = async () => {
    update({loading:true,error:"",result:null})
    const langI = isSpa?"\n\nCRITICO: Escribe TODO completamente en espanol.":""
    const safe = async(p,sys,t)=>{try{return await apiClaude(p,sys,t)||{}}catch(e){return{}}}
    const ag = s.agentName||"Agent"
    const buyerCtx = isBuyer()&&isObjection?`BUYER PROFILE:${(s.buyerProfile||[]).join(",")||"not specified"}|LOOKING FOR:${s.buyerWhatLookingFor||"not specified"}|BUDGET:${s.buyerBudget||"not specified"}|CONTEXT:${s.customSituation||"none"}`:"" 
    const ctx = `CLIENT:${s.clientName}|TYPE:${s.clientType}|REASON:${s.contactReason}|URGENCY:${s.urgency||"medium"}|TONE:${s.tone||"professional"}
PROPERTY:${s.propAddress||"N/A"}|$${s.propPrice||"N/A"}|${s.propType||""}|Beds:${s.propBeds||""}|Baths:${s.propBaths||""}|${s.propHighlights||""}
${s.propInterior.length?"INTERIOR:"+s.propInterior.slice(0,8).join(","):""}${s.propOutdoor.length?" OUTDOOR:"+s.propOutdoor.slice(0,6).join(","):""}
${buyerCtx}
${isSeller()?"SELLER SITUATION:"+s.sellerSituation.join(","):""}
${!isObjection&&s.customSituation?"AGENT CONTEXT: "+s.customSituation:""}
${showWishlist&&s.buyerWishlist?"BUYER WISHLIST: "+s.buyerWishlist+" | CRITICAL: Only mention wishlist items the property above ACTUALLY has. Never claim the property matches a want unless the property data confirms it. Stay silent on wishes the property doesn't meet.":""}
AGENT:${ag}${s.agentPhone?"|"+s.agentPhone:""}${s.agencyName?"|"+s.agencyName:""}`

    try {
      update({loadingMsg:"✦ Writing messages..."})

      if(isObjection) {
        const objDetail = s.objectionText||s.objection||"general objection"
        const objSituation = s.objectionSituation||"No additional context provided"
        const visitCtx = s.visitedProperty==="yes"?"The buyer HAS visited the property in person.":s.visitedProperty==="no"?"The buyer has NOT visited — only seen details online.":""
        const compCtx = s.compAddress?`COMPARABLE: ${s.compAddress} sold $${s.compPrice} | ${s.compBeds}bed/${s.compBaths}bath | ${s.compSqft}sqft | ${s.compCondition} | ${s.compKeyFeatures} | ${s.compDaysOnMarket} days on market | ${s.compAboveBelow}`:"No comparable provided"
        const objCtx = `${ctx}
OBJECTION:"${objDetail}"
${visitCtx}
${compCtx}`
        // Shared rules + context for every approach. Three SMALL calls (one per approach)
        // are far more reliable than one huge call, so the JSON always parses cleanly.
        const objBase = `${objCtx}${langI}

EXACT OBJECTION: "${objDetail}"
FULL SITUATION: "${objSituation}"

You are an elite real estate sales coach trained in Grant Cardone and Ryan Serhant methodology.

CRITICAL RULES:
- Use ${s.clientName}'s name naturally — make it feel like a real conversation, not a script
- Reference the EXACT details from the situation above — be specific, personal, real
- Never sound robotic, salesy, or scripted — sound like a trusted advisor who genuinely cares
- Every message MUST end with one simple natural open question
- NEVER use "another source of stress" — say "a source of stress" if needed
- NEVER reference other buyers as a threat or guilt tool
- NEVER invent market data, statistics, or listings not provided above`

        const approach = async (style, prefix) => {
          const r = await safe(`${objBase}

APPROACH STYLE: ${style}

Return ONLY JSON:
{"whatsapp":"60-80 words. ${style}. Ends with open question.","sms":"Max 160 chars. ${style}. Ends with question.","voice":"Call script: OPENING (name), ACKNOWLEDGE, MAIN POINT, REFRAME, OPEN QUESTION. Labelled.","email_subject":"Subject under 9 words.","email":"120-140 word email. ${style}. Ends with open question. Signed by ${ag}."}`, SYSTEM, 1100)
          return {
            [prefix+"_whatsapp"]: r.whatsapp||"",
            [prefix+"_sms"]: r.sms||"",
            [prefix+"_voice"]: r.voice||"",
            [prefix+"_email_subject"]: r.email_subject||"",
            [prefix+"_email"]: r.email||"",
          }
        }

        update({loadingMsg:"✦ Crafting approach 1 of 3 — Data & Market Proof..."})
        const a1 = await approach("DATA & MARKET PROOF — facts-first, specific, analytical, builds confidence with real detail", "v1")
        update({loadingMsg:"✦ Crafting approach 2 of 3 — Empathy & Relationship..."})
        const a2 = await approach("EMPATHY & RELATIONSHIP — completely on their side, warm, trusted friend, never argue", "v2")
        update({loadingMsg:"✦ Crafting approach 3 of 3 — Urgency & Bold Reframe..."})
        const a3 = await approach("URGENCY & BOLD REFRAME — confident and honest, shows their specific power and advantage, never guilt", "v3")
        const objResult = {
          v1_label:"Data & Market Proof", v2_label:"Empathy & Relationship", v3_label:"Urgency & Bold Reframe",
          ...a1, ...a2, ...a3
        }
        update({loadingMsg:"✦ Building follow-up plan..."})
        const fuResult = await safe(`CLIENT:${s.clientName}|OBJECTION:${objDetail}|SITUATION:${objSituation}|AGENT:${ag}${langI}\n\nCRITICAL: Never invent market data or facts not provided. Warm human follow-ups only. Each ends with gentle open question.\n\nReturn ONLY JSON:\n{"followup_1":"Day 3. 50-60 words. Warm check-in referencing their specific situation. No invented data. Ends with gentle open question.","followup_2":"Week 1. 50-60 words. Different angle. No invented data. Ends with open question.","followup_3":"Week 2. 40-50 words. Casual, human, no pressure. Ends with question.","followup_4":"Month 1. 40-50 words. Warm touch, genuine care. Ends with question.","followup_5":"Month 2. 30-40 words. Final warm message. Keep door open. No pressure."}`,SYSTEM,900)
        const result = {...objResult,...fuResult}
        update({result,activeTab:"messages"})
        const recObj = SF.addClient({clientName:s.clientName,clientType:s.clientType,contactReason:s.contactReason,language:s.language,agentName:ag,result})
        update({savedClientId:recObj?.id||null,fuStatus:"new"})
        update({loading:false})
        return
      }

      let p1=`${ctx}${langI}\n\nGenerate TWO different versions of this outreach so the agent can choose. Both must respect the chosen tone, but be genuinely different in wording and angle.\n\nReturn ONLY JSON:\n{"v1_label":"Option 1","v1_whatsapp":"60-80 word WhatsApp. Warm, use ${s.clientName} first name. End with easy question.","v1_sms":"SMS max 160 chars.","v1_voice":"Call script: OPENING, REASON, VALUE PITCH, CLOSE. Labelled.","v1_email_subject":"Subject under 10 words.","v1_email":"130-160 word email. Opener, opportunity, CTA. Signed by ${ag}${s.agencyName?" from "+s.agencyName:""}.","v2_label":"Option 2","v2_whatsapp":"Different angle. 60-80 word WhatsApp. Use ${s.clientName} first name. End with easy question.","v2_sms":"Different SMS max 160 chars.","v2_voice":"Different call script: OPENING, REASON, VALUE PITCH, CLOSE. Labelled.","v2_email_subject":"Different subject under 10 words.","v2_email":"Different 130-160 word email. Signed by ${ag}${s.agencyName?" from "+s.agencyName:""}."}`;
      if(s.contactReason==="referral_request")p1=`${ctx}${langI}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word referral request. Warm, celebrate, ask naturally.","sms":"Referral SMS max 160 chars.","voice_script":"Referral call: OPENING, CELEBRATION, ASK, CLOSE. Labelled.","email_subject":"Subject under 9 words.","email_body":"120-140 word referral email. Signed by ${ag}."}`;
      if(s.contactReason==="anniversary")p1=`${ctx}${langI}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word anniversary WhatsApp. Warm, celebratory.","sms":"Anniversary SMS max 160 chars.","voice_script":"Anniversary call: OPENING, CELEBRATE, MARKET UPDATE, SOFT CTA. Labelled.","email_subject":"Subject under 9 words.","email_body":"120-140 word anniversary email. Signed by ${ag}."}`;
      if(isCMA)p1=`${ctx}\nSUBJECT:${s.cmaSubject.address}|$${s.cmaSubject.price}|${s.cmaSubject.beds}bed/${s.cmaSubject.baths}bath\nCOMPS:${s.cmaComps.map((c,i)=>`${i+1}. ${c.address} sold $${c.salePrice} ${c.saleDate}`).join("|")}${langI}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp. Warm, valuation complete, booking question.","sms":"SMS max 160 chars.","voice_script":"Call: OPENING, CMA COMPLETE, INSIGHT, BOOK MEETING. Labelled.","email_subject":"Subject under 10 words.","email_body":"140-160 word email. Valuation, insight, invite meeting. Signed by ${ag}."}`;
      const part1=await safe(p1,SYSTEM,2200)
      update({loadingMsg:"✦ Writing letter & follow-ups..."})
      const part2=await safe(`${ctx}${langI}\n\nReturn ONLY JSON:\n{"formal_letter":"Formal letter 260-300 words. Dear ${s.clientName}, 4 paragraphs. Sign: Warm regards,\\n${ag}${s.agencyName?"\\n"+s.agencyName:""}${s.agentPhone?"\\n"+s.agentPhone:""}","followup_1":"Day 3. 50-60 words. Warm, personal, specific. Never invent data. Ends with open question.","followup_2":"Week 1. 50-60 words. Different angle. No invented facts. Ends with open question.","followup_3":"Week 2. 40-50 words. Casual check-in. No pressure. Ends with question.","followup_4":"Month 1. 40-50 words. Warm touch. Ends with question.","followup_5":"Month 2. 30-40 words. Final warm message. Keep door open."}`,SYSTEM,1300)
      const result={...part1,...part2}
      update({result,activeTab:"messages"})
      const recNorm = SF.addClient({clientName:s.clientName,clientType:s.clientType,contactReason:s.contactReason,language:s.language,agentName:ag,result})
      update({savedClientId:recNorm?.id||null,fuStatus:"new"})
    }catch(err){update({error:"Error: "+err.message})}
    update({loading:false})
  }

  if(s.result){
    const r = s.result
    const isObj = !!(r.v1_whatsapp)
    return (
      <div style={{minHeight:"100vh",background:"#060608"}}>
        <div style={{background:"#0c0c10",borderBottom:"1px solid #222",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000"}}>
          <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:"#fff"}}>STREAM<span style={{color:"#2AB8D4"}}>FLUX</span></span>
          <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:"rgba(255,255,255,0.5)",border:"1px solid #222",borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>← Dashboard</button>
        </div>
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"22px 16px 60px"}}>
          <div style={{display:"flex",gap:"4px",marginBottom:"14px",flexWrap:"wrap",background:"#0c0c10",padding:"4px",borderRadius:"10px",border:"1px solid rgba(42,184,212,0.25)"}}>
            {TABS_EN.map(tab=>(
              <button key={tab.id} onClick={()=>update({activeTab:tab.id})}
                style={{background:s.activeTab===tab.id?"#2AB8D4":"#0d0d0d",color:s.activeTab===tab.id?"#060608":"rgba(255,255,255,0.5)",border:s.activeTab===tab.id?"1px solid #252530":"1px solid transparent",borderRadius:"8px",padding:"7px 12px",fontSize:"11px",fontWeight:s.activeTab===tab.id?"700":"500",fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>
                {tab.label}
              </button>
            ))}
          </div>

          {s.fuStatus==="new" ? (
            <div style={{background:"rgba(42,184,212,0.05)",border:"1px solid rgba(42,184,212,0.35)",borderRadius:"12px",padding:"18px 20px",marginBottom:"18px"}}>
              <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.18em",textTransform:"uppercase",color:"#2AB8D4",marginBottom:"8px",fontFamily:"DM Mono,monospace"}}>Important message</div>
              <div style={{fontSize:"17px",fontWeight:"700",color:"rgba(255,255,255,0.92)",marginBottom:"10px",fontFamily:"DM Mono,monospace"}}>{s.clientName}</div>
              <p style={{fontSize:"14px",color:"rgba(255,255,255,0.7)",margin:"0 0 14px",lineHeight:"1.6"}}>Hit the button below to activate this client in your Follow-Up app — you need to click it once you've sent the message.</p>
              <button onClick={()=>{if(s.savedClientId)SF.updateClient(s.savedClientId,{status:"awaiting",sentAt:Date.now()});update({fuStatus:"awaiting"})}}
                style={{background:"#2AB8D4",color:"#060608",border:"none",borderRadius:"8px",padding:"13px 24px",fontSize:"14px",fontWeight:"800",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
                ✓ Yes — I sent it
              </button>
            </div>
          ) : (
            <div style={{background:"rgba(61,158,92,0.1)",border:"1px solid rgba(61,158,92,0.5)",borderRadius:"12px",padding:"18px 20px",marginBottom:"18px"}}>
              <div style={{fontSize:"15px",fontWeight:"800",color:"#fff",marginBottom:"6px"}}>✅ {s.clientName} is now in your Follow-Up Engine</div>
              <p style={{fontSize:"13px",color:"rgba(255,255,255,0.7)",margin:"0 0 14px",lineHeight:"1.6"}}>Open it anytime to see every follow-up, send the next one, or log their reply.</p>
              <button onClick={()=>setScreen({screen:"followup"})}
                style={{background:"transparent",color:"#2AB8D4",border:"1px solid #2AB8D4",borderRadius:"8px",padding:"12px 22px",fontSize:"14px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
                📲 Open Follow-Up Engine →
              </button>
            </div>
          )}

          {s.activeTab==="messages"&&(isObj?(
            <>
              {["v1","v2","v3"].map(v=>(
                r[v+"_whatsapp"]&&<div key={v} style={{background:"#0c0c10",border:"1px solid rgba(42,184,212,0.35)",borderRadius:"12px",padding:"18px",marginBottom:"16px"}}>
                  <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"#ffffff",marginBottom:"12px"}}>{r[v+"_label"]||("Option "+v.slice(1))}</div>
                  <CopyCard title="WhatsApp" content={r[v+"_whatsapp"]||""} icon="" lang={s.language}/>
                  <CopyCard title="SMS" content={r[v+"_sms"]||""} icon="" lang={s.language}/>
                </div>
              ))}
            </>
          ):(
            <><CopyCard title="WhatsApp" content={r.whatsapp||""} icon="" lang={s.language}/><CopyCard title="SMS" content={r.sms||""} icon="" lang={s.language}/></>
          ))}

          {s.activeTab==="email"&&(isObj?(
            <>
              {["v1","v2","v3"].map(v=>(
                r[v+"_email"]&&<div key={v} style={{background:"#0c0c10",border:"1px solid rgba(42,184,212,0.35)",borderRadius:"12px",padding:"18px",marginBottom:"16px"}}>
                  <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"#ffffff",marginBottom:"12px"}}>{r[v+"_label"]||("Option "+v.slice(1))}</div>
                  <CopyCard title="Email Subject" content={r[v+"_email_subject"]||""} icon="" lang={s.language}/>
                  <CopyCard title="Email Body" content={r[v+"_email"]||""} icon="" lang={s.language}/>
                </div>
              ))}
            </>
          ):(
            <><CopyCard title="Email Subject" content={r.email_subject||""} icon="" lang={s.language}/><CopyCard title="Email Body" content={r.email_body||""} icon="" lang={s.language}/></>
          ))}

          {s.activeTab==="voice"&&(isObj?(
            <>
              {["v1","v2","v3"].map(v=>(
                r[v+"_voice"]&&<div key={v} style={{background:"#0c0c10",border:"1px solid rgba(42,184,212,0.35)",borderRadius:"12px",padding:"18px",marginBottom:"16px"}}>
                  <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"#ffffff",marginBottom:"12px"}}>{r[v+"_label"]||("Option "+v.slice(1))}</div>
                  <CopyCard title="Phone Call Script" content={r[v+"_voice"]||""} icon="" lang={s.language}/>
                </div>
              ))}
            </>
          ):(
            <><p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 12px"}}>Read naturally — don't sound like you're reading a script.</p>
            <CopyCard title="Phone Call Script" content={r.voice_script||"No call script generated — please regenerate."} icon="" lang={s.language}/></>
          ))}

          <button onClick={()=>update({...initState(s.language)})} style={{background:"transparent",color:"rgba(255,255,255,0.5)",border:"1px solid #222",borderRadius:"8px",padding:"13px 24px",fontSize:"14px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",marginTop:"16px"}}>← New Client</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:"100vh",background:"#060608"}}>
      <div style={{background:"#0c0c10",borderBottom:"1px solid #222",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000"}}>
        <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:"#fff"}}>STREAM<span style={{color:"#2AB8D4"}}>FLUX</span></span>
        <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:"rgba(255,255,255,0.5)",border:"1px solid #222",borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>← Dashboard</button>
      </div>
      <div style={{maxWidth:"660px",margin:"0 auto",padding:"30px 18px 60px"}}>

        <div style={{...card,marginBottom:"8px"}}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:"#fff"}}>🌐 Output Language</h2>
          <select value={s.language} onChange={e=>update({language:e.target.value,contactReason:""})} style={{...inp,cursor:"pointer"}}>
            <option value="English">🇺🇸 English</option>
            <option value="Spanish">🇪🇸 Español</option>
          </select>
        </div>

        <div style={card}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>👤 Who Are You Contacting?</h2>
          <div style={{marginBottom:"16px"}}><label style={lbl}>Client First Name</label><input type="text" placeholder="Sarah" style={inp} value={s.clientName||""} onChange={e=>update({clientName:e.target.value})}/></div>
          <Chips label="Client Type" options={CLIENT_TYPES_EN} selected={s.clientType} onToggle={v=>setS({...initState(s.language),clientName:s.clientName,clientType:s.clientType===v?"":v})} single/>
          {s.clientType&&<Chips label="Reason for Contacting" options={CONTACT_REASONS} selected={s.contactReason} onToggle={v=>setS({...initState(s.language),clientName:s.clientName,clientType:s.clientType,contactReason:s.contactReason===v?"":v})} single/>}
          {s.contactReason&&!hideUrgencyTone&&<>
            <Chips label="Urgency Level" options={URGENCY_EN} selected={s.urgency} onToggle={v=>update({urgency:s.urgency===v?"":v})} single/>
            <Chips label="Communication Tone" options={TONES_EN} selected={s.tone} onToggle={v=>update({tone:s.tone===v?"":v})} single/>
          </>}
        </div>

        {isFirstContact&&(isBuyer()||s.clientType==="cold_lead")&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>👋 First Contact Details</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>The AI uses this to craft the perfect opening message and call script.</p>
            <Chips label="How Did You Get This Contact?" options={[
              {value:"cold",label:"Cold — Never Met"},{value:"friend_referral",label:"Friend Referral"},
              {value:"past_client_referral",label:"Past Client Referral"},{value:"mutual_connection",label:"Mutual Connection"},
              {value:"met_briefly",label:"Met Briefly"},{value:"social_media",label:"Social Media"},
              {value:"open_house",label:"Open House"},{value:"event_networking",label:"Event / Networking"},
              {value:"linkedin",label:"LinkedIn"},{value:"online_lead",label:"Online Lead"},
              {value:"door_knock",label:"Door Knock"},{value:"area_farming",label:"Area Farming"},
              {value:"cold_dm",label:"Cold DM"},{value:"phone_inquiry",label:"Phone Inquiry"},
            ]} selected={s.introSource?[s.introSource]:[]} onToggle={v=>update({introSource:s.introSource===v?null:v})} single/>
            <div style={{marginBottom:"12px",marginTop:"8px"}}>
              <label style={lbl}>Add more context or specify how you got this contact</label>
              <input type="text" placeholder="e.g. Met at a property expo last month, mentioned actively searching for a 3-bed..." style={inp} value={s.introSourceContext||""} onChange={e=>update({introSourceContext:e.target.value})}/>
            </div>
            <div style={{marginTop:"8px"}}>
              <label style={lbl}>Specific Outcome from This Message</label>
              <input type="text" placeholder="e.g. Get them to agree to a 15-minute call this week to discuss what they are looking for..." style={inp} value={s.firstOutcomeGoal||""} onChange={e=>update({firstOutcomeGoal:e.target.value})}/>
            </div>
          </div>
        )}

        {isFirstContact&&isSeller()&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>📋 Lead Details</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>The AI uses this to craft the perfect opening message and call script.</p>
            <Chips label="How Did You Get This Lead?" options={[
              {value:"door_knock",label:"Door Knock"},{value:"cold_call",label:"Cold Call"},
              {value:"friend_referral",label:"Friend Referral"},{value:"past_client_referral",label:"Past Client Referral"},
              {value:"online",label:"Online Lead"},{value:"direct_mail",label:"Direct Mail"},
              {value:"farming",label:"Area Farming"},{value:"social_media",label:"Social Media"},
              {value:"open_house",label:"Open House"},{value:"networking",label:"Networking"},
            ]} selected={s.leadSource?[s.leadSource]:[]} onToggle={v=>update({leadSource:s.leadSource===v?null:v})} single/>
            <div style={{marginBottom:"12px",marginTop:"8px"}}>
              <label style={lbl}>Add more context or specify how you got this lead</label>
              <input type="text" placeholder="e.g. Knocked on their door after seeing property vacant for 3 months, said they were thinking about selling..." style={inp} value={s.leadSourceContext||""} onChange={e=>update({leadSourceContext:e.target.value})}/>
            </div>
            <div style={{marginBottom:"12px"}}><label style={lbl}>What Do You Know About Their Property?</label>
              <textarea placeholder="e.g. 3-bed on Oak Street, vacant a while, garden needs work..." rows={3} style={{...inp,resize:"vertical"}} value={s.knownAboutProperty||""} onChange={e=>update({knownAboutProperty:e.target.value})}/>
            </div>
            <div>
              <label style={lbl}>Specific Outcome from This Message</label>
              <input type="text" placeholder="e.g. Get them to agree to a valuation appointment this week..." style={inp} value={s.firstOutcomeGoal||""} onChange={e=>update({firstOutcomeGoal:e.target.value})}/>
            </div>
          </div>
        )}

        {isReconnect&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🔄 Reconnecting Details</h2>
            <Chips label="Why Did They Go Quiet?" options={[
              {value:"life_happened",label:"Life Happened"},{value:"changed_budget",label:"Budget Changed"},
              {value:"market_fear",label:"Scared of Market"},{value:"partner_disagreed",label:"Partner Disagreed"},
              {value:"found_something",label:"Found Something Themselves"},{value:"timing",label:"Bad Timing"},
              {value:"overwhelmed",label:"Overwhelmed"},{value:"lost_touch",label:"Just Lost Touch"},
              {value:"not_ready",label:"Wasn't Ready"},{value:"changed_jobs",label:"Changed Jobs"},
              {value:"got_divorced",label:"Got Divorced"},{value:"had_baby",label:"Had a Baby"},
              {value:"inheritance",label:"Inheritance Received"},{value:"partner_now_ready",label:"Partner Now On Board"},
              {value:"lease_ending",label:"Rental Lease Ending"},{value:"sold_other",label:"Sold Another Property"},
              ...(isSeller()?[{value:"renovation_complete",label:"Renovation Complete"},{value:"value_increased",label:"Value Increased"},{value:"market_improved",label:"Market Improved"}]:[]),
            ]} selected={s.reconnectSituation} onToggle={v=>update({reconnectSituation:tog(s.reconnectSituation,v)})}/>
            <div style={{marginBottom:"12px",marginTop:"8px"}}>
              <label style={lbl}>Any other reason they went quiet?</label>
              <input type="text" placeholder="e.g. They just got a promotion and are now looking to upgrade..." style={inp} value={s.reconnectOther||""} onChange={e=>update({reconnectOther:e.target.value})}/>
            </div>
            <div style={{marginTop:"8px"}}><label style={lbl}>What Was the Situation?</label>
              <textarea placeholder="e.g. Searching for 4-bed, budget $650K. We spoke 3 months ago, went quiet after viewing 2 properties..." rows={4} style={{...inp,resize:"vertical"}} value={s.lookingFor||""} onChange={e=>update({lookingFor:e.target.value})}/>
            </div>
          </div>
        )}
        {isReconnect&&isSeller()&&<SellerProfileBox s={s} update={update} tog={tog}/>}
        {isReconnect&&isBuyer()&&<BuyerProfileBox s={s} update={update} tog={tog}/>}

        {isMarketUpdate&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>📊 Market Update Details</h2>
            <div style={{marginBottom:"12px"}}><label style={lbl}>City / Market Area</label><input type="text" placeholder="e.g. Miami Beach" style={inp} value={s.marketLocation||""} onChange={e=>update({marketLocation:e.target.value})}/></div>
            <Chips label="Market Direction" options={["Rising Prices","Stable Market","Cooling Down","High Demand","Low Inventory","Good Time to Buy","Seller's Market","Buyer's Market","Infrastructure Development","Record Sales Volume","International Buyer Interest","Job Market Growing","New Schools Opening","New Transport Links","New Commercial Development","Motivated Sellers","Price Per Sq Ft Rising","Foreclosure Activity","Luxury Market Booming","Interest Rate Changing","Off-Market Activity Increasing"]} selected={s.marketDirection||[]} onToggle={v=>update({marketDirection:tog(s.marketDirection||[],v)})}/>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Your Market Insight</label><textarea placeholder="e.g. Prices up 3%, inventory tightening..." rows={3} style={{...inp,resize:"vertical"}} value={s.marketInsight||""} onChange={e=>update({marketInsight:e.target.value})}/></div>
            <div><label style={lbl}>Specific Stats (optional)</label><input type="text" placeholder="e.g. Median $850K, 12% more sales YOY" style={inp} value={s.marketStats||""} onChange={e=>update({marketStats:e.target.value})}/></div>
          </div>
        )}

        {isFinancingUpdate&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>💰 Financing Update</h2>
            <Chips label="What Changed?" options={[
              {value:"rates_dropped",label:"Rates Dropped"},{value:"fed_cut",label:"Fed Rate Cut"},
              {value:"easier_qualify",label:"Easier to Qualify"},{value:"new_products",label:"New Loan Products"},
              {value:"low_down",label:"Low Down Payment"},{value:"rates_rising",label:"Rates Rising — Act Now"},
              {value:"investor_loans",label:"Investor Loans"},{value:"first_buyer",label:"First-Time Buyer Incentives"},
              {value:"bank_loosened",label:"Bank Policy Loosened"},{value:"foreign_buyer",label:"Foreign Buyer Financing"},
              {value:"govt_scheme",label:"New Government Scheme"},{value:"bridge_loan",label:"Bridge Loan Options"},
              {value:"rate_lock",label:"Rate Lock Opportunity"},{value:"dti_change",label:"DTI Rules Changed"},
            ]} selected={s.financingOptions||[]} onToggle={v=>update({financingOptions:tog(s.financingOptions||[],v)})}/>
            <div style={{marginTop:"8px"}}><label style={lbl}>Specific Details</label><textarea placeholder="e.g. Rates dropped to 6.2%, 10% down available..." rows={3} style={{...inp,resize:"vertical"}} value={s.financingNews||""} onChange={e=>update({financingNews:e.target.value})}/></div>
            {isBuyer()&&<div style={{marginTop:"12px"}}><label style={lbl}>What Is Their Budget & What Are They Looking For?</label><input type="text" placeholder="e.g. Budget $500K, looking for 3-bed near good schools in Miami Beach..." style={inp} value={s.buyerWhatLookingFor||""} onChange={e=>update({buyerWhatLookingFor:e.target.value})}/></div>}
          </div>
        )}

        {isViewingFollowUp&&<PropCard s={s} update={update} tog={tog} title="🏠 Property Viewed" showFeatures={true}/>}
        {isViewingFollowUp&&<BuyerProfileBox s={s} update={update} tog={tog} hideLooking={showWishlist}/>}

        {isPriceDrop&&isBuyer()&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:"#fff"}}>📉 Price Reduction Details</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div><label style={lbl}>New Price ($)</label><input type="text" placeholder="895,000" style={inp} value={s.propNewPrice||""} onChange={e=>update({propNewPrice:e.target.value})}/></div>
              <div><label style={lbl}>Was ($)</label><input type="text" placeholder="995,000" style={inp} value={s.propOldPrice||""} onChange={e=>update({propOldPrice:e.target.value})}/></div>
            </div>
            <PropCard s={s} update={update} tog={tog} title="🏠 The Property" showFeatures={true}/>
          </div>
        )}

        {isOfferStrategy&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🎯 Offer Strategy</h2>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"16px"}}>Build the full offer context so the AI positions your buyer to win.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
              <div><label style={lbl}>Asking Price ($)</label><input type="text" placeholder="850,000" style={inp} value={s.offerAskingPrice||""} onChange={e=>update({offerAskingPrice:e.target.value})}/></div>
              <div><label style={lbl}>Offer Amount ($)</label><input type="text" placeholder="820,000" style={inp} value={s.offerAmount||""} onChange={e=>update({offerAmount:e.target.value})}/></div>
            </div>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Days on Market</label><input type="text" placeholder="e.g. 45 days" style={inp} value={s.offerDaysOnMarket||""} onChange={e=>update({offerDaysOnMarket:e.target.value})}/></div>
            <Chips label="Offer Position" options={[
              {value:"first_offer",label:"First Offer"},
              {value:"counter",label:"Counter Offer"},
              {value:"competing",label:"Competing with Others"},
              {value:"final_best",label:"Final Best Offer"},
            ]} selected={s.offerPosition?[s.offerPosition]:[]} onToggle={v=>update({offerPosition:s.offerPosition===v?null:v})} single/>
            <Chips label="Market Situation" options={[
              {value:"multiple_offers",label:"Multiple Offers"},{value:"motivated_seller",label:"Motivated Seller"},
              {value:"long_on_market",label:"Long on Market"},{value:"fresh_listing",label:"Fresh Listing"},
              {value:"price_reduced",label:"Already Reduced"},
            ]} selected={s.offerMarket} onToggle={v=>update({offerMarket:tog(s.offerMarket,v)})}/>
            <Chips label="Negotiation Levers" options={[
              {value:"clean_offer",label:"Clean Offer"},{value:"quick_close",label:"Quick Closing"},
              {value:"escalation",label:"Escalation Clause"},{value:"personal_letter",label:"Personal Letter"},
              {value:"larger_deposit",label:"Larger Deposit"},{value:"inspection_waived",label:"Inspection Waived"},
              {value:"pre_inspection",label:"Pre-Inspection Done"},{value:"flexible_date",label:"Flexible Move-In"},
              {value:"cash",label:"All Cash"},{value:"pre_approved",label:"Pre-Approved"},
              {value:"appraisal_gap",label:"Appraisal Gap"},{value:"as_is",label:"As-Is Purchase"},
              {value:"leaseback",label:"Seller Leaseback"},{value:"sight_unseen",label:"Sight-Unseen"},
              {value:"attorney_review",label:"Attorney Review"},{value:"closing_costs",label:"Seller Closing Costs"},
            ]} selected={s.offerLevers} onToggle={v=>update({offerLevers:tog(s.offerLevers,v)})}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginTop:"4px",marginBottom:"12px"}}>
              <div><label style={lbl}>Deposit Amount</label><input type="text" placeholder="e.g. $25,000" style={inp} value={s.offerDeposit||""} onChange={e=>update({offerDeposit:e.target.value})}/></div>
              <div><label style={lbl}>Closing Timeline</label><input type="text" placeholder="e.g. 30 days, flexible" style={inp} value={s.offerClosing||""} onChange={e=>update({offerClosing:e.target.value})}/></div>
            </div>
            <div><label style={lbl}>What Matters Most to the Seller?</label><input type="text" placeholder="e.g. Quick close, no repairs, stay 30 days after sale" style={inp} value={s.sellerPriorities||""} onChange={e=>update({sellerPriorities:e.target.value})}/></div>
          </div>
        )}

        {isObjection&&(isBuyer()||s.clientType==="cold_lead"||s.clientType==="past_client")&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>🛡️ Handle Objection</h2>
            <Chips label="Objection They Raised" options={[
              {value:"too_expensive",label:"Too Expensive"},
              {value:"rates_too_high",label:"Mortgage Rates Too High"},
              {value:"not_right_property",label:"Haven't Found Right Property"},
              {value:"partner_not_convinced",label:"Partner Not Convinced"},
              {value:"waiting_prices_drop",label:"Waiting for Prices to Drop"},
              {value:"market_uncertain",label:"Market Too Uncertain"},
              {value:"happy_renting",label:"Happy Renting"},
              {value:"need_to_sell_first",label:"Need to Sell First"},
              {value:"bad_timing",label:"Bad Timing"},
              {value:"not_pre_approved",label:"Not Pre-Approved Yet"},
              {value:"already_have_agent",label:"Already Have an Agent"},
              {value:"need_more_time",label:"Need More Time"},
              {value:"scared_commitment",label:"Scared of Commitment"},
              {value:"location",label:"Not Sure About Location"},
              {value:"doesnt_like_pressure",label:"Doesn't Like to Be Pressured"},
            ]} selected={s.objection?[s.objection]:[]} onToggle={v=>update({objection:s.objection===v?"":v})} single/>
            <div style={{marginTop:"12px",marginBottom:"16px"}}>
              <label style={lbl}>What Did They Say?</label>
              <p style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",margin:"4px 0 6px",lineHeight:"1.5"}}>The more specific you are here, the more personal and powerful the AI response.</p>
              <textarea placeholder="e.g. 'Look, I hear you, but I just don't like being pushed. I'll call you when I'm ready.'" rows={3} style={{...inp,resize:"vertical",marginTop:"6px"}} value={s.objectionText||""} onChange={e=>update({objectionText:e.target.value})}/>
            </div>
            <div style={{marginBottom:"16px"}}>
              <label style={lbl}>What Was the Full Situation?</label>
              <p style={{fontSize:"11px",color:"rgba(255,255,255,0.4)",margin:"4px 0 6px",lineHeight:"1.5"}}>Include what led to this objection, what happened during the viewing or conversation, anything relevant.</p>
              <textarea placeholder="e.g. We had a viewing last Tuesday, he loved the property. I tried to get him to make an offer before the weekend but he pulled back." rows={4} style={{...inp,resize:"vertical"}} value={s.objectionSituation||""} onChange={e=>update({objectionSituation:e.target.value})}/>
            </div>

            {s.objection==="too_expensive"&&(
              <div style={card}>
                <h3 style={{fontSize:"15px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏠 The Property</h3>
                <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"14px"}}>Fill in the full property details. Add a comparable at the bottom to strengthen the price argument.</p>
                <div style={{marginBottom:"16px"}}>
                  <label style={lbl}>Did They Visit the Property?</label>
                  <div style={{display:"flex",gap:"8px",marginTop:"8px",flexWrap:"wrap"}}>
                    {[["yes","Yes — visited in person"],["no","No — only seen online"],["viewing_booked","Viewing booked"]].map(([v,l])=>(
                      <button key={v} onClick={()=>update({visitedProperty:s.visitedProperty===v?null:v})} style={{background:s.visitedProperty===v?"rgba(42,184,212,0.15)":"#060608",border:`1px solid ${s.visitedProperty===v?"#2AB8D4":"#252530"}`,borderRadius:"8px",padding:"8px 14px",fontSize:"12px",color:s.visitedProperty===v?"#2AB8D4":"rgba(255,255,255,0.65)",cursor:"pointer",fontFamily:"inherit",fontWeight:s.visitedProperty===v?"700":"400"}}>{l}</button>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
                  <div><label style={lbl}>Address</label><input type="text" placeholder="42 Palm Drive, Miami" style={inp} value={s.propAddress||""} onChange={e=>update({propAddress:e.target.value})}/></div>
                  <div><label style={lbl}>Property Type</label><input type="text" placeholder="Villa, Apartment..." style={inp} value={s.propType||""} onChange={e=>update({propType:e.target.value})}/></div>
                  <div><label style={lbl}>Asking Price ($)</label><input type="text" placeholder="1,200,000" style={inp} value={s.propPrice||""} onChange={e=>update({propPrice:e.target.value})}/></div>
                  <div><label style={lbl}>Condition</label><input type="text" placeholder="Good, renovated 2022" style={inp} value={s.propCondition||""} onChange={e=>update({propCondition:e.target.value})}/></div>
                  <div><label style={lbl}>Beds</label><input type="text" placeholder="4" style={inp} value={s.propBeds||""} onChange={e=>update({propBeds:e.target.value})}/></div>
                  <div><label style={lbl}>Baths</label><input type="text" placeholder="3" style={inp} value={s.propBaths||""} onChange={e=>update({propBaths:e.target.value})}/></div>
                </div>
                <div style={{marginBottom:"12px"}}><label style={lbl}>Size (sq ft)</label><input type="text" placeholder="2,400" style={inp} value={s.propSqft||""} onChange={e=>update({propSqft:e.target.value})}/></div>
                <Chips label="Interior Features" options={INTERIOR_EN} selected={s.propInterior} onToggle={v=>update({propInterior:tog(s.propInterior,v)})}/>
                <Chips label="Outdoor Features" options={OUTDOOR_EN} selected={s.propOutdoor} onToggle={v=>update({propOutdoor:tog(s.propOutdoor,v)})}/>
                <Chips label="Building Amenities" options={BUILDING_EN} selected={s.propBuilding} onToggle={v=>update({propBuilding:tog(s.propBuilding,v)})}/>
                <div style={{marginTop:"4px",marginBottom:"16px"}}><label style={lbl}>Key Highlights</label><textarea placeholder="Top 2-3 things that make this property stand out..." rows={2} style={{...inp,resize:"vertical"}} value={s.propHighlights||""} onChange={e=>update({propHighlights:e.target.value})}/></div>
                <div style={{paddingTop:"14px",borderTop:"1px solid #252530"}}>
                  <p style={{fontSize:"12px",color:"#ffffff",fontWeight:"700",marginBottom:"4px"}}>📊 Market Comparable (optional but powerful)</p>
                  <p style={{fontSize:"12px",color:"rgba(255,255,255,0.45)",marginBottom:"12px"}}>Add a recently sold comparable to give the AI real market data.</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                    <div><label style={lbl}>Comparable Address</label><input type="text" placeholder="14 Oak St, Miami" style={inp} value={s.compAddress||""} onChange={e=>update({compAddress:e.target.value})}/></div>
                    <div><label style={lbl}>Sold Price ($)</label><input type="text" placeholder="1,150,000" style={inp} value={s.compPrice||""} onChange={e=>update({compPrice:e.target.value})}/></div>
                    <div><label style={lbl}>Beds</label><input type="text" placeholder="4" style={inp} value={s.compBeds||""} onChange={e=>update({compBeds:e.target.value})}/></div>
                    <div><label style={lbl}>Baths</label><input type="text" placeholder="3" style={inp} value={s.compBaths||""} onChange={e=>update({compBaths:e.target.value})}/></div>
                    <div><label style={lbl}>Sq Ft</label><input type="text" placeholder="2,200" style={inp} value={s.compSqft||""} onChange={e=>update({compSqft:e.target.value})}/></div>
                    <div><label style={lbl}>Condition</label><input type="text" placeholder="Good, original kitchen" style={inp} value={s.compCondition||""} onChange={e=>update({compCondition:e.target.value})}/></div>
                    <div><label style={lbl}>Days on Market</label><input type="text" placeholder="18" style={inp} value={s.compDaysOnMarket||""} onChange={e=>update({compDaysOnMarket:e.target.value})}/></div>
                    <div><label style={lbl}>Above / Below Asking</label><input type="text" placeholder="$20K above" style={inp} value={s.compAboveBelow||""} onChange={e=>update({compAboveBelow:e.target.value})}/></div>
                  </div>
                  <div><label style={lbl}>Key Features of Comparable</label><input type="text" placeholder="e.g. No pool, smaller lot, original fixtures" style={inp} value={s.compKeyFeatures||""} onChange={e=>update({compKeyFeatures:e.target.value})}/></div>
                </div>
              </div>
            )}

            {s.objection==="rates_too_high"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  <div><label style={lbl}>Rate They Were Quoted</label><input type="text" placeholder="e.g. 7.2%" style={inp} value={s.financingRateQuoted||""} onChange={e=>update({financingRateQuoted:e.target.value})}/></div>
                  <div><label style={lbl}>Loan Amount</label><input type="text" placeholder="e.g. $450,000" style={inp} value={s.financingLoanAmount||""} onChange={e=>update({financingLoanAmount:e.target.value})}/></div>
                </div>
              </div>
            )}

            {s.objection==="not_right_property"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <div style={{marginBottom:"12px"}}><label style={lbl}>What Have They Seen So Far?</label><textarea placeholder="e.g. Viewed 6 properties, liked 2 but both lacked a home office and garden..." rows={3} style={{...inp,resize:"vertical"}} value={s.seenProperties||""} onChange={e=>update({seenProperties:e.target.value})}/></div>
                <Chips label="What Is Missing from Everything They Have Viewed?" options={["Too small","Wrong location","No outdoor space","No home office","Needs too much work","Too expensive","Wrong property type","No parking","No natural light","Layout doesn't work","Wrong neighbourhood","No pool","No garden","No sea view","No waterfront","Building amenities lacking","Not move-in ready","No garage","No terrace / balcony","No guest room","No storage","Wrong floor level","Too noisy","Not enough bedrooms"]} selected={s.missingFromViewed||[]} onToggle={v=>update({missingFromViewed:tog(s.missingFromViewed||[],v)})}/>
                <div style={{marginTop:"8px"}}><label style={lbl}>Any Other Missing Features</label><input type="text" placeholder="e.g. They really need a wraparound terrace and a wine cellar..." style={inp} value={s.missingFromViewedOther||""} onChange={e=>update({missingFromViewedOther:e.target.value})}/></div>
              </div>
            )}

            {s.objection==="partner_not_convinced"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <label style={lbl}>Why Is the Partner Not Convinced?</label>
                <textarea placeholder="e.g. Her husband hasn't seen the property yet. He thinks the price is too high..." rows={3} style={{...inp,resize:"vertical",marginTop:"6px"}} value={s.partnerNotConvincedReason||""} onChange={e=>update({partnerNotConvincedReason:e.target.value})}/>
              </div>
            )}

            {s.objection==="waiting_prices_drop"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <Chips label="Why Are They Waiting?" options={["Believe prices will drop","Media says market will crash","Saw prices fall elsewhere","Had bad advice from someone","Just cautious by nature","Waiting for interest rates to drop","Waiting for more supply","Think they can time the market","Had a bad past experience"]} selected={s.waitingReasons||[]} onToggle={v=>update({waitingReasons:tog(s.waitingReasons||[],v)})}/>
                <div style={{marginTop:"8px"}}><label style={lbl}>Any Other Reason</label><input type="text" placeholder="e.g. Their friend bought in 2022 and lost value..." style={inp} value={s.waitingOther||""} onChange={e=>update({waitingOther:e.target.value})}/></div>
              </div>
            )}

            {s.objection==="market_uncertain"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <Chips label="Why Is the Market Uncertain?" options={["General economy","Interest rates","Job security","Political climate","Fear of overpaying","Worried prices will drop","Global instability","Local market news","Fear of recession","Stock market volatility","Rising unemployment","Inflation concerns","Housing bubble fear","Environmental risks","Media negativity","Local crime concerns"]} selected={s.uncertaintyReasons||[]} onToggle={v=>update({uncertaintyReasons:tog(s.uncertaintyReasons||[],v)})}/>
                <div style={{marginTop:"8px"}}><label style={lbl}>Any Other Reason</label><input type="text" placeholder="e.g. Their company just announced layoffs..." style={inp} value={s.uncertaintyOther||""} onChange={e=>update({uncertaintyOther:e.target.value})}/></div>
              </div>
            )}

            {s.objection==="happy_renting"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"12px"}}>The AI will calculate how much they've spent renting vs what they could have built in equity.</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  <div><label style={lbl}>Monthly Rent They Pay</label><input type="text" placeholder="e.g. $2,800/month" style={inp} value={s.rentAmount||""} onChange={e=>update({rentAmount:e.target.value})}/></div>
                  <div><label style={lbl}>How Long Renting</label><input type="text" placeholder="e.g. 4 years" style={inp} value={s.rentingYears||""} onChange={e=>update({rentingYears:e.target.value})}/></div>
                </div>
              </div>
            )}

            {s.objection==="need_to_sell_first"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,0.6)",marginBottom:"12px"}}>Their Current Property</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  <div><label style={lbl}>Property Address</label><input type="text" placeholder="22 Oak Ave" style={inp} value={s.currentPropAddress||""} onChange={e=>update({currentPropAddress:e.target.value})}/></div>
                  <div><label style={lbl}>Estimated Value ($)</label><input type="text" placeholder="$520,000" style={inp} value={s.currentPropValue||""} onChange={e=>update({currentPropValue:e.target.value})}/></div>
                  <div><label style={lbl}>Beds</label><input type="text" placeholder="3" style={inp} value={s.currentPropBeds||""} onChange={e=>update({currentPropBeds:e.target.value})}/></div>
                  <div><label style={lbl}>Baths</label><input type="text" placeholder="2" style={inp} value={s.currentPropBaths||""} onChange={e=>update({currentPropBaths:e.target.value})}/></div>
                  <div><label style={lbl}>Sq Ft</label><input type="text" placeholder="1,800" style={inp} value={s.currentPropSqft||""} onChange={e=>update({currentPropSqft:e.target.value})}/></div>
                  <div><label style={lbl}>Condition</label><input type="text" placeholder="Good, updated kitchen" style={inp} value={s.currentPropCondition||""} onChange={e=>update({currentPropCondition:e.target.value})}/></div>
                </div>
                <div style={{marginBottom:"10px"}}><label style={lbl}>Key Features</label><input type="text" placeholder="e.g. Garden, garage, near good schools" style={inp} value={s.currentPropKeyFeatures||""} onChange={e=>update({currentPropKeyFeatures:e.target.value})}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"14px"}}>
                  <div><label style={lbl}>Mortgage Remaining</label><input type="text" placeholder="e.g. $180,000" style={inp} value={s.currentPropMortgage||""} onChange={e=>update({currentPropMortgage:e.target.value})}/></div>
                  <div><label style={lbl}>Target Sale Price ($)</label><input type="text" placeholder="e.g. $540,000" style={inp} value={s.currentPropTargetPrice||""} onChange={e=>update({currentPropTargetPrice:e.target.value})}/></div>
                </div>
                <Chips label="Is Their Property Currently Listed?" options={[{value:"listed_active",label:"Yes — Active on Market"},{value:"not_listed_soon",label:"Not Yet — Planning Soon"},{value:"not_decided",label:"Still Deciding"},{value:"no_plans",label:"No Plans Yet"}]} selected={s.currentPropListedStatus?[s.currentPropListedStatus]:[]} onToggle={v=>update({currentPropListedStatus:s.currentPropListedStatus===v?null:v})} single/>
                <Chips label="Who Is Handling the Sale?" options={[{value:"has_agent",label:"Already Have an Agent"},{value:"fsbo",label:"Thinking of Selling Themselves"},{value:"looking_agent",label:"Still Looking for an Agent"},{value:"open_to_discuss",label:"Open to Discussing It"}]} selected={s.currentPropAgentStatus?[s.currentPropAgentStatus]:[]} onToggle={v=>update({currentPropAgentStatus:s.currentPropAgentStatus===v?null:v})} single/>
                <Chips label="How Motivated Are They to Sell?" options={[{value:"very_motivated",label:"Very Motivated — Need to Sell Fast"},{value:"moderate",label:"Moderate — Taking Their Time"},{value:"low",label:"Low — Only If Price Is Right"},{value:"nervous",label:"Nervous About Timing Both"}]} selected={s.currentPropMotivation||[]} onToggle={v=>update({currentPropMotivation:tog(s.currentPropMotivation||[],v)})} single/>
                <Chips label="Main Concern About Selling First" options={[{value:"right_price",label:"Getting the Right Price"},{value:"timing_both",label:"Timing Both Transactions"},{value:"left_without_home",label:"Fear of Being Left Without a Home"},{value:"no_new_home",label:"Not Finding Right New Home First"},{value:"too_much_hassle",label:"Too Much Hassle and Stress"},{value:"financial_bridge",label:"Financial Bridge Between Sales"}]} selected={s.currentPropConcern||[]} onToggle={v=>update({currentPropConcern:tog(s.currentPropConcern||[],v)})}/>
                <div style={{marginTop:"8px"}}><label style={lbl}>About This Buyer</label><textarea placeholder="e.g. Active buyer, pre-approved, has been looking 3 months, very motivated..." rows={2} style={{...inp,resize:"vertical"}} value={s.currentPropBuyerContext||""} onChange={e=>update({currentPropBuyerContext:e.target.value})}/></div>
              </div>
            )}

            {s.objection==="bad_timing"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <Chips label="Why Is the Timing Bad?" options={[{value:"financial_not_ready",label:"Financial Situation Not Ready"},{value:"job_uncertainty",label:"Job Uncertainty"},{value:"family_changing",label:"Family Situation Changing"},{value:"need_sell_first",label:"Need to Sell Current Home First"},{value:"waiting_market",label:"Waiting for Better Market"},{value:"too_much_going_on",label:"Too Much Going On Personally"},{value:"possible_relocation",label:"Possible Relocation"},{value:"life_transition",label:"Life Transition — Divorce / Marriage / Baby"},{value:"kids_school",label:"Kids Finishing School"},{value:"waiting_mortgage",label:"Waiting for Mortgage Approval"},{value:"general_fear",label:"General Fear and Anxiety"}]} selected={s.badTimingReasons||[]} onToggle={v=>update({badTimingReasons:tog(s.badTimingReasons||[],v)})}/>
                <Chips label="How Much Time Are They Thinking?" options={[{value:"1month",label:"1 Month"},{value:"3months",label:"3 Months"},{value:"6months",label:"6 Months"},{value:"1year",label:"1 Year+"},{value:"not_sure",label:"Not Sure Yet"}]} selected={s.badTimingHowLong?[s.badTimingHowLong]:[]} onToggle={v=>update({badTimingHowLong:s.badTimingHowLong===v?null:v})} single/>
                <div style={{marginTop:"8px"}}><label style={lbl}>Any Other Reason</label><input type="text" placeholder="e.g. They just started a new business..." style={inp} value={s.badTimingOther||""} onChange={e=>update({badTimingOther:e.target.value})}/></div>
              </div>
            )}

            {s.objection==="not_pre_approved"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <div style={{marginBottom:"12px"}}><label style={lbl}>Reason Why Not Pre-Approved Yet</label><textarea placeholder="e.g. Self-employed, not sure they qualify, haven't prioritised it yet..." rows={2} style={{...inp,resize:"vertical"}} value={s.notApprovedReason||""} onChange={e=>update({notApprovedReason:e.target.value})}/></div>
                <Chips label="Have They Spoken to a Lender?" options={[{value:"yes",label:"Yes"},{value:"no",label:"Not yet"},{value:"in_progress",label:"In Progress"}]} selected={s.spokeToLender?[s.spokeToLender]:[]} onToggle={v=>update({spokeToLender:s.spokeToLender===v?null:v})} single/>
                <Chips label="Main Concern About Getting Approved" options={[{value:"not_enough_income",label:"Not Enough Income"},{value:"self_employed",label:"Self-Employed Complexity"},{value:"credit_score",label:"Credit Score Concerns"},{value:"too_much_debt",label:"Too Much Existing Debt"},{value:"not_enough_deposit",label:"Not Enough Deposit Saved"},{value:"visa_status",label:"Foreign National / Visa Status"},{value:"no_time",label:"Haven't Had Time to Sort It"}]} selected={s.approvalConcerns||[]} onToggle={v=>update({approvalConcerns:tog(s.approvalConcerns||[],v)})}/>
              </div>
            )}

            {s.objection==="need_more_time"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <Chips label="Why Do They Need More Time?" options={[{value:"saving_deposit",label:"Still Saving for Deposit"},{value:"job_situation",label:"Waiting for Job Situation to Settle"},{value:"family_flux",label:"Family Situation in Flux"},{value:"need_sell_first",label:"Need to Sell First"},{value:"too_much_going_on",label:"Too Much Going On"},{value:"not_emotionally_ready",label:"Not Emotionally Ready"},{value:"waiting_market",label:"Waiting for Better Market"},{value:"kids_school",label:"Kids Finishing School First"}]} selected={s.needMoreTimeReasons||[]} onToggle={v=>update({needMoreTimeReasons:tog(s.needMoreTimeReasons||[],v)})}/>
                <Chips label="How Much Time Are They Thinking?" options={[{value:"1month",label:"1 Month"},{value:"3months",label:"3 Months"},{value:"6months",label:"6 Months"},{value:"1year",label:"1 Year+"},{value:"not_sure",label:"Not Sure"}]} selected={s.needMoreTimeHowLong?[s.needMoreTimeHowLong]:[]} onToggle={v=>update({needMoreTimeHowLong:s.needMoreTimeHowLong===v?null:v})} single/>
                <div style={{marginTop:"8px"}}><label style={lbl}>Any Other Reason They Need More Time</label><input type="text" placeholder="e.g. Waiting for a bonus payout..." style={inp} value={s.needMoreTimeOther||""} onChange={e=>update({needMoreTimeOther:e.target.value})}/></div>
              </div>
            )}

            {s.objection==="scared_commitment"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <Chips label="What Specifically Scares Them?" options={[{value:"fear_overpaying",label:"Fear of Overpaying"},{value:"prices_drop",label:"Worried Prices Will Drop After Buying"},{value:"mortgage_overwhelming",label:"Long-Term Mortgage Feels Overwhelming"},{value:"hidden_costs",label:"Scared of Hidden Costs and Repairs"},{value:"not_right_property",label:"Not 100% Sure This Is the Right Property"},{value:"life_uncertain",label:"Life Situation Feels Uncertain"},{value:"never_bought",label:"Never Bought Before — Fear of the Unknown"},{value:"locked_in",label:"Afraid of Being Locked In"}]} selected={s.scaredReasons||[]} onToggle={v=>update({scaredReasons:tog(s.scaredReasons||[],v)})}/>
                <div style={{marginTop:"8px"}}><label style={lbl}>Any Other Reason They Are Scared</label><input type="text" placeholder="e.g. They went through a difficult divorce and are cautious..." style={inp} value={s.scaredOther||""} onChange={e=>update({scaredOther:e.target.value})}/></div>
              </div>
            )}

            {s.objection==="location"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <Chips label="What Is the Concern About the Location?" options={[{value:"schools",label:"Schools Not Good Enough"},{value:"far_work",label:"Too Far from Work"},{value:"poor_transport",label:"Poor Transport Links"},{value:"no_amenities",label:"Not Enough Shops / Amenities"},{value:"neighbourhood_vibe",label:"Neighbourhood Vibe Not Right"},{value:"growth_potential",label:"Worried About Area Growth"},{value:"too_noisy",label:"Too Noisy or Busy"},{value:"no_green_space",label:"Not Enough Green Space"},{value:"safety",label:"Safety Concerns"},{value:"too_much_development",label:"Too Much Development Nearby"},{value:"wrong_demographic",label:"Wrong Demographic Feel"}]} selected={s.locationConcerns||[]} onToggle={v=>update({locationConcerns:tog(s.locationConcerns||[],v)})}/>
                <div style={{marginTop:"8px"}}><label style={lbl}>Any Other Reason About the Location</label><input type="text" placeholder="e.g. They want to be closer to her parents..." style={inp} value={s.locationOther||""} onChange={e=>update({locationOther:e.target.value})}/></div>
              </div>
            )}

            {s.objection==="doesnt_like_pressure"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <label style={lbl}>What Happened Exactly?</label>
                <textarea placeholder="e.g. She said she felt rushed on the last call and asked me to give her space..." rows={3} style={{...inp,resize:"vertical",marginTop:"6px"}} value={s.pressuredWhatHappened||""} onChange={e=>update({pressuredWhatHappened:e.target.value})}/>
              </div>
            )}

            {s.objection==="already_have_agent"&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <Chips label="Are They Happy with Their Current Agent?" options={[{value:"very_happy",label:"Very Happy"},{value:"somewhat_happy",label:"Somewhat Happy"},{value:"not_really",label:"Not Really"},{value:"not_happy",label:"Not Happy at All"},{value:"not_sure",label:"Not Sure Yet"}]} selected={s.agentSatisfaction?[s.agentSatisfaction]:[]} onToggle={v=>update({agentSatisfaction:s.agentSatisfaction===v?null:v})} single/>
                <div style={{marginTop:"8px"}}>
                  <label style={lbl}>Any Reason They Might Consider Switching?</label>
                  <textarea placeholder="e.g. They mentioned the agent hasn't been responsive, no offers after 60 days..." rows={3} style={{...inp,resize:"vertical",marginTop:"6px"}} value={s.agentSwitchReason||""} onChange={e=>update({agentSwitchReason:e.target.value})}/>
                </div>
              </div>
            )}

            {s.objection!=="need_to_sell_first"&&<BuyerProfileBox s={s} update={update} tog={tog}/>}
          </div>
        )}

        {isObjection&&isSeller()&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>🛡️ Handle Objection</h2>
            <Chips label="Objection They Raised" options={[
              {value:"price_too_low",label:"Price Too Low"},
              {value:"not_right_time",label:"Not the Right Time"},
              {value:"already_have_agent",label:"Already Have an Agent"},
              {value:"need_more_time",label:"Need More Time"},
              {value:"market_too_slow",label:"Market Too Slow"},
              {value:"want_fsbo",label:"Want to Try FSBO"},
              {value:"not_ready",label:"Not Ready to Sell"},
              {value:"thinks_worth_more",label:"Think It's Worth More"},
              {value:"bad_experience",label:"Bad Past Experience"},
              {value:"no_rush",label:"No Rush to Sell"},
              {value:"renovating_first",label:"Renovating First"},
              {value:"waiting_market",label:"Waiting for Better Market"},
              {value:"family_decision",label:"Family Decision"},
              {value:"emotional_attachment",label:"Emotional Attachment"},
            ]} selected={s.objection?[s.objection]:[]} onToggle={v=>update({objection:s.objection===v?"":v})} single/>
            <div style={{marginTop:"12px",marginBottom:"16px"}}>
              <label style={lbl}>What Did They Say?</label>
              <p style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",margin:"4px 0 6px",lineHeight:"1.5"}}>The more specific you are here, the more personal and powerful the AI response.</p>
              <textarea placeholder="e.g. 'We've lived here 15 years. It's just really hard to imagine leaving it. I don't think now is the right time.'" rows={3} style={{...inp,resize:"vertical",marginTop:"6px"}} value={s.objectionText||""} onChange={e=>update({objectionText:e.target.value})}/>
            </div>
            <div style={{marginBottom:"16px"}}>
              <label style={lbl}>What Was the Full Situation?</label>
              <p style={{fontSize:"11px",color:"rgba(255,255,255,0.4)",margin:"4px 0 6px",lineHeight:"1.5"}}>Include what led to this moment, what conversations you've had, anything that gives context.</p>
              <textarea placeholder="e.g. We've had 3 conversations over 2 months. They were very interested initially but keep delaying. Wife wants to sell, husband is hesitant." rows={4} style={{...inp,resize:"vertical"}} value={s.objectionSituation||""} onChange={e=>update({objectionSituation:e.target.value})}/>
            </div>
            {s.objection==="price_too_low"&&(
              <div style={{background:"rgba(42,184,212,0.04)",border:"1px solid rgba(42,184,212,0.2)",borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"#2AB8D4",marginBottom:"10px"}}>📊 Market Comparable</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  <div><label style={lbl}>Comparable Address</label><input type="text" placeholder="14 Oak St" style={inp} value={s.compAddress||""} onChange={e=>update({compAddress:e.target.value})}/></div>
                  <div><label style={lbl}>Sold Price ($)</label><input type="text" placeholder="485,000" style={inp} value={s.compPrice||""} onChange={e=>update({compPrice:e.target.value})}/></div>
                  <div><label style={lbl}>Days on Market</label><input type="text" placeholder="12" style={inp} value={s.compDaysOnMarket||""} onChange={e=>update({compDaysOnMarket:e.target.value})}/></div>
                  <div><label style={lbl}>Above / Below Asking</label><input type="text" placeholder="$10K above" style={inp} value={s.compAboveBelow||""} onChange={e=>update({compAboveBelow:e.target.value})}/></div>
                </div>
              </div>
            )}
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFeatures={false}/>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Key Features of Their Property</label><input type="text" placeholder="e.g. Pool, ocean views, renovated kitchen, 3-car garage" style={inp} value={s.propKeyFeatures||""} onChange={e=>update({propKeyFeatures:e.target.value})}/></div>
            <SellerProfileBox s={s} update={update} tog={tog}/>
          </div>
        )}

        {s.contactReason==="anniversary"&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:"#fff"}}>🎉 Anniversary Details</h2>
            <label style={lbl}>Years Since Purchase</label>
            <input type="number" placeholder="1" style={inp} value={s.anniversaryYears||""} onChange={e=>update({anniversaryYears:e.target.value})}/>
          </div>
        )}

        {isSoldNearby&&(
          <div style={{...card,background:"rgba(42,184,212,0.03)",border:"1px solid rgba(42,184,212,0.2)"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏘️ Property Sold Nearby</h2>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Address of Sold Property</label><input type="text" placeholder="14 Maple Street, Austin TX" style={inp} value={s.soldAddress||""} onChange={e=>update({soldAddress:e.target.value})}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              {[["soldPrice","Sold Price ($)","485,000"],["soldBeds","Beds","3"],["soldBaths","Baths","2"],["soldType","Type","Condo"],["soldDaysOnMarket","Days on Market","12"],["soldDate","Sale Date","March 2025"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={s[k]||""} onChange={e=>update({[k]:e.target.value})}/></div>))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
              {[["soldAboveBelow","Above/Below Asking","$15K above"],["soldPricePerSqft","Price/Sq Ft","$285"],["soldCondition","Condition","Good"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={s[k]||""} onChange={e=>update({[k]:e.target.value})}/></div>))}
            </div>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Key Features</label><input type="text" placeholder="e.g. Private pool, ocean views, renovated kitchen..." style={inp} value={s.soldKeyFeatures||""} onChange={e=>update({soldKeyFeatures:e.target.value})}/></div>
          </div>
        )}

        {isPriceDiscussion&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>💬 Price Reduction Discussion</h2>
            <div style={{marginBottom:"12px"}}><label style={lbl}>Days on Market</label><input type="number" placeholder="45" style={inp} value={s.daysOnMarket||""} onChange={e=>update({daysOnMarket:e.target.value})}/></div>
            <Chips label="Why Consider a Reduction?" options={["No offers received","Similar homes sold lower","Market has shifted","Showings but no offers","Overpriced vs market","Too much competition","Buyer feedback on price","Motivated to sell faster"]} selected={s.priceReasons||[]} onToggle={v=>update({priceReasons:tog(s.priceReasons||[],v)})}/>
            <Chips label="Seller Urgency" options={[{value:"30days",label:"Within 30 Days"},{value:"60days",label:"Within 60 Days"},{value:"90days",label:"Within 90 Days"},{value:"flexible",label:"Flexible"},{value:"bought_new",label:"Already Bought New Home"},{value:"relocating",label:"Relocating"},{value:"divorce",label:"Divorce"},{value:"financial",label:"Financial Pressure"}]} selected={s.sellerUrgency||[]} onToggle={v=>update({sellerUrgency:tog(s.sellerUrgency||[],v)})}/>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFeatures={true}/>
          </div>
        )}

        {isExpiredListing&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>📋 Expired Listing</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div><label style={lbl}>Original Asking Price ($)</label><input type="text" placeholder="680,000" style={inp} value={s.expOrigPrice||""} onChange={e=>update({expOrigPrice:e.target.value})}/></div>
              <div><label style={lbl}>Days Listed</label><input type="number" placeholder="90" style={inp} value={s.expDays||""} onChange={e=>update({expDays:e.target.value})}/></div>
            </div>
            <Chips label="Why Did It Not Sell?" options={["Overpriced","Poor online presence","No professional photography","Weak marketing","No video / virtual tour","Bad timing","Wrong target audience","Needs repairs / staging","Limited MLS exposure","No social media","Poor description","No open houses","Agent underperformed","Market shifted","Pricing not competitive"]} selected={s.expiredReasons||[]} onToggle={v=>update({expiredReasons:tog(s.expiredReasons||[],v)})}/>
            <div style={{marginBottom:"12px",marginTop:"8px"}}>
              <label style={lbl}>Any other reason not listed above?</label>
              <input type="text" placeholder="e.g. Agent did not respond to offers quickly, wrong target market..." style={inp} value={s.expiredReasonsOther||""} onChange={e=>update({expiredReasonsOther:e.target.value})}/>
            </div>
            <div style={{paddingTop:"14px",borderTop:"1px solid #252530",marginTop:"8px"}}>
              <p style={{fontSize:"12px",fontWeight:"700",color:"#2AB8D4",marginBottom:"10px"}}>🔄 Re-List Strategy</p>
              <Chips label="Your New Approach" options={[{value:"new_price",label:"New Pricing"},{value:"pro_photos",label:"Professional Photos"},{value:"video",label:"Video"},{value:"virtual_tour",label:"Virtual Tour"},{value:"staging",label:"Staging"},{value:"social_media",label:"Social Media"},{value:"digital_ads",label:"Digital Ads"},{value:"open_house",label:"Open Houses"},{value:"buyer_network",label:"Buyer Outreach"},{value:"price_compete",label:"Price to Create Competition"},{value:"drone",label:"Drone Photography"},{value:"off_market_first",label:"Off-Market Pre-Launch"}]} selected={s.relistStrategy||[]} onToggle={v=>update({relistStrategy:tog(s.relistStrategy||[],v)})}/>
              <div style={{marginTop:"8px"}}><label style={lbl}>What Will You Do Differently?</label><textarea placeholder="e.g. Relaunch with professional photography, targeted ads, price to generate multiple offers..." rows={3} style={{...inp,resize:"vertical"}} value={s.relistDifferent||""} onChange={e=>update({relistDifferent:e.target.value})}/></div>
            </div>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFeatures={true}/>
          </div>
        )}

        {isPreListing&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>✅ Pre-Listing Preparation</h2>
            <Chips label="Recommended Preparations" options={["Professional Photography","Video Tour","Home Staging","Minor Repairs","Deep Clean","Declutter & Depersonalise","New Lighting","Interior Paint — Neutral","Curb Appeal","Kitchen Update","Bathroom Update","Value-Add Improvements","Floor Plan","Virtual Tour","Pre-Sale Inspection","Smart Lock Upgrade","Electrical Check","Window Cleaning","Driveway Pressure Wash","Landscaping","Carpet & Upholstery Cleaning","Roof Inspection","Plumbing Check","Storage Solutions","New Front Door","Mailbox Update","Pest Inspection","Mould Check","Energy Efficiency Report","Garage Clearance","Fix Exterior Cracks"]} selected={s.preListingItems||[]} onToggle={v=>update({preListingItems:tog(s.preListingItems||[],v)})}/>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFeatures={true}/>
          </div>
        )}

        {isTimelineCheckin&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>📅 Timeline Check-In</h2>
            <div style={{marginBottom:"12px"}}><label style={lbl}>When Did They Originally Want to Sell?</label><input type="text" placeholder="Spring 2025, Q1..." style={inp} value={s.originalTimeline||""} onChange={e=>update({originalTimeline:e.target.value})}/></div>
            <div style={{marginBottom:"12px"}}><label style={lbl}>What Is Their New Timeline?</label><input type="text" placeholder="Thinking end of year..." style={inp} value={s.newTimeline||""} onChange={e=>update({newTimeline:e.target.value})}/></div>
            <Chips label="What May Have Changed?" options={[{value:"life_circumstances",label:"Life Circumstances"},{value:"market_shift",label:"Market Shifted"},{value:"found_property",label:"Found New Property"},{value:"family_situation",label:"Family Situation"},{value:"work_relocation",label:"Work Relocation"},{value:"financial_change",label:"Financial Change"},{value:"partner_disagreement",label:"Partner Disagreement"},{value:"mortgage_change",label:"Mortgage Change"},{value:"renovation_delay",label:"Renovation Delay"},{value:"still_deciding",label:"Still Deciding"}]} selected={s.timelineChanges||[]} onToggle={v=>update({timelineChanges:tog(s.timelineChanges||[],v)})}/>
            <Chips label="Where Are They Emotionally?" options={[{value:"motivated",label:"Motivated"},{value:"hesitant",label:"Hesitant"},{value:"frustrated",label:"Frustrated"},{value:"excited",label:"Excited"},{value:"scared",label:"Nervous"},{value:"patient",label:"Patient"},{value:"urgent",label:"More Urgent Now"}]} selected={s.timelineEmotion||[]} onToggle={v=>update({timelineEmotion:tog(s.timelineEmotion||[],v)})}/>
            <div style={{marginTop:"8px"}}><label style={lbl}>Additional Context</label><textarea placeholder="e.g. Originally wanted to sell by April but renovation took longer..." rows={3} style={{...inp,resize:"vertical"}} value={s.timelineContext||""} onChange={e=>update({timelineContext:e.target.value})}/></div>
          </div>
        )}

        {isBuyerMatch&&isSeller()&&(
          <>
            <div style={{...card,background:"rgba(42,184,212,0.03)",border:"1px solid rgba(42,184,212,0.2)"}}>
              <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🔍 What Are They Looking For?</h2>
              <div style={{marginBottom:"12px"}}><label style={lbl}>Buyer's Budget</label><input type="text" placeholder="$500K-$650K" style={inp} value={s.buyerBudget||""} onChange={e=>update({buyerBudget:e.target.value})}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"12px"}}>
                <div><label style={lbl}>Beds</label><input type="text" placeholder="3+" style={inp} value={s.buyerMatchBeds||""} onChange={e=>update({buyerMatchBeds:e.target.value})}/></div>
                <div><label style={lbl}>Baths</label><input type="text" placeholder="2+" style={inp} value={s.buyerMatchBaths||""} onChange={e=>update({buyerMatchBaths:e.target.value})}/></div>
                <div><label style={lbl}>Min Sq Ft</label><input type="text" placeholder="1,500" style={inp} value={s.buyerMatchSqft||""} onChange={e=>update({buyerMatchSqft:e.target.value})}/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
                <div><label style={lbl}>Property Type</label><input type="text" placeholder="House, Condo, Villa..." style={inp} value={s.buyerMatchType||""} onChange={e=>update({buyerMatchType:e.target.value})}/></div>
                <div><label style={lbl}>Condition</label><input type="text" placeholder="Move-in ready, renovated..." style={inp} value={s.buyerMatchCondition||""} onChange={e=>update({buyerMatchCondition:e.target.value})}/></div>
              </div>
              <Chips label="Interior Features They Want" options={INTERIOR_EN} selected={s.buyerWantsInterior||[]} onToggle={v=>update({buyerWantsInterior:tog(s.buyerWantsInterior||[],v)})}/>
              <Chips label="Outdoor Features They Want" options={OUTDOOR_EN} selected={s.buyerWantsOutdoor||[]} onToggle={v=>update({buyerWantsOutdoor:tog(s.buyerWantsOutdoor||[],v)})}/>
              <Chips label="Building Amenities They Want" options={BUILDING_EN} selected={s.buyerWantsBuilding||[]} onToggle={v=>update({buyerWantsBuilding:tog(s.buyerWantsBuilding||[],v)})}/>
            </div>
            <div style={card}>
              <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>👤 Buyer Profile</h2>
              <div style={{marginBottom:"12px"}}><label style={lbl}>Buyer Description</label><input type="text" placeholder="Young professional couple, relocating from NYC" style={inp} value={s.buyerType||""} onChange={e=>update({buyerType:e.target.value})}/></div>
              <Chips label="Buyer Profile" options={[
                {value:"cash_buyer",label:"Cash Buyer"},{value:"pre_approved",label:"Pre-Approved"},
                {value:"mortgage_in_principle",label:"Mortgage in Principle"},{value:"first_time",label:"First-Time Buyer"},
                {value:"chain_free",label:"Chain-Free"},{value:"relocating",label:"Relocating"},
                {value:"investor",label:"Investor"},{value:"foreign_national",label:"Foreign National"},
                {value:"self_employed",label:"Self-Employed"},{value:"high_net_worth",label:"High Net Worth"},
                {value:"recently_divorced",label:"Recently Divorced"},{value:"inheritance",label:"Using Inheritance"},
                {value:"corporate_relocation",label:"Corporate Relocation"},{value:"buy_to_let",label:"Buy-to-Let"},
              ]} selected={s.buyerProfile||[]} onToggle={v=>update({buyerProfile:tog(s.buyerProfile||[],v)})}/>
            </div>
          </>
        )}

        {isFSBO&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏷️ FSBO Outreach</h2>
            <div style={{marginBottom:"14px"}}><label style={lbl}>Why Should They Work With You?</label><textarea placeholder="e.g. I sold 3 homes on their street this year, average 8% above asking..." rows={3} style={{...inp,resize:"vertical"}} value={s.fsboReasons||""} onChange={e=>update({fsboReasons:e.target.value})}/></div>
            <Chips label="Key Advantages" options={["Access to More Buyers","Higher Sale Price (avg 6-18% more)","Professional Negotiation","Legal & Contract Protection","MLS & Portal Exposure","Professional Photography","Time Saved","Pre-Qualified Buyers","Market Expertise","Faster Sale","Contract Management","Zero Upfront Cost","Social Media Marketing","Video & Virtual Tour","Pricing Strategy","Track Record in This Area","Privacy During Showings","International Buyer Access"]} selected={s.fsboAdvantages||[]} onToggle={v=>update({fsboAdvantages:tog(s.fsboAdvantages||[],v)})}/>
            <PropCard s={s} update={update} tog={tog} title="🏠 Their Property" showFeatures={true}/>
          </div>
        )}

        {isCMA&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>🏡 Comparative Market Analysis (CMA)</h2>
            <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color:"#2AB8D4",marginBottom:"10px",marginTop:"4px"}}>🏠 Subject Property</div>
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
            <div style={{marginBottom:"10px"}}><label style={lbl}>Recent Renovations</label><input type="text" placeholder="New kitchen 2022, roof 2020" style={inp} value={s.cmaSubject.recentRenovations||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,recentRenovations:e.target.value}})}/></div>
            <div style={{marginBottom:"16px"}}><label style={lbl}>Key Features</label><input type="text" placeholder="Pool, garden, double garage" style={inp} value={s.cmaSubject.features||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,features:e.target.value}})}/></div>
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
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  {[["pricePerSqft","Price/Sq Ft","$246"],["aboveBelow","Above/Below Asking","$5K above"]].map(([k,l,p])=>(<div key={k}><label style={lbl}>{l}</label><input type="text" placeholder={p} style={inp} value={comp[k]||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],[k]:e.target.value};update({cmaComps:c})}}/></div>))}
                </div>
                <div><label style={lbl}>Key Differences</label><input type="text" placeholder="No pool, original kitchen" style={inp} value={comp.notes||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],notes:e.target.value};update({cmaComps:c})}}/></div>
              </div>
            ))}
          </div>
        )}

        {showProp&&!isPriceDiscussion&&!isExpiredListing&&!isPreListing&&!isFSBO&&!isOfferStrategy&&!isViewingFollowUp&&!isPriceDrop&&(
          <PropCard s={s} update={update} tog={tog}
            title={isBuyer()?"🏠 Property You're Offering":isSeller()?"🏠 Their Property":"🏠 Property Details"}
            showFeatures={showFeatures}
          />
        )}

        {showWishlist&&(
          <div style={card}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:"#fff"}}>💭 Her Wishlist — what she really wants in a home</h2>
            <p style={{fontSize:"12px",color:"#2AB8D4",fontWeight:"600",marginBottom:"12px",lineHeight:"1.5"}}>Important: fill this in — it helps us craft a powerful message that lands with the client. We only mention what this property actually has.</p>
            <textarea placeholder="e.g. 4 beds, gourmet kitchen, pool, near good schools, quiet street…" rows={3} style={{...inp,resize:"vertical"}} value={s.buyerWishlist||""} onChange={e=>update({buyerWishlist:e.target.value})}/>
          </div>
        )}

        {isBuyer()&&!isObjection&&!isViewingFollowUp&&!isReconnect&&!["first_contact","offer_strategy","open_house","financing_update"].includes(s.contactReason)&&(
          <BuyerProfileBox s={s} update={update} tog={tog} hideLooking={showWishlist}/>
        )}

        {showSellerProfile&&<SellerProfileBox s={s} update={update} tog={tog}/>}

        <div style={card}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:"#fff"}}>🏷️ Your Details</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
            <div><label style={lbl}>Your Name</label><input type="text" placeholder="James Rivera" style={inp} value={s.agentName||""} onChange={e=>update({agentName:e.target.value})}/></div>
            <div><label style={lbl}>Your Phone</label><input type="text" placeholder="+1 305 555 0199" style={inp} value={s.agentPhone||""} onChange={e=>update({agentPhone:e.target.value})}/></div>
          </div>
          <div><label style={lbl}>Agency / Company Name</label><input type="text" placeholder="Rivera Real Estate Group" style={inp} value={s.agencyName||""} onChange={e=>update({agencyName:e.target.value})}/></div>
        </div>

        {s.error&&<div style={{background:"#1a0808",border:"1px solid #3a1010",borderRadius:"8px",padding:"12px 16px",color:"#f87171",fontSize:"13px",marginBottom:"16px"}}>{s.error}</div>}
        {s.loading&&(
          <div style={{background:"#111",border:"1px solid #222",borderRadius:"10px",padding:"18px 22px",marginBottom:"16px",textAlign:"center"}}>
            <p style={{color:"#2AB8D4",fontSize:"14px",margin:"0",fontWeight:"600"}}>{s.loadingMsg}</p>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",margin:"6px 0 0"}}>Generating. Please wait...</p>
          </div>
        )}
        <button onClick={()=>{if(canGenerate()&&!s.loading)generate()}}
          style={{background:canGenerate()&&!s.loading?"#2AB8D4":"#1a1a1a",color:canGenerate()&&!s.loading?"#060608":"rgba(255,255,255,0.5)",border:"none",borderRadius:"8px",padding:"13px 24px",fontSize:"15px",fontWeight:"700",cursor:canGenerate()&&!s.loading?"pointer":"not-allowed",fontFamily:"inherit",width:"100%"}}>
          {s.loading?"Generating...":"✦ Generate Full Outreach Package"}
        </button>
        {!canGenerate()&&<p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",marginTop:"8px",textAlign:"center"}}>Fill in client name, type, and contact reason to continue.</p>}
      </div>
    </div>
  )
}
