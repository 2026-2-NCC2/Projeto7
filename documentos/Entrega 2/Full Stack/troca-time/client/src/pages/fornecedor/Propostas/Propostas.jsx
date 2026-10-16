import ListaPropostas from '@/components/ListaPropostas/ListaPropostas'
import styles from './Propostas.module.css'

function PropostasFornecedor() {
    return <div className={styles.pagina}><ListaPropostas perfil='fornecedor' /></div>
}

export default PropostasFornecedor
