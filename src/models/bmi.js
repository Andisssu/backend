const Sequelize = require("sequelize");
const database = require("../database/db");
const Assessment = require('./assessment');
const { DataTypes } = Sequelize;

const Bmi = database.define('bmi', {
  id_bmi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_assessment: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Assessment,
      key: 'id_assessment',
    },
  },
  bmiValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  classification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateRecorded: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
});

module.exports = Bmi;
