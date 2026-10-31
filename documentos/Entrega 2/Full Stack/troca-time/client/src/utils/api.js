import { mockApi } from '@/utils/mockApi'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function api(path, options = {}) {
    if (path.startsWith('/organizadores/') || /^\/fornecedores\/(oportunidades$|eventos\/|vagas\/|propostas$|\d+$)/.test(path)) {
        return mockApi(path, options)
    }
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    })
    if (response.status === 204) return null
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.erro || 'Não foi possível concluir a solicitação.')
    return data
}

export function usuarioId(tipo) {
    const salvo = sessionStorage.getItem('usuario_id') || localStorage.getItem('usuario_id')
    const padrao = tipo === 'fornecedor' ? 5 : 2
    return Number(salvo || (tipo === 'fornecedor' ? import.meta.env.VITE_FORNECEDOR_ID : import.meta.env.VITE_ORGANIZADOR_ID) || padrao)
}

export function dataBr(data) {
    if (!data) return '—'
    const [ano, mes, dia] = String(data).slice(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
}

export function dataHoraBr(data) {
    if (!data) return '—'
    const [date, time = ''] = String(data).replace('T', ' ').split(' ')
    return `${dataBr(date)}${time ? `, ${time.slice(0, 5)}` : ''}`
}

export function dataParaCampo(data) {
    if (!data) return ''
    const [date, time = ''] = String(data).replace('T', ' ').split(' ')
    return `${date}T${time.slice(0, 5)}`
}

export function dataHoraSql(data, hora) {
    const [dia, mes, ano] = String(data).split('/')
    return `${ano}-${mes}-${dia}T${hora}:00`
}

export function mascaraData(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 8)
    if (numeros.length <= 2) return numeros
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`
}
