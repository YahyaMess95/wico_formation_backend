const jwt = require("jsonwebtoken");
const adminModel = require("../src/Models/adminModel");
const logger = require("../config/logger");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    logger.info("token : " + token);
    const decoded = jwt.verify(token, "admin");
    logger.info("decoded : " + decoded);
    const admin = await adminModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    logger.info(admin);
    if (!admin) {
      throw new Error();
    }
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.error("Token expired:", error.message);
      // Handle token expiration error
      res.status(401).json({ success: false, error: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      logger.error("Invalid token:", error.message);
      // Handle other JWT-related errors
      res.status(401).json({ success: false, error: "Invalid token" });
    } else {
      // Handle other unexpected errors
      logger.error("Unexpected error:", error.message);
      res.status(500).json({ success: false, error: "Please Auth" });
    }
  }
};

module.exports = auth;
