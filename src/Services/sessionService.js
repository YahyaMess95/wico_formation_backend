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

    if (SessionDetails.formations !== null || SessionDetails.seances !== null) {
      if (
        SessionDetails.formations !== null &&
        typeof SessionDetails.formations === "string"
      ) {
        SessionDetails.formations = SessionDetails.formations
          .split(",")
          .map((id) => {
            try {
              return new mongoose.Types.ObjectId(id.trim());
            } catch (error) {
              console.error("Invalid ObjectId encountered:", id);
              return null;
            }
          })
          .filter((id) => id !== null);
      } else {
        SessionDetails.formations = [];
      }

      if (
        SessionDetails.seances !== null &&
        typeof SessionDetails.seances === "string"
      ) {
        SessionDetails.seances = SessionDetails.seances
          .split(",")
          .map((id) => {
            try {
              return new mongoose.Types.ObjectId(id.trim());
            } catch (error) {
              console.error("Invalid ObjectId encountered:", id);
              return null;
            }
          })
          .filter((id) => id !== null);
      } else {
        SessionDetails.seances = [];
      }
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

    if (sessionDetails.formations !== null || sessionDetails.seances !== null) {
      if (
        sessionDetails.formations !== null &&
        typeof sessionDetails.formations === "string"
      ) {
        sessionDetails.formations = sessionDetails.formations
          .split(",")
          .map((id) => {
            try {
              return new mongoose.Types.ObjectId(id.trim());
            } catch (error) {
              console.error("Invalid ObjectId encountered:", id);
              return null;
            }
          })
          .filter((id) => id !== null);
      } else {
        sessionDetails.formations = [];
      }

      if (
        sessionDetails.seances !== null &&
        typeof sessionDetails.seances === "string"
      ) {
        sessionDetails.seances = sessionDetails.seances
          .split(",")
          .map((id) => {
            try {
              return new mongoose.Types.ObjectId(id.trim());
            } catch (error) {
              console.error("Invalid ObjectId encountered:", id);
              return null;
            }
          })
          .filter((id) => id !== null);
      } else {
        sessionDetails.seances = [];
      }
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
