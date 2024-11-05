const app = require("./app");
const http = require("http");
const debug = require("debug")("nodestr:server");
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./src/routes/authRoutes');
require("dotenv").config();
const database = require('./src/database/db');
const User = require('./src/models/user'); // Caminho correto para o arquivo user.js
const Patient = require('./src/models/patient'); 
const Assessment = require('./src/models/assessment'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('./src/models/associations'); 

const port = normalizePort(process.env.PORT || '3001');

app.set('port', port);


const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Definir a versão do OpenAPI
    info: {
      title: 'API Documentada AVASOFT',
      version: '1.0.0',
      description: 'Documentação da API utilizando Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000/', // URL base da sua API
      },
    ],
  },
  apis: ['./src/controllers/*.js'], // Caminho para os arquivos de rotas a serem documentados
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.use(session({
  secret: process.env.SESSION_SECRET || 'Deus é bom', //chave super secreta
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



app.get('/hello', (req, res) => {
  res.send('Hello, Swagger!');
});




database.sync().then(() => {
  console.log('Database synchronized');
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});

function normalizePort(value) {
  const port = parseInt(value, 10);

  if (isNaN(port)) {
    return value;
  }

  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
