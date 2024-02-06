const contenuService = require("../Services/contenuService");
const logger = require("../../config/logger");

var getContenuConntrollerfn = async (req, res) => {
  try {
    var Contenu = await contenuService.getContenuFromDBService();

    res.status(200).json({ success: true, Contenu: Contenu });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

var createContenuConntrollerfn = async (req, res) => {
  try {
    const ContenuDetails = req.body;
    const result = await contenuService.createContenuDBService(ContenuDetails);

    res.status(200).json({
      success: true,
      contenu: result,
      message: "Contenu created successfully",
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

var updateContenuConntrollerfn = async (req, res) => {
  try {
    logger.info(req.params.id);
    logger.info(req.body);
    const ContenuDetails = req.body;
    const result = await contenuService.updateContenuDBService(
      req.params.id,
      ContenuDetails
    );

    res.status(200).json({
      success: true,
      contenu: result,
      message: "Contenu Updateeeedddddd",
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

var removeContenuConntrollerfn = async (req, res) => {
  try {
    logger.info(req.params.id);

    const result = await contenuService.removeContenuDBService(req.params.id);

    res
      .status(200)
      .json({ success: true, contenu: result, message: "Contenu Deleteddd" });
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
  getContenuConntrollerfn,
  createContenuConntrollerfn,
  updateContenuConntrollerfn,
  removeContenuConntrollerfn,
};
