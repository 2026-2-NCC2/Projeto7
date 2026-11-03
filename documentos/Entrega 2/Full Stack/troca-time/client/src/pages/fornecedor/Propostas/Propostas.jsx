import { useMemo, useState } from 'react'
import styles from './Propostas.module.css'

const FILTROS = [{ id: 'enviada', label: 'Enviadas' }, { id: 'aprovada', label: 'Aprovadas' }, { id: 'recusada', label: 'Recusadas' }, { id: 'todas', label: 'Todas' }]
const LABEL_STATUS = { enviada: 'Enviada', aprovada: 'Aprovada', recusada: 'Recusada', cancelada: 'Cancelada' }

function PropostasFornecedor() {
    const [filtro, setFiltro] = useState('todas')
    const propostas = []
    const lista = useMemo(() => propostas.filter((p) => filtro === 'todas' || p.status === filtro), [propostas, filtro])

    return <main className={styles.pagina}>
        <h1>MINHAS PROPOSTAS</h1>
        <div className={styles.filtros} role='group' aria-label='Filtrar propostas'>
            {FILTROS.map((item) => <button key={item.id} className={`${styles.filtro} ${styles[item.id]} ${filtro === item.id ? styles.ativo : ''}`} type='button' aria-pressed={filtro === item.id} onClick={() => setFiltro(item.id)}>{item.label}</button>)}
        </div>
        <div className={styles.tabelaWrap}><table><thead><tr><th>EVENTO</th><th>ITEM</th><th>VALOR</th><th>VALIDADE</th><th>STATUS</th><th></th></tr></thead>
            <tbody>{lista.map((p) => <tr key={p.id}><td><b>{p.evento}</b></td><td>{p.item}</td><td>{p.valor}</td><td>{p.validade}</td><td><span className={`${styles.status} ${styles[`status_${p.status}`]}`}>{LABEL_STATUS[p.status] ?? p.status}</span></td><td /></tr>)}</tbody>
        </table>{lista.length === 0 && <p className={styles.vazio}>Nenhuma proposta disponível.</p>}</div>
        <p className={styles.nota}>Propostas só podem ser editadas ou canceladas enquanto estiverem com status Enviada.</p>
    </main>
}
export default PropostasFornecedor
