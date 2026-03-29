import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { AppContext } from '../App'

const s = {
  wrap: { minHeight:'100dvh', background:'linear-gradient(160deg, #1E5C30 0%, #2D7A45 60%, #3D9960 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 },
  card: { background:'var(--white)', borderRadius:24, padding:28, width:'100%', maxWidth:360, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' },
  logo: { textAlign:'center', marginBottom:28 },
  logoIcon: { fontSize:52, display:'block', marginBottom:8 },
  logoTitle: { fontSize:26, fontWeight:700, color:'var(--green)' },
  logoSub: { fontSize:14, color:'var(--text-light)', marginTop:4 },
  label: { fontSize:13, color:'var(--text-mid)', fontWeight:500, marginBottom:6, display:'block' },
  input: { width:'100%', border:'1.5px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'12px 14px', fontSize:15, outline:'none', marginBottom:14, fontFamily:'inherit' },
  btn: { width:'100%', background:'linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', padding:14, fontSize:16, fontWeight:700, cursor:'pointer', marginBottom:12 },
  tip: { fontSize:13, color:'var(--text-light)', textAlign:'center', lineHeight:1.6 },
  err: { background:'var(--red-pale)', color:'var(--red)', borderRadius:'var(--radius-sm)', padding:'10px 14px', fontSize:13, marginBottom:14 },
  toggle: { color:'var(--green)', fontWeight:600, cursor:'pointer', marginTop:16, textAlign:'center', fontSize:14 },
}

export default function Login() {
  const [mode, setMode] = useState('login') // login | register
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit() {
    setError('')
    if (!phone || !password) { setError('请填写手机号和密码'); return }
    // Format phone for Supabase (needs +86 prefix)
    const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`
    setLoading(true)
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          phone: formattedPhone,
          password,
          options: { data: { display_name: name || '种植户' } }
        })
        if (error) throw error
        navigate('/')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          phone: formattedPhone,
          password
        })
        if (error) throw error
        navigate('/')
      }
    } catch (e) {
      setError(e.message === 'Invalid login credentials' ? '手机号或密码错误' : e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>
          <span style={s.logoIcon}>🌱</span>
          <div style={s.logoTitle}>农知通</div>
          <div style={s.logoSub}>农作物行情 · 交易 · 种植助手</div>
        </div>

        {error && <div style={s.err}>{error}</div>}

        {mode === 'register' && (
          <>
            <label style={s.label}>姓名（选填）</label>
            <input style={s.input} placeholder="你的姓名或昵称" value={name} onChange={e => setName(e.target.value)} />
          </>
        )}

        <label style={s.label}>手机号</label>
        <input style={s.input} placeholder="请输入手机号" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />

        <label style={s.label}>密码</label>
        <input style={s.input} placeholder="请输入密码（6位以上）" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSubmit()} />

        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? '处理中…' : mode === 'login' ? '登录' : '注册'}
        </button>

        <div style={s.tip}>登录即表示同意用户服务协议</div>
        <div style={s.toggle} onClick={() => { setMode(mode==='login'?'register':'login'); setError('') }}>
          {mode === 'login' ? '没有账号？立即注册 →' : '已有账号？去登录 →'}
        </div>

        <div style={{ ...s.toggle, color:'var(--text-light)', fontWeight:400, marginTop:10 }}
          onClick={() => navigate('/')}>
          暂不登录，先看看 →
        </div>
      </div>
    </div>
  )
}
