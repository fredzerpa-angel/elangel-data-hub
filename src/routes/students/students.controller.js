const {
  getAllStudents,
  createStudent,
} = require('../../models/students/students.model');

async function httpGetAllStudents(req, res) {
  return res.status(200).json(await getAllStudents());
}

async function httpCreateStudent(req, res) {
  const studentData = req.body;
  try {
    return res.status(201).json(await createStudent(studentData));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Database threw an error
      error: 'Failed to create new student',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllStudents,
  httpCreateStudent,
};
