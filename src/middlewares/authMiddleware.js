const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = {
      userId: decodedToken.id_user,
      fullName: decodedToken.fullName,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};
