# Entregas do PI
### **DECLARAÇÃO DE USO DE INTELIGÊNCIA ARTIFICIAL**

## Entrega 1
<br><br>

### Disciplina 1 — Full Stack

| **Aluno(s) Responsável(veis)** | Giovanna e Pedro |
| :--- | :--- |
| **Ferramenta utilizada** | **Giovanna:** Claude (Anthropic)<br>**Pedro:** Claude (Anthropic)
| **Versão/modelo** | **Giovanna:** Claude Opus 5.5; <br>**Pedro:** Claude Sonnet 5.5 |
| **Disciplina / Trabalho** | Full Stack — Projeto Troca Ticket 
| **Finalidade de uso** | **Giovanna:** ajuda para corrigir erros de CSS e HTML, entender como desenvolver telas seguindo a melhor sintaxe. <br>**Pedro:** Identificar a paleta de cores do layout e organizá-la em variáveis CSS, ajuda para entender como configurar as rotas com React Router. |
| ***Prompts* principais utilizados** | **Giovanna**<br>1. "Essa página está com o gradiente certo até o final e essa não. Por que isso está acontecendo?" (com os dois arquivos CSS anexados)<br>2. "Explique linha por linha desse código" (com css das aulas anexado anexado)<br>3. "Explique por que o return de cada um é escrito desse jeito<br>4. "Preciso dos códigos das cores (HEX) da paleta do meu site, a partir da imagem que te mandei. Liste as cores principais e secundárias e me explique como organizá-las em variáveis CSS?"<br>5. "Quero fazer um carrossel desses cards dos 'próximos eventos'. Me ajude com o código. Quero que os cards sejam deslizáveis com botões de anterior e próximo e que funcione bem em telas menores."<br>6. "Estou criando as rotas do meu site em React Router. Tenho as páginas Home, Organizadores, Fornecedores e Eventos. Me ajude a configurar as routes e a navegação entre elas." |
| **Trechos ou entregas afetadas** | **Giovanna:** CSS da página de eventos ; `client/src/App.jsx`, login, layout autenticado e páginas de fornecedor e organizador.<br>**Pedro:** paleta de cores e variáveis CSS (`:root`) nos estilos globais do front-end; componente de carrossel e estilos CSS da seção "Próximos eventos"; configuração das rotas (`Routes`/`Route`) e dos links de navegação entre as páginas. |


### Disciplina 2 — Cálculo

| **Aluno(s) Responsável(veis)** | Pedro |
| :--- | :--- |
| **Ferramenta utilizada** | Claude (Anthropic), com execução no VS Code |
| **Versão/modelo** | Claude Sonnet 5.5 |
| **Disciplina / Trabalho** | Cálculo 
| **Finalidade de uso** | Revisar os textos e o código do projeto para corrigir erros de gramática e ortografia, sem alterar a lógica nem o funcionamento |
| ***Prompts* principais utilizados** | "Pode revisar os textos e o código do projeto e corrigir erros de gramática e ortografia, sem alterar a lógica nem o funcionamento?" |
| **Trechos ou entregas afetadas** | Textos exibidos nas páginas e comentários (apenas correções de escrita) |


## Entrega 2
<br><br>

### Disciplina 1 — Full Stack

| **Aluno(s) Responsável(veis)** | Giovanna, Pedro e Olivia |
| :--- | :--- |
| **Ferramenta utilizada** | **Giovanna:** ChatGPT <br>**Pedro:** Claude <br>**Olivia:** ChatGPT |
| **Versão/modelo** | **Giovanna:** 6 Luna (médio); <br>**Pedro:** Claude Sonnet 5.5<br>**Olivia:** GPT-6 |
| **Disciplina / Trabalho** | Full Stack — Projeto Troca Ticket
| **Finalidade de uso** | **Giovanna:** preparar dados de demonstração, resolver conflitos de merge no Git, diagnosticar um erro de conexão no front-end, entender como fazer o redirecionamento por perfil.<br>**Pedro:** identificar a tipografia do layout e implementá-la no React, além de entender e corrigir erros apresentados pelo código.<br>**Olivia:** apoiar o desenvolvimento do back-end: arquitetura, funcionalidades, consultas SQL, validação de dados, autenticação, tratamento de erros, resolução de problemas técnicos e documentação da API, além de esclarecer conceitos de programação e apoiar decisões técnicas. |
| ***Prompts* principais utilizados** | **Giovanna**<br>1. "Prepare mock dados de demonstração para organizadores, fornecedores, eventos, vagas de serviço e custos baseado nesse modelo de tabelas."(init aql anexado)<br>2. "Esta dando esse conflito com a main, eu n estou conseguindo resolver."<br>3. "Não consigo resolver esse erro`ERR_CONNECTION_REFUSED` em `localhost:5173`, quais podem ser as causas." <br>4. "Como eu faço pata o back seguir o fluxo de telas do front?"<br>4. "Com base na documentação da API e no JSX, explique como organizar as rotas para direcionar administradores, organizadores e fornecedores às respectivas telas."<br>**Pedro**<br>1. "Qual fonte é essa? me fale para implementar no meu código react" (com captura de tela do layout anexada)<br>2. "Meu código está apresentando este erro. Me explique o que significa, por que está acontecendo e como corrigir." (com a mensagem de erro anexada)<br>**Olivia**<br>1. "Como estruturar um backend Node.js com Express utilizando MVC e separando as responsabilidades entre Controller, Service e Repository?"<br>2. "Como configurar uma conexão com MySQL utilizando mysql2/promise e como executar consultas SQL pelo Repository?"<br>3. "Como implementar uma rota GET para listar os eventos, retornando também a quantidade de propostas recebidas?"<br>4. "Como implementar autenticação utilizando JWT, bcrypt e cookies HttpOnly?"<br>5. "Como criar DTOs e funções de validação para os dados recebidos pela API, verificando os campos obrigatórios e os formatos informados?"<br>6. "Como implementar um middleware centralizado de erros no Express 5 e utilizar exceções personalizadas?"<br>7. "Por que estou recebendo erros como ETIMEDOUT, ER_ACCESS_DENIED_ERROR e repository.listarEventos is not a function? Como identificar e corrigir esses problemas?"<br>8. "Crie uma documentação simples para a API, especificando as rotas, os dados recebidos e os retornos de cada endpoint." |
| **Trechos ou entregas afetadas** | **Giovanna:** servidor e arquivo SQL de inicialização; branch `pages_Fornecedor` e arquivos em conflito no client; execução local do front-end (servidor Vite); Chamada de login ao back-end e redirecionamento por perfil; <br>**Pedro:** definição da fonte do projeto (Space Grotesk) e importação via Google Fonts/Fontsource e CSS/Tailwind; trechos do front-end em que os erros ocorreram e foram corrigidos [indicar os arquivos/componentes].<br<br>**Olivia:** Arquitetura do back-end: organização das pastas e separação entre Routes, Controllers, Services, Repositories e DTOs. Banco de dados, conexão MySQL, pool de conexões, consultas SQL e integração com a Aiven.Autenticação: cadastro, login, bcrypt, JWT, cookies e middlewares de autenticação e autorização. Eventos: listagem e detalhes de eventos, relacionamento com organizadores, vagas de serviço e propostas Administrativo:resumo da plataforma, listagem de usuários e atualização do status dos cadastros.Fornecedores:dados dos fornecedores e listagem de suas propostas.Validação e erros: DTOs, validação de requisições, exceções personalizadas e middleware centralizado de erros.Documentação: endpoints da API com métodos HTTP, parâmetros e exemplos de requisição e resposta.Infraestrutura: Docker, variáveis de ambiente, conexão com o banco remoto e problemas de Git e do ambiente de desenvolvimento. |


### Disciplina 2 - Cálculo

| **Aluno(s) Responsável(veis)** | Pedro |
| :--- | :--- |
| **Ferramenta utilizada** |  Claude (Anthropic) |
| **Versão/modelo** | Versão/modelo:** Claude Sonnet 5.5 |
| **Disciplina / Trabalho** |  Cálculo  |
| **Finalidade de uso** | Orientação sobre como integrar a ideia de cálculo (valor esperado do fornecedor) ao contexto e à lógica do projeto |
| ***Prompts* principais utilizados** | 1. "Como posso integrar essa ideia de cálculo no meu projeto?"<br> 2. "Corrija esse cálculo e veja se está de acordo com o projeto." <br> 3. "Faça os gráficos e as tabelas das funções." <br> "Formate o documento para uma linguagem mais clara e formal." |
| **Trechos ou entregas afetadas** | Seção da documentação que descreve a aplicação do cálculo no projeto; Desenvolvimento matemático e fórmulas da documentação; Gráficos e tabelas das funções; formatação geral da documentação de cálculo |



***Declaro que o uso acima descrito está em conformidade com o GUIA PARA O USO RESPONSÁVEL DE
INTELIGÊNCIA ARTIFICIAL NA FECAP e que o conteúdo final é de minha plena responsabilidade
autoral.***