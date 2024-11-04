const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  mentorId: { type: Number, required: true },
  mentorName: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Store ObjectId references
});

module.exports = mentorSchema;
