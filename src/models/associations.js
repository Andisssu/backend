const Patient = require("./patient");
const User = require("./user");
const Assessment = require("./assessment");
const Skinfold = require("./skinfold");
const Circumference = require("./circumference");
const Bmi = require("./bmi");
const BodyComposition = require("./BodyComposition");

// Associações

// Paciente pertence a um usuário
Patient.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
});

// Usuário tem um paciente
User.hasOne(Patient, {
  foreignKey: 'user_id',
  as: 'patient',
  onDelete: 'CASCADE',
});

// Paciente tem várias avaliações (Assessments)
Patient.hasMany(Assessment, {
  foreignKey: 'id_patient',
  as: 'assessments',
  onDelete: 'CASCADE',
});

// Avaliação pertence a um paciente
Assessment.belongsTo(Patient, {
  foreignKey: 'id_patient',
  as: 'patient',
  onDelete: 'CASCADE',
});

// Avaliação tem uma circunferência
Assessment.hasOne(Circumference, {
  foreignKey: 'id_assessment',
  as: 'circumference',
  onDelete: 'CASCADE',
});

// Circunferência pertence a uma avaliação
Circumference.belongsTo(Assessment, {
  foreignKey: 'id_assessment',
  as: 'assessment',
  onDelete: 'CASCADE',
});

// Avaliação tem uma dobra cutânea
Assessment.hasOne(Skinfold, {
  foreignKey: 'id_assessment',
  as: 'skinfold',
  onDelete: 'CASCADE',
});

// Dobra cutânea pertence a uma avaliação
Skinfold.belongsTo(Assessment, {
  foreignKey: 'id_assessment',
  as: 'assessment',
  onDelete: 'CASCADE',
});

// Avaliação tem um BMI
Assessment.hasOne(Bmi, {
  foreignKey: 'id_assessment',
  as: 'bmi',
  onDelete: 'CASCADE',
});

// BMI pertence a uma avaliação
Bmi.belongsTo(Assessment, {
  foreignKey: 'id_assessment',
  as: 'assessment',
  onDelete: 'CASCADE',
});

// Avaliação tem uma composição corporal
Assessment.hasOne(BodyComposition, {
  foreignKey: 'id_assessment',
  as: 'bodyComposition',
  onDelete: 'CASCADE',
});

// Composição corporal pertence a uma avaliação
BodyComposition.belongsTo(Assessment, {
  foreignKey: 'id_assessment',
  as: 'assessment',
  onDelete: 'CASCADE',
});

module.exports = {
  Patient,
  User,
  Assessment,
  Skinfold,
  Circumference,
  Bmi,
  BodyComposition, 
};
