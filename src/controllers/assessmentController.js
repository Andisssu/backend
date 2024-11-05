const Assessment = require('../models/assessment');
const Patient = require('../models/patient');
const Circumference = require('../models/circumference');
const Skinfold = require('../models/skinfold');
const Bmi = require('../models/bmi');
const BodyComposition = require('../models/BodyComposition');
const User = require('../models/user'); // Certifique-se de que o modelo User está sendo importado corretamente
const { AssessmentService } = require('../services/assessmentService');
const PatientHistoryService = require('../services/patientHistoryService');



// Get all assessments with associated data
exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id_patient', 'weigth_ini', 'height_ini'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['fullName']
            }
          ]
        },
        {
          model: Circumference,
          as: 'circumference',
        },
        {
          model: Skinfold,
          as: 'skinfold',
        },
        {
          model: Bmi,
          as: 'bmi',
        },
        {
          model: BodyComposition,
          as: 'bodyComposition',
        },
      ],
    });

    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ message: "Error fetching assessments.", error: error.message });
  }
};

// Get assessment by id with associated data
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      where: { id_assessment: req.params.id },
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id_patient', 'weigth_ini', 'height_ini'],
        },
        {
          model: Circumference,
          as: 'circumference',
          attributes: ['id_assessment', 'neck', 'thorax', 'shoulderBlade', 'waist', 'abdomen', 'hip', 'leftWrist', 'rightWrist', 'leftArm', 'rightArm', 'leftContractedArm', 'rightContractedArm', 'leftForearm', 'rightForearm', 'leftGlutealThigh', 'rightGlutealThigh', 'leftMedialThigh', 'rightMedialThigh', 'leftLeg', 'rightLeg', 'leftAnkle', 'rightAnkle'],
        },
        {
          model: Skinfold,
          as: 'skinfold',
          attributes: ['id_assessment', 'triceps', 'axillary', 'abdominal', 'thigh', 'calf', 'subscapular', 'suprailiac', 'pectoral', 'bicep'],
        },
        {
          model: Bmi,
          as: 'bmi',
        },
        {
          model: BodyComposition,
          as: 'bodyComposition',
        },
        
      ],
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.status(200).json(assessment);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    res.status(500).json({ message: "Error fetching assessment.", error: error.message });
  }
}; 

// Get assessments by patient ID
exports.getAssessmentsByPatientId = async (req, res) => {
  try {
    const patientId = req.params.id_patient;
    const assessments = await Assessment.findAll({
      where: { id_patient: patientId },
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id_patient', 'weigth_ini', 'height_ini'],
        },
        {
          model: Circumference,
          as: 'circumference',
          attributes: ['id_assessment', 'neck', 'thorax', 'shoulderBlade', 'waist', 'abdomen', 'hip', 'leftWrist', 'rightWrist', 'leftArm', 'rightArm', 'leftContractedArm', 'rightContractedArm', 'leftForearm', 'rightForearm', 'leftGlutealThigh', 'rightGlutealThigh', 'leftMedialThigh', 'rightMedialThigh', 'leftLeg', 'rightLeg', 'leftAnkle', 'rightAnkle'],
        },
        {
          model: Skinfold,
          as: 'skinfold',
          attributes: ['id_assessment', 'triceps', 'axillary', 'abdominal', 'thigh', 'calf', 'subscapular', 'suprailiac', 'pectoral', 'bicep'],
        },
        {
          model: Bmi,
          as: 'bmi',
        },
        {
          model: BodyComposition,
          as: 'bodyComposition',
        },
      ],
    });

    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ message: "No assessments found for this patient." });
    }

    res.json(assessments);
  } catch (error) {
    console.error("Error fetching assessments for patient:", error);
    res.status(500).json({ message: "Error fetching assessments for patient.", error: error.message });
  }
};


// Generate patient history PDF
exports.getPatientHistory = async (req, res) => {
  try {
    const patientId = req.params.id;  // ID do paciente recebido pela rota
    const pdfPath = await PatientHistoryService.generatePatientHistory(patientId);

    // Enviar o PDF como resposta ou para download
    res.download(pdfPath, (err) => {
      if (err) {
        console.error("Error sending the PDF:", err);
        res.status(500).json({ message: "Error generating the PDF." });
      }
    });
  } catch (error) {
    console.error('Error generating patient history:', error);
    res.status(500).json({ message: "Error generating patient history.", error: error.message });
  }
};

exports.createAssessment = async (req, res) => {
  const { id_patient, assessmentDate, weight, height, dateRecorded, circumferenceData, skinfoldData, method, gender, age } = req.body;

  if (!assessmentDate || !method || !dateRecorded) {
    return res.status(400).json({ message: 'The assessmentDate, method and dateRecorded fields are mandatory.' });
  }

  try {
    // Create assessment
    const assessment = await Assessment.create({
      id_patient,
      assessmentDate,
      weight,
      height,
      method,
    });

    // Define os dados padrão de circunferência e dobras cutâneas como zero
    const defaultCircumferenceData = {
      neck: 0, thorax: 0, shoulderBlade: 0, waist: 0, abdomen: 0, hip: 0,
      leftWrist: 0, rightWrist: 0, leftArm: 0, rightArm: 0, leftContractedArm: 0,
      rightContractedArm: 0, leftForearm: 0, rightForearm: 0, leftGlutealThigh: 0,
      rightGlutealThigh: 0, leftMedialThigh: 0, rightMedialThigh: 0, leftLeg: 0,
      rightLeg: 0, leftAnkle: 0, rightAnkle: 0
    };

    const defaultSkinfoldData = {
      triceps: 0, axillary: 0, abdominal: 0, thigh: 0, calf: 0, subscapular: 0,
      suprailiac: 0, pectoral: 0, bicep: 0
    };

    // Lógica para preencher somente os dados necessários conforme o método de avaliação
    let requiredCircumferenceData = { ...defaultCircumferenceData };
    let requiredSkinfoldData = { ...defaultSkinfoldData };

    switch (method) {
      case 'McArdle':
        requiredSkinfoldData = {
          ...defaultSkinfoldData,
          triceps: skinfoldData.triceps || 0,
          abdominal: skinfoldData.abdominal || 0,
          thigh: skinfoldData.thigh || 0,
          subscapular: skinfoldData.subscapular || 0,
          suprailiac: skinfoldData.suprailiac || 0
        };
        break;
      case 'Guedes':
        requiredSkinfoldData = {
          ...defaultSkinfoldData,
          triceps: skinfoldData.triceps || 0,
          abdominal: skinfoldData.abdominal || 0,
          suprailiac: skinfoldData.suprailiac || 0,
          subscapular: gender === 'feminino' ? skinfoldData.subscapular || 0 : 0,
          thigh: gender === 'feminino' ? skinfoldData.thigh || 0 : 0
        };
        break;
      case 'Jackson & Pollock':
        requiredSkinfoldData = {
          ...defaultSkinfoldData,
          triceps: skinfoldData.triceps || 0,
          abdominal: skinfoldData.abdominal || 0,
          thigh: skinfoldData.thigh || 0,
          subscapular: skinfoldData.subscapular || 0
        };
        break;
      case 'Dados Livres':
        // Usamos todos os valores passados, sem fazer nenhum cálculo adicional
        requiredCircumferenceData = { ...circumferenceData };
        requiredSkinfoldData = { ...skinfoldData };
        break;
      default:
        return res.status(400).json({ message: 'Método de avaliação inválido.' });
    }

    // Cria os registros de circunferência e dobras cutâneas
    await Circumference.create({ id_assessment: assessment.id_assessment, ...requiredCircumferenceData });
    await Skinfold.create({ id_assessment: assessment.id_assessment, ...requiredSkinfoldData });

    // Chamar o serviço de avaliação para calcular e salvar a composição corporal
    if (method !== 'Dados Livres') {
      await AssessmentService({
        id_assessment: assessment.id_assessment,
        weight,
        height,
        skinfolds: requiredSkinfoldData,
        method,
        gender,
        age,
        dateRecorded,
      });
    }

    res.status(201).json({ message: 'Avaliação criada com sucesso!' });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Error creating assessment.', error: error.message });
  }
};


// Update assessment with related data
exports.updateAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const { id_patient, assessmentDate, weight, height, circumferenceData, skinfoldData, method, gender, age, dateRecorded } = req.body;

    // Verify if assessment exists
    const assessment = await Assessment.findByPk(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    // Update assessment
    await assessment.update({
      id_patient,
      assessmentDate,
      weight,
      height,
      method,
    });

    // Update or create circumference data
    if (circumferenceData) {
      const existingCircumference = await Circumference.findOne({ where: { id_assessment: assessmentId } });
      if (existingCircumference) {
        await existingCircumference.update(circumferenceData);
      } else {
        await Circumference.create({
          id_assessment: assessmentId,
          ...circumferenceData,
        });
      }
    }

    // Update or create skinfold data
    if (skinfoldData) {
      const existingSkinfold = await Skinfold.findOne({ where: { id_assessment: assessmentId } });
      if (existingSkinfold) {
        await existingSkinfold.update(skinfoldData);
      } else {
        await Skinfold.create({
          id_assessment: assessmentId,
          ...skinfoldData,
        });
      }
    }

    // Reprocess BMI and body fat percentage
    if (method && gender && age && weight && height) {
      const assessmentData = {
        id_assessment: assessmentId,
        weight,
        height,
        skinfolds: skinfoldData,
        method,
        gender,
        age,
        dateRecorded,
      };

      // Call assessment service to calculate BMI and body fat percentage
      await AssessmentService(assessmentData);
    }

    // Return updated assessment
    const updatedAssessment = {
      id_patient,
      assessmentDate,
      weight,
      height,
      method,
      dateRecorded,
      circumferenceData,
      skinfoldData
    };

    res.json({
      message: "Assessment updated successfully!",
      assessment: updatedAssessment
    });
  } catch (error) {
    console.error("Error updating assessment:", error);
    res.status(500).json({ message: "Error updating assessment.", error: error.message });
  }
};

// Delete assessment with related data
exports.deleteAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const assessment = await Assessment.findByPk(assessmentId);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    // Delete related records
    await Circumference.destroy({ where: { id_assessment: assessmentId } });
    await Skinfold.destroy({ where: { id_assessment: assessmentId } });
    await Bmi.destroy({ where: { id_assessment: assessmentId } });

    // Delete assessment
    await assessment.destroy();

    res.json({ message: "Assessment and related records deleted successfully!" });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    res.status(500).json({ message: "Error deleting assessment.", error: error.message });
  }
};
