const mongoose = require("../../Db/connection");
var Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
        },
        tokenExpDate: {
          type: Date,
        },
        createdDate: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

adminSchema.statics.findbyCredentials = async function (name, password) {
  const admin = await this.findOne({ name });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const check = await bcrypt.compare(password, admin.password);

  if (!check) {
    throw new Error("Invalid password");
  }

  return admin;
};

adminSchema.methods.generateAuthToken = async function () {
  const admin = this;
  const createdDate = new Date();
  const tokenExpDate = new Date();
  tokenExpDate.setDate(createdDate.getDate() + 2);
  const token = jwt.sign({ _id: admin._id.toString() }, "admin", {
    expiresIn: "2d",
  });

  admin.tokens = [{ token, tokenExpDate, createdDate }];
  await admin.save();

  return token;
};

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
