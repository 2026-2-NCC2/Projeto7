import { responder } from './simularApi.js'

// status possíveis: 'pendente' | 'aprovado' | 'rejeitado'
let organizadores = [
    {
        id: 1,
        nome: 'Eventos Brasil',
        documento: '12.345.678/0001-90',
        cidade: 'São Paulo',
        estado: 'SP',
        descricao:
            'Produtora de festas universitárias e shows de médio porte. Organiza calouradas, ' +
            'festas de atléticas e formaturas na Grande São Paulo desde 2019.',
        status: 'aprovado',
        eventos: [
            { id: 'eb1', nome: 'Calourada 2027', info: 'Recepção dos calouros', data: '06/03/2027 - 22:00', local: 'Espaço Villa Lobos' },
            { id: 'eb2', nome: 'Atlética Fest', info: 'Festa das atléticas', data: '17/04/2027 - 21:00', local: 'Arena Central' },
            { id: 'eb3', nome: 'Baile de Gala', info: 'Baile de formatura', data: '12/06/2027 - 20:00', local: 'Salão Imperial' },
            { id: 'eb4', nome: 'Arraiá Universitário', info: 'Festa junina', data: '03/07/2027 - 18:00', local: 'Parque Municipal' },
            { id: 'eb5', nome: 'Rooftop Sessions', info: 'Festa com DJ ao pôr do sol', data: '21/08/2027 - 17:00', local: 'Terraço Paulista' },
        ],
        avaliacoes: [
            { id: 'av1', usuario: 'Estrutura Palco Forte', nota: 5, texto: 'Briefing claro e pagamento dentro do prazo combinado.' },
            { id: 'av2', usuario: 'Luz & Som Produções', nota: 4, texto: 'Boa comunicação. O horário de montagem mudou em cima da hora.' },
            { id: 'av3', usuario: 'Sabor de Festa Buffet', nota: 5, texto: 'Informou o público esperado com antecedência, o que ajudou no orçamento.' },
            { id: 'av4', usuario: 'Segura Eventos', nota: 4, texto: 'Evento bem organizado e equipe acessível durante a noite.' },
        ],
    },
    {
        id: 2,
        nome: 'Coletivo Rolê',
        documento: '123.456.789-00',
        cidade: 'Campinas',
        estado: 'SP',
        descricao: 'Coletivo que organiza festas e shows independentes para o público universitário.',
        status: 'pendente',
        eventos: [],
        avaliacoes: [],
    },
    {
        id: 5,
        nome: 'Formaturas 360',
        documento: '98.765.432/0001-10',
        cidade: 'Santo André',
        estado: 'SP',
        descricao: 'Empresa especializada em bailes e cerimônias de formatura.',
        status: 'pendente',
        eventos: [
            { id: 'f1', nome: 'Formatura Medicina 2027', info: 'Baile de formatura', data: '11/12/2027 - 21:00', local: 'Espaço Rosa Rosarum' },
        ],
        avaliacoes: [],
    },
]

export function buscarOrganizador(id) {
    const organizador = organizadores.find((item) => item.id === Number(id))
    return responder(organizador ?? null)
}

export function atualizarStatusOrganizador(id, status) {
    organizadores = organizadores.map((item) =>
        item.id === Number(id) ? { ...item, status } : item
    )
    return responder({ id: Number(id), status })
}

export function excluirOrganizador(id) {
    organizadores = organizadores.filter((item) => item.id !== Number(id))
    return responder({ id: Number(id) })
}
