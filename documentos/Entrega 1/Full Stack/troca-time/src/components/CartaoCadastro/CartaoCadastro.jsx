import { eventos } from '@/dados/eventos'
import avatarPadrao from '@/assets/avatar-padrao.png'
import styles from './CartaoCadastro.module.css'
function CartaoCadastro({ cadastro, tipo, administracao, onDetalhes }) {
    const eventosRelacionados = eventos.filter((evento) => cadastro.eventos.includes(evento.id))
    const fornecedor = tipo === 'fornecedores'
    return <article className={styles.cartao}><img className={styles.avatar} src={avatarPadrao} alt='' />
        <div className={styles.dados}><h2>{cadastro.nome}</h2><p><b>CNPJ/CPF:</b> {cadastro.documento}</p><p><b>Cidade:</b> {cadastro.cidade}</p><p><b>Estado:</b> {cadastro.estado}</p>
            {!administracao && <p><b>{fornecedor ? 'Serviço:' : 'Eventos:'}</b> {fornecedor ? cadastro.servico : eventosRelacionados.map((evento) => evento.nome).join(', ') || 'Nenhum evento relacionado'}</p>}
        </div><div className={styles.descricao}><h3>Descrição</h3><p>{cadastro.descricao}</p><button type='button' className={styles.verMais} onClick={() => onDetalhes(cadastro)}>Ver mais</button></div>
    </article>
}
export default CartaoCadastro
