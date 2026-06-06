import { useState } from 'react'
import { G, SF, apiClaude, inputStyle, cardStyle, labelStyle, btnStyle } from '../globals.js'
import { Chips } from '../components/shared/Chips.jsx'
import { CopyCard } from '../components/shared/CopyCard.jsx'

const SYSTEM = "You are an elite real estate copywriter. You MUST respond with ONLY a raw valid JSON object. No markdown. No backticks. No explanation. Start your response with { and end with }. Nothing else."

const initState = (lang) => ({
  step:1, mode:"", language:lang||"English",
  propType:"", address:"", price:"", oldPrice:"",
  beds:"", baths:"", sqft:"", yearBuilt:"", condition:"",
  soldPrice:"", daysOnMarket:"", openHouseDate:"", openHouseTime:"",
  city:"", neighbourhood:"", locationFeatures:[], commute:"",
  interior:[], outdoor:[], building:[],
  uniqueFeature:"", agentNote:"", tone:"", targetBuyer:"",
  agentName:"", agentPhone:"",
  loading:false, loadingMsg:"", loadingPct:0,
  result:null, error:"", activeTab:"listing"
})

export default function App1({ state: appState, setScreen }) {
  const [s, setS] = useState(initState(appState.lang))
  const update = (u) => setS(prev=>({...prev,...u}))
  const tog = (arr, val) => arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]

  const isSpa = s.language === "Spanish"
  const totalSteps = () => s.mode==="sold"?4:s.mode==="open_house"?5:6
  const canProceed = () => {
    if(s.step===1) return !!s.mode
    if(s.step===2) return s.propType&&s.address&&s.price&&(s.mode==="sold"?true:s.beds&&s.baths)
    if(s.step===3) return !!s.city
    if(s.step===4) return s.mode==="sold"?!!s.tone:s.interior.length>0||s.outdoor.length>0
    if(s.step===5&&s.mode!=="sold"&&s.mode!=="open_house") return true
    return !!s.tone
  }

  // ── DATA ─────────────────────────────────────────────────
  const MODES = isSpa ? [
    {value:"new_listing",label:"🏠 Nueva Propiedad en Venta",desc:"Paquete completo de marketing"},
    {value:"rental",label:"🔑 Nueva Propiedad en Alquiler",desc:"Paquete completo para alquileres"},
    {value:"open_house",label:"🚪 Jornada de Puertas Abiertas",desc:"Invitación y promoción"},
    {value:"price_reduction",label:"📉 Reducción de Precio",desc:"Re-marketing con nuevo precio"},
    {value:"sold",label:"🏆 Vendida",desc:"Anunciar la venta"},
  ] : [
    {value:"new_listing",label:"🏠 New Listing — For Sale",desc:"Full marketing package"},
    {value:"rental",label:"🔑 New Listing — For Rent",desc:"Complete rental marketing package"},
    {value:"open_house",label:"🚪 Open House",desc:"Event invite & promotion"},
    {value:"price_reduction",label:"📉 Price Reduction",desc:"Re-market with new price"},
    {value:"sold",label:"🏆 Just Sold",desc:"Announce the sale"},
  ]
  const PROP_TYPES = isSpa ? ["Casa","Apartamento","Condominio","Adosado","Villa","Ático","Estudio","Dúplex","Tríplex","Terreno","Local Comercial","Uso Mixto"] : ["House","Apartment","Condo","Townhouse","Villa","Penthouse","Studio","Duplex","Triplex","Land / Lot","Commercial","Mixed Use"]
  const CONDITIONS = isSpa ? ["Obra Nueva / Sobre Plano","Recién Reformado","Listo para Entrar","Buen Estado","Necesita Reforma"] : ["Brand New / Off-Plan","Newly Renovated","Move-in Ready","Good Condition","Needs TLC / Fixer-upper"]
  const TONES = isSpa ? [
    {value:"luxury",label:"Lujo y Prestigio",desc:"Premium y aspiracional"},
    {value:"friendly",label:"Cálido y Cercano",desc:"Accesible y hogareño"},
    {value:"investment",label:"Enfoque Inversor",desc:"ROI, números, oportunidad"},
    {value:"lifestyle",label:"Estilo de Vida",desc:"Energético y aspiracional"},
    {value:"urgent",label:"Urgencia y FOMO",desc:"Actúa ya, tiempo limitado"},
  ] : [
    {value:"luxury",label:"Luxury & Prestige",desc:"High-end, aspirational"},
    {value:"friendly",label:"Warm & Friendly",desc:"Approachable, homey"},
    {value:"investment",label:"Investment Focus",desc:"ROI, numbers, opportunity"},
    {value:"lifestyle",label:"Lifestyle & Vibe",desc:"Energetic, aspirational"},
    {value:"urgent",label:"Urgency & FOMO",desc:"Act now, limited time"},
  ]
  const TABS = isSpa ? [
    {id:"listing",label:"🏠 Propiedad"},{id:"social",label:"📱 Redes Sociales"},
    {id:"ads",label:"🎯 Anuncios y SMS"},{id:"tiktok",label:"🎬 TikTok"},
    {id:"neighbours",label:"✉️ Vecinos"},{id:"schedule",label:"📅 Calendario"},
    {id:"renovation",label:"🔨 Renovaciones"},
  ] : [
    {id:"listing",label:"🏠 Listing"},{id:"social",label:"📱 Social"},
    {id:"ads",label:"🎯 Ads & SMS"},{id:"tiktok",label:"🎬 TikTok"},
    {id:"neighbours",label:"✉️ Neighbours"},{id:"schedule",label:"📅 Schedule"},
    {id:"renovation",label:"🔨 Renovations"},
  ]

  // ── GENERATE ─────────────────────────────────────────────
  const generate = async () => {
    update({loading:true, error:"", result:null, loadingPct:0})
    const lang = isSpa ? "Spanish" : "English"
    const langInstr = isSpa ? "\n\nCRÍTICO: Escribe TODO el contenido completamente en español. Ni una sola palabra en inglés." : ""
    const safeClaude = async (p, sys, tok) => { try { return await apiClaude(p,sys,tok)||{} } catch(e) { return {} } }
    const propSummary = [`Mode:${s.mode}`,`${s.propType} at ${s.address}`,`Price:$${s.price}${s.oldPrice?` (was $${s.oldPrice})`:""}`,`Beds:${s.beds}|Baths:${s.baths}${s.sqft?`|${s.sqft}sqft`:""}`,s.condition&&`Condition:${s.condition}`,`City:${s.city}${s.neighbourhood?`,${s.neighbourhood}`:""}`,s.locationFeatures.length&&`Location:${s.locationFeatures.slice(0,8).join(",")}`,s.interior.length&&`Interior:${s.interior.slice(0,12).join(",")}`,s.outdoor.length&&`Outdoor:${s.outdoor.slice(0,10).join(",")}`,`Tone:${s.tone}|Buyer:${s.targetBuyer||"general"}`,`Agent:${s.agentName||"Agent"}${s.agentPhone?`|${s.agentPhone}`:""}`].filter(Boolean).join("\n")
    const agent = s.agentName||"Your Agent"; const phone = s.agentPhone?` | ${s.agentPhone}`:""
    const sys = "You are a real estate copywriter. Return ONLY a valid JSON object. No markdown. No explanation. No backticks."
    try {
      update({loadingMsg:isSpa?"Escribiendo descripción y email...":"Writing listing & email...",loadingPct:15})
      let lp = s.mode==="new_listing"?`{"listing":"Write a 130-150 word MLS listing description in ${lang}","email_subject":"Write an email subject line under 9 words in ${lang}","email_body":"Write a 120-140 word email in ${lang} signed ${agent}${phone}"}`:s.mode==="rental"?`{"listing":"Write a 130-150 word rental listing description in ${lang}","email_subject":"Write a rental email subject under 9 words in ${lang}","email_body":"Write a 120-140 word email in ${lang} for potential tenants signed ${agent}${phone}"}`:s.mode==="open_house"?`{"listing":"Write a 120-140 word open house announcement in ${lang} for ${s.openHouseDate||"this weekend"} at ${s.openHouseTime||""}","email_subject":"Write an open house subject in ${lang}","email_body":"Write a 110-130 word invite email in ${lang} signed ${agent}${phone}"}`:s.mode==="price_reduction"?`{"listing":"Write a 120-140 word price reduction announcement in ${lang}","email_subject":"Write a price drop subject in ${lang}","email_body":"Write a 110-130 word email in ${lang} signed ${agent}${phone}"}`:s.mode==="sold"?`{"listing":"Write a 100-120 word just sold announcement in ${lang}","email_subject":"Write a just sold subject in ${lang}","email_body":"Write a 100-120 word sold email in ${lang} signed ${agent}${phone}"}`:null
      const r1 = await safeClaude(`PROPERTY:\n${propSummary}\n\nReturn ONLY this JSON (all in ${lang}):\n${lp}`, sys, 1200)
      update({loadingPct:35,loadingMsg:isSpa?"Escribiendo redes sociales...":"Writing social media..."})
      const r2 = await safeClaude(`PROPERTY:\n${propSummary}\n\nReturn ONLY this JSON (all content in ${lang}):\n{"instagram":"Write a 65-80 word Instagram caption with emojis and CTA","facebook":"Write a 70-90 word Facebook caption","twitter":"Write a Twitter post under 220 characters","linkedin":"Write an 80-100 word LinkedIn post"}`, sys, 1200)
      update({loadingPct:55,loadingMsg:isSpa?"Escribiendo anuncios y SMS...":"Writing ads & SMS..."})
      const r3 = await safeClaude(`PROPERTY:\n${propSummary}\n\nWrite the following in ${lang}. Return ONLY valid JSON:\nsms_blast: SMS under 155 characters\nwhatsapp_broadcast: 60-70 word WhatsApp ending with Reply YES for details\ngoogle_ad: Headline max 30 chars | Description max 90 chars, format: Headline: [text] | Description: [text]\nfacebook_ad: Primary max 60 words | Headline max 25 chars | Description max 25 chars, format: Primary: [text] | Headline: [text] | Description: [text]`, sys, 1400)
      update({loadingPct:75,loadingMsg:isSpa?"Escribiendo TikTok y carta...":"Writing TikTok & letter..."})
      const r4 = await safeClaude(`PROPERTY:\n${propSummary}\n\nReturn ONLY this JSON (all in ${lang}):\n{"tiktok_script":"TikTok script with HOOK (3 sec), BODY, 🎬 B-ROLL SHOTS: section with 6-8 shots, CTA. 45-55 seconds.","neighbour_letter":"200-220 word neighbour letter signed ${agent}${phone}"}`, sys, 1200)
      update({loadingPct:90,loadingMsg:isSpa?"Creando calendario...":"Building schedule..."})
      const schedule = isSpa ? [
        {day:"Día 1 — Lanzamiento",icon:"🚀",tasks:["Publicar en MLS y todos los portales","Enviar difusión de WhatsApp","Publicar en Instagram","Enviar SMS masivo","Email a tu lista de compradores","Entregar cartas a vecinos"]},
        {day:"Día 2",icon:"📱",tasks:["Publicar en Facebook","Compartir en LinkedIn","Llamar a quienes respondieron"]},
        {day:"Día 3",icon:"🎯",tasks:["Lanzar anuncios de Facebook e Instagram","Actualizar Twitter","Llamar a leads del email"]},
        {day:"Día 5",icon:"🎬",tasks:["Publicar vídeo de TikTok","Compartir en Instagram Stories"]},
        {day:"Día 7",icon:"📊",tasks:["Revisar rendimiento de anuncios","Reenviar WhatsApp a quien no abrió","Confirmar visitas solicitadas"]},
        {day:"Día 14",icon:"💥",tasks:["Nueva publicación en Instagram","Enviar segundo email","Considerar revisión de precio"]},
        {day:"Día 21",icon:"📣",tasks:["Mensaje de urgencia final por WhatsApp","Último push de anuncios","Publicar actualización si hay oferta"]},
      ] : [
        {day:"Day 1 — Launch",icon:"🚀",tasks:["Post MLS on all portals","Send WhatsApp broadcast","Post Instagram","Send SMS blast","Email your buyer list","Deliver neighbour letters"]},
        {day:"Day 2",icon:"📱",tasks:["Post Facebook caption","Share LinkedIn post","Call back anyone who replied"]},
        {day:"Day 3",icon:"🎯",tasks:["Launch Facebook and Instagram ads","Post Twitter update","Call email leads"]},
        {day:"Day 5",icon:"🎬",tasks:["Post TikTok video","Share Instagram story"]},
        {day:"Day 7",icon:"📊",tasks:["Check ad performance","Re-send WhatsApp to non-openers","Book viewing requests"]},
        {day:"Day 14",icon:"💥",tasks:["Post fresh Instagram update","Send second email","Consider price review"]},
        {day:"Day 21",icon:"📣",tasks:["Send final WhatsApp urgency message","Run last ad push","Post sold update if under offer"]},
      ]
      let r6 = {}
      if (["new_listing","rental","price_reduction"].includes(s.mode)) {
        r6 = await safeClaude(`PROPERTY:\n${propSummary}\nYou are a property renovation expert. All in ${lang}. Return ONLY JSON:\n{"renovations":[{"title":"Renovation name","estimated_cost":"$X,000 - $X,000","roi":"$X,000 - $X,000 added to value","description":"2-3 sentence description","priority":"High / Medium / Low"}]}\nProvide exactly 5 renovations ranked by ROI.${langInstr}`, sys, 1200)
      }
      const result = {...r1,...r2,...r3,...r4,schedule,...r6}
      update({loadingPct:100, result, activeTab:"listing"})
      SF.addListing({address:s.address,city:s.city,mode:s.mode,price:s.price,beds:s.beds,baths:s.baths,tone:s.tone,language:s.language,propType:s.propType,result})
    } catch(err) { update({error:err.message}) }
    update({loading:false})
  }

  const inp = inputStyle

  // ── NAV ──────────────────────────────────────────────────
  const Nav = () => (
    <div style={{background:G.bg1,borderBottom:`1px solid ${G.border}`,padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000"}}>
      <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:G.white}}>STREAM<span style={{color:G.aqua}}>FLUX</span></span>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        {!s.result && <span style={{fontSize:"11px",color:G.muted}}>Step {s.step}/{totalSteps()}</span>}
        <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{isSpa?"← Panel":"← Dashboard"}</button>
      </div>
    </div>
  )

  // ── RESULTS ───────────────────────────────────────────────
  if (s.result) {
    const lang = s.language
    const r = s.result
    return (
      <div style={{minHeight:"100vh",background:G.bg}}><Nav/>
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"0 0 60px"}}>
          <div style={{background:"#ffffff",padding:"18px 20px 14px",borderBottom:"1px solid #e5e5e5",marginBottom:"16px"}}>
            <h2 style={{fontSize:"17px",fontWeight:"800",color:"#060608",marginBottom:"3px"}}>Your Package is Ready</h2>
            <p style={{color:"#555",fontSize:"13px"}}>Everything in {lang}. Tap Copy on any section to use it instantly.</p>
          </div>
          <div style={{padding:"0 16px"}}>
            <div style={{display:"flex",gap:"4px",marginBottom:"20px",flexWrap:"wrap",background:G.bg1,padding:"4px",borderRadius:"10px",border:`1px solid ${G.aquaBorder}`}}>
              {TABS.map(tab=>(
                <button key={tab.id} onClick={()=>update({activeTab:tab.id})}
                  style={{background:s.activeTab===tab.id?G.aquaDim:"#0d0d0d",color:s.activeTab===tab.id?G.aqua:G.muted,border:`1px solid ${s.activeTab===tab.id?G.aqua:G.border}`,borderRadius:"8px",padding:"7px 12px",fontSize:"12px",fontWeight:s.activeTab===tab.id?"700":"400",fontFamily:"inherit",cursor:"pointer"}}>
                  {tab.label}
                </button>
              ))}
            </div>
            {s.activeTab==="listing" && <><CopyCard title={isSpa?"Descripción MLS":"MLS Listing"} content={r.listing} icon="🏠" lang={lang}/><CopyCard title={isSpa?"Asunto del Email":"Email Subject"} content={r.email_subject} icon="📧" lang={lang}/><CopyCard title={isSpa?"Cuerpo del Email":"Email Body"} content={r.email_body} icon="📨" lang={lang}/></>}
            {s.activeTab==="social" && <><CopyCard title="Instagram" content={r.instagram} icon="📸" lang={lang}/><CopyCard title="Facebook" content={r.facebook} icon="👥" lang={lang}/><CopyCard title="Twitter / X" content={r.twitter} icon="⚡" lang={lang}/><CopyCard title="LinkedIn" content={r.linkedin} icon="💼" lang={lang}/></>}
            {s.activeTab==="ads" && <><CopyCard title={isSpa?"Blast SMS":"SMS Blast"} content={r.sms_blast} icon="📱" lang={lang}/><CopyCard title={isSpa?"Difusión WhatsApp":"WhatsApp Broadcast"} content={r.whatsapp_broadcast} icon="💬" lang={lang}/><CopyCard title="Google Ad" content={r.google_ad} icon="🔍" lang={lang}/><CopyCard title={isSpa?"Anuncio Facebook/Instagram":"Facebook/Instagram Ad"} content={r.facebook_ad} icon="🎯" lang={lang}/></>}
            {s.activeTab==="tiktok" && <CopyCard title={isSpa?"Guión TikTok":"TikTok Script"} content={r.tiktok_script} icon="🎬" lang={lang}/>}
            {s.activeTab==="neighbours" && <CopyCard title={isSpa?"Carta a Vecinos":"Neighbour Letter"} content={r.neighbour_letter} icon="✉️" lang={lang}/>}
            {s.activeTab==="schedule" && r.schedule && r.schedule.map((day,i)=>(
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
            {s.activeTab==="renovation" && (
              r.renovations?.length>0 ? <>
                <div style={{background:"#0d0d0d",border:`1px solid ${G.border}`,borderRadius:"10px",padding:"15px 17px",marginBottom:"12px"}}>
                  <p style={{color:G.muted,fontSize:"13px",margin:"0"}}>{isSpa?"Renovaciones recomendadas para maximizar el precio de venta, ordenadas por retorno de inversión.":"Recommended renovations to maximise sale price, ranked by return on investment."}</p>
                </div>
                {r.renovations.map((rv,i)=>(
                  <div key={i} style={{background:"#0d0d0d",border:`1px solid ${G.border}`,borderRadius:"10px",padding:"16px 18px",marginBottom:"10px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px",gap:"10px",flexWrap:"wrap"}}>
                      <div>
                        <div style={{fontSize:"14px",fontWeight:"700",color:G.white,marginBottom:"3px"}}>{i+1}. {rv.title||""}</div>
                        <div style={{fontSize:"12px",color:G.muted}}>{isSpa?"Costo estimado: ":"Est. Cost: "}{rv.estimated_cost||""}</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"}}>
                        <div style={{fontSize:"12px",fontWeight:"700",color:G.aqua}}>+ {rv.roi||""}</div>
                        <span style={{fontSize:"10px",fontWeight:"700",color:"#060608",background:"#fff",border:"1px solid rgba(42,184,212,0.4)",borderRadius:"100px",padding:"2px 10px"}}>{rv.priority||""}</span>
                      </div>
                    </div>
                    <div style={{height:"1px",background:G.border,marginBottom:"10px"}}/>
                    <p style={{color:"rgba(255,255,255,0.75)",fontSize:"13px",lineHeight:"1.75",margin:"0"}}>{rv.description||""}</p>
                  </div>
                ))}
              </> : <div style={{background:"#0d0d0d",border:`1px solid ${G.border}`,borderRadius:"10px",padding:"20px",textAlign:"center"}}><p style={{color:G.muted,fontSize:"13px"}}>{isSpa?"Los consejos de renovación están disponibles para propiedades en venta, alquiler y reducción de precio.":"Renovation tips are available for Sale, Rental, and Price Reduction listings."}</p></div>
            )}
            <button onClick={()=>update({...initState(s.language)})} style={{...btnStyle(false),marginTop:"16px"}}>{isSpa?"← Nueva Propiedad":"← New Listing"}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM ─────────────────────────────────────────────────
  const LR = <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}/>
  return (
    <div style={{minHeight:"100vh",background:G.bg}}><Nav/>
      <div style={{maxWidth:"660px",margin:"0 auto",padding:"28px 18px 60px"}}>
        {/* Progress bar */}
        <div style={{display:"flex",gap:"4px",marginBottom:"24px"}}>
          {Array.from({length:totalSteps()},(_,i)=>(
            <div key={i} style={{flex:"1",height:"2px",background:s.step>i+1?G.aqua:s.step===i+1?"#ffffff":G.border,borderRadius:"2px",transition:"background 0.3s",boxShadow:s.step===i+1?"0 0 8px rgba(255,255,255,0.3)":"none"}}/>
          ))}
        </div>
        <div style={cardStyle}>
          {/* STEP 1 */}
          {s.step===1 && <>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🌐 {isSpa?"Idioma de Salida":"Output Language"}</h2>
            <select value={s.language} onChange={e=>update({language:e.target.value})} style={{...inp,cursor:"pointer",marginBottom:"20px"}}>
              <option value="English">🇺🇸 English</option>
              <option value="Spanish">🇪🇸 Español</option>
            </select>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"4px",color:G.white}}>{isSpa?"🎯 ¿Qué Estás Promocionando?":"🎯 What Are You Marketing?"}</h2>
            <Chips options={MODES} selected={s.mode} onToggle={v=>update({mode:v})} single/>
          </>}

          {/* STEP 2 */}
          {s.step===2 && <>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🏠 {isSpa?"Datos de la Propiedad":"Property Basics"}</h2>
            <Chips label={isSpa?"Tipo de Propiedad":"Property Type"} options={PROP_TYPES} selected={s.propType} onToggle={v=>update({propType:v})} single/>
            <div style={{marginBottom:"16px"}}><label style={labelStyle}>{isSpa?"Dirección Completa":"Full Address"}</label><input type="text" placeholder="123 Ocean Drive, Miami Beach, FL 33139" style={inp} value={s.address} onChange={e=>update({address:e.target.value})}/></div>
            {s.mode==="price_reduction" && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div><label style={labelStyle}>{isSpa?"Nuevo Precio ($)":"New Price ($)"}</label><input type="text" placeholder="895,000" style={inp} value={s.price} onChange={e=>update({price:e.target.value})}/></div>
              <div><label style={labelStyle}>{isSpa?"Precio Original ($)":"Original Price ($)"}</label><input type="text" placeholder="995,000" style={inp} value={s.oldPrice} onChange={e=>update({oldPrice:e.target.value})}/></div>
            </div>}
            {s.mode==="sold" && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div><label style={labelStyle}>{isSpa?"Precio de Lista ($)":"List Price ($)"}</label><input type="text" placeholder="995,000" style={inp} value={s.price} onChange={e=>update({price:e.target.value})}/></div>
              <div><label style={labelStyle}>{isSpa?"Precio de Venta ($)":"Sold Price ($)"}</label><input type="text" placeholder="980,000" style={inp} value={s.soldPrice} onChange={e=>update({soldPrice:e.target.value})}/></div>
            </div>}
            {!["price_reduction","sold"].includes(s.mode) && <div style={{marginBottom:"16px"}}><label style={labelStyle}>{isSpa?"Precio de Venta ($)":"Asking Price ($)"}</label><input type="text" placeholder="1,250,000" style={inp} value={s.price} onChange={e=>update({price:e.target.value})}/></div>}
            {s.mode!=="sold" && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div><label style={labelStyle}>{isSpa?"Habitaciones":"Bedrooms"}</label><input type="number" placeholder="4" style={inp} value={s.beds} onChange={e=>update({beds:e.target.value})}/></div>
              <div><label style={labelStyle}>{isSpa?"Baños":"Bathrooms"}</label><input type="number" placeholder="3" style={inp} value={s.baths} onChange={e=>update({baths:e.target.value})}/></div>
              <div><label style={labelStyle}>{isSpa?"Superficie":"Size (sq ft)"}</label><input type="text" placeholder="2,400" style={inp} value={s.sqft} onChange={e=>update({sqft:e.target.value})}/></div>
              <div><label style={labelStyle}>{isSpa?"Año de Construcción":"Year Built"}</label><input type="text" placeholder="2019" style={inp} value={s.yearBuilt} onChange={e=>update({yearBuilt:e.target.value})}/></div>
            </div>}
            {s.mode==="open_house" && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div><label style={labelStyle}>{isSpa?"Fecha":"Open House Date"}</label><input type="text" placeholder="Saturday, June 14" style={inp} value={s.openHouseDate} onChange={e=>update({openHouseDate:e.target.value})}/></div>
              <div><label style={labelStyle}>{isSpa?"Hora":"Open House Time"}</label><input type="text" placeholder="1:00 PM – 4:00 PM" style={inp} value={s.openHouseTime} onChange={e=>update({openHouseTime:e.target.value})}/></div>
            </div>}
            <Chips label={isSpa?"Estado":"Condition"} options={CONDITIONS} selected={s.condition} onToggle={v=>update({condition:v})} single/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div><label style={labelStyle}>{isSpa?"Tu Nombre":"Agent Name"}</label><input type="text" placeholder={isSpa?"Carlos García":"James Rivera"} style={inp} value={s.agentName} onChange={e=>update({agentName:e.target.value})}/></div>
              <div><label style={labelStyle}>{isSpa?"Tu Teléfono":"Agent Phone"}</label><input type="text" placeholder="+1 305 555 0199" style={inp} value={s.agentPhone} onChange={e=>update({agentPhone:e.target.value})}/></div>
            </div>
          </>}

          {/* STEP 3 */}
          {s.step===3 && <>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>📍 {isSpa?"Ubicación y Vistas":"Location & Views"}</h2>
            <div style={{marginBottom:"16px"}}><label style={labelStyle}>{isSpa?"Ciudad":"City"}</label><input type="text" placeholder="Miami, Dubai, London..." style={inp} value={s.city} onChange={e=>update({city:e.target.value})}/></div>
            <div style={{marginBottom:"16px"}}><label style={labelStyle}>{isSpa?"Barrio / Zona":"Neighbourhood"}</label><input type="text" placeholder="South Beach, Beverly Hills..." style={inp} value={s.neighbourhood} onChange={e=>update({neighbourhood:e.target.value})}/></div>
            <Chips label={isSpa?"Características de Ubicación":"Location Features"} options={isSpa?["Primera Línea de Playa","Acceso a la Playa","Frente al Mar","Vistas al Mar","Frente al Lago","Vistas al Lago","Vistas a la Montaña","Vistas al Campo de Golf","Comunidad de Golf","Vistas a la Ciudad","Centro Ciudad","Puerto Deportivo","Urbanización Privada","Cul-de-Sac","Calle Tranquila","Colegios de Primera","Parques y Zonas Verdes","Transporte Público","Aeropuerto Cercano"]:["Beachfront","Beach Access","Oceanfront","Ocean View","Lakefront","Lake View","Mountain View","Golf Course View","Golf Course Community","City View","City Center","Marina / Boat Dock","Gated Community","Cul-de-Sac","Quiet Street","Top-Rated Schools","Parks & Green Space","Transport Links","Airport Nearby"]} selected={s.locationFeatures} onToggle={v=>update({locationFeatures:tog(s.locationFeatures,v)})}/>
            <div style={{marginBottom:"16px"}}><label style={labelStyle}>{isSpa?"Transporte y Acceso":"Commute & Transport"}</label><input type="text" placeholder="2 blocks to metro, 20 min to downtown" style={inp} value={s.commute} onChange={e=>update({commute:e.target.value})}/></div>
          </>}

          {/* STEP 4 */}
          {s.step===4 && s.mode!=="sold" && <>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🛋️ {isSpa?"Características de la Propiedad":"Property Features"}</h2>
            <Chips label={isSpa?"Características Interiores":"Interior Features"} options={isSpa?["Planta Abierta","Techos Altos","Doble Altura","Suelos de Madera","Suelos de Mármol","Suelos Radiantes","Cocina Moderna","Cocina de Chef","Encimera de Granito","Encimera de Cuarzo","Isla de Cocina","Electrodomésticos de Alta Gama","Frigorífico de Vino","Suite Principal","Vestidor","Baños en Suite","Bañera Exenta","Ducha de Lluvia","Sauna","Baño de Vapor","Oficina en Casa","Sala de Cine","Sala de Juegos","Sala de Fitness Interior","Chimenea","Bar Húmedo","Bodega Climatizada","Lavandería","Sótano Terminado","Casa Domótica","Iluminación Inteligente","Termostato Inteligente","Cámaras de Vigilancia","Alarma de Seguridad","Paneles Solares","Calefacción por Suelo Radiante","Aire Acondicionado por Zona","Ascensor Interior"]:["Open Plan Living","High Ceilings","Double Height Ceilings","Hardwood Floors","Marble Floors","Radiant Floor Heating","Modern Kitchen","Chef's Kitchen","Granite Countertops","Quartz Countertops","Kitchen Island","High-End Appliances","Wine Refrigerator","Master Suite","Walk-in Wardrobe","En-suite Bathrooms","Freestanding Soaking Tub","Rainfall Shower","Sauna","Steam Room","Home Office","Media Room / Cinema","Game Room","Indoor Gym","Fireplace","Wet Bar","Climate-Controlled Wine Cellar","Laundry Room","Finished Basement","Smart Home System","Smart Lighting","Smart Thermostat","Surveillance Cameras","Security Alarm System","Solar Panels","Underfloor Heating","Multi-Zone A/C","Private Elevator"]} selected={s.interior} onToggle={v=>update({interior:tog(s.interior,v)})}/>
            <Chips label={isSpa?"Características Exteriores":"Outdoor Features"} options={isSpa?["Piscina Privada","Piscina Climatizada","Piscina Infinita","Jacuzzi / Spa Exterior","Ducha Exterior","Terraza en Azotea","Terraza con Vistas","Terraza Cubierta","Patio Trasero","Jardín Privado","Jardín Paisajístico","Cocina Exterior Completa","Barbacoa Integrada","Horno de Leña","Hoguera Exterior","Barra de Bar Exterior","Muelle Privado","Acceso Privado a la Playa","Acceso Privado al Mar","Pista de Tenis","Pista de Pádel","Casa de Invitados","Casita de Piscina","Garaje (2 Coches)","Garaje (3+ Coches)","Cargador Eléctrico","Entrada con Verja","Verja Automática","Iluminación Paisajística","Huerto / Jardín Ecológico"]:["Private Pool","Heated Pool","Infinity Pool","Hot Tub / Outdoor Spa","Outdoor Shower","Rooftop Terrace","Terrace with Views","Covered Patio / Pergola","Rear Patio","Private Garden","Landscaped Yard","Full Outdoor Kitchen","Built-in BBQ / Grill","Wood-Fired Pizza Oven","Fire Pit / Outdoor Fireplace","Outdoor Bar","Private Boat Dock","Private Beach Access","Private Ocean Access","Tennis Court","Padel Court","Guest House / Casita","Pool House","Garage (2 Car)","Garage (3+ Car)","EV Charging Station","Gated Entry","Automatic Gate","Landscape Lighting","Vegetable Garden / Orchard"]} selected={s.outdoor} onToggle={v=>update({outdoor:tog(s.outdoor,v)})}/>
            <Chips label={isSpa?"Servicios del Edificio":"Building Amenities"} options={isSpa?["Servicio de Conserjería 24/7","Portero","Valet Parking","Seguridad 24/7","Control de Acceso","Piscina en Azotea","Piscina Cubierta","Piscina Exterior Comunitaria","Zona de Jacuzzi","Solarium","Gimnasio Completo","Sala de Yoga","Sala de Pilates","Spa Completo","Sauna Compartida","Coworking","Sala de Reuniones","Cine Comunitario","Sala de Fiestas","Terraza Comunitaria","Área de Juegos Infantiles","Parque Canino","Admite Mascotas","Servicio de Limpieza","Almacenamiento Privado","Cuota Comunidad Baja","Sin Cuota de Comunidad","Parking Cubierto","Cargadores Eléctricos en Parking","Certificación LEED","Ascensor de Gran Capacidad"]:["24/7 Concierge Service","Doorman","Valet Parking","24/7 Security","Access Control System","Rooftop Pool","Indoor Pool","Outdoor Community Pool","Jacuzzi / Hot Tub Area","Sundeck / Solarium","Full Fitness Center","Yoga Studio","Pilates Studio","Full-Service Spa","Shared Sauna","Co-working Space","Meeting Rooms","Community Cinema","Party / Event Room","Community Rooftop Terrace","Children's Play Area","Dog Park","Pet-Friendly","Housekeeping Service","Private Storage Unit","Low HOA Fees","No HOA","Covered Parking","EV Charging in Parking","LEED Certified","High-Capacity Elevator"]} selected={s.building} onToggle={v=>update({building:tog(s.building,v)})}/>
          </>}

          {/* STEP 5 */}
          {s.step===5 && s.mode!=="sold" && s.mode!=="open_house" && <>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>⭐ {isSpa?"Detalles Destacados":"Standout Details"}</h2>
            <div style={{marginBottom:"16px"}}>
              <label style={labelStyle}>{isSpa?"La Característica Más Especial":"The #1 Unique Feature"}</label>
              <p style={{fontSize:"12px",color:"#444",margin:"0 0 5px",fontStyle:"italic"}}>{isSpa?"Sé específico y descriptivo":"Be vivid and specific"}</p>
              <textarea placeholder={isSpa?"ej. Un muelle privado de 12 metros con acceso directo al océano y vistas al atardecer":"e.g. A 40-foot private boat dock with direct ocean access and unobstructed sunset views"} rows={3} style={{...inp,resize:"vertical"}} value={s.uniqueFeature} onChange={e=>update({uniqueFeature:e.target.value})}/>
            </div>
            <div style={{marginBottom:"16px"}}>
              <label style={labelStyle}>{isSpa?"Notas Adicionales":"Additional Notes"}</label>
              <textarea placeholder={isSpa?"ej. Historia única, motivación del vendedor, detalles especiales...":"e.g. Unique story, special details, anything else to weave into every piece of content..."} rows={3} style={{...inp,resize:"vertical"}} value={s.agentNote} onChange={e=>update({agentNote:e.target.value})}/>
            </div>
          </>}

          {/* FINAL STEP — Tone */}
          {(s.step===totalSteps()||(s.step===4&&s.mode==="sold")||(s.step===5&&s.mode==="open_house")) && <>
            <h2 style={{fontSize:"17px",fontWeight:"700",marginBottom:"16px",color:G.white}}>🎯 {isSpa?"Tono y Comprador Objetivo":"Tone & Target Buyer"}</h2>
            <Chips label={isSpa?"Tono de Escritura":"Writing Tone"} options={TONES} selected={s.tone} onToggle={v=>update({tone:v})} single/>
            <div style={{marginBottom:"16px"}}>
              <label style={labelStyle}>{isSpa?"Comprador Ideal":"Ideal Buyer"}</label>
              <p style={{fontSize:"12px",color:"#444",margin:"0 0 5px",fontStyle:"italic"}}>{isSpa?"Más específico = mejor contenido":"More specific = better content"}</p>
              <input type="text" placeholder={isSpa?"Familias con alto patrimonio, inversores...":"High-net-worth families, crypto investors..."} style={inp} value={s.targetBuyer} onChange={e=>update({targetBuyer:e.target.value})}/>
            </div>
          </>}

          {s.error && <div style={{background:"#1a0808",border:"1px solid #3a1010",borderRadius:"8px",padding:"10px 14px",color:"#f87171",fontSize:"13px",marginTop:"14px"}}>⚠ {s.error}</div>}
        </div>

        {/* Loading bar */}
        {s.loading && (
          <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:"10px",padding:"16px 20px",marginBottom:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
              <p style={{color:G.aqua,fontSize:"13px",margin:"0",fontWeight:"600"}}>{s.loadingMsg}</p>
              <span style={{color:G.muted,fontSize:"12px"}}>{s.loadingPct}%</span>
            </div>
            <div style={{width:"100%",height:"4px",background:G.border,borderRadius:"2px"}}>
              <div style={{width:`${s.loadingPct}%`,height:"100%",background:G.aqua,borderRadius:"2px",transition:"width 0.5s ease"}}/>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <button onClick={()=>{update({error:""});if(s.step>1)update({step:s.step-1});else setScreen({screen:"dashboard"})}}
            style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"10px",padding:"14px 22px",fontSize:"14px",fontFamily:"inherit",cursor:"pointer"}}>
            {isSpa?"← Atrás":"← Back"}
          </button>
          {s.step < totalSteps() ? (
            <button onClick={()=>{if(canProceed()){update({error:"",step:s.step+1})}else update({error:isSpa?"Completa los campos obligatorios para continuar.":"Fill in required fields to continue."})}}
              style={btnStyle(!canProceed())}>
              {isSpa?"Continuar →":"Continue →"}
            </button>
          ) : (
            <button onClick={()=>{if(canProceed()&&!s.loading)generate()}}
              style={{...btnStyle(!canProceed()||s.loading),minWidth:"200px"}}>
              {s.loading?(isSpa?"Generando...":"Generating..."):(isSpa?"✦ Generar Paquete Completo":"✦ Generate Full Package")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
