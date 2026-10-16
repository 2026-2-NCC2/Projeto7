import { eventos } from '@/dados/eventos'
import styles from './ModalCadastro.module.css'
function ModalCadastro({ cadastro, tipo, administracao, onFechar, onStatus }) {
    if (!cadastro) return null
    const fornecedor = tipo === 'fornecedores'
    const relacionados = eventos.filter((evento) => cadastro.eventos.includes(evento.id))
    return <div className={styles.overlay} onClick={onFechar}><section className={styles.modal} role='dialog' aria-modal='true' aria-labelledby='cadastro-titulo' onClick={(e) => e.stopPropagation()}>
        <button type='button' className={styles.fechar} onClick={onFechar} aria-label='Fechar detalhes'>×</button><h2 id='cadastro-titulo'>{cadastro.nome}</h2><p>{cadastro.documento} · {cadastro.cidade}, {cadastro.estado}</p><p>{cadastro.descricao}</p><p><b>Status:</b> {cadastro.status}</p>
        <p><b>{fornecedor ? 'Serviço:' : 'Eventos:'}</b> {fornecedor ? cadastro.servico : relacionados.map((evento) => evento.nome).join(', ') || 'Nenhum evento relacionado'}</p>
        {administracao && <div className={styles.acoes}><button type='button' onClick={() => onStatus(cadastro.id, 'rejeitado')}>Reprovar</button><button type='button' onClick={() => onStatus(cadastro.id, 'aprovado')}>Aprovar</button></div>}
    </section></div>
}
export default ModalCadastro
