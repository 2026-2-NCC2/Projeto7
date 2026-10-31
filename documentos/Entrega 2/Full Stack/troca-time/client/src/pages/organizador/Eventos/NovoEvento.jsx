import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Botao from '@/components/Botao/Botao'
import Campo from '@/components/Campo/Campo'
import { api, dataHoraSql, dataParaCampo, mascaraData, usuarioId } from '@/utils/api'
import styles from './NovoEvento.module.css'

const vazio = { nome: '', descricao: '', inicio: '', horaInicio: '', fim: '', horaFim: '', nome_local: '', cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', publico_min: '', publico_max: '', publico_esperado: '', margem_lucro: '' }
function dataMascaraDoBanco(value) {
    if (!value) return ''
    const [ano, mes, dia] = String(value).slice(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
}
function NovoEvento() {
    const { eventoId } = useParams()
    const navigate = useNavigate()
    const organizadorId = usuarioId('organizador')
    const [form, setForm] = useState(vazio)
    const [erro, setErro] = useState('')
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        if (!eventoId) return
        api(`/organizadores/${organizadorId}/eventos/${eventoId}`).then((evento) => {
            const inicio = dataParaCampo(evento.inicio)
            const fim = dataParaCampo(evento.fim)
            setForm({ ...vazio, ...evento, inicio: dataMascaraDoBanco(inicio.slice(0, 10)), horaInicio: inicio.slice(11), fim: dataMascaraDoBanco(fim.slice(0, 10)), horaFim: fim.slice(11) })
        }).catch((error) => setErro(error.message))
    }, [eventoId, organizadorId])

    function atualizar(campo) { return (event) => setForm((atual) => ({ ...atual, [campo]: campo === 'inicio' || campo === 'fim' ? mascaraData(event.target.value) : event.target.value })) }

    async function salvar(event) {
        event.preventDefault()
        setErro('')
        const inicio = dataHoraSql(form.inicio, form.horaInicio)
        const fim = dataHoraSql(form.fim, form.horaFim)
        const dados = { ...form, inicio, fim, publico_min: Number(form.publico_min), publico_max: Number(form.publico_max), publico_esperado: form.publico_esperado ? Number(form.publico_esperado) : null, margem_lucro: Number(form.margem_lucro) }
        setSalvando(true)
        try {
            if (eventoId) {
                await api(`/organizadores/${organizadorId}/eventos/${eventoId}`, { method: 'PUT', body: JSON.stringify(dados) })
                navigate(`/organizador/eventos/${eventoId}`)
            } else {
                const resposta = await api(`/organizadores/${organizadorId}/eventos`, { method: 'POST', body: JSON.stringify(dados) })
                navigate(`/organizador/eventos/${resposta.id}/itens`)
            }
        } catch (error) { setErro(error.message) }
        finally { setSalvando(false) }
    }

    return <main className={styles.pagina}>
        <h1>{eventoId ? 'Editar evento' : 'Novo evento'}</h1>
        <form className={styles.formulario} onSubmit={salvar}>
            <h2>Dados do evento</h2>
            <Campo id='nome' rotulo='*Nome do evento:' placeholder='ex.: Calourada FECAP 2026' value={form.nome} onChange={atualizar('nome')} required />
            <label className={styles.rotulo} htmlFor='descricao'>*Descrição:</label><textarea id='descricao' placeholder='Conte como será o evento' value={form.descricao} onChange={atualizar('descricao')} required />
            <div className={styles.duasColunas}>
                <Campo id='inicio' rotulo='*Data de início:' placeholder='dd/mm/aaaa' inputMode='numeric' maxLength='10' value={form.inicio} onChange={atualizar('inicio')} required />
                <Campo id='horaInicio' rotulo='*Hora de início:' type='time' value={form.horaInicio} onChange={atualizar('horaInicio')} required />
                <Campo id='fim' rotulo='*Data de término:' placeholder='dd/mm/aaaa' inputMode='numeric' maxLength='10' value={form.fim} onChange={atualizar('fim')} required />
                <Campo id='horaFim' rotulo='*Hora de término:' type='time' value={form.horaFim} onChange={atualizar('horaFim')} required />
            </div>
            <h2>Local</h2>
            <div className={styles.duasColunas}><Campo id='nome_local' rotulo='*Nome do local:' placeholder='ex.: Espaço Unimed' value={form.nome_local} onChange={atualizar('nome_local')} required /><Campo id='cep' rotulo='*CEP:' placeholder='00000-000' value={form.cep} onChange={atualizar('cep')} required /></div>
            <Campo id='rua' rotulo='*Endereço:' placeholder='Rua, número, bairro e cidade' value={form.rua} onChange={atualizar('rua')} required />
            <h2>Público e margem</h2>
            <div className={styles.duasColunas}><Campo id='publico_min' rotulo='*Público mínimo:' type='number' min='1' placeholder='ex.: 2000' value={form.publico_min} onChange={atualizar('publico_min')} required /><Campo id='publico_max' rotulo='*Público máximo:' type='number' min='1' placeholder='ex.: 6000' value={form.publico_max} onChange={atualizar('publico_max')} required /><Campo id='publico_esperado' rotulo='Público esperado:' type='number' min='1' placeholder='opcional' value={form.publico_esperado} onChange={atualizar('publico_esperado')} /><Campo id='margem_lucro' rotulo='*Margem de lucro (%):' type='number' min='0' max='99.99' step='0.01' placeholder='entre 0 e 99,99' value={form.margem_lucro} onChange={atualizar('margem_lucro')} required /></div>
            {erro && <p className={styles.erro} role='alert'>{erro}</p>}
            <div className={styles.acoes}><Botao type='submit' disabled={salvando}>{salvando ? 'Salvando…' : eventoId ? 'Salvar alterações →' : 'Salvar e cadastrar itens de custo →'}</Botao><Link to='/organizador/eventos'>Cancelar</Link></div>
        </form>
    </main>
}
export default NovoEvento
