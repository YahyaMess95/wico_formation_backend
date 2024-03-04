const temoignageModel = require("../Models/temoignageModel");
const logger = require("../../config/logger");

module.exports.getTemoignageFromDBService = () => {
  return temoignageModel
    .find({})
    .then((results) => {
      logger.info("Query results:", results);
      return results;
    })
    .catch((error) => {
      logger.error("Error Get Temoignage:", error);
      throw new Error(error);
    });
};

module.exports.createTemoignageDBService = async (temoignageDetails) => {
  try {
    const temoignageModelData = new temoignageModel();
    Object.assign(temoignageModelData, temoignageDetails);

    const savedInstance = await temoignageModelData.save();
    logger.info("Temoignage saved successfully:", savedInstance);

    return savedInstance;
  } catch (error) {
    logger.error("Error saving Temoignage:", error);
    throw new Error(error);
  }
};

module.exports.updateTemoignageDBService = (id, temoignageDetails) => {
  const temoignageModelData = new temoignageModel();
  Object.assign(temoignageModelData, temoignageDetails);

  logger.info("Temoignage saved successfully:", savedInstance);
  return temoignageModelData
    .findByIdAndUpdate(id, temoignageDetails, { new: true })
    .then((UpdatedInstance) => {
      if (!UpdatedInstance) {
        throw new Error("Temoignage not found");
      }
      logger.info("Temoignage saved successfully:", UpdatedInstance);
      return UpdatedInstance;
    })
    .catch((error) => {
      logger.error("Error saving Temoignage:", error);
      throw new Error(error);
    });
};

module.exports.removeTemoignageDBService = (id) => {
  return temoignageModel
    .findByIdAndDelete(id)
    .then((DeletedInstance) => {
      if (!DeletedInstance) {
        throw new Error("Temoignage not found");
      }
      logger.info("Temoignage Deleted successfully:", DeletedInstance);
      return DeletedInstance;
    })
    .catch((error) => {
      logger.error("Error saving Temoignage:", error);
      throw new Error(error);
    });
};
