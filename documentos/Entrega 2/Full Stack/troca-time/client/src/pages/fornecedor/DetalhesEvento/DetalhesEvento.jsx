import show from '@/assets/show.jpg.webp'
import styles from './DetalhesEvento.module.css'

function DetalhesEvento() {
    const evento = null

    return <main className={styles.pagina}>
        <div className={styles.titulo}><h1>{evento?.evento ?? 'Detalhes do evento'}</h1>{evento && <><span>Em cotação</span><span className={styles.cotacao}>Cotação até {evento.cotacaoAte}</span></>}</div>
        <img className={styles.imagem} src={show} alt='Imagem de referência do evento' />
        <section className={styles.dados}>
            {evento ? <>
                <h2>DESCRIÇÃO</h2><p>{evento.descricaoEvento}</p>
                <p><b>Data:</b> {evento.data}</p><p><b>Hora:</b> {evento.hora}</p><p><b>Local:</b> {evento.endereco}</p>
                <p><b>Público mínimo:</b> {evento.publicoMinimo}</p><p><b>Público máximo:</b> {evento.publicoMaximo}</p>
                <h2>ORGANIZADOR RESPONSÁVEL</h2><div className={styles.organizador}><span>{evento.organizador.slice(0, 2).toUpperCase()}</span><b>{evento.organizador}</b></div>
            </> : <p>Os detalhes do evento serão exibidos quando a conexão com o banco estiver pronta.</p>}
        </section>
    </main>
}
export default DetalhesEvento
