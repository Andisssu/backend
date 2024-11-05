const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');

// CRUD Routes /pacientes
router.get('/', PatientController.getAllPatients); // GET /pacientes
router.get('/:id', PatientController.getPatientById); // GET /pacientes/:id
router.post('/', PatientController.createPatient); // POST /pacientes
router.put('/:id', PatientController.updatePatient); // PUT /pacientes/:id
router.delete('/:id', PatientController.deletePatient); // DELETE /pacientes/:id

module.exports = router;
