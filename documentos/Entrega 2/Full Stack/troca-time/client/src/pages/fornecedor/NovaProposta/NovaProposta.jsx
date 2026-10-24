import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Botao from '@/components/Botao/Botao'
import Campo from '@/components/Campo/Campo'
import styles from './NovaProposta.module.css'

function NovaProposta() {
    const { propostaId } = useParams()
    const [erro, setErro] = useState('')
    const [form, setForm] = useState({ valor: '', validade: '', descricao: '', observacoes: '' })
    function atualizar(campo) { return (e) => setForm((atual) => ({ ...atual, [campo]: e.target.value })) }
    function enviar(e) {
        e.preventDefault()
        setErro('O envio será conectado ao banco pelo servidor.')
    }

    return <main className={styles.pagina}>
        <h1>{propostaId ? 'Editar proposta' : 'Nova proposta'}</h1>
        <section className={styles.resumo}><span className={styles.dia}>—</span><div><small>PARA O EVENTO</small><b>—</b><span>Data · Local · Organizador</span></div></section>
        <form className={styles.formulario} onSubmit={enviar}>
            <div className={styles.camposTopo}>
                <Campo id='item' rotulo='*Item:'>
                    <select id='item' value='' onChange={() => {}}>
                        <option value=''>Serviços disponíveis serão carregados do banco</option>
                    </select>
                </Campo>
                <Campo id='valor' rotulo='*Valor (R$):' type='number' min='0.01' step='0.01' placeholder='0,00' value={form.valor} onChange={atualizar('valor')} required />
                <Campo id='validade' rotulo='*Validade da proposta:' type='date' min={new Date().toISOString().slice(0, 10)} value={form.validade} onChange={atualizar('validade')} required />
            </div>
            <label className={styles.rotulo} htmlFor='descricao'>*Descrição:</label><textarea id='descricao' placeholder='O que está incluso no serviço' value={form.descricao} onChange={atualizar('descricao')} required />
            <label className={styles.rotulo} htmlFor='observacoes'>Observações:</label><textarea id='observacoes' placeholder='Condições, prazos de montagem, itens à parte' value={form.observacoes} onChange={atualizar('observacoes')} />
            {erro && <p className={styles.erro} role='alert'>{erro}</p>}
            <Botao type='submit'>Enviar proposta →</Botao>
        </form>
    </main>
}
export default NovaProposta
