const temoignageService = require("../Services/temoignageService");
const logger = require("../../config/logger");
const { saveFileToDatabase } = require("../../middleware/upload");
const multerConfig = require("../../middleware/multerConfig");

var getTemoignageConntrollerfn = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    var temoignage = await temoignageService.getTemoignageFromDBService(
      page,
      pageSize
    );

    res.status(200).json({ success: true, temoignage: temoignage });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

const createTemoignageConntrollerfn = async (req, res, next) => {
  try {
    // Handle file upload using multerConfig
    multerConfig.fields([
      { name: "photo", maxCount: 1 },
      { name: "cv", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({
          success: false,
          error: "Bad Request",
          message: "Échec du téléchargement des fichiers",
        });
      }

      // If file upload successful, proceed to save file information to the database using saveFileToDatabase
      await saveFileToDatabase(req, res, async (error) => {
        if (error) {
          console.error("Save file to database error:", error.message);
          return res.status(500).json({
            success: false,
            error: "Erreur Interne du Serveur",
            message:
              "Une erreur s'est produite lors de la sauvegarde des fichiers dans la base de données.",
          });
        }

        // Retrieve saved file paths from the request object
        const photoFilePath = req.files["photo"][0].path;
        const cvFilePath = req.files["cv"][0].path;

        // Process temoignage details
        const temoignageDetails = req.body;
        temoignageDetails.photo = photoFilePath;
        temoignageDetails.cv = cvFilePath;

        console.log("Temoignage details:", temoignageDetails);

        // Create temoignage in the database
        const result = await temoignageService.createTemoignageDBService(
          temoignageDetails
        );

        // Send success response
        res.status(200).json({
          success: true,
          temoignage: result,
          message: "Témoignage ajouté",
        });
      });
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

const updateTemoignageConntrollerfn = async (req, res) => {
  console.log(req.body);
  try {
    // Handle file upload using multerConfig
    multerConfig.fields([
      { name: "photo", maxCount: 1 },
      { name: "cv", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({
          success: false,
          error: "Bad Request",
          message: "Échec du téléchargement des fichiers",
        });
      }

      // If file upload successful, proceed to save file information to the database using saveFileToDatabase
      await saveFileToDatabase(req, res, async (error) => {
        if (error) {
          console.error("Save file to database error:", error.message);
          return res.status(500).json({
            success: false,
            error: "Erreur Interne du Serveur",
            message:
              "Une erreur s'est produite lors de la sauvegarde des fichiers dans la base de données.",
          });
        }

        // Retrieve saved file paths from the request object
        const photoFilePath = req.files["photo"]
          ? req.files["photo"][0].path
          : undefined;
        const cvFilePath = req.files["cv"]
          ? req.files["cv"][0].path
          : undefined;

        // Process testimonial details
        const temoignageDetails = req.body;

        if (photoFilePath) {
          temoignageDetails.photo = photoFilePath;
        }
        if (cvFilePath) {
          temoignageDetails.cv = cvFilePath;
        }

        console.log("Temoignage details:", temoignageDetails);

        // Update testimonial in the database
        const result = await temoignageService.updateTemoignageDBService(
          temoignageDetails._id,
          temoignageDetails
        );

        // Send success response
        res.status(200).json({
          success: true,
          temoignage: result,
          message: "Témoignage mis à jour",
        });
      });
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
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
      error: "Erreur Interne du Serveur",
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
