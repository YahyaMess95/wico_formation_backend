const mongoose = require("../../Db/connection");
const Schema = mongoose.Schema;

const contenuSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

contenuSchema.statics.findbyCredentials = async function (name) {
  const contenu = await this.findOne({ name });

  if (!contenu) {
    throw new Error("Contenu not found");
  }

  return contenu;
};

const Contenu = mongoose.model("Contenu", contenuSchema);

module.exports = Contenu;
