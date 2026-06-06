import { inputStyle, labelStyle } from '../../globals.js'

export function Field({ label, type='text', value, onChange, placeholder, hint }) {
  return (
    <div style={{marginBottom:"16px"}}>
      {label && <label style={labelStyle}>{label}</label>}
      {hint && <p style={{fontSize:"12px",color:"#444",margin:"0 0 5px",fontStyle:"italic"}}>{hint}</p>}
      <input
        type={type}
        placeholder={placeholder}
        value={value||""}
        onChange={e=>onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  )
}

export function TextArea({ label, value, onChange, placeholder, rows=3, hint }) {
  return (
    <div style={{marginBottom:"16px"}}>
      {label && <label style={labelStyle}>{label}</label>}
      {hint && <p style={{fontSize:"12px",color:"#444",margin:"0 0 5px",fontStyle:"italic"}}>{hint}</p>}
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value||""}
        onChange={e=>onChange(e.target.value)}
        style={{...inputStyle,resize:"vertical"}}
      />
    </div>
  )
}
