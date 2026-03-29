import React, { useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'
import { AppContext } from '../App'
import { useNavigate } from 'react-router-dom'

const MOCK = [
  { id:1, type:'sell', crop:'洋葱', quantity:5000, price:1.80, location:'甘肃民勤', quality:'一级，可议价', phone:'138****8888', user_name:'张建军', created_at: new Date().toISOString() },
  { id:2, type:'buy', crop:'洋葱', quantity:20000, price:1.88, location:'甘肃产区', quality:'二级以上，长期合作优先', phone:'139****9999', user_name:'李德贸易', created_at: new Date().toISOString() },
  { id:3, type:'sell', crop:'洋葱', quantity:8000, price:1.75, location:'内蒙古包头', quality:'二级，可送货', phone:'137****7777', user_name:'王凤英', created_at: new Date().toISOString() },
]

export default function Trade() {
  const { user, currentCrop } = useContext(AppContext)
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [posts, setPosts] = useState(MOCK)
  const [showPublish, setShowPublish] = useState(false)
  const [form, setForm] = useState({ type:'sell', crop:currentCrop.name, quantity:'', price:'', location:'', quality:'', phone:'' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchPosts() }, [currentCrop])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('trade_posts')
      .select('*')
      .eq('crop', currentCrop.name)
      .order('created_at', { ascending: false })
    if (!error && data && data.length > 0) setPosts(data)
    else setPosts(MOCK.filter(p => p.crop === currentCrop.name || currentCrop.name === '洋葱'))
  }

  async function submitPost() {
    if (!form.quantity || !form.price || !form.location || !form.phone) { alert('请填写必填项'); return }
    setSubmitting(true)
    const { error } = await supabase.from('trade_posts').insert([{
      type: form.type, crop: currentCrop.name,
      quantity: Number(form.quantity), price: Number(form.price),
      location: form.location, quality: form.quality,
      phone: form.phone, user_name: user?.user_metadata?.display_name || '种植户',
      user_id: user?.id,
    }])
    setSubmitting(false)
    if (!error) { setShowPublish(false); fetchPosts() }
    else alert('发布失败，请重试')
  }

  const filtered = posts.filter(p => tab === 'all' || p.type === tab)

  return (
    <div>
      {/* Publish btn */}
      <div style={{ padding:'14px 20px', background:'var(--white)', borderBottom:'1px solid var(--border)' }}>
        <button onClick={() => user ? setShowPublish(true) : navigate('/login')} style={{ width:'100%', background:'linear-gradient(135deg,var(--green),var(--green-light))', border:'none', borderRadius:'var(--radius-sm)', padding:13, color:'#fff', fontSize:15, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'var(--shadow-md)' }}>
          ＋ 发布供求信息
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', padding:'0 20px', borderBottom:'1px solid var(--border)', background:'var(--white)' }}>
        {[['all','全部信息'],['buy','求购'],['sell','出售']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ flex:1, paddingBottom:12, paddingTop:14, fontSize:15, fontWeight:600, color: tab===v ? 'var(--green)' : 'var(--text-light)', borderBottom: tab===v ? '3px solid var(--green)' : '3px solid transparent', background:'none', border:'none', borderBottom: tab===v ? '3px solid var(--green)' : '3px solid transparent' }}>{l}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ padding:'14px 20px', display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background:'var(--white)', borderRadius:'var(--radius)', padding:16, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background: p.type==='sell' ? 'var(--green-pale)' : '#EBF4FF', color: p.type==='sell' ? 'var(--green)' : '#2B7FD4' }}>{p.type==='sell' ? '出售' : '求购'}</span>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:20, fontWeight:700, color:'var(--gold)' }}>{p.price}</div>
                <div style={{ fontSize:11, color:'var(--text-light)' }}>元/斤</div>
              </div>
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--text-dark)', marginBottom:4 }}>{p.crop} · {p.quantity}斤 · {p.location}</div>
            <div style={{ fontSize:12, color:'var(--text-light)', marginBottom:10 }}>{p.quality} · {new Date(p.created_at).toLocaleDateString('zh-CN')}发布</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text-mid)' }}>
                <div style={{ width:26, height:26, borderRadius:'50%', background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'var(--green)' }}>{p.user_name?.[0]}</div>
                {p.user_name} · 已认证
              </div>
              <a href={`tel:${p.phone}`} style={{ background:'var(--green)', borderRadius:20, padding:'6px 18px', fontSize:13, color:'#fff', fontWeight:600, textDecoration:'none' }}>📞 联系</a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign:'center', padding:40, color:'var(--text-light)' }}>暂无相关信息</div>}
      </div>

      {/* Publish modal */}
      {showPublish && (
        <div style={{ position:'fixed', inset:0, background:'var(--bg)', zIndex:200, display:'flex', flexDirection:'column', maxWidth:480, margin:'0 auto' }}>
          <div style={{ background:'var(--white)', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
            <button onClick={() => setShowPublish(false)} style={{ fontSize:20 }}>←</button>
            <span style={{ fontSize:16, fontWeight:700 }}>发布供求信息</span>
            <button onClick={submitPost} disabled={submitting} style={{ background:'var(--green)', color:'#fff', borderRadius:20, padding:'6px 18px', fontSize:14, fontWeight:700 }}>{submitting ? '发布中…' : '发布'}</button>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:13, color:'var(--text-mid)', fontWeight:500, marginBottom:6, display:'block' }}>信息类型</label>
              <div style={{ display:'flex', gap:10 }}>
                {[['sell','📦 出售'],['buy','🛒 求购']].map(([v,l]) => (
                  <button key={v} onClick={() => setForm({...form, type:v})} style={{ flex:1, padding:10, borderRadius:'var(--radius-sm)', border: form.type===v ? (v==='sell' ? '2px solid var(--green)' : '2px solid #2B7FD4') : '2px solid var(--border)', background: form.type===v ? (v==='sell' ? 'var(--green-pale)' : '#EBF4FF') : 'var(--white)', color: form.type===v ? (v==='sell' ? 'var(--green)' : '#2B7FD4') : 'var(--text-mid)', fontSize:14, fontWeight:600 }}>{l}</button>
                ))}
              </div>
            </div>
            {[
              ['数量（斤）*', 'quantity', '如：5000', 'number'],
              ['期望价格（元/斤）*', 'price', '如：1.80', 'number'],
              ['产地 *', 'location', '如：甘肃民勤'],
              ['品质说明', 'quality', '如：一级品，干净整洁，可议价'],
              ['联系电话 *', 'phone', '请输入手机号', 'tel'],
            ].map(([label, key, ph, type='text']) => (
              <div key={key}>
                <label style={{ fontSize:13, color:'var(--text-mid)', fontWeight:500, marginBottom:6, display:'block' }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder={ph} style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'12px 14px', fontSize:14, outline:'none', fontFamily:'inherit' }}/>
              </div>
            ))}
            <div style={{ background:'var(--green-pale)', borderRadius:'var(--radius-sm)', padding:12, fontSize:13, color:'var(--text-mid)' }}>
              ℹ️ 信息发布后有效期30天，到期自动下架。发布需实名认证（手机号绑定）。
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
