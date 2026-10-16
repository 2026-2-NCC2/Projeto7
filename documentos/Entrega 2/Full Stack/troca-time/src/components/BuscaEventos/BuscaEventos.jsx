import styles from './BuscaEventos.module.css'
function BuscaEventos({ valor, onChange }) { return <label className={styles.busca}><span className={styles.srOnly}>Buscar eventos</span><input value={valor} onChange={(e) => onChange(e.target.value)} placeholder='Buscar' /></label> }
export default BuscaEventos
