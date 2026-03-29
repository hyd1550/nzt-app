import React, { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabase'
import Layout from './components/Layout'
import Home from './pages/Home'
import Market from './pages/Market'
import Trade from './pages/Trade'
import Assistant from './pages/Assistant'
import Login from './pages/Login'

export const AppContext = createContext({})

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentCrop, setCurrentCrop] = useState({ name: '洋葱', icon: '🧅' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:48 }}>🌱</div>
      <div style={{ color:'var(--green)', fontWeight:700, fontSize:18 }}>农知通</div>
    </div>
  )

  return (
    <AppContext.Provider value={{ user, currentCrop, setCurrentCrop }}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="market" element={<Market />} />
          <Route path="trade" element={user ? <Trade /> : <Navigate to="/login" />} />
          <Route path="assistant" element={<Assistant />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  )
}
