const mongoose = require("../../Db/connection");
const Schema = mongoose.Schema;

const formationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    contenus: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contenu",
      },
    ],
  },
  { timestamps: true }
);

// validation middleware
formationSchema.path("contenus").validate(async function (contenus) {
  for (const contenuId of contenus) {
    try {
      const contenu = await mongoose.model("Contenu").findById(contenuId);
      if (!contenu) {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  return true;
}, "Invalid contenu ObjectId");

formationSchema.statics.findbyCredentials = async function (name) {
  const formation = await this.findOne({ name });

  if (!formation) {
    throw new Error("Formation not found");
  }

  return formation;
};

const Formation = mongoose.model("Formation", formationSchema);

module.exports = Formation;
