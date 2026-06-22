import { useState, useEffect } from 'react'
import { G, btnStyle } from '../globals.js'

export default function BrokerDashboard({ state: appState, setScreen }) {
  const { user } = appState
  const [agents, setAgents] = useState([])
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")

  if (!user?.subscribed && !user?.trialActive) {
    setTimeout(()=>setScreen({screen:"trial-expired"}),0)
    return null
  }

  const seatLimit = user.seatLimit||(user.plan==="pro"?25:user.plan==="elite"?50:user.plan==="enterprise"?9999:10)
  const seatsUsed = agents.length
  const seatsLeft = seatLimit===9999?"∞":(seatLimit-seatsUsed)

  useEffect(()=>{
    fetch("/api/agents?brokerEmail="+encodeURIComponent(user.email))
      .then(r=>r.ok?r.json():Promise.reject())
      .then(d=>{if(d.agents)setAgents(d.agents)})
      .catch(()=>{
        const saved = JSON.parse(localStorage.getItem(`sf_agents_${user.email}`)||"[]")
        setAgents(saved)
      })
  },[])

  const addAgent = async () => {
    if (!newName||!newEmail) { alert("Please enter both name and email."); return }
    if (seatsUsed>=seatLimit&&seatLimit!==9999) { setScreen({screen:"seat-limit"}); return }
    if (agents.find(a=>a.email===newEmail)) { alert("An agent with this email already exists."); return }
    const newAgent = {name:newName,email:newEmail,addedAt:new Date().toISOString(),status:"pending"}
    const updated = [...agents, newAgent]
    setAgents(updated)
    localStorage.setItem(`sf_agents_${user.email}`, JSON.stringify(updated))
    try { await fetch("/api/agents",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({brokerEmail:user.email,agentName:newName,agentEmail:newEmail,plan:user.plan})}) } catch(e) {}
    setNewName(""); setNewEmail("")
  }

  const removeAgent = async (agent, i) => {
    if (!confirm(`Remove ${agent.name} from your team?`)) return
    const updated = agents.filter((_,idx)=>idx!==i)
    setAgents(updated)
    localStorage.setItem(`sf_agents_${user.email}`, JSON.stringify(updated))
    try { await fetch("/api/agents",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({brokerEmail:user.email,agentEmail:agent.email})}) } catch(e) {}
  }

  const inp = {width:"100%",background:"#f0f0f2",border:"1px solid #e2e2e6",borderRadius:"8px",padding:"10px 12px",fontSize:"13px",color:"rgba(0,0,0,0.75)",fontFamily:"inherit",outline:"none",WebkitTextFillColor:"rgba(0,0,0,0.7)"}
  const lbl = {fontSize:"10px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:G.white,display:"block",marginBottom:"6px"}

  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      <div style={{background:G.card,borderBottom:`1px solid ${G.border}`,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"60px",position:"sticky",top:"0",zIndex:"9999"}}>
        <div style={{fontSize:"17px",fontWeight:"800",letterSpacing:"5px",color:G.white}}>STREAM<span style={{color:G.aqua}}>FLUX</span></div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{background:G.aquaDim,border:`1px solid ${G.aquaBorder}`,borderRadius:"100px",padding:"4px 14px",fontSize:"11px",fontWeight:"700",color:G.aqua}}>{(user.plan||"Starter").toUpperCase()}</div>
          <button onClick={()=>window.open("https://billing.stripe.com/p/login","_blank")} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>Manage Billing</button>
          <button onClick={()=>{sessionStorage.removeItem("sf_user");setScreen({screen:"login",user:null})}} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>Sign Out</button>
        </div>
      </div>

      <div style={{maxWidth:"980px",margin:"0 auto",padding:"40px 28px 100px"}}>
        <div style={{marginBottom:"40px",paddingBottom:"36px",borderBottom:`1px solid ${G.border}`}}>
          <h1 style={{fontSize:"clamp(18px,2.5vw,26px)",fontWeight:"700",color:G.white,marginBottom:"6px"}}>Welcome, {user.name||"Broker"}</h1>
          <p style={{fontSize:"14px",color:G.muted}}>{user.agencyName||user.name||"your agency"} · {user.plan||"Starter"} Plan</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1px",background:G.border,borderRadius:"12px",overflow:"hidden",marginBottom:"40px",border:`1px solid ${G.border}`}}>
          {[[String(seatsUsed),"Agents Active","Currently on your team"],[String(seatLimit===9999?"∞":seatLimit),"Total Seats","Included in your plan"],[String(seatsLeft),"Seats Available","You can still add"]].map(([num,label,sub])=>(
            <div key={label} style={{background:G.bg1,padding:"24px 20px"}}>
              <div style={{fontSize:"28px",fontWeight:"800",color:G.aqua,fontFamily:"DM Mono,monospace",marginBottom:"4px"}}>{num}</div>
              <div style={{fontSize:"12px",fontWeight:"700",color:G.white,marginBottom:"2px"}}>{label}</div>
              <div style={{fontSize:"11px",color:G.muted}}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.2em",textTransform:"uppercase",color:G.white,marginBottom:"16px",display:"flex",alignItems:"center",gap:"12px"}}>
          YOUR TEAM <div style={{flex:"1",height:"1px",background:G.border}}/>
        </div>

        <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:"14px",overflow:"hidden",marginBottom:"32px"}}>
          <div style={{padding:"24px 28px",borderBottom:`1px solid ${G.border}`}}>
            <div style={{fontSize:"13px",fontWeight:"700",color:G.white,marginBottom:"14px"}}>Add a New Agent</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:"10px",alignItems:"end"}}>
              <div><label style={lbl}>Full Name</label><input type="text" placeholder="Sarah Johnson" style={inp} value={newName} onChange={e=>setNewName(e.target.value)}/></div>
              <div><label style={lbl}>Email Address</label><input type="email" placeholder="sarah@agency.com" style={inp} value={newEmail} onChange={e=>setNewEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAgent()}/></div>
              <button onClick={addAgent} style={{...btnStyle(false),whiteSpace:"nowrap",padding:"10px 20px",fontSize:"13px"}}>+ Add Agent</button>
            </div>
          </div>

          <div style={{padding:"8px 0"}}>
            {agents.length===0 ? (
              <div style={{padding:"32px 28px",textAlign:"center",color:G.muted,fontSize:"13px"}}>
                <div style={{fontSize:"28px",marginBottom:"8px"}}>👥</div>
                No agents yet. Add your first agent above.
              </div>
            ) : agents.map((agent,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:i<agents.length-1?`1px solid ${G.border}`:"none"}}>
                <div>
                  <div style={{fontSize:"13px",fontWeight:"700",color:G.white,marginBottom:"2px"}}>{agent.name}</div>
                  <div style={{fontSize:"12px",color:G.muted}}>{agent.email}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{background:agent.status==="active"?G.aquaDim:"rgba(0,0,0,0.05)",border:`1px solid ${agent.status==="active"?G.aquaBorder:G.border}`,borderRadius:"100px",padding:"3px 10px",fontSize:"10px",fontWeight:"700",color:agent.status==="active"?G.aqua:G.muted}}>{(agent.status==="active"?"ACTIVE":"PENDING").toUpperCase()}</div>
                  <button onClick={()=>removeAgent(agent,i)} style={{background:"transparent",color:"rgba(220,38,38,0.8)",border:"1px solid rgba(220,38,38,0.25)",borderRadius:"6px",padding:"4px 10px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
