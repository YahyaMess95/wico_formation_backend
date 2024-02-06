const mongoose = require("../../Db/connection");
const Schema = mongoose.Schema;

const temoignageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    prename: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },
    mention: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cv: {
      type: String,
      required: true,
    },
    competences: {
      type: String,
      required: true,
    },
    domaine: {
      type: String,
      required: true,
    },
    comment: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

temoignageSchema.statics.findbyCredentials = async function (name) {
  const temoignage = await this.findOne({ name });

  if (!temoignage) {
    throw new Error("Temoignage not found");
  }

  return temoignage;
};

const Temoignage = mongoose.model("Temoignage", temoignageSchema);

module.exports = Temoignage;
