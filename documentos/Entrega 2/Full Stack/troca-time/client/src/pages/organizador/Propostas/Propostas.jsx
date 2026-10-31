import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import Botao from '@/components/Botao/Botao'
import { api, dataBr } from '@/utils/api'
import styles from './Propostas.module.css'

const dinheiro = (valor) => `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
function statusLabel(proposta) {
    if (proposta.status === 'em_negociacao') return 'Selecionada'
    if (proposta.status === 'aceita') return 'Salva'
    if (proposta.status === 'recusada') return 'Recusada'
    if (proposta.status === 'cancelada' || proposta.vaga_preenchida) return 'Indisponível'
    if (proposta.status_evento === 'rascunho' || proposta.status_evento === 'encerrado') return 'Indisponível'
    if (proposta.prazo_cotacao && proposta.prazo_cotacao < new Date().toISOString().slice(0, 10)) return 'Indisponível'
    return 'Disponível'
}

function PropostasOrganizador() {
    const { eventoId } = useParams()
    const { organizadorId, recarregarEvento } = useOutletContext()
    const [propostas, setPropostas] = useState([])
    const [filtro, setFiltro] = useState('todas')
    const [modal, setModal] = useState(null)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregar() {
        try {
            const resposta = await api(`/organizadores/${organizadorId}/eventos/${eventoId}/propostas`)
            setPropostas(resposta.propostas || [])
            setErro('')
        } catch (error) { setErro(error.message) }
        finally { setCarregando(false) }
    }
    useEffect(() => { carregar() }, [organizadorId, eventoId])

    const servicos = useMemo(() => [...new Map(propostas.map((p) => [p.vaga_servico_id, { id: p.vaga_servico_id, nome: p.nome_servico, categoria: p.categoria }])).values()], [propostas])
    const visiveis = useMemo(() => propostas.filter((p) => filtro === 'todas' || String(p.vaga_servico_id) === filtro).sort((a, b) => Number(a.valor) - Number(b.valor)), [propostas, filtro])

    async function acao(proposta, acao) {
        setErro('')
        try {
            await api(`/organizadores/${organizadorId}/propostas/${proposta.id}/${acao}`, { method: 'PATCH' })
            setModal(null)
            await Promise.all([carregar(), recarregarEvento()])
        } catch (error) { setErro(error.message); setModal(null) }
    }

    return <section className={styles.pagina}>
        <h2>ITENS DE SERVIÇO</h2>
        <div className={styles.filtros} role='group' aria-label='Filtrar propostas por serviço'>
            <button type='button' className={filtro === 'todas' ? styles.ativo : ''} onClick={() => setFiltro('todas')}>Todas</button>
            {servicos.map((servico) => <button type='button' key={servico.id} className={filtro === String(servico.id) ? styles.ativo : ''} onClick={() => setFiltro(String(servico.id))}>{servico.nome} ({propostas.filter((p) => p.vaga_servico_id === servico.id).length})</button>)}
        </div>
        {erro && <p className={styles.erro} role='alert'>{erro}</p>}
        <section className={styles.lista} aria-label='Propostas ordenadas pelo menor valor'>
            <h2>PROPOSTAS {filtro === 'todas' ? 'DO EVENTO' : `PARA ${servicos.find((item) => String(item.id) === filtro)?.nome?.toUpperCase() || ''}`}</h2>
            {carregando && <p className={styles.vazio}>Carregando propostas…</p>}
            {!carregando && visiveis.map((proposta) => {
                const podeMudar = ['enviada', 'em_negociacao'].includes(proposta.status) && !proposta.vaga_preenchida
                const status = statusLabel(proposta)
                return <article className={styles.linha} key={proposta.id}>
                    <div className={styles.dados}><h3>{proposta.nome_fornecedor}</h3><p><b>SERVIÇO:</b> {proposta.nome_servico} · <b>VALIDADE:</b> {dataBr(proposta.validade)}</p><p><b>DESCRIÇÃO:</b> {proposta.descricao}</p>{proposta.observacoes && <p><b>OBSERVAÇÕES:</b> {proposta.observacoes}</p>}<Link to={`/organizador/fornecedores/${proposta.fornecedor_id}`}>Ver fornecedor</Link></div>
                    <strong className={styles.valor}>{dinheiro(proposta.valor)}</strong>
                    <span className={`${styles.status} ${styles[`status_${proposta.status}`]}`}>{status}</span>
                    <div className={styles.acoes}><button type='button' disabled={!podeMudar || proposta.status === 'em_negociacao'} onClick={() => acao(proposta, 'selecionar')}>Selecionar proposta</button><button type='button' className={styles.recusar} disabled={!podeMudar} onClick={() => acao(proposta, 'recusar')}>Recusar</button><button type='button' className={styles.salvar} disabled={!podeMudar || proposta.status !== 'em_negociacao'} onClick={() => setModal(proposta)}>Salvar</button></div>
                </article>
            })}
            {!carregando && !visiveis.length && <p className={styles.vazio}>Nenhuma proposta encontrada.</p>}
        </section>
        {modal && <div className={styles.overlay} role='presentation' onClick={() => setModal(null)}><section className={styles.modal} role='dialog' aria-modal='true' aria-labelledby='tituloSalvar' onClick={(event) => event.stopPropagation()}><h2 id='tituloSalvar'>Salvar proposta?</h2><p>Se escolher salvar essa proposta, não poderá selecionar outra depois. Ela será definitivamente adicionada à organização do seu evento.</p><div><button type='button' onClick={() => setModal(null)}>Cancelar</button><Botao type='button' onClick={() => acao(modal, 'salvar')}>Salvar</Botao></div></section></div>}
    </section>
}
export default PropostasOrganizador
