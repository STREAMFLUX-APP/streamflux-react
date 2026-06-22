import { useState } from 'react'
import { G, GL, apiAuth, inputStyle, cardStyle, labelStyle, btnStyle } from '../globals.js'
const LANGS = [{value:"English",label:"🇺🇸 English"},{value:"Spanish",label:"🇪🇸 Español"}]
export default function Login({ state, setScreen }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const g = GL[state.lang] || GL.English
  const handleLogin = async () => {
    if (!email || !password) { setError("Email and password required"); return }
    setLoading(true); setError("")
    const res = await apiAuth({action:"login", email, password})
    setLoading(false)
    if (res.success) {
      sessionStorage.setItem("sf_user", JSON.stringify(res.user))
      setScreen({screen:"dashboard", user:res.user})
    } else {
      setError(res.error || "Login failed.")
    }
  }
  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"24px", background:G.bg,
      backgroundImage:"radial-gradient(circle at 50% 20%,rgba(42,184,212,0.06) 0%,transparent 50%)"
    }}>
      <div style={{width:"100%", maxWidth:"420px"}}>
        <div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"28px"}}>
          {LANGS.map(l => (
            <button key={l.value}
              onClick={() => setScreen({lang:l.value})}
              style={{
                background: state.lang===l.value ? G.aqua : "transparent",
                color: state.lang===l.value ? "#ffffff" : G.muted,
                border:`1px solid ${state.lang===l.value ? G.aqua : G.border}`,
                borderRadius:"100px", padding:"6px 16px",
                fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit"
              }}
            >{l.label}</button>
          ))}
        </div>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{fontSize:"28px",fontWeight:"700",letterSpacing:"3px",color:G.white,marginBottom:"8px"}}>
            STREAM<span style={{color:G.aqua}}>FLUX</span>
          </div>
          <p style={{color:G.muted,fontSize:"14px"}}>{g.tagline}</p>
        </div>
        <div style={cardStyle}>
          <h2 style={{fontSize:"18px",fontWeight:"700",marginBottom:"20px",color:G.white}}>{g.signIn}</h2>
          <div style={{marginBottom:"16px"}}>
            <label style={labelStyle}>{g.emailLabel}</label>
            <input type="email" placeholder="your@email.com" style={inputStyle}
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && document.getElementById("sf-pass").focus()}
            />
          </div>
          <div style={{marginBottom:"16px"}}>
            <label style={labelStyle}>{g.passLabel}</label>
            <input id="sf-pass" type="password" placeholder="••••••••" style={inputStyle}
              value={password} onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && handleLogin()}
            />
          </div>
          {error && (
            <div style={{background:"#fff0f0",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"8px",padding:"10px 14px",color:"#dc2626",fontSize:"13px",marginBottom:"14px"}}>
              ⚠ {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{...btnStyle(loading),width:"100%",fontSize:"15px"}}
          >
            {loading ? g.signingIn : g.signInBtn}
          </button>
          <p style={{textAlign:"center",color:G.muted,fontSize:"12px",marginTop:"16px"}}>
            {g.noAccount} <span style={{color:G.aqua}}>francisco@streamflux.app</span>
          </p>
        </div>
      </div>
    </div>
  )
}
