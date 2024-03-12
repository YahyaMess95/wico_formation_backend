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

    // Split the formations and seances strings into arrays
    SessionDetails.formations = SessionDetails.formations.split(",");
    SessionDetails.seances = SessionDetails.seances.split(",");

    // Map over the arrays and convert string IDs to ObjectIds
    SessionDetails.formations = SessionDetails.formations.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    SessionDetails.seances = SessionDetails.seances.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    Object.assign(sessionModelData, SessionDetails);

    const savedInstance = await sessionModelData.save();
    logger.info("Session saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving Session:", error);
    throw new Error(error);
  }
};

module.exports.updateSessioDBService = (id, sessionDetails) => {
  return sessionModel
    .findById(id)
    .then((session) => {
      if (!session) {
        throw new Error("Session not found");
      }

      Object.keys(sessionDetails).forEach((key) => {
        if (sessionDetails[key] !== undefined) {
          session[key] = sessionDetails[key];
        }
      });

      if (
        sessionDetails.formations &&
        Array.isArray(sessionDetails.formations)
      ) {
        sessionDetails.formations.forEach((formationId) => {
          if (!session.formations.includes(formationId)) {
            session.formations.push(formationId);
          }
        });
      }

      if (sessionDetails.seances && Array.isArray(sessionDetails.seances)) {
        sessionDetails.seances.forEach((seanceId) => {
          if (!session.seances.includes(seanceId)) {
            session.seances.push(seanceId);
          }
        });
      }

      return session.save();
    })
    .then((updatedSession) => {
      logger.info("Session saved successfully:", updatedSession);
      return updatedSession;
    })
    .catch((error) => {
      logger.error("Error saving Session:", error);
      throw new Error(error);
    });
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
