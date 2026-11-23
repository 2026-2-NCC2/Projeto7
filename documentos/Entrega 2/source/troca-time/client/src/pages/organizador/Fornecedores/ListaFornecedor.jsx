import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BuscaCadastro from '@/components/BuscaCadastro/BuscaCadastro'
import { api } from '@/utils/api'
import styles from './ListaFornecedor.module.css'

function ListaFornecedor() {
    const [fornecedores, setFornecedores] = useState([])
    const [busca, setBusca] = useState('')
    const [erro, setErro] = useState('')
    useEffect(() => {
        api('/usuarios/')
            .then((data) =>
                setFornecedores(
                    (data.usuarios || []).filter(
                        (usuario) =>
                            usuario.tipo_usuario === 'fornecedor' &&
                            usuario.status_cadastro === 'aprovado',
                    ),
                ),
            )
            .catch((error) => setErro(error.message))
    }, [])
    const lista = useMemo(
        () =>
            fornecedores.filter((fornecedor) => {
                const texto =
                    `${fornecedor.nome} ${fornecedor.cpf_cnpj || ''} ${fornecedor.descricao || ''}`.toLowerCase()
                return texto.includes(busca.toLowerCase())
            }),
        [fornecedores, busca],
    )
    return (
        <main className={styles.pagina}>
            <h1>FORNECEDORES</h1>
            <p className={styles.subtitulo}></p>
            <BuscaCadastro nome='fornecedores' valor={busca} onChange={setBusca} />
            {erro && (
                <p className={styles.erro} role='alert'>
                    {erro}
                </p>
            )}
            <section className={styles.lista}>
                {lista.map((fornecedor) => (
                    <article className={styles.cartao} key={fornecedor.id}>
                        <span className={styles.avatar}>
                            {fornecedor.nome
                                .split(/\s+/)
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                        </span>
                        <div className={styles.dados}>
                            <h2>{fornecedor.nome}</h2>
                            <p>
                                <b>CNPJ:</b> {fornecedor.cpf_cnpj || '—'}
                            </p>
                        </div>
                        <div className={styles.descricao}>
                            <b>Descrição</b>
                            <p>{fornecedor.descricao || 'Sem descrição cadastrada.'}</p>
                        </div>
                        <Link to={`/organizador/fornecedores/${fornecedor.id}`}>Ver mais</Link>
                    </article>
                ))}
                {!erro && !lista.length && (
                    <p className={styles.vazio}>Nenhum fornecedor encontrado.</p>
                )}
            </section>
        </main>
    )
}
export default ListaFornecedor
