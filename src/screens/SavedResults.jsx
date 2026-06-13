import { useState } from 'react'
import { G, SF, apiClaude, followUpStatus, STATUS_META } from '../globals.js'
import { CopyCard } from '../components/shared/CopyCard.jsx'

const APP1_TABS = [{id:"listing",label:"🏠 Listing"},{id:"social",label:"📱 Social"},{id:"ads",label:"🎯 Ads & SMS"},{id:"tiktok",label:"🎬 TikTok"},{id:"neighbours",label:"✉️ Neighbours"},{id:"schedule",label:"📅 Schedule"}]
const APP2_TABS = [{id:"messages",label:"Messages"},{id:"email",label:"Email"},{id:"voice",label:"Voice"},{id:"followups",label:"Follow-Up Engine"},{id:"schedule",label:"Schedule"}]
const SYSTEM = "You are an elite real estate sales coach. Respond with ONLY a raw valid JSON object. Start with { end with }. No markdown. No backticks. No explanation."
const inp = {width:"100%",background:"#060608",border:"1px solid #252530",borderRadius:"8px",color:"rgba(255,255,255,0.65)",fontSize:"14px",padding:"11px 14px",outline:"none",fontFamily:"inherit",boxSizing:"border-box",WebkitTextFillColor:"rgba(255,255,255,0.55)"}

function FollowUpBar({ status, onSent, onResponded, onClosed, onReopen }) {
  const meta = STATUS_META[status] || STATUS_META.new
  const wrap = {background:"#0c0c10",border:"1px solid #252530",borderRadius:"12px",padding:"16px 18px",marginBottom:"20px"}
  const row = {display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}
  const btn = (bg,col,brd) => ({flex:"1",background:bg,color:col,border:brd||"none",borderRadius:"8px",padding:"11px 14px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",minWidth:"140px"})
  const btnRow = {display:"flex",gap:"8px",flexWrap:"wrap"}
  return (
    <div style={wrap}>
      <div style={row}>
        <span style={{width:"9px",height:"9px",borderRadius:"50%",background:meta.dot,flexShrink:"0",boxShadow:`0 0 8px ${meta.dot}`}}/>
        <span style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.12em",textTransform:"uppercase",color:"#fff"}}>Follow-Up Status: {meta.label}</span>
      </div>
      <div style={btnRow}>
        {status==="new" && <button onClick={onSent} style={btn("#2AB8D4","#060608")}>📤 I sent it — start my clock</button>}
        {(status==="new"||status==="awaiting"||status==="overdue"||status==="active") &&
          <button onClick={onResponded} style={btn("rgba(42,184,212,0.12)","#2AB8D4","1px solid rgba(42,184,212,0.4)")}>📲 They responded — log it</button>}
        {(status==="awaiting"||status==="overdue"||status==="active") &&
          <button onClick={onClosed} style={btn("rgba(61,158,92,0.12)","#3d9e5c","1px solid rgba(61,158,92,0.4)")}>✓ Mark deal closed</button>}
        {status==="closed" && <button onClick={onReopen} style={btn("rgba(255,255,255,0.06)","rgba(255,255,255,0.65)","1px solid #252530")}>↩ Reopen client</button>}
      </div>
    </div>
  )
}

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

        {/* Follow-Up status bar (App02 only) */}
        {!isApp1 && (
          <FollowUpBar
            status={fuStatus}
            onSent={()=>{persist({status:"awaiting",sentAt:Date.now()});setFuStatus("awaiting")}}
            onResponded={()=>{setActiveTab("followups");setFuSubTab("gotreply")}}
            onClosed={()=>{persist({status:"closed"});setFuStatus("closed")}}
            onReopen={()=>{persist({status:"awaiting"});setFuStatus("awaiting")}}
          />
        )}

        {/* Tabs */}
        <div style={{display:"flex",gap:"6px",marginBottom:"20px",flexWrap:"wrap"}}>
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

        {/* ===== APP 2 (rebuilt to match live App02) ===== */}
        {!isApp1 && <>
          {activeTab==="messages" && (isObj?(
            <>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:"13px",margin:"0 0 16px"}}>Three approaches to handle this objection. Pick the one that fits — or use all three across different follow-ups.</p>
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
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 16px"}}>Three call scripts — each a different approach. Read naturally.</p>
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

          {activeTab==="followups" && (
            <>
              <div style={{display:"flex",gap:"4px",marginBottom:"20px",background:"#0c0c10",padding:"4px",borderRadius:"10px",border:"1px solid #252530"}}>
                <button onClick={()=>setFuSubTab("noreply")} style={{flex:"1",background:fuSubTab==="noreply"?"#2AB8D4":"transparent",color:fuSubTab==="noreply"?"#060608":"rgba(255,255,255,0.5)",border:"none",borderRadius:"8px",padding:"10px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",WebkitTapHighlightColor:"rgba(42,184,212,0.3)",touchAction:"manipulation"}}>No Reply Plan</button>
                <button onClick={()=>setFuSubTab("gotreply")} style={{flex:"1",background:fuSubTab==="gotreply"?"#2AB8D4":"transparent",color:fuSubTab==="gotreply"?"#060608":"rgba(255,255,255,0.5)",border:"none",borderRadius:"8px",padding:"10px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",WebkitTapHighlightColor:"rgba(42,184,212,0.3)",touchAction:"manipulation"}}>Got a Response?</button>
              </div>
              {fuSubTab==="noreply" && (
                <>
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:"0 0 16px",lineHeight:"1.6"}}>Use these if your client goes quiet. Send in order. 80% of deals close between touch 5-12.</p>
                  <CopyCard title="Follow-Up #1 — Day 3" content={r.followup_1||""} icon="" lang={lang}/>
                  <CopyCard title="Follow-Up #2 — Week 1" content={r.followup_2||""} icon="" lang={lang}/>
                  <CopyCard title="Follow-Up #3 — Week 2" content={r.followup_3||""} icon="" lang={lang}/>
                  <CopyCard title="Follow-Up #4 — Month 1" content={r.followup_4||""} icon="" lang={lang}/>
                  {r.followup_5 && <CopyCard title="Follow-Up #5 — Month 2" content={r.followup_5||""} icon="" lang={lang}/>}
                </>
              )}
              {fuSubTab==="gotreply" && (
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",padding:"20px"}}>
                  <div style={{fontSize:"13px",fontWeight:"700",color:"#fff",marginBottom:"6px"}}>Log What Happened — Get New Follow-Ups</div>
                  <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",marginBottom:"14px",lineHeight:"1.6"}}>Got a response? Describe what happened. The AI generates 4 new tailored follow-ups instantly.</p>
                  <textarea placeholder="e.g. She replied and said she liked it but her husband isn't convinced..." rows={4}
                    value={regenContext} onChange={e=>setRegenContext(e.target.value)}
                    style={{...inp,resize:"vertical",borderColor:"rgba(255,255,255,0.15)",background:"#0d0d0d",marginBottom:"12px",WebkitUserSelect:"text",userSelect:"text",WebkitTextFillColor:"rgba(255,255,255,0.65)",color:"rgba(255,255,255,0.65)"}}/>
                  <button onClick={async()=>{
                    if(!regenContext||regenLoading)return
                    setRegenLoading(true)
                    const langI = isSpa?"\n\nCRITICO: Escribe TODO completamente en espanol.":""
                    try{
                      const regen=await apiClaude(`Original: CLIENT ${saved.clientName}|${saved.contactReason}\nWhat happened: ${regenContext}${langI}\n\nReturn ONLY JSON:\n{"followup_1":"New Day 3. 50-60 words.","followup_2":"New Week 1. 50-60 words.","followup_3":"New Week 2. 40-50 words.","followup_4":"New Month 1. 40-50 words."}`,SYSTEM,700)
                      const merged={...result,regen_fu1:regen.followup_1,regen_fu2:regen.followup_2,regen_fu3:regen.followup_3,regen_fu4:regen.followup_4}
                      setResult(merged); setRegenContext("")
                      persist({status:"active",result:merged}); setFuStatus("active")
                    }catch(e){setErr("Failed: "+e.message)}
                    setRegenLoading(false)
                  }} style={{background:regenLoading?"#1a1a1a":"#2AB8D4",color:regenLoading?"rgba(255,255,255,0.5)":"#060608",border:"none",borderRadius:"8px",padding:"13px 24px",fontSize:"14px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
                    {regenLoading?"Generating...":"✦ Get New Follow-Ups Based on Response"}
                  </button>
                  {err && <p style={{color:"#f87171",fontSize:"12px",marginTop:"10px"}}>{err}</p>}
                  {result.regen_fu1 && (<div style={{marginTop:"20px"}}>
                    <CopyCard title="New Follow-Up #1" content={result.regen_fu1||""} icon="" lang={lang}/>
                    <CopyCard title="New Follow-Up #2" content={result.regen_fu2||""} icon="" lang={lang}/>
                    <CopyCard title="New Follow-Up #3" content={result.regen_fu3||""} icon="" lang={lang}/>
                    <CopyCard title="New Follow-Up #4" content={result.regen_fu4||""} icon="" lang={lang}/>
                  </div>)}
                </div>
              )}
            </>
          )}

          {activeTab==="schedule" && result.schedule && (
            <>{result.schedule.map((d,i)=>(
              <div key={i} style={{background:"#0d0d0d",border:`1px solid ${G.border}`,borderRadius:"8px",padding:"14px 16px",marginBottom:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",fontWeight:"700",color:G.white,fontSize:"14px"}}><span style={{color:G.aqua}}>{d.day||d.label}</span></div>
                {d.tasks && <ul style={{paddingLeft:"18px",margin:"0"}}>{d.tasks.map((t,j)=><li key={j} style={{color:"#ccc",fontSize:"14px",lineHeight:"1.7",marginBottom:"4px"}}>{t}</li>)}</ul>}
              </div>
            ))}</>
          )}
        </>}
      </div>
    </div>
  )
}
