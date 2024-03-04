const userService = require("../Services/userService");
const logger = require("../../config/logger");
const upload = require("../../middleware/upload");

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
    var user = await userService.getDataFromDBService();

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

const createUserControllerfn = async (req, res, next) => {
  try {
    const filename = await upload(req, res);

    if (!filename) {
      return res.status(400).json({ message: "You must select a file." });
    }
    const userDetails = req.body;
    userDetails.photo = filename;

    console.log("User details:", userDetails);

    // Create user in the database
    const result = await userService.createUserDBService(userDetails);

    // Send success response
    res.status(201).json({
      success: true,
      user: result,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

var updateUserController = async (req, res) => {
  try {
    console.log("body", req.body);

    if (req.file) {
      console.log("File received:", req.file.originalname);
      // Handle file processing or storage here
    } else {
      console.log("No file received.");
    }

    if (req.file !== undefined) {
      const filename = await upload(req, res);

      if (!filename) {
        return res.status(400).json({ message: "You must select a file." });
      }
      userDetails.photo = filename;
    } else {
      // return res.status(400).json({ message: "File is undefined" });
    }

    const userDetails = req.body;

    const result = await userService.updateUserDBService(
      req.params.id,
      userDetails
    );

    res
      .status(200)
      .json({ success: true, user: result, message: "User Updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

var deleteUserController = async (req, res) => {
  try {
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
