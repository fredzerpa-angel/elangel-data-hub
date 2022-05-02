const { getAllStudents } = require('../../models/students/students.model');

async function httpGetAllStudents(req, res) {
  return res.status(200).json(await getAllStudents());
}

module.exports = {
  httpGetAllStudents
}
