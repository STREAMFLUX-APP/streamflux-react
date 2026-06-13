// ── GLOBAL CONSTANTS ─────────────────────────────────────
export const G = {
  bg:"#060608", bg1:"#0c0c10", bg2:"#111118",
  card:"#111", border:"#222", border2:"#252530",
  aqua:"#2AB8D4", aquaDim:"rgba(42,184,212,0.1)",
  aquaBorder:"rgba(42,184,212,0.25)",
  gold:"#D4A843", white:"#ffffff",
  muted:"rgba(255,255,255,0.5)",
  green:"#3d9e5c", red:"#ef4444"
};

export const GL = {
  English:{
    tagline:"AI-Powered Real Estate Marketing",
    signIn:"Sign In to Your Account",
    emailLabel:"Email Address", passLabel:"Password",
    signingIn:"Signing in...", signInBtn:"Sign In →",
    noAccount:"Don't have an account? Contact",
    signOut:"Sign Out", admin:"⚙️ Admin",
    daysLeft:"days left", active:"✓ Active",
    newListing:"🚀 New Listing →", newClient:"🤝 New Client →",
    app1title:"Property Marketing Machine",
    app1sub:"Complete listing package in minutes — every platform covered",
    app2title:"Client Outreach Machine",
    app2sub:"Personalised outreach for any client, any situation.",
    app3title:"Newsletter Generator",
    app3sub:"Monthly client newsletter ready to send.",
    langInstr:"",
  },
  Spanish:{
    tagline:"Marketing Inmobiliario con Inteligencia Artificial",
    signIn:"Iniciar Sesión en Tu Cuenta",
    emailLabel:"Correo Electrónico", passLabel:"Contraseña",
    signingIn:"Iniciando sesión...", signInBtn:"Iniciar Sesión →",
    noAccount:"¿No tienes cuenta? Contacta a",
    signOut:"Cerrar Sesión", admin:"⚙️ Admin",
    daysLeft:"días restantes", active:"✓ Activo",
    newListing:"🚀 Nueva Propiedad →", newClient:"🤝 Nuevo Cliente →",
    app1title:"Máquina de Marketing Inmobiliario",
    app1sub:"13 contenidos. Todas las plataformas. Minutos.",
    app2title:"Máquina de Captación de Clientes",
    app2sub:"Mensajes personalizados para cualquier cliente.",
    app3title:"Generador de Newsletter",
    app3sub:"Newsletter mensual listo para enviar.",
    newNewsletter:"+ Nuevo Newsletter",
    langInstr:"CRÍTICO: Escribe TODO el contenido completamente en español. Ni una sola palabra en inglés.",
  }
};

// ── API HELPERS ───────────────────────────────────────────
export const apiAuth = async (body) => {
  try {
    const r = await fetch("/api/auth", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
    return r.json();
  } catch(e) { return {error:e.message}; }
};

export const apiAdmin = async (body) => {
  try {
    const r = await fetch("/api/admin", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
    const text = await r.text();
    try { return JSON.parse(text); } catch(e) { return {error:"Server error: "+text.slice(0,100)}; }
  } catch(e) { return {error:e.message}; }
};

export const apiClaude = async (prompt, system, maxTokens=1000) => {
  try {
    const r = await fetch("/api/claude", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({prompt, system, maxTokens})});
    const d = await r.json();
    if(d.error) throw new Error(d.error);
    let t = (d.text||"").trim();
    t = t.replace(/^(Here is|Here's|The JSON|JSON:|Result:|Output:)[^\{]*/i,"").trim();
    try { return JSON.parse(t); } catch{}
    const cm = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    if(cm) { try { return JSON.parse(cm[1].trim()); } catch{} }
    const matches = t.match(/\{[\s\S]*\}/g);
    if(matches) {
      for(const m of matches.sort((a,b)=>b.length-a.length)) {
        try { return JSON.parse(m); } catch{}
      }
    }
    try {
      let fixed = t;
      const opens = (fixed.match(/\{/g)||[]).length;
      const closes = (fixed.match(/\}/g)||[]).length;
      if(opens>closes) fixed += "}".repeat(opens-closes);
      fixed = fixed.replace(/,\s*\}/g,"}").replace(/,\s*\]/g,"]");
      return JSON.parse(fixed);
    } catch{}
    throw new Error("Could not parse AI response. Please try again.");
  } catch(e) {
    console.error("apiClaude error:", e.message);
    throw e;
  }
};

// ── LOCAL STORAGE ─────────────────────────────────────────
export const SF = {
  getListings: () => { try { return JSON.parse(localStorage.getItem("sf_listings")||"[]"); } catch { return []; } },
  saveListings: (arr) => localStorage.setItem("sf_listings", JSON.stringify(arr.slice(0,10))),
  getClients: () => { try { return JSON.parse(localStorage.getItem("sf_clients")||"[]"); } catch { return []; } },
  saveClients: (arr) => localStorage.setItem("sf_clients", JSON.stringify(arr.slice(0,50))),
  addListing: (listing) => { const arr=SF.getListings(); arr.unshift({...listing,id:Date.now(),savedAt:new Date().toLocaleDateString()}); SF.saveListings(arr); },
  addClient: (client) => {
    const arr=SF.getClients();
    const rec={...client,id:Date.now(),savedAt:new Date().toLocaleDateString(),status:client.status||"new",sentAt:client.sentAt||null};
    arr.unshift(rec);
    SF.saveClients(arr);
    return rec;
  },
  updateClient: (id, updates) => {
    const arr=SF.getClients();
    const i=arr.findIndex(c=>c.id===id);
    if(i===-1) return null;
    arr[i]={...arr[i],...updates};
    SF.saveClients(arr);
    return arr[i];
  },
};

// ── FOLLOW-UP STATUS ──────────────────────────────────────
// Derives the live status of a client for the Follow-Up Engine.
// Returns one of: "new" | "awaiting" | "overdue" | "active" | "closed"
export const followUpStatus = (client) => {
  const st = client?.status || "new";
  if (st === "closed") return "closed";
  if (st === "active") return "active";
  if (st === "awaiting") {
    if (client.sentAt && (Date.now() - client.sentAt) >= 3*864e5) return "overdue";
    return "awaiting";
  }
  return "new";
};

// Visual meta for each status — colored dot + label (no emoji, on-brand).
export const STATUS_META = {
  new:      { dot:"#5a5a66", label:"Not sent yet" },
  awaiting: { dot:"#D4A843", label:"Awaiting reply" },
  overdue:  { dot:"#ef4444", label:"Follow-up overdue" },
  active:   { dot:"#3d9e5c", label:"Active" },
  closed:   { dot:"#2AB8D4", label:"Closed" },
};

// ── SHARED STYLES ─────────────────────────────────────────
export const inputStyle = {
  width:"100%", background:G.bg, border:`1px solid ${G.border2}`,
  borderRadius:"8px", color:"rgba(255,255,255,0.65)", fontSize:"14px",
  padding:"11px 14px", outline:"none", fontFamily:"inherit",
  boxSizing:"border-box", transition:"border-color 0.2s",
  WebkitTextFillColor:"rgba(255,255,255,0.55)"
};

export const cardStyle = {
  background:G.bg1, border:`1px solid ${G.border2}`, borderRadius:"12px",
  padding:"22px", marginBottom:"16px",
  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.025),0 1px 3px rgba(0,0,0,0.3)"
};

export const labelStyle = {
  display:"block", fontSize:"10px", fontWeight:"700",
  letterSpacing:"0.15em", color:"#ffffff",
  textTransform:"uppercase", marginBottom:"5px"
};

export const btnStyle = (disabled, color) => ({
  background: disabled ? "#1a1a1a" : color||G.aqua,
  color: disabled ? G.muted : "#060608",
  border:"none", borderRadius:"8px", padding:"13px 24px",
  fontSize:"14px", fontWeight:"700",
  cursor: disabled ? "not-allowed" : "pointer",
  fontFamily:"inherit", display:"inline-block"
});
