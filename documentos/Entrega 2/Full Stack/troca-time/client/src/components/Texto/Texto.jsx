import styles from './Texto.module.css'


function Texto({ children, variante = 'padrao', elemento: Elemento = 'span' }) {
    return <Elemento className={styles[variante]}>{children}</Elemento>
}

export default Texto
