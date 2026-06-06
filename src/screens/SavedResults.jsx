import { useState } from 'react'
import { G } from '../globals.js'
import { CopyCard } from '../components/shared/CopyCard.jsx'

const APP1_TABS = [{id:"listing",label:"🏠 Listing"},{id:"social",label:"📱 Social"},{id:"ads",label:"🎯 Ads & SMS"},{id:"tiktok",label:"🎬 TikTok"},{id:"neighbours",label:"✉️ Neighbours"},{id:"schedule",label:"📅 Schedule"}]
const APP2_TABS = [{id:"messages",label:"💬 Messages"},{id:"voice",label:"🎙️ Voice"},{id:"email",label:"📧 Email"},{id:"letter",label:"✉️ Letter"},{id:"followups",label:"🔄 Follow-Ups"},{id:"schedule",label:"📅 Schedule"}]

export default function SavedResults({ state, setScreen, app }) {
  const saved = state.savedResult
  const result = saved?.result || {}
  const isApp1 = app === "app1"
  const isSpa = state.lang === "Spanish"
  const [activeTab, setActiveTab] = useState(isApp1?"listing":"messages")
  const tabs = isApp1 ? APP1_TABS : APP2_TABS
  const lang = state.lang || "English"

  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      <div style={{background:G.card,borderBottom:`1px solid ${G.border}`,padding:"14px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:"15px",fontWeight:"700",color:G.white}}>📋 {isSpa?"Resultados Guardados":"Saved Results"}</span>
        <button onClick={()=>setScreen({screen:"dashboard",savedResult:null})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{isSpa?"← Panel Principal":"← Dashboard"}</button>
      </div>

      <div style={{maxWidth:"720px",margin:"0 auto",padding:"22px 16px 60px"}}>
        {/* Info bar */}
        <div style={{background:"#111",border:`1px solid ${G.border}`,borderRadius:"8px",padding:"12px 16px",marginBottom:"18px"}}>
          {isApp1 ? <>
            <p style={{color:G.white,fontSize:"14px",fontWeight:"600",marginBottom:"2px"}}>{saved.address||(saved.city?(isSpa?"Propiedad en ":"Property in ")+saved.city:"")}</p>
            <p style={{color:G.muted,fontSize:"12px"}}>{saved.mode||""} · {saved.propType||""} · {saved.price?"$"+saved.price:""} · {saved.savedAt||""}</p>
          </> : <>
            <p style={{color:G.white,fontSize:"14px",fontWeight:"600",marginBottom:"2px"}}>{saved.clientName||"Client"}</p>
            <p style={{color:G.muted,fontSize:"12px"}}>{saved.contactReason||""} · {saved.savedAt||""}</p>
          </>}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:"6px",marginBottom:"20px",flexWrap:"wrap"}}>
          {tabs.map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              style={{background:activeTab===tab.id?G.aqua:"#0d0d0d",color:activeTab===tab.id?"#060608":G.muted,border:`1px solid ${activeTab===tab.id?G.aqua:G.border}`,borderRadius:"8px",padding:"7px 12px",fontSize:"12px",fontWeight:activeTab===tab.id?"700":"400",fontFamily:"inherit",cursor:"pointer"}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
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

        {!isApp1 && <>
          {activeTab==="messages" && <><CopyCard title="WhatsApp" content={result.whatsapp} icon="💬" lang={lang}/><CopyCard title="SMS" content={result.sms} icon="📱" lang={lang}/></>}
          {activeTab==="voice" && <CopyCard title={isSpa?"Guión Telefónico":"Phone Call Script"} content={result.voice_script} icon="🎙️" lang={lang}/>}
          {activeTab==="email" && <><CopyCard title={isSpa?"Asunto del Email":"Email Subject"} content={result.email_subject} icon="📧" lang={lang}/><CopyCard title={isSpa?"Cuerpo del Email":"Email Body"} content={result.email_body} icon="📨" lang={lang}/></>}
          {activeTab==="letter" && <CopyCard title={isSpa?"Carta Formal":"Formal Letter"} content={result.formal_letter} icon="✉️" lang={lang}/>}
          {activeTab==="followups" && <><CopyCard title="Follow-Up #1" content={result.followup_1} icon="💬" lang={lang}/><CopyCard title="Follow-Up #2" content={result.followup_2} icon="💬" lang={lang}/><CopyCard title="Follow-Up #3" content={result.followup_3} icon="💬" lang={lang}/><CopyCard title="Follow-Up #4" content={result.followup_4} icon="💬" lang={lang}/></>}
          {activeTab==="schedule" && result.schedule && (
            <>{result.schedule.map((d,i)=>(
              <div key={i} style={{background:"#0d0d0d",border:`1px solid ${G.border}`,borderRadius:"8px",padding:"14px 16px",marginBottom:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",fontWeight:"700",color:G.white,fontSize:"14px"}}><span>{d.icon||"📅"}</span><span>{d.day||d.label}</span></div>
                {d.tasks && <ul style={{paddingLeft:"18px",margin:"0"}}>{d.tasks.map((t,j)=><li key={j} style={{color:"#ccc",fontSize:"14px",lineHeight:"1.7",marginBottom:"4px"}}>{t}</li>)}</ul>}
              </div>
            ))}</>
          )}
        </>}
      </div>
    </div>
  )
}
