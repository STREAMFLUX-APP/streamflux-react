import { G, inputStyle } from '../../globals.js'

export function Chips({ label, hint, options, selected, onToggle, single }) {
  return (
    <div style={{marginBottom:"20px"}}>
      {label && <label style={{display:"block",fontSize:"10px",fontWeight:"700",letterSpacing:"0.15em",color:"#fff",textTransform:"uppercase",marginBottom:"5px"}}>{label}</label>}
      {hint && <p style={{fontSize:"12px",color:"#444",margin:"0 0 7px",fontStyle:"italic"}}>{hint}</p>}
      <div style={{display:"flex",flexWrap:"wrap",gap:"7px",marginTop:"10px"}}>
        {options.map(opt => {
          const val = typeof opt==="string" ? opt : opt.value
          const lbl = typeof opt==="string" ? opt : opt.label
          const sub = typeof opt==="object" ? opt.desc : null
          const active = single ? selected===val : (selected||[]).includes(val)
          return (
            <button
              key={val}
              onClick={(e)=>{e.preventDefault();e.stopPropagation();onToggle(val)}}
              onTouchEnd={(e)=>{e.preventDefault();onToggle(val)}}
              style={{
                background: active ? G.aquaDim : G.bg,
                border: "1px solid "+(active ? G.aqua : "rgba(42,184,212,0.18)"),
                borderRadius:"8px",
                color: active ? G.aqua : "rgba(255,255,255,0.65)",
                fontSize:"12px",
                padding: sub ? "10px 14px" : "7px 12px",
                cursor:"pointer",
                fontFamily:"inherit",
                textAlign:"left",
                WebkitTapHighlightColor:"rgba(42,184,212,0.3)",
                touchAction:"manipulation",
                userSelect:"none",
                WebkitUserSelect:"none",
              }}
            >
              <div style={{fontWeight:active?"700":"400"}}>{lbl}</div>
              {sub && <div style={{fontSize:"11px",color:active?"rgba(42,184,212,0.7)":G.muted,marginTop:"2px"}}>{sub}</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
