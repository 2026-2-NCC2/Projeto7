import marca from '@/assets/logo_navbar_web.png'
import styles from './Logo.module.css'

function Logo({ comTexto = true }) {
    return (
        <div className={styles.logo}>
            <img className={styles.marca} src={marca} alt={comTexto ? '' : 'Troca Ticket'} />
            {comTexto && <span className={styles.texto}>TROCA TICKET</span>}
        </div>
    )
}

export default Logo
