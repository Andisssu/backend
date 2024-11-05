# 📑 Documentação do Backend Avasoft

## 📚 Visão Geral

Este projeto é uma aplicação de sistema backend desenvolvida utilizando Node.js, Sequelize como ORM (Object-Relational Mapper) e PostgreSQL como banco de dados.

## 🗂 Estrutura do Projeto

    backend/
    │    ├── config/
    │    |   └── config.js
    │    ├── src/
    │    │   ├── controllers/
    │    |   |   ├── patientController.js
    │    |   |   ├── professionalController.js
    │    │   │   └── userController.js
    │    |   ├── middlewares/
    │    │   │   └── auth.js
    │    |   ├── database/
    │    |   |   ├── connection.js
    │    |   |   ├── pconnectionWithPromise.js
    │    │   │   └── db.js
    │    │   ├── models/
    │    |   |   ├── assessment.js
    │    |   |   ├── bmi.js
    │    |   |   ├── patient.js
    │    |   |   ├── professional.js
    │    |   |   ├── user.js
    │    │   │   └── userRules.js
    │    │   ├── routes/
    │    |   |   ├── patientRoute.js
    │    |   |   ├── professionalRoute.js
    │    │   │   └── userRoute.js
    │    │   ├── utils/
    │    │   ├── app.js
    │    │   └── server.js
    │    ├── .env
    │    ├── .gitignore
    │    ├── app.js
    │    ├── env_exemple.env
    │    ├── package.json
    │    ├── README.md
    │    └── server.js
    └──

## Requisitos para rodar localmente

### 🗃 Requisitos iniciais

Antes de começar, certifique-se de ter os seguintes requisitos instalados em seu ambiente de desenvolvimento:

1. IDE de sua preferência
2. Node.js (versão 14.x ou superior)
3. npm (geralmente instalado junto com o Node.js)
4. PostgreSQL (versão 12.x ou superior)
5. Sequelize CLI (instalado globalmente)

### 💻 Instalação

Para configurar o projeto, siga os passos abaixo:

1. Clone o repositório:

    ```bash
    git clone https://github.com/Andisssu/avasoft.git
    cd avasoft
    cd backend
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Crie uma copia do arquivo `env_exemple.env` e renomei para `.env` com suas credenciais do banco de dados PostgreSQL:

4. Inicie o servidor:

    ```bash
    npm start
    ```

## 🛠 Tecnologias Utilizadas

### **Node.js**

- **Descrição:** Ambiente de execução JavaScript no lado do servidor.
- **Versão:** 14.x ou superior.
- **Uso:** Executa o código JavaScript no servidor e gerencia as dependências do projeto.

### **Express.js**

- **Descrição:** Framework web para Node.js.
- **Uso:** Facilita a criação de APIs e o gerenciamento de rotas, middleware e manipulação de requisições HTTP.

### **Sequelize**

- **Descrição:** ORM (Object-Relational Mapper) para Node.js.
- **Versão:** 6.x ou superior.
- **Uso:** Facilita a interação com o banco de dados PostgreSQL, fornecendo uma camada de abstração sobre consultas SQL e manipulação de dados.

### **PostgreSQL**

- **Descrição:** Sistema de gerenciamento de banco de dados relacional.
- **Versão:** 12.x ou superior.
- **Uso:** Armazena os dados da aplicação de forma estruturada e relacional.

### **dotenv**

- **Descrição:** Biblioteca para carregar variáveis de ambiente a partir de um arquivo `.env`.
- **Uso:** Configura as variáveis de ambiente necessárias para a aplicação, como credenciais do banco de dados e configurações de ambiente.

### **Nodemon**

- **Descrição:** Ferramenta que monitora mudanças no código e reinicia automaticamente o servidor.
- **Uso:** Facilita o desenvolvimento ao reiniciar automaticamente a aplicação sempre que há alterações no código-fonte.


## 🤝 Contribuição

Se você deseja contribuir para o projeto, siga as diretrizes descritas no arquivo README.md localizado na raiz do projeto.
