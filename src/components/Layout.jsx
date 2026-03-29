import React, { useState, useContext } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../App'

const CROPS = [
  { name:'洋葱', icon:'🧅' }, { name:'大蒜', icon:'🧄' },
  { name:'土豆', icon:'🥔' }, { name:'玉米', icon:'🌽' },
  { name:'白菜', icon:'🥬' }, { name:'辣椒', icon:'🌶️' },
  { name:'番茄', icon:'🍅' }, { name:'胡萝卜', icon:'🥕' },
]

const NAV = [
  { path:'/', icon:'🏠', label:'首页' },
  { path:'/market', icon:'📊', label:'行情' },
  { path:'/trade', icon:'🤝', label:'交易大厅' },
  { path:'/assistant', icon:'🌱', label:'种植助手' },
]

const s = {
  wrap: { display:'flex', flexDirection:'column', height:'100dvh', overflow:'hidden', background:'var(--bg)' },
  topBar: { background:'var(--white)', padding:'10px 20px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)', flexShrink:0 },
  cropBtn: { display:'flex', alignItems:'center', gap:6, background:'var(--green-pale)', border:'1.5px solid var(--green-mid)', borderRadius:24, padding:'6px 14px 6px 10px', cursor:'pointer' },
  cropName: { fontSize:15, fontWeight:700, color:'var(--green)' },
  topActions: { display:'flex', gap:10 },
  iconBtn: { width:36, height:36, borderRadius:'50%', background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer' },
  scrollArea: { flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' },
  bottomNav: { background:'var(--white)', borderTop:'1px solid var(--border)', display:'flex', padding:'8px 0 20px', flexShrink:0 },
  navItem: (active) => ({ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', padding:'4px 0' }),
  navIcon: { fontSize:22 },
  navLabel: (active) => ({ fontSize:10, fontWeight: active ? 700 : 500, color: active ? 'var(--green)' : 'var(--text-light)' }),
  // Modal
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:200, display:'flex', alignItems:'flex-end' },
  sheet: { background:'var(--white)', borderRadius:'24px 24px 0 0', padding:'20px 20px 40px', width:'100%' },
  handle: { width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 20px' },
  modalTitle: { fontSize:17, fontWeight:700, color:'var(--text-dark)', marginBottom:16 },
  cropGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 },
  cropOpt: (active) => ({ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 8px', borderRadius:'var(--radius-sm)', border: active ? '2px solid var(--green)' : '2px solid var(--border)', background: active ? 'var(--green-pale)' : 'var(--white)', cursor:'pointer' }),
}

export default function Layout() {
  const { currentCrop, setCurrentCrop } = useContext(AppContext)
  const [showCropModal, setShowCropModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={s.wrap}>
      {/* Top bar */}
      <div style={s.topBar}>
        <div style={s.cropBtn} onClick={() => setShowCropModal(true)}>
          <span style={{ fontSize:18 }}>{currentCrop.icon}</span>
          <span style={s.cropName}>{currentCrop.name}</span>
          <span style={{ fontSize:10, color:'var(--green)' }}>▼</span>
        </div>
        <div style={s.topActions}>
          <div style={s.iconBtn}>🔔</div>
          <div style={s.iconBtn} onClick={() => navigate('/login')}>👤</div>
        </div>
      </div>

      {/* Page content */}
      <div style={s.scrollArea}>
        <Outlet />
      </div>

      {/* Bottom nav */}
      <div style={s.bottomNav}>
        {NAV.map(n => {
          const active = location.pathname === n.path
          return (
            <div key={n.path} style={s.navItem(active)} onClick={() => navigate(n.path)}>
              <span style={{ ...s.navIcon, transform: active ? 'scale(1.1)' : 'scale(1)' }}>{n.icon}</span>
              <span style={s.navLabel(active)}>{n.label}</span>
            </div>
          )
        })}
      </div>

      {/* Crop modal */}
      {showCropModal && (
        <div style={s.overlay} onClick={() => setShowCropModal(false)}>
          <div style={s.sheet} onClick={e => e.stopPropagation()}>
            <div style={s.handle} />
            <div style={s.modalTitle}>选择农作物</div>
            <div style={s.cropGrid}>
              {CROPS.map(c => (
                <div key={c.name} style={s.cropOpt(currentCrop.name === c.name)}
                  onClick={() => { setCurrentCrop(c); setShowCropModal(false) }}>
                  <span style={{ fontSize:24 }}>{c.icon}</span>
                  <span style={{ fontSize:12, fontWeight:600 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
