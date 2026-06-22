import { useState } from 'react'
import { G, SF, apiClaude, inputStyle, cardStyle, labelStyle, btnStyle } from '../globals.js'
import { Chips } from '../components/shared/Chips.jsx'

const TONES_EN = [{value:"warm",label:"Warm & Personal"},{value:"professional",label:"Professional"},{value:"luxury",label:"Luxury & Exclusive"}]
const TONES_ES = [{value:"warm",label:"Cálido y Personal"},{value:"professional",label:"Profesional"},{value:"luxury",label:"Lujo y Exclusivo"}]

export default function App3({ state: appState, setScreen }) {
  // If we arrived here from the Dashboard "Open" on a saved newsletter, preload it.
  const reopened = appState.savedResult && appState.savedResult.result && appState.savedResult.newsletter ? appState.savedResult : null

  const [s, setS] = useState({
    language: (reopened?.language) || appState.lang || "English",
    agentName: reopened?.agentName || "", agentPhone: reopened?.agentPhone || "", agentEmail: reopened?.agentEmail || "",
    city: reopened?.city || "", neighbourhood: reopened?.neighbourhood || "",
    featuredAddress:"", featuredPrice:"", featuredBeds:"", featuredBaths:"", featuredHighlight:"",
    marketUpdate:"", personalNote:"", homeownerTip:"",
    tone:"professional", loading:false, result: reopened?.result || null, error:""
  })
  const update = (u) => setS(prev=>({...prev,...u}))
  const isSpa = s.language === "Spanish"
  const TONES = isSpa ? TONES_ES : TONES_EN

  const generate = async () => {
    update({loading:true, error:"", result:null})
    const langInstr = isSpa ? "\n\nCRÍTICO: Escribe TODO el contenido completamente en español." : ""
    const sys = "You are an elite real estate content writer. Return ONLY a valid JSON object. No markdown. No explanation."
    const details = `Agent: ${s.agentName||"Agent"} | City: ${s.city} | Neighbourhood: ${s.neighbourhood||"local area"} | Featured: ${s.featuredAddress||"listing"} at $${s.featuredPrice||""} | Beds: ${s.featuredBeds||""} | Baths: ${s.featuredBaths||""} | Highlight: ${s.featuredHighlight||""} | Market note: ${s.marketUpdate||""} | Personal: ${s.personalNote||""} | Homeowner tip: ${s.homeownerTip||""} | Tone: ${s.tone}`
    try {
      const r = await apiClaude(`${details}\n\nAll in ${isSpa?"Spanish":"English"}. Return ONLY JSON:\n{"subject_line":"Email subject line under 10 words","greeting":"Warm opening 2-3 sentences personalised to city and season","market_update":"60-80 word local market update. Trends, what buyers and sellers should know.","featured_listing":"50-70 word featured property highlight. Exciting and specific.","homeowner_tip":"40-60 word practical homeowner tip for this month.","personal_note":"30-40 word warm personal note from the agent.","cta":"Strong CTA asking them to reply or call for a free market valuation."}${langInstr}`, sys, 1400)
      update({result:r})
      // Save the newsletter so it shows in the Dashboard "Recent Packages Generated" list and can be reopened.
      SF.addNewsletter({
        newsletter:true,
        language:s.language,
        agentName:s.agentName, agentPhone:s.agentPhone, agentEmail:s.agentEmail,
        city:s.city, neighbourhood:s.neighbourhood,
        subject:r.subject_line||"",
        result:r,
      })
    } catch(err) { update({error:err.message}) }
    update({loading:false})
  }

  const inp = {width:"100%",background:"#f0f0f2",border:`1px solid ${G.border2}`,borderRadius:"8px",color:"rgba(0,0,0,0.75)",fontSize:"14px",padding:"11px 14px",outline:"none",fontFamily:"inherit",WebkitTextFillColor:"rgba(0,0,0,0.7)"}

  // Nav
  const Nav = () => (
    <div style={{background:G.card,borderBottom:`1px solid ${G.border}`,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontSize:"16px",fontWeight:"700",letterSpacing:"2px",color:G.white}}>STREAM<span style={{color:G.aqua}}>FLUX</span></span>
      <button onClick={()=>setScreen({screen:"dashboard",savedResult:null})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{isSpa?"← Panel":"← Dashboard"}</button>
    </div>
  )

  if (s.loading) return (
    <div style={{minHeight:"100vh",background:G.bg}}><Nav/>
      <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div style={{fontSize:"18px",fontWeight:"700",color:G.white,marginBottom:"8px"}}>{isSpa?"Generando tu Newsletter...":"Generating Your Newsletter..."}</div>
        <p style={{color:G.muted,fontSize:"13px"}}>{isSpa?`Escribiendo contenido para ${s.city}...`:`Writing personalised content for ${s.city}...`}</p>
      </div>
    </div>
  )

  if (s.result) {
    const r = s.result
    const sections = [
      [isSpa?"📊 Actualización del Mercado":"📊 Market Update", r.market_update, "#2AB8D4"],
      [isSpa?"🏠 Propiedad Destacada":"🏠 Featured Property", r.featured_listing, "#C9963A"],
      [isSpa?"💡 Consejo del Mes":"💡 Tip of the Month", r.homeowner_tip, "#22c55e"],
    ]
    const copyAll = () => {
      const full = `Subject: ${r.subject_line}\n\n${r.greeting}\n\n📊 ${isSpa?"ACTUALIZACIÓN DEL MERCADO":"MARKET UPDATE"}\n${r.market_update}\n\n🏠 ${isSpa?"PROPIEDAD DESTACADA":"FEATURED PROPERTY"}\n${r.featured_listing}\n\n💡 ${isSpa?"CONSEJO DEL MES":"TIP OF THE MONTH"}\n${r.homeowner_tip}\n\n${r.personal_note}\n\n${r.cta}\n\n${s.agentName||""}${s.agentPhone?" | "+s.agentPhone:""}${s.agentEmail?" | "+s.agentEmail:""}`
      navigator.clipboard.writeText(full)
    }
    return (
      <div style={{minHeight:"100vh",background:G.bg}}><Nav/>
        <div style={{maxWidth:"700px",margin:"0 auto",padding:"28px 20px 80px"}}>
          <div style={{marginBottom:"20px"}}>
            <h2 style={{fontSize:"18px",fontWeight:"700",color:G.white,marginBottom:"4px"}}>{isSpa?"Tu Newsletter Mensual":"Your Monthly Newsletter"}</h2>
            <p style={{color:G.muted,fontSize:"13px"}}>{s.city}{s.neighbourhood?`, ${s.neighbourhood}`:""} · {s.language}</p>
          </div>
          {/* Preview */}
          <div style={{background:"#fff",borderRadius:"12px",overflow:"hidden",marginBottom:"16px",boxShadow:"0 4px 40px rgba(0,0,0,0.5)"}}>
            <div style={{background:"#060608",padding:"18px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:"16px",fontWeight:"800",letterSpacing:"4px",color:"#fff"}}>STREAM<span style={{color:"#2AB8D4"}}>FLUX</span></div>
              <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)"}}>{isSpa?"Newsletter Mensual":"Monthly Newsletter"}</div>
            </div>
            <div style={{padding:"28px"}}>
              <h2 style={{fontSize:"20px",fontWeight:"800",color:"#060608",marginBottom:"16px",fontFamily:"inherit"}}>{r.subject_line||"Monthly Market Update"}</h2>
              <p style={{fontSize:"14px",color:"#444",lineHeight:"1.8",marginBottom:"20px"}}>{r.greeting||""}</p>
              <div style={{height:"3px",background:"linear-gradient(90deg,#2AB8D4,transparent)",marginBottom:"20px",borderRadius:"2px"}}/>
              {sections.map(([title,content,color])=>(
                <div key={title} style={{background:"#f8f8f8",borderRadius:"8px",padding:"16px",marginBottom:"14px",borderLeft:`3px solid ${color}`}}>
                  <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color,marginBottom:"6px"}}>{title}</div>
                  <p style={{fontSize:"13px",color:"#333",lineHeight:"1.75",margin:"0"}}>{content||""}</p>
                </div>
              ))}
              <p style={{fontSize:"13px",color:"#555",lineHeight:"1.7",marginBottom:"14px"}}>{r.personal_note||""}</p>
              <div style={{background:"#060608",borderRadius:"8px",padding:"16px",textAlign:"center",marginBottom:"16px"}}>
                <p style={{fontSize:"13px",color:"#fff",lineHeight:"1.7",margin:"0"}}>{r.cta||""}</p>
              </div>
              <div style={{borderTop:"1px solid #eee",paddingTop:"14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
                <div style={{fontSize:"12px",color:"#888"}}>{s.agentName||""}{s.agentPhone?` · ${s.agentPhone}`:""}{s.agentEmail?` · ${s.agentEmail}`:""}</div>
                <div style={{fontSize:"11px",color:"#bbb"}}>streamflux.app</div>
              </div>
            </div>
          </div>
          <button onClick={copyAll} style={{...btnStyle(false,"#22c55e"),width:"100%",marginBottom:"10px"}}>{isSpa?"📋 Copiar Newsletter Completo":"📋 Copy Full Newsletter"}</button>
          <button onClick={()=>{ setScreen({savedResult:null}); update({result:null}) }} style={{...btnStyle(false),background:"transparent",color:G.muted,border:`1px solid ${G.border}`,width:"100%"}}>{isSpa?"← Nuevo Newsletter":"← New Newsletter"}</button>
        </div>
      </div>
    )
  }

  // Form
  const LabelRow = ({label}) => <label style={labelStyle}>{label}</label>
  return (
    <div style={{minHeight:"100vh",background:G.bg}}><Nav/>
      <div style={{maxWidth:"640px",margin:"0 auto",padding:"28px 20px 80px"}}>
        <div style={{marginBottom:"20px"}}>
          <h2 style={{fontSize:"19px",fontWeight:"700",color:G.white}}>{isSpa?"Generador de Newsletter":"Newsletter Generator"}</h2>
          <p style={{color:G.muted,fontSize:"13px",marginTop:"4px"}}>{isSpa?"Newsletter mensual listo para enviar a toda tu base de datos.":"Monthly newsletter ready to send to your entire client database."}</p>
        </div>

        {/* Language */}
        <div style={cardStyle}>
          <LabelRow label={isSpa?"Idioma":"Language"}/>
          <select value={s.language} onChange={e=>update({language:e.target.value})} style={{...inp,cursor:"pointer"}}>
            <option value="English">🇺🇸 English</option>
            <option value="Spanish">🇪🇸 Español</option>
          </select>
        </div>

        {/* Agent details */}
        <div style={cardStyle}>
          <h3 style={{fontSize:"13px",fontWeight:"700",color:G.aqua,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"14px"}}>{isSpa?"TUS DATOS":"YOUR DETAILS"}</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
            <div><LabelRow label={isSpa?"Tu Nombre":"Your Name"}/><input type="text" placeholder={isSpa?"Carlos García":"James Rivera"} style={inp} value={s.agentName} onChange={e=>update({agentName:e.target.value})}/></div>
            <div><LabelRow label={isSpa?"Tu Teléfono":"Your Phone"}/><input type="text" placeholder="+1 305 555 0199" style={inp} value={s.agentPhone} onChange={e=>update({agentPhone:e.target.value})}/></div>
          </div>
          <div style={{marginBottom:"12px"}}><LabelRow label={isSpa?"Tu Email":"Your Email"}/><input type="text" placeholder="james@agency.com" style={inp} value={s.agentEmail} onChange={e=>update({agentEmail:e.target.value})}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <div><LabelRow label={isSpa?"Ciudad":"City"}/><input type="text" placeholder="Miami, Los Angeles..." style={inp} value={s.city} onChange={e=>update({city:e.target.value})}/></div>
            <div><LabelRow label={isSpa?"Barrio / Zona":"Neighbourhood"}/><input type="text" placeholder="South Beach, Beverly Hills..." style={inp} value={s.neighbourhood} onChange={e=>update({neighbourhood:e.target.value})}/></div>
          </div>
        </div>

        {/* Featured listing */}
        <div style={cardStyle}>
          <h3 style={{fontSize:"13px",fontWeight:"700",color:G.aqua,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"14px"}}>{isSpa?"PROPIEDAD DESTACADA":"FEATURED LISTING"}</h3>
          <div style={{marginBottom:"12px"}}><LabelRow label={isSpa?"Dirección":"Address"}/><input type="text" placeholder="42 Palm Drive, Miami Beach" style={inp} value={s.featuredAddress} onChange={e=>update({featuredAddress:e.target.value})}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"12px"}}>
            {[["featuredPrice",isSpa?"Precio ($)":"Price ($)","1,200,000"],["featuredBeds",isSpa?"Hab.":"Beds","4"],["featuredBaths",isSpa?"Baños":"Baths","3"]].map(([key,lbl,ph])=>(
              <div key={key}><LabelRow label={lbl}/><input type="text" placeholder={ph} style={inp} value={s[key]||""} onChange={e=>update({[key]:e.target.value})}/></div>
            ))}
          </div>
          <div><LabelRow label={isSpa?"Punto Más Destacado":"Key Highlight"}/><textarea placeholder={isSpa?"ej. Vistas al mar, reformada en 2024, piscina privada...":"e.g. Ocean views, renovated 2024, private pool..."} rows={2} style={{...inp,resize:"vertical"}} value={s.featuredHighlight} onChange={e=>update({featuredHighlight:e.target.value})}/></div>
        </div>

        {/* Content */}
        <div style={cardStyle}>
          <h3 style={{fontSize:"13px",fontWeight:"700",color:G.aqua,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"14px"}}>{isSpa?"CONTENIDO (OPCIONAL — LA IA LO ESCRIBE SI LO DEJAS VACÍO)":"CONTENT (OPTIONAL — AI WRITES IT IF LEFT BLANK)"}</h3>
          {[["marketUpdate",isSpa?"Actualización del Mercado":"Market Update",isSpa?"ej. Los precios subieron 3% este mes...":"e.g. Prices up 3% this month, demand still strong..."],["personalNote",isSpa?"Nota Personal":"Personal Note",isSpa?"ej. Acabo de cerrar 3 ventas este mes...":"e.g. Thrilled to share we closed 3 deals this month..."],["homeownerTip",isSpa?"Consejo para el Propietario":"Homeowner Tip",isSpa?"ej. Con el verano llegando, es buen momento para revisar el aire acondicionado...":"e.g. With summer coming, great time to service your AC..."]].map(([key,lbl,ph])=>(
            <div key={key} style={{marginBottom:"12px"}}><LabelRow label={lbl}/><textarea placeholder={ph} rows={2} style={{...inp,resize:"vertical"}} value={s[key]||""} onChange={e=>update({[key]:e.target.value})}/></div>
          ))}
          <Chips label={isSpa?"Tono":"Tone"} options={TONES} selected={s.tone} onToggle={v=>update({tone:v})} single/>
        </div>

        {s.error && <div style={{background:"#fff0f0",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"8px",padding:"10px 14px",color:"#dc2626",fontSize:"13px",marginBottom:"14px"}}>⚠ {s.error}</div>}

        <button onClick={()=>{if(s.agentName&&s.city)generate()}} style={{...btnStyle(!(s.agentName&&s.city),"#22c55e"),width:"100%",fontSize:"15px"}}>
          {isSpa?"✦ Generar Newsletter":"✦ Generate Newsletter"}
        </button>
      </div>
    </div>
  )
}
