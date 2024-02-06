require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../config/logger");

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

// Create a Mongoose client with a MongoClientOptions object to set the Stable API version
mongoose.connect(process.env.DB_URL, clientOptions);

// Connection Events
try {
  mongoose.connection
    .on("open", () => {
      logger.info("Connected to MongoDB");
    })
    .on("close", () => {
      logger.info("Disconnected from MongoDB");
    })
    .on("error", (error) => {
      logger.error("MongoDB Error: ");
    });
} catch (error) {
  logger.error(error.message);
}

module.exports = mongoose;
