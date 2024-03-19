const formationModel = require("../Models/formationModel");
const logger = require("../../config/logger");

module.exports.getFormationFromDBService = async (page, pageSize) => {
  if (page != 0 && pageSize != 0) {
    const skip = (page - 1) * pageSize;

    try {
      const totalCount = await formationModel.countDocuments();
      const results = await formationModel
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);
      return { results, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  } else {
    return formationModel
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

module.exports.getoneFormationFromDBService = async (id) => {
  try {
    const result = await formationModel.findById(id);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.createFormationDBService = async (formationDetails) => {
  try {
    const formationModelData = new formationModel();

    Object.assign(formationModelData, formationDetails);

    const savedInstance = await formationModelData.save();
    logger.info("Formation saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving Formation:", error);
    throw new Error(error);
  }
};

module.exports.updateFormationDBService = (id, formationDetails) => {
  return formationModel
    .findById(id)
    .then((formation) => {
      if (!formation) {
        throw new Error("Formation not found");
      }

      Object.keys(formationDetails).forEach((key) => {
        if (formationDetails[key] !== undefined) {
          formation[key] = formationDetails[key];
        }
      });
      if (
        formationDetails.contenus &&
        Array.isArray(formationDetails.contenus)
      ) {
        formationDetails.contenus.forEach((contenuId) => {
          if (!formation.contenus.includes(contenuId)) {
            formation.contenus.push(contenuId);
          }
        });
      }

      return formation.save();
    })
    .then((updatedFormation) => {
      logger.info("Formation saved successfully:", updatedFormation);
      return updatedFormation;
    })
    .catch((error) => {
      logger.error("Error saving Formation:", error);
      throw new Error(error);
    });
};

module.exports.removeFormationDBService = (id) => {
  return formationModel
    .findByIdAndDelete(id)
    .then((DeletedInstance) => {
      if (!DeletedInstance) {
        throw new Error("Formation not found");
      }
      logger.info("Formation Deleted successfully:", DeletedInstance);
      return DeletedInstance;
    })
    .catch((error) => {
      logger.error("Error saving Formation:", error);
      throw new Error(error);
    });
};
