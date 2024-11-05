const Sequelize = require('sequelize');
const database = require('../database/db');
const Assessment = require('./assessment');
const { DataTypes } = Sequelize;

const Circumference = database.define('circumference', {
    id_circumference: {
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
    neck: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    thorax: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    shoulderBlade: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    waist: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    abdomen: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    hip: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    leftWrist: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rightWrist: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    leftArm: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rightArm: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    leftContractedArm: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rightContractedArm: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    leftForearm: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rightForearm: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    leftGlutealThigh: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rightGlutealThigh: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    leftMedialThigh: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rightMedialThigh: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    leftLeg: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rightLeg: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    leftAnkle: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rightAnkle: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = Circumference;
