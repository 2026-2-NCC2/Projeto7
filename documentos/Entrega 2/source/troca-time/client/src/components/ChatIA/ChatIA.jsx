import { useState } from 'react'
import styles from './ChatIA.module.css'

// lado: 'direita' | 'esquerda'
function ChatIA({
    titulo = 'TrocaTicket IA',
    mensagemInicial = 'Olá! Como posso ajudar com seu evento?',
    lado = 'direita',
}) {
    const [aberto, setAberto] = useState(false)
    const [mensagens, setMensagens] = useState([{ autor: 'bot', texto: mensagemInicial }])
    const [texto, setTexto] = useState('')

    function enviarMensagem(e) {
        e.preventDefault()
        if (!texto.trim()) return
        setMensagens([...mensagens, { autor: 'usuario', texto }])
        setTexto('')
    }

    return (
        <aside className={`${styles.chat} ${styles[lado]}`} aria-label={titulo}>
            {aberto && (
                <section className={styles.painel}>
                    <div className={styles.titulo}>
                        <span>{titulo}</span>
                        <button onClick={() => setAberto(false)} aria-label='Fechar chat'>
                            ×
                        </button>
                    </div>
                    <div className={styles.mensagens}>
                        {mensagens.map((mensagem, index) => (
                            <p key={index} className={styles[mensagem.autor]}>
                                {mensagem.texto}
                            </p>
                        ))}
                    </div>
                    <form onSubmit={enviarMensagem} className={styles.formulario}>
                        <input
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            placeholder='Digite sua mensagem'
                            aria-label='Mensagem'
                        />
                        <button type='submit'>Enviar</button>
                    </form>
                </section>
            )}
            <button
                className={styles.abrir}
                onClick={() => setAberto(!aberto)}
                aria-expanded={aberto}
            >
                <span>{titulo}</span>
            </button>
        </aside>
    )
}

export default ChatIA
