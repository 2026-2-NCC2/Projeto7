import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import show from '@/assets/show.jpg.webp'
import { api, dataBr } from '@/utils/api'
import styles from './DetalhesEvento.module.css'

function DetalhesEvento() {
    const { eventoId } = useParams()
    const [evento, setEvento] = useState(null)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregar() {
        setCarregando(true)
        setErro('')
        try {
            setEvento(await api(`/eventos/${eventoId}`))
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregar()
    }, [eventoId])

    if (carregando && !evento) return <main className={styles.pagina}>Carregando evento…</main>
    if (erro || !evento)
        return (
            <main className={styles.pagina} role='alert'>
                {erro || 'Evento não encontrado.'}
            </main>
        )

    return (
        <main className={styles.pagina}>
            <div className={styles.titulo}>
                <h1>{evento.nome}</h1>
                <span>Em cotação</span>
            </div>
            <img className={styles.imagem} src={show} alt='Imagem de referência do evento' />
            <section className={styles.dados}>
                <h2>DESCRIÇÃO</h2>
                <p>{evento.descricao || 'Sem descrição cadastrada.'}</p>
                <p>
                    <b>Data:</b> {dataBr(evento.data)}
                </p>
                <p>
                    <b>Hora:</b> {String(evento.horario_inicio).slice(0, 5)}
                </p>
                <p>
                    <b>Local:</b> {evento.endereco}
                </p>
                <p>
                    <b>Público mínimo:</b> {evento.publico_min ?? '—'}
                </p>
                <p>
                    <b>Público máximo:</b> {evento.publico_max ?? '—'}
                </p>
                <h2>ORGANIZADOR RESPONSÁVEL</h2>
                <div className={styles.organizador}>
                    <span>
                        {String(evento.organizador_nome || '')
                            .slice(0, 2)
                            .toUpperCase()}
                    </span>
                    <b>{evento.organizador_nome}</b>
                </div>
            </section>
        </main>
    )
}
export default DetalhesEvento
