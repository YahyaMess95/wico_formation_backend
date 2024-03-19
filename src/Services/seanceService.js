const seanceModule = require("../Models/seanceModule");
const logger = require("../../config/logger");

module.exports.getSeanceFromDBService = async (page, pageSize) => {
  if (page != 0 && pageSize != 0) {
    const skip = (page - 1) * pageSize;

    try {
      const totalCount = await seanceModule.countDocuments();
      const results = await seanceModule
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);
      return { results, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  } else {
    return seanceModule
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

module.exports.getoneSeanceFromDBService = async (id) => {
  try {
    const result = await seanceModule.findById(id);

    return result;
  } catch (error) {
    throw new Error(error);
  }
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
