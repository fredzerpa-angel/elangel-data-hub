const axios = require('axios');
const { DateTime } = require('luxon');
const xlsx = require('node-xlsx').default;
const { convertObjectStringToSchema } = require('../../utils/functions.utils');

const ArcadatClient = axios.create({
  baseURL: 'https://www.arcadat.com/apps/',
});

async function getStudents() {
  // Fetch un archivo Excel - Ya que no existe un JSON Endpoint para la obtencion de estudiantes
  const options = {
    url: 'rptxls/eGxzZGdzYQ',
    params: {
      p: 'Njk1NA', // Propiedad de busqueda durante el periodo escolar 2022-2023
    },
    responseType: 'arraybuffer',
    transformResponse: [
      data => {
        // Transforma la data para poder leer caracteres especiales en el lexico español
        const dataWithAccents = data.toString('latin1');
        // Tranforma la data a buffer array otra vez
        const arrayBuffer = new TextEncoder().encode(dataWithAccents).buffer;
        return arrayBuffer;
      },
    ],
  };

  const { data } = await ArcadatClient(options);

  // Convierte la data del archivo Excel a una estructura JSON
  const parsedExcelData = xlsx.parse(data);

  // Creamos un diccionario con las propiedades del Fetch y de Student Schema
  const SCHEMA_MAP = {
    'Nivel inscrito': 'gradeLevelAttended',
    'Plan de pago': 'paymentPlan',
    'Plan de descuento': 'discountPlan',
    'N° de identificación': 'documentId.number',
    Apellidos: 'lastnames',
    Nombres: 'names',
    'Apellidos y Nombres': 'fullname',
    Sexo: 'gender',
    'Fecha de nacimiento': 'birthdate',
    Edad: 'age',
    'Lugar de nacimiento': 'addressOfBirth.full',
    Dirección: 'addresses.full',
    Teléfonos: 'phones.secondary',
    'Teléfono celular': 'phones.main',
    'Correo electrónico': 'email',
    'Identificador padre': 'parents.father.documentId.number',
    'Apellidos y nombres del padre': 'parents.father.fullname',
    'Teléfonos padre': 'parents.father.phones.secondary',
    'Teléfono celular padre': 'parents.father.phones.main',
    'Correo electrónico padre': 'parents.father.email',
    'Identificador madre': 'parents.mother.documentId.number',
    'Apellidos y nombres de la madre': 'parents.mother.fullname',
    'Teléfonos madre': 'parents.mother.phones.secondary',
    'Teléfono celular madre': 'parents.mother.phones.main',
    'Correo electrónico madre': 'parents.mother.email',
    'Identificador representante': 'parents.admin.documentId.number',
    'Apellidos y nombres Representante': 'parents.admin.fullname',
    'Teléfonos representante': 'parents.admin.phones.secondary',
    'Teléfono celular representante': 'parents.admin.phones.main',
    'Correo electrónico representante': 'parents.admin.email',
    'Codigo de afiliado domiciliacion': 'directDebit.affiliatedCode',
    'Id afiliado domiciliacion': 'directDebit.id',
    'Nombre afiliado domiciliacion': 'directDebit.name',
    'Cuenta domiciliacion': 'directDebit.account',
  };

  // Refactorizamos la respuesta de Axios y XLSX a que solo retorne la data de los estudiantes, y estos ya ligados a sus respectivos Headers
  const schemedStudents = parsedExcelData.reduce((schemedStudents, data, i, arr) => {
    // Evitamos los headers, ya que solo nos interesa la data de los estudiantes
    const headersIndex = 1;
    const headers = arr[headersIndex].data[0];
    if (i <= headersIndex) return schemedStudents;

    const studentData = data.data[0];
    // Unimos la data de los estudiantes con sus respectivos Headers
    const stringSchemedStudent = studentData.reduce((schemedData, data, idx) => {
      // Eliminamos caracteres especiales innecesarios en nuestra data
      const specialCharacters = "'-";
      const findSpecialCharacters = new RegExp(`[${specialCharacters}]`, 'gi');
      // En este caso solo eliminamos estos characteres si la data esta sucia
      data = data.length > 1 ? data : data.replace(findSpecialCharacters, '');
      data = data.replace(/no posee/gi, '');

      const header = SCHEMA_MAP[headers[idx]];

      // Eliminamos cualquier character que no sea numero
      if (header.includes('documentId.number')) data = Number(data.replace(/\D/gi, ''));

      // Transformamos la fecha a una reconocida por el constructor Date de JS
      if (header === 'birthdate') data = DateTime.fromFormat(data, 'dd/MM/yyyy').toJSDate();

      // Si despues de validar la data, esta es un campo vacio entonces no la agregamos
      return data
        ? {
          ...schemedData,
          [header]: data,
        }
        : schemedData;
    }, {});

    // Refactorizamos la data conviertiendo los Headers a una estructura Esquematica
    // Agregamos que esta activo ya que ARCADAT solo retorna los estudiantes cursantes
    schemedStudents.push(convertObjectStringToSchema({ ...stringSchemedStudent, isActive: true }));

    return schemedStudents;
  }, []);

  // Retornamos la data de los estudiantes ya refactorizada
  return schemedStudents;
}

async function getPayments() {
  // * El endpoint de los pagos toma como parametos 'year_init' y 'year_end'
  // * Retorna los pagos tomando encuenta este rango filtrandolos por 'payment_date'

  // Creamos la data de un Formulario para hacer un Fetch Post
  var form = new URLSearchParams();
  form.append('o', '1');
  form.append('year_init', '2020'); // 2020 es el año mas antiguo seleccionable
  form.append('year_end', DateTime.now().year); // Hasta el año actual

  // Usamos el Endpoint de Alberto para obtener los pagos registrados en Arcadat
  const config = {
    method: 'post',
    url: 'json/web_service/alberto/pagos/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: form,
  };

  // Obtenemos los pagos registrados en Arcadat
  const {
    data: { data: payments },
  } = await ArcadatClient(config);

  // Creamos un diccionario con las propiedades del Fetch y de Payments Schema
  const SCHEMA_MAP = {
    period: 'schoolTerm',
    concept: 'concept',
    bill: 'billId',
    payment_date: 'time.date',
    payment_hour: 'time.hour',
    name_user: 'cashier.fullname',
    id_payment_holder: 'paymentHolder.refId',
    payment_holder: 'paymentHolder.fullname',
    'amount bs': 'amount.bs',
    'amount USD': 'amount.usd',
    rate: 'amount.convertionRate.rate',
    discount: 'discount.bs',
    credit: 'isCredit',
    id_student: 'student.documentId.number',
    name_student: 'student.fullname',
    canceled: 'canceled',
  };

  // Refactorizamos el Schema de los pagos registrados en Arcadat
  // A nuestro Schema de pagos
  const refactoredPaymentsSchema = payments.map(payment => {
    // Transforma las Keys de los Objects a seguir el SCHEMA_MAP
    const paymentWithSchema = Object.fromEntries(
      Object.entries(payment).map(([key, value]) => {
        const header = SCHEMA_MAP[key];
        return [header, value];
      })
    );

    // Limpiamos los valores
    paymentWithSchema['student.documentId.number'] = Number(paymentWithSchema['student.documentId.number'].replace(/\D/gi, ''));
    paymentWithSchema['time.date'] = DateTime.fromFormat(paymentWithSchema['time.date'], 'yyyy/MM/dd').toISODate();
    // Añadimos propiedades faltantes a nuestro pago
    paymentWithSchema['time.datetime'] = paymentWithSchema['time.date'] + ' ' + paymentWithSchema['time.hour']
    paymentWithSchema['discount.convertionRate.rate'] = paymentWithSchema['amount.convertionRate.rate'];
    paymentWithSchema['discount.usd'] = Number(
      (paymentWithSchema['discount.bs'] / paymentWithSchema['amount.convertionRate.rate']).toFixed(2)
    );

    // Refactorizamos el Object para que asimile al Payments Schema
    return convertObjectStringToSchema(paymentWithSchema);
  });

  // Agregamos deudas unicas en el record
  const uniquePaymentsMap = refactoredPaymentsSchema.reduce((uniquePayments, payment) => {
    // Creamos una llave unica para identificar cada pago
    const key = payment.concept + payment.billId + payment.student.documentId.number + payment.paymentHolder.refId;

    // Buscamos cualquier pago repetida
    if (uniquePayments.has(key)) {
      // Si se repite la pago es porque es necesario sumar el monto
      const amount = {
        bs: uniquePayments.get(key).amount.bs + payment.amount.bs,
        usd: uniquePayments.get(key).amount.usd + payment.amount.usd,
        convertionRate: { ...payment.amount.convertionRate }
      };
      uniquePayments.set(key, { ...payment, amount })
    } else {
      uniquePayments.set(key, payment);
    }
    return uniquePayments;
  }, new Map())

  // Tomamos solo las pagos y no el key del Map
  const uniquePayments = [...uniquePaymentsMap.values()];
  return uniquePayments;
}

async function getPendingDebts() {
  // * El endpoint de las deudas toma como paremetros 'year_init' y 'year_end' ...
  // * ... Estos parametos son irrelevantes ya que siempre retorna las deudas activas
  // * Pero es necesario agregar estos parametros para poder realizar la peticion


  // Creamos la data de un Formulario para hacer un Fetch Post
  var form = new URLSearchParams();
  form.append('o', '2');
  form.append('year_init', DateTime.now().year); // El año es irrelevante siempre que sea mayor al 2019
  form.append('year_end', DateTime.now().year); // El año es irrelevante siempre que sea mayor al 2019

  // Usamos el Endpoint de Alberto para obtener las deudas pendientes registrados en Arcadat
  const config = {
    method: 'post',
    url: 'json/web_service/alberto/pagos/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: form,
  };

  // Obtenemos las deudas registrados en Arcadat
  const {
    data: { data: debts },
  } = await ArcadatClient(config);

  // Son los nuevos conceptos usados actualmente en ARCADAT
  const ALLOWED_DEBTS_CONCEPTS = [
    "00-ANTICIPO MATRICULA",
    "00-ANTICIPO SEPTIEMBRE",
    "00-MATRICULA",
    "00-PLATAFORMA EDUC. CONTROL DE ESTUDIO, EVALUACION Y ADM.",
    "00-SEGURO ESCOLAR",
    "01-SEPTIEMBRE",
    "02-OCTUBRE",
    "03-NOVIEMBRE",
    "04-DICIEMBRE",
    "05-ENERO",
    "06-FEBRERO",
    "07-MARZO",
    "08-ABRIL",
    "09-MAYO",
    "10-JUNIO",
    "11-JULIO",
    "12-AGOSTO",
    "PROYECTO DE INVERSIÓN"
  ]

  // Tomamos solo las deudas con conceptos actualizados
  const allowedDebts = debts.filter(debt => ALLOWED_DEBTS_CONCEPTS.includes(debt.concept));

  // Creamos un diccionario con las propiedades del Fetch y de Debts Schema
  const SCHEMA_MAP = {
    period: 'schoolTerm',
    id_student: 'student.documentId.number',
    name_student: 'student.fullname',
    concept: 'concept',
    amount: 'amount.usd',
    expiration_date: 'status.issuedAt',
  };

  // Refactorizamos el Schema de las deudas registrados en Arcadat
  // A nuestro Schema de deudas
  const refactoredDebtsSchema = allowedDebts.map(debt => {
    // Transformamos las Objects Keys a las usadas en SCHEMA_MAP
    const debtWithSchema = Object.fromEntries(
      Object.entries(debt).map(([key, value]) => {
        const header = SCHEMA_MAP[key]
        // Tomamos solamente la fecha del expiration_date
        if (key === 'expiration_date') return [header, DateTime.fromSQL(value.date).toJSDate()];

        return [header, value];
      })
    );

    // Refactorizamos el Object para que asimile al Debts Schema
    return convertObjectStringToSchema(debtWithSchema);
  });


  // Agregamos deudas unicas en el record
  const uniqueDebtsMap = refactoredDebtsSchema.reduce((uniqueDebts, debt) => {
    // Creamos una llave unica para identificar cada deuda
    const key = debt.schoolTerm + debt.student.fullname + debt.concept + debt.status.issuedAt;
    debt.status.lastUpdate = DateTime.now().toJSDate(); // Agregamos fecha de actualizacion ya que estamos viendo la deuda otra vez
    // Buscamos cualquier deuda repetida
    if (uniqueDebts.has(key)) {
      // Si se repite la deuda es porque es necesario sumar el monto
      uniqueDebts.set(key, { ...debt, amount: { usd: uniqueDebts.get(key).amount.usd + debt.amount.usd } })
    } else {
      uniqueDebts.set(key, debt);
    }
    return uniqueDebts;
  }, new Map())

  // Tomamos solo las deudas y no el key del Map
  const uniqueDebts = [...uniqueDebtsMap.values()];
  return uniqueDebts;
}

async function getAcademicParents() {
  // Fetch un archivo Excel - Ya que no existe un JSON Endpoint para la obtencion de padres academicos
  const options = {
    url: 'rptxls/eGxzZGdw',
    params: {
      p: 'Njk1NA', // Propiedad de busqueda durante el periodo escolar 2022-2023
    },
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

  const { data } = await ArcadatClient(options);

  // Convierte la data del archivo Excel a una estructura JSON
  const parsedExcelData = xlsx.parse(data);

  // Creamos un diccionario con las propiedades del Fetch y de Parents Schema
  const SCHEMA_MAP = {
    Tipo: 'type',
    Identificador: 'documentId.number',
    'Apellidos y Nombres': 'fullname',
    'Teléfonos/Nivel que cursa': 'phones',
    'Correo electrónico': 'email',
  };

  // Refactorizamos la respuesta de Axios y XLSX a que solo retorne la data de los padres... 
  // ... y estos ya ligados a sus respectivos Headers
  const schemedParents = parsedExcelData.reduce(
    (result, data, i, arr) => {
      // Evitamos los headers, ya que solo nos interesa la data de los padres
      const headersIndex = 1;
      const headers = arr[headersIndex].data[0];
      if (i <= headersIndex) return result;

      const parsedData = data.data[0];

      // La propiedad 'Tipo' de los hijos esta vacia, por lo que es necesario agregar 'HIJO' ... 
      // ... como el primer valor del array o tendra errores durante el enlace entre padre-hijo
      if (!parsedData.includes('REPRESENTANTE')) parsedData.unshift('HIJO');

      // Unimos la data de los padres con sus respectivos Headers
      const stringSchemedParent = parsedData.reduce((schemedData, data, idx) => {
        // Eliminamos data innecesaria
        data = data.replace(/TELÉFONOS: /gi, '');
        data = data.replace(/no posee/gi, '');

        const header = SCHEMA_MAP[headers[idx]];


        if (header === 'phones') {
          // Limpiamos y separamos los telefonos
          data = data
            .split('.')
            .map(num => num.trim())
            .filter(num => num);

          // Existen 2 tipos de telefonos, donde si existe un segundo, es el tlf celular
          return {
            ...schemedData,
            // Telefono celular
            'phones.main': data.at(-1),
            // Telefono fijo
            'phones.secondary': data.at(-2),
          }
        }

        // Si despues de validar la data, esta es un campo vacio entonces no la agregamos
        return data
          ?
          {
            ...schemedData,
            [header]: data,
          }
          : schemedData
      }, {});

      // Refactorizamos la data conviertiendo los Headers a una estructura Esquematica
      result.push(convertObjectStringToSchema(stringSchemedParent));

      return result;
    },
    []
  );

  // Asociamos los hijos dentro de los padres en su propiedad 'children:Array[]' 
  const parents = schemedParents.reduce(
    (parentsCollection, data, idx, arr) => {
      const isParent = !data.type.toLowerCase().includes('hijo');
      delete data.type; // Esta propiedad es innecesaria
      if (isParent) {
        // Agregamos al padre
        parentsCollection.push({ ...data, children: [], isParentAcademic: true });
      } else {
        delete data.phones;
        // Agregamos el hijo/a al ultimo padre agregado
        parentsCollection.at(-1).children.push(data);
      }

      return parentsCollection;
    },
    []
  );

  return parents;
}

async function getAdministrativeParents() {
  // Fetch un archivo Excel - Ya que no existe un JSON Endpoint para la obtencion de padres academicos
  const options = {
    url: 'rptxls/eGxzZGdw',
    params: {
      p: 'Njk1NA', // Propiedad de busqueda durante el periodo escolar 2022-2023
      t: 'PWn',
    },
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

  const { data } = await ArcadatClient(options);

  // Convierte la data del archivo Excel a una estructura JSON
  const parsedExcelData = xlsx.parse(data);

  // Creamos un diccionario con las propiedades del Fetch y de Parents Schema
  const SCHEMA_MAP = {
    Tipo: 'type',
    Identificador: 'documentId.number',
    'Apellidos y Nombres': 'fullname',
    'Teléfonos/Nivel que cursa': 'phones',
    'Correo electrónico': 'email',
  };

  // Refactorizamos la respuesta de Axios y XLSX a que solo retorne la data de los padres... 
  // ... y estos ya ligados a sus respectivos Headers
  const schemedParents = parsedExcelData.reduce(
    (result, data, i, arr) => {
      // Evitamos los headers, ya que solo nos interesa la data de los padres
      const headersIndex = 1;
      const headers = arr[headersIndex].data[0];
      if (i <= headersIndex) return result;

      const parsedData = data.data[0];

      // La propiedad 'Tipo' de los hijos esta vacia, por lo que es necesario agregar 'HIJO' ... 
      // ... como el primer valor del array o tendra errores durante el enlace entre padre-hijo
      if (!parsedData.includes('REPRESENTANTE')) parsedData.unshift('HIJO');

      // Unimos la data de los padres con sus respectivos Headers
      const stringSchemedParent = parsedData.reduce((schemedData, data, idx) => {
        // Eliminamos data innecesaria
        data = data.replace(/TELÉFONOS: /gi, '');
        data = data.replace(/no posee/gi, '');

        const header = SCHEMA_MAP[headers[idx]];


        if (header === 'phones') {
          // Limpiamos y separamos los telefonos
          data = data
            .split('.')
            .map(num => num.trim())
            .filter(num => num);

          // Existen 2 tipos de telefonos, donde si existe un segundo, es el tlf celular
          return {
            ...schemedData,
            // Telefono celular
            'phones.main': data.at(-1),
            // Telefono fijo
            'phones.secondary': data.at(-2),
          }
        }

        // Si despues de validar la data, esta es un campo vacio entonces no la agregamos
        return data
          ?
          {
            ...schemedData,
            [header]: data,
          }
          : schemedData
      }, {});

      // Refactorizamos la data conviertiendo los Headers a una estructura Esquematica
      result.push(convertObjectStringToSchema(stringSchemedParent));

      return result;
    },
    []
  );

  // Asociamos los hijos dentro de los padres en su propiedad 'children:Array[]' 
  const parents = schemedParents.reduce(
    (parentsCollection, data, idx, arr) => {
      const isParent = !data.type.toLowerCase().includes('hijo');
      delete data.type; // Esta propiedad es innecesaria
      if (isParent) {
        // Agregamos al padre
        parentsCollection.push({ ...data, children: [], isParentAdministrative: true });
      } else {
        delete data.phones;
        // Agregamos el hijo/a al ultimo padre agregado
        parentsCollection.at(-1).children.push(data);
      }

      return parentsCollection;
    },
    []
  );

  return parents;
}

// Unimos ambos tipos de padres Academicos y Administrativos
// Retornamos todos los padres (siendo estos unicos, no se repiten)
async function getParents() {
  const academicParents = await getAcademicParents();
  const administrativeParents = await getAdministrativeParents();

  // Unimos todos los padres, pero algunos padres son tanto administrativos como academicos
  const allParents = [...academicParents, ...administrativeParents];

  // Eliminamos cualquier padre repetido
  const uniqueParents = allParents.reduce((parentsMap, parent) => {
    const parentKey = parent.documentId.number;

    if (parentsMap.has(parentKey)) {
      // Si ya existe, agregamos cualquier propiedad faltante (Si y solo si las propiedades repetidas tienen el mismo valor)
      const prevParentData = parentsMap.get(parentKey);
      parentsMap.set(parentKey, { ...prevParentData, ...parent })
    } else {
      // Si aun no existe, lo agregamos al diccionario
      parentsMap.set(parentKey, parent);
    }

    return parentsMap;
  }, new Map())

  // Retornamos un Array con los Parents, en vez del Map
  return [...uniqueParents.values()];
}

async function getEmployees() {
  // Fetch un archivo Excel - Ya que no existe un JSON Endpoint para la obtencion de los empleados
  const options = {
    url: 'rptxls/eGxzZGd0',
    params: {
      i: 'OTI',
    },
    responseType: 'arraybuffer',
    transformResponse: [
      data => {
        // Transforma la data para poder leer caracteres especiales en el lexico español
        const dataWithAccents = data.toString('latin1');
        // Tranforma la data a buffer array otra vez
        const arrayBuffer = new TextEncoder().encode(dataWithAccents).buffer;
        return arrayBuffer;
      },
    ],
  };

  const { data } = await ArcadatClient(options);

  // Convierte la data del archivo Excel a una estructura JSON
  const parsedExcelData = xlsx.parse(data);

  // Creamos un diccionario con las propiedades del Fetch y de Employee Schema
  const SCHEMA_MAP = {
    'Tipo de profesor': 'type',
    'N° de identificación': 'documentId.number',
    'Apellidos': 'lastnames',
    'Nombres': 'names',
    'Sexo': 'gender',
    'Fecha de nacimiento': 'birthdate',
    'Edad': 'age',
    'Lugar de nacimiento': 'addressOfBirth.full',
    'Dirección': 'addresses.full',
    'Teléfonos': 'phones.secondary',
    'Teléfono celular': 'phones.main',
    'Correo electrónico': 'email',
    'Estatus': 'status',
  };

  // Refactorizamos la respuesta de Axios y XLSX a que solo retorne la data de los empleados, y estos ya ligados a sus respectivos Headers
  const schemedEmployees = parsedExcelData.reduce((result, data, i, arr) => {
    // Evitamos los headers, ya que solo nos interesa la data de los empleados
    const headersIndex = 1;
    const headers = arr[headersIndex].data[0];
    if (i <= headersIndex) return result;

    const employeeData = data.data[0];
    // Unimos la data de los empleados con sus respectivos Headers
    const stringSchemedEmployee = employeeData.reduce((employee, data, idx) => {
      // Eliminamos caracteres especiales innecesarios en nuestra data
      const specialCharacters = "'-";
      const findSpecialCharacters = new RegExp(`[${specialCharacters}]`, 'gi');
      // En este caso solo eliminamos estos characteres si la data esta sucia
      data = data.length > 1 ? data : data.replace(findSpecialCharacters, '');
      data = data.replace(/no posee/gi, '');

      const header = SCHEMA_MAP[headers[idx]];
      
      // Transformamos la fecha a una reconocida por el constructor Date de JS
      if (header === 'birthdate') data = DateTime.fromFormat(data, 'dd/MM/yyyy').toJSDate();

      // Si despues de validar la data, esta es un campo vacio entonces no la agregamos
      return data
        ? {
          ...employee,
          [header]: data,
        }
        : employee;
    }, {});

    // Agregamos Fullname ya que no viene por defecto en Arcadat
    const { lastnames, names } = stringSchemedEmployee;
    stringSchemedEmployee.fullname = `${lastnames} ${names}`

    const schemedEmployee = convertObjectStringToSchema(stringSchemedEmployee);
    // Verificamos que posea cedula, ya que es indispensable para indentificar al empleado
    const hasDocumentId = Object.keys(schemedEmployee).includes('documentId');
    // Refactorizamos la data conviertiendo los Headers a una estructura Esquematica
    if (hasDocumentId) result.push(schemedEmployee);

    return result;
  }, []);

  // Retornamos la data de los estudiantes ya refactorizada
  return schemedEmployees;

}

module.exports = {
  getStudents,
  getPayments,
  getPendingDebts,
  getAcademicParents,
  getAdministrativeParents,
  getParents,
  getEmployees,
};
