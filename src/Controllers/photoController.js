const mongoose = require("../../Db/connection");
const { GridFSBucket } = require("mongodb"); // Destructure GridFSBucket from mongodb

// Function to fetch photo by name
exports.getPhotoByName = async (req, res) => {
  try {
    const db = mongoose.connection.db; // Access the MongoDB database from the mongoose connection
    const bucket = new GridFSBucket(db, {
      // Use db instead of mongoose
      bucketName: "Sources",
    });
    const photoName = req.params.photoName;

    let downloadStream = bucket.openDownloadStreamByName(photoName);
    downloadStream.on("data", function (data) {
      return res.write(data); // Removed status(200)
    });
    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });
    downloadStream.on("end", () => {
      return res.end(); // End the response stream
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
