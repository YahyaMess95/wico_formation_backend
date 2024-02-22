const adminModel = require("../Models/adminModel");
const logger = require("../../config/logger");

module.exports.loginadminDBService = (adminDetails) => {
  return adminModel
    .findbyCredentials(adminDetails.name, adminDetails.password)
    .then(async (results) => {
      let token = "";
      if (
        results.tokens[0].tokenExpDate < new Date() ||
        results.tokens.length === 0
      ) {
        token = await results.generateAuthToken();
      } else {
        token = results.tokens[0].token;
      }

      logger.info("Query results: " + token);
      return { results, token };
    })
    .catch((error) => {
      logger.error("Error executing query:", error);
      throw new Error(error);
    });
};

module.exports.createAdminDBService = async (adminDetails) => {
  const adminModelData = new adminModel();

  adminModelData.name = adminDetails.name;
  adminModelData.password = adminDetails.password;

  try {
    const savedInstance = await adminModelData.save();
    logger.info("Document saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving document:", error);
    throw new Error(error);
  }
};
