import styles from './Card.module.css'


function Card({
    children,
    variante = 'primario',
    largura = 'estreito',
    elemento: Elemento = 'div',
    ...props
}) {
    return (
        <Elemento className={`${styles.card} ${styles[variante]} ${styles[largura]}`} {...props}>
            {children}
        </Elemento>
    )
}

export default Card
