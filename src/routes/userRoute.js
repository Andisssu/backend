const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authenticateUser = require("../middlewares/authMiddleware");

// CRUD Routes /users

router.get("/", UserController.getAllUsers); // GET /users
router.get("/:id", UserController.getUserById); // GET /users/:id
router.post("/", authenticateUser, UserController.createUser); // POST /users
router.post("/login", UserController.loginUser, cors(corsOptions)); // POST /users/login
router.put("/:id", authenticateUser, UserController.updateUser); // PUT /users/:id
router.delete("/:id", UserController.deleteUser); // DELETE /users/:id
router.post("/reset-password", UserController.resetPasswordRequest); // Ensure this route is correctly mapped
router.post("/reset-password-confirm", UserController.resetPassword);
app.get('/api/private', (req, res) => {
    res.json({ message: 'Rota privada' });
  });


module.exports = router;
