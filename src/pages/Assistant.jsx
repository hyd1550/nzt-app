import React, { useState, useRef, useEffect, useContext } from 'react'
import { AppContext } from '../App'

const QUICK = ['怎么浇水', '如何施肥', '病虫害防治', '何时收获', '天气影响']

const GREET = (crop) => `你好！我是你的**农知通种植助手** 🌿\n\n我专注于${crop}种植相关问题，支持文字提问或拍照发图，我来帮你诊断！`

const REPLIES = [
  `根据你的描述，建议检查土壤湿度和根系状态，若叶片发黄建议：\n\n🔸 **缺氮**：追施尿素15-20斤/亩\n🔸 **根腐病**：检查根部是否腐烂\n🔸 **积水**：及时排水透气\n\n可以拍张叶片照片发给我，帮你更准确判断 📷`,
  `浇水建议：\n\n💧 **膨大期**：每7-10天浇水一次，保持土壤湿润但不积水\n💧 **收获前15天**：停止浇水，有利于储存\n💧 **雨后**：及时排水，防烂根`,
  `施肥方案：\n\n🌱 **基肥**：每亩施有机肥2000斤+复合肥50斤\n🌱 **追肥一**：定植后20天，尿素15斤/亩\n🌱 **追肥二**：膨大期，钾肥20斤/亩\n\n注意：收获前30天停止追肥`,
  `收获时机判断：\n\n✅ **最佳采收标志**：地上部分叶片自然倒伏超过50%\n✅ **鳞茎检查**：表皮干燥，外层膜化\n✅ **天气选择**：选择晴天采收，采收后晾晒2-3天`,
]

let replyIdx = 0

function Bubble({ msg }) {
  return (
    <div style={{ display:'flex', gap:8, alignItems:'flex-end', flexDirection: msg.role==='user' ? 'row-reverse' : 'row' }}>
      <div style={{ width:30, height:30, borderRadius:'50%', background: msg.role==='user' ? 'var(--green)' : 'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>
        {msg.role==='user' ? '我' : '🌱'}
      </div>
      <div style={{ maxWidth:'80%', padding:'10px 14px', borderRadius:18, fontSize:14, lineHeight:1.6, background: msg.role==='user' ? 'var(--green)' : 'var(--white)', color: msg.role==='user' ? '#fff' : 'var(--text-dark)', boxShadow:'var(--shadow-sm)', borderBottomLeftRadius: msg.role==='user' ? 18 : 4, borderBottomRightRadius: msg.role==='user' ? 4 : 18, whiteSpace:'pre-line' }}>
        {msg.typing ? (
          <span style={{ display:'flex', gap:4 }}>
            {[0,1,2].map(i => <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-light)', display:'inline-block', animation:`bounce 1.2s ${i*0.2}s infinite` }}/>)}
          </span>
        ) : msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
      </div>
    </div>
  )
}

export default function Assistant() {
  const { currentCrop } = useContext(AppContext)
  const [msgs, setMsgs] = useState([{ id:0, role:'ai', text: GREET(currentCrop.name) }])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  function send(text) {
    const t = (text || input).trim()
    if (!t) return
    setInput('')
    const userMsg = { id: Date.now(), role:'user', text: t }
    const typingMsg = { id: Date.now()+1, role:'ai', typing: true, text:'' }
    setMsgs(m => [...m, userMsg, typingMsg])
    setTimeout(() => {
      setMsgs(m => m.map(msg => msg.id === typingMsg.id ? { ...msg, typing: false, text: REPLIES[replyIdx++ % REPLIES.length] } : msg))
    }, 1200)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 8px', display:'flex', flexDirection:'column', gap:14 }}>
        {msgs.map(m => <Bubble key={m.id} msg={m} />)}
        <div ref={bottomRef}/>
      </div>

      {/* Quick questions */}
      <div style={{ padding:'10px 16px', borderTop:'1px solid var(--border)', background:'var(--white)' }}>
        <div style={{ fontSize:12, color:'var(--text-light)', marginBottom:8 }}>常见问题快捷提问</div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)} style={{ whiteSpace:'nowrap', padding:'6px 14px', borderRadius:20, border:'1.5px solid var(--green-mid)', background:'var(--green-pale)', fontSize:13, color:'var(--green)', cursor:'pointer' }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding:'10px 16px 24px', background:'var(--white)', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
        <button style={{ width:40, height:40, borderRadius:'50%', background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🎤</button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} placeholder="输入问题，或点击麦克风语音…" style={{ flex:1, background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:22, padding:'10px 16px', fontSize:14, outline:'none', fontFamily:'inherit' }}/>
        <button onClick={() => send()} style={{ width:40, height:40, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff', flexShrink:0 }}>➤</button>
      </div>
    </div>
  )
}
