const File = require("../src/Models/fileModel");
const fs = require("fs");
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function saveFileToDatabase(req, res, next) {
  try {
    req.savedFileIDs = []; // Initialize req.savedFileIDs here

    if (!req.files) {
      // If there are no files in the request, move to the next middleware
      return next();
    }

    // Check if there's an existing record with the photo ID
    let existingPhotoRecord = null;
    if (req.body.photo && isValidObjectId(req.body.photo)) {
      existingPhotoRecord = await File.findById(req.body.photo);
    }

    // Check if there's an existing record with the cv ID
    let existingCVRecord = null;
    if (req.body.cv && isValidObjectId(req.body.cv)) {
      existingCVRecord = await File.findById(req.body.cv);
    }

    // Iterate over each uploaded file
    for (const fileField of Object.keys(req.files)) {
      const files = req.files[fileField]; // Get the array of files for the current field

      // Iterate over each file in the array
      for (const file of files) {
        let existingFileRecord = null;

        // Check if the current file field is "photo" and there's an existing photo record
        if (fileField === "file" && existingPhotoRecord) {
          existingFileRecord = existingPhotoRecord;
        }
        // Check if the current file field is "cv" and there's an existing cv record
        else if (fileField === "cvfile" && existingCVRecord) {
          existingFileRecord = existingCVRecord;
        }

        if (existingFileRecord) {
          // Delete the file of the previous record if it's different from the current field
          if (existingFileRecord._id.toString() !== req.body[fileField]) {
            fs.unlinkSync(existingFileRecord.path);
          }
          // Update the existing record with the new file information
          existingFileRecord.filename = file.filename;
          existingFileRecord.path = file.path;
          existingFileRecord.size = file.size;
          existingFileRecord.contentType = file.mimetype;
          await existingFileRecord.save(); // Save the updated record
          req.savedFileIDs.push({
            fieldname: fileField,
            id: existingFileRecord._id,
          }); // Assign the saved file ID to the request object
        } else {
          // If no existing record found or file ID is invalid, create a new one
          const fileRecord = new File({
            filename: file.filename,
            path: file.path,
            size: file.size,
            contentType: file.mimetype,
          });
          const savedFile = await fileRecord.save(); // Save the file record to the database
          req.savedFileIDs.push({ fieldname: fileField, id: savedFile._id }); // Assign the saved file ID to the request object
        }
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while uploading the files.");
  }
}

module.exports = { saveFileToDatabase };
