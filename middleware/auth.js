const jwt = require("jsonwebtoken");
const userModel = require("../src/Models/userModel");
const logger = require("../config/logger");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, "user");

    const user = await userModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Veuillez vous authentifier",
        message: "Veuillez vous authentifier",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.error("Token expiré :", error.message);
      // Gérer l'erreur d'expiration du jeton
      res.status(401).json({
        success: false,
        error: "Veuillez vous authentifier",
        message: "Le jeton a expiré",
      });
    } else if (error.name === "JsonWebTokenError") {
      logger.error("Jeton invalide :", error.message);
      // Gérer les autres erreurs liées au JWT
      res.status(401).json({
        success: false,
        error: "Veuillez vous authentifier",
        message: "Jeton invalide",
      });
    } else {
      // Gérer d'autres erreurs inattendues
      logger.error("Erreur inattendue :", error.message);

      res.status(500).json({
        success: false,
        error: "Veuillez vous authentifier",
        message: "Veuillez vous authentifier",
      });
    }
  }
};

module.exports = auth;
