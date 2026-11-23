import styles from './Botao.module.css'

// variante: 'primario' | 'link'
function Botao({ children, variante = 'primario', ...props }) {
    return (
        <button className={`${styles.botao} ${styles[variante]}`} {...props}>
            {children}
        </button>
    )
}

export default Botao
