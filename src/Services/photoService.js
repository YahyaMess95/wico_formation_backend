const path = require("path");
const File = require("../Models/fileModel");

module.exports.getPhoto = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    // Check the database for the file record
    const fileRecord = await File.findById(fileId);

    if (!fileRecord) {
      return res.status(404).send("File not found");
    }
    // Retrieve the filename from the file record
    const filename = fileRecord.filename;

    // Construct the absolute path to the photo file
    const absolutePhotoPath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      filename
    );

    // Return the absolute path to the photo file
    return absolutePhotoPath;
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving the photo.");
  }
};
