-- Migração do diferencial: proposta direta e chat.
-- O init.sql só roda quando o banco é criado do zero. Rode este arquivo
-- uma vez em bancos que já existem (local ou na nuvem).

ALTER TABLE proposta
    ADD COLUMN origem VARCHAR(20) NOT NULL DEFAULT 'fornecedor' AFTER status;

ALTER TABLE proposta
    ADD CONSTRAINT ck_proposta_status CHECK (
        status IN ('pendente', 'selecionada', 'aceita', 'recusada', 'cancelada')
    ),
    ADD CONSTRAINT ck_proposta_origem CHECK (
        origem IN ('fornecedor', 'organizador')
    );
