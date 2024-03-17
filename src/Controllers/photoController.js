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

module.exports = {
  getPhoto,
};
