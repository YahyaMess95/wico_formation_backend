const analyseService = require("../Services/analyseService");

var getCountControllerfn = async (req, res) => {
  try {
    const { year } = req.query;
    const result = await analyseService.getCountDBService(year);

    res.status(200).json({
      success: true,
      result: result,
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

module.exports = {
  getCountControllerfn,
};
