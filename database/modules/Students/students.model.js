const mongoose = require("mongoose");

const studentSchema = require("./students.schema");

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
