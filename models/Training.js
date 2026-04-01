const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  level: String,
  location: String,
  capacity: Number,
  instructor: String,
  duration: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Training", trainingSchema);