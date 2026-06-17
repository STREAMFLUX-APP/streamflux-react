import { useState, useEffect } from 'react'
import { G, GL, SF, btnStyle, followUpStatus, STATUS_META } from '../globals.js'

export default function Dashboard({ state, setScreen }) {
  const { user } = state
  const g = GL[state.lang] || GL.English
  const isSpa = state.lang==="Spanish"
  const agencyPlans = ["starter","pro","elite","enterprise"]
  const hasApp1 = user.plan==="marketing"||user.plan==="bundle"||agencyPlans.includes(user.plan)
  const hasApp2 = user.plan==="outreach"||user.plan==="bundle"||agencyPlans.includes(user.plan)
  const hasApp3 = agencyPlans.includes(user.plan)||user.plan==="bundle"
  const listings = SF.getListings()
  const clients = SF.getClients()
  const newsletters = SF.getNewsletters()
  // Clients that need attention right now (waiting for a reply, or overdue)
  const needNow = clients.filter(c=>{
    const st = followUpStatus(c)
    return st==="awaiting"||st==="overdue"
  })
  const followUpsDue = needNow.length
  const firstName = user.name ? user.name.split(" ")[0] : "there"

  // Responsive tool grid: 1 column on phones, 2x2 on desktop
  const [toolCols, setToolCols] = useState(typeof window!=="undefined" && window.innerWidth < 720 ? 1 : 2)
  useEffect(() => {
    const onResize = () => setToolCols(window.innerWidth < 720 ? 1 : 2)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Clean app titles (no "Machine"), bilingual
  const T = isSpa
    ? {a1:"Marketing Inmobiliario", a2:"Captación de Clientes", a3:"Motor de Seguimiento", a4:"Generador de Newsletter"}
    : {a1:"Property Marketing", a2:"Client Outreach", a3:"Follow-Up Engine", a4:"Newsletter Generator"}

  // Redirect if trial expired
  if (!user.subscribed && !user.trialActive) {
    setTimeout(()=>setScreen({screen:"trial-expired"}),0)
    return null
  }

  const stats = [
    [String(listings.length), "Listings Generated", "Total listing packages"],
    [String(clients.length), "Clients Outreached", "Total outreach packages"],
    [String(followUpsDue), "Follow-Ups Due", "Clients needing follow-up"],
    [String(listings.length+clients.length), "Total Packages", "All AI packages generated"],
  ]

  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      {/* Nav */}
      <div style={{background:"#0c0c10",borderBottom:`1px solid ${G.border}`,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"60px",position:"sticky",top:"0",zIndex:"9999"}}>
        <div style={{fontSize:"17px",fontWeight:"800",letterSpacing:"5px",color:G.white}}>
          STREAM<span style={{color:G.aqua}}>FLUX</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          {user.subscribed && (
            <div style={{background:G.aquaDim,border:`1px solid ${G.aquaBorder}`,borderRadius:"100px",padding:"4px 14px",display:"flex",alignItems:"center",gap:"6px"}}>
              <div style={{width:"6px",height:"6px",borderRadius:"50%",background:G.aqua}}/>
              <span style={{fontSize:"11px",fontWeight:"700",color:G.aqua}}>Active</span>
            </div>
          )}
          {!user.subscribed && (
            <button onClick={()=>window.open("https://buy.stripe.com/5kQdR93uUbHp7Kc4sjds403","_blank")}
              style={{...btnStyle(false),padding:"6px 16px",fontSize:"12px"}}>
              {isSpa?"Suscribirse →":"Subscribe Now →"}
            </button>
          )}
          <button onClick={()=>setScreen({screen:"admin"})}
            style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>
            Admin
          </button>
          <button onClick={()=>{sessionStorage.removeItem("sf_user");setScreen({screen:"login",user:null})}}
            style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>
            {g.signOut||"Sign Out"}
          </button>
        </div>
      </div>

      <div style={{maxWidth:"980px",margin:"0 auto",padding:"40px 28px 100px"}}>
        {/* Hero */}
        <div style={{marginBottom:"40px",paddingBottom:"36px",borderBottom:`1px solid ${G.border}`}}>
          <h1 style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:"400",color:G.white,lineHeight:"1.5"}}>
            {isSpa?"Bienvenido a tu sistema de IA, ":"Welcome to your AI marketing, outreach & newsletter system, "}
            <span style={{color:G.aqua}}>{firstName}</span>.
          </h1>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:G.border,borderRadius:"12px",overflow:"hidden",marginBottom:"48px",border:"1px solid rgba(255,255,255,0.25)"}}>
          {stats.map(([num,label,sub])=>(
            <div key={label} style={{background:G.bg1,padding:"24px 22px"}}>
              <div style={{fontSize:"32px",fontWeight:"800",color:G.aqua,fontFamily:"DM Mono,monospace",letterSpacing:"-0.04em",lineHeight:"1",marginBottom:"8px"}}>{num}</div>
              <div style={{fontSize:"12px",fontWeight:"700",color:G.white,marginBottom:"3px"}}>{label}</div>
              <div style={{fontSize:"11px",color:G.muted,lineHeight:"1.4"}}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Tools label */}
        <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.2em",textTransform:"uppercase",color:G.white,marginBottom:"16px",display:"flex",alignItems:"center",gap:"12px"}}>
          YOUR TOOLS
          <div style={{flex:"1",height:"1px",background:G.border}}/>
        </div>

        {/* Tools grid */}
        <div style={{display:"grid",gridTemplateColumns:`repeat(${toolCols},1fr)`,gap:"1px",background:G.border,borderRadius:"14px",overflow:"visible",border:"1px solid rgba(255,255,255,0.25)",alignItems:"stretch"}}>
          {hasApp1 && <ToolCard num="APP 01" title={T.a1} sub="Generate 13 marketing outputs for any listing in minutes." btnLabel={g.newListing||"New Listing →"} onNew={()=>setScreen({screen:"app1"})} hist={listings} mode="app1" setScreen={setScreen} lang={state.lang} />}
          {hasApp2 && <ToolCard num="APP 02" title={T.a2} sub="Personalised outreach packages for any client, any situation." btnLabel={g.newClient||"New Client →"} onNew={()=>setScreen({screen:"app2"})} hist={clients} mode="app2" setScreen={setScreen} lang={state.lang} />}
          {hasApp2 && <ToolCard num="APP 03" title={T.a3} sub="Work every client's follow-up in one place — nothing slips." btnLabel={isSpa?"📲 Seguimiento →":"📲 Follow-Up →"} onNew={()=>setScreen({screen:"followup"})} hist={needNow} mode="followup" setScreen={setScreen} lang={state.lang} />}
          <ToolCard num="APP 04" title={T.a4} sub="Monthly client newsletter ready to send." btnLabel={isSpa?"📰 Nuevo Newsletter →":"📰 New Newsletter →"} onNew={()=>setScreen({screen:"app3",savedResult:null})} hist={newsletters} mode="newsletter" setScreen={setScreen} lang={state.lang} />
        </div>

        {/* Trial bar */}
        {!user.subscribed && (
          <div style={{marginTop:"2px",background:G.bg1,border:`1px solid ${G.border}`,borderRadius:"0 0 14px 14px",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",flexWrap:"wrap"}}>
            <p style={{fontSize:"13px",color:G.muted,margin:"0"}}>
              {user.trialActive ? `Trial active — ${user.daysLeft} days remaining.` : "Your trial has ended."}
            </p>
            <button onClick={()=>window.open("https://buy.stripe.com/5kQdR93uUbHp7Kc4sjds403","_blank")}
              style={{...btnStyle(false),padding:"10px 20px",fontSize:"12px"}}>
              Subscribe Now →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ToolCard({ num, title, sub, onNew, btnLabel, hist, mode, setScreen, lang }) {
  const [open, setOpen] = useState(false)
  const isSpa = lang==="Spanish"
  const isApp1 = mode==="app1"
  const isFollowUp = mode==="followup"
  const isNewsletter = mode==="newsletter"

  // The expandable list label, per card type.
  const listLabel = isFollowUp
    ? (isSpa?"Estado de seguimiento reciente":"Recent follow-up status")
    : isNewsletter
      ? (isSpa?"Newsletters Recientes Generados":"Recent Newsletters Generated")
      : (isSpa?"Paquetes Recientes Generados":"Recent Packages Generated")

  const hasList = hist && hist.length > 0

  // Message shown inside the dropdown when nothing has been generated yet.
  const emptyLabel = isFollowUp
    ? (isSpa?"Aún no hay seguimientos":"No follow-ups yet")
    : isNewsletter
      ? (isSpa?"Aún no hay newsletters generados":"No newsletters generated yet")
      : (isSpa?"Aún no hay paquetes generados":"No packages generated yet")

  return (
    <div style={{background:"#0c0c10",padding:"28px",display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{minHeight:"90px",marginBottom:"20px"}}>
        <div style={{fontSize:"9px",fontWeight:"700",letterSpacing:"0.3em",textTransform:"uppercase",color:"#2AB8D4",marginBottom:"10px",fontFamily:"DM Mono,monospace"}}>// {num}</div>
        <div style={{fontSize:"16px",fontWeight:"700",color:"#fff",marginBottom:"5px",lineHeight:"1.3"}}>{title}</div>
        <div style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",lineHeight:"1.5"}}>{sub}</div>
      </div>
      <button onClick={onNew}
        style={{background:"#2AB8D4",color:"#060608",border:"none",borderRadius:"8px",padding:"12px 18px",fontSize:"13px",fontWeight:"800",cursor:"pointer",fontFamily:"inherit",width:"100%",marginBottom:"16px",marginTop:"auto"}}>
        {btnLabel}
      </button>

      <div style={{position:"relative"}}>
          <button onClick={()=>setOpen(!open)}
            style={{background:"rgba(255,255,255,0.06)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",borderRadius:"8px",padding:"8px 14px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>{listLabel}</span>
            <span style={{fontSize:"10px",opacity:"0.6"}}>{open?"▲":"▼"}</span>
          </button>
          {open && (
            <div style={{position:"absolute",top:"calc(100% + 6px)",left:"0",right:"0",zIndex:"50",maxHeight:"260px",overflowY:"auto",background:"#0c0c10",border:"1px solid #252530",borderRadius:"10px",padding:"8px",boxShadow:"0 12px 40px rgba(0,0,0,0.6)"}}>
              {!hasList && (
                <div style={{padding:"16px 12px",textAlign:"center",fontSize:"12px",color:"rgba(255,255,255,0.45)",fontWeight:"600"}}>{emptyLabel}</div>
              )}
              {hist.slice(0,20).map(item=>{

                // ── Follow-Up card row: client name + colored status, tap opens that client ──
                if (isFollowUp) {
                  const st = followUpStatus(item)
                  const meta = STATUS_META[st] || STATUS_META.new
                  return (
                    <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"8px",padding:"10px 12px",background:"#0a0a0e",borderRadius:"9px",marginBottom:"6px",border:"1px solid #1c1c24"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"9px",minWidth:"0",flex:"1"}}>
                        <span style={{width:"8px",height:"8px",borderRadius:"50%",background:meta.dot,flexShrink:"0"}}/>
                        <div style={{minWidth:"0"}}>
                          <div style={{fontSize:"12px",fontWeight:"700",color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.clientName||"Client"}</div>
                          <div style={{fontSize:"10px",color:meta.dot,fontWeight:"700",marginTop:"1px"}}>{meta.label}</div>
                        </div>
                      </div>
                      <button onClick={()=>setScreen({screen:"app2_results",savedResult:item})}
                        style={{background:"transparent",color:"#2AB8D4",border:"1px solid rgba(42,184,212,0.3)",borderRadius:"6px",padding:"5px 11px",fontSize:"10px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",flexShrink:"0"}}>
                        {isSpa?"Abrir →":"Open →"}
                      </button>
                    </div>
                  )
                }

                // ── Newsletter card row ──
                if (isNewsletter) {
                  const nlTitle = item.subject || (item.city ? (isSpa?"Newsletter de ":"Newsletter for ")+item.city : (isSpa?"Newsletter":"Newsletter"))
                  const nlSub = [item.city, item.savedAt].filter(Boolean).join(" · ")
                  return (
                    <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"8px",padding:"10px 12px",background:"#0a0a0e",borderRadius:"9px",marginBottom:"6px",border:"1px solid #1c1c24"}}>
                      <div style={{flex:"1",minWidth:"0"}}>
                        <div style={{fontSize:"12px",fontWeight:"700",color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nlTitle}</div>
                        <div style={{fontSize:"10px",color:"rgba(255,255,255,0.45)",marginTop:"2px",fontFamily:"DM Mono,monospace"}}>{nlSub}</div>
                      </div>
                      {item.result && (
                        <button onClick={()=>setScreen({screen:"app3",savedResult:item})}
                          style={{background:"transparent",color:"#2AB8D4",border:"1px solid rgba(42,184,212,0.3)",borderRadius:"6px",padding:"5px 11px",fontSize:"10px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",flexShrink:"0"}}>
                          {isSpa?"Abrir →":"Open →"}
                        </button>
                      )}
                    </div>
                  )
                }

                // ── App 01 (listings) and App 02 (clients) rows: name + reason/mode + date, NO status ──
                const lbl = isApp1 ? (item.address||(item.city?(isSpa?"Propiedad en ":"Property in ")+item.city:(isSpa?"Paquete ":"Package ")+item.savedAt)) : (item.clientName||"Client")
                const sub2 = isApp1 ? [item.mode,item.savedAt].filter(Boolean).join(" · ") : [(item.contactReason||"").replace(/_/g," "),item.savedAt].filter(Boolean).join(" · ")
                return (
                  <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"8px",padding:"10px 12px",background:"#0a0a0e",borderRadius:"9px",marginBottom:"6px",border:"1px solid #1c1c24"}}>
                    <div style={{flex:"1",minWidth:"0"}}>
                      <div style={{fontSize:"12px",fontWeight:"700",color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lbl}</div>
                      <div style={{fontSize:"10px",color:"rgba(255,255,255,0.45)",marginTop:"2px",fontFamily:"DM Mono,monospace",textTransform:"capitalize"}}>{sub2}</div>
                    </div>
                    {item.result && (
                      <button onClick={()=>setScreen({screen:isApp1?"app1_results":"app2_results",savedResult:item})}
                        style={{background:"transparent",color:"#2AB8D4",border:"1px solid rgba(42,184,212,0.3)",borderRadius:"6px",padding:"5px 11px",fontSize:"10px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",flexShrink:"0"}}>
                        {isSpa?"Abrir →":"Open →"}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
    </div>
  )
}
