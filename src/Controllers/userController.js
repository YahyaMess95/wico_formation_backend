const userService = require("../Services/userService");
const logger = require("../../config/logger");
const { saveFileToDatabase } = require("../../middleware/upload");
const multerConfig = require("../../middleware/multerConfig");

var loginuserControllerfn = async (req, res) => {
  try {
    const userDetails = req.body;

    const result = await userService.loginuserDBService(userDetails);

    res.status(200).json({
      success: true,
      user: result,
      message: "User login successfully",
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

var recoverControllerfn = async (req, res) => {
  try {
    const email = req.body.email;

    const result = await userService.updatePasswordDBService(email);

    res.status(200).json({
      success: true,
      user: result,
      message: "Password updated successfully",
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

const getDataConntrollerfn = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const users = await userService.getDataFromDBService(page, pageSize);

    res.status(200).json({ success: true, users: users });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

var getoneUserConntrollerfn = async (req, res) => {
  try {
    var User = await userService.getoneUserFromDBService(req.params.token);

    res.status(200).json({ success: true, user: User });
  } catch (error) {
    logger.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message: error.message,
    });
  }
};

const createUserControllerfn = async (req, res, next) => {
  try {
    // Handle file upload using multerConfig
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

          // Ensure req.savedFileIDs is defined and contains the required file
          if (!req.savedFileIDs || !req.savedFileIDs.length) {
            return res.status(400).json({
              success: false,
              error: "Bad Request",
              message: "Aucun fichier n'a été téléchargé ou enregistré.",
            });
          }

          // Find the file ID in req.savedFileIDs
          const file = req.savedFileIDs.find(
            (file) => file.fieldname === "file"
          );

          // Ensure file is found
          if (!file) {
            return res.status(400).json({
              success: false,
              error: "Bad Request",
              message: "Le fichier téléchargé est introuvable.",
            });
          }

          // Process user details
          const userDetails = req.body;

          if (file) {
            userDetails.photo = file.id;
          }
          // Create user in the database
          const result = await userService.createUserDBService(userDetails);

          // Send success response
          res.status(201).json({
            success: true,
            user: result,
            message: "Utilisateur créé avec succès",
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

const updateUserController = async (req, res, next) => {
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

        if (!req.files || !req.files["file"]) {
          // No file uploaded, proceed with updating user details
          const userDetails = req.body;
          const result = await userService.updateUserDBService(
            userDetails._id,
            userDetails
          );

          // Send success response
          return res.status(200).json({
            success: true,
            user: result,
            message: "User updated successfully",
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
          const result = await userService.updateUserDBService(
            userDetails._id,
            userDetails
          );

          // Send success response
          res.status(200).json({
            success: true,
            user: result,
            message: "User updated successfully",
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

var deleteUserController = async (req, res) => {
  try {
    const result = await userService.removeUserDBService(req.params.id);

    res
      .status(200)
      .json({ success: true, user: result, message: "User Deleteddd" });
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
  getoneUserConntrollerfn,
  recoverControllerfn,
  loginuserControllerfn,
  getDataConntrollerfn,
  createUserControllerfn,
  updateUserController,
  deleteUserController,
};
