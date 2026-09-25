import { responder } from './simularApi.js'
import { atualizarStatusOrganizador } from './organizadores.js'

// Indicadores por período (7 dias, 30 dias, tudo)
// tickets: valor estimado do ingresso com público mínimo e com público máximo (RF13)
const INDICADORES = {
    '7d': {
        eventosCadastrados: 9,
        eventosEmCotacao: 4,
        propostasRecebidas: 17,
        ticketMedio: 96,
        etapas: [
            { nome: 'Em cadastro', total: 5 },
            { nome: 'Em cotação', total: 4 },
            { nome: 'Orçamento consolidado', total: 2 },
            { nome: 'Ticket calculado', total: 1 },
        ],
        tickets: [
            { evento: 'Calourada', minimo: 85, maximo: 52 },
            { evento: 'Arraiá', minimo: 60, maximo: 38 },
            { evento: 'Rooftop', minimo: 150, maximo: 95 },
        ],
    },
    '30d': {
        eventosCadastrados: 37,
        eventosEmCotacao: 11,
        propostasRecebidas: 63,
        ticketMedio: 103,
        etapas: [
            { nome: 'Em cadastro', total: 14 },
            { nome: 'Em cotação', total: 11 },
            { nome: 'Orçamento consolidado', total: 7 },
            { nome: 'Ticket calculado', total: 5 },
        ],
        tickets: [
            { evento: 'Calourada', minimo: 85, maximo: 52 },
            { evento: 'Atlética Fest', minimo: 120, maximo: 78 },
            { evento: 'Baile de Gala', minimo: 210, maximo: 140 },
            { evento: 'Arraiá', minimo: 60, maximo: 38 },
            { evento: 'Rooftop', minimo: 150, maximo: 95 },
        ],
    },
    tudo: {
        eventosCadastrados: 84,
        eventosEmCotacao: 13,
        propostasRecebidas: 191,
        ticketMedio: 112,
        etapas: [
            { nome: 'Em cadastro', total: 21 },
            { nome: 'Em cotação', total: 13 },
            { nome: 'Orçamento consolidado', total: 19 },
            { nome: 'Ticket calculado', total: 31 },
        ],
        tickets: [
            { evento: 'Calourada', minimo: 85, maximo: 52 },
            { evento: 'Atlética Fest', minimo: 120, maximo: 78 },
            { evento: 'Baile de Gala', minimo: 210, maximo: 140 },
            { evento: 'Arraiá', minimo: 60, maximo: 38 },
            { evento: 'Rooftop', minimo: 150, maximo: 95 },
            { evento: 'Semana do Rock', minimo: 135, maximo: 88 },
        ],
    },
}

// tipo: 'fornecedor' | 'organizador'
// organizadorId liga o cadastro ao perfil em /organizadores/:id
let cadastrosPendentes = [
    { id: 1, nome: 'Luz & Som Produções', atuacao: 'Iluminação e som', tipo: 'fornecedor', pedido: '2026-09-19' },
    { id: 2, nome: 'Coletivo Rolê', atuacao: 'Festas e shows', tipo: 'organizador', pedido: '2026-09-18', organizadorId: 2 },
    { id: 3, nome: 'Sabor de Festa Buffet', atuacao: 'Alimentação e bebidas', tipo: 'fornecedor', pedido: '2026-09-18' },
    { id: 4, nome: 'Segura Eventos', atuacao: 'Segurança', tipo: 'fornecedor', pedido: '2026-09-17' },
    { id: 5, nome: 'Formaturas 360', atuacao: 'Formaturas', tipo: 'organizador', pedido: '2026-09-17', organizadorId: 5 },
    { id: 6, nome: 'Atlética Unida', atuacao: 'Jogos universitários', tipo: 'organizador', pedido: '2026-09-16' },
]

// tipo: 'aprovado' | 'rejeitado' | 'movido'
let acoesRecentes = [
    { id: 'a1', tipo: 'aprovado', texto: 'Fornecedor aprovado: Estrutura Palco Forte', quando: 'Hoje, 14:20' },
    { id: 'a2', tipo: 'rejeitado', texto: 'Organizador rejeitado: dados incompletos', quando: 'Hoje, 11:05' },
    { id: 'a3', tipo: 'movido', texto: 'Evento Calourada movido para Em cotação', quando: 'Ontem, 17:42' },
    { id: 'a4', tipo: 'aprovado', texto: 'Organizador aprovado: Festas Unificadas', quando: 'Ontem, 09:30' },
    { id: 'a5', tipo: 'rejeitado', texto: 'Fornecedor rejeitado: cadastro duplicado', quando: '18/09, 16:10' },
    { id: 'a6', tipo: 'movido', texto: 'Evento Baile de Gala movido para Ticket calculado', quando: '17/09, 10:15' },
    { id: 'a7', tipo: 'aprovado', texto: 'Fornecedor aprovado: Expo Estruturas', quando: '16/09, 15:48' },
]

export function buscarIndicadores(periodo) {
    return responder(INDICADORES[periodo] ?? INDICADORES['30d'])
}

export function buscarCadastrosPendentes() {
    return responder(cadastrosPendentes)
}

export function buscarAcoesRecentes() {
    return responder(acoesRecentes)
}

function horaAtual() {
    const agora = new Date()
    const hh = String(agora.getHours()).padStart(2, '0')
    const mm = String(agora.getMinutes()).padStart(2, '0')
    return `Hoje, ${hh}:${mm}`
}

// decisao: 'aprovado' | 'rejeitado'  (RF03)
export async function decidirCadastro(id, decisao) {
    const cadastro = cadastrosPendentes.find((item) => item.id === id)
    if (!cadastro) throw new Error('Cadastro não encontrado')

    if (cadastro.organizadorId) {
        await atualizarStatusOrganizador(cadastro.organizadorId, decisao)
    }

    const perfil = cadastro.tipo === 'fornecedor' ? 'Fornecedor' : 'Organizador'
    const acao = {
        id: `a${Date.now()}`,
        tipo: decisao,
        texto: `${perfil} ${decisao}: ${cadastro.nome}`,
        quando: horaAtual(),
    }

    cadastrosPendentes = cadastrosPendentes.filter((item) => item.id !== id)
    acoesRecentes = [acao, ...acoesRecentes]

    return responder(acao)
}
