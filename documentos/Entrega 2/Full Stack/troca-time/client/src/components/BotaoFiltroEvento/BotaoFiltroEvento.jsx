import styles from './BotaoFiltroEvento.module.css'
function BotaoFiltroEvento({ item, ativo, onClick }) { return <button type='button' aria-pressed={ativo} onClick={onClick} className={`${styles.filtro} ${styles[item.valor]} ${ativo ? styles.selecionado : ''}`}>{item.rotulo}</button> }
export default BotaoFiltroEvento
