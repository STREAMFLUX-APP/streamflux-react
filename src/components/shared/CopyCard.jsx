import { useState } from 'react'
import { G } from '../../globals.js'

export function CopyCard({ title, content, icon, accentColor, lang="English" }) {
  const [copied, setCopied] = useState(false)
  accentColor = accentColor || G.aqua

  const handleCopy = () => {
    navigator.clipboard.writeText(content||"")
    setCopied(true)
    setTimeout(()=>setCopied(false), 1800)
  }

  return (
    <div style={{
      background:G.bg, border:`1px solid ${G.aquaBorder}`,
      borderRadius:"10px", padding:"15px 17px", marginBottom:"10px",
      transition:"border-color 0.15s"
    }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=G.aqua}
      onMouseLeave={e=>e.currentTarget.style.borderColor=G.aquaBorder}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
        <span style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:accentColor,textTransform:"uppercase"}}>
          {icon} {title}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? G.aqua : "transparent",
            border:`1px solid ${G.aquaBorder}`,
            borderRadius:"6px",
            color: copied ? "#fff" : G.aqua,
            fontSize:"11px", padding:"4px 10px",
            cursor:"pointer", fontFamily:"inherit",
            transition:"all 0.15s", fontWeight:"600"
          }}
        >
          {copied ? (lang==="Spanish"?"✓ Copiado":"✓ Copied") : (lang==="Spanish"?"Copiar":"Copy")}
        </button>
      </div>
      <p style={{
        color:"rgba(240,240,248,0.95)", fontSize:"14px",
        lineHeight:"1.8", margin:"0", whiteSpace:"pre-wrap", fontFamily:"inherit"
      }}>
        {content||""}
      </p>
    </div>
  )
}
