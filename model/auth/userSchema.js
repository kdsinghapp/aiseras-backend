const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true, lowercase: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  googleId: String,
  facebookId: String,
});

module.exports = mongoose.model("User", userSchema);
