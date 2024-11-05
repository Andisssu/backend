const Bmi = require('../models/bmi');
const BodyComposition = require('../models/BodyComposition');

const calculateBMI = (weight, height) => {
  if (height <= 0) return 0; // Para evitar divisão por zero
  return (weight / ((height / 100) ** 2)).toFixed(2); // altura em metros
};

const classifyBMI = (bmi) => {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 24.9) return 'Peso normal';
  if (bmi < 29.9) return 'Sobrepeso';
  return 'Obesidade';
};

// Função para calcular a densidade corporal com base no método selecionado
const calculateBodyDensity = (method, gender, age, skinfolds) => {
  let DC;

  switch (method) {
    case 'McArdle':
      if (gender === 'homem' && age >= 18 && age <= 34) {
        DC = 1.1610 - 0.0632 * Math.log10(skinfolds.bicep + skinfolds.triceps + skinfolds.subscapular + skinfolds.suprailiac);
      } else if (gender === 'homem' && age >= 18 && age <= 27) {
        DC = 1.0913 - 0.00116 * (skinfolds.triceps + skinfolds.subscapular);
      } else if (gender === 'mulher' && age >= 18 && age <= 48) {
        DC = 1.06234 - 0.00068 * skinfolds.subscapular - 0.00039 * skinfolds.triceps - 0.00025 * skinfolds.thigh;
      } else if (gender === 'mulher' && age >= 9 && age <= 12) {
        DC = 1.088 - 0.014 * Math.log10(skinfolds.triceps) - 0.036 * Math.log10(skinfolds.subscapular);
      } else if (gender === 'mulher' && age >= 13 && age <= 16) {
        DC = 1.114 - 0.031 * Math.log10(skinfolds.triceps) - 0.041 * Math.log10(skinfolds.subscapular);
      } else if (gender === 'homem' && age >= 9 && age <= 12) {
        DC = 1.108 - 0.027 * Math.log10(skinfolds.triceps) - 0.038 * Math.log10(skinfolds.subscapular);
      } else if (gender === 'homem' && age >= 13 && age <= 16) {
        DC = 1.130 - 0.055 * Math.log10(skinfolds.triceps) - 0.026 * Math.log10(skinfolds.subscapular);
      } else {
        throw new Error('Faixa etária ou gênero não suportado para o método McArdle.');
      }
      break;
    case 'Guedes':
      if (gender === 'homem') {
        DC = 1.17136 - 0.06706 * Math.log10(skinfolds.triceps + skinfolds.suprailiac + skinfolds.abdominal);
      } else if (gender === 'mulher') {
        DC = 1.16650 - 0.07063 * Math.log10(skinfolds.coxa + skinfolds.suprailiac + skinfolds.subscapular);
      } else {
        throw new Error('Gênero não suportado para o método Guedes.');
      }
      break;
    case 'Dados Livres':
      // Não faz o cálculo de densidade corporal para Dados Livres
      return null; // Ou pode retornar 0, caso prefira tratar de forma diferente
    default:
      throw new Error('Método de avaliação inválido.');
  }

  return DC;
};

// Cálculo do percentual de gordura usando a fórmula de Siri
const calculateBodyFatPercentage = (density) => {
  if (!density) return null; // Não calcular se a densidade for nula (no caso de "Dados Livres")
  return ((4.95 / density) - 4.50) * 100;
};

// Função para criar ou atualizar o BMI
const createOrUpdateBMI = async (assessmentId, weight, height, dateRecorded) => {
  const bmiValue = calculateBMI(weight, height);
  const classification = classifyBMI(bmiValue);

  await Bmi.create({
    id_assessment: assessmentId,
    bmiValue,
    classification,
    dateRecorded,
  });
};

// Função para criar ou atualizar os dados de composição corporal
const createOrUpdateBodyComposition = async (assessmentId, density, bodyFatPercentage, dateRecorded) => {
  if (density && bodyFatPercentage) {
    await BodyComposition.create({
      id_assessment: assessmentId,
      body_density: density,
      body_fat_percentage: bodyFatPercentage,
      dateRecorded,
    });
  }
};

// Serviço principal de avaliação
const AssessmentService = async (assessmentData) => {
  const { id_assessment, weight, height, skinfolds, method, gender, age, dateRecorded } = assessmentData;

  try {
    const density = calculateBodyDensity(method, gender, age, skinfolds);
    const bodyFatPercentage = calculateBodyFatPercentage(density);

    await createOrUpdateBMI(id_assessment, weight, height, dateRecorded);

    // Salvar composição corporal apenas se não for "Dados Livres"
    if (density && bodyFatPercentage) {
      await createOrUpdateBodyComposition(id_assessment, density, bodyFatPercentage, dateRecorded);
    }
  } catch (error) {
    console.error("Error in AssessmentService:", error);
    throw error;
  }
};

module.exports = {
  AssessmentService,
};