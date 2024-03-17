const temoignageModel = require("../Models/temoignageModel");
const logger = require("../../config/logger");

module.exports.getTemoignageFromDBService = async (page, pageSize) => {
  const skip = (page - 1) * pageSize;
  try {
    const totalCount = await temoignageModel.countDocuments();
    const results = await temoignageModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
    return { results, totalCount };
  } catch (error) {
    throw new Error(error);
  }
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
module.exports.updateTemoignageDBService = async (id, temoignageDetails) => {
  try {
    // Fetch the temoignage document by temoignageId
    const temoignage = await temoignageModel.findById(id);

    if (!temoignage) {
      throw new Error("Temoignage not found");
    }

    Object.assign(temoignage, temoignageDetails);

    // Save the updated temoignage document
    const updatedTemoignage = await temoignage.save();

    logger.info("Temoignage updated successfully:", updatedTemoignage);
    return updatedTemoignage;
  } catch (error) {
    logger.error("Error updating temoignage:", error);
    throw new Error(error);
  }
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
