import React, { useState, useRef, useEffect, useContext } from 'react'
import { AppContext } from '../App'

const QUICK = ['怎么浇水', '如何施肥', '病虫害防治', '何时收获', '叶子发黄怎么办', '最近天气影响']

const CLAUDE_KEY = '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'

function Bubble({ msg }) {
  return (
    <div style={{ display:'flex', gap:8, alignItems:'flex-end', flexDirection: msg.role==='user' ? 'row-reverse' : 'row' }}>
      <div style={{ width:32, height:32, borderRadius:'50%', background: msg.role==='user' ? 'var(--green)' : 'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0, color: msg.role==='user' ? '#fff' : 'inherit' }}>
        {msg.role==='user' ? '我' : '🌱'}
      </div>
      <div style={{ maxWidth:'78%', padding:'10px 14px', borderRadius:18, fontSize:14, lineHeight:1.65, background: msg.role==='user' ? 'var(--green)' : 'var(--white)', color: msg.role==='user' ? '#fff' : 'var(--text-dark)', boxShadow:'var(--shadow-sm)', borderBottomLeftRadius: msg.role==='user' ? 18 : 4, borderBottomRightRadius: msg.role==='user' ? 4 : 18, whiteSpace:'pre-wrap' }}>
        {msg.typing ? (
          <span style={{ display:'flex', gap:5, alignItems:'center', padding:'2px 0' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'var(--text-light)', display:'inline-block', animation:`bounce 1.2s ${i*0.2}s infinite` }}/>
            ))}
          </span>
        ) : msg.text}
      </div>
    </div>
  )
}

export default function Assistant() {
  const { currentCrop } = useContext(AppContext)
  const [msgs, setMsgs] = useState([{
    id: 0, role:'ai',
    text: `你好！我是农知通 AI 种植助手 🌿\n\n我专注于${currentCrop.name}种植相关问题，可以帮你解答：\n• 日常种植管理（浇水、施肥、除草）\n• 病虫害识别与防治\n• 行情与销售建议\n• 天气对种植的影响\n\n有什么问题尽管问我！`
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const historyRef = useRef([]) // 保存对话历史供 API 使用

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [msgs])

  // 切换作物时重置
  useEffect(() => {
    setMsgs([{
      id: 0, role:'ai',
      text: `你好！我是农知通 AI 种植助手 🌿\n\n我专注于${currentCrop.name}种植相关问题，有什么需要帮助的吗？`
    }])
    historyRef.current = []
  }, [currentCrop.name])

  async function send(text) {
    const t = (text || input).trim()
    if (!t || loading) return
    setInput('')

    const userMsg = { id: Date.now(), role:'user', text: t }
    const typingMsg = { id: Date.now()+1, role:'ai', typing: true, text:'' }
    setMsgs(m => [...m, userMsg, typingMsg])
    setLoading(true)

    // 把用户消息加入历史
    historyRef.current.push({ role:'user', content: t })

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 800,
          system: `你是农知通App的专业种植助手，专注于帮助中国农村种植户解决${currentCrop.name}种植问题。

你的回答要求：
1. 用简洁易懂的中文回答，避免专业术语堆砌
2. 回答要实用，给出具体可操作的建议
3. 涉及用药时务必提醒安全注意事项
4. 回答长度适中，不要过长，手机屏幕阅读友好
5. 适当使用emoji让回答更生动
6. 如果问题超出${currentCrop.name}种植范围，礼貌引导回正题

当前农作物：${currentCrop.name}
当前季节：春季（3月底）
主要产区：甘肃民勤等西北地区`,
          messages: historyRef.current,
        })
      })

      const data = await response.json()

      if (data.error) throw new Error(data.error.message)

      const aiText = data.content?.[0]?.text || '抱歉，我暂时无法回答这个问题，请稍后再试。'

      // 把 AI 回复加入历史
      historyRef.current.push({ role:'assistant', content: aiText })

      // 限制历史长度，避免 token 超限
      if (historyRef.current.length > 20) {
        historyRef.current = historyRef.current.slice(-20)
      }

      setMsgs(m => m.map(msg =>
        msg.id === typingMsg.id ? { ...msg, typing: false, text: aiText } : msg
      ))
    } catch (e) {
      setMsgs(m => m.map(msg =>
        msg.id === typingMsg.id ? { ...msg, typing: false, text: '网络异常，请稍后重试 🔄' } : msg
      ))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
      `}</style>

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
            <button key={q} onClick={() => send(q)} disabled={loading} style={{ whiteSpace:'nowrap', padding:'6px 14px', borderRadius:20, border:'1.5px solid var(--green-mid)', background: loading ? 'var(--bg)' : 'var(--green-pale)', fontSize:13, color: loading ? 'var(--text-light)' : 'var(--green)', cursor: loading ? 'not-allowed' : 'pointer' }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding:'10px 16px 24px', background:'var(--white)', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
        <button style={{ width:40, height:40, borderRadius:'50%', background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🎤</button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && !loading && send()}
          placeholder={loading ? 'AI 正在思考中…' : '输入问题，按回车发送…'}
          disabled={loading}
          style={{ flex:1, background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:22, padding:'10px 16px', fontSize:14, outline:'none', fontFamily:'inherit', opacity: loading ? 0.6 : 1 }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{ width:40, height:40, borderRadius:'50%', background: loading ? 'var(--border)' : 'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff', flexShrink:0, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  )
}
