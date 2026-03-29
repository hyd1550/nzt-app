import React, { useState } from 'react'

const REGIONS = [
  { name:'甘肃民勤', short:'甘肃\n民勤', price:'1.85', change:'+0.05', up:true, status:'大量供货' },
  { name:'内蒙古包头', short:'内蒙\n包头', price:'1.72', change:'-0.03', up:false, status:'正常供货' },
  { name:'新疆石河子', short:'新疆\n石河', price:'1.68', change:'-0.08', up:false, status:'库存充足' },
  { name:'河北永年', short:'河北\n永年', price:'1.96', change:'+0.12', up:true, status:'少量供货' },
  { name:'云南曲靖', short:'云南\n曲靖', price:'1.78', change:'+0.02', up:true, status:'正常供货' },
  { name:'山东兰陵', short:'山东\n兰陵', price:'1.81', change:'+0.06', up:true, status:'正常供货' },
]

const FILTERS = ['全部', '甘肃', '内蒙古', '新疆', '河北', '云南', '山东']

export default function Market() {
  const [activeFilter, setActiveFilter] = useState('全部')

  const filtered = activeFilter === '全部'
    ? REGIONS
    : REGIONS.filter(r => r.name.includes(activeFilter))

  return (
    <div>
      {/* Filters */}
      <div style={{ background:'var(--white)', padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', background:'var(--bg)', borderRadius:10, padding:3, marginBottom:12 }}>
          {['📋 列表视图', '🗺️ 地图视图'].map((v,i) => (
            <button key={v} style={{ flex:1, padding:'7px', border:'none', borderRadius:8, fontSize:13, background: i===0 ? 'var(--white)' : 'transparent', color: i===0 ? 'var(--green)' : 'var(--text-mid)', fontWeight: i===0 ? 700 : 400, boxShadow: i===0 ? 'var(--shadow-sm)' : 'none' }}>{v}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:2 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding:'5px 14px', borderRadius:20, whiteSpace:'nowrap', border: f===activeFilter ? '1.5px solid var(--green)' : '1.5px solid var(--border)', background: f===activeFilter ? 'var(--green-pale)' : 'var(--white)', color: f===activeFilter ? 'var(--green)' : 'var(--text-mid)', fontSize:13, fontWeight: f===activeFilter ? 600 : 400 }}>{f}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ padding:'14px 20px', display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ fontSize:12, color:'var(--text-light)' }}>共{filtered.length}个产区 · 更新于今日 08:30</div>
        {filtered.map(r => (
          <div key={r.name} style={{ background:'var(--white)', borderRadius:'var(--radius)', padding:'14px 16px', boxShadow:'var(--shadow-sm)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'var(--green)', fontWeight:700, lineHeight:1.4, textAlign:'center', whiteSpace:'pre-line' }}>{r.short}</div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:'var(--text-dark)' }}>{r.name}</div>
                <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2 }}>今日更新 · {r.status}</div>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:20, fontWeight:700, color:'var(--text-dark)' }}>{r.price}<span style={{ fontSize:12, color:'var(--text-light)' }}>元/斤</span></div>
              <div style={{ fontSize:12, fontWeight:600, color: r.up ? 'var(--red)' : '#2196F3', marginTop:2 }}>{r.up ? '▲' : '▼'} {r.change}元</div>
            </div>
          </div>
        ))}
        <div style={{ textAlign:'center', fontSize:12, color:'var(--text-light)', padding:8 }}>已显示全部产区数据</div>
      </div>
    </div>
  )
}
