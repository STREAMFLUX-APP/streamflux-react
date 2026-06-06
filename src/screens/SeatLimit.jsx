import { G, btnStyle } from '../globals.js'

export default function SeatLimit({ state, setScreen }) {
  const { user } = state
  const upgrades = {starter:{next:"Pro",price:"$599/mo",seats:25},pro:{next:"Elite",price:"$899/mo",seats:50},elite:{next:"Enterprise",price:"$1,299/mo",seats:"Unlimited"}}
  const upgrade = upgrades[user?.plan] || null
  return (
    <div style={{minHeight:"100vh",background:G.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",textAlign:"center"}}>
      <div style={{fontSize:"20px",fontWeight:"800",letterSpacing:"5px",color:G.white,marginBottom:"48px"}}>STREAM<span style={{color:G.aqua}}>FLUX</span></div>
      <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:"16px",padding:"48px 40px",maxWidth:"460px",width:"100%"}}>
        <div style={{fontSize:"40px",marginBottom:"16px"}}>👥</div>
        <h1 style={{fontSize:"22px",fontWeight:"700",color:G.white,marginBottom:"12px"}}>You've reached your seat limit</h1>
        <p style={{fontSize:"14px",color:G.muted,lineHeight:"1.7",marginBottom:"28px"}}>Your {user?.plan||"current"} plan allows up to {user?.seatLimit} agents. Upgrade to add more.</p>
        {upgrade && (
          <>
            <div style={{background:G.bg,border:`1px solid ${G.aqua}`,borderRadius:"12px",padding:"20px",marginBottom:"20px",textAlign:"left"}}>
              <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"2px",color:G.aqua,marginBottom:"6px"}}>UPGRADE TO {upgrade.next.toUpperCase()}</div>
              <div style={{fontSize:"24px",fontWeight:"800",color:G.white,fontFamily:"DM Mono,monospace",marginBottom:"4px"}}>{upgrade.price}</div>
              <div style={{fontSize:"13px",color:G.muted}}>Up to {upgrade.seats} agents</div>
            </div>
            <button onClick={()=>window.open("https://streamflux.app/#pricing","_blank")} style={{...btnStyle(false),width:"100%",padding:"14px",fontSize:"14px",marginBottom:"12px"}}>Upgrade to {upgrade.next} →</button>
          </>
        )}
        <button onClick={()=>setScreen({screen:"dashboard"})} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:"8px",padding:"10px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>← Back to Dashboard</button>
      </div>
    </div>
  )
}
