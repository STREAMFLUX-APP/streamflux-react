import { useState } from 'react'
import { G, SF, apiClaude, followUpStatus, STATUS_META } from '../globals.js'
import { CopyCard } from '../components/shared/CopyCard.jsx'

const APP1_TABS = [{id:"listing",label:"🏠 Listing"},{id:"social",label:"📱 Social"},{id:"ads",label:"🎯 Ads & SMS"},{id:"tiktok",label:"🎬 TikTok"},{id:"neighbours",label:"✉️ Neighbours"},{id:"schedule",label:"📅 Schedule"}]
const APP2_TABS = [{id:"messages",label:"Messages"},{id:"email",label:"Email"},{id:"voice",label:"Voice"}]
const SYSTEM = "You are an elite real estate sales coach. Respond with ONLY a raw valid JSON object. Start with { end with }. No markdown. No backticks. No explanation."
const inp = {width:"100%",background:"#060608",border:"1px solid #252530",borderRadius:"8px",color:"rgba(255,255,255,0.65)",fontSize:"14px",padding:"11px 14px",outline:"none",fontFamily:"inherit",boxSizing:"border-box",WebkitTextFillColor:"rgba(255,255,255,0.55)"}

export default function SavedResults({ state, setScreen, app }) {
  const saved = state.savedResult || {}
  const isApp1 = app === "app1"
  const isSpa = state.lang === "Spanish"
  const lang = state.lang || "English"

  const [result, setResult] = useState(saved?.result || {})
  const [activeTab, setActiveTab] = useState(isApp1?"listing":"messages")
  const [fuSubTab, setFuSubTab] = useState("noreply")
  const [regenContext, setRegenContext] = useState("")
  const [regenLoading, setRegenLoading] = useState(false)
  const [fuStatus, setFuStatus] = useState(followUpStatus(saved))
  const [err, setErr] = useState("")

  const tabs = isApp1 ? APP1_TABS : APP2_TABS
  const r = result
  const isObj = !!(r.v1_whatsapp)

  const persist = (updates) => { if(saved.id) SF.updateClient(saved.id, updates) }

  // Title shown in the premium header
  const headerTitle = isApp1
    ? (saved.address||(saved.city?(isSpa?"Propiedad en ":"Property in ")+saved.city:(isSpa?"Propiedad":"Property")))
    : (saved.clientName||"Client")
  const headerSubParts = isApp1
    ? [saved.mode, saved.propType, saved.price?("$"+saved.price):"", saved.savedAt].filter(Boolean)
    : [(saved.contactReason||"").replace(/_/g," "), saved.savedAt].filter(Boolean)
  const initial = (headerTitle||"?").trim().charAt(0).toUpperCase()

  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      <div style={{background:G.card,borderBottom:`1px solid ${G.border}`,padding:"14px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:"15px",fontWeight:"700",color:G.white}}>📋 {isSpa?"Resultados Guardados":"Saved Results"}</span>
        <button onClick={()=>setScreen({screen:"dashboard",savedResult:null})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{isSpa?"← Panel Principal":"← Dashboard"}</button>
      </div>

      <div style={{maxWidth:"720px",margin:"0 auto",padding:"22px 16px 60px"}}>
        {/* ===== Premium header ===== */}
        <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#0d0d11 0%,#0a0a0e 60%,#0c1417 100%)",border:"1px solid #1c1c24",borderRadius:"16px",padding:"22px",marginBottom:"20px",display:"flex",alignItems:"center",gap:"16px"}}>
          <div style={{position:"absolute",top:"-40px",right:"-30px",width:"160px",height:"160px",borderRadius:"50%",background:"radial-gradient(circle,rgba(42,184,212,0.14),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{flexShrink:"0",width:"54px",height:"54px",borderRadius:"14px",background:"linear-gradient(135deg,#2AB8D4,#1c8aa3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",fontWeight:"800",color:"#060608",boxShadow:"0 6px 18px rgba(42,184,212,0.3)"}}>{initial}</div>
          <div style={{minWidth:"0",flex:"1"}}>
            <h1 style={{fontSize:"22px",fontWeight:"800",color:G.white,margin:"0 0 4px",letterSpacing:"-0.01em",lineHeight:"1.2",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{headerTitle}</h1>
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
              {headerSubParts.map((p,i)=>(
                <span key={i} style={{display:"inline-flex",alignItems:"center",gap:"8px"}}>
                  {i>0&&<span style={{width:"3px",height:"3px",borderRadius:"50%",background:"rgba(255,255,255,0.3)"}}/>}
                  <span style={{fontSize:"12px",color:"rgba(255,255,255,0.55)",fontFamily:"DM Mono,monospace",textTransform:"capitalize"}}>{p}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:"6px",marginBottom:"14px",flexWrap:"wrap"}}>
          {tabs.map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              style={{background:activeTab===tab.id?G.aqua:"#0d0d0d",color:activeTab===tab.id?"#060608":G.muted,border:`1px solid ${activeTab===tab.id?G.aqua:G.border}`,borderRadius:"8px",padding:"7px 12px",fontSize:"12px",fontWeight:activeTab===tab.id?"700":"400",fontFamily:"inherit",cursor:"pointer"}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== APP 1 (unchanged) ===== */}
        {isApp1 && <>
          {activeTab==="listing" && <><CopyCard title={isSpa?"Descripción MLS":"MLS Listing"} content={result.listing} icon="🏠" lang={lang}/><CopyCard title={isSpa?"Asunto del Email":"Email Subject"} content={result.email_subject} icon="📧" lang={lang}/><CopyCard title={isSpa?"Cuerpo del Email":"Email Body"} content={result.email_body} icon="📨" lang={lang}/></>}
          {activeTab==="social" && <><CopyCard title="Instagram" content={result.instagram} icon="📸" lang={lang}/><CopyCard title="Facebook" content={result.facebook} icon="👥" lang={lang}/><CopyCard title="Twitter / X" content={result.twitter} icon="⚡" lang={lang}/><CopyCard title="LinkedIn" content={result.linkedin} icon="💼" lang={lang}/></>}
          {activeTab==="ads" && <><CopyCard title={isSpa?"Blast SMS":"SMS Blast"} content={result.sms_blast} icon="📱" lang={lang}/><CopyCard title={isSpa?"Difusión WhatsApp":"WhatsApp Broadcast"} content={result.whatsapp_broadcast} icon="💬" lang={lang}/><CopyCard title="Google Ad" content={result.google_ad} icon="🔍" lang={lang}/><CopyCard title={isSpa?"Anuncio Facebook":"Facebook/Instagram Ad"} content={result.facebook_ad} icon="🎯" lang={lang}/></>}
          {activeTab==="tiktok" && <CopyCard title={isSpa?"Guión TikTok":"TikTok Script"} content={result.tiktok_script} icon="🎬" lang={lang}/>}
          {activeTab==="neighbours" && <CopyCard title={isSpa?"Carta a Vecinos":"Neighbour Letter"} content={result.neighbour_letter} icon="✉️" lang={lang}/>}
          {activeTab==="schedule" && result.schedule && (
            <>{result.schedule.map((d,i)=>(
              <div key={i} style={{background:"#0d0d0d",border:`1px solid ${G.border}`,borderRadius:"8px",padding:"14px 16px",marginBottom:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",fontWeight:"700",color:G.white,fontSize:"14px"}}><span>{d.icon}</span><span>{d.day}</span></div>
                <ul style={{paddingLeft:"18px",margin:"0"}}>{(d.tasks||[]).map((t,j)=><li key={j} style={{color:"#ccc",fontSize:"14px",lineHeight:"1.7",marginBottom:"4px"}}>{t}</li>)}</ul>
              </div>
            ))}</>
          )}
        </>}

        {/* ===== APP 2 (Messages / Email / Voice only) ===== */}
        {!isApp1 && <>
          {activeTab==="messages" && (isObj?(
            <>
              {["v1","v2","v3"].map(v=>(
                r[v+"_whatsapp"]&&<div key={v} style={{background:"#0c0c10",border:"1px solid rgba(42,184,212,0.35)",borderRadius:"12px",padding:"18px",marginBottom:"16px"}}>
                  <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"#ffffff",marginBottom:"12px"}}>APPROACH {v.slice(1)} — {r[v+"_label"]||""}</div>
                  <CopyCard title="WhatsApp" content={r[v+"_whatsapp"]||""} icon="" lang={lang}/>
                  <CopyCard title="SMS" content={r[v+"_sms"]||""} icon="" lang={lang}/>
                </div>
              ))}
            </>
          ):(
            <><CopyCard title="WhatsApp" content={r.whatsapp} icon="" lang={lang}/><CopyCard title="SMS" content={r.sms} icon="" lang={lang}/></>
          ))}

          {activeTab==="email" && (isObj?(
            <>
              {["v1","v2","v3"].map(v=>(
                r[v+"_email"]&&<div key={v} style={{background:"#0c0c10",border:"1px solid rgba(42,184,212,0.35)",borderRadius:"12px",padding:"18px",marginBottom:"16px"}}>
                  <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"#ffffff",marginBottom:"12px"}}>APPROACH {v.slice(1)} — {r[v+"_label"]||""}</div>
                  <CopyCard title="Email Subject" content={r[v+"_email_subject"]||""} icon="" lang={lang}/>
                  <CopyCard title="Email Body" content={r[v+"_email"]||""} icon="" lang={lang}/>
                </div>
              ))}
            </>
          ):(
            <><CopyCard title="Email Subject" content={r.email_subject} icon="" lang={lang}/><CopyCard title="Email Body" content={r.email_body} icon="" lang={lang}/></>
          ))}

          {activeTab==="voice" && (isObj?(
            <>
              {["v1","v2","v3"].map(v=>(
                r[v+"_voice"]&&<div key={v} style={{background:"#0c0c10",border:"1px solid rgba(42,184,212,0.35)",borderRadius:"12px",padding:"18px",marginBottom:"16px"}}>
                  <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",color:"#ffffff",marginBottom:"12px"}}>APPROACH {v.slice(1)} — {r[v+"_label"]||""}</div>
                  <CopyCard title="Phone Call Script" content={r[v+"_voice"]||""} icon="" lang={lang}/>
                </div>
              ))}
            </>
          ):(
            <><p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 12px"}}>Read naturally — don't sound like you're reading a script.</p>
            <CopyCard title="Phone Call Script" content={r.voice_script||"No call script generated."} icon="" lang={lang}/></>
          ))}

          {/* Quick link into the Follow-Up app for this client */}
          <button onClick={()=>setScreen({screen:"followup"})} style={{background:"transparent",color:"#2AB8D4",border:"1px solid #2AB8D4",borderRadius:"8px",padding:"12px 22px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",width:"100%",marginTop:"8px"}}>📲 Open Follow-Up Engine →</button>
        </>}
      </div>
    </div>
  )
}
