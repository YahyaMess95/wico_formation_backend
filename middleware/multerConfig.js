const multer = require("multer");
const fs = require("fs");

// Function to create destination folder if it doesn't exist
const createDestinationFolder = (destination) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file) {
      const destinationFolder = "./uploads";
      createDestinationFolder(destinationFolder);
      cb(null, destinationFolder);
    } else {
      // If no file exists, continue without doing anything
      cb(null, "./temp"); // Provide a temporary destination
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const multerConfig = multer({ storage: storage });

module.exports = multerConfig;
