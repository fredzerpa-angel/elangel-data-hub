const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getStudentBySearch,
  upsertStudentsByBundle,
} = require('../../models/students/students.model');

async function httpGetAllStudents(req, res) {
  const { search } = req.query;

  // TODO: Implementar las validaciones
  try {
    const response = search ? await getStudentBySearch(search) : await getAllStudents();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch students',
      message: error.message,
    });
  }
}

async function httpGetStudent(req, res) {
  const { id } = req.params;
  // TODO: Implementar las validaciones
  try {
    return res.status(200).json(await getStudentById(id));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch students',
      message: error.message,
    });
  }
}

async function httpCreateStudent(req, res) {
  const studentData = req.body;

  // TODO: Implementar las validaciones

  try {
    return res.status(201).json(await createStudent(studentData));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
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
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to update student',
      message: error.message,
    });
  }
}

async function httpDeleteStudent(req, res) {
  const studentId = req.params.id;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await deleteStudent(studentId));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to delete student',
      message: error.message,
    });
  }
}

async function httpCreateStudentsByBundle(req, res) {
  const bundle = req.body;

  if (!Array.isArray(bundle))
    return res.status(400).json({
      code: 400,
      error: 'Data is not bundled',
      message: 'The passed data is not an Array of data',
    });

  // TODO: Implementar validaciones

  try {
    return res.status(201).json(await upsertStudentsByBundle(bundle));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to create bundle of student',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllStudents,
  httpGetStudent,
  httpCreateStudent,
  httpCreateStudentsByBundle,
  httpUpdateStudent,
  httpDeleteStudent,
};
