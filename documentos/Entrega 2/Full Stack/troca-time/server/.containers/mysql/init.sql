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
    categoria        VARCHAR(20),
    descricao        TEXT,
    status_cadastro  VARCHAR(20) NOT NULL DEFAULT 'pendente',
    avaliado_por     INT,
    avaliado_em      DATETIME,
    criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_avaliador FOREIGN KEY (avaliado_por) REFERENCES usuario(id),

    CONSTRAINT ck_usuario_documento CHECK (
        (tipo_usuario = 'fornecedor'  AND cnpj IS NOT NULL AND cpf IS NULL)
     OR (tipo_usuario = 'organizador' AND (cpf IS NOT NULL OR cnpj IS NOT NULL))
     OR (tipo_usuario = 'adm')
    ),
    CONSTRAINT ck_usuario_categoria CHECK (
        (tipo_usuario = 'fornecedor' AND categoria IS NOT NULL)
     OR (tipo_usuario <> 'fornecedor' AND categoria IS NULL)
    )
);

CREATE TABLE IF NOT EXISTS endereco (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nome_local     VARCHAR(200) NOT NULL,
    cep            CHAR(8) NOT NULL,
    rua            VARCHAR(200) NOT NULL,
    numero         VARCHAR(20),
    complemento    VARCHAR(200),
    bairro         VARCHAR(120) NOT NULL,
    cidade         VARCHAR(120) NOT NULL,
    estado         CHAR(2) NOT NULL,
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evento (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    nome                 VARCHAR(200) NOT NULL,
    descricao            TEXT,
    inicio               DATETIME NOT NULL,
    fim                  DATETIME NOT NULL,
    prazo_cotacao        DATE,
    endereco_id          INT NOT NULL,
    organizador_id       INT NOT NULL,
    publico_min          INT NOT NULL,
    publico_max          INT NOT NULL,
    margem_lucro         DECIMAL(5,2) NOT NULL,
    custo_total          DECIMAL(12,2),
    ticket_publico_min   DECIMAL(10,2),
    ticket_publico_max   DECIMAL(10,2),
    status               VARCHAR(20) NOT NULL DEFAULT 'rascunho',
    criado_em            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_evento_endereco    FOREIGN KEY (endereco_id)    REFERENCES endereco(id),
    CONSTRAINT fk_evento_organizador FOREIGN KEY (organizador_id) REFERENCES usuario(id),

    CONSTRAINT ck_evento_publico CHECK (publico_min > 0 AND publico_max > publico_min),
    CONSTRAINT ck_evento_margem  CHECK (margem_lucro >= 0 AND margem_lucro < 100),
    CONSTRAINT ck_evento_datas   CHECK (fim > inicio)
);

CREATE TABLE IF NOT EXISTS vaga_servico (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    evento_id      INT NOT NULL,
    nome           VARCHAR(200) NOT NULL,
    categoria      VARCHAR(20) NOT NULL,
    descricao      TEXT,
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_vaga_evento FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE
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
    criado_em           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_proposta_vaga       FOREIGN KEY (vaga_servico_id) REFERENCES vaga_servico(id),
    CONSTRAINT fk_proposta_fornecedor FOREIGN KEY (fornecedor_id)   REFERENCES usuario(id),

    CONSTRAINT uq_proposta_vaga_fornecedor UNIQUE (vaga_servico_id, fornecedor_id),
    CONSTRAINT ck_proposta_valor CHECK (valor > 0)
);

CREATE TABLE IF NOT EXISTS mensagem (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    proposta_id   INT NOT NULL,
    remetente_id  INT,
    tipo          VARCHAR(20) NOT NULL DEFAULT 'texto',
    conteudo      TEXT NOT NULL,
    criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mensagem_proposta  FOREIGN KEY (proposta_id)  REFERENCES proposta(id) ON DELETE CASCADE,
    CONSTRAINT fk_mensagem_remetente FOREIGN KEY (remetente_id) REFERENCES usuario(id),
    CONSTRAINT ck_mensagem_remetente CHECK (
        (tipo = 'texto' AND remetente_id IS NOT NULL) OR (tipo = 'sistema' AND remetente_id IS NULL)
    )
);

CREATE TABLE IF NOT EXISTS custo_evento (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    evento_id      INT NOT NULL,
    descricao      VARCHAR(200) NOT NULL,
    tipo           VARCHAR(20) NOT NULL,
    valor          DECIMAL(12,2) NOT NULL,
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_custo_evento FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE,
    CONSTRAINT ck_custo_valor CHECK (valor > 0)
);



INSERT INTO usuario (id, nome, email, telefone, cpf, cnpj, senha_hash, tipo_usuario, categoria, descricao, status_cadastro, avaliado_por, avaliado_em) VALUES
(1, 'Admin Plataforma',      'admin@eventos.com',          '11900000001', NULL,          NULL,             '$2b$12$abcdefghijklmnopqrstuuAdminHashExemplo000000000000000', 'adm',         NULL,          'Administrador do sistema',                 'aprovado', NULL, NULL),
(2, 'Mariana Souza',         'mariana.souza@email.com',    '11911112222', '12345678901', NULL,             '$2b$12$abcdefghijklmnopqrstuuOrgHashExemplo1000000000000000', 'organizador', NULL,          'Organizadora de festivais e shows',        'aprovado', 1, '2026-08-01 10:00:00'),
(3, 'Prime Eventos Ltda',    'contato@primeeventos.com',   '11933334444', NULL,          '11222333000144', '$2b$12$abcdefghijklmnopqrstuuOrgHashExemplo2000000000000000', 'organizador', NULL,          'Produtora de eventos corporativos',        'aprovado', 1, '2026-08-02 14:30:00'),
(4, 'LuzTotal Iluminação',   'comercial@luztotal.com',     '11955556666', NULL,          '22333444000155', '$2b$12$abcdefghijklmnopqrstuuFornHashExemplo100000000000000', 'fornecedor',  'Iluminação',  'Iluminação cênica e de palco',             'aprovado', 1, '2026-08-05 09:00:00'),
(5, 'Sabor & Cia Buffet',    'orcamento@saborecia.com',    '11977778888', NULL,          '33444555000166', '$2b$12$abcdefghijklmnopqrstuuFornHashExemplo200000000000000', 'fornecedor',  'Alimentação', 'Buffet completo para grandes eventos',     'aprovado', 1, '2026-08-05 09:15:00'),
(6, 'Guardião Segurança',    'contato@guardiaoseg.com',    '11988889999', NULL,          '44555666000177', '$2b$12$abcdefghijklmnopqrstuuFornHashExemplo300000000000000', 'fornecedor',  'Segurança',   'Seguranças e controle de acesso',          'aprovado', 1, '2026-08-06 11:00:00'),
(7, 'MegaPalco Estruturas',  'vendas@megapalco.com',       '11999990000', NULL,          '55666777000188', '$2b$12$abcdefghijklmnopqrstuuFornHashExemplo400000000000000', 'fornecedor',  'Estrutura',   'Palcos, tendas, grades e camarotes',       'aprovado', 1, '2026-08-06 11:20:00');


INSERT INTO evento (id, nome, descricao, inicio, fim, prazo_cotacao, endereco_id, organizador_id, publico_min, publico_max, margem_lucro, custo_total, ticket_publico_min, ticket_publico_max, status) VALUES
(1, 'Festival de Verão Sunset', 'Festival de música ao ar livre',       '2026-12-12 16:00:00', '2026-12-13 02:00:00', '2026-11-20', 1, 2, 300,  500,  20.00, 50000.00, 200.00, 120.00, 'confirmado'),
(2, 'Convenção Anual Prime',    'Convenção corporativa com coquetel',  '2027-01-22 08:00:00', '2027-01-22 20:00:00', '2026-12-15', 2, 3, 200,  400,  15.00, NULL,     NULL,   NULL,   'publicado'),
(3, 'Noite do Rock Arena',      'Show de bandas nacionais',            '2027-02-06 19:00:00', '2027-02-07 03:00:00', '2027-01-10', 3, 2, 800,  1500, 25.00, NULL,     NULL,   NULL,   'publicado'),
(4, 'Feira Gastronômica Sabores','Feira com food trucks e expositores', '2027-03-13 10:00:00', '2027-03-14 22:00:00', '2027-02-10', 4, 3, 1000, 3000, 18.00, NULL,     NULL,   NULL,   'publicado');


INSERT INTO vaga_servico (id, evento_id, nome, categoria, descricao) VALUES
(1, 1, 'Iluminação de palco principal', 'Iluminação',  'Moving heads, LED wash e operador de luz'),
(2, 1, 'Montagem de palco e tendas',    'Estrutura',   'Palco 12x8m, 4 tendas 10x10 e grades'),
(3, 2, 'Buffet de almoço e coffee break','Alimentação', 'Almoço e 2 coffee breaks para 400 pessoas'),
(4, 2, 'Open bar coquetel',             'Bebidas',     'Drinks, refrigerantes e água no encerramento'),
(5, 3, 'Equipe de segurança',           'Segurança',   '30 seguranças e controle de acesso'),
(6, 3, 'Iluminação de show',            'Iluminação',  'Rider de luz completo para 3 bandas'),
(7, 4, 'Praça de alimentação',          'Alimentação', 'Gestão de 15 food trucks e área de mesas'),
(8, 4, 'Estrutura de estandes',         'Estrutura',   '40 estandes 3x3m com piso elevado');


INSERT INTO proposta (vaga_servico_id, fornecedor_id, origem, valor, descricao, observacoes, validade, status, conversa_criada_em) VALUES
(1, 4, 'convite',    18000.00, 'Kit completo com 24 moving heads e operador',        'Inclui montagem',             '2026-11-30', 'aprovada', '2026-11-02 10:00:00'),
(1, 5, 'fornecedor', 21500.00, 'Iluminação terceirizada com parceiro',               NULL,                          '2026-11-30', 'recusada', NULL),
(1, 7, 'fornecedor', 19800.00, 'Iluminação integrada à estrutura do palco',          'Pacote com palco tem desconto','2026-11-30', 'recusada', '2026-11-03 15:20:00'),
(2, 7, 'convite',    32000.00, 'Palco 12x8m, 4 tendas e 200m de grades',             'Montagem 1 dia antes',        '2026-11-30', 'aprovada', '2026-11-04 09:30:00'),
(2, 4, 'fornecedor', 35000.00, 'Estrutura de palco com treliças para luz',           NULL,                          '2026-11-30', 'recusada', NULL),
(2, 6, 'fornecedor', 38500.00, 'Estrutura completa com grades de contenção',         NULL,                          '2026-11-30', 'recusada', NULL),
(3, 5, 'convite',    45000.00, 'Almoço executivo e 2 coffee breaks',                 'Opções veganas inclusas',     '2026-12-20', 'aprovada', '2026-11-10 14:00:00'),
(3, 6, 'fornecedor', 48000.00, 'Buffet terceirizado com equipe de apoio',            NULL,                          '2026-12-20', 'recusada', NULL),
(3, 4, 'fornecedor', 52000.00, 'Buffet com decoração e iluminação de ambiente',      NULL,                          '2026-12-20', 'recusada', NULL),
(4, 6, 'fornecedor', 22000.00, 'Open bar 4h com bartenders',                         NULL,                          '2026-12-20', 'enviada',  NULL),
(4, 5, 'convite',    19500.00, 'Open bar com drinks autorais e soft drinks',         'Copos personalizados',        '2026-12-20', 'enviada',  '2026-11-12 11:00:00'),
(4, 7, 'fornecedor', 24000.00, 'Bar montado em estrutura própria',                   NULL,                          '2026-12-20', 'enviada',  NULL),
(5, 6, 'convite',    27000.00, '30 seguranças, 4 supervisores e detectores',         'Equipe com curso de vigilante','2027-01-15', 'enviada',  '2026-11-20 16:45:00'),
(5, 7, 'fornecedor', 31000.00, 'Segurança com grades de contenção inclusas',         NULL,                          '2027-01-15', 'recusada', NULL),
(5, 4, 'fornecedor', 29500.00, 'Segurança via empresa parceira',                     NULL,                          '2027-01-15', 'enviada',  NULL),
(6, 4, 'convite',    26000.00, 'Rider completo para 3 bandas com operador',          NULL,                          '2027-01-15', 'enviada',  '2026-11-21 10:10:00'),
(6, 5, 'fornecedor', 30000.00, 'Iluminação com equipamento locado',                  NULL,                          '2027-01-15', 'enviada',  NULL),
(6, 6, 'fornecedor', 28500.00, 'Iluminação básica de palco e plateia',               NULL,                          '2027-01-15', 'enviada',  NULL),
(7, 5, 'convite',    60000.00, 'Gestão de 15 food trucks e área de mesas',           'Taxa fixa + 10% das vendas',  '2027-02-28', 'aprovada', '2026-12-01 09:00:00'),
(7, 6, 'fornecedor', 64000.00, 'Praça de alimentação com 12 food trucks',            NULL,                          '2027-02-28', 'recusada', NULL),
(7, 7, 'fornecedor', 66000.00, 'Praça com tendas e mobiliário próprio',              NULL,                          '2027-02-28', 'recusada', '2026-12-02 13:30:00'),
(8, 7, 'convite',    85000.00, '40 estandes 3x3m com piso elevado e iluminação',     'Montagem em 2 dias',          '2027-02-28', 'enviada',  '2026-12-03 10:00:00'),
(8, 4, 'fornecedor', 89000.00, 'Estandes com iluminação cênica integrada',           NULL,                          '2027-02-28', 'enviada',  NULL),
(8, 5, 'fornecedor', 92000.00, 'Estandes via parceiro de montagem',                  NULL,                          '2027-02-28', 'recusada', NULL);