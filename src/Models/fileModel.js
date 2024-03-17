const mongoose = require("../../Db/connection");

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  contentType: String,
});

module.exports = mongoose.model("File", fileSchema);
