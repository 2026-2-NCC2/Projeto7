import { useState } from 'react'

export default function ChatIA() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Olá! Como posso ajudar com seu evento?' }])
  const [text, setText] = useState('')

  function sendMessage(event) {
    event.preventDefault()
    if (!text.trim()) return
    setMessages([...messages, { from: 'user', text }])
    setText('')
  }

  return (
    <aside className="chat-widget" aria-label="Chat TrocaTicket IA">
      {open && (
        <section className="chat-panel">
          <div className="chat-title"><span>TrocaTicket IA</span><button onClick={() => setOpen(false)} aria-label="Fechar chat">×</button></div>
          <div className="chat-messages">
            {messages.map((message, index) => <p key={index} className={message.from}>{message.text}</p>)}
          </div>
          <form onSubmit={sendMessage} className="chat-form">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Digite sua mensagem" aria-label="Mensagem" />
            <button type="submit">Enviar</button>
          </form>
        </section>
      )}
      <button className="chat-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>TrocaTicket IA</span>
      </button>
    </aside>
  )
}