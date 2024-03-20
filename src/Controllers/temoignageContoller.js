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
      { name: "file", maxCount: 1 },
      { name: "cvfile", maxCount: 1 },
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

        // Find the file ID in req.savedFileIDs
        const photoFilePath = req.savedFileIDs.find(
          (file) => file.fieldname === "file"
        );
        const cvFilePath = req.savedFileIDs.find(
          (file) => file.fieldname === "cvfile"
        );

        // Ensure file is found
        if (!photoFilePath && !cvFilePath) {
          return res.status(400).json({
            success: false,
            error: "Bad Request",
            message: "Le fichier téléchargé est introuvable.",
          });
        }

        // Process temoignage details
        const temoignageDetails = req.body;
        if (photoFilePath) {
          temoignageDetails.photo = photoFilePath.id;
        }
        if (cvFilePath) {
          temoignageDetails.cv = cvFilePath.id;
        }

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
    multerConfig.fields([
      { name: "file", maxCount: 1 },
      { name: "cvfile", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({
          success: false,
          error: "Bad Request",
          message: "Failed to upload files",
        });
      }

      if (!req.files["file"] && !req.files["cvfile"]) {
        // No file uploaded, proceed with updating user details
        const temoignageDetails = req.body;
        const result = await temoignageService.updateTemoignageDBService(
          temoignageDetails._id,
          temoignageDetails
        );

        // Send success response
        return res.status(200).json({
          success: true,
          temoignage: result,
          message: "Temoignage updated successfully",
        });
      }

      // Handle file upload successful, proceed to save file information to the database
      await saveFileToDatabase(req, res, async (error) => {
        if (error) {
          console.error("Save file to database error:", error.message);
          return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: "An error occurred while saving files to the database.",
          });
        }

        const photoFilePath = req.savedFileIDs.find(
          (file) => file.fieldname === "file"
        );
        const cvFilePath = req.savedFileIDs.find(
          (file) => file.fieldname === "cvfile"
        );

        // Ensure file is found
        if (!photoFilePath && !cvFilePath) {
          return res.status(400).json({
            success: false,
            error: "Bad Request",
            message: "Le fichier téléchargé est introuvable.",
          });
        }

        // Process testimonial details
        const temoignageDetails = req.body;

        if (photoFilePath) {
          temoignageDetails.photo = photoFilePath.id;
        }
        if (cvFilePath) {
          temoignageDetails.cv = cvFilePath.id;
        }

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
