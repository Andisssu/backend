// models/bodyComposition.js
const Sequelize = require("sequelize");
const database = require("../database/db");
const { DataTypes } = Sequelize;

const BodyComposition = database.define('BodyComposition', {
  id_body_composition: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_assessment: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assessments', // Nome da tabela 'assessment'
      key: 'id_assessment'
    },
    onDelete: 'CASCADE',
  },
  body_density: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  body_fat_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'body_compositions',
  timestamps: false,
});

module.exports = BodyComposition;
