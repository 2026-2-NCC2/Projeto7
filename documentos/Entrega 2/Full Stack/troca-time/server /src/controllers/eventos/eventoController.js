import * as service from "../../services/eventos/eventoService.js"

export async function listarEventosController(req, res) {
    /* #swagger.tags = ['Eventos']
       #swagger.summary = 'Lista os eventos'
       #swagger.description = 'Lista todos os eventos, do mais antigo para o mais recente, com o organizador e a quantidade de propostas recebidas.'
       #swagger.responses[200] = {
           description: 'Lista de eventos',
           content: {
               "application/json": {
                   example: {
                       eventos: [
                           {
                               id: 1,
                               nome: "Festival Som de Primavera",
                               status: "publicado",
                               descricao: "Festival de música independente com bandas locais e praça de alimentação.",
                               inicio: "2026-11-21 14:00:00",
                               fim: "2026-11-21 23:00:00",
                               nome_local: "Parque das Artes",
                               quantidade_propostas: 3,
                               ticket_estimado_min: 45,
                               ticket_estimado_max: 80,
                               nome_organizador: "Mariana Costa",
                               organizador_id: 2
                           }
                       ]
                   }
               }
           }
       }
       #swagger.responses[500] = {
           description: 'Erro interno',
           content: { "application/json": { example: { status: 500, erro: "Erro interno do servidor" } } }
       } */
    const eventos = await service.listarEventosService()
    return res.status(200).json(eventos)
}