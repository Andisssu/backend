const Sequelize = require("sequelize");
const database = require("../database/db");
const { DataTypes } = Sequelize
const Assessment = require('./assessment');

const Skinfold = database.define('skinfold', {
  id_skinfold: {
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
  triceps: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  axillary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  abdominal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  thigh: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  calf: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  subscapular: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  suprailiac: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pectoral: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  bicep: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Skinfold;
