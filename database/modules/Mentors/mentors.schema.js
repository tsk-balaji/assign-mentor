const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  mentorId: { type: Number, required: true },
  mentorName: String,
  students: [Number],
});

module.exports = mentorSchema;
