const seanceService = require("../Services/seanceService");
const logger = require("../../config/logger");

var getSeanceConntrollerfn = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    var Seance = await seanceService.getSeanceFromDBService(page, pageSize);

    res.status(200).json({ success: true, seance: Seance });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

var getoneSeanceConntrollerfn = async (req, res) => {
  try {
    var Seance = await seanceService.getoneSeanceFromDBService(req.params.id);

    res.status(200).json({ success: true, seance: Seance });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

var createSeanceConntrollerfn = async (req, res) => {
  try {
    const SeanceDetails = req.body;
    const result = await seanceService.createSeanceDBService(SeanceDetails);

    res.status(200).json({
      success: true,
      seance: result,
      message: "Seance created successfully",
    });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

var updateSeanceConntrollerfn = async (req, res) => {
  try {
    const SeanceDetails = req.body;
    const result = await seanceService.updateSeanceDBService(
      req.params.id,
      SeanceDetails
    );

    res.status(200).json({
      success: true,
      seance: result,
      message: "Seance Updateeeedddddd",
    });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

var removeSeanceConntrollerfn = async (req, res) => {
  try {
    const result = await seanceService.removeSeanceDBService(req.params.id);

    res
      .status(200)
      .json({ success: true, seance: result, message: "Seance Deleteddd" });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

module.exports = {
  getSeanceConntrollerfn,
  getoneSeanceConntrollerfn,
  createSeanceConntrollerfn,
  updateSeanceConntrollerfn,
  removeSeanceConntrollerfn,
};
