import { G } from '../../globals.js'

export function Nav({ onBack, backLabel="← Dashboard", rightContent, sticky=true }) {
  return (
    <div style={{
      background: G.bg1,
      borderBottom:`1px solid ${G.border}`,
      padding:"0 22px",
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      height:"56px",
      position: sticky ? "sticky" : "relative",
      top:"0",
      zIndex:"1000"
    }}>
      <span style={{fontSize:"14px",fontWeight:"800",letterSpacing:"3px",color:G.white}}>
        STREAM<span style={{color:G.aqua}}>FLUX</span>
      </span>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        {rightContent}
        <button
          onClick={onBack}
          style={{
            background:"transparent", color:G.muted,
            border:`1px solid ${G.border}`, borderRadius:"8px",
            padding:"6px 14px", fontSize:"12px",
            cursor:"pointer", fontFamily:"inherit"
          }}
        >
          {backLabel}
        </button>
      </div>
    </div>
  )
}
