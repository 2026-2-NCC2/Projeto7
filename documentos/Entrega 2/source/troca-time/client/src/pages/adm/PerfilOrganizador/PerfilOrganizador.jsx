import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, dataBr } from '@/utils/api'
import styles from './PerfilOrganizador.module.css'

const ROTULOS_STATUS = {
    pendente: 'Pendente',
    aprovado: 'Aprovado',
    reprovado: 'Reprovado',
}

function PerfilOrganizador() {
    const { id } = useParams()
    const [organizador, setOrganizador] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [status, setStatus] = useState('')
    const [mensagem, setMensagem] = useState('')

    useEffect(() => {
        setCarregando(true)
        setMensagem('')
        api(`/admin/organizadores/${id}`)
            .then((resposta) => {
                setOrganizador(resposta)
                setStatus(resposta.status_cadastro)
            })
            .catch(() => setOrganizador(null))
            .finally(() => setCarregando(false))
    }, [id])

    if (carregando) return <main className={styles.pagina}>Carregando organizador…</main>

    if (!organizador) {
        return (
            <main className={styles.pagina}>
                <Link className={styles.voltar} to='/adm/usuarios'>
                    ← Usuários
                </Link>
                <p className={styles.naoEncontrado}>Organizador não encontrado.</p>
            </main>
        )
    }

    const iniciais = organizador.nome
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase()
    const eventos = organizador.eventos || []

    async function atualizarStatus(novoStatus) {
        try {
            await api(`/admin/${organizador.id}?status_cadastro=${novoStatus}`, { method: 'PATCH' })
            setStatus(novoStatus)
            setMensagem(`Cadastro ${novoStatus === 'aprovado' ? 'aprovado' : 'reprovado'}.`)
        } catch (erro) {
            setMensagem(erro.message)
        }
    }

    return (
        <main className={styles.pagina}>
            <Link className={styles.voltar} to='/adm/usuarios'>
                ← Usuários
            </Link>

            <section className={styles.destaque} aria-label='Resumo do organizador'>
                <div className={styles.avatar} aria-hidden='true'>
                    {iniciais}
                </div>
                <div className={styles.identificacao}>
                    <div className={styles.nomeLinha}>
                        <h1>{organizador.nome}</h1>
                        <span className={`${styles.status} ${styles[`status${status}`]}`}>
                            {ROTULOS_STATUS[status]}
                        </span>
                    </div>
                    <p>Organizador</p>
                    <div className={styles.acoes}>
                        {status !== 'aprovado' && (
                            <button
                                type='button'
                                className={styles.aprovar}
                                onClick={() => atualizarStatus('aprovado')}
                            >
                                Aprovar cadastro
                            </button>
                        )}
                        {status !== 'reprovado' && (
                            <button
                                type='button'
                                className={styles.reprovar}
                                onClick={() => atualizarStatus('reprovado')}
                            >
                                Reprovar
                            </button>
                        )}
                    </div>
                    <p className={styles.mensagem} role='status' aria-live='polite'>
                        {mensagem}
                    </p>
                </div>
            </section>

            <div className={styles.informacoes}>
                <section className={styles.bloco} aria-labelledby='titulo-dados'>
                    <h2 id='titulo-dados'>Dados</h2>
                    <dl>
                        <div>
                            <dt>CPF/CNPJ:</dt>
                            <dd>{organizador.cnpj || organizador.cpf || 'Não informado'}</dd>
                        </div>
                        <div>
                            <dt>E-mail:</dt>
                            <dd>{organizador.email || 'Não informado'}</dd>
                        </div>
                        <div>
                            <dt>Telefone:</dt>
                            <dd>{organizador.telefone || 'Não informado'}</dd>
                        </div>
                        <div>
                            <dt>Cadastrado em:</dt>
                            <dd>
                                {organizador.criado_em
                                    ? dataBr(organizador.criado_em)
                                    : 'Não informado'}
                            </dd>
                        </div>
                    </dl>
                </section>

                <section className={styles.bloco} aria-labelledby='titulo-descricao'>
                    <h2 id='titulo-descricao'>Descrição</h2>
                    <p className={styles.textoDescricao}>
                        {organizador.descricao || 'Sem descrição cadastrada.'}
                    </p>
                </section>
            </div>

            <section className={styles.secaoEventos} aria-labelledby='titulo-eventos'>
                <h2 id='titulo-eventos'>Próximos eventos:</h2>
                <div className={styles.listaEventos}>
                    {eventos.length ? (
                        eventos.map((evento) => (
                            <article className={styles.evento} key={evento.id}>
                                <p className={styles.nomeEvento}>
                                    <strong>{evento.nome}</strong> · {evento.nome_local} —{' '}
                                    {evento.cidade}/{evento.estado}
                                </p>
                                <strong className={styles.dataEvento}>
                                    {dataBr(evento.data)} · {evento.horario_inicio?.slice(0, 5)}
                                </strong>
                            </article>
                        ))
                    ) : (
                        <p className={styles.semEventos}>
                            Este organizador não possui eventos publicados para os próximos dias.
                        </p>
                    )}
                </div>
            </section>
        </main>
    )
}

export default PerfilOrganizador
