const temoignageService = require("../Services/temoignageService");
const logger = require("../../config/logger");
const upload = require("../../middleware/upload");

var getTemoignageConntrollerfn = async (req, res) => {
  try {
    var temoignage = await temoignageService.getTemoignageFromDBService();

    res.status(200).json({ success: true, temoignage: temoignage });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

const createTemoignageConntrollerfn = async (req, res, next) => {
  try {
    const filename = await upload(req, res);

    if (!filename) {
      return res.status(400).json({ message: "You must select a file." });
    }
    const temoignageDetails = req.body;
    temoignageDetails.photo = filename;
    temoignageDetails.session = temoignageDetails.sessions.map(
      (session) => new ObjectId(session)
    );
    const result = await temoignageService.createTemoignageDBService(
      temoignageDetails
    );

    res.status(200).json({
      success: true,
      temoignage: result,
      message: "Temoignage created successfully",
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

var updateTemoignageConntrollerfn = async (req, res) => {
  try {
    const filename = await upload(req, res);

    if (!filename) {
      return res.status(400).json({ message: "You must select a file." });
    }
    const temoignageDetails = req.body;
    temoignageDetails.photo = filename;

    const result = await temoignageService.updateTemoignageDBService(
      req.params.id,
      temoignageDetails
    );

    res.status(200).json({
      success: true,
      temoignage: result,
      message: "Temoignage Updateeeedddddd",
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

var removeTemoignageConntrollerfn = async (req, res) => {
  try {
    const result = await temoignageService.removeTemoignageDBService(
      req.params.id
    );

    res.status(200).json({
      success: true,
      temoignage: result,
      message: "Temoignage Deleteddd",
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
  getTemoignageConntrollerfn,
  createTemoignageConntrollerfn,
  updateTemoignageConntrollerfn,
  removeTemoignageConntrollerfn,
};
