const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();

var storage = new GridFsStorage({
  url: process.env.DB_URL,
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;

      return filename;
    }

    return {
      bucketName: "Sources",
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage: storage }).single("file");

var uploadFilesMiddleware = (req, res) => {
  return new Promise((resolve, reject) => {
    uploadFiles(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(req.file.filename);
      }
    });
  });
};

module.exports = uploadFilesMiddleware;
