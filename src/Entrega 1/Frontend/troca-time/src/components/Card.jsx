const VARIANTES = {
    primario: 'card-primario',
}

const LARGURAS = {
    estreito: 'card-estreito',
    largo: 'card-largo',
}

function Card({
    children,
    variante = 'primario',
    largura = 'estreito',
    elemento: Elemento = 'div',
    ...props
}) {
    return (
        <Elemento className={`card ${VARIANTES[variante]} ${LARGURAS[largura]}`} {...props}>
            {children}
        </Elemento>
    )
}

export default Card
