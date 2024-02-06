const mongoose = require("../../Db/connection");
const Schema = mongoose.Schema;

const seanceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lieu: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

seanceSchema.statics.findbyCredentials = async function (name) {
  const seance = await this.findOne({ name });

  if (!seance) {
    throw new Error("Seance not found");
  }

  return seance;
};

const Seance = mongoose.model("Seance", seanceSchema);

module.exports = Seance;
