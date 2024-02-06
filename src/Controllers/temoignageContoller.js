const temoignageService = require("../Services/temoignageService");
const logger = require("../../config/logger");

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

var createTemoignageConntrollerfn = async (req, res) => {
  try {
    const temoignageDetails = req.body;
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
    logger.info(req.params.id);
    logger.info(req.body);
    const temoignageDetails = req.body;
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
    logger.info(req.params.id);

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
