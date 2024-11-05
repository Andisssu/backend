const express = require("express");
const router = express.Router();
const ProfessionalController = require("../controllers/professionalController");

// CRUD Routes /professionals
router.get("/", ProfessionalController.getAllProfessionals); // GET /professionals
router.get("/:id", ProfessionalController.getProfessionalById); // GET /professionals/:id
router.post("/", ProfessionalController.createProfessional); // POST /professionals
router.put("/:id", ProfessionalController.updateProfessional); // PUT /professionals/:id
router.delete("/:id", ProfessionalController.deleteProfessional); // DELETE /professionals/:id

module.exports = router;