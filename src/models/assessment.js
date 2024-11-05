const Sequelize = require("sequelize");
const database = require("../database/db");
const { DataTypes } = Sequelize
const Patient = require('./patient');

const Assessment = database.define('assessment', {
  id_assessment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  assessmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  id_patient: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'id_patient',
    },
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  method: {
    type: DataTypes.ENUM('Guedes', 'Pollock', 'Jackson & Pollock', 'McArdle', 'Dados Livres'),
    allowNull: false,
  },
});

module.exports = Assessment;