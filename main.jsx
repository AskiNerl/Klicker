import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Register from './Register.jsx' 
import './App.css'  

function Root() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) 

  useEffect(() => {

    const savedUser = localStorage.getItem('basket_player')
    if (savedUser) {
      setUser(savedUser) 
    }
    setLoading(false) 
  }, [])

  if (loading) return null

 
  if (!user) {
    return <Register onAuth={(name) => setUser(name)} />
  }


  return <App username={user} onLogout={() => setUser(null)} />
}


createRoot(document.getElementById('root')).render(<Root />)