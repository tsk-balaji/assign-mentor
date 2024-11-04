const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentID: { type: Number, required: true },
  studentName: String,
  courseName: String,
  previousMentor: { type: mongoose.Schema.Types.Number, ref: "Mentor" }, // Change to ObjectId
  mentor: { type: mongoose.Schema.Types.Number, ref: "Mentor" }, // Change to ObjectId
});
module.exports = studentSchema;
