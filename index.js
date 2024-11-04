require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const initialise_Mongo_Connectivity = require("./database/connection.mongodb");

// Connect to MongoDB
initialise_Mongo_Connectivity();

const mentorAndStudent = express();

// Middleware to parse JSON requests
mentorAndStudent.use(bodyParser.json());

const PORT = process.env.PORT || 4114; // Change the port number here

// Start the server
mentorAndStudent.listen(PORT, "0.0.0.0", () => {
  console.log("WebService is Live on port :", PORT);
});

// Use the routers for mentors and students
mentorAndStudent.use(
  "/mentors",
  require("./database/modules/Mentors/mentors.controller")
);
mentorAndStudent.use(
  "/students",
  require("./database/modules/Students/students.controller")
);
