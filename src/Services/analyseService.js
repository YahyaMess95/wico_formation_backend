const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const seanceModule = require("../Models/seanceModule");
const formationModel = require("../Models/formationModel");
const temoignageModel = require("../Models/temoignageModel");

module.exports.getCountDBService = async (year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  try {
    const Countuser = await userModel.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const Countsession = await sessionModel.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const Countseance = await seanceModule.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const Countforamtion = await formationModel.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const formationsByDay = await formationModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ]);

    const Counttemoignage = await temoignageModel.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    return {
      Countuser,
      Countsession,
      Countseance,
      Countforamtion,
      Counttemoignage,
      formationsByDay,
    };
  } catch (error) {
    throw new Error(error);
  }
};
