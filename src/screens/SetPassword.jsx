import { useState } from 'react'
import { G } from '../globals.js'

export default function SetPassword({ state, setScreen }) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { resetToken:token, resetEmail:email } = state

  const handleSubmit = async () => {
    if (password.length < 8) { setError("Password must be at least 8 characters."); return }
    if (password !== confirm) { setError("Passwords do not match."); return }
    setError("")
    try {
      const res = await fetch("/api/set-password", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,email,password})})
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setSuccess(true)
      setTimeout(()=>{window.history.replaceState({},"",window.location.pathname);setScreen({screen:"login",resetToken:null,resetEmail:null})},2500)
    } catch(e) { setError("Something went wrong. Please try again.") }
  }

  const inp = {width:"100%",background:"#111118",border:"1px solid #222",borderRadius:"8px",padding:"12px 14px",fontSize:"14px",color:"#fff",fontFamily:"inherit",outline:"none"}

  return (
    <div style={{minHeight:"100vh",background:G.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{fontSize:"20px",fontWeight:"800",letterSpacing:"5px",color:G.white,marginBottom:"40px"}}>STREAM<span style={{color:G.aqua}}>FLUX</span></div>
      <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:"16px",padding:"40px 36px",width:"100%",maxWidth:"420px"}}>
        <h1 style={{fontSize:"22px",fontWeight:"700",color:G.white,marginBottom:"8px",textAlign:"center"}}>Set Your Password</h1>
        <p style={{fontSize:"14px",color:G.muted,marginBottom:"32px",textAlign:"center",lineHeight:"1.6"}}>{email?`Setting password for ${email}`:"Create a secure password for your Streamflux account."}</p>
        {error && <div style={{background:"rgba(255,80,80,0.08)",border:"1px solid rgba(255,80,80,0.25)",borderRadius:"8px",padding:"10px 14px",color:"#ff6b6b",fontSize:"13px",marginBottom:"16px"}}>{error}</div>}
        {success && <div style={{background:"rgba(42,184,212,0.08)",border:`1px solid ${G.aquaBorder}`,borderRadius:"8px",padding:"16px",color:G.aqua,fontSize:"13px",marginBottom:"16px",textAlign:"center",lineHeight:"1.7"}}>✅ Password set successfully!<br/><br/>You can now log in with your email and new password.</div>}
        {!success && <>
          <div style={{marginBottom:"16px"}}>
            <label style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:G.muted,display:"block",marginBottom:"6px"}}>New Password</label>
            <input type="password" placeholder="Minimum 8 characters" style={inp} value={password} onChange={e=>setPassword(e.target.value)}/>
          </div>
          <div style={{marginBottom:"24px"}}>
            <label style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:G.muted,display:"block",marginBottom:"6px"}}>Confirm Password</label>
            <input type="password" placeholder="Repeat your password" style={inp} value={confirm} onChange={e=>setConfirm(e.target.value)}/>
          </div>
          <button onClick={handleSubmit} style={{background:G.aqua,color:"#060608",border:"none",borderRadius:"8px",padding:"14px",fontSize:"14px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>Set Password</button>
        </>}
        <div style={{textAlign:"center",marginTop:"20px"}}>
          <span onClick={()=>{window.history.replaceState({},"",window.location.pathname);setScreen({screen:"login"})}} style={{fontSize:"13px",color:G.muted,cursor:"pointer",textDecoration:"underline"}}>Back to login</span>
        </div>
      </div>
      <p style={{fontSize:"12px",color:"rgba(255,255,255,0.2)",marginTop:"32px",textAlign:"center"}}>Streamflux AI LTD — Registered in England and Wales</p>
    </div>
  )
}
