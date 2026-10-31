import * as service from "../../services/fornecedor/fornecedorService.js"
import { AppException } from "../../exceptions/appExceptions.js"

export async function buscarDetalhesFornecedorController(req, res) {
    /* #swagger.tags = ['Fornecedores']
       #swagger.summary = 'Busca os detalhes de um fornecedor e suas propostas'
       #swagger.description = 'Retorna os dados do fornecedor e as propostas que ele enviou, da mais recente para a mais antiga. Só encontra usuários com tipo_usuario = fornecedor.'
       #swagger.parameters['id'] = {
           in: 'path',
           description: 'ID do usuário fornecedor (inteiro positivo)',
           required: true,
           '@schema': { type: 'integer', minimum: 1, example: 5 }
       }
       #swagger.responses[200] = {
           description: 'Fornecedor encontrado',
           content: {
               "application/json": {
                   example: {
                       id: 5,
                       nome: "Som & Luz Produções",
                       status_cadastro: "aprovado",
                       tipo_usuario: "fornecedor",
                       categoria: "audiovisual",
                       cnpj: "23456789000188",
                       telefone: "11990000005",
                       email: "contato@someluz.test",
                       descricao: "Equipamentos de áudio, iluminação e equipe técnica.",
                       criado_em: "2026-10-28 20:42:39",
                       propostas: [
                           {
                               id: 1,
                               nome_vaga: "Sonorização e iluminação",
                               categoria: "audiovisual",
                               evento_id: 1,
                               nome_evento: "Festival Som de Primavera",
                               valor: 8500,
                               status: "enviada",
                               descricao: "Pacote de sonorização e iluminação com operação técnica."
                           }
                       ]
                   }
               }
           }
       }
       #swagger.responses[400] = {
           description: 'ID inválido',
           content: { "application/json": { example: { status: 400, erro: "ID do fornecedor inválido" } } }
       }
       #swagger.responses[404] = {
           description: 'Fornecedor não encontrado',
           content: { "application/json": { example: { status: 404, erro: "Fornecedor não encontrado" } } }
       }
       #swagger.responses[500] = {
           description: 'Erro interno',
           content: { "application/json": { example: { status: 500, erro: "Erro interno do servidor" } } }
       } */
    const usuario_id = Number(req.params.id)

    if (!Number.isInteger(usuario_id) || usuario_id <= 0) {
        throw new AppException("ID do fornecedor inválido", 400)
    }

    const fornecedor = await service.buscarDetalhesFornecedorService(usuario_id)
    return res.status(200).json(fornecedor)
}
