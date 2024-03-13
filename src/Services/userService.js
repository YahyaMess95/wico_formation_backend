const userModel = require("../Models/userModel");
const logger = require("../../config/logger");
const mongoose = require("mongoose");

module.exports.loginuserDBService = (userDetails) => {
  return userModel
    .findbyCredentials(userDetails.login, userDetails.password)
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

module.exports.getDataFromDBService = async (page, pageSize) => {
  const skip = (page - 1) * pageSize;

  try {
    const totalCount = await userModel.countDocuments();
    const results = await userModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
    return { users: results, totalCount };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.createUserDBService = async (userDetails) => {
  try {
    const userModelData = new userModel();
    userDetails.sessions = userDetails.sessions.split(",");

    userDetails.sessions = userDetails.sessions.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    Object.assign(userModelData, userDetails);

    const savedInstance = await userModelData.save();
    logger.info("Document saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving document:", error);
    throw new Error(error);
  }
};

module.exports.updateUserDBService = (id, userDetails) => {
  console.log("test", userDetails);
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
      return updatedUser;
    })
    .catch((error) => {
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
