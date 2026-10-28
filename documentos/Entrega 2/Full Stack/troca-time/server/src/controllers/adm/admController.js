import * as service from "../../services/adm/admService.js"

export async function buscarResumoPlataformaController(req, res) {
    /* #swagger.tags = ['Administração']
       #swagger.summary = 'Busca os totais da plataforma'
       #swagger.description = 'Cadastros pendentes, eventos em cotação e propostas com status enviada.'
       #swagger.responses[200] = {
           description: 'Resumo da plataforma',
           content: {
               "application/json": {
                   example: {
                       total_cadastros_pendentes: 2,
                       total_eventos_cotacao: 0,
                       total_propostas_recebidas: 3
                   }
               }
           }
       }
       #swagger.responses[500] = {
           description: 'Erro interno',
           content: { "application/json": { example: { status: 500, erro: "Erro interno do servidor" } } }
       } */
    const resumo = await service.buscarResumoPlataformaService();
    return res.status(200).json(resumo);
}

export async function listarUsuariosController(req, res) {
    /* #swagger.tags = ['Administração']
       #swagger.summary = 'Lista os usuários'
       #swagger.description = 'Lista organizadores e fornecedores. Administradores não aparecem.'
       #swagger.responses[200] = {
           description: 'Lista de usuários',
           content: {
               "application/json": {
                   example: {
                       usuarios: [
                           {
                               id: 2,
                               nome: "Mariana Costa",
                               status_cadastro: "aprovado",
                               tipo_usuario: "organizador",
                               cpf: "12345678901",
                               cnpj: null,
                               descricao: "Organizadora de eventos culturais e musicais.",
                               criado_em: "2026-10-28 20:42:39"
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
    const usuarios = await service.listarUsuariosService()
    return res.status(200).json(usuarios)
}