const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");
const Professional = require("../models/professional");

// routes/sample.js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a sample message
 *     tags: 
 *       - Usuários
 *     responses:
 *       200:
 *         description: A successful response
 */
exports.getAllUsers = async (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.status(200).json({ users: users });
    })
    .catch((err) => {
      res.status(500).send("Error -> " + err);
    });
};

//Get user by id
// routes/sample.js
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: 
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado
 */
exports.getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id_patient']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error -> " + err });
  }
};


// Create user and generate token
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cria um novo usuário e gera um token de autenticação
 *     tags: 
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               cpf:
 *                 type: string
 *               dataNasc:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               street:
 *                 type: string
 *               number:
 *                 type: number
 *               complement:
 *                 type: string
 *               district:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               cep:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Paciente, Profissional]
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Senhas não coincidem
 *       500:
 *         description: Erro na criação do usuário ou na criação do registro associado
 */

exports.createUser = async (req, res, next) => {
  const {
    fullName,
    cpf,
    dataNasc,
    gender,
    phone,
    email,
    street,
    number,
    complement,
    district,
    city,
    state,
    cep,
    role,
    userName,
    password,
    confirmPassword,
  } = req.body;
  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database with the hashed password
    const user = await User.create({
      fullName: fullName,
      cpf: cpf,
      dataNasc: dataNasc,
      gender: gender,
      phone: phone,
      email: email,
      street: street,
      number: number,
      complement: complement,
      district: district,
      city: city,
      state: state,
      cep: cep,
      role: role,
      userName: userName,
      password: hashedPassword,
    });

    // Try to create the associated record based on role
    try {
      if (role === "Paciente") {
        await Patient.create({ user_id: user.id_user });
      } else if (role === "Profissional") {
        await Professional.create({ user_id: user.id_user });
      }
    } catch (assocError) {
      // If there's an error creating the associated record, delete the user
      await user.destroy();
      return res.status(500).json({
        message: "Error creating associated record -> " + assocError,
      });
    }

    // Generate authentication token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET, // Secret key from .env file
      { expiresIn: "1h" } // Token expiration time
    );

    res.status(201).json({
      message: "User created successfully!",
      user: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user -> " + error,
    });
  }
};

//Login user
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: 
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao realizar login
 */

exports.loginUser = async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ where: { userName: userName } });

    if (!user) {
      return res.status(404).json({ 
        message: "User Not Found",
        data: {
          userName: userName,
        } 
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid credentials",
      });
    }

    // Generate authentication token
    const token = jwt.sign(
      { 
        userId: user.id_user, 
        fullName: user.fullName,
        role: user.role, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully!",
      data: {
        token,
        name: user.fullName,
        role: user.role,
        userId: user.id_user,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//Update user
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza as informações de um usuário
 *     tags: 
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar usuário
 */
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

    // Verifica se o usuário existe
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Repete campos obrigatorios que não foram atualizados
    const { cpf, email, userName } = user;
    // updatedUserData.cpf = cpf; //
    // updatedUserData.email = email;
    updatedUserData.userName = userName;

    // Verifica se a senha está no corpo da requisição e gera um hash
    if (updatedUserData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedUserData.password = await bcrypt.hash(
        updatedUserData.password,
        salt
      );
    }

    // Atualiza os dados do usuário
    Object.assign(user, updatedUserData);
    await user.save();

    res.status(200).json({
      message: "User updated successfully!",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user -> " + error,
    });
  }
};

//Delete user
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: 
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao deletar usuário
 */
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message: "User Not Found",
        });
      }
      return user.destroy({
        where: {
          id: userId,
        },
      });
    })
    .then(() => {
      res.status(200).json({
        message: "User deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error -> " + err,
      });
    });
};

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Solicita a redefinição de senha
 *     tags: 
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Instruções de redefinição enviadas por e-mail
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao solicitar redefinição de senha
 */
exports.resetPassword = async (req, res, next) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
      //  passwordResetExpires: {
     //     [Sequelize.Op.gt]: Date.now(), // Check for unexpired token
     //   },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword,   
 salt);

    // Update user password and clear reset token/expires fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordToken = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({   
 message: "Error resetting password"   
 });
  }
};

// reset password request
/**
 * @swagger
 * /users/reset-password-confirm:
 *   post:
 *     summary: Redefine a senha do usuário
 *     tags: 
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro ao redefinir senha
 */
exports.resetPasswordRequest = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Gerar token e definir data de expiração
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hora

    await user.save();

    // Configurar e enviar e-mail (o exemplo abaixo é apenas um esqueleto)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log("email:",process.env.EMAIL_USER, "senha:",process.env.EMAIL_PASS);
    // Captura a origem da requisição
    const origin = req.get('Origin');

    // Define a URL do frontend com base na origem

    let frontendUrl;
    if (origin.includes('localhost')) {
      frontendUrl = 'http://localhost:3001'; 
    } else if (origin.includes('avasoft-landingpage.netlify.app')) {
      frontendUrl = 'https://avasoft-landingpage.netlify.app';
    } else {
      frontendUrl = 'https://avasoft-landingpage.netlify.app';
    }

    const mailOptions = {
      to: email,
      from: 'avasoft8@gmail.com',
      subject: 'Redefinição de Senha - AVASOFT',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center;">
            <img src="https://live.staticflickr.com/65535/54130493071_89edec6c89_m.jpg" alt="AVASOFT Logo" style="width: 120px; margin-bottom: 20px;">
          </div>
          <h2 style="color: #FF8139; text-align: center;">Redefinição de Senha</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            Olá! Recebemos uma solicitação para redefinir sua senha no AVASOFT. Caso tenha solicitado essa alteração, clique no botão abaixo para redefinir sua senha:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${frontendUrl}/reset-password-confirm/${resetToken}" 
               style="display: inline-block; padding: 15px 25px; font-size: 16px; color: #fff; background-color: #FF8139; text-decoration: none; border-radius: 5px;">
              Redefinir Senha
            </a>
          </div>
          <p style="font-size: 14px; color: #777; line-height: 1.5;">
            Caso você não tenha solicitado a redefinição de senha, por favor, ignore este e-mail. Sua senha permanecerá inalterada.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <footer style="text-align: center; color: #777; font-size: 12px;">
            AVASOFT | Avaliação Antropométrica<br>
            Todos os direitos reservados &copy; 2024
          </footer>
        </div>
      `
  };
    

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset instructions sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error requesting password reset" });
  }
};

