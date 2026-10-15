import styles from './Texto.module.css'

// variante: 'padrao' | 'destaque' | 'obs' | 'erro'
function Texto({ children, variante = 'padrao', elemento: Elemento = 'span' }) {
    return <Elemento className={styles[variante]}>{children}</Elemento>
}

export default Texto
