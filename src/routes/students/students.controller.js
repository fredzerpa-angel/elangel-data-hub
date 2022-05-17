const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getStudentBySearch,
} = require('../../models/students/students.model');

async function httpGetAllStudents(req, res) {
  const { name, cid } = req.query;
  let response;

  try {
    // Si hubo una consulta entonces buscar por consulta
    if (name || cid) {
      const search = {
        searchBy: name ? 'fullname' : 'cedulaId',
        value: name ?? cid,
      }
      response = await getStudentBySearch(search);
    } else {
      // Si no hubo consulta entonces retorna todos los estudiantes
      response = await getAllStudents();
    }
    
    return res.status(200).json(response);
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
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
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
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

async function httpDeleteStudent(req, res) {
  const studentId = req.params.id;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await deleteStudent(studentId));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de datos tiro un error
      error: 'Failed to delete student',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllStudents,
  httpGetStudent,
  httpCreateStudent,
  httpUpdateStudent,
  httpDeleteStudent,
};
