const File = require("../src/Models/fileModel");
const fs = require("fs");
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function saveFileToDatabase(req, res, next) {
  try {
    req.savedFileIDs = [];

    if (!req.files) {
      return next();
    }

    let existingPhotoRecord = null;
    if (req.body.photo && isValidObjectId(req.body.photo)) {
      existingPhotoRecord = await File.findById(req.body.photo);
    }

    let existingCVRecord = null;
    if (req.body.cv && isValidObjectId(req.body.cv)) {
      existingCVRecord = await File.findById(req.body.cv);
    }

    // Iterate over each uploaded file
    for (const fileField of Object.keys(req.files)) {
      const files = req.files[fileField];

      for (const file of files) {
        let existingFileRecord = null;

        if (fileField === "file" && existingPhotoRecord) {
          existingFileRecord = existingPhotoRecord;
        } else if (fileField === "cvfile" && existingCVRecord) {
          existingFileRecord = existingCVRecord;
        }

        if (existingFileRecord) {
          if (existingFileRecord._id.toString() !== req.body[fileField]) {
            if (fs.existsSync(existingFileRecord.path)) {
              fs.unlinkSync(existingFileRecord.path);
            }
          }

          existingFileRecord.filename = file.filename;
          existingFileRecord.path = file.path;
          existingFileRecord.size = file.size;
          existingFileRecord.contentType = file.mimetype;
          await existingFileRecord.save();
          req.savedFileIDs.push({
            fieldname: fileField,
            id: existingFileRecord._id,
          });
        } else {
          const fileRecord = new File({
            filename: file.filename,
            path: file.path,
            size: file.size,
            contentType: file.mimetype,
          });
          const savedFile = await fileRecord.save();
          req.savedFileIDs.push({ fieldname: fileField, id: savedFile._id });
        }
      }
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Erreur Interne du Serveur",
      message:
        "Une erreur s'est produite lors de la sauvegarde du fichier dans la base de données.",
    });
  }
}

module.exports = { saveFileToDatabase };
