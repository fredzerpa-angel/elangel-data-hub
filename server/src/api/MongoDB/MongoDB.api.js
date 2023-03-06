const path = require('path');
const { DateTime } = require('luxon');
const execSync = require('child_process').execSync;

const DUMP_INITIAL_OPTIONS = {
  filePrefix: null, // Si solo se usa el prefix se agregara un sufijo de la fecha actual en formato ISO
  fileFullname: null, // Reemplaza el nombre completo del archivo a crear
  folderPathToDump: null, // Si es nulo se creara el backup en el mismo directorio
  config: path.join(__dirname, 'config.yaml'), // ref: https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--archive
}

// Estos son 'dumps' son temporales, ya que el backup se guarda en AWS S3
// ! config es obligatorio. ref: https://www.mongodb.com/docs/database-tools/mongodump/#std-option-mongodump.--config
// ! dumpDatabase es una funcion sincrona, por lo que parara todos los procesos hasta terminar
function dumpDatabase(dumpOptions = DUMP_INITIAL_OPTIONS) {
  const options = { ...DUMP_INITIAL_OPTIONS, ...dumpOptions };

  const DUMP_NAME = options.fileFullname ?? `${options.filePrefix}-${DateTime.now().toISODate()}`;
  const DUMP_PATH = path.join(options.folderPathToDump ?? '', DUMP_NAME);
  const cmd = `mongodump --config="${options.config}" --archive="${DUMP_PATH}.archive.gz" --gzip --quiet`;

  try {
    execSync(cmd);
    return {
      ok: true,
    }
  } catch (err) {
    return {
      ok: false,
      error: err
    }
  }

}

const RESTORE_INITIAL_OPTIONS = {
  fileName: null, // Nombre completo (excluyendo la extension) del archivo. Ex: 'el-angel-2023-01-01'
  filePath: null, // Si es nulo buscara en la ruta del directorio actual
  // ! Confirmar las autorizaciones del usuario para insertar documentos en la BD
  config: path.join(__dirname, 'config.yaml'), // ref: https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--archive
}

async function restoreDatabase(restoreOptions = RESTORE_INITIAL_OPTIONS) {
  const options = { ...RESTORE_INITIAL_OPTIONS, ...restoreOptions };

  const RESTORE_FILE_NAME = `${options.fileName}.archive.gz`;
  const RESTORE_FILE_PATH = path.join(options.filePath ?? '', RESTORE_FILE_NAME);
  const cmd = `mongorestore --config="${options.config}" --archive="${RESTORE_FILE_PATH}" --gzip`;

  try {
    execSync(cmd);
    return {
      ok: true,
    }
  } catch (err) {
    return {
      ok: false,
      error: err
    }
  }
}

module.exports = {
  dumpDatabase,
  restoreDatabase,
}