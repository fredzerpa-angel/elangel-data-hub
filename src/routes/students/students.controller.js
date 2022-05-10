const {
  getAllStudents,
  createStudent,
  updateStudent,
} = require('../../models/students/students.model');

async function httpGetAllStudents(req, res) {
  try {
    return res.status(200).json(await getAllStudents());
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
      error: 'Failed to fetch students',
      message: error.message,
    });
  }
}

async function httpCreateStudent(req, res) {
  const studentData = req.body;

  // TODO: Implementar las validaciones para req.body

  try {
    return res.status(201).json(await createStudent(studentData));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
      error: 'Failed to create new student',
      message: error.message,
    });
  }
}

async function httpUpdateStudent(req, res) {
  const studentId = req.params.id;
  const updateData = req.body;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await updateStudent(studentId, updateData));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de datos tiro un error
      error: 'Failed to update student',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllStudents,
  httpCreateStudent,
  httpUpdateStudent,
};
