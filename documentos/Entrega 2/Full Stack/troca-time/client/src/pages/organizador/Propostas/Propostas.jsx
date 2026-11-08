import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import Botao from '@/components/Botao/Botao'
import { api, dataBr } from '@/utils/api'
import styles from './Propostas.module.css'

const dinheiro = (valor) =>
    `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
const STATUS_PROPOSTA = {
    pendente: { rotulo: 'Pendente', classe: '' },
    selecionada: { rotulo: 'Selecionada', classe: styles.statusSelecionada },
    aceita: { rotulo: 'Aceita', classe: styles.statusAceita },
    recusada: { rotulo: 'Recusada', classe: styles.statusRecusada },
}

function PropostasOrganizador() {
    const { eventoId } = useParams()
    const { recarregarEvento, evento } = useOutletContext()
    const [propostas, setPropostas] = useState([])
    const [filtro, setFiltro] = useState('todas')
    const [modal, setModal] = useState(null)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregar() {
        try {
            const resposta = await api(`/organizadores/${eventoId}/propostas`)
            setPropostas(resposta.propostas || [])
            setErro('')
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }
    useEffect(() => {
        carregar()
    }, [eventoId])

    const servicos = useMemo(
        () => [
            ...new Map(
                propostas.map((p) => [
                    p.vaga_servico_id,
                    { id: p.vaga_servico_id, nome: p.item, categoria: p.categoria },
                ]),
            ).values(),
        ],
        [propostas],
    )
    const visiveis = useMemo(
        () =>
            propostas
                .filter((p) => filtro === 'todas' || String(p.vaga_servico_id) === filtro)
                .sort((a, b) => Number(a.valor) - Number(b.valor)),
        [propostas, filtro],
    )

    async function acao(proposta, novoStatus) {
        setErro('')
        try {
            await api(`/organizadores/propostas/${proposta.id}/status?novo_status=${novoStatus}`, {
                method: 'PATCH',
            })
            setModal(null)
            await Promise.all([carregar(), recarregarEvento()])
        } catch (error) {
            setErro(error.message)
            setModal(null)
        }
    }

    return (
        <section className={styles.pagina}>
            <h2>ITENS DE SERVIÇO</h2>
            <div className={styles.filtros} role='group' aria-label='Filtrar propostas por serviço'>
                <button
                    type='button'
                    className={filtro === 'todas' ? styles.ativo : ''}
                    onClick={() => setFiltro('todas')}
                >
                    Todas
                </button>
                {servicos.map((servico) => (
                    <button
                        type='button'
                        key={servico.id}
                        className={filtro === String(servico.id) ? styles.ativo : ''}
                        onClick={() => setFiltro(String(servico.id))}
                    >
                        {servico.nome} (
                        {propostas.filter((p) => p.vaga_servico_id === servico.id).length})
                    </button>
                ))}
            </div>
            {erro && (
                <p className={styles.erro} role='alert'>
                    {erro}
                </p>
            )}
            <section className={styles.lista} aria-label='Propostas ordenadas pelo menor valor'>
                <h2>
                    PROPOSTAS{' '}
                    {filtro === 'todas'
                        ? 'DO EVENTO'
                        : `PARA ${servicos.find((item) => String(item.id) === filtro)?.nome?.toUpperCase() || ''}`}
                </h2>
                {carregando && <p className={styles.vazio}>Carregando propostas…</p>}
                {!carregando &&
                    visiveis.map((proposta) => {
                        const podeMudar =
                            ['pendente', 'selecionada'].includes(proposta.status) &&
                            proposta.status_vaga !== 'preenchida' &&
                            evento.status !== 'encerrado'
                        const status = STATUS_PROPOSTA[proposta.status] || {
                            rotulo: proposta.status,
                            classe: '',
                        }
                        return (
                            <article className={styles.linha} key={proposta.id}>
                                <h3 className={styles.titulo}>{proposta.nome_fornecedor}</h3>
                                <div className={styles.dados}>
                                    <p>
                                        <b>SERVIÇO:</b> {proposta.item}
                                    </p>
                                    <p>
                                        <b>VALIDADE:</b> {dataBr(proposta.validade)}
                                    </p>
                                    <p>
                                        <b>DESCRIÇÃO:</b> {proposta.descricao}
                                    </p>
                                    {proposta.observacoes && (
                                        <p>
                                            <b>OBSERVAÇÕES:</b> {proposta.observacoes}
                                        </p>
                                    )}
                                </div>
                                <div className={styles.lateral}>
                                    <Link
                                        to={`/organizador/fornecedores/${proposta.fornecedor_id}`}
                                    >
                                        Ver fornecedor
                                    </Link>
                                    <span className={`${styles.status} ${status.classe}`}>
                                        {status.rotulo}
                                    </span>
                                </div>
                                <p className={styles.valor}>
                                    <b>VALOR:</b> <strong>{dinheiro(proposta.valor)}</strong>
                                </p>
                                <div className={styles.acoes}>
                                    <button
                                        type='button'
                                        disabled={!podeMudar || proposta.status === 'selecionada'}
                                        onClick={() => acao(proposta, 'selecionada')}
                                    >
                                        Selecionar proposta
                                    </button>
                                    <button
                                        type='button'
                                        className={styles.recusar}
                                        disabled={!podeMudar}
                                        onClick={() => acao(proposta, 'recusada')}
                                    >
                                        Recusar
                                    </button>
                                    <button
                                        type='button'
                                        className={styles.salvar}
                                        disabled={!podeMudar || proposta.status !== 'selecionada'}
                                        onClick={() => setModal(proposta)}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                {!carregando && !visiveis.length && (
                    <p className={styles.vazio}>Nenhuma proposta encontrada.</p>
                )}
            </section>
            {modal && (
                <div className={styles.overlay} role='presentation' onClick={() => setModal(null)}>
                    <section
                        className={styles.modal}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='tituloSalvar'
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 id='tituloSalvar'>Salvar proposta?</h2>
                        <p>
                            Se escolher salvar essa proposta, não poderá selecionar outra depois.
                            Ela será definitivamente adicionada à organização do seu evento.
                        </p>
                        <div>
                            <button type='button' onClick={() => setModal(null)}>
                                Cancelar
                            </button>
                            <Botao type='button' onClick={() => acao(modal, 'aceita')}>
                                Salvar
                            </Botao>
                        </div>
                    </section>
                </div>
            )}
        </section>
    )
}
export default PropostasOrganizador
