import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Botao from '@/components/Botao/Botao'
import Campo from '@/components/Campo/Campo'
import { api, mascaraData } from '@/utils/api'
import styles from './NovoEvento.module.css'

const vazio = {
    nome: '',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    publico_min: '',
    publico_max: '',
    nome_local: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
}
function dataMascaraDoBanco(value) {
    if (!value) return ''
    const [ano, mes, dia] = String(value).slice(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
}
function dataParaBanco(value) {
    const [dia, mes, ano] = String(value).split('/')
    return `${ano}-${mes}-${dia}`
}
function NovoEvento() {
    const { eventoId } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState(vazio)
    const [erro, setErro] = useState('')
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        if (!eventoId) return
        api(`/eventos/${eventoId}`)
            .then((evento) => {
                setForm({
                    ...vazio,
                    ...evento,
                    complemento: evento.complemento || '',
                    data: dataMascaraDoBanco(evento.data),
                    horaInicio: String(evento.horario_inicio || '').slice(0, 5),
                    horaFim: String(evento.horario_fim || '').slice(0, 5),
                })
            })
            .catch((error) => setErro(error.message))
    }, [eventoId])

    function atualizar(campo) {
        return (event) =>
            setForm((atual) => ({
                ...atual,
                [campo]: campo === 'data' ? mascaraData(event.target.value) : event.target.value,
            }))
    }

    async function salvar(event) {
        event.preventDefault()
        setErro('')
        const dados = {
            ...form,
            data: dataParaBanco(form.data),
            horario_inicio: form.horaInicio,
            horario_fim: form.horaFim,
            publico_min: Number(form.publico_min),
            publico_max: Number(form.publico_max),
            cep: form.cep.replace(/\D/g, ''),
        }
        setSalvando(true)
        try {
            if (eventoId) {
                await api(`/organizadores/${eventoId}`, {
                    method: 'PUT',
                    body: JSON.stringify(dados),
                })
                navigate(`/organizador/eventos/${eventoId}`)
            } else {
                const resposta = await api('/organizadores/', {
                    method: 'POST',
                    body: JSON.stringify(dados),
                })
                navigate(`/organizador/eventos/${resposta.evento_id}`)
            }
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <main className={styles.pagina}>
            <h1>{eventoId ? 'Editar evento' : 'Novo evento'}</h1>
            <form className={styles.formulario} onSubmit={salvar}>
                <h2>Dados do evento</h2>
                <Campo
                    id='nome'
                    rotulo='*Nome do evento:'
                    placeholder='ex.: Calourada FECAP 2026'
                    value={form.nome}
                    onChange={atualizar('nome')}
                    required
                />
                <label className={styles.rotulo} htmlFor='descricao'>
                    *Descrição:
                </label>
                <textarea
                    id='descricao'
                    placeholder='Conte como será o evento'
                    value={form.descricao}
                    onChange={atualizar('descricao')}
                    required
                />
                <div className={styles.duasColunas}>
                    <Campo
                        id='data'
                        rotulo='*Data:'
                        placeholder='dd/mm/aaaa'
                        inputMode='numeric'
                        maxLength='10'
                        value={form.data}
                        onChange={atualizar('data')}
                        required
                    />
                    <Campo
                        id='horaInicio'
                        rotulo='*Hora de início:'
                        type='time'
                        value={form.horaInicio}
                        onChange={atualizar('horaInicio')}
                        required
                    />
                    <Campo
                        id='horaFim'
                        rotulo='*Hora de término:'
                        type='time'
                        value={form.horaFim}
                        onChange={atualizar('horaFim')}
                        required
                    />
                </div>
                <h2>Público</h2>
                <div className={styles.duasColunas}>
                    <Campo
                        id='publico_min'
                        rotulo='*Público mínimo:'
                        type='number'
                        min='1'
                        placeholder='ex.: 2000'
                        value={form.publico_min}
                        onChange={atualizar('publico_min')}
                        required
                    />
                    <Campo
                        id='publico_max'
                        rotulo='*Público máximo:'
                        type='number'
                        min='1'
                        placeholder='ex.: 6000'
                        value={form.publico_max}
                        onChange={atualizar('publico_max')}
                        required
                    />
                </div>
                <h2>Local</h2>
                <div className={styles.duasColunas}>
                    <Campo
                        id='nome_local'
                        rotulo='*Nome do local:'
                        placeholder='ex.: Espaço Unimed'
                        value={form.nome_local}
                        onChange={atualizar('nome_local')}
                        required
                    />
                    <Campo
                        id='cep'
                        rotulo='*CEP:'
                        placeholder='00000-000'
                        value={form.cep}
                        onChange={atualizar('cep')}
                        required
                    />
                </div>
                <div className={styles.duasColunas}>
                    <Campo
                        id='rua'
                        rotulo='*Rua:'
                        placeholder='ex.: Avenida Paulista'
                        value={form.rua}
                        onChange={atualizar('rua')}
                        required
                    />
                    <Campo
                        id='numero'
                        rotulo='*Número:'
                        placeholder='ex.: 1000'
                        value={form.numero}
                        onChange={atualizar('numero')}
                        required
                    />
                    <Campo
                        id='complemento'
                        rotulo='Complemento:'
                        placeholder='opcional'
                        value={form.complemento}
                        onChange={atualizar('complemento')}
                    />
                    <Campo
                        id='bairro'
                        rotulo='*Bairro:'
                        placeholder='ex.: Bela Vista'
                        value={form.bairro}
                        onChange={atualizar('bairro')}
                        required
                    />
                    <Campo
                        id='cidade'
                        rotulo='*Cidade:'
                        placeholder='ex.: São Paulo'
                        value={form.cidade}
                        onChange={atualizar('cidade')}
                        required
                    />
                    <Campo
                        id='estado'
                        rotulo='*Estado:'
                        placeholder='ex.: SP'
                        value={form.estado}
                        onChange={atualizar('estado')}
                        required
                    />
                </div>
                {erro && (
                    <p className={styles.erro} role='alert'>
                        {erro}
                    </p>
                )}
                <div className={styles.acoes}>
                    <Botao type='submit' disabled={salvando}>
                        {salvando
                            ? 'Salvando…'
                            : eventoId
                              ? 'Salvar alterações →'
                              : 'Salvar e cadastrar itens de custo →'}
                    </Botao>
                    <Link to='/organizador/eventos'>Cancelar</Link>
                </div>
            </form>
        </main>
    )
}
export default NovoEvento
