import styles from './BotaoFiltro.module.css'
function BotaoFiltro({ status, selecionado, onClick }) { return <button type='button' aria-pressed={selecionado} className={`${styles.filtro} ${styles[status.id]} ${selecionado ? styles.selecionado : ''}`} onClick={onClick}>{status.label}</button> }
export default BotaoFiltro
