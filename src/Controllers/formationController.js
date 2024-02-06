const formationService = require("../Services/formationService");
const logger = require("../../config/logger");

var getFormationConntrollerfn = async (req, res) => {
  try {
    var Formation = await formationService.getDataFromDBService();

    res.status(200).json({ success: true, Formation: Formation });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

var createFormationConntrollerfn = async (req, res) => {
  try {
    const FormationDetails = req.body;

    const resultformation = await formationService.createFormationDBService(
      FormationDetails
    );

    res.status(200).json({
      success: true,
      formation: resultformation,
      message: "Formation created successfully",
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

var updateFormationConntrollerfn = async (req, res) => {
  try {
    logger.info(req.params.id);
    logger.info(req.body);
    const FormationDetails = req.body;
    const result = await formationService.updateFormationDBService(
      req.params.id,
      FormationDetails
    );

    res.status(200).json({
      success: true,
      formation: result,
      message: "Formation Updateeeedddddd",
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

var removeFormationConntrollerfn = async (req, res) => {
  try {
    logger.info(req.params.id);

    const result = await formationService.removeFormationDBService(
      req.params.id
    );

    res.status(200).json({
      success: true,
      formation: result,
      message: "Formation Deleteddd",
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
  getFormationConntrollerfn,
  createFormationConntrollerfn,
  updateFormationConntrollerfn,
  removeFormationConntrollerfn,
};
