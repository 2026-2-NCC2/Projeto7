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
    organizador_id       INT NOT NULL,
    publico_min          INT NOT NULL,
    publico_max          INT NOT NULL,
    margem_lucro         DECIMAL(5,2) NOT NULL,
    custo_total          DECIMAL(12,2),
    ticket_publico_min   DECIMAL(10,2),
    ticket_publico_max   DECIMAL(10,2),
    status               VARCHAR(20) NOT NULL DEFAULT 'rascunho',
    nome_local     VARCHAR(200),
    cep            CHAR(8),
    rua            VARCHAR(200),
    numero         VARCHAR(20),
    complemento    VARCHAR(200),
    bairro         VARCHAR(120),
    cidade         VARCHAR(120),
    estado         VARCHAR(20),
    criado_em            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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