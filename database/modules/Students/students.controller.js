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

    const newMentor = await Mentor.findById(mentorId);
    if (!newMentor) return res.status(404).send("Mentor not found");

    // Store previous mentor ID before updating
    student.previousMentor = student.mentor;
    student.mentor = mentorId;
    await student.save();

    // Add student to new mentor's students array if not already present
    if (!newMentor.students.includes(student._id)) {
      newMentor.students.push(student._id);
      await newMentor.save();
    }

    // Remove student from previous mentor's students array if exists
    if (student.previousMentor) {
      const previousMentor = await Mentor.findById(student.previousMentor);
      if (previousMentor) {
        previousMentor.students = previousMentor.students.filter(
          (id) => id.toString() !== student._id.toString()
        );
        await previousMentor.save();
      }
    }

    res.send(student);
  } catch (error) {
    res.status(500).send({
      message: "Error updating mentor assignment",
      error: error.message,
    });
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

// Get all Students
StudentRouter.get("/", async (req, res) => {
  try {
    const students = await Student.find().exec();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving students",
      error: error.message || error,
    });
  }
});

module.exports = StudentRouter;
