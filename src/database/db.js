const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT, //add porta
  }
);

// Verifica a autenticação com o banco de dados
db.authenticate()
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Sincronize os modelos com o banco de dados
db.sync()
  .then(() => {
    console.log("Tabelas sincronizadas com o banco de dados.");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar tabelas com o banco de dados:", error);
  });

module.exports = db;
