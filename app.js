const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const userController = require('./src/controllers/userController');
const professionalController = require('./src/controllers/professionalController');
const patientController = require('./src/controllers/patientController');
const assessmentController = require('./src/controllers/assessmentController');
const { authenticateUser } = require("./src/middlewares/authMiddleware");


require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Define routes for users
app.post('/login', userController.loginUser);
app.post('/register', userController.createUser);
app.get('/users', authenticateUser,userController.getAllUsers);
app.get('/users/:id', userController.getUserById);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// Password reset routes
app.post('/reset-password', userController.resetPasswordRequest);
app.post('/reset-password-confirm', userController.resetPassword);

// Define routes for professionals
app.get('/professionals', professionalController.getAllProfessionals);
app.get('/professional/:id', professionalController.getProfessionalById);
app.post('/professional', professionalController.createProfessional);
app.put('/professional/:id', professionalController.updateProfessional);
app.delete('/professional/:id', professionalController.deleteProfessional);

// Define routes for patients
app.get('/patients', patientController.getAllPatients); 
app.get('/patient/:id', patientController.getPatientById); 
app.post('/patient', patientController.createPatient);
app.put('/patient/:id', patientController.updatePatient); 
app.delete('/patient/:id', patientController.deletePatient); 

// Define routes for assessments
app.get('/assessments', assessmentController.getAllAssessments);
app.get('/assessments/:id', assessmentController.getAssessmentById);
app.get('/assessments/patient/:id_patient', assessmentController.getAssessmentsByPatientId);
app.get('/assessments/patient/:id/history', assessmentController.getPatientHistory);
app.post('/assessments', assessmentController.createAssessment);
app.put('/assessments/:id', assessmentController.updateAssessment);
app.delete('/assessments/:id', assessmentController.deleteAssessment);

module.exports = app;