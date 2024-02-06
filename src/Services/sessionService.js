const sessionModel = require("../Models/sessionModel");
const logger = require("../../config/logger");

module.exports.getSessionFromDBService = () => {
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
};

module.exports.createSessionDBService = async (SessionDetails) => {
  try {
    const sessionModelData = new sessionModel();

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
  logger.info(sessionDetails);

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
