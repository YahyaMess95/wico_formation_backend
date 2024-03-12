const mongoose = require("../../Db/connection");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    prename: {
      type: String,
      required: true,
    },
    addresse: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cin: {
      type: String,
      required: true,
    },
    login: {
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

    photo: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// validation middleware
userSchema.path("sessions").validate(async function (sessions) {
  for (const sessionId of sessions) {
    try {
      const session = await mongoose.model("Session").findById(sessionId);
      if (!session) {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  return true;
}, "Invalid session ObjectId");

userSchema.statics.findbyCredentials = async function (login, password) {
  const user = await this.findOne({ login });

  if (!user) {
    throw new Error("User not found");
  }

  const check = await bcrypt.compare(password, user.password);

  if (!check) {
    throw new Error("Invalid password");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const createdDate = new Date();
  const tokenExpDate = new Date();
  tokenExpDate.setDate(createdDate.getDate() + 2);

  const token = jwt.sign({ _id: user._id.toString() }, "user", {
    expiresIn: "2d",
  });
  user.tokens = [{ token, tokenExpDate, createdDate }];
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
