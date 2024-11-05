const Sequelize = require("sequelize");
const database = require("../database/db");
const User = require("./user");

const Professional = database.define("professional", {
  id_professional: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  registry_professional: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  experience: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// Associações
Professional.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = Professional;
