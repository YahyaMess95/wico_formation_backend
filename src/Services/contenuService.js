const contenuModel = require("../Models/contenuModel");
const logger = require("../../config/logger");

module.exports.getContenuFromDBService = () => {
  return contenuModel
    .find({})
    .then((results) => {
      logger.info("Query results:", results);
      return results;
    })
    .catch((error) => {
      logger.error("Error Get Contenu:", error);
      throw new Error(error);
    });
};

module.exports.createContenuDBService = async (contenuDetails) => {
  try {
    const contenuModelData = new contenuModel();

    Object.assign(contenuModelData, contenuDetails);

    const savedInstance = await contenuModelData.save();
    logger.info("Contenu saved successfully:", savedInstance);
    return savedInstance;
  } catch (error) {
    logger.error("Error saving Contenu:", error);
    throw new Error(error);
  }
};

module.exports.updateContenuDBService = (id, ContenuDetails) => {
  logger.info(ContenuDetails);
  return contenuModel
    .findByIdAndUpdate(id, ContenuDetails, { new: true })
    .then((UpdatedInstance) => {
      if (!UpdatedInstance) {
        throw new Error("Contenu not found");
      }
      logger.info("Contenu saved successfully:", UpdatedInstance);
      return UpdatedInstance;
    })
    .catch((error) => {
      logger.error("Error saving Contenu:", error);
      throw new Error(error);
    });
};

module.exports.removeContenuDBService = (id) => {
  return contenuModel
    .findByIdAndDelete(id)
    .then((DeletedInstance) => {
      if (!DeletedInstance) {
        throw new Error("Contenu not found");
      }
      logger.info("Contenu Deleted successfully:", DeletedInstance);
      return DeletedInstance;
    })
    .catch((error) => {
      logger.error("Error saving Contenu:", error);
      throw new Error(error);
    });
};
