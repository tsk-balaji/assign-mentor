const StudentRouter = require("express").Router();
const Mentor = require("../Mentors/mentors.model");
const Student = require("./students.model");


//2. Create Student
StudentRouter.post("/create", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send({
      message: "Error creating Student",
      error: error.message || error,
    });
  }
});

//4. Assign or change Mentor for Particular Student.

StudentRouter.put("/:studentId/mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).send("Student not found");

    student.previousMentor = student.mentor;
    student.mentor = mentorId;
    await student.save();

    const newMentor = await Mentor.findById(mentorId);
    if (newMentor && !newMentor.students.includes(student._id)) {
      newMentor.students.push(student._id);
      await newMentor.save();
    }

    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

//6. Show Previously Assigned Mentor for a particular Student.

StudentRouter.get("/:studentId/previous-mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate(
      "previousMentor"
    );
    if (!student) return res.status(404).send("Student not found");

    res.send(student.previousMentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all mentors
StudentRouter.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.send(students);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving mentors", error });
  }
});

module.exports = StudentRouter;
