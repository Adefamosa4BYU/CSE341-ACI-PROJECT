const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { type: String, enum: ["admin", "staff", "student"], default: "student" },
  phone: {type: String},
  location: {type: String},
  githubId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("aciUser", userSchema);