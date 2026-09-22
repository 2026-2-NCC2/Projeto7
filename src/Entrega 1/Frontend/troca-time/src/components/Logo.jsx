import marca from '../assets/logo_navbar_web.png'

function Logo({ comTexto = true }) {
    return (
        <div className='logo'>
            <img
                className='logo-marca'
                src={marca}
                alt={comTexto ? '' : 'Troca Ticket'}
            />
            {comTexto && <span className='logo-texto'>TROCA TICKET</span>}
        </div>
    )
}

export default Logo
