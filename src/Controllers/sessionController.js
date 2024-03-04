const sessionService = require("../Services/sessionService");
const logger = require("../../config/logger");
const upload = require("../../middleware/upload");

var getSessionConntrollerfn = async (req, res) => {
  try {
    var Session = await sessionService.getSessionFromDBService();

    res.status(200).json({ success: true, session: Session });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

var createSessionConntrollerfn = async (req, res) => {
  try {
    const filename = await upload(req, res);

    if (!filename) {
      return res.status(400).json({ message: "You must select a file." });
    }

    const SessionDetails = req.body;

    SessionDetails.photo = filename;

    const resultRession = await sessionService.createSessionDBService(
      SessionDetails
    );

    res.status(200).json({
      success: true,
      session: resultRession,
      message: "Session created successfully",
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

var updateSessionConntrollerfn = async (req, res) => {
  try {
    const SessionDetails = req.body;
    const result = await sessionService.updateSessioDBService(
      req.params.id,
      SessionDetails
    );

    res.status(200).json({
      success: true,
      session: result,
      message: "Session Updateeeedddddd",
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

var removeSessionConntrollerfn = async (req, res) => {
  try {
    const result = await sessionService.removeSessionDBService(req.params.id);

    res
      .status(200)
      .json({ success: true, session: result, message: "Session Deleteddd" });
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
  getSessionConntrollerfn,
  createSessionConntrollerfn,
  updateSessionConntrollerfn,
  removeSessionConntrollerfn,
};
