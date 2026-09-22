const VARIANTES = {
    primario: 'botao-primario',
    link: 'botao-link',
}

function Botao({ children, variante = 'primario', ...props }) {
    return (
        <button className={`botao ${VARIANTES[variante]}`} {...props}>
            {children}
        </button>
    )
}

export default Botao
