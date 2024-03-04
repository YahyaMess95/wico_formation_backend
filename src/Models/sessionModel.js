const mongoose = require("../../Db/connection");
const logger = require("../../config/logger");
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
sessionSchema.path("formations").validate(async function (formations) {
  for (const formationId of formations) {
    try {
      const formation = await mongoose.model("Formation").findById(formationId);
      if (!formation) {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  return true;
}, "Invalid formation ObjectId");

// validation middleware
sessionSchema.path("seances").validate(async function (Seances) {
  for (const seanceId of Seances) {
    try {
      const seance = await mongoose.model("Seance").findById(seanceId);
      if (!seance) {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
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
