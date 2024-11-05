const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Verifica a autenticação com o banco de dados
db.authenticate()
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Sincroniza os modelos com o banco de dados
db.sync()
  .then(() => {
    console.log("Tabelas sincronizadas com o banco de dados.");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar tabelas com o banco de dados:", error);
  });

module.exports = db;
