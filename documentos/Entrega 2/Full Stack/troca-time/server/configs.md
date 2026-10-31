# Para configurar o ambiente, rode os seguintes comandos:


### 1. instalar dependências:
`npm install`


### 2. Configurar as variáveis de ambiente
Crie um arquivo .env na raiz do projeto, utilizando o .env.example como referência, e configure a variável DATABASE_URL para conectar ao banco de dados.


### 3. Subir banco de dados:
`docker-compose up -d`


### 4. Configurar ORM (Prisma) na sua máquina:
`npx prisma generate`