const adminService = require("../Services/adminService");
const logger = require("../../config/logger");

var loginadminControllerfn = async (req, res) => {
  try {
    const adminDetails = req.body;

    const result = await adminService.loginadminDBService(adminDetails);

    res.status(200).json({
      success: true,
      admin: result,
      message: "Admin login successfully",
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
var registeradminControllerfn = async (req, res) => {
  try {
    const adminDetails = req.body;
    const result = await adminService.createAdminDBService(adminDetails);

    res.status(200).json({
      success: true,
      admin: result,
      message: "Admin created successfully",
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

module.exports = {
  loginadminControllerfn,
  registeradminControllerfn,
};
