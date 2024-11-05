const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

// CRUD Routes /assessments
router.get('/', assessmentController.getAllAssessments); // GET /assessments
router.get('/:id', assessmentController.getAssessmentById); // Corrigido para getAssessmentById
router.get('/patient/:id_patient', assessmentController.getAssessmentsByPatientId);
router.get('/patient/:id/history'), assessmentController.getPatientHistory;
router.post('/', assessmentController.createAssessment); // POST /assessments
router.put('/:id', assessmentController.updateAssessment); // PUT /assessments/:id
router.delete('/:id', assessmentController.deleteAssessment); // DELETE /assessments/:id


module.exports = router;