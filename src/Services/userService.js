const userModel = require("../Models/userModel");
const logger = require("../../config/logger");
const mongoose = require("../../Db/connection");

module.exports.loginuserDBService = (userDetails) => {
  return userModel
    .findbyCredentials(userDetails.name, userDetails.password)
    .then(async (results) => {
      let token = "";
      if (
        results.tokens.tokenExpDate === new Date() ||
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

module.exports.getDataFromDBService = () => {
  return userModel
    .find({})
    .then((results) => {
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      logger.info("Query results:", results);
      return results;
    })
    .catch((error) => {
      logger.error("Error executing query:", error);
      throw new Error(error);
    });
};

module.exports.createUserDBService = async (userDetails) => {
  try {
    const userModelData = new userModel();
    Object.assign(userModelData, userDetails);
    const savedInstance = await userModelData.save();
    logger.info("Document saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving document:", error);
    throw new Error(error);
  }
};

const isIdAlreadyAdded = (Array, Id) => {
  return Array.includes(Id);
};

module.exports.updateUserDBService = (id, userDetails) => {
  logger.info(userDetails);

  return userModel
    .findById(id)
    .then((user) => {
      if (!user) {
        throw new Error("Document not found");
      }

      Object.keys(userDetails).forEach((key) => {
        if (userDetails[key] !== undefined) {
          user[key] = userDetails[key];
        }
      });

      if (userDetails.sessions && Array.isArray(userDetails.sessions)) {
        userDetails.sessions.forEach((sessionId) => {
          if (!user.sessions.includes(sessionId)) {
            user.sessions.push(sessionId);
          }
        });
      }

      return user.save();
    })
    .then((updatedUser) => {
      logger.info("Document saved successfully:", updatedUser);
      return updatedUser;
    })
    .catch((error) => {
      logger.error("Error saving document:", error);
      throw new Error(error);
    });
};
module.exports.removeUserDBService = (id) => {
  return userModel
    .findByIdAndDelete(id)
    .then((DeletedInstance) => {
      if (!DeletedInstance) {
        throw new Error("Document not found");
      }
      logger.info("Document Deleted successfully:", DeletedInstance);
      return DeletedInstance;
    })
    .catch((error) => {
      logger.error("Error removing document:", error);
      throw new Error(error);
    });
};
