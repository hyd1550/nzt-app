import React, { useState, useContext } from 'react'
import { AppContext } from '../App'

const CROP_DATA = {
  '洋葱': { price:'1.85', change:'+0.05', up:true, unit:'元/斤', region:'甘肃民勤' },
  '大蒜': { price:'4.20', change:'+0.15', up:true, unit:'元/斤', region:'山东金乡' },
  '土豆': { price:'0.95', change:'-0.03', up:false, unit:'元/斤', region:'甘肃定西' },
  '玉米': { price:'1.12', change:'+0.02', up:true, unit:'元/斤', region:'黑龙江' },
  '白菜': { price:'0.42', change:'-0.05', up:false, unit:'元/斤', region:'河北张家口' },
  '辣椒': { price:'3.60', change:'+0.20', up:true, unit:'元/斤', region:'贵州遵义' },
  '番茄': { price:'2.10', change:'-0.10', up:false, unit:'元/斤', region:'新疆石河子' },
  '胡萝卜': { price:'0.88', change:'+0.03', up:true, unit:'元/斤', region:'河北保定' },
}

const NOTICES = [
  { icon:'🌧️', type:'warn', title:'近期天气预警', desc:'本周四至周六有小雨，注意做好田间排水，防止积水烂根。' },
  { icon:'🌱', type:'farm', title:'追肥建议', desc:'当前处于鳞茎膨大期，建议追施钾肥，提高产量和耐储性。' },
  { icon:'🐛', type:'pest', title:'病虫害防治', desc:'近期温湿度适合蓟马繁殖，注意及时检查叶片，必要时喷施杀虫剂。' },
]

const TABS = ['一周', '一月', '三月', '半年']

export default function Home() {
  const { currentCrop } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState(0)
  const [showForecast, setShowForecast] = useState(false)
  const data = CROP_DATA[currentCrop.name] || CROP_DATA['洋葱']

  return (
    <div>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#1E5C30,#2D7A45,#3D9960)', padding:'20px 20px 28px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)', background:'rgba(255,255,255,0.15)', display:'inline-flex', alignItems:'center', gap:4, borderRadius:20, padding:'3px 12px', marginBottom:10 }}>
          📍 {data.region}
        </div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:4 }}>今日收购均价</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:8 }}>
          <span style={{ fontSize:52, fontWeight:700, color:'#fff', lineHeight:1 }}>{data.price}</span>
          <span style={{ fontSize:16, color:'rgba(255,255,255,0.75)' }}>{data.unit}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ background: data.up ? 'rgba(76,175,107,0.25)' : 'rgba(229,74,74,0.25)', border: `1px solid ${data.up ? 'rgba(76,175,107,0.4)' : 'rgba(229,74,74,0.4)'}`, color: data.up ? '#7EDDA0' : '#FF8080', fontSize:12, fontWeight:600, padding:'3px 12px', borderRadius:20 }}>
            {data.up ? '▲' : '▼'} {data.change}元
          </span>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>较昨日</span>
        </div>
      </div>

      {/* Trend */}
      <div style={{ padding:'16px 20px' }}>
        <div style={{ fontSize:16, fontWeight:700, color:'var(--text-dark)', marginBottom:12 }}>📈 价格趋势预测</div>
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {TABS.map((t,i) => (
            <button key={t} onClick={() => setActiveTab(i)} style={{ padding:'5px 14px', borderRadius:20, fontSize:13, border: i===activeTab ? 'none' : '1.5px solid var(--border)', background: i===activeTab ? 'var(--green)' : 'var(--white)', color: i===activeTab ? '#fff' : 'var(--text-mid)', fontWeight: i===activeTab ? 700 : 400 }}>{t}</button>
          ))}
        </div>
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', padding:16, boxShadow:'var(--shadow-sm)' }}>
          <svg viewBox="0 0 300 110" style={{ width:'100%', height:110 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2D7A45" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#2D7A45" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,65 L40,58 L80,62 L120,52 L160,46" stroke="#2D7A45" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M160,46 L200,38 L240,30 L280,26 L300,22" stroke="#4CAF6B" strokeWidth="2" strokeDasharray="6,4" fill="none" strokeLinecap="round"/>
            <path d="M0,65 L40,58 L80,62 L120,52 L160,46 L200,38 L240,30 L280,26 L300,22 L300,100 L0,100 Z" fill="url(#g1)"/>
            <circle cx="160" cy="46" r="5" fill="#2D7A45"/>
            <circle cx="160" cy="46" r="9" fill="#2D7A45" fillOpacity="0.2"/>
            <line x1="160" y1="8" x2="160" y2="95" stroke="#ddd" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="2" y="108" fontSize="9" fill="#8FA897">7天前</text>
            <text x="143" y="108" fontSize="9" fill="#8FA897">今日</text>
            <text x="265" y="108" fontSize="9" fill="#8FA897">7天后</text>
            <text x="262" y="18" fontSize="9" fill="#4CAF6B">预测</text>
          </svg>
          <button onClick={() => setShowForecast(true)} style={{ width:'100%', marginTop:12, padding:10, background:'var(--gold-pale)', border:'1px solid #F0D89A', borderRadius:'var(--radius-sm)', fontSize:13, color:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            📊 查看预测依据分析 →
          </button>
        </div>
      </div>

      {/* Notices */}
      <div style={{ padding:'0 20px 24px' }}>
        <div style={{ fontSize:16, fontWeight:700, color:'var(--text-dark)', marginBottom:12 }}>📋 当前阶段注意事项</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {NOTICES.map((n, i) => (
            <div key={i} style={{ background:'var(--white)', borderRadius:'var(--radius-sm)', padding:'14px 16px', boxShadow:'var(--shadow-sm)', display:'flex', gap:12, borderLeft: n.type==='warn' ? '3px solid var(--red)' : 'none' }}>
              <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, background: n.type==='warn' ? 'var(--red-pale)' : 'var(--green-pale)' }}>{n.icon}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--text-dark)', marginBottom:3 }}>{n.title}</div>
                <div style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.5 }}>{n.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast modal */}
      {showForecast && (
        <div style={{ position:'fixed', inset:0, background:'var(--bg)', zIndex:100, display:'flex', flexDirection:'column', maxWidth:480, margin:'0 auto' }}>
          <div style={{ background:'var(--white)', padding:'16px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid var(--border)' }}>
            <button onClick={() => setShowForecast(false)} style={{ fontSize:20 }}>←</button>
            <span style={{ fontSize:16, fontWeight:700 }}>预测依据分析</span>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:20 }}>
            {[
              { name:'季节性规律', pct:35, color:'var(--green)', desc:'3-4月为青黄不接期，历史数据显示此阶段价格上涨概率达78%。' },
              { name:'气候影响', pct:25, color:'var(--green)', desc:'近期产区有小雨天气，不利运输，短期内可能推高价格0.05-0.10元/斤。' },
              { name:'市场供需', pct:25, color:'var(--green)', desc:'全国主要产区库存较去年同期下降约15%，供需缺口支撑价格上行。' },
              { name:'政策因素', pct:15, color:'var(--gold)', desc:'目前无重大政策性影响，出口端保持稳定，对价格影响中性。' },
            ].map(f => (
              <div key={f.name} style={{ background:'var(--white)', borderRadius:'var(--radius)', padding:16, marginBottom:12, boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:15, fontWeight:700 }}>{f.name}</span>
                  <span style={{ fontSize:13, fontWeight:700, background:'var(--green-pale)', color:'var(--green)', borderRadius:20, padding:'2px 12px' }}>权重 {f.pct}%</span>
                </div>
                <div style={{ height:6, background:'var(--border)', borderRadius:3, overflow:'hidden', marginBottom:8 }}>
                  <div style={{ height:'100%', width:`${f.pct}%`, background:f.color, borderRadius:3 }}/>
                </div>
                <div style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.5 }}>{f.desc}</div>
              </div>
            ))}
            <div style={{ background:'var(--gold-pale)', border:'1px solid #F0D89A', borderRadius:'var(--radius-sm)', padding:14, fontSize:13, color:'var(--soil)', lineHeight:1.6 }}>
              ⚠️ 价格预测仅供参考，实际市场价格受多种因素影响，请结合当地实际情况综合判断。
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
