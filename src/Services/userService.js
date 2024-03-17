const userModel = require("../Models/userModel");
const logger = require("../../config/logger");
const mongoose = require("mongoose");

module.exports.loginuserDBService = (userDetails) => {
  return userModel
    .findbyCredentials(userDetails.login, userDetails.password)
    .then(async (results) => {
      let token = "";
      if (
        results.tokens.length === 0 ||
        results.tokens[0].tokenExpDate < new Date()
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
    if (userDetails.sessions !== "null" && userDetails.sessions) {
      if (typeof userDetails.sessions === "string") {
        userDetails.sessions = userDetails.sessions.split(",");
      }
      userDetails.sessions = userDetails.sessions.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    } else {
      userDetails.sessions = [];
    }

    Object.assign(userModelData, userDetails);

    const savedInstance = await userModelData.save();
    logger.info("Document saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving document:", error);
    throw new Error(error);
  }
};

module.exports.updateUserDBService = async (userId, updatedDetails) => {
  try {
    // Fetch the user document by userId
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (updatedDetails.sessions !== "null" && updatedDetails.sessions) {
      if (typeof updatedDetails.sessions === "string") {
        updatedDetails.sessions = updatedDetails.sessions.split(",");
      }
      updatedDetails.sessions = updatedDetails.sessions.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    } else {
      updatedDetails.sessions = [];
    }

    Object.assign(user, updatedDetails);

    // Save the updated user document
    const updatedUser = await user.save();

    logger.info("Document updated successfully:", updatedUser);
    return updatedUser;
  } catch (error) {
    logger.error("Error updating document:", error);
    throw new Error(error);
  }
};

module.exports.updatePasswordDBService = async (email) => {
  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate a random password
    const randomPassword = generateRandomPassword();

    // Update user's password

    user.password = randomPassword;

    // Save the updated user
    await user.save();
    console.log(randomPassword);
    console.log(user);
    // Return the generated random password
    return {
      login: user.login,
      randomPassword: randomPassword,
    };
  } catch (error) {
    throw new Error(error.message);
  }
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

function generateRandomPassword() {
  const randomString = Math.random().toString(36).slice(-8);
  return randomString;
}
