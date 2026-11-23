import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API Troca Ticket',
        description: 'Documentação das rotas da API do Troca Ticket'
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local' }
    ],
    tags: [
        { name: 'Fornecedores', description: 'Dados dos fornecedores' },
        { name: 'Administração', description: 'Painel do administrador' },
        { name: 'Eventos', description: 'Eventos cadastrados' }
    ]
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
