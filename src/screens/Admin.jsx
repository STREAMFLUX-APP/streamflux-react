import { useState } from 'react'
import { G, apiAdmin, inputStyle, cardStyle, labelStyle, btnStyle } from '../globals.js'

export default function Admin({ state: appState, setScreen }) {
  const [adminKey, setAdminKey] = useState("")
  const [authed, setAuthed] = useState(false)
  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState("")
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [plan, setPlan] = useState("bundle"); const [trialDays, setTrialDays] = useState("7")

  const inp = {...inputStyle, marginBottom:"0"}

  const auth = async () => {
    if (!adminKey) { setMsg("❌ Enter your admin key."); return }
    const res = await apiAdmin({adminKey, action:"list_users"})
    if (res.success) { setAuthed(true); setUsers(res.users||[]); setMsg("") }
    else setMsg("❌ "+(res.error||"Wrong admin key"))
  }

  const addUser = async () => {
    if (!name||!email||!password) { setMsg("❌ Fill in all fields."); return }
    const res = await apiAdmin({adminKey, action:"add_user", name, email, password, plan, trialDays:parseInt(trialDays)})
    if (res.success) { setMsg("✅ Client added: "+res.user.email); setName(""); setEmail(""); setPassword("") }
    else setMsg("❌ "+res.error)
    const r2 = await apiAdmin({adminKey, action:"list_users"})
    if (r2.success) setUsers(r2.users)
  }

  const markPaid = async (userId) => { await apiAdmin({adminKey,action:"subscribe_user",userId}); setMsg("✅ Marked as paid."); const r=await apiAdmin({adminKey,action:"list_users"});if(r.success)setUsers(r.users) }
  const deactivate = async (userId, uname) => { if(!confirm(`Deactivate ${uname}?`))return; await apiAdmin({adminKey,action:"deactivate_user",userId}); setMsg("✅ Deactivated."); const r=await apiAdmin({adminKey,action:"list_users"});if(r.success)setUsers(r.users) }
  const activate = async (userId) => { await apiAdmin({adminKey,action:"activate_user",userId}); setMsg("✅ Activated."); const r=await apiAdmin({adminKey,action:"list_users"});if(r.success)setUsers(r.users) }

  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      <div style={{background:G.card,borderBottom:`1px solid ${G.border}`,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:"15px",fontWeight:"700",color:G.white}}>⚙️ Admin Panel</span>
        <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>← Dashboard</button>
      </div>
      <div style={{maxWidth:"900px",margin:"0 auto",padding:"32px 20px 60px"}}>
        {msg && <div style={{background:msg.startsWith("✅")?"#0a1f0a":"#1a0808",border:`1px solid ${msg.startsWith("✅")?"#3d9e5c":"#3a1010"}`,borderRadius:"8px",padding:"10px 14px",color:msg.startsWith("✅")?"#4ade80":"#f87171",fontSize:"13px",marginBottom:"16px"}}>{msg}</div>}

        {!authed ? (
          <div style={cardStyle}>
            <h2 style={{fontSize:"18px",fontWeight:"700",marginBottom:"16px",color:G.white}}>⚙️ Admin Panel</h2>
            <input type="password" placeholder="Enter admin secret key" style={{...inp,marginBottom:"12px"}} value={adminKey} onChange={e=>setAdminKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&auth()}/>
            <button onClick={auth} style={{...btnStyle(false),width:"100%",fontSize:"15px"}}>Access Admin →</button>
          </div>
        ) : (
          <>
            {/* Add user */}
            <div style={cardStyle}>
              <h3 style={{fontSize:"16px",fontWeight:"700",color:G.white,marginBottom:"16px"}}>➕ Add New Client</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
                {[["Full Name","text",name,setName,"Sarah Johnson"],["Email","email",email,setEmail,"sarah@email.com"],["Password","text",password,setPassword,"Welcome2024!"],["Trial Days","number",trialDays,setTrialDays,"7"]].map(([lbl,type,val,setter,ph])=>(
                  <div key={lbl}><label style={labelStyle}>{lbl}</label><input type={type} placeholder={ph} style={inp} value={val} onChange={e=>setter(e.target.value)}/></div>
                ))}
              </div>
              <div style={{marginBottom:"16px"}}>
                <label style={labelStyle}>Plan</label>
                <select value={plan} onChange={e=>setPlan(e.target.value)} style={{...inp,cursor:"pointer"}}>
                  <option value="marketing">Marketing Tool — App 1 only</option>
                  <option value="outreach">Outreach Tool — App 2 only</option>
                  <option value="bundle">Complete Bundle — Both Apps</option>
                  <option value="starter">Agency Starter — $399/mo</option>
                  <option value="pro">Agency Pro — $599/mo</option>
                  <option value="elite">Agency Elite — $899/mo</option>
                  <option value="enterprise">Agency Enterprise — $1,299/mo</option>
                </select>
              </div>
              <button onClick={addUser} style={btnStyle(false)}>Add Client →</button>
            </div>

            {/* Users list */}
            <div style={cardStyle}>
              <h3 style={{fontSize:"16px",fontWeight:"700",color:G.white,marginBottom:"16px"}}>👥 All Clients ({users.length})</h3>
              {users.length===0 ? <p style={{color:G.muted,fontSize:"14px"}}>No clients yet.</p> : users.map(u=>{
                const trial = new Date(u.trial_ends_at); const now = new Date()
                const trialActive = now < trial
                const daysLeft = trialActive ? Math.ceil((trial-now)/(1000*60*60*24)) : 0
                return (
                  <div key={u.id} style={{background:"#0d0d0d",border:`1px solid ${G.border}`,borderRadius:"10px",padding:"14px 16px",marginBottom:"10px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"10px"}}>
                      <div>
                        <div style={{fontWeight:"700",color:G.white,fontSize:"14px"}}>{u.name}</div>
                        <div style={{color:G.muted,fontSize:"12px",marginTop:"2px"}}>{u.email}</div>
                        <div style={{display:"flex",gap:"8px",marginTop:"6px",flexWrap:"wrap"}}>
                          <span style={{fontSize:"11px",background:G.aquaDim,border:`1px solid ${G.aquaBorder}`,borderRadius:"100px",padding:"2px 10px",color:G.aqua,fontWeight:"600"}}>{u.plan}</span>
                          {u.subscribed && <span style={{fontSize:"11px",background:"rgba(61,158,92,0.1)",border:"1px solid rgba(61,158,92,0.3)",borderRadius:"100px",padding:"2px 10px",color:"#4ade80",fontWeight:"600"}}>✓ Paid</span>}
                          {trialActive&&!u.subscribed && <span style={{fontSize:"11px",background:"rgba(212,168,67,0.1)",border:"1px solid rgba(212,168,67,0.3)",borderRadius:"100px",padding:"2px 10px",color:G.gold,fontWeight:"600"}}>Trial: {daysLeft}d left</span>}
                          {!trialActive&&!u.subscribed && <span style={{fontSize:"11px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"100px",padding:"2px 10px",color:G.red,fontWeight:"600"}}>Trial Expired</span>}
                          {!u.active && <span style={{fontSize:"11px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"100px",padding:"2px 10px",color:G.red,fontWeight:"600"}}>Deactivated</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                        {!u.subscribed && <button onClick={()=>markPaid(u.id)} style={{background:"transparent",color:G.green,border:`1px solid ${G.green}`,borderRadius:"8px",padding:"5px 12px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>Mark Paid</button>}
                        {u.active ? <button onClick={()=>deactivate(u.id,u.name)} style={{background:"transparent",color:G.red,border:`1px solid ${G.red}`,borderRadius:"8px",padding:"5px 12px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>Deactivate</button>
                        : <button onClick={()=>activate(u.id)} style={{background:"transparent",color:G.green,border:`1px solid ${G.green}`,borderRadius:"8px",padding:"5px 12px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>Activate</button>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
