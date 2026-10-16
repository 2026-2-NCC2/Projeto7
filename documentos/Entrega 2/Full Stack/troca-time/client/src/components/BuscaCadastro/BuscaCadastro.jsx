import styles from './BuscaCadastro.module.css'
function BuscaCadastro({ nome, valor, onChange }) { return <label className={styles.busca}><span className={styles.srOnly}>Buscar {nome}</span><input value={valor} onChange={(e) => onChange(e.target.value)} placeholder='Buscar' /></label> }
export default BuscaCadastro
