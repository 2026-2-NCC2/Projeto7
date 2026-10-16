import styles from './Acoes.module.css'

// alinhamento: 'esticado' | 'centro'
function Acoes({ children, alinhamento = 'esticado' }) {
    return <div className={`${styles.acoes} ${styles[alinhamento]}`}>{children}</div>
}

export default Acoes
