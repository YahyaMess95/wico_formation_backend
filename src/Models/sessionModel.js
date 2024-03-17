const mongoose = require("../../Db/connection");
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    datedeb: {
      type: Date,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    maxNbr: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },

    formations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Formation",
      },
    ],
    seances: [
      {
        type: Schema.Types.ObjectId,
        ref: "Seance",
      },
    ],
  },
  { timestamps: true }
);

// validation middleware
// Validation middleware for formations
sessionSchema.path("formations").validate(async function (formations) {
  // Filter out invalid formation IDs
  const validFormationIds = [];
  for (const formationId of formations) {
    try {
      const formation = await mongoose.model("Formation").findById(formationId);
      if (formation) {
        validFormationIds.push(formationId);
      }
    } catch (error) {
      // Handle error if needed
      console.error("Error occurred while validating formation:", error);
    }
  }

  // Update formations array with valid formation IDs
  this.formations = validFormationIds;

  return true;
}, "Invalid formation ObjectId");

// Validation middleware for seances
sessionSchema.path("seances").validate(async function (seances) {
  // Filter out invalid seance IDs
  const validSeanceIds = [];
  for (const seanceId of seances) {
    try {
      const seance = await mongoose.model("Seance").findById(seanceId);
      if (seance) {
        validSeanceIds.push(seanceId);
      }
    } catch (error) {
      // Handle error if needed
      console.error("Error occurred while validating seance:", error);
    }
  }

  // Update seances array with valid seance IDs
  this.seances = validSeanceIds;

  return true;
}, "Invalid seance ObjectId");

// searching
sessionSchema.statics.findbyCredentials = async function (name) {
  const session = await this.findOne({ name });

  if (!session) {
    throw new Error("Session not found");
  }

  return session;
};

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
