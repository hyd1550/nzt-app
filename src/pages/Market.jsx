import React, { useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'
import { AppContext } from '../App'

const FILTERS = ['全部', '甘肃', '内蒙古', '新疆', '河北', '云南', '山东', '贵州']

export default function Market() {
  const { currentCrop } = useContext(AppContext)
  const [activeFilter, setActiveFilter] = useState('全部')
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPrices() }, [currentCrop])

  async function fetchPrices() {
    setLoading(true)
    const { data, error } = await supabase
      .from('crop_prices')
      .select('*')
      .eq('crop', currentCrop.name)
      .order('price', { ascending: false })
    if (!error && data && data.length > 0) setPrices(data)
    else setPrices([])
    setLoading(false)
  }

  const filtered = activeFilter === '全部'
    ? prices
    : prices.filter(r => r.region.includes(activeFilter))

  const lastUpdate = prices[0]?.created_at
    ? new Date(prices[0].created_at).toLocaleString('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' })
    : '—'

  return (
    <div>
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

      <div style={{ padding:'14px 20px', display:'flex', flexDirection:'column', gap:10 }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--text-light)' }}>加载中…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--text-light)' }}>
            暂无{currentCrop.name}的行情数据
          </div>
        ) : (
          <>
            <div style={{ fontSize:12, color:'var(--text-light)' }}>
              共{filtered.length}个产区 · 更新于 {lastUpdate}
            </div>
            {filtered.map(r => (
              <div key={r.id} style={{ background:'var(--white)', borderRadius:'var(--radius)', padding:'14px 16px', boxShadow:'var(--shadow-sm)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'var(--green)', fontWeight:700, lineHeight:1.4, textAlign:'center', whiteSpace:'pre-line' }}>
                    {r.region.slice(0,4).replace(/省|市|自治区/g,'').slice(0,4)}
                  </div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:'var(--text-dark)' }}>{r.region}</div>
                    <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2 }}>
                      {new Date(r.created_at).toLocaleDateString('zh-CN')} · {r.supply_status || '正常供货'}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:20, fontWeight:700, color:'var(--text-dark)' }}>
                    {r.price}<span style={{ fontSize:12, color:'var(--text-light)' }}>元/斤</span>
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color: r.change_amount >= 0 ? 'var(--red)' : '#2196F3', marginTop:2 }}>
                    {r.change_amount >= 0 ? '▲' : '▼'} {Math.abs(r.change_amount)}元
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div style={{ textAlign:'center', fontSize:12, color:'var(--text-light)', padding:8 }}>
          数据每日更新 · 仅供参考
        </div>
      </div>
    </div>
  )
}
