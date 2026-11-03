const organizadores = [
    { id: 2, nome: 'Mariana Costa', status_cadastro: 'aprovado' },
    { id: 3, nome: 'Rafael Almeida', status_cadastro: 'pendente' },
    { id: 4, nome: 'Camila Santos', status_cadastro: 'reprovado' },
    { id: 9, nome: 'Lucas Ferreira', status_cadastro: 'aprovado' },
]

const fornecedores = [
    { id: 5, nome: 'Som & Luz Produções', categoria: 'iluminacao', cnpj: '23456789000188', telefone: '11990000005', email: 'contato@someluz.test', descricao: 'Equipamentos de áudio, iluminação e equipe técnica.', status_cadastro: 'aprovado' },
    { id: 6, nome: 'Buffet Sabor da Festa', categoria: 'alimentacao', cnpj: '34567890000177', telefone: '11990000006', email: 'contato@saborfesta.test', descricao: 'Serviço de buffet para eventos de pequeno e médio porte.', status_cadastro: 'aprovado' },
    { id: 7, nome: 'Segurança Alfa', categoria: 'seguranca', cnpj: '45678901000166', telefone: '11990000007', email: 'contato@segurancaalfa.test', descricao: 'Equipe de segurança e controle de acesso.', status_cadastro: 'aprovado' },
    { id: 8, nome: 'Palco Móvel Eventos', categoria: 'estrutura', cnpj: '56789012000155', telefone: '11990000008', email: 'contato@palcomovel.test', descricao: 'Montagem de palco, estruturas e cobertura.', status_cadastro: 'pendente' },
    { id: 10, nome: 'Bebidas Rota 7', categoria: 'bebidas', cnpj: '67890123000144', telefone: '11990000010', email: 'contato@rota7.test', descricao: 'Bar móvel, bebidas e equipe de atendimento.', status_cadastro: 'reprovado' },
]

const eventos = [
    { id: 1, organizador_id: 2, nome: 'Festival Som de Primavera', descricao: 'Festival de música independente com bandas locais e praça de alimentação.', inicio: '2026-11-21 14:00:00', fim: '2026-11-21 23:00:00', status: 'publicado', nome_local: 'Parque das Artes', publico_min: 500, publico_max: 1500, publico_esperado: 1000, margem_lucro: 20, custo_total: 28000, ticket_publico_min: 45, ticket_publico_max: 80, cidade: 'Osasco', estado: 'SP' },
    { id: 2, organizador_id: 2, nome: 'Feira Criativa Urbana', descricao: 'Feira de pequenos empreendedores, artesanato, gastronomia e música.', inicio: '2026-12-05 10:00:00', fim: '2026-12-05 19:00:00', status: 'rascunho', nome_local: 'Espaço Cultural Central', publico_min: 200, publico_max: 600, publico_esperado: 400, margem_lucro: 15, custo_total: 9500, ticket_publico_min: 15, ticket_publico_max: 35, cidade: 'Osasco', estado: 'SP' },
    { id: 3, organizador_id: 2, nome: 'Calourada FECAP 2027', descricao: 'Recepção dos novos alunos com música, alimentação e estrutura completa.', inicio: '2027-02-20 16:00:00', fim: '2027-02-21 02:00:00', status: 'em_cotacao', nome_local: 'Espaço Unimed', publico_min: 2000, publico_max: 6000, publico_esperado: 4000, margem_lucro: 20, custo_total: null, ticket_publico_min: null, ticket_publico_max: null, cidade: 'São Paulo', estado: 'SP' },
    { id: 4, organizador_id: 3, nome: 'Conferência Inova Negócios', descricao: 'Encontro de empreendedorismo, tecnologia e inovação.', inicio: '2026-11-10 08:30:00', fim: '2026-11-10 18:00:00', status: 'reprovado', nome_local: 'Centro de Convenções Oeste', publico_min: 300, publico_max: 800, publico_esperado: 500, margem_lucro: 18, custo_total: 18000, ticket_publico_min: 70, ticket_publico_max: 120, cidade: 'São Paulo', estado: 'SP' },
    { id: 5, organizador_id: 3, nome: 'Festival Luzes da Cidade', descricao: 'Festival ao ar livre com artistas locais e feira gastronômica.', inicio: '2027-03-15 13:00:00', fim: '2027-03-15 23:30:00', status: 'em_cotacao', nome_local: 'Parque Central', publico_min: 800, publico_max: 2500, publico_esperado: 1600, margem_lucro: 18, custo_total: null, ticket_publico_min: null, ticket_publico_max: null, cidade: 'Osasco', estado: 'SP' },
    { id: 6, organizador_id: 3, nome: 'Mostra de Cinema Independente', descricao: 'Exibições, debates e apresentações musicais.', inicio: '2027-04-02 10:00:00', fim: '2027-04-02 22:00:00', status: 'publicado', nome_local: 'Cine Teatro Municipal', publico_min: 400, publico_max: 1200, publico_esperado: 800, margem_lucro: 15, custo_total: null, ticket_publico_min: null, ticket_publico_max: null, cidade: 'Osasco', estado: 'SP' },
    { id: 7, organizador_id: 4, nome: 'Festival Sabores do Bairro', descricao: 'Evento gastronômico com produtores e restaurantes da região.', inicio: '2026-12-12 11:00:00', fim: '2026-12-12 20:00:00', status: 'rascunho', nome_local: 'Praça da Comunidade', publico_min: 150, publico_max: 500, publico_esperado: 300, margem_lucro: 12.5, custo_total: null, ticket_publico_min: null, ticket_publico_max: null, cidade: 'Osasco', estado: 'SP' },
    { id: 8, organizador_id: 4, nome: 'Arraiá da Comunidade', descricao: 'Festa junina com comidas típicas, música e brincadeiras.', inicio: '2027-06-19 12:00:00', fim: '2027-06-19 22:00:00', status: 'em_cotacao', nome_local: 'Clube União', publico_min: 300, publico_max: 1000, publico_esperado: 650, margem_lucro: 15, custo_total: null, ticket_publico_min: null, ticket_publico_max: null, cidade: 'Osasco', estado: 'SP' },
    { id: 9, organizador_id: 9, nome: 'Encontro Criativo', descricao: 'Palestras, oficinas e feira de negócios criativos.', inicio: '2027-05-22 09:00:00', fim: '2027-05-22 19:00:00', status: 'reprovado', nome_local: 'Centro Cultural Oeste', publico_min: 250, publico_max: 900, publico_esperado: 550, margem_lucro: 18, custo_total: null, ticket_publico_min: null, ticket_publico_max: null, cidade: 'Osasco', estado: 'SP' },
    { id: 10, organizador_id: 9, nome: 'Noite do Campus', descricao: 'Evento universitário com DJs e praça de alimentação.', inicio: '2027-08-14 18:00:00', fim: '2027-08-15 03:00:00', status: 'publicado', nome_local: 'Arena Universitária', publico_min: 1000, publico_max: 3500, publico_esperado: 2200, margem_lucro: 20, custo_total: null, ticket_publico_min: null, ticket_publico_max: null, cidade: 'Osasco', estado: 'SP' },
]

const servicosPorEvento = [
    [['Iluminação de palco', 'iluminacao', 'Moving heads, laser e operação técnica.'], ['Buffet para equipe', 'alimentacao', 'Refeições para equipe técnica e produção.'], ['Segurança do evento', 'seguranca', 'Controle de acesso e segurança durante o festival.']],
    [['Estrutura de palco', 'estrutura', 'Palco modular com cobertura e montagem.'], ['Coffee break', 'alimentacao', 'Coffee break para expositores e equipe.'], ['Bar de bebidas', 'bebidas', 'Bebidas não alcoólicas para a feira.']],
    [['Iluminação de palco', 'iluminacao', 'Moving heads, laser e operação técnica.'], ['Alimentação do evento', 'alimentacao', 'Refeições e opções vegetarianas para o público.'], ['Palco e tendas', 'estrutura', 'Palco 12x8m, cobertura e quatro tendas.']],
    [['Som e iluminação', 'iluminacao', 'Sistema de som e iluminação para palestras.'], ['Coffee break corporativo', 'alimentacao', 'Coffee break para participantes e equipe.'], ['Segurança patrimonial', 'seguranca', 'Equipe de segurança e controle de acesso.']],
    [['Iluminação cênica', 'iluminacao', 'Iluminação de palco com montagem e operação.'], ['Alimentação para artistas', 'alimentacao', 'Refeições para artistas, produção e equipe.'], ['Bar móvel', 'bebidas', 'Bar móvel com bebidas e equipe de atendimento.']],
    [['Som para exibição', 'iluminacao', 'Sonorização para sala de exibição e debates.'], ['Buffet de encerramento', 'alimentacao', 'Coquetel para convidados e participantes.'], ['Segurança e recepção', 'seguranca', 'Recepção e controle de acesso.']],
    [['Tendas para expositores', 'estrutura', 'Tendas, mesas e montagem para produtores.'], ['Bebidas e bar', 'bebidas', 'Bar de bebidas para o público.'], ['Segurança da praça', 'seguranca', 'Equipe de segurança para área externa.']],
    [['Iluminação da festa', 'iluminacao', 'Iluminação decorativa e de palco.'], ['Comidas típicas', 'alimentacao', 'Barracas e serviço de comidas típicas.'], ['Estrutura de barracas', 'estrutura', 'Montagem de barracas, mesas e cobertura.']],
    [['Estrutura para oficinas', 'estrutura', 'Mesas, cadeiras e montagem das oficinas.'], ['Alimentação dos participantes', 'alimentacao', 'Coffee break para participantes e palestrantes.'], ['Som para palestras', 'iluminacao', 'Sonorização para auditório e salas de oficina.']],
    [['Iluminação de pista', 'iluminacao', 'Iluminação para pista e palco dos DJs.'], ['Bebidas do evento', 'bebidas', 'Bebidas e equipe de atendimento.']],
]
const vagas = []
let vagaId = 1
servicosPorEvento.forEach((servicos, index) => servicos.forEach(([nome, categoria, descricao]) => {
    vagas.push({ id: vagaId, evento_id: index + 1, nome, item: nome, categoria, descricao, prazo_cotacao: '2027-02-10', quantidade_propostas: 0, situacao: 'aberta' })
    vagaId += 1
}))

const custos = [
    { id: 1, evento_id: 1, descricao: 'Locação do espaço', tipo: 'operacional', valor: 6500 }, { id: 2, evento_id: 1, descricao: 'Licenças e taxas', tipo: 'fiscal', valor: 1200 },
    { id: 3, evento_id: 2, descricao: 'Material de divulgação', tipo: 'variavel', valor: 750 }, { id: 4, evento_id: 2, descricao: 'Locação de mobiliário', tipo: 'operacional', valor: 1800 },
    { id: 5, evento_id: 3, descricao: 'Locação do espaço', tipo: 'operacional', valor: 12000 }, { id: 6, evento_id: 4, descricao: 'Locação do auditório', tipo: 'operacional', valor: 7000 },
    { id: 7, evento_id: 5, descricao: 'Licenças e taxas', tipo: 'fiscal', valor: 1800 }, { id: 8, evento_id: 6, descricao: 'Locação do cinema', tipo: 'operacional', valor: 4200 },
    { id: 9, evento_id: 7, descricao: 'Licenças e limpeza', tipo: 'fiscal', valor: 600 }, { id: 10, evento_id: 8, descricao: 'Locação do clube', tipo: 'operacional', valor: 2500 },
    { id: 11, evento_id: 9, descricao: 'Material de divulgação', tipo: 'variavel', valor: 950 }, { id: 12, evento_id: 10, descricao: 'Locação da arena', tipo: 'operacional', valor: 8500 },
]

const propostas = [
    { id: 1, vaga_servico_id: 1, fornecedor_id: 5, valor: 8500, descricao: 'Pacote de iluminação e operação técnica.', observacoes: 'Inclui montagem e desmontagem.', validade: '2026-11-10', status: 'enviada' },
    { id: 2, vaga_servico_id: 2, fornecedor_id: 6, valor: 3200, descricao: 'Buffet para até 40 integrantes da equipe.', observacoes: 'Cardápio a definir com a organização.', validade: '2026-11-12', status: 'aceita' },
    { id: 3, vaga_servico_id: 3, fornecedor_id: 7, valor: 4100, descricao: 'Equipe de segurança com supervisão e controle de acesso.', observacoes: 'Ajustável à estimativa de público.', validade: '2026-11-14', status: 'em_negociacao' },
    { id: 4, vaga_servico_id: 4, fornecedor_id: 8, valor: 2800, descricao: 'Locação de palco modular com cobertura.', observacoes: 'Sujeita à confirmação de disponibilidade.', validade: '2026-11-20', status: 'enviada' },
    { id: 5, vaga_servico_id: 5, fornecedor_id: 6, valor: 1450, descricao: 'Coffee break simples para expositores e equipe.', observacoes: '', validade: '2026-11-25', status: 'recusada' },
    { id: 6, vaga_servico_id: 7, fornecedor_id: 5, valor: 2300, descricao: 'Pacote de iluminação para o evento.', observacoes: 'Inclui técnico durante o evento.', validade: '2027-02-10', status: 'aceita' },
    { id: 7, vaga_servico_id: 8, fornecedor_id: 6, valor: 5900, descricao: 'Serviço de alimentação para o público.', observacoes: '', validade: '2027-02-12', status: 'enviada' },
]

const copiar = (valor) => structuredClone(valor)
function montarEvento(eventoId) {
    const evento = eventos.find((item) => item.id === Number(eventoId))
    if (!evento) return null
    const servicos = vagas.filter((item) => item.evento_id === evento.id)
    const propostasDoEvento = propostas.filter((p) => servicos.some((vaga) => vaga.id === p.vaga_servico_id))
    const custosDoEvento = custos.filter((c) => c.evento_id === evento.id)
    const selecionadas = propostasDoEvento.filter((p) => p.status === 'aceita')
    return {
        ...evento,
        nome_organizador: organizadores.find((o) => o.id === evento.organizador_id)?.nome,
        total_outros_custos: custosDoEvento.reduce((soma, custo) => soma + Number(custo.valor), 0),
        total_propostas_aceitas: selecionadas.reduce((soma, proposta) => soma + Number(proposta.valor), 0),
        total_propostas_selecionadas: propostasDoEvento.filter((p) => p.status === 'em_negociacao').length,
        quantidade_servicos: servicos.length,
        quantidade_propostas: propostasDoEvento.length,
        custo_total_calculado: custosDoEvento.reduce((soma, custo) => soma + Number(custo.valor), 0) + selecionadas.reduce((soma, proposta) => soma + Number(proposta.valor), 0),
        fornecedoresSelecionados: selecionadas.map((p) => ({ proposta_id: p.id, fornecedor_id: p.fornecedor_id, fornecedor: fornecedores.find((f) => f.id === p.fornecedor_id)?.nome || '', servico: vagas.find((v) => v.id === p.vaga_servico_id)?.nome, categoria: vagas.find((v) => v.id === p.vaga_servico_id)?.categoria, valor: p.valor })),
    }
}

function propostaComDetalhes(proposta) {
    const vaga = vagas.find((item) => item.id === proposta.vaga_servico_id)
    const evento = eventos.find((item) => item.id === vaga?.evento_id)
    return { ...proposta, nome_servico: vaga?.nome, categoria: vaga?.categoria, prazo_cotacao: vaga?.prazo_cotacao, nome_fornecedor: fornecedores.find((f) => f.id === proposta.fornecedor_id)?.nome, nome_evento: evento?.nome, status_evento: evento?.status, vaga_preenchida: propostas.some((p) => p.vaga_servico_id === vaga?.id && p.status === 'aceita' && p.id !== proposta.id) }
}

export function mockApi(path, options = {}) {
    const method = (options.method || 'GET').toUpperCase()
    const body = options.body ? JSON.parse(options.body) : {}
    let match

    if ((match = path.match(/^\/organizadores\/(\d+)\/eventos$/))) {
        if (method === 'GET') {
            const organizador = organizadores.find((item) => item.id === Number(match[1]))
            return Promise.resolve(copiar({ organizador, eventos: eventos.filter((item) => item.organizador_id === Number(match[1])).map((evento) => ({ ...montarEvento(evento.id), nome_organizador: organizador?.nome })) }))
        }
        if (method === 'POST') {
            const id = Math.max(...eventos.map((item) => item.id)) + 1
            eventos.push({ ...body, id, organizador_id: Number(match[1]), status: 'rascunho' })
            return Promise.resolve({ id })
        }
    }

    if ((match = path.match(/^\/organizadores\/(\d+)\/eventos\/(\d+)(?:\/(.*))?$/))) {
        const [, organizadorId, eventoId, recurso] = match
        const evento = eventos.find((item) => item.id === Number(eventoId) && item.organizador_id === Number(organizadorId))
        if (!evento) return Promise.reject(new Error('Evento não encontrado.'))
        if (!recurso && method === 'GET') return Promise.resolve(copiar(montarEvento(eventoId)))
        if (!recurso && method === 'PUT') { Object.assign(evento, body); return Promise.resolve({ id: evento.id }) }
        if (recurso === 'vagas' && method === 'GET') return Promise.resolve({ vagas: copiar(vagas.filter((item) => item.evento_id === Number(eventoId)).map((item) => ({ ...item, quantidade_propostas: propostas.filter((p) => p.vaga_servico_id === item.id).length, situacao: propostas.some((p) => p.vaga_servico_id === item.id && p.status === 'aceita') ? 'aceita' : propostas.some((p) => p.vaga_servico_id === item.id && p.status === 'em_negociacao') ? 'em_negociacao' : 'aberta' }))) })
        if (recurso === 'vagas' && method === 'POST') {
            const id = Math.max(...vagas.map((item) => item.id)) + 1
            vagas.push({ ...body, id, evento_id: Number(eventoId), item: body.nome, quantidade_propostas: 0, situacao: 'aberta' })
            return Promise.resolve({ id })
        }
        if (recurso === 'custos' && method === 'GET') return Promise.resolve({ custos: copiar(custos.filter((item) => item.evento_id === Number(eventoId))) })
        if (recurso === 'custos' && method === 'POST') {
            const id = Math.max(...custos.map((item) => item.id)) + 1
            custos.push({ ...body, id, evento_id: Number(eventoId) })
            return Promise.resolve({ id })
        }
        if ((match = recurso.match(/^custos\/(\d+)$/)) && method === 'DELETE') {
            const index = custos.findIndex((item) => item.id === Number(match[1]) && item.evento_id === Number(eventoId))
            if (index >= 0) custos.splice(index, 1)
            return Promise.resolve(null)
        }
        if (recurso === 'propostas' && method === 'GET') {
            const ids = vagas.filter((item) => item.evento_id === Number(eventoId)).map((item) => item.id)
            return Promise.resolve({ propostas: copiar(propostas.filter((p) => ids.includes(p.vaga_servico_id)).map(propostaComDetalhes).sort((a, b) => a.valor - b.valor)) })
        }
        if (recurso === 'orcamento' && method === 'GET') return Promise.resolve(copiar({ evento: montarEvento(eventoId), custos: custos.filter((item) => item.evento_id === Number(eventoId)), propostas: propostas.filter((p) => p.status === 'aceita' && vagas.find((v) => v.id === p.vaga_servico_id)?.evento_id === Number(eventoId)).map((p) => ({ ...p, nome_servico: vagas.find((v) => v.id === p.vaga_servico_id)?.nome, nome_fornecedor: fornecedores.find((f) => f.id === p.fornecedor_id)?.nome })) }))
        if (recurso === 'orcamento' && method === 'PUT') { Object.assign(evento, body); return Promise.resolve({ id: evento.id }) }
    }

    if ((match = path.match(/^\/organizadores\/(\d+)\/propostas\/(\d+)\/(selecionar|recusar|salvar)$/)) && method === 'PATCH') {
        const proposal = propostas.find((item) => item.id === Number(match[2]))
        if (!proposal) return Promise.reject(new Error('Proposta não encontrada.'))
        if (match[3] === 'selecionar') proposal.status = 'em_negociacao'
        if (match[3] === 'recusar') proposal.status = 'recusada'
        if (match[3] === 'salvar') {
            proposal.status = 'aceita'
            propostas.forEach((item) => { if (item.vaga_servico_id === proposal.vaga_servico_id && item.id !== proposal.id && ['enviada', 'em_negociacao'].includes(item.status)) item.status = 'recusada' })
        }
        return Promise.resolve({ id: proposal.id, acao: match[3] })
    }

    if (/^\/organizadores\/\d+\/fornecedores$/.test(path) && method === 'GET') return Promise.resolve({ fornecedores: copiar(fornecedores.filter((item) => item.status_cadastro === 'aprovado')) })
    if (path === '/fornecedores/oportunidades' && method === 'GET') {
        const oportunidades = vagas.flatMap((vaga) => {
            const evento = eventos.find((item) => item.id === vaga.evento_id)
            if (!evento || !['em_cotacao', 'publicado'].includes(evento.status)) return []
            const [data, hora = ''] = evento.inicio.replace('T', ' ').split(' ')
            const [ano, mes, dia] = data.split('-')
            const prazo = vaga.prazo_cotacao || ''
            const [prazoAno, prazoMes, prazoDia] = prazo.split('-')
            return [{
                id: vaga.id,
                vagaId: vaga.id,
                eventoId: evento.id,
                nomeServico: vaga.nome,
                evento: evento.nome,
                data: `${dia}/${mes}/${ano}${hora ? `, ${hora.slice(0, 5)}` : ''}`,
                local: [evento.nome_local, evento.cidade, evento.estado].filter(Boolean).join(', '),
                cotacaoAte: prazoAno ? `${prazoDia}/${prazoMes}/${prazoAno}` : '—',
                descricao: vaga.descricao,
                categoria: vaga.categoria,
                statusEvento: evento.status,
            }]
        })
        return Promise.resolve(copiar(oportunidades))
    }

    if ((match = path.match(/^\/fornecedores\/eventos\/(\d+)$/)) && method === 'GET') {
        const evento = eventos.find((item) => item.id === Number(match[1]))
        if (!evento || !['em_cotacao', 'publicado'].includes(evento.status)) return Promise.reject(new Error('Evento indisponível.'))
        const organizador = organizadores.find((item) => item.id === evento.organizador_id)
        return Promise.resolve(copiar({ ...evento, evento: evento.nome, descricaoEvento: evento.descricao, data: evento.inicio.slice(0, 10).split('-').reverse().join('/'), hora: evento.inicio.slice(11, 16), endereco: [evento.nome_local, evento.cidade, evento.estado].filter(Boolean).join(' — '), publicoMinimo: `${evento.publico_min} pessoas`, publicoMaximo: `${evento.publico_max} pessoas`, organizador: organizador?.nome || 'Organizador', cotacaoAte: vagas.find((vaga) => vaga.evento_id === evento.id)?.prazo_cotacao?.split('-').reverse().join('/') || '—' }))
    }

    if ((match = path.match(/^\/fornecedores\/vagas\/(\d+)$/)) && method === 'GET') {
        const vaga = vagas.find((item) => item.id === Number(match[1]))
        const evento = eventos.find((item) => item.id === vaga?.evento_id)
        if (!vaga || !evento || !['em_cotacao', 'publicado'].includes(evento.status)) return Promise.reject(new Error('Vaga de serviço indisponível.'))
        return Promise.resolve(copiar({ ...vaga, vaga_servico_id: vaga.id, nome_servico: vaga.nome, descricao_servico: vaga.descricao, evento_id: evento.id, nome_evento: evento.nome, inicio: evento.inicio, fim: evento.fim, nome_local: evento.nome_local, status_evento: evento.status, nome_organizador: organizadores.find((item) => item.id === evento.organizador_id)?.nome }))
    }
    if (path === '/fornecedores/propostas' && method === 'POST') {
        const id = Math.max(...propostas.map((item) => item.id)) + 1
        propostas.push({ ...body, id, status: 'enviada' })
        return Promise.resolve({ id })
    }
    if ((match = path.match(/^\/fornecedores\/(\d+)$/)) && method === 'GET') {
        const fornecedor = fornecedores.find((item) => item.id === Number(match[1]))
        if (!fornecedor) return Promise.reject(new Error('Fornecedor não encontrado.'))
        const propostasFornecedor = propostas.filter((item) => item.fornecedor_id === fornecedor.id).map((item) => {
            const vaga = vagas.find((v) => v.id === item.vaga_servico_id)
            return { ...item, nome_vaga: vaga?.nome, categoria: vaga?.categoria, evento_id: eventos.find((e) => e.id === vaga?.evento_id)?.id, nome_evento: eventos.find((e) => e.id === vaga?.evento_id)?.nome }
        })
        return Promise.resolve(copiar({ ...fornecedor, tipo_usuario: 'fornecedor', criado_em: '2026-10-04 11:00:00', propostas: propostasFornecedor }))
    }

    return Promise.reject(new Error(`Mock sem resposta para ${method} ${path}`))
}
