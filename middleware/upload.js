const File = require("../src/Models/fileModel");

async function saveFileToDatabase(req, res, next) {
  try {
    if (!req.file) {
      // If there's no file in the request, move to the next middleware
      return next();
    }
    const { filename, path, size, mimetype } = req.file;

    const fileRecord = new File({
      filename,
      path,
      size,
      contentType: mimetype,
    });
    const savedFile = await fileRecord.save(); // Save the file record to the database

    req.savedFilePath = savedFile.path; // Assign the saved file path to the request object

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while uploading the file.");
  }
}

module.exports = { saveFileToDatabase };
