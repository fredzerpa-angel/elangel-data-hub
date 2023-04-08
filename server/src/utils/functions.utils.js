const axios = require("axios");
const { DateTime } = require("luxon");
const xlsx = require('node-xlsx').default;
const fs = require('fs');
const formData = require('form-data-to-object');
const bcrypt = require('bcrypt');


/* 
  Convierte una propiedad String de un objeto en un esquema
  ej: 
  { 'user.name': 'John', 'user.lastname': 'Doe' } => { user: { name: 'John', lastname: 'Doe' } }
*/
function convertObjectStringToSchema(stringObj = {}, divider = '.') {
  // Registro del Schema
  const schema = new Map();

  // Obtener una matriz de los props y values del objeto
  const entries = Object.entries(stringObj);
  // Separamos los props por el divider para obtener
  // el main path y los subpaths en un array y la data (value) en otro (una matriz [[path, ...subpaths], [value]])
  const entriesSplitted = entries.map(([key, value]) => [
    key.split(divider),
    value,
  ]);

  // Por cada data de la matriz
  entriesSplitted.forEach(([paths, data]) => {
    // Separamos el Path actual y los Sub-Paths que posea
    const [path, ...subPaths] = paths;
    // Vemos si su Path actual existe en el Schema y si no lo creamos
    if (!schema.has(path)) schema.set(path, data);
    // A su vez si el Path actual posee Sub-Paths los agregamos como un Nested Object
    if (subPaths.length) {
      // El Schema en el Path actual puede ser un Nested Object o un String
      typeof schema.get(path) === 'object'
        ? // Si es un Nested Object incluimos los Sub-Paths preexistentes y creamos un nuevo Sub-Path con la data como value
        schema.set(path, {
          ...schema.get(path),
          [subPaths.join(divider)]: data,
        })
        : // Si es un String creamos un nuevo Sub-Path con la data como value
        schema.set(path, {
          [subPaths.join(divider)]: data,
        });
    }
  });

  // El Schema Map lo convertimos en un Schema Objeto
  return [...schema].reduce((result, [path, rest]) => {
    // Si la data del Path actual es un Nested Object
    if (typeof rest === 'object') {
      // Verificamos si esa data es un String Prop del Nested Object
      // Que se puede convetir en un Sub-Path
      const hasSubpaths = Object.entries(rest).some(
        ([subPath, data]) => subPath.split(divider).length > 1
      );
      hasSubpaths
        ? // Si posee un Sub-Path realizamos una cursividad
        // Para transformar ese Sub-Path
        (result[path] = convertObjectStringToSchema(rest))
        : // Si no posee un Sub-Path retornamos
        (result[path] = rest);
    } else {
      // Si no es un Nested Object, es un String y lo agregamos asi
      result[path] = rest;
    }

    // Retornamos nuestro Schema Object
    return result;
  }, {});
}

async function fetchAndParseExcelLatinFileToJSON(url = '', params = {}, method = 'GET') {
  // Fetch un archivo Excel - Ya que no existe un JSON Endpoint para la obtencion de padres academicos
  const options = {
    url,
    params,
    method,
    responseType: 'arraybuffer',
    transformResponse: [
      data => {
        // Convert data to be able to read accents and special characters from spanish lexic
        const dataWithAccents = data.toString('latin1');
        // Return it as a buffer, because XLSX package use buffers
        const arrayBuffer = new TextEncoder().encode(dataWithAccents).buffer;
        return arrayBuffer;
      },
    ],
  };

  const { data } = await axios(options);

  // Convierte la data del archivo Excel a una estructura JSON
  const parsedExcelData = xlsx.parse(data);

  return parsedExcelData;
}

function getCurrentSchoolTerm() {
  // Los periodos escolares empiezan el 01/09 y terminan el 30/07 de cada año
  const startSchoolTermDateTime = DateTime.fromFormat(`01/09/${DateTime.now().year}`, 'dd/MM/yyyy');
  const newSchoolTermStarted = startSchoolTermDateTime.diff(DateTime.now()).as('milliseconds') < 0;
  // Buscamos en que periodo escolar estamos, si ya empezo el nuevo año escolar o no
  const currentSchoolTerm = newSchoolTermStarted ?
    `${DateTime.now().year}-${DateTime.now().plus({ years: 1 }).year}`
    :
    `${DateTime.now().minus({ years: 1 }).year}-${DateTime.now().year}`;

  return currentSchoolTerm;
}

function removeFile(filePath) {
  try {

    fs.unlinkSync(filePath);

    return {
      ok: true,
      file: filePath,
    }
  } catch (err) {
    return {
      ok: false,
      file: filePath,
      error: err,
    }
  }

}

function formDataToObj(data) {
  const formattedFormData = Object.fromEntries(Object.entries(data).map(([key, value]) => {
    try {
      return [key, JSON.parse(value)]
    } catch (error) {
      return [key, value]
    }
  }))

  return formData.toObj(formattedFormData);
}

async function encrypt(data) {
  return await bcrypt.hash(String(data), 10); // bcrypt solo usa Strings
}

module.exports = {
  convertObjectStringToSchema,
  fetchAndParseExcelLatinFileToJSON,
  getCurrentSchoolTerm,
  removeFile,
  formDataToObj,
  encrypt
};
