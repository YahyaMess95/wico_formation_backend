const seanceModule = require("../Models/seanceModule");
const logger = require("../../config/logger");

module.exports.getSeanceFromDBService = () => {
  return seanceModule
    .find({})
    .then((results) => {
      logger.info("Query results:", results);
      return results;
    })
    .catch((error) => {
      logger.error("Error Get Seance:", error);
      throw new Error(error);
    });
};

module.exports.createSeanceDBService = async (seanceDetails) => {
  try {
    const seanceModulData = new seanceModule();

    Object.assign(seanceModulData, seanceDetails);

    const savedInstance = await seanceModulData.save();
    logger.info("Seance saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving Seance:", error);
    throw new Error(error);
  }
};

module.exports.updateSeanceDBService = (id, SeanceDetails) => {
  return seanceModule
    .findByIdAndUpdate(id, SeanceDetails, { new: true })
    .then((UpdatedInstance) => {
      if (!UpdatedInstance) {
        throw new Error("Seance not found");
      }
      logger.info("Seance saved successfully:", UpdatedInstance);
      return UpdatedInstance;
    })
    .catch((error) => {
      logger.error("Error saving Seance:", error);
      throw new Error(error);
    });
};

module.exports.removeSeanceDBService = (id) => {
  return seanceModule
    .findByIdAndDelete(id)
    .then((DeletedInstance) => {
      if (!DeletedInstance) {
        throw new Error("Seance not found");
      }
      logger.info("Seance Deleted successfully:", DeletedInstance);
      return DeletedInstance;
    })
    .catch((error) => {
      logger.error("Error saving Seance:", error);
      throw new Error(error);
    });
};
