const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Assessment = require('../models/assessment');
const Patient = require('../models/patient');
const Professional = require('../models/professional');
const Circumference = require('../models/circumference');
const Skinfold = require('../models/skinfold');
const Bmi = require('../models/bmi');
const User = require('../models/user');

class PatientHistoryService {
  static async generatePatientHistory(id_patient) {
    try {
      // Buscando o paciente e incluindo o modelo User para obter o nome completo
      const patient = await Patient.findByPk(id_patient, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName', 'dataNasc'],
          },
        ],
      });

      if (!patient) {
        throw new Error('Patient not found');
      }

      const assessments = await Assessment.findAll({
        where: { id_patient: id_patient },
        include: [
          { model: Circumference, as: 'circumference' },
          { model: Skinfold, as: 'skinfold' },
          { model: Bmi, as: 'bmi' },
        ],
      });

      // Criação do documento PDF
      const doc = new PDFDocument();
      const pdfPath = path.join(__dirname, '..', 'historys', `Paciente_${patient.user.fullName}_Historico.pdf`);
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Adiciona a logo da avasoft à esquerda
      doc.image(path.join(__dirname, '..', 'utils', 'avasoftlogo.png'), 50, 50, { width: 130 });

      // Definindo a posição inicial das colunas
      const startX = 200;
      const colSpacing = 205;

      // Informações do paciente e do profissional
      doc.fontSize(12).text(`Nome: ${patient.user.fullName}`, startX, 50);
      const formattedDate = new Date(patient.user.dataNasc).toLocaleDateString('pt-BR');
      doc.text(`Data de Nascimento: ${formattedDate}`, startX, 70);
      doc.text(`Data do Relatório: ${new Date().toLocaleDateString()}`, startX, 90);

      doc.fontSize(12).text(`Profissional: `, startX + colSpacing, 50);
      doc.text(`Especialidade: `, startX + colSpacing, 70);
      doc.text(`Registro Profissional: `, startX + colSpacing, 90);

      // Centralizando o título do relatório
      const title = 'Relatório de Acompanhamento Antropométrico';
      doc.moveDown(3);
      const titleWidth = doc.widthOfString(title);
      const xOffset = (doc.page.width - titleWidth) / 2;
      doc.fontSize(14).text(title, xOffset, doc.y);
      doc.moveDown(3);

      // Para cada avaliação, vamos garantir que comece em uma nova página
      assessments.forEach((assessment, index) => {
        if (index > 0) doc.addPage(); // Adiciona uma nova página para cada avaliação, exceto a primeira

        doc.fontSize(12).text(`Avaliação ${index + 1}`, 50);
        doc.text(`Método: ${assessment.method}`, 50);
        doc.text(`Data: ${new Date(assessment.assessmentDate).toLocaleDateString('pt-BR')}`, 50);
        doc.moveDown();

        // Circunferências
        if (assessment.circumference) {
          doc.text('Circunferências:', 50);
          const circumferenceData = [
            ['Pescoço', assessment.circumference.neck],
            ['Tórax', assessment.circumference.thorax],
            ['Escápula', assessment.circumference.shoulderBlade],
            ['Cintura', assessment.circumference.waist],
            ['Abdômen', assessment.circumference.abdomen],
            ['Quadril', assessment.circumference.hip],
            ['Punho Esquerdo', assessment.circumference.leftWrist],
            ['Punho Direito', assessment.circumference.rightWrist],
            ['Braço Esquerdo', assessment.circumference.leftArm],
            ['Braço Direito', assessment.circumference.rightArm],
            ['Braço Esquerdo Contraído', assessment.circumference.leftContractedArm],
            ['Braço Direito Contraído', assessment.circumference.rightContractedArm],
            ['Antebraço Esquerdo', assessment.circumference.leftForearm],
            ['Antebraço Direito', assessment.circumference.rightForearm],
            ['Coxa Glútea Esquerda', assessment.circumference.leftGlutealThigh],
            ['Coxa Glútea Direita', assessment.circumference.rightGlutealThigh],
            ['Coxa Medial Esquerda', assessment.circumference.leftMedialThigh],
            ['Coxa Medial Direita', assessment.circumference.rightMedialThigh],
            ['Perna Esquerda', assessment.circumference.leftLeg],
            ['Perna Direita', assessment.circumference.rightLeg],
            ['Tornozelo Esquerdo', assessment.circumference.leftAnkle],
            ['Tornozelo Direito', assessment.circumference.rightAnkle],
          ];
          circumferenceData.forEach(([name, value]) => {
            doc.text(`${name}: ${value} cm`, 50);
          });
          doc.moveDown();
        }

        // Dobras Cutâneas
        if (assessment.skinfold) {
          doc.text('Dobras Cutâneas:', 50);
          const skinfoldData = [
            ['Tríceps', assessment.skinfold.triceps],
            ['Abdominal', assessment.skinfold.abdominal],
            ['Peitoral', assessment.skinfold.pectoral],
            ['Subescapular', assessment.skinfold.subscapular],
            ['Supra-ilíaca', assessment.skinfold.suprailiac],
            ['Coxa', assessment.skinfold.thigh],
          ];
          skinfoldData.forEach(([name, value]) => {
            doc.text(`${name}: ${value} mm`, 50);
          });
          doc.moveDown();
        }

        // Índice de Massa Corporal (IMC)
        if (assessment.bmi) {
          doc.text('Índice de Massa Corporal (IMC):', 50);
          doc.text(`IMC: ${assessment.bmi.bmiValue}`, 50);
          doc.moveDown();
        }
      });

      doc.end();
      return pdfPath;
    } catch (error) {
      console.error('Erro ao gerar o histórico do paciente:', error);
      throw error;
    }
  }
}

module.exports = PatientHistoryService;
