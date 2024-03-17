const path = require("path");

module.exports.getPhoto = async (req, res) => {
  try {
    const filename = req.params.filename;

    // Construct the absolute path to the photo file
    const absolutePhotoPath = path.join(
      __dirname,
      "..",
      "..",
      "/uploads",
      filename
    );

    return absolutePhotoPath;
  } catch (error) {
    throw new Error(error.message);
  }
};
