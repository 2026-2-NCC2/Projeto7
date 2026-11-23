import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, dataBr } from '@/utils/api'
import styles from './Propostas.module.css'

const FILTROS = [
    { id: 'pendente', label: 'Enviadas' },
    { id: 'aceita', label: 'Aceitas' },
    { id: 'recusada', label: 'Recusadas' },
    { id: 'cancelada', label: 'Canceladas' },
    { id: 'todas', label: 'Todas' },
]
const LABEL_STATUS = {
    pendente: 'Enviada',
    selecionada: 'Selecionada',
    aceita: 'Aceita',
    recusada: 'Recusada',
    cancelada: 'Cancelada',
}

function PropostasFornecedor() {
    const [filtro, setFiltro] = useState('todas')
    const [propostas, setPropostas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    useEffect(() => {
        let ativo = true

        api('/fornecedores/propostas')
            .then((resposta) => {
                if (ativo) setPropostas(resposta.propostas ?? [])
            })
            .catch((erroApi) => {
                if (ativo) setErro(erroApi.message)
            })
            .finally(() => {
                if (ativo) setCarregando(false)
            })

        return () => {
            ativo = false
        }
    }, [])

    const lista = useMemo(
        () => propostas.filter((p) => filtro === 'todas' || p.status === filtro),
        [propostas, filtro],
    )

    return (
        <main className={styles.pagina}>
            <h1>MINHAS PROPOSTAS</h1>
            <div className={styles.filtros} role='group' aria-label='Filtrar propostas'>
                {FILTROS.map((item) => (
                    <button
                        key={item.id}
                        className={`${styles.filtro} ${styles[item.id]} ${filtro === item.id ? styles.ativo : ''}`}
                        type='button'
                        aria-pressed={filtro === item.id}
                        onClick={() => setFiltro(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <div className={styles.tabelaWrap}>
                {erro && <p className={styles.erro} role='alert'>{erro}</p>}
                {carregando && <p className={styles.vazio}>Carregando propostas...</p>}
                <table>
                    <thead>
                        <tr>
                            <th>EVENTO</th>
                            <th>ITEM</th>
                            <th>VALOR</th>
                            <th>VALIDADE</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.map((p) => (
                            <tr key={p.id}>
                                <td><b>{p.nome_evento}</b></td>
                                <td>
                                    {p.nome_vaga}
                                    {p.origem === 'organizador' && (
                                        <span className={styles.direta}>Direta</span>
                                    )}
                                </td>
                                <td>{Number(p.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td>{dataBr(p.validade)}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[`status${p.status.charAt(0).toUpperCase()}${p.status.slice(1)}`]}`}>
                                        {LABEL_STATUS[p.status] ?? p.status}
                                    </span>
                                </td>
                                <td>
                                    <Link
                                        className={styles.conversa}
                                        to={`/fornecedor/mensagens?proposta=${p.id}`}
                                    >
                                        {p.origem === 'organizador' && p.status === 'pendente'
                                            ? 'Responder →'
                                            : 'Conversa →'}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!carregando && !erro && lista.length === 0 && (
                    <p className={styles.vazio}>Nenhuma proposta disponível.</p>
                )}
            </div>
            <p className={styles.nota}>
                Propostas marcadas como Direta foram enviadas pelo organizador: aceite ou recuse em
                Mensagens. Se a vaga for preenchida antes da sua resposta, a proposta direta é
                cancelada.
            </p>
        </main>
    )
}
export default PropostasFornecedor
