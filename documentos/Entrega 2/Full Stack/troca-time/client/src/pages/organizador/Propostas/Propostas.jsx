import ListaPropostas from '@/components/ListaPropostas/ListaPropostas'
import styles from './Propostas.module.css'

function PropostasOrganizador() {
    return <div className={styles.pagina}><ListaPropostas perfil='organizador' /></div>
}

export default PropostasOrganizador
