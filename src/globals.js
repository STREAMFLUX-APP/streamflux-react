// ── GLOBAL CONSTANTS ─────────────────────────────────────
export const G = {
  bg:"#ffffff", bg1:"#f5f5f7", bg2:"#ebebed",
  card:"#f5f5f7", border:"#e0e0e4", border2:"#e2e2e6",
  aqua:"#2AB8D4", aquaDim:"rgba(42,184,212,0.1)",
  aquaBorder:"rgba(42,184,212,0.35)",
  gold:"#D4A843", white:"#0a0a0a",
  muted:"rgba(0,0,0,0.5)",
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
    newListing:"New Listing →", newClient:"New Client →",
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
    newListing:"Nueva Propiedad →", newClient:"Nuevo Cliente →",
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
  getNewsletters: () => { try { return JSON.parse(localStorage.getItem("sf_newsletters")||"[]"); } catch { return []; } },
  saveNewsletters: (arr) => localStorage.setItem("sf_newsletters", JSON.stringify(arr.slice(0,10))),
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
  addNewsletter: (newsletter) => {
    const arr=SF.getNewsletters();
    const rec={...newsletter,id:Date.now(),savedAt:new Date().toLocaleDateString()};
    arr.unshift(rec);
    SF.saveNewsletters(arr);
    return rec;
  },
};

// ── FOLLOW-UP STATUS ──────────────────────────────────────
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

export const STATUS_META = {
  new:      { dot:"#5a5a66", label:"Not sent yet" },
  awaiting: { dot:"#D4A843", label:"Awaiting reply" },
  overdue:  { dot:"#ef4444", label:"Follow-up overdue" },
  active:   { dot:"#3d9e5c", label:"Active" },
  closed:   { dot:"#2AB8D4", label:"Closed" },
};

// ── SHARED STYLES ─────────────────────────────────────────
export const inputStyle = {
  width:"100%", background:"#f0f0f2", border:"1px solid #e2e2e6",
  borderRadius:"8px", color:"rgba(0,0,0,0.75)", fontSize:"14px",
  padding:"11px 14px", outline:"none", fontFamily:"inherit",
  boxSizing:"border-box", transition:"border-color 0.2s",
  WebkitTextFillColor:"rgba(0,0,0,0.7)"
};

export const cardStyle = {
  background:"#f5f5f7", border:"1px solid #e2e2e6", borderRadius:"12px",
  padding:"22px", marginBottom:"16px",
  boxShadow:"0 1px 3px rgba(0,0,0,0.06)"
};

export const labelStyle = {
  display:"block", fontSize:"10px", fontWeight:"700",
  letterSpacing:"0.15em", color:"#0a0a0a",
  textTransform:"uppercase", marginBottom:"5px"
};

export const btnStyle = (disabled, color) => ({
  background: disabled ? "#e5e5e7" : color||G.aqua,
  color: disabled ? "rgba(0,0,0,0.35)" : "#ffffff",
  border:"none", borderRadius:"8px", padding:"13px 24px",
  fontSize:"14px", fontWeight:"700",
  cursor: disabled ? "not-allowed" : "pointer",
  fontFamily:"inherit", display:"inline-block"
});
