import { G, btnStyle } from '../globals.js'

export default function TrialExpired({ setScreen }) {
  const plans = [["Starter","$399/mo","Up to 10 agents"],["Pro","$599/mo","Up to 25 agents"],["Elite","$899/mo","Up to 50 agents"],["Enterprise","$1,299/mo","Unlimited agents"]]
  return (
    <div style={{minHeight:"100vh",background:G.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",textAlign:"center"}}>
      <div style={{fontSize:"20px",fontWeight:"800",letterSpacing:"5px",color:G.white,marginBottom:"48px"}}>STREAM<span style={{color:G.aqua}}>FLUX</span></div>
      <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:"16px",padding:"48px 40px",maxWidth:"460px",width:"100%"}}>
        <div style={{fontSize:"40px",marginBottom:"16px"}}>⏰</div>
        <h1 style={{fontSize:"24px",fontWeight:"700",color:G.white,marginBottom:"12px",lineHeight:"1.3"}}>Your free trial has ended</h1>
        <p style={{fontSize:"14px",color:G.muted,lineHeight:"1.7",marginBottom:"32px"}}>Subscribe now to keep your team generating marketing, outreach and newsletters in minutes.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"28px"}}>
          {plans.map(([name,price,desc])=>(
            <div key={name} style={{background:G.bg,border:`1px solid ${G.border}`,borderRadius:"10px",padding:"14px 12px",textAlign:"left"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:G.aqua,marginBottom:"4px"}}>{name.toUpperCase()}</div>
              <div style={{fontSize:"18px",fontWeight:"800",color:G.white,fontFamily:"DM Mono,monospace",marginBottom:"2px"}}>{price}</div>
              <div style={{fontSize:"11px",color:G.muted}}>{desc}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>window.open("https://streamflux.app/#pricing","_blank")} style={{...btnStyle(false),width:"100%",padding:"14px",fontSize:"14px",marginBottom:"14px"}}>Subscribe Now →</button>
        <button onClick={()=>{sessionStorage.removeItem("sf_user");setScreen({screen:"login",user:null})}} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"10px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>Sign Out</button>
      </div>
      <p style={{fontSize:"12px",color:"rgba(255,255,255,0.15)",marginTop:"28px"}}>Questions? Contact francisco@streamflux.app</p>
    </div>
  )
}
