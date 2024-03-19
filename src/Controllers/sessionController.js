const sessionService = require("../Services/sessionService");
const logger = require("../../config/logger");
const { saveFileToDatabase } = require("../../middleware/upload");
const multerConfig = require("../../middleware/multerConfig");

var getSessionConntrollerfn = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    var Session = await sessionService.getSessionFromDBService(page, pageSize);

    res.status(200).json({ success: true, session: Session });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

const createSessionConntrollerfn = async (req, res, next) => {
  try {
    // Handle file upload
    multerConfig.fields([{ name: "file", maxCount: 1 }])(
      req,
      res,
      async (err) => {
        if (err) {
          console.error("Multer error:", err.message);
          return res.status(400).json({
            success: false,
            error: "Bad Request",
            message: "Échec du téléchargement du fichier",
          });
        }

        // If file upload successful, proceed to save file information to the database
        await saveFileToDatabase(req, res, async (error) => {
          if (error) {
            console.error("Save file to database error:", error.message);
            return res.status(500).json({
              success: false,
              error: "Erreur Interne du Serveur",
              message:
                "Une erreur s'est produite lors de la sauvegarde du fichier dans la base de données.",
            });
          }
          const file = req.savedFileIDs.find(
            (file) => file.fieldname === "file"
          );
          // Retrieve saved file path from the request object
          if (!file) {
            return res.status(400).json({
              success: false,
              error: "Bad Request",
              message: "Le fichier téléchargé est introuvable.",
            });
          }

          // Process user details
          const SessionDetails = req.body;
          if (file) {
            SessionDetails.photo = file.id;
          }

          console.log("User details:", SessionDetails);

          // Create user in the database
          const result = await sessionService.createSessionDBService(
            SessionDetails
          );

          // Send success response
          res.status(201).json({
            success: true,
            user: result,
            message: "Session created successfully",
          });
        });
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

var updateSessionConntrollerfn = async (req, res) => {
  try {
    multerConfig.fields([{ name: "file", maxCount: 1 }])(
      req,
      res,
      async (err) => {
        if (err) {
          console.error("Multer error:", err.message);
          return res.status(400).json({
            success: false,
            error: "Bad Request",
            message: "Échec du téléchargement du fichier",
          });
        }

        if (!req.files || !req.files["file"]) {
          // No file uploaded, proceed with updating user details
          const SessionDetails = req.body;
          const result = await sessionService.updateSessioDBService(
            SessionDetails._id,
            SessionDetails
          );

          // Send success response
          return res.status(200).json({
            success: true,
            user: result,
            message: "User updated successfully",
          });
        }

        await saveFileToDatabase(req, res, async (error) => {
          if (error) {
            console.error("Save file to database error:", error.message);
            return res.status(500).json({
              success: false,
              error: "Erreur Interne du Serveur",
              message:
                "Une erreur s'est produite lors de la sauvegarde du fichier dans la base de données.",
            });
          }

          const SessionDetails = req.body;

          if (req.file) {
            const filePath = req.savedFileIDs.find(
              (file) => file.fieldname === "file"
            ).id; // Find photo file ID
            SessionDetails.photo = filePath;
          }

          const result = await sessionService.updateSessioDBService(
            SessionDetails._id,
            SessionDetails
          );

          // Send success response
          res.status(200).json({
            success: true,
            session: result,
            message: "Session Updateeeedddddd",
          });
        });
      }
    );
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
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
      error: "Erreur Interne du Serveur",
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
