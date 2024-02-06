const userService = require("../Services/userService");
const logger = require("../../config/logger");

var loginuserControllerfn = async (req, res) => {
  try {
    const userDetails = req.body;
    const result = await userService.loginuserDBService(userDetails);

    res.status(200).json({
      success: true,
      user: result,
      message: "User login successfully",
    });
  } catch (error) {
    logger.error("Error:", error.message);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
var getDataConntrollerfn = async (req, res) => {
  try {
    var empolyee = await userService.getDataFromDBService();

    res.status(200).json({ success: true, user: empolyee });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

var createUserControllerfn = async (req, res) => {
  try {
    const userDetails = req.body;
    const result = await userService.createUserDBService(userDetails);

    res.status(200).json({
      success: true,
      user: result,
      message: "User created successfully",
    });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

var updateUserController = async (req, res) => {
  try {
    logger.info(req.params.id);
    logger.info(req.body);
    const userDetails = req.body;
    const result = await userService.updateUserDBService(
      req.params.id,
      userDetails
    );

    res
      .status(200)
      .json({ success: true, user: result, message: "User Updateeeedddddd" });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

var deleteUserController = async (req, res) => {
  try {
    logger.info(req.params.id);

    const result = await userService.removeUserDBService(req.params.id);

    res
      .status(200)
      .json({ success: true, user: result, message: "User Deleteddd" });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

module.exports = {
  loginuserControllerfn,
  getDataConntrollerfn,
  createUserControllerfn,
  updateUserController,
  deleteUserController,
};
