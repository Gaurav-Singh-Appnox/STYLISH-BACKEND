const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    // googleLogin: {
    //   googleId: {
    //     type: String,
    //   },
    //   verified: {
    //     type: Boolean,
    //     default: false,
    //   },
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
