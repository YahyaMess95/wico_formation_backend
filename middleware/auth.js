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
      throw new Error();
    }
    req.user = user;
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
