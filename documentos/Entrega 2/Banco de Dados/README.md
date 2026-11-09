# Banco de Dados — Troca Ticket

Banco relacional **MySQL**
Link: documentos/Entrega 2/Full Stack/troca-time/server/.containers/mysql/init.sql

## Visão geral

| Tabela | Representa |
|---|---|
| `usuario` | Administradores, organizadores e fornecedores |
| `evento` | Eventos criados pelos organizadores |
| `vaga_servico` | Serviços que o organizador precisa cotar para um evento |
| `proposta` | Orçamento enviado por um fornecedor para uma vaga de serviço |
| `custo_manual` | Custos do evento cadastrados pelo próprio organizador |

## Relacionamentos

- Um **usuário** organizador cria vários **eventos** (1:N).
- Um **evento** tem várias **vagas de serviço** e vários **custos manuais** (1:N).
- Uma **vaga de serviço** recebe várias **propostas** (1:N).
- Um **usuário** fornecedor envia várias **propostas** (1:N); cada fornecedor só pode enviar uma proposta por vaga.

```
usuario 1──N evento 1──N vaga_servico 1──N proposta N──1 usuario
                │
                └──N custo_manual
```

## Tabelas

### usuario

| Campo | Tipo | Regras | Descrição |
|---|---|---|---|
| id | INT | **PK**, auto incremento | Identificador do usuário |
| nome | VARCHAR(200) | obrigatório | Nome da usuário |
| email | VARCHAR(320) | obrigatório, único | E-mail usado para login e contato |
| telefone | VARCHAR(20) | opcional | Telefone de contato |
| cpf | CHAR(11) | único, opcional | CPF, para organizador pessoa física |
| cnpj | CHAR(14) | único, opcional | CNPJ, para fornecedor ou organizador pessoa jurídica |
| senha_hash | VARCHAR(255) | obrigatório | Senha criptografada (nunca é salva em texto puro) |
| tipo_usuario | VARCHAR(20) | obrigatório | Perfil de acesso: `adm`, `organizador` ou `fornecedor` |
| descricao | TEXT | opcional | Apresentação do usuário ou dos serviços que oferece |
| status_cadastro | VARCHAR(20) | padrão `pendente` | Situação do cadastro na análise do administrador: `pendente`, `aprovado` ou `reprovado` |
| criado_em | DATETIME | automático | Data e hora do cadastro |
| atualizado_em | DATETIME | automático | Data e hora da última alteração |

**Regra (`ck_usuario_documento`):** fornecedor precisa de CNPJ e não pode ter CPF;
organizador precisa de CPF ou CNPJ; administrador não precisa de documento.

### evento

| Campo | Tipo | Regras | Descrição |
|---|---|---|---|
| id | INT | **PK**, auto incremento | Identificador do evento |
| nome | VARCHAR(200) | obrigatório | Nome do evento |
| descricao | TEXT | opcional | Descrição do evento |
| data | DATE | obrigatório | Dia em que o evento acontece |
| horario_inicio | TIME | obrigatório | Horário de início |
| horario_fim | TIME | obrigatório | Horário de término |
| organizador_id | INT | **FK → usuario.id**, obrigatório | Organizador dono do evento |
| publico_min | INT | opcional | Menor público previsto |
| publico_max | INT | opcional | Maior público previsto |
| publico_esperado | INT | opcional | Público mais provável |
| margem_lucro | DECIMAL(5,2) | opcional | Margem de lucro desejada pelo organizador, em % |
| custo_total | DECIMAL(12,2) | opcional | Soma das propostas selecionadas/aceitas e dos custos manuais |
| ticket_publico_min | DECIMAL(10,2) | opcional | Preço do ingresso se o evento tiver o público mínimo |
| ticket_publico_max | DECIMAL(10,2) | opcional | Preço do ingresso se o evento tiver o público máximo |
| ticket_publico_esperado | DECIMAL(10,2) | opcional | Preço do ingresso se o evento tiver o público esperado |
| status | VARCHAR(20) | padrão `rascunho` | Etapa do evento: `rascunho`, `em_cotacao`, `publicado` ou `encerrado` |
| nome_local | VARCHAR(200) | opcional | Nome do local do evento |
| cep | CHAR(8) | opcional | CEP do local |
| rua | VARCHAR(200) | opcional | Rua do local |
| numero | VARCHAR(20) | opcional | Número do local |
| complemento | VARCHAR(200) | opcional | Complemento do endereço |
| bairro | VARCHAR(120) | opcional | Bairro do local |
| cidade | VARCHAR(120) | opcional | Cidade do local |
| estado | VARCHAR(20) | opcional | Estado do local |
| criado_em | DATETIME | automático | Data e hora de criação do evento |
| atualizado_em | DATETIME | automático | Data e hora da última alteração |

Os campos de público, margem, custo e ticket são preenchidos quando o organizador clica em **Salvar orçamento**.
O endereço é exigido quando o evento é disponibilizado para cotação.

**Regras:** `publico_min > 0` e `publico_max > publico_min` (`ck_evento_publico`);
margem entre 0 e 99 (`ck_evento_margem`).

### vaga_servico

| Campo | Tipo | Regras | Descrição |
|---|---|---|---|
| id | INT | **PK**, auto incremento | Identificador da vaga |
| evento_id | INT | **FK → evento.id**, obrigatório; apagada junto com o evento | Evento que precisa do serviço |
| item | VARCHAR(100) | obrigatório | Serviço procurado pelo organizador |
| categoria | VARCHAR(20) | obrigatório | Categoria do serviço |
| descricao | TEXT | opcional | Detalhes do que o organizador precisa |
| cotacao_ate | DATE | obrigatório | Prazo para os fornecedores enviarem propostas |
| status | VARCHAR(20) | padrão `pendente` | `pendente` (aberta), `preenchida` (proposta aceita) ou `vencida` (prazo encerrado) |
| criado_em | DATETIME | automático | Data e hora de criação da vaga |
| atualizado_em | DATETIME | automático | Data e hora da última alteração |

### proposta

| Campo | Tipo | Regras | Descrição |
|---|---|---|---|
| id | INT | **PK**, auto incremento | Identificador da proposta |
| vaga_servico_id | INT | **FK → vaga_servico.id**, obrigatório | Vaga que a proposta atende |
| fornecedor_id | INT | **FK → usuario.id**, obrigatório | Fornecedor que enviou a proposta |
| valor | DECIMAL(12,2) | obrigatório, maior que zero | Preço cobrado pelo serviço |
| descricao | TEXT | obrigatório | O que está incluso no serviço |
| observacoes | TEXT | opcional | Informações adicionais do fornecedor |
| validade | DATE | obrigatório | Até quando o fornecedor garante o valor |
| status | VARCHAR(20) | padrão `pendente` | `pendente` (aguardando), `selecionada` (entra no orçamento), `recusada` ou `aceita` (contratada) |
| criado_em | DATETIME | automático | Data e hora do envio |
| atualizado_em | DATETIME | automático | Data e hora da última alteração |

**Regras:** um fornecedor só envia uma proposta por vaga (`uq_proposta_vaga_fornecedor`);
`valor > 0` (`ck_proposta_valor`).

### custo_manual

| Campo | Tipo | Regras | Descrição |
|---|---|---|---|
| id | INT | **PK**, auto incremento | Identificador do custo |
| evento_id | INT | **FK → evento.id**, obrigatório; apagado junto com o evento | Evento ao qual o custo pertence |
| item | VARCHAR(100) | obrigatório | Nome do custo |
| descricao | VARCHAR(200) | obrigatório | Detalhes do custo |
| categoria | VARCHAR(200) | obrigatório | Tipo do custo: `fiscal`, `operacional` ou `variavel` |
| valor | DECIMAL(12,2) | obrigatório, maior que zero | Valor do custo, que entra no custo total do evento |
| criado_em | DATETIME | automático | Data e hora do cadastro |
| atualizado_em | DATETIME | automático | Data e hora da última alteração |
