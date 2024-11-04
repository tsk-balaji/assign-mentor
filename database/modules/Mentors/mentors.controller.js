const MentorRouter = require("express").Router();
const mongoose = require("mongoose");

const Mentor = require("./mentors.model");
const Student = require("../Students/students.model");

// 1. Create Mentor
MentorRouter.post("/create", async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send(mentor);
  } catch (error) {
    console.error("Error creating mentor:", error); // Log the error to the console
    res.status(400).send({
      message: "Error creating mentor",
      error: error.message || error,
    });
  }
});

// 3. Assign a Student to "Mentor".
MentorRouter.post("/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { studentIds } = req.body;

    // Validate input
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).send({ message: "Student IDs array is required" });
    }

    // Validate mentorId
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).send({ message: "Invalid mentor ID." });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).send("Mentor not found");

    // Validate student IDs
    const invalidStudentIds = studentIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidStudentIds.length > 0) {
      return res.status(400).send({
        message: "Invalid student IDs provided.",
        invalidStudentIds,
      });
    }

    // Convert studentIds to ObjectIds
    const studentObjectIds = studentIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Verify students exist
    const existingStudents = await Student.find({
      _id: { $in: studentObjectIds },
    });

    if (existingStudents.length !== studentIds.length) {
      return res.status(404).send({
        message: "Some student IDs do not exist",
        providedCount: studentIds.length,
        foundCount: existingStudents.length,
      });
    }

    // Find unassigned students
    const students = await Student.find({
      _id: { $in: studentObjectIds },
      mentor: null,
    });

    const unassignedStudentIds = students.map((student) =>
      student._id.toString()
    );
    const alreadyAssignedIds = studentIds.filter(
      (id) => !unassignedStudentIds.includes(id)
    );

    if (alreadyAssignedIds.length > 0) {
      return res.status(400).send({
        message: "Some students are already assigned to a mentor.",
        alreadyAssignedIds,
      });
    }

    // Assign the mentor
    await Student.updateMany(
      { _id: { $in: studentObjectIds } },
      { mentor: mentorId }
    );

    mentor.students.push(...students.map((student) => student._id));
    await mentor.save();

    res.status(200).send(mentor);
  } catch (error) {
    console.error("Error assigning students:", error);
    res.status(500).send({
      message: "Error assigning students",
      error: error.message || "No details available",
    });
  }
});

// 5. Show all students for a particular mentor.

MentorRouter.get("/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Check if mentorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).send({ message: "Invalid mentor ID format" });
    }

    const mentor = await Mentor.findById(mentorId).populate("students");
    if (!mentor) return res.status(404).send("Mentor not found");

    res.send(mentor.students);
  } catch (error) {
    res.status(400).send({ message: "Error retrieving students", error });
    console.log(error);
  }
});

// Get all mentors
MentorRouter.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find().exec();
    res.send(mentors);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving mentors", error });
  }
});

module.exports = MentorRouter;
