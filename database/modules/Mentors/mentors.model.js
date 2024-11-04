const mongoose = require("mongoose");
const mentorSchema = require("./mentors.schema"); // Import the schema

const Mentor = mongoose.model("Mentor", mentorSchema); // Create the model from the schema

module.exports = Mentor; // Export the model
