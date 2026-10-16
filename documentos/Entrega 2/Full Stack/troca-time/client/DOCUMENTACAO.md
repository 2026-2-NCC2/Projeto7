# Troca Ticket: guia do front-end

Guia para manter o código organizado e padronizado conforme o projeto cresce.
Leia antes de criar uma tela ou um componente novo.

- [Como rodar](#como-rodar)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Boas práticas](#boas-práticas)
- [Layouts](#layouts)
- [Componentes](#componentes)
- [Páginas](#páginas)
- [Dados (API simulada)](#dados-api-simulada)
- [Checklist antes de subir código](#checklist-antes-de-subir-código)

---

## Como rodar

```bash
npm install        # instala as dependências (só na primeira vez)
npm run dev        # abre o projeto em http://localhost:5173
npm run format     # formata o código com o Prettier
npm run lint       # procura erros com o Oxlint
npm run build      # gera a versão final em dist/
```

---

## Estrutura de pastas

```
src/
├── assets/        imagens e arquivos estáticos
├── components/    peças reutilizáveis (botão, card, campo...)
├── layouts/       moldes de tela inteira (o que se repete em volta das páginas)
├── pages/         uma pasta por tela, separadas por perfil (auth, adm, fornecedor)
├── dados/         dados de exemplo e funções que simulam a API
├── utils/         funções puras de ajuda (ex.: validações)
├── styles/        variables.css (cores, fontes, sombras) e global.css (reset)
├── App.jsx        rotas
└── main.jsx       ponto de entrada
```

**Onde colocar cada coisa:**

| É... | Vai em... |
|---|---|
| Algo usado em 2 ou mais telas | `components/` |
| O "molde" em volta das páginas (cabeçalho, logo, chat) | `layouts/` |
| Uma tela com rota própria | `pages/<perfil>/<NomeDaPagina>/` |
| Uma função sem JSX (validar, formatar) | `utils/` |
| Dados de exemplo ou chamadas de API | `dados/` |

---

## Boas práticas

### 1. Uma pasta por componente, com o mesmo nome

```
components/Botao/
├── Botao.jsx
└── Botao.module.css
```

- O nome da pasta, do arquivo e da função é o mesmo, em **PascalCase** (`Botao`, `CartaoEvento`).
- **Não use `index.jsx`.** Com vários arquivos chamados `index.jsx`, fica difícil saber em qual aba do editor você está.
- Só crie o `.module.css` se o componente tiver estilo próprio. Não deixe arquivos vazios.

### 2. Estilos com CSS Modules

Cada componente importa o seu próprio CSS. As classes valem **só** para aquele componente, então não há conflito de nomes entre arquivos.

```css
/* CartaoEvento.module.css: no CSS, escreva em kebab-case */
.ver-mais {
    background: var(--cor-escura-azul);
}
```

```jsx
// CartaoEvento.jsx: no JSX, use camelCase
import styles from './CartaoEvento.module.css'

<Link className={styles.verMais}>Ver mais</Link>
```

Regras:

- **Use sempre as variáveis** de `styles/variables.css` (`var(--cor-erro)`, `var(--sombra-1)`) em vez de escrever a cor direto. Se precisar de uma cor nova, crie a variável lá.
- **Não coloque estilo de componente no `global.css`.** Ele guarda só o reset e o `body`.
- **Não use prefixos** (`adm-`, `org-`). Com CSS Modules eles não são mais necessários.
- **Evite `style={{ ... }}`.** Só use inline quando o valor é calculado na hora (ex.: a largura de uma barra do gráfico).
- **Combinar classes:**
  ```jsx
  className={`${styles.botao} ${ativo ? styles.ativo : ''}`}
  ```
- **Classe que depende de um valor:** monte um objeto em vez de juntar texto.
  ```jsx
  const CLASSES_STATUS = { aprovado: styles.aprovado, pendente: styles.pendente }
  <span className={CLASSES_STATUS[status]} />
  ```

### 3. Variantes por props, não componentes novos

Se a diferença é só visual (cor, tamanho, alinhamento), use uma prop no mesmo componente:

```jsx
<Botao variante='primario'>Entrar</Botao>
<Botao variante='link'>Cadastre-se</Botao>
```

Não crie `Botao2` ou `BotaoAzul`. Dê nomes que explicam o que a variante faz (`largo`, `centro`, `erro`).

### 4. Quando criar um componente

Crie um componente quando o mesmo trecho aparece **2 ou 3 vezes**. Se ele só existe em uma tela, deixe dentro da própria página (como `Indicador` e `GraficoTicket` em `HomeAdm.jsx`). Criar componente "por precaução" deixa o projeto mais complicado.

### 5. Imports com `@`

O atalho `@` aponta para `src/`:

```jsx
import Botao from '@/components/Botao/Botao'      // ✅
import Botao from '../../../components/Botao'      // ❌
```

O único import relativo permitido é o CSS do próprio componente (`./Botao.module.css`).

### 6. Nomes em português

Variáveis, funções, props e classes ficam em português, como no resto do projeto: `navegar`, `erros`, `aoTentarDeNovo`, `.ver-mais`.

| O quê | Formato | Exemplo |
|---|---|---|
| Componente / página | PascalCase | `CartaoEvento` |
| Variável, função, prop | camelCase | `tipoPerfil`, `validarEmail` |
| Constante fixa | MAIÚSCULAS | `ACOES_VISIVEIS`, `PERFIS` |
| Classe CSS | kebab-case | `.ver-mais` |

### 7. Formatação

Não ajuste aspas e espaços à mão. Rode `npm run format` antes de cada commit. O Prettier aplica o padrão do projeto: 4 espaços, aspas simples e sem ponto e vírgula.

### 8. Segurança e limpeza

- **Nunca** use `console.log` com senha ou dados sensíveis.
- Apague código comentado e CSS sem uso; o histórico fica guardado no git.
- Textos que só leitores de tela devem ler usam uma classe que esconde o texto visualmente (veja `.somente-leitor-de-tela` em `Eventos.module.css`).

---

## Layouts

Ficam em `src/layouts/`. São o molde que se repete em volta das páginas.

### `LayoutAuth`

Molde das telas de login e cadastro: logo + título grande + conteúdo centralizado.

| Prop | Tipo | Descrição |
|---|---|---|
| `titulo` | texto | Título exibido abaixo do logo |
| `children` | JSX | Conteúdo da página |

```jsx
<LayoutAuth titulo='Acesse sua conta :)'>
    <Card elemento='form'>...</Card>
</LayoutAuth>
```

### `LayoutAutenticado`

Molde das telas internas (depois do login): `Cabecalho` no topo, a página no meio e o `ChatIA` flutuando. Na rota `/fornecedores` também mostra o `ChatConversa`.

Ele é usado nas **rotas** em `App.jsx`, não dentro das páginas:

```jsx
<Route element={<LayoutAutenticado />}>
    <Route path='/eventos' element={<Eventos />} />   {/* já ganha cabeçalho e chat */}
</Route>
```

> Para uma tela nova ganhar cabeçalho e chat, basta colocar a rota dela dentro desse bloco.

---

## Componentes

Ficam em `src/components/`.

### Base (formulários e textos)

#### `Botao`

| Prop | Valores | Padrão |
|---|---|---|
| `variante` | `'primario'` (azul, cheio) · `'link'` (só texto) | `'primario'` |
| `...props` | qualquer prop de `<button>` (`type`, `onClick`, `disabled`) | — |

```jsx
<Botao type='submit'>Entrar →</Botao>
<Botao variante='link' onClick={() => navegar('/cadastro')}>Cadastre-se</Botao>
```

#### `Card`

Caixa com fundo, borda e sombra.

| Prop | Valores | Padrão |
|---|---|---|
| `variante` | `'primario'` | `'primario'` |
| `largura` | `'estreito'` (400px) · `'largo'` (760px) | `'estreito'` |
| `elemento` | tag HTML usada (`'div'`, `'form'`, `'section'`) | `'div'` |

```jsx
<Card elemento='form' onSubmit={enviar}>...</Card>
```

#### `Campo`

Rótulo + input + mensagem de erro. Quando `erro` tem texto, a borda fica vermelha e a mensagem aparece embaixo do campo.

| Prop | Descrição |
|---|---|
| `id` | id e `name` do input (liga o rótulo ao campo) |
| `rotulo` | texto do rótulo |
| `erro` | mensagem de erro (vazio = sem erro) |
| `children` | opcional: troca o input por outro conteúdo, mantendo rótulo e erro |
| `...props` | qualquer prop de `<input>` (`type`, `value`, `onChange`, `placeholder`) |

```jsx
<Campo
    id='email'
    rotulo='*E-mail:'
    type='email'
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    erro={erros.email}
/>
```

#### `GrupoOpcoes`

Botões de escolha única (rádio), como "Fornecedor / Organizador". Por baixo, usa o `Campo`.

| Prop | Descrição |
|---|---|
| `nome` | `name` dos rádios |
| `rotulo` | texto acima das opções |
| `opcoes` | lista `[{ id, rotulo }]` |
| `valor` | `id` da opção selecionada |
| `onChange` | recebe o `id` escolhido |
| `erro` | mensagem de erro |

```jsx
<GrupoOpcoes
    nome='tipoPerfil'
    rotulo='*Escolha seu tipo de perfil:'
    opcoes={[{ id: 'fornecedor', rotulo: 'Fornecedor' }, { id: 'organizador', rotulo: 'Organizador' }]}
    valor={tipoPerfil}
    onChange={setTipoPerfil}
    erro={erros.tipoPerfil}
/>
```

#### `Acoes`

Agrupa os botões no fim de um formulário, com espaço entre eles.

| Prop | Valores | Padrão |
|---|---|---|
| `alinhamento` | `'esticado'` (botões na largura toda) · `'centro'` | `'esticado'` |

#### `Texto`

| Prop | Valores | Padrão |
|---|---|---|
| `variante` | `'padrao'` · `'destaque'` (grande, centralizado) · `'obs'` (pequeno, cinza) · `'erro'` (vermelho) | `'padrao'` |
| `elemento` | tag HTML usada | `'span'` |

```jsx
<Texto variante='obs'>Seus dados serão enviados para um administrador.</Texto>
```

#### `Titulo`

O `<h1>` grande e centralizado. Diminui sozinho em telas pequenas (máximo de 4rem).

```jsx
<Titulo>Cadastro</Titulo>
```

#### `Container`

Ocupa a altura toda da tela e centraliza o conteúdo. É usado pelo `LayoutAuth`.

#### `Logo`

Logo + "TROCA TICKET".

| Prop | Descrição | Padrão |
|---|---|---|
| `comTexto` | mostra o nome ao lado da imagem | `true` |

### Do sistema (telas internas)

#### `Cabecalho`

Barra do topo com a marca, os links de navegação e o menu "Perfil". O link da página atual fica destacado automaticamente.

> Para adicionar um item ao menu, acrescente na lista `LINKS` dentro de `Cabecalho.jsx`.

#### `ChatIA`

Botão flutuante que abre um painel de chat. Por enquanto só guarda as mensagens na tela; ainda não conversa com uma IA de verdade.

| Prop | Descrição | Padrão |
|---|---|---|
| `titulo` | nome do chat | `'TrocaTicket IA'` |
| `mensagemInicial` | primeira mensagem exibida | `'Olá! Como posso ajudar...'` |
| `lado` | `'direita'` · `'esquerda'` | `'direita'` |

#### `ChatConversa`

Um `ChatIA` já configurado como "Chat de Conversa", do lado esquerdo. Aparece só na tela de fornecedores.

#### `CartaoEvento`

Cartão de um evento: imagem, nome, data, local, organizador, fornecedor e o link "Ver mais" (vai para `/eventos/:id`).

| Prop | Descrição |
|---|---|
| `evento` | objeto `{ id, nome, data, local, organizador, fornecedor }` |

#### `ListaEventos`

Mostra uma lista de `CartaoEvento` sobre um fundo azul. Se a lista estiver vazia, mostra "Nenhum evento encontrado."

| Prop | Descrição |
|---|---|
| `eventos` | lista de eventos |
| `filtro` | nome do filtro ativo (usado para acessibilidade) |

---

## Páginas

| Rota | Página | Pasta |
|---|---|---|
| `/` | Login | `pages/auth/Login` |
| `/cadastro` | Cadastro | `pages/auth/Cadastro` |
| `/cadastro/obrigado` | Confirmação do cadastro | `pages/auth/CadastroObrigado` |
| `/home`, `/adm` | Painel do administrador | `pages/adm/HomeAdm` |
| `/eventos` | Lista de eventos com busca e filtros | `pages/adm/Eventos` |
| `/eventos/:id` | Detalhe do evento | `pages/adm/DetalheEvento` |
| `/organizadores/:id` | Perfil do organizador | `pages/adm/PerfilOrganizador` |
| `/fornecedores` | Home do fornecedor | `pages/fornecedor/HomeFornecedores` |
| `/perfil` e rotas inexistentes | Página vazia com título | `pages/PaginaVazia` |

### Criando uma página nova

1. Crie a pasta `pages/<perfil>/<NomeDaPagina>/` com `NomeDaPagina.jsx` (e `NomeDaPagina.module.css`, se precisar).
2. Monte a tela usando os componentes que já existem antes de criar estilos novos.
3. Adicione a rota em `App.jsx`, dentro de `LayoutAutenticado` se a tela for interna.
4. Se ela deve aparecer no menu, adicione o link em `LINKS`, no `Cabecalho.jsx`.

---

## Dados (API simulada)

Enquanto o back-end não está pronto, `src/dados/` guarda os dados de exemplo.

- `simularApi.js` → a função `responder(dados)` devolve os dados depois de 500ms, como se viessem de uma API.
  - Para testar a tela de erro, adicione `?simularErro` ao fim da URL. Ex.: `http://localhost:5173/adm?simularErro`
- `painelAdm.js`, `organizadores.js` → funções como `buscarOrganizador(id)` e `decidirCadastro(id, decisao)`.
- `eventos.js`, `dadosFornecedores.js` → listas fixas.

> Quando a API existir, troque o conteúdo dessas funções por `fetch()`. As páginas não precisam mudar, porque continuam chamando as mesmas funções.

---

## Checklist antes de subir código

- [ ] Componente novo está em `components/Nome/Nome.jsx` (e `.module.css`, se tiver estilo)
- [ ] Nenhum estilo novo foi para o `global.css`
- [ ] Cores, fontes e sombras usam as variáveis de `variables.css`
- [ ] Imports usam `@/`
- [ ] Sem `console.log` com dados sensíveis e sem código comentado
- [ ] Rodei `npm run format`, `npm run lint` e `npm run build` sem erros
- [ ] Abri a tela no navegador, no computador e no celular
