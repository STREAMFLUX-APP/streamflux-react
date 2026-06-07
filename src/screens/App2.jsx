import { useState } from 'react'
import { G, GL, SF, apiClaude, inputStyle, cardStyle, labelStyle, btnStyle } from '../globals.js'
import { CopyCard } from '../components/shared/CopyCard.jsx'
import { Chips } from '../components/shared/Chips.jsx'
import { Field, TextArea } from '../components/shared/Field.jsx'

// ── FULL FEATURE LISTS (same as App1) ────────────────────
const INTERIOR_EN = ["Open Plan Living","High Ceilings","Double Height Ceilings","Exposed Beams","Hardwood Floors","Marble Floors","Porcelain Floors","Polished Concrete Floors","Radiant Floor Heating","Modern Kitchen","Chef's Kitchen","Gourmet Kitchen","Granite Countertops","Quartz Countertops","Marble Countertops","Kitchen Island","Butler's Pantry","Scullery / Second Kitchen","Stainless Steel Appliances","High-End Appliances","Wine Refrigerator","Built-in Coffee Machine","Master Suite","Suite with Terrace","Walk-in Wardrobe","His & Hers Wardrobes","En-suite Bathrooms","Double Vanity","Freestanding Soaking Tub","Jetted / Whirlpool Tub","Rainfall Shower","Frameless Glass Shower","Sauna","Steam Room","Home Office","Media Room / Cinema","Game Room","Music Room","Library / Study","Art Studio","Indoor Gym","Flex / Bonus Room","Fireplace","Double-Sided Fireplace","Wet Bar","Climate-Controlled Wine Cellar","Tasting Room","Laundry Room","Laundry Room with Sink","Finished Basement","Finished Attic / Loft","Smart Home System","Multi-Zone Audio","Smart Lighting","Motorized Blinds / Shades","Smart Thermostat","Video Intercom","App-Controlled Home","Cat6 / Fibre Wiring","Security Alarm System","Surveillance Cameras","Fingerprint / Keypad Entry","Built-in Safe","Solar Panels","Solar Battery Storage","Whole-Home Generator","Premium Insulation","Triple-Glazed Windows","Underfloor Heating","Multi-Zone A/C","Heat Recovery Ventilation","Wheelchair Accessible","Private Elevator","Access Ramp","Adapted Bathroom","Wide Doorways"]
const OUTDOOR_EN = ["Private Pool","Heated Pool","Infinity Pool","Overflow Pool","Pool with Waterfall","Natural / Bio Pool","Hot Tub / Outdoor Spa","Outdoor Shower","Rooftop Terrace","Terrace with Views","Covered Patio / Pergola","Rear Patio","Front Porch","Private Garden","Landscaped Yard","Zen Garden","Tropical Garden","Winter Garden / Greenhouse","Full Outdoor Kitchen","Built-in BBQ / Grill","Wood-Fired Pizza Oven","Fire Pit / Outdoor Fireplace","Outdoor Bar","Outdoor Dining Area","Private Boat Dock","Marina Slip","Boat Launch Ramp","Boat Storage","Private Beach Access","Private Ocean Access","Private Lake Access","Tennis Court","Padel Court","Basketball Court","Putting Green","Boules / Petanque Court","Playground / Play Area","Guest House / Casita","Pool House","Garden Studio / Office","Garage (1 Car)","Garage (2 Car)","Garage (3+ Car)","Boat / RV Garage","Workshop / Storage","EV Charging Station","Gated Entry","Automatic Gate","Outdoor Security Cameras","Landscape Lighting","Solar Lighting","Paved Driveway","Green Roof","Vegetable Garden / Orchard","Private Well","Automated Irrigation System","Running / Jogging Track"]
const BUILDING_EN = ["24/7 Concierge Service","Digital Concierge","Doorman","Overnight Doorman","Valet Parking","24/7 Security","Private Security Guard","Access Control System","Key Fob / App Access","Rooftop Pool","Indoor Pool","Outdoor Community Pool","Jacuzzi / Hot Tub Area","Sundeck / Solarium","Private Beach Club","Full Fitness Center","Yoga Studio","Pilates Studio","Boxing Gym","Squash Court","Full-Service Spa","Shared Sauna","Massage Room","Beauty Salon","Co-working Space","Meeting Rooms","Conference Center","Business Center","Community Library","Community Cinema","Party / Event Room","Social Lounge","Community Rooftop Terrace","BBQ Area","Children's Play Area","Dog Park","Pet-Friendly","Pet Care Services","Housekeeping Service","Laundry Service","Private Storage Unit","Bike Storage","Low HOA Fees","No HOA","Utilities Included","Maintenance Service Included","Covered Parking","Double Parking","Visitor Parking","EV Charging in Parking","LEED Certified","Energy Class A Building","BREEAM Certified","Community Solar Panels","Disability Access","High-Capacity Elevator","Smart Package Lockers","Bike Share / E-Bike Program"]

const INTERIOR_ES = ["Planta Abierta","Techos Altos","Doble Altura","Vigas Vistas","Suelos de Madera","Suelos de Mármol","Suelos de Porcelana","Suelos de Cemento Pulido","Suelos Radiantes","Cocina Moderna","Cocina de Chef","Cocina Gourmet","Encimera de Granito","Encimera de Cuarzo","Encimera de Mármol","Isla de Cocina","Despensa","Cocina Auxiliar","Electrodomésticos de Acero Inoxidable","Electrodomésticos de Alta Gama","Frigorífico de Vino","Cafetera Integrada","Suite Principal","Suite con Terraza","Vestidor","Vestidor Doble","Baños en Suite","Doble Lavabo","Bañera Exenta","Bañera de Hidromasaje","Ducha de Lluvia","Ducha a Ras de Suelo","Sauna","Baño de Vapor","Oficina en Casa","Sala de Cine","Sala de Juegos","Sala de Música","Biblioteca","Estudio Artístico","Sala de Fitness Interior","Sala Multiusos","Chimenea","Chimenea Doble","Bar Húmedo","Bodega Climatizada","Sala de Catas","Lavandería","Lavandería con Fregadero","Sótano Terminado","Ático Terminado","Casa Domótica","Sistema de Audio Multizona","Iluminación Inteligente","Persianas Motorizadas","Termostato Inteligente","Intercomunicador","Control por App","Cableado Cat6","Alarma de Seguridad","Cámaras de Vigilancia","Acceso por Huella","Caja Fuerte Integrada","Paneles Solares","Batería Solar","Generador","Aislamiento Premium","Ventanas de Triple Vidrio","Calefacción por Suelo Radiante","Aire Acondicionado por Zona","Recuperador de Calor","Accesibilidad para Silla de Ruedas","Ascensor Interior","Rampa de Acceso","Baño Adaptado"]
const OUTDOOR_ES = ["Piscina Privada","Piscina Climatizada","Piscina Infinita","Piscina Desbordante","Piscina con Cascada","Piscina Natural / Biológica","Jacuzzi / Spa Exterior","Ducha Exterior","Terraza en Azotea","Terraza con Vistas","Terraza Cubierta","Patio Trasero","Patio Delantero","Jardín Privado","Jardín Paisajístico","Jardín Zen","Jardín Tropical","Jardín de Invierno / Invernadero","Cocina Exterior Completa","Barbacoa Integrada","Horno de Leña","Hoguera / Chimenea Exterior","Barra de Bar Exterior","Comedor Exterior","Muelle Privado","Embarcadero","Rampa de Embarcaciones","Almacén para Botes","Acceso Privado a la Playa","Acceso Privado al Mar","Acceso Privado al Lago","Pista de Tenis","Pista de Pádel","Cancha de Baloncesto","Campo de Putting Golf","Pista de Petanca","Parque Infantil","Casa de Invitados","Casita de Piscina","Estudio Exterior","Garaje (1 Coche)","Garaje (2 Coches)","Garaje (3+ Coches)","Garaje para Barco / RV","Taller / Almacén","Cargador Eléctrico","Entrada con Verja","Verja Automática","Cámaras Exteriores","Iluminación Paisajística","Iluminación Solar","Camino de Entrada Pavimentado","Tejado Verde","Huerto / Jardín Ecológico","Pozo de Agua","Sistema de Riego Automatizado","Pista de Atletismo / Jogging"]
const BUILDING_ES = ["Servicio de Conserjería 24/7","Conserjería Digital","Portero","Portero Nocturno","Valet Parking","Seguridad 24/7","Vigilancia Privada","Control de Acceso","Acceso por Tarjeta / App","Piscina en Azotea","Piscina Cubierta","Piscina Exterior Comunitaria","Zona de Jacuzzi","Solarium","Playa Privada del Edificio","Gimnasio Completo","Sala de Yoga","Sala de Pilates","Sala de Boxeo","Pista de Squash","Spa Completo","Sauna Compartida","Sala de Masajes","Sala de Belleza","Coworking","Sala de Reuniones","Sala de Conferencias","Sala de Negocios","Biblioteca Comunitaria","Cine Comunitario","Sala de Fiestas","Salón Social","Terraza Comunitaria","Zona de Barbacoa Comunitaria","Área de Juegos Infantiles","Parque Canino","Admite Mascotas","Servicio de Cuidado de Mascotas","Servicio de Limpieza","Servicio de Lavandería","Almacenamiento Privado","Trastero","Cuota Comunidad Baja","Sin Cuota de Comunidad","Gastos Incluidos","Servicio de Mantenimiento Incluido","Parking Cubierto","Parking Doble","Parking para Visitantes","Cargadores Eléctricos en Parking","Certificación LEED","Edificio Eficiencia Energética A","Certificación BREEAM","Paneles Solares Comunitarios","Acceso para Discapacitados","Ascensor de Gran Capacidad","Servicio de Paquetería / Taquillas Inteligentes","Servicio de Bicicletas / Bicicletas Eléctricas"]

// ── CONTACT REASON ARRAYS ────────────────────────────────
const REASONS_BUYER_EN = [
  {value:"new_listing",label:"New Listing Match",desc:"Property matches their criteria"},
  {value:"price_drop",label:"Price Reduction",desc:"Property they liked dropped in price"},
  {value:"first_contact",label:"First Outreach",desc:"Never contacted before"},
  {value:"reconnect",label:"Reconnecting",desc:"Haven't spoken in a while"},
  {value:"open_house",label:"Open House Invite",desc:"Invite to view a property"},
  {value:"market_update",label:"Market Update",desc:"Relevant market news"},
  {value:"off_market",label:"Off-Market Deal",desc:"Exclusive property opportunity"},
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
  {value:"referral_request",label:"Referral Request",desc:"Ask after closing a deal"},
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

const BUYER_CRITERIA_EN = [
  {value:"u500",label:"Under $500K"},
  {value:"500_1m",label:"$500K – $1M"},
  {value:"1m_2m",label:"$1M – $2M"},
  {value:"2m_5m",label:"$2M – $5M"},
  {value:"5m_plus",label:"$5M+"},
  {value:"1bed",label:"1 Bed"},
  {value:"2bed",label:"2 Beds"},
  {value:"3bed",label:"3 Beds"},
  {value:"4bed",label:"4+ Beds"},
  {value:"house",label:"House"},
  {value:"apt",label:"Apartment"},
  {value:"condo",label:"Condo"},
  {value:"villa",label:"Villa"},
  {value:"townhouse",label:"Townhouse"},
  {value:"pool",label:"Pool"},
  {value:"garden",label:"Garden"},
  {value:"seaview",label:"Sea View"},
  {value:"investment",label:"Investment"},
  {value:"primary",label:"Primary Home"},
  {value:"schools",label:"Good Schools"},
  {value:"quiet",label:"Quiet Area"},
  {value:"citycenter",label:"City Center"},
  {value:"petfriendly",label:"Pet Friendly"},
  {value:"new_build",label:"New Build"},
  {value:"turnkey",label:"Turn-Key Ready"},
  {value:"fixer",label:"Fixer Upper"},
  {value:"parking",label:"Parking"},
  {value:"elevator",label:"Elevator"},
  {value:"waterfront",label:"Waterfront"},
  {value:"gated",label:"Gated Community"},
]

const FINANCING_OPTIONS_EN = [
  {value:"rates_dropped",label:"📉 Rates Dropped"},
  {value:"fed_cut",label:"🏦 Fed Rate Cut"},
  {value:"easier_qualify",label:"✅ Easier to Qualify"},
  {value:"new_products",label:"💡 New Loan Products"},
  {value:"low_down",label:"💰 Low Down Payment Options"},
  {value:"rates_rising",label:"📈 Rates Rising — Act Now"},
  {value:"investor_loans",label:"🏢 Investor Loan Options"},
  {value:"first_buyer",label:"🏠 First-Time Buyer Incentives"},
]

const OBJECTIONS_SELLER_EN = [
  {value:"price_too_low",label:"Price Too Low"},
  {value:"not_right_time",label:"Not the Right Time"},
  {value:"already_have_agent",label:"Already Have an Agent"},
  {value:"need_more_time",label:"Need More Time"},
  {value:"market_too_slow",label:"Market Too Slow"},
  {value:"want_fsbo",label:"Want to Try FSBO"},
  {value:"not_ready",label:"Not Ready to Sell"},
  {value:"thinks_worth_more",label:"Think It's Worth More"},
  {value:"bad_experience",label:"Bad Past Experience with Agents"},
  {value:"no_rush",label:"No Rush to Sell"},
  {value:"renovating_first",label:"Want to Renovate First"},
  {value:"waiting_market",label:"Waiting for Better Market"},
]

const OBJECTIONS_BUYER_EN = [
  {value:"too_expensive",label:"Too Expensive"},
  {value:"not_interested",label:"Not Interested"},
  {value:"happy_where_i_am",label:"Happy Where I Am"},
  {value:"already_have_agent",label:"Already Have an Agent"},
  {value:"bad_timing",label:"Bad Timing"},
  {value:"need_more_time",label:"Need More Time"},
  {value:"rates_too_high",label:"Rates Too High"},
  {value:"market_uncertain",label:"Market Too Uncertain"},
  {value:"waiting_prices_drop",label:"Waiting for Prices to Drop"},
  {value:"not_right_property",label:"Haven't Found the Right Property"},
  {value:"partner_not_convinced",label:"Partner Not Convinced"},
]

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
const initState = (lang) => ({
  language: lang||"English",
  clientName:"", clientType:"", contactReason:"",
  urgency:"", tone:"", objection:"",
  // property fields
  propAddress:"", propPrice:"", propOldPrice:"", propType:"",
  propBeds:"", propBaths:"", propSqft:"", propCondition:"",
  propHighlights:"",
  propInterior:[], propOutdoor:[], propBuilding:[],
  // buyer criteria
  buyerCriteria:[], buyerNeeds:"",
  // seller situation
  sellerSituation:[],
  // sold nearby
  soldAddress:"", soldPrice:"", soldBeds:"", soldBaths:"", soldType:"", soldDate:"",
  clientPropAddress:"", clientPropPrice:"", clientPropBeds:"", clientPropBaths:"",
  // market update
  marketLocation:"", marketDirection:[], marketInsight:"",
  // financing
  financingOptions:[], financingNews:"",
  // reconnect
  lookingFor:"",
  // first contact seller
  leadSource:null, knownAboutProperty:"",
  // price discussion
  daysOnMarket:"", priceReasons:[],
  // expired
  expOrigPrice:"", expDays:"", expiredReasons:[],
  // pre-listing
  preListingItems:[],
  // timeline
  originalTimeline:"",
  // buyer match
  buyerBudget:"", buyerType:"",
  // offer strategy
  offerBudget:"", offerStrategy:[],
  // fsbo
  fsboWhySellWithAgent:"", fsboReasons:[],
  // anniversary
  anniversaryYears:"",
  // CMA
  cmaSubject:{address:"",price:"",beds:"",baths:"",sqft:"",condition:"",features:""},
  cmaComps:[
    {address:"",salePrice:"",saleDate:"",beds:"",baths:"",sqft:"",condition:"",notes:""},
    {address:"",salePrice:"",saleDate:"",beds:"",baths:"",sqft:"",condition:"",notes:""},
    {address:"",salePrice:"",saleDate:"",beds:"",baths:"",sqft:"",condition:"",notes:""},
  ],
  // matcher
  matcherProps:[{address:"",price:"",type:"",highlights:""},{address:"",price:"",type:"",highlights:""},{address:"",price:"",type:"",highlights:""}],
  // agent
  agentName:"", agentPhone:"", agencyName:"",
  // personal
  customSituation:"",
  // regen
  regenContext:"", regenLoading:false,
  // state
  loading:false, loadingMsg:"", result:null, error:"", activeTab:"messages",
})

// ── PROP FEATURES CARD ───────────────────────────────────
function PropFeaturesCard({ s, update, tog, isSpa, title }) {
  const INT = isSpa ? INTERIOR_ES : INTERIOR_EN
  const OUT = isSpa ? OUTDOOR_ES : OUTDOOR_EN
  const BLD = isSpa ? BUILDING_ES : BUILDING_EN

  return (
    <div style={cardStyle}>
      <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>{title || (isSpa ? "🏠 Su Propiedad" : "🏠 Their Property")}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
        <div>
          <label style={labelStyle}>{isSpa?"Dirección":"Property Address"}</label>
          <input type="text" placeholder={isSpa?"Calle Mayor 12, Madrid":"42 Palm Drive, Miami FL"} style={inputStyle} value={s.propAddress||""} onChange={e=>update({propAddress:e.target.value})}/>
        </div>
        <div>
          <label style={labelStyle}>{isSpa?"Tipo de Propiedad":"Property Type"}</label>
          <input type="text" placeholder={isSpa?"Villa, Apartamento...":"Villa, Apartment, Condo..."} style={inputStyle} value={s.propType||""} onChange={e=>update({propType:e.target.value})}/>
        </div>
        <div>
          <label style={labelStyle}>{isSpa?"Precio ($)":"Asking Price ($)"}</label>
          <input type="text" placeholder="1,200,000" style={inputStyle} value={s.propPrice||""} onChange={e=>update({propPrice:e.target.value})}/>
        </div>
        <div>
          <label style={labelStyle}>{isSpa?"Estado":"Condition"}</label>
          <input type="text" placeholder={isSpa?"Buen estado, reformada":"Good condition, renovated"} style={inputStyle} value={s.propCondition||""} onChange={e=>update({propCondition:e.target.value})}/>
        </div>
        <div>
          <label style={labelStyle}>{isSpa?"Hab.":"Beds"}</label>
          <input type="text" placeholder="4" style={inputStyle} value={s.propBeds||""} onChange={e=>update({propBeds:e.target.value})}/>
        </div>
        <div>
          <label style={labelStyle}>{isSpa?"Baños":"Baths"}</label>
          <input type="text" placeholder="3" style={inputStyle} value={s.propBaths||""} onChange={e=>update({propBaths:e.target.value})}/>
        </div>
      </div>
      <div style={{marginBottom:"12px"}}>
        <label style={labelStyle}>{isSpa?"Superficie (m²/ft²)":"Size (sq ft)"}</label>
        <input type="text" placeholder="2,400" style={inputStyle} value={s.propSqft||""} onChange={e=>update({propSqft:e.target.value})}/>
      </div>
      <Chips label={isSpa?"Características Interiores":"Interior Features"} options={INT} selected={s.propInterior} onToggle={v=>update({propInterior:tog(s.propInterior,v)})}/>
      <Chips label={isSpa?"Características Exteriores":"Outdoor Features"} options={OUT} selected={s.propOutdoor} onToggle={v=>update({propOutdoor:tog(s.propOutdoor,v)})}/>
      <Chips label={isSpa?"Servicios del Edificio":"Building Amenities"} options={BLD} selected={s.propBuilding} onToggle={v=>update({propBuilding:tog(s.propBuilding,v)})}/>
      <div style={{marginTop:"4px"}}>
        <label style={labelStyle}>{isSpa?"Puntos Clave":"Key Highlights"}</label>
        <textarea placeholder={isSpa?"Las 2-3 cosas más impresionantes...":"Top 2-3 things that make this property stand out..."} rows={2} style={{...inputStyle,resize:"vertical"}} value={s.propHighlights||""} onChange={e=>update({propHighlights:e.target.value})}/>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────
export default function App2({ state: appState, setScreen }) {
  const [s, setS] = useState(initState(appState.lang))
  const update = (u) => setS(prev => ({...prev,...u}))
  const tog = (arr, val) => arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]

  const isSpa = s.language === "Spanish"
  const isBuyer = () => s.clientType.includes("buyer") || s.clientType==="investor"
  const isSeller = () => s.clientType.includes("seller")
  const canGenerate = () => s.clientName && s.clientType && s.contactReason

  // workflow flags
  const isNoPropertyReason = ["first_contact","reconnect","market_update","financing_update","re_engagement","referral_request","anniversary","neighbourhood_news","market_value_update"].includes(s.contactReason)
  const isSoldNearby = s.contactReason==="just_sold" || s.contactReason==="neighbour_sale"
  const isMarketUpdate = s.contactReason==="market_update"
  const isFinancingUpdate = s.contactReason==="financing_update"
  const isPriceDiscussion = s.contactReason==="price_discussion"
  const isExpiredListing = s.contactReason==="expired_listing"
  const isPreListing = s.contactReason==="prelisting_prep"
  const isTimelineCheckin = s.contactReason==="timeline_checkin"
  const isBuyerMatch = s.contactReason==="buyer_match"
  const isCMA = s.contactReason==="free_valuation"
  const isFSBO = s.contactReason==="fsbo_outreach"
  const isReconnect = s.contactReason==="reconnect" || s.contactReason==="re_engagement"
  const isFirstContactSeller = s.contactReason==="first_contact" && isSeller()
  const isOfferStrategy = s.contactReason==="offer_strategy"
  const isObjection = s.contactReason==="objection_handle"
  const showFullPropFeatures = !isNoPropertyReason && !isSoldNearby && !isCMA

  const CONTACT_REASONS = isSeller() ? REASONS_SELLER_EN :
    s.clientType==="past_client" ? REASONS_PAST_EN :
    s.clientType==="cold_lead" ? REASONS_COLD_EN : REASONS_BUYER_EN

  // ── GENERATE ─────────────────────────────────────────────
  const generate = async () => {
    update({loading:true, error:"", result:null})
    const langInstr = isSpa ? "\n\nCRÍTICO: Escribe TODO el contenido completamente en español. Ni una sola palabra en inglés." : ""
    const safeClaude = async (p, sys, tok) => { try { return await apiClaude(p,sys,tok)||{} } catch(e) { return {} } }

    const ctx = `CLIENT: ${s.clientName} | TYPE: ${s.clientType} | REASON: ${s.contactReason} | URGENCY: ${s.urgency||"medium"} | TONE: ${s.tone||"professional"}
PROPERTY: ${s.propAddress||"N/A"} | $${s.propPrice||"N/A"} | ${s.propType||""} | Beds:${s.propBeds||""} | Baths:${s.propBaths||""} | ${s.propHighlights||""}
${s.propInterior.length?`INTERIOR: ${s.propInterior.slice(0,10).join(",")}`:""} ${s.propOutdoor.length?`OUTDOOR: ${s.propOutdoor.slice(0,8).join(",")}`:""} ${s.propBuilding.length?`BUILDING: ${s.propBuilding.slice(0,6).join(",")}`:""} 
${isBuyer()?`BUYER CRITERIA: ${s.buyerCriteria.map(b=>typeof b==="object"?b.label:b).join(",")||"not specified"}`:""}${isSeller()?`SELLER SITUATION: ${s.sellerSituation.join(",")||"not specified"}`:""}
${s.customSituation?"AGENT CONTEXT (use this above all else): "+s.customSituation:""}
AGENT: ${s.agentName||"Agent"}${s.agentPhone?"|"+s.agentPhone:""}${s.agencyName?"|"+s.agencyName:""}`

    try {
      update({loadingMsg:"✦ Writing messages..."})
      let p1 = `${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp. Warm, personal, use ${s.clientName}'s first name. End with easy question.","sms":"SMS max 160 chars. Punchy and personal.","voice_script":"Call script: OPENING, REASON FOR CALL, VALUE PITCH, CLOSE. Labelled.","email_subject":"Personal subject under 10 words.","email_body":"130-160 word email. Personal opener, opportunity, CTA. Signed by ${s.agentName||"Agent"}${s.agencyName?" from "+s.agencyName:""}."}`;
      if(s.contactReason==="objection_handle") p1=`${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp objection response. Acknowledge, reframe, keep door open.","sms":"SMS objection response max 160 chars.","voice_script":"Objection handling: OPENING, REFRAME, QUESTION, CLOSE. Labelled.","email_subject":"Non-salesy subject under 9 words.","email_body":"130-150 word email handling objection. Signed by ${s.agentName||"Agent"}."}`;
      if(s.contactReason==="referral_request") p1=`${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word referral request WhatsApp. Warm, celebrate success, ask naturally.","sms":"Referral SMS max 160 chars.","voice_script":"Referral call: OPENING, CELEBRATION, ASK, CLOSE. Labelled.","email_subject":"Referral subject under 9 words.","email_body":"120-140 word referral email. Signed by ${s.agentName||"Agent"}."}`;
      if(s.contactReason==="anniversary") p1=`${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word anniversary WhatsApp. Warm, celebratory, no hard sell.","sms":"Anniversary SMS max 160 chars.","voice_script":"Anniversary call: OPENING, UPDATE, CHECK-IN, SOFT CTA. Labelled.","email_subject":"Anniversary subject under 9 words.","email_body":"120-140 word anniversary email. Signed by ${s.agentName||"Agent"}."}`;
      if(isCMA) p1=`${ctx}\nSUBJECT: ${s.cmaSubject.address} | $${s.cmaSubject.price} | ${s.cmaSubject.beds}bed/${s.cmaSubject.baths}bath\nCOMPS: ${s.cmaComps.map((c,i)=>`${i+1}. ${c.address} sold $${c.salePrice} ${c.saleDate}`).join(" | ")}${langInstr}\n\nReturn ONLY JSON:\n{"whatsapp":"60-80 word WhatsApp. Warm, mention free valuation ready for their home. End with booking question.","sms":"SMS max 160 chars. Mention free valuation ready.","voice_script":"Call: OPENING, CMA READY, VALUE INSIGHT, BOOK MEETING. Labelled.","email_subject":"Free valuation subject under 10 words.","email_body":"140-160 word email. Lead with free valuation, share market insight, invite no-obligation meeting. Signed by ${s.agentName||"Agent"}."}`;
      const part1 = await safeClaude(p1, SYSTEM, 1500)

      update({loadingMsg:"✦ Writing letter & follow-ups..."})
      let p2 = `${ctx}${langInstr}\n\nReturn ONLY JSON:\n{"formal_letter":"Full formal letter 260-300 words. Dear ${s.clientName}, 4 paragraphs. Sign: Warm regards,\\n${s.agentName||"Agent"}${s.agencyName?"\\n"+s.agencyName:""}${s.agentPhone?"\\n"+s.agentPhone:""}","followup_1":"Follow-up Day 3. 50-60 words.","followup_2":"Follow-up Week 1. 50-60 words.","followup_3":"Follow-up Week 2. 40-50 words.","followup_4":"Follow-up Month 1. 40-50 words."}`;
      const part2 = await safeClaude(p2, SYSTEM, 1600)

      update({loadingMsg:"✦ Building schedule..."})
      const p3 = `CLIENT: ${s.clientName} | TYPE: ${s.clientType} | REASON: ${s.contactReason}\n\nReturn ONLY JSON:\n{"schedule":[{"day":"Today — First Contact","icon":"🚀","tasks":["Send the WhatsApp message","If no reply after 2 hours, send SMS","Save client in CRM with today's date"]},{"day":"Day 3 — First Follow-Up","icon":"💬","tasks":["Send Follow-Up #1 if no reply","Check if they opened your email","Note response in CRM"]},{"day":"Day 7 — Week 1","icon":"📞","tasks":["Send Follow-Up #2 with new angle","Make a phone call","Listen first — ask questions before pitching"]},{"day":"Day 14 — Two Week Touch","icon":"🔄","tasks":["Send Follow-Up #3 — casual, no pressure","Share relevant market update","Update CRM"]},{"day":"Day 30 — Monthly Touch","icon":"🌱","tasks":["Send Follow-Up #4 — final warm message","Move to monthly newsletter if still no reply","Do not give up — timing is everything"]},{"day":"Ongoing","icon":"📅","tasks":["Add to monthly market update list","Check in every 90 days for long-term leads"]}]}`
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
          <div style={{display:"flex",gap:"4px",marginBottom:"20px",flexWrap:"wrap",background:G.bg1,padding:"4px",borderRadius:"10px",border:`1px solid ${G.aquaBorder}`}}>
            {TABS_EN.map(tab=>(
              <button key={tab.id} onClick={()=>update({activeTab:tab.id})}
                style={{background:s.activeTab===tab.id?G.aqua:"#0d0d0d",color:s.activeTab===tab.id?"#060608":G.muted,border:s.activeTab===tab.id?`1px solid ${G.border2}`:"1px solid transparent",borderRadius:"8px",padding:"7px 12px",fontSize:"11px",fontWeight:s.activeTab===tab.id?"700":"500",fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>
                {tab.label}
              </button>
            ))}
          </div>
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
              <div style={{background:"rgba(42,184,212,0.08)",border:"1.5px solid rgba(42,184,212,0.4)",borderRadius:"10px",padding:"18px",marginTop:"20px"}}>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:G.aqua,marginBottom:"6px"}}>✨ What Happened After Your First Message?</div>
                <p style={{fontSize:"12px",color:"rgba(42,184,212,0.85)",marginBottom:"10px",lineHeight:"1.6"}}>Describe what happened. The AI will generate 4 brand new follow-ups tailored to exactly what happened.</p>
                <textarea placeholder="e.g. She replied and said she liked it but her husband isn't convinced. She asked if we could do anything on the price..." rows={3}
                  value={s.regenContext||""} onChange={e=>update({regenContext:e.target.value})}
                  style={{...inputStyle,resize:"vertical",borderColor:"rgba(42,184,212,0.4)",background:"#0d0d0d",marginBottom:"10px"}}/>
                <button onClick={async()=>{
                  if(!s.regenContext||s.regenLoading) return
                  update({regenLoading:true})
                  try {
                    const regen = await apiClaude(`Original: CLIENT ${s.clientName} | ${s.contactReason}\nWhat happened: ${s.regenContext}\n${isSpa?"CRITICAL: All content in Spanish.":""}\n\nReturn ONLY JSON:\n{"followup_1":"New Day 3 follow-up. 50-60 words.","followup_2":"New Week 1 follow-up. 50-60 words.","followup_3":"New Week 2 follow-up. 40-50 words.","followup_4":"New Month 1 follow-up. 40-50 words."}`, "You are an elite real estate sales coach. Return ONLY raw JSON.", 800)
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
          <button onClick={()=>update({...initState(s.language)})} style={{...btnStyle(false),marginTop:"16px"}}>← New Client</button>
        </div>
      </div>
    )
  }

  // ── FORM VIEW ─────────────────────────────────────────────
  const inp = inputStyle
  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      <div style={{background:G.bg1,borderBottom:`1px solid ${G.border}`,padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000"}}>
        <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:G.white}}>STREAM<span style={{color:G.aqua}}>FLUX</span></span>
        <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>← Dashboard</button>
      </div>

      <div style={{maxWidth:"660px",margin:"0 auto",padding:"30px 18px 60px"}}>

        {/* Language */}
        <div style={{...cardStyle,marginBottom:"8px"}}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:G.white}}>🌐 Output Language</h2>
          <select value={s.language} onChange={e=>update({language:e.target.value,contactReason:""})} style={{...inp,cursor:"pointer"}}>
            <option value="English">🇺🇸 English</option>
            <option value="Spanish">🇪🇸 Español</option>
          </select>
        </div>

        {/* Client info */}
        <div style={cardStyle}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>👤 Who Are You Contacting?</h2>
          <div style={{marginBottom:"16px"}}>
            <label style={labelStyle}>Client First Name</label>
            <input type="text" placeholder={isSpa?"María":"Sarah"} style={inp} value={s.clientName||""} onChange={e=>update({clientName:e.target.value})}/>
          </div>
          <Chips label="Client Type" options={CLIENT_TYPES_EN} selected={s.clientType} onToggle={v=>update({clientType:v,contactReason:""})} single/>
          {s.clientType && <Chips label="Reason for Contacting" options={CONTACT_REASONS} selected={s.contactReason} onToggle={v=>update({contactReason:v})} single/>}
          {s.contactReason && <>
            <Chips label="Urgency Level" options={URGENCY_EN} selected={s.urgency} onToggle={v=>update({urgency:v})} single/>
            <Chips label="Communication Tone" options={TONES_EN} selected={s.tone} onToggle={v=>update({tone:v})} single/>
          </>}
        </div>

        {/* OBJECTION */}
        {isObjection && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🛡️ What Objection Did They Raise?</h2>
            <Chips options={isSeller() ? OBJECTIONS_SELLER_EN : OBJECTIONS_BUYER_EN} selected={s.objection} onToggle={v=>update({objection:v})} single/>
            {showFullPropFeatures && <PropFeaturesCard s={s} update={update} tog={tog} isSpa={isSpa} title={isSpa?"🏠 La Propiedad":"🏠 The Property"}/>}
          </div>
        )}

        {/* ANNIVERSARY */}
        {s.contactReason==="anniversary" && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:G.white}}>🎉 Anniversary Details</h2>
            <label style={labelStyle}>Years Since Purchase</label>
            <input type="number" placeholder="1" style={inp} value={s.anniversaryYears||""} onChange={e=>update({anniversaryYears:e.target.value})}/>
          </div>
        )}

        {/* MARKET UPDATE */}
        {isMarketUpdate && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>📊 Market Update Details</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>The AI will personalise every message with real market context.</p>
            <div style={{marginBottom:"14px"}}>
              <label style={labelStyle}>City / Market Area</label>
              <input type="text" placeholder="e.g. Miami Beach, South Florida" style={inp} value={s.marketLocation||""} onChange={e=>update({marketLocation:e.target.value})}/>
            </div>
            <Chips label="Market Direction" options={["📈 Rising Prices","📊 Stable Market","📉 Cooling Down","🔥 High Demand","📦 Low Inventory","⏱️ Good Time to Buy","🏆 Seller's Market","🤝 Buyer's Market","🏗️ New Developments","📅 Seasonal Slowdown"]} selected={s.marketDirection||[]} onToggle={v=>update({marketDirection:tog(s.marketDirection||[],v)})}/>
            <div style={{marginBottom:"14px"}}>
              <label style={labelStyle}>Your Market Insight (optional)</label>
              <textarea placeholder="e.g. Prices up 3% this month in South Beach, inventory tightening, average days on market dropped to 22..." rows={3} style={{...inp,resize:"vertical"}} value={s.marketInsight||""} onChange={e=>update({marketInsight:e.target.value})}/>
            </div>
            <div>
              <label style={labelStyle}>Any Specific Data or Stats</label>
              <input type="text" placeholder="e.g. Median price $850K, 12% more sales than last year" style={inp} value={s.marketStats||""} onChange={e=>update({marketStats:e.target.value})}/>
            </div>
          </div>
        )}

        {/* FINANCING UPDATE */}
        {isFinancingUpdate && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>💰 Financing Update</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Select what's changed, then add any specific details.</p>
            <Chips label="What Changed?" options={FINANCING_OPTIONS_EN} selected={s.financingOptions||[]} onToggle={v=>update({financingOptions:tog(s.financingOptions||[],v)})}/>
            <div style={{marginTop:"8px"}}>
              <label style={labelStyle}>Specific Details (optional)</label>
              <textarea placeholder="e.g. Rates dropped to 6.2%, qualifying is now easier for first-time buyers, 10% down payment options available..." rows={3} style={{...inp,resize:"vertical"}} value={s.financingNews||""} onChange={e=>update({financingNews:e.target.value})}/>
            </div>
          </div>
        )}

        {/* FIRST CONTACT SELLER */}
        {isFirstContactSeller && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>📋 Lead Details</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>How did you find this lead and what do you know about their property?</p>
            <Chips label="How Did You Get This Lead?" options={[{value:"door_knock",label:"🚪 Door Knock"},{value:"cold_call",label:"📞 Cold Call"},{value:"referral",label:"👥 Referral"},{value:"online",label:"🌐 Online Lead"},{value:"direct_mail",label:"📮 Direct Mail"},{value:"farming",label:"🏘️ Area Farming"},{value:"social_media",label:"📱 Social Media"},{value:"open_house",label:"🏠 Open House"}]} selected={s.leadSource} onToggle={v=>update({leadSource:v})} single/>
            <div style={{marginTop:"8px"}}>
              <label style={labelStyle}>What Do You Know About Their Property?</label>
              <textarea placeholder="e.g. 3-bed on Oak Street, has been vacant for a while, visible garden needs work, neighbours say they're thinking of selling..." rows={3} style={{...inp,resize:"vertical"}} value={s.knownAboutProperty||""} onChange={e=>update({knownAboutProperty:e.target.value})}/>
            </div>
          </div>
        )}

        {/* RECONNECT */}
        {isReconnect && !isFirstContactSeller && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🔄 Reconnecting</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Help the AI recall the context of this relationship.</p>
            <textarea label="What Were They Looking For?" placeholder={isBuyer()?"e.g. They wanted a 4-bed house with pool near good schools, budget $850K. We lost touch 3 months ago...":"e.g. They wanted to sell in spring but delayed. Still considering it. Price was the main hesitation..."} rows={4} style={{...inp,resize:"vertical"}} value={s.lookingFor||""} onChange={e=>update({lookingFor:e.target.value})}/>
          </div>
        )}

        {/* JUST SOLD NEARBY / NEIGHBOURHOOD SALE */}
        {isSoldNearby && (
          <div style={{...cardStyle,background:"rgba(42,184,212,0.04)",border:"1px solid rgba(42,184,212,0.2)"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🏘️ Property Sold in the Neighbourhood</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Enter the details of the property that sold — the AI will use this to show your market knowledge.</p>
            <div style={{marginBottom:"12px"}}>
              <label style={labelStyle}>Address of Sold Property</label>
              <input type="text" placeholder="e.g. 14 Maple Street, Austin TX" style={inp} value={s.soldAddress||""} onChange={e=>update({soldAddress:e.target.value})}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"10px",marginBottom:"12px"}}>
              {[["soldPrice","Sold Price ($)","485,000"],["soldBeds","Beds","3"],["soldBaths","Baths","2"],["soldType","Type","Condo"]].map(([key,label,ph])=>(
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input type="text" placeholder={ph} style={inp} value={s[key]||""} onChange={e=>update({[key]:e.target.value})}/>
                </div>
              ))}
            </div>
            <div style={{marginBottom:"4px"}}>
              <label style={labelStyle}>Sale Date</label>
              <input type="text" placeholder="e.g. Last week, March 2025" style={inp} value={s.soldDate||""} onChange={e=>update({soldDate:e.target.value})}/>
            </div>
            <div style={{marginTop:"14px",paddingTop:"14px",borderTop:`1px solid ${G.border}`}}>
              <p style={{fontSize:"12px",color:G.muted,marginBottom:"10px"}}>Optional: Add your contact's property details for comparison.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"10px"}}>
                {[["clientPropAddress","Their Address","22 Oak Ave..."],["clientPropPrice","Est. Value ($)","520,000"],["clientPropBeds","Beds","3"],["clientPropBaths","Baths","2"]].map(([key,label,ph])=>(
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type="text" placeholder={ph} style={inp} value={s[key]||""} onChange={e=>update({[key]:e.target.value})}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRICE DISCUSSION */}
        {isPriceDiscussion && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>💬 Price Reduction Discussion</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>The AI will frame the price reduction with data and empathy.</p>
            <div style={{marginBottom:"12px"}}>
              <label style={labelStyle}>Days on Market</label>
              <input type="number" placeholder="45" style={inp} value={s.daysOnMarket||""} onChange={e=>update({daysOnMarket:e.target.value})}/>
            </div>
            <Chips label="Why Consider a Reduction?" options={["No offers received","Similar homes sold lower","Market has shifted","Showings but no offers","Overpriced vs market","Too much competition","Buyer feedback on price","Agent recommendation"]} selected={s.priceReasons||[]} onToggle={v=>update({priceReasons:tog(s.priceReasons||[],v)})}/>
            <PropFeaturesCard s={s} update={update} tog={tog} isSpa={isSpa} title="🏠 Their Property"/>
          </div>
        )}

        {/* EXPIRED LISTING */}
        {isExpiredListing && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>📋 Expired Listing Details</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>The AI will position your services as the solution.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div>
                <label style={labelStyle}>Original Asking Price ($)</label>
                <input type="text" placeholder="680,000" style={inp} value={s.expOrigPrice||""} onChange={e=>update({expOrigPrice:e.target.value})}/>
              </div>
              <div>
                <label style={labelStyle}>Days It Was Listed</label>
                <input type="number" placeholder="90" style={inp} value={s.expDays||""} onChange={e=>update({expDays:e.target.value})}/>
              </div>
            </div>
            <Chips label="Why Do You Think It Didn't Sell?" options={["Overpriced","Poor marketing","Bad timing","Needs repairs","Wrong agent strategy","Poor presentation","Market shifted","Too many conditions","No professional photos","Weak online presence"]} selected={s.expiredReasons||[]} onToggle={v=>update({expiredReasons:tog(s.expiredReasons||[],v)})}/>
            <PropFeaturesCard s={s} update={update} tog={tog} isSpa={isSpa} title="🏠 Their Property"/>
          </div>
        )}

        {/* PRE-LISTING PREP */}
        {isPreListing && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>✅ Pre-Listing Preparation</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Select what you're recommending to maximise their sale price.</p>
            <Chips label="Recommended Preparations" options={["📸 Professional Photography","🎬 Video Tour","🎨 Home Staging","🔧 Minor Repairs","🧹 Deep Clean","📦 Declutter & Depersonalise","💡 New Lighting","🎨 Interior Paint","🌿 Curb Appeal","🏡 Kitchen Update","🚿 Bathroom Update","💎 Value-Add Improvements","📐 Floor Plan","🏠 Virtual Tour","📊 Pre-Sale Inspection","🔑 Smart Lock / Security","⚡ Electrical Check","🪟 Window Cleaning"]} selected={s.preListingItems||[]} onToggle={v=>update({preListingItems:tog(s.preListingItems||[],v)})}/>
            <PropFeaturesCard s={s} update={update} tog={tog} isSpa={isSpa} title="🏠 Their Property"/>
          </div>
        )}

        {/* TIMELINE CHECK-IN */}
        {isTimelineCheckin && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>📅 Timeline Check-In</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Reference their original plan to show you've been paying attention.</p>
            <div style={{marginBottom:"14px"}}>
              <label style={labelStyle}>When Did They Originally Want to Sell?</label>
              <input type="text" placeholder="e.g. Spring 2025, Q1, 6 months ago..." style={inp} value={s.originalTimeline||""} onChange={e=>update({originalTimeline:e.target.value})}/>
            </div>
            <Chips label="What May Have Changed?" options={["Life circumstances changed","Market conditions shifted","Found a new property","Family situation","Work relocation","Financial situation","Just taking longer than expected","Not sure yet"]} selected={s.timelineChanges||[]} onToggle={v=>update({timelineChanges:tog(s.timelineChanges||[],v)})}/>
          </div>
        )}

        {/* BUYER MATCH */}
        {isBuyerMatch && isSeller() && (
          <div style={{...cardStyle,background:"rgba(42,184,212,0.04)",border:"1px solid rgba(42,184,212,0.2)"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🎯 Buyer Profile</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Including buyer details makes this message far more compelling.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
              <div>
                <label style={labelStyle}>Buyer's Budget</label>
                <input type="text" placeholder="e.g. $500K–$650K" style={inp} value={s.buyerBudget||""} onChange={e=>update({buyerBudget:e.target.value})}/>
              </div>
              <div>
                <label style={labelStyle}>Buyer Profile</label>
                <input type="text" placeholder="e.g. Young family, works from home" style={inp} value={s.buyerType||""} onChange={e=>update({buyerType:e.target.value})}/>
              </div>
            </div>
            <Chips label="What They're Looking For" options={["3+ Bedrooms","4+ Bedrooms","Large Garden","Pool","Good Schools Nearby","Home Office","Move-in Ready","Modern Kitchen","Open Plan","Quiet Street","Near Transport","Garage","Investment Property"]} selected={s.buyerWants||[]} onToggle={v=>update({buyerWants:tog(s.buyerWants||[],v)})}/>
            <PropFeaturesCard s={s} update={update} tog={tog} isSpa={isSpa} title="🏠 Their Property"/>
          </div>
        )}

        {/* FSBO OUTREACH */}
        {isFSBO && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🏷️ FSBO Outreach</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Help the AI craft a message that earns their trust and shows your value.</p>
            <div style={{marginBottom:"14px"}}>
              <label style={labelStyle}>Why Should They Work With You?</label>
              <textarea placeholder="e.g. I sold 3 homes on their street this year, average 8% above asking price, have 15 pre-qualified buyers actively looking in this area..." rows={3} style={{...inp,resize:"vertical"}} value={s.fsboWhySellWithAgent||""} onChange={e=>update({fsboWhySellWithAgent:e.target.value})}/>
            </div>
            <Chips label="Key Advantages to Highlight" options={["Access to more buyers","Higher sale price","Professional negotiation","Legal protection","MLS exposure","Professional photography","No hassle / time saved","Pre-qualified buyer network","Market expertise","Faster sale","Contract management","Zero upfront cost"]} selected={s.fsboReasons||[]} onToggle={v=>update({fsboReasons:tog(s.fsboReasons||[],v)})}/>
            <PropFeaturesCard s={s} update={update} tog={tog} isSpa={isSpa} title="🏠 Their Property"/>
          </div>
        )}

        {/* OFFER STRATEGY */}
        {isOfferStrategy && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🎯 Offer Strategy</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"16px"}}>Help the AI write a message that guides them through making a strong offer.</p>
            <div style={{marginBottom:"12px"}}>
              <label style={labelStyle}>Their Budget / Offer Range</label>
              <input type="text" placeholder="e.g. $480K–$510K" style={inp} value={s.offerBudget||""} onChange={e=>update({offerBudget:e.target.value})}/>
            </div>
            <Chips label="Offer Strategy Elements" options={["Competitive offer — above asking","Below asking — motivated seller","Clean offer — no conditions","Quick closing timeline","Escalation clause","Personal letter to seller","Flexible move-in date","Pre-approved financing","All cash offer","Inspection waived","Strong deposit","Multiple offer situation"]} selected={s.offerStrategy||[]} onToggle={v=>update({offerStrategy:tog(s.offerStrategy||[],v)})}/>
            <PropFeaturesCard s={s} update={update} tog={tog} isSpa={isSpa} title="🏠 The Property"/>
          </div>
        )}

        {/* CMA FORM */}
        {isCMA && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🏡 Comparative Market Analysis (CMA)</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"18px"}}>Enter the client's property and up to 3 recent comparable sales.</p>
            <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color:G.aqua,marginBottom:"10px"}}>🏠 Subject Property</div>
            <div style={{marginBottom:"12px"}}>
              <label style={labelStyle}>Address</label>
              <input type="text" placeholder="123 Main St, Miami FL" style={inp} value={s.cmaSubject.address||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,address:e.target.value}})}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              {[["beds","Beds","3"],["baths","Baths","2"],["sqft","Sq Ft","1,800"]].map(([k,l,p])=>(
                <div key={k}><label style={labelStyle}>{l}</label><input type="text" placeholder={p} style={inp} value={s.cmaSubject[k]||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,[k]:e.target.value}})}/></div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
              <div><label style={labelStyle}>Estimated Value ($)</label><input type="text" placeholder="450,000" style={inp} value={s.cmaSubject.price||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,price:e.target.value}})}/></div>
              <div><label style={labelStyle}>Condition</label><input type="text" placeholder="Good, updated kitchen" style={inp} value={s.cmaSubject.condition||""} onChange={e=>update({cmaSubject:{...s.cmaSubject,condition:e.target.value}})}/></div>
            </div>
            {s.cmaComps.map((comp,i)=>(
              <div key={i}>
                <div style={{height:"1px",background:G.border,margin:"12px 0"}}/>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color:G.aqua,marginBottom:"10px"}}>📊 Comparable {i+1}</div>
                <div style={{marginBottom:"10px"}}><label style={labelStyle}>Address</label><input type="text" placeholder={`${100+i*10} Nearby St`} style={inp} value={comp.address||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],address:e.target.value};update({cmaComps:c})}}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  {[["salePrice","Sale Price ($)","430,000"],["saleDate","Sale Date","Jan 2025"],["sqft","Sq Ft","1,750"]].map(([k,l,p])=>(
                    <div key={k}><label style={labelStyle}>{l}</label><input type="text" placeholder={p} style={inp} value={comp[k]||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],[k]:e.target.value};update({cmaComps:c})}}/></div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
                  {[["beds","Beds","3"],["baths","Baths","2"],["condition","Condition","Good"]].map(([k,l,p])=>(
                    <div key={k}><label style={labelStyle}>{l}</label><input type="text" placeholder={p} style={inp} value={comp[k]||""} onChange={e=>{const c=[...s.cmaComps];c[i]={...c[i],[k]:e.target.value};update({cmaComps:c})}}/></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REGULAR PROPERTY CARD */}
        {showFullPropFeatures && !isObjection && !isPriceDiscussion && !isExpiredListing && !isPreListing && !isFSBO && !isBuyerMatch && !isOfferStrategy && (
          <PropFeaturesCard s={s} update={update} tog={tog} isSpa={isSpa}
            title={isBuyer() ? "🏠 Property You're Offering" : isSeller() ? "🏠 Their Property" : "🏠 Property Details"}
          />
        )}

        {/* PRICE REDUCTION SPECIFIC FIELD FOR BUYERS */}
        {s.contactReason==="price_drop" && isBuyer() && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"12px",color:G.white}}>📉 Price Reduction Details</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div>
                <label style={labelStyle}>New Price ($)</label>
                <input type="text" placeholder="895,000" style={inp} value={s.propNewPrice||""} onChange={e=>update({propNewPrice:e.target.value})}/>
              </div>
              <div>
                <label style={labelStyle}>Was ($)</label>
                <input type="text" placeholder="995,000" style={inp} value={s.propOldPrice||""} onChange={e=>update({propOldPrice:e.target.value})}/>
              </div>
            </div>
          </div>
        )}

        {/* BUYER CRITERIA */}
        {isBuyer() && !["just_sold","neighbour_sale","financing_update","market_update","reconnect","first_contact","re_engagement","offer_strategy"].includes(s.contactReason) && (
          <div style={cardStyle}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"8px",color:G.white}}>🔍 Buyer Criteria</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"12px"}}>What is this buyer specifically looking for?</p>
            <Chips options={BUYER_CRITERIA_EN} selected={s.buyerCriteria} onToggle={v=>update({buyerCriteria:tog(s.buyerCriteria,v)})}/>
            <div style={{marginTop:"8px"}}>
              <label style={labelStyle}>Specific Requirements (optional)</label>
              <textarea placeholder="e.g. Must be walking distance to good schools, needs a home office, dog-friendly building, partner works in downtown..." rows={2} style={{...inp,resize:"vertical"}} value={s.buyerNeeds||""} onChange={e=>update({buyerNeeds:e.target.value})}/>
            </div>
          </div>
        )}

        {/* SELLER SITUATION */}
        {isSeller() && (
          <div style={{...cardStyle,background:"rgba(42,184,212,0.03)",border:`1px solid rgba(42,184,212,0.15)`}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>🏷️ Seller Situation</h2>
            <p style={{fontSize:"12px",color:G.muted,marginBottom:"14px",lineHeight:"1.6"}}>Select all that apply — the AI tailors every message to their exact situation.</p>
            <Chips options={SELLER_SITUATION_EN} selected={s.sellerSituation} onToggle={v=>update({sellerSituation:tog(s.sellerSituation,v)})}/>
          </div>
        )}

        {/* PERSONAL CONTEXT */}
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

        {/* AGENT DETAILS */}
        <div style={cardStyle}>
          <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🏷️ Your Details</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
            <div>
              <label style={labelStyle}>Your Name</label>
              <input type="text" placeholder={isSpa?"Carlos García":"James Rivera"} style={inp} value={s.agentName||""} onChange={e=>update({agentName:e.target.value})}/>
            </div>
            <div>
              <label style={labelStyle}>Your Phone</label>
              <input type="text" placeholder="+1 305 555 0199" style={inp} value={s.agentPhone||""} onChange={e=>update({agentPhone:e.target.value})}/>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Agency / Company Name</label>
            <input type="text" placeholder={isSpa?"García Inmobiliaria":"Rivera Real Estate Group"} style={inp} value={s.agencyName||""} onChange={e=>update({agencyName:e.target.value})}/>
          </div>
        </div>

        {/* ERROR */}
        {s.error && <div style={{background:"#1a0808",border:"1px solid #3a1010",borderRadius:"8px",padding:"12px 16px",color:"#f87171",fontSize:"13px",marginBottom:"16px"}}>{s.error}</div>}

        {/* LOADING */}
        {s.loading && (
          <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:"10px",padding:"18px 22px",marginBottom:"16px",textAlign:"center"}}>
            <p style={{color:G.aqua,fontSize:"14px",margin:"0",fontWeight:"600"}}>{s.loadingMsg}</p>
            <p style={{color:G.muted,fontSize:"12px",margin:"6px 0 0"}}>Generating. Please wait...</p>
          </div>
        )}

        {/* GENERATE */}
        <button
          onClick={()=>{if(canGenerate()&&!s.loading) generate()}}
          style={{...btnStyle(!canGenerate()||s.loading),width:"100%",fontSize:"15px",background:canGenerate()&&!s.loading?G.aqua:"#1a1a1a",color:canGenerate()&&!s.loading?"#060608":G.muted}}
        >
          {s.loading?"Generating...":"✦ Generate Full Outreach Package"}
        </button>
        {!canGenerate() && <p style={{color:G.muted,fontSize:"12px",marginTop:"8px",textAlign:"center"}}>Fill in client name, type, and contact reason to continue.</p>}

      </div>
    </div>
  )
}
