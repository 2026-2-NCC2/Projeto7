CREATE DATABASE IF NOT EXISTS troca_time;
USE troca_time;

CREATE TABLE IF NOT EXISTS usuario (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(200) NOT NULL,
    email            VARCHAR(320) NOT NULL UNIQUE,
    telefone         VARCHAR(20),
    cpf              CHAR(11) UNIQUE,
    cnpj             CHAR(14) UNIQUE,
    senha_hash       VARCHAR(255) NOT NULL,
    tipo_usuario     VARCHAR(20) NOT NULL,
    categoria        VARCHAR(100),
    descricao        TEXT,
    status_cadastro  VARCHAR(20) NOT NULL DEFAULT 'pendente',
    avaliado_por     INT,
    avaliado_em      DATETIME,
    criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_avaliador
        FOREIGN KEY (avaliado_por) REFERENCES usuario(id),

    CONSTRAINT ck_usuario_documento CHECK (
        (tipo_usuario = 'fornecedor' AND cnpj IS NOT NULL AND cpf IS NULL)
        OR (tipo_usuario = 'organizador' AND (cpf IS NOT NULL OR cnpj IS NOT NULL))
        OR (tipo_usuario = 'adm')
    ),

    CONSTRAINT ck_usuario_categoria CHECK (
        (tipo_usuario = 'fornecedor' AND categoria IS NOT NULL)
        OR (tipo_usuario <> 'fornecedor' AND categoria IS NULL)
    )
);

CREATE TABLE IF NOT EXISTS evento (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    nome                 VARCHAR(200) NOT NULL,
    descricao            TEXT,
    inicio               DATETIME NOT NULL,
    fim                  DATETIME NOT NULL,
    organizador_id       INT NOT NULL,
    publico_min          INT NOT NULL,
    publico_max          INT NOT NULL,
    margem_lucro         DECIMAL(5,2) NOT NULL,
    custo_total          DECIMAL(12,2),
    ticket_publico_min   DECIMAL(10,2),
    ticket_publico_max   DECIMAL(10,2),
    status               VARCHAR(20) NOT NULL DEFAULT 'rascunho',
    nome_local           VARCHAR(200),
    cep                  CHAR(8),
    rua                  VARCHAR(200),
    numero               VARCHAR(20),
    complemento          VARCHAR(200),
    bairro               VARCHAR(120),
    cidade               VARCHAR(120),
    estado               VARCHAR(20),
    criado_em            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_evento_organizador
        FOREIGN KEY (organizador_id) REFERENCES usuario(id),

    CONSTRAINT ck_evento_publico
        CHECK (publico_min > 0 AND publico_max > publico_min),

    CONSTRAINT ck_evento_margem
        CHECK (margem_lucro >= 0 AND margem_lucro < 100),

    CONSTRAINT ck_evento_datas
        CHECK (fim > inicio)
);

CREATE TABLE IF NOT EXISTS vaga_servico (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    evento_id      INT NOT NULL,
    nome           VARCHAR(200) NOT NULL,
    categoria      VARCHAR(20) NOT NULL,
    descricao      TEXT,
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_vaga_evento
        FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proposta (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    vaga_servico_id     INT NOT NULL,
    fornecedor_id       INT NOT NULL,
    origem              VARCHAR(20) NOT NULL,
    valor               DECIMAL(12,2) NOT NULL,
    descricao           TEXT NOT NULL,
    observacoes         TEXT,
    validade            DATE NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'enviada',
    conversa_criada_em  DATETIME,
    criado_em            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_proposta_vaga
        FOREIGN KEY (vaga_servico_id) REFERENCES vaga_servico(id),

    CONSTRAINT fk_proposta_fornecedor
        FOREIGN KEY (fornecedor_id) REFERENCES usuario(id),

    CONSTRAINT uq_proposta_vaga_fornecedor
        UNIQUE (vaga_servico_id, fornecedor_id),

    CONSTRAINT ck_proposta_valor
        CHECK (valor > 0)
);

CREATE TABLE IF NOT EXISTS mensagem (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    proposta_id   INT NOT NULL,
    remetente_id  INT,
    tipo          VARCHAR(20) NOT NULL DEFAULT 'texto',
    conteudo      TEXT NOT NULL,
    criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mensagem_proposta
        FOREIGN KEY (proposta_id) REFERENCES proposta(id) ON DELETE CASCADE,

    CONSTRAINT fk_mensagem_remetente
        FOREIGN KEY (remetente_id) REFERENCES usuario(id),

    CONSTRAINT ck_mensagem_remetente CHECK (
        (tipo = 'texto' AND remetente_id IS NOT NULL)
        OR (tipo = 'sistema' AND remetente_id IS NULL)
    )
);

CREATE TABLE IF NOT EXISTS custo_evento (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    evento_id      INT NOT NULL,
    descricao      VARCHAR(200) NOT NULL,
    origem         VARCHAR(200) NOT NULL,
    valor          DECIMAL(12,2) NOT NULL,
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_custo_evento
        FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE,

    CONSTRAINT ck_custo_valor
        CHECK (valor > 0)
);

-- MOCKS
-- Os IDs são explícitos para facilitar testes e relacionamentos.
-- Senhas são hashes fictícios e não servem para autenticação real.

INSERT INTO usuario
(id, nome, email, telefone, cpf, cnpj, senha_hash, tipo_usuario, categoria,
 descricao, status_cadastro, avaliado_por, avaliado_em)
VALUES
(1, 'Administradora Troca Ticket', 'admin@trocaticket.test', '11990000001',
 NULL, NULL, 'mock_hash_admin', 'adm', NULL,
 'Conta administrativa para testes.', 'aprovado', NULL, NULL),

(2, 'Mariana Costa', 'mariana.organizadora@trocaticket.test', '11990000002',
 '12345678901', NULL, 'mock_hash_mariana', 'organizador', NULL,
 'Organizadora de eventos culturais e musicais.', 'aprovado', 1, '2026-10-02 10:00:00'),

(3, 'Rafael Almeida', 'rafael.organizador@trocaticket.test', '11990000003',
 NULL, '12345678000199', 'mock_hash_rafael', 'organizador', NULL,
 'Produção de festivais e eventos corporativos.', 'pendente', NULL, NULL),

(4, 'Camila Santos', 'camila.organizadora@trocaticket.test', '11990000004',
 '98765432100', NULL, 'mock_hash_camila', 'organizador', NULL,
 'Organização de feiras e eventos gastronômicos.', 'reprovado', 1, '2026-10-03 14:30:00'),

(5, 'Som & Luz Produções', 'contato@someluz.test', '11990000005',
 NULL, '23456789000188', 'mock_hash_someluz', 'fornecedor', 'audiovisual',
 'Equipamentos de áudio, iluminação e equipe técnica.', 'aprovado', 1, '2026-10-04 11:00:00'),

(6, 'Buffet Sabor da Festa', 'contato@saborfesta.test', '11990000006',
 NULL, '34567890000177', 'mock_hash_buffet', 'fornecedor', 'alimentacao',
 'Serviço de buffet para eventos de pequeno e médio porte.', 'aprovado', 1, '2026-10-04 11:30:00'),

(7, 'Segurança Alfa', 'contato@segurancaalfa.test', '11990000007',
 NULL, '45678901000166', 'mock_hash_seguranca', 'fornecedor', 'seguranca',
 'Equipe de segurança e controle de acesso.', 'aprovado', 1, '2026-10-05 12:00:00'),

(8, 'Palco Móvel Eventos', 'contato@palcomovel.test', '11990000008',
 NULL, '56789012000155', 'mock_hash_palco', 'fornecedor', 'estrutura',
 'Montagem de palco, estruturas e cobertura.', 'pendente', NULL, NULL);

INSERT INTO evento
(id, nome, descricao, inicio, fim, organizador_id, publico_min, publico_max,
 margem_lucro, custo_total, ticket_publico_min, ticket_publico_max, status,
 nome_local, cep, rua, numero, complemento, bairro, cidade, estado)
VALUES
(1, 'Festival Som de Primavera',
 'Festival de música independente com bandas locais e praça de alimentação.',
 '2026-11-21 14:00:00', '2026-11-21 23:00:00', 2, 500, 1500,
 20.00, 28000.00, 45.00, 80.00, 'publicado',
 'Parque das Artes', '06010000', 'Avenida das Flores', '100', NULL,
 'Centro', 'Osasco', 'SP'),

(2, 'Feira Criativa Urbana',
 'Feira de pequenos empreendedores, artesanato, gastronomia e música.',
 '2026-12-05 10:00:00', '2026-12-05 19:00:00', 2, 200, 600,
 15.00, 9500.00, 15.00, 35.00, 'rascunho',
 'Espaço Cultural Central', '06020000', 'Rua das Oficinas', '250', 'Galpão B',
 'Vila Campesina', 'Osasco', 'SP'),

(3, 'Conferência Inova Negócios',
 'Encontro de empreendedorismo, tecnologia e inovação.',
 '2026-09-10 08:30:00', '2026-09-10 18:00:00', 3, 300, 800,
 18.00, 18000.00, 70.00, 120.00, 'encerrado',
 'Centro de Convenções Oeste', '05001000', 'Rua do Progresso', '500', NULL,
 'Lapa', 'São Paulo', 'SP'),

(4, 'Festival Sabores do Bairro',
 'Evento gastronômico com produtores e restaurantes da região.',
 '2026-12-12 11:00:00', '2026-12-12 20:00:00', 4, 150, 500,
 12.50, NULL, 20.00, 50.00, 'rascunho',
 'Praça da Comunidade', '06100000', 'Rua da Comunidade', '45', NULL,
 'Jardim das Flores', 'Osasco', 'SP');

INSERT INTO vaga_servico (id, evento_id, nome, categoria, descricao)
VALUES
(1, 1, 'Sonorização e iluminação', 'audiovisual',
 'Fornecimento e operação de som e iluminação durante o festival.'),
(2, 1, 'Buffet para equipe', 'alimentacao',
 'Refeições para equipe técnica e produção.'),
(3, 1, 'Segurança do evento', 'seguranca',
 'Controle de acesso e segurança durante todo o evento.'),
(4, 2, 'Estrutura de palco', 'estrutura',
 'Palco modular com cobertura e montagem.'),
(5, 2, 'Coffee break', 'alimentacao',
 'Coffee break para expositores e equipe.'),
(6, 3, 'Áudio e projeção', 'audiovisual',
 'Microfones, caixas de som e projeção para palestras.'),
(7, 4, 'Equipe de segurança', 'seguranca',
 'Controle de acesso e apoio à organização.');

INSERT INTO proposta
(id, vaga_servico_id, fornecedor_id, origem, valor, descricao, observacoes,
 validade, status, conversa_criada_em)
VALUES
(1, 1, 5, 'fornecedor', 8500.00,
 'Pacote de sonorização e iluminação com operação técnica.',
 'Inclui montagem, passagem de som e desmontagem.',
 '2026-11-10', 'enviada', NULL),

(2, 2, 6, 'fornecedor', 3200.00,
 'Buffet para até 40 integrantes da equipe.',
 'Cardápio a definir com a organização.',
 '2026-11-12', 'aceita', '2026-10-20 15:30:00'),

(3, 3, 7, 'fornecedor', 4100.00,
 'Equipe de segurança com supervisão e controle de acesso.',
 'Quantidade final de profissionais depende do plano do evento.',
 '2026-11-14', 'em_negociacao', '2026-10-21 10:00:00'),

(4, 4, 8, 'fornecedor', 2800.00,
 'Locação de palco modular com cobertura.',
 'Proposta sujeita à confirmação de disponibilidade.',
 '2026-11-20', 'enviada', NULL),

(5, 5, 6, 'fornecedor', 1450.00,
 'Coffee break simples para expositores e equipe.',
 NULL, '2026-11-25', 'recusada', NULL),

(6, 6, 5, 'fornecedor', 2300.00,
 'Pacote de áudio e projeção para auditório.',
 'Inclui técnico durante as apresentações.',
 '2026-08-30', 'aceita', '2026-08-15 09:00:00'),

(7, 7, 7, 'fornecedor', 1900.00,
 'Equipe de apoio à segurança e orientação do público.',
 NULL, '2026-12-01', 'enviada', NULL);

INSERT INTO mensagem (id, proposta_id, remetente_id, tipo, conteudo, criado_em)
VALUES
(1, 1, 5, 'texto',
 'Olá! Enviamos a proposta de som e iluminação para avaliação.',
 '2026-10-18 09:15:00'),

(2, 1, 2, 'texto',
 'Obrigado. Vocês conseguem incluir um operador extra?',
 '2026-10-18 10:00:00'),

(3, 1, NULL, 'sistema',
 'A conversa da proposta foi iniciada.',
 '2026-10-18 10:01:00'),

(4, 2, 2, 'texto',
 'A proposta foi aceita. Vamos alinhar o cardápio na próxima semana.',
 '2026-10-20 15:30:00'),

(5, 3, 7, 'texto',
 'Podemos ajustar a quantidade de profissionais conforme a estimativa de público.',
 '2026-10-21 10:00:00');

INSERT INTO custo_evento (id, evento_id, descricao, origem, valor)
VALUES
(1, 1, 'Locação do espaço', 'Parque das Artes', 6500.00),
(2, 1, 'Licenças e taxas', 'Órgãos públicos', 1200.00),
(3, 1, 'Divulgação', 'Agência de comunicação', 2800.00),
(4, 2, 'Material de divulgação', 'Gráfica local', 750.00),
(5, 2, 'Locação de mobiliário', 'Móveis Eventos', 1800.00),
(6, 3, 'Locação do auditório', 'Centro de Convenções Oeste', 7000.00),
(7, 3, 'Coffee break', 'Buffet parceiro', 2400.00),
(8, 4, 'Licenças e limpeza', 'Serviços municipais', 600.00);
