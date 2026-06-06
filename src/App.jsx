import { useState, useEffect } from 'react'
import { apiAuth } from './globals.js'
import Login from './screens/Login.jsx'
import Dashboard from './screens/Dashboard.jsx'
import BrokerDashboard from './screens/BrokerDashboard.jsx'
import App1 from './screens/App1.jsx'
import App2 from './screens/App2.jsx'
import App3 from './screens/App3.jsx'
import Admin from './screens/Admin.jsx'
import TrialExpired from './screens/TrialExpired.jsx'
import SeatLimit from './screens/SeatLimit.jsx'
import SetPassword from './screens/SetPassword.jsx'
import SavedResults from './screens/SavedResults.jsx'

export default function App() {
  const [state, setState] = useState({
    screen: "login",
    user: null,
    lang: "English",
    savedResult: null,
    resetToken: null,
    resetEmail: null,
  })

  const setScreen = (updates) => setState(prev => ({...prev, ...updates}))

  // Check URL for set-password token on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const email = params.get("email")
    if (token) {
      setScreen({ screen:"set-password", resetToken:token, resetEmail:email||"" })
      return
    }
    // Check existing session
    const saved = sessionStorage.getItem("sf_user")
    if (saved) {
      const u = JSON.parse(saved)
      apiAuth({action:"check", userId:u.id}).then(res => {
        if (res.success) setScreen({screen:"dashboard", user:res.user})
        else { sessionStorage.removeItem("sf_user"); }
      }).catch(() => {})
    }
  }, [])

  const props = { state, setScreen }

  switch(state.screen) {
    case "login":         return <Login {...props} />
    case "set-password":  return <SetPassword {...props} />
    case "trial-expired": return <TrialExpired {...props} />
    case "seat-limit":    return <SeatLimit {...props} />
    case "dashboard":
      if (state.user?.role === "broker") return <BrokerDashboard {...props} />
      return <Dashboard {...props} />
    case "admin":         return <Admin {...props} />
    case "app1":          return <App1 {...props} />
    case "app2":          return <App2 {...props} />
    case "app3":          return <App3 {...props} />
    case "app1_results":  return <SavedResults {...props} app="app1" />
    case "app2_results":  return <SavedResults {...props} app="app2" />
    default:              return <Login {...props} />
  }
}
