const Patient = require("../models/patient");
const User = require("../models/user");

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullName', 'email', 'userName', 'cpf', 'dataNasc', 'gender', 'phone', 'street', 'number', 'complement', 'district', 'city', 'state', 'cep'],
          where: { role: 'Paciente' }
        },
      ],
    });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients.", error: error.message });
  }
};

// Get patient by id
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { id_patient: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullName', 'email', 'userName', 'cpf', 'dataNasc', 'gender', 'phone', 'street', 'number', 'complement', 'district', 'city', 'state', 'cep'],
          where: { role: 'Paciente' }
        },
      ],
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Error fetching patient.", error: error.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { userName, email, weigth_ini, height_ini } = req.body;

    // Create a new user with the role 'Paciente'
    const user = await User.create({
      userName,
      email,
      role: "Paciente",
    });

    // Create a patient record associated with the user
    const patient = await Patient.create({
      user_id: user.id_user,
      weigth_ini,
      height_ini,
    });

    res.status(201).json({ message: "Patient created successfully!", patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating patient.", error });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { userName, email, weigth_ini, height_ini } = req.body;
    const patientId = req.params.id;

    const patient = await Patient.findByPk(patientId, {
      include: [{ model: User, as: 'user' }],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Update associated user and patient records
    await patient.user.update({ userName, email });
    await patient.update({ weigth_ini, height_ini });

    res.json({ message: "Patient updated successfully!", patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating patient." });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Delete the associated user
    await User.destroy({ where: { id_user: patient.user_id } });

    // Delete the patient record
    await patient.destroy();

    res.json({ message: "Patient deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting patient.", error });
  }
};
