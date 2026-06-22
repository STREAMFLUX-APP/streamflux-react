import { useState } from 'react'
import { SF, apiClaude, followUpStatus, STATUS_META } from '../globals.js'
import { CopyCard } from '../components/shared/CopyCard.jsx'

const SYSTEM = "You are an elite real estate sales coach. Respond with ONLY a raw valid JSON object. Start with { end with }. No markdown. No backticks. No explanation."
const COLD_DAYS = 14

const inp = {width:"100%",background:"#f0f0f2",border:"1px solid #e2e2e6",borderRadius:"8px",color:"rgba(0,0,0,0.75)",fontSize:"14px",padding:"11px 14px",outline:"none",fontFamily:"inherit",boxSizing:"border-box",WebkitTextFillColor:"rgba(0,0,0,0.7)"}
const card = {background:"#f5f5f7",border:"1px solid #e2e2e6",borderRadius:"12px",padding:"22px",marginBottom:"16px"}

const daysSince = ts => ts ? Math.floor((Date.now()-ts)/864e5) : 0

const tabOf = c => {
  const base = followUpStatus(c)
  if (base==="new") return null
  if (base==="closed") return "closed"
  if (base==="active") return "active"
  if (c.sentAt && daysSince(c.sentAt)>=COLD_DAYS) return "cold"
  if (base==="overdue") return "needs"
  if (base==="awaiting") return "waiting"
  return null
}

const rowInfo = c => {
  const base = followUpStatus(c)
  if (base==="closed") return {line:"Closed — deal done", color:STATUS_META.closed.dot}
  if (base==="active") return {line:"They replied — log it to get the next message", color:STATUS_META.active.dot}
  if (c.sentAt && daysSince(c.sentAt)>=COLD_DAYS) return {line:`Going cold — no contact ${daysSince(c.sentAt)} days`, color:"#888780"}
  if (base==="overdue") return {line:`Follow up now — ${daysSince(c.sentAt)} days gone`, color:STATUS_META.overdue.dot}
  if (base==="awaiting") return {line:"Waiting for reply", color:STATUS_META.awaiting.dot}
  return {line:"Not sent yet", color:STATUS_META.new.dot}
}

const TABS = [
  {id:"needs", label:"Needs action now", bg:"#A32D2D", fg:"#fff"},
  {id:"waiting", label:"Waiting for reply", bg:"#D4A843", fg:"#060608"},
  {id:"active", label:"Active chats", bg:"#3d9e5c", fg:"#fff"},
  {id:"cold", label:"Going cold", bg:"#888780", fg:"#060608"},
  {id:"closed", label:"Closed", bg:"#2AB8D4", fg:"#060608"},
]

export default function FollowUp({ state: appState, setScreen }) {
  const [clients, setClients] = useState(SF.getClients())
  const [activeTab, setActiveTab] = useState("needs")
  const [openId, setOpenId] = useState(null)
  const [subTab, setSubTab] = useState("noreply")
  const [regenContext, setRegenContext] = useState("")
  const [regenLoading, setRegenLoading] = useState(false)
  const [error, setError] = useState("")

  const refresh = () => setClients(SF.getClients())
  const open = clients.find(c=>c.id===openId)
  const lang = open?.language || appState?.lang || "English"
  const isSpa = lang==="Spanish"

  const counts = TABS.reduce((a,t)=>{a[t.id]=clients.filter(c=>tabOf(c)===t.id).length;return a},{})
  const shown = Object.values(counts).reduce((a,b)=>a+b,0)

  const Nav = ({back}) => (
    <div style={{background:"#ffffff",borderBottom:"1px solid #e0e0e4",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:"0",zIndex:"1000",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:"#0a0a0a"}}>STREAM<span style={{color:"#2AB8D4"}}>FLUX</span></span>
      <button onClick={back} style={{background:"transparent",color:"rgba(0,0,0,0.5)",border:"1px solid #e0e0e4",borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{openId?"← All Contacts":"← Dashboard"}</button>
    </div>
  )

  if (open) {
    const r = open.result || {}
    const base = followUpStatus(open)
    const meta = STATUS_META[base]
    const markSent = () => { SF.updateClient(open.id,{status:"awaiting",sentAt:Date.now()}); refresh() }
    const markClosed = () => { SF.updateClient(open.id,{status:"closed"}); refresh() }
    const reopen = () => { SF.updateClient(open.id,{status:"awaiting"}); refresh() }

    const runRegen = async () => {
      if(!regenContext||regenLoading) return
      setRegenLoading(true); setError("")
      try{
        const regen = await apiClaude(`Original: CLIENT ${open.clientName}|${open.contactReason}\nWhat happened: ${regenContext}${isSpa?"\n\nCRITICO: Escribe TODO en espanol.":""}\n\nReturn ONLY JSON:\n{"followup_1":"New Day 3. 50-60 words.","followup_2":"New Week 1. 50-60 words.","followup_3":"New Week 2. 40-50 words.","followup_4":"New Month 1. 40-50 words."}`,SYSTEM,700)
        const merged = {...r,regen_fu1:regen.followup_1,regen_fu2:regen.followup_2,regen_fu3:regen.followup_3,regen_fu4:regen.followup_4}
        SF.updateClient(open.id,{status:"active",result:merged})
        setRegenContext(""); refresh()
      }catch(e){ setError("Failed: "+e.message) }
      setRegenLoading(false)
    }

    return (
      <div style={{minHeight:"100vh",background:"#ffffff"}}>
        <Nav back={()=>{setOpenId(null);setSubTab("noreply");setError("")}}/>
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"22px 16px 60px"}}>

          <div style={{...card,display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:"18px",fontWeight:"700",color:"#0a0a0a"}}>{open.clientName||"Client"}</div>
              <div style={{fontSize:"12px",color:"rgba(0,0,0,0.5)",marginTop:"2px"}}>{(open.clientType||"").replace(/_/g," ")} · {(open.contactReason||"").replace(/_/g," ")}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <span style={{width:"8px",height:"8px",borderRadius:"50%",background:meta.dot}}/>
              <span style={{fontSize:"12px",fontWeight:"700",color:"#0a0a0a"}}>{meta.label}</span>
            </div>
          </div>

          <div style={{display:"flex",gap:"4px",marginBottom:"20px",background:"#f5f5f7",padding:"4px",borderRadius:"10px",border:"1px solid #e2e2e6"}}>
            <button onClick={()=>setSubTab("noreply")} style={{flex:"1",background:subTab==="noreply"?"#2AB8D4":"transparent",color:subTab==="noreply"?"#ffffff":"rgba(0,0,0,0.5)",border:"none",borderRadius:"8px",padding:"10px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>No Reply Plan</button>
            <button onClick={()=>setSubTab("gotreply")} style={{flex:"1",background:subTab==="gotreply"?"#2AB8D4":"transparent",color:subTab==="gotreply"?"#ffffff":"rgba(0,0,0,0.5)",border:"none",borderRadius:"8px",padding:"10px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>They Responded</button>
          </div>

          {error&&<div style={{background:"#fff0f0",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"8px",padding:"12px 16px",color:"#dc2626",fontSize:"13px",marginBottom:"16px"}}>{error}</div>}

          {subTab==="noreply"&&(
            <>
              <div style={{background:"rgba(0,0,0,0.03)",border:"1px solid #e2e2e6",borderRadius:"10px",padding:"12px 14px",marginBottom:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"}}>
                <span style={{fontSize:"12px",color:"rgba(0,0,0,0.55)"}}>{base==="new"?"Send your first outreach, then mark it sent.":"Send these in order if they stay quiet."}</span>
                <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>
                  {base==="new" && <button onClick={markSent} style={{background:"#2AB8D4",color:"#ffffff",border:"none",borderRadius:"7px",padding:"7px 12px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>I sent it</button>}
                  {(base==="awaiting"||base==="overdue"||base==="active") && <button onClick={markClosed} style={{background:"transparent",color:"rgba(0,0,0,0.5)",border:"1px solid #e0e0e4",borderRadius:"7px",padding:"7px 12px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>Mark closed</button>}
                  {base==="closed" && <button onClick={reopen} style={{background:"transparent",color:"rgba(0,0,0,0.5)",border:"1px solid #e0e0e4",borderRadius:"7px",padding:"7px 12px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>Reopen</button>}
                </div>
              </div>
              <p style={{color:"rgba(0,0,0,0.5)",fontSize:"13px",margin:"0 0 16px",lineHeight:"1.6"}}>80% of deals close between touch 5-12.</p>
              <CopyCard title="Follow-Up #1 — Day 3" content={r.followup_1||""} icon="" lang={lang}/>
              <CopyCard title="Follow-Up #2 — Week 1" content={r.followup_2||""} icon="" lang={lang}/>
              <CopyCard title="Follow-Up #3 — Week 2" content={r.followup_3||""} icon="" lang={lang}/>
              <CopyCard title="Follow-Up #4 — Month 1" content={r.followup_4||""} icon="" lang={lang}/>
              <CopyCard title="Follow-Up #5 — Month 2" content={r.followup_5||""} icon="" lang={lang}/>
              <button onClick={()=>setScreen({screen:"app2_results",savedResult:open})} style={{background:"transparent",color:"rgba(0,0,0,0.5)",border:"1px solid #e0e0e4",borderRadius:"8px",padding:"12px 20px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",marginTop:"8px"}}>Open full package →</button>
            </>
          )}

          {subTab==="gotreply"&&(
            <div style={{background:"rgba(42,184,212,0.04)",border:"1px solid rgba(42,184,212,0.25)",borderRadius:"10px",padding:"20px"}}>
              <div style={{fontSize:"13px",fontWeight:"700",color:"#0a0a0a",marginBottom:"6px"}}>Log What Happened — Get New Follow-Ups</div>
              <p style={{fontSize:"12px",color:"rgba(0,0,0,0.5)",marginBottom:"14px",lineHeight:"1.6"}}>They replied? Describe what happened. The AI writes 4 new tailored follow-ups.</p>
              <textarea placeholder="e.g. She liked it but her husband isn't convinced..." rows={4} value={regenContext} onChange={e=>setRegenContext(e.target.value)} style={{...inp,resize:"vertical",marginBottom:"12px"}}/>
              <button onClick={runRegen} style={{background:regenLoading?"#e5e5e7":"#2AB8D4",color:regenLoading?"rgba(0,0,0,0.35)":"#ffffff",border:"none",borderRadius:"8px",padding:"13px 24px",fontSize:"14px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>{regenLoading?"Generating...":"✦ Get New Follow-Ups Based on Response"}</button>
              {r.regen_fu1&&(<div style={{marginTop:"20px"}}>
                <CopyCard title="New Follow-Up #1" content={r.regen_fu1||""} icon="" lang={lang}/>
                <CopyCard title="New Follow-Up #2" content={r.regen_fu2||""} icon="" lang={lang}/>
                <CopyCard title="New Follow-Up #3" content={r.regen_fu3||""} icon="" lang={lang}/>
                <CopyCard title="New Follow-Up #4" content={r.regen_fu4||""} icon="" lang={lang}/>
              </div>)}
              <div style={{display:"flex",gap:"8px",marginTop:"16px",flexWrap:"wrap"}}>
                {base!=="closed" && <button onClick={markClosed} style={{background:"transparent",color:"rgba(0,0,0,0.5)",border:"1px solid #e0e0e4",borderRadius:"8px",padding:"10px 16px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>✓ Mark closed</button>}
                {base==="closed" && <button onClick={reopen} style={{background:"transparent",color:"rgba(0,0,0,0.5)",border:"1px solid #e0e0e4",borderRadius:"8px",padding:"10px 16px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>↩ Reopen</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const rows = clients
    .filter(c=>tabOf(c)===activeTab)
    .sort((a,b)=>daysSince(b.sentAt)-daysSince(a.sentAt))

  return (
    <div style={{minHeight:"100vh",background:"#ffffff"}}>
      <Nav back={()=>setScreen({screen:"dashboard"})}/>
      <div style={{maxWidth:"720px",margin:"0 auto",padding:"22px 16px 60px"}}>

        <div style={{marginBottom:"18px",padding:"0 4px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <h1 style={{fontSize:"20px",fontWeight:"700",color:"#0a0a0a",margin:"0"}}>Follow-Up</h1>
            <span style={{fontSize:"12px",color:"rgba(0,0,0,0.5)"}}>{shown} contacts</span>
          </div>
          <p style={{fontSize:"13px",color:"rgba(0,0,0,0.5)",margin:"8px 0 0",lineHeight:"1.5"}}>Tap a contact to copy their next message or log a reply. Red = act now, yellow = waiting on them, green = active chat.</p>
        </div>

        <div style={{display:"flex",gap:"6px",marginBottom:"20px",flexWrap:"wrap"}}>
          {TABS.map(t=>{
            const on = activeTab===t.id
            return (
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{background:on?t.bg:"#f5f5f7",color:on?t.fg:"rgba(0,0,0,0.55)",border:on?"1px solid transparent":"1px solid #e2e2e6",borderRadius:"100px",padding:"7px 13px",fontSize:"12px",fontWeight:on?"700":"500",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                {t.label} · {counts[t.id]}
              </button>
            )
          })}
        </div>

        {clients.length===0 ? (
          <div style={{...card,textAlign:"center",padding:"40px 22px"}}>
            <div style={{fontSize:"13px",color:"rgba(0,0,0,0.5)"}}>No contacts yet. Generate an outreach package in Client Outreach and it will appear here automatically.</div>
          </div>
        ) : rows.length===0 ? (
          <div style={{...card,textAlign:"center",padding:"40px 22px"}}>
            <div style={{fontSize:"13px",color:"rgba(0,0,0,0.5)"}}>Nothing in this tab right now.</div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {rows.map(c=>{
              const {line,color} = rowInfo(c)
              return (
                <button key={c.id} onClick={()=>{setOpenId(c.id);setSubTab(followUpStatus(c)==="active"?"gotreply":"noreply")}}
                  style={{textAlign:"left",background:"#f5f5f7",border:"1px solid #e2e2e6",borderLeft:`3px solid ${color}`,borderRadius:"0 10px 10px 0",padding:"13px 15px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",cursor:"pointer",fontFamily:"inherit"}}>
                  <div style={{minWidth:"0"}}>
                    <div style={{fontSize:"14px",fontWeight:"700",color:"#0a0a0a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.clientName||"Client"}</div>
                    <div style={{fontSize:"12px",color,marginTop:"3px"}}>{line}</div>
                  </div>
                  <span style={{color:"rgba(0,0,0,0.25)",fontSize:"18px",flexShrink:"0"}}>›</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
