import { useMemo, useState } from 'react'
import cadastros from '@/dados/cadastros.json'
import BuscaCadastro from '@/components/BuscaCadastro/BuscaCadastro'
import BotaoFiltro from '@/components/BotaoFiltro/BotaoFiltro'
import CartaoCadastro from '@/components/CartaoCadastro/CartaoCadastro'
import ModalCadastro from '@/components/ModalCadastro/ModalCadastro'
import styles from './ListaOrganizador.module.css'

const TIPO = 'organizadores'
const ADMINISTRACAO = false
const STATUS = [
    { id: 'pendente', label: 'Pendentes' },
    { id: 'aprovado', label: 'Aprovados' },
    { id: 'rejeitado', label: 'Reprovados' },
    { id: 'todos', label: 'Todos' },
]

function ListaOrganizador() {
    const [filtro, setFiltro] = useState('pendente')
    const [busca, setBusca] = useState('')
    const [selecionado, setSelecionado] = useState(null)
    const lista = cadastros[TIPO]
    const nomeTipo = TIPO
    const filtrados = useMemo(() => lista.filter((item) => {
        const texto = `${item.nome} ${item.documento} ${item.cidade} ${item.descricao}`.toLowerCase()
        return texto.includes(busca.toLowerCase()) && (!ADMINISTRACAO || filtro === 'todos' || item.status === filtro)
    }), [lista, busca, filtro])

    function atualizarStatus(id, status) {
        const cadastro = lista.find((item) => item.id === id)
        if (cadastro) cadastro.status = status
        setSelecionado(null)
        setFiltro(status)
    }

    return <main className={styles.pagina}>
        <BuscaCadastro nome={nomeTipo} valor={busca} onChange={setBusca} />
        {ADMINISTRACAO && <div className={styles.filtros} role='group' aria-label={`Filtrar ${nomeTipo}`}>
            {STATUS.map((status) => <BotaoFiltro key={status.id} status={status} selecionado={filtro === status.id} onClick={() => setFiltro(status.id)} />)}
        </div>}
        <section className={styles.lista} aria-label={`Lista de ${nomeTipo}`}>
            {filtrados.map((cadastro) => <CartaoCadastro key={cadastro.id} cadastro={cadastro} tipo={TIPO} administracao={ADMINISTRACAO} onDetalhes={setSelecionado} />)}
            {filtrados.length === 0 && <p className={styles.vazio}>Nenhum cadastro encontrado.</p>}
        </section>
        <ModalCadastro cadastro={selecionado} tipo={TIPO} administracao={ADMINISTRACAO} onFechar={() => setSelecionado(null)} onStatus={atualizarStatus} />
    </main>
}

export default ListaOrganizador
