const photoService = require("../Services/photoService");
const logger = require("../../config/logger");

const getPhoto = async (req, res) => {
  try {
    const absolutePhotoPath = await photoService.getPhoto(req, res);
    // Send the photo file

    if (!absolutePhotoPath) {
      return res.status(404).json({ success: false, error: "File not found" });
    }
    res.sendFile(absolutePhotoPath);
    // res.status(200).json({ success: true, users: absolutePhotoPath });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

const updatePhotoController = async (req, res, next) => {
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

        // If file is uploaded, proceed with saving file to database
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

          if (!file) {
            return res.status(400).json({
              success: false,
              error: "Bad Request",
              message: "Le fichier téléchargé est introuvable.",
            });
          }

          const userDetails = req.body;
          if (file) {
            userDetails.photo = file.id;
          }
          console.log(userDetails._id);
          const result = await photoService.updatePhotoDBService(
            userDetails._id,
            userDetails
          );

          // Send success response
          res.status(200).json({
            success: true,
            user: result.photo,
            message: "Photo updated successfully",
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

module.exports = {
  updatePhotoController,
  getPhoto,
};
