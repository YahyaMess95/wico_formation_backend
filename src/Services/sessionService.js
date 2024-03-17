const sessionModel = require("../Models/sessionModel");
const logger = require("../../config/logger");
const mongoose = require("mongoose");

module.exports.getSessionFromDBService = async (page, pageSize) => {
  if (page != 0 && pageSize != 0) {
    const skip = (page - 1) * pageSize;

    try {
      const totalCount = await sessionModel.countDocuments();
      const results = await sessionModel
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);
      return { results, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  } else {
    return sessionModel
      .find({})
      .then((results) => {
        logger.info("Query results:", results);
        return results;
      })
      .catch((error) => {
        logger.error("Error Get Session:", error);
        throw new Error(error);
      });
  }
};

module.exports.createSessionDBService = async (SessionDetails) => {
  try {
    const sessionModelData = new sessionModel();

    if (
      SessionDetails.formations !== "null" &&
      SessionDetails.formations &&
      SessionDetails.seances !== "null" &&
      SessionDetails.seances
    ) {
      if (
        typeof SessionDetails.formations === "string" &&
        typeof SessionDetails.seances === "string"
      ) {
        SessionDetails.formations = SessionDetails.formations.split(",");
        SessionDetails.seances = SessionDetails.seances.split(",");
      }
      SessionDetails.formations = SessionDetails.formations.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      SessionDetails.seances = SessionDetails.seances.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    } else {
      SessionDetails.formations = [];
      SessionDetails.seances = [];
    }

    Object.assign(sessionModelData, SessionDetails);

    const savedInstance = await sessionModelData.save();
    logger.info("Session saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving Session:", error);
    throw new Error(error);
  }
};

module.exports.updateSessioDBService = async (id, sessionDetails) => {
  try {
    const session = await sessionModel.findById(id);

    if (!session) {
      throw new Error("Session not found");
    }

    if (
      sessionDetails.formations !== "null" &&
      sessionDetails.formations &&
      sessionDetails.seances !== "null" &&
      sessionDetails.seances
    ) {
      if (
        typeof sessionDetails.formations === "string" &&
        typeof sessionDetails.seances === "string"
      ) {
        sessionDetails.formations = sessionDetails.formations.split(",");
        sessionDetails.seances = sessionDetails.seances.split(",");
      }
      sessionDetails.formations = sessionDetails.formations.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      sessionDetails.seances = sessionDetails.seances.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    } else {
      sessionDetails.formations = [];
      sessionDetails.seances = [];
    }

    Object.assign(session, sessionDetails);
    const updatedSession = await session.save();

    logger.info("Session saved successfully:", updatedSession);
    return updatedSession;
  } catch (error) {
    logger.error("Error saving Session:", error);
    throw new Error(error);
  }
};

module.exports.removeSessionDBService = (id) => {
  return sessionModel
    .findByIdAndDelete(id)
    .then((DeletedInstance) => {
      if (!DeletedInstance) {
        throw new Error("Session not found");
      }
      logger.info("Session Deleted successfully:", DeletedInstance);
      return DeletedInstance;
    })
    .catch((error) => {
      logger.error("Error saving Session:", error);
      throw new Error(error);
    });
};
