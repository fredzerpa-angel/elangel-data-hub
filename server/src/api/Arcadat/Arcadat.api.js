const axios = require('axios');
const { DateTime } = require('luxon');
const {
  convertObjectStringToSchema,
  fetchAndParseExcelLatinFileToJSON,
  getCurrentSchoolTerm,
} = require('../../utils/functions.utils');

const ArcadatClient = axios.create({
  baseURL: 'https://www.arcadat.com/apps/',
});

// Arcadat no provee el tipo de documento de identidad, por lo que lo calculamos
const getDocumentIdType = {
  student: documentIdNumber => {
    if (isNaN(Number(documentIdNumber))) return 'Pasaporte';

    return documentIdNumber.length > 8 ? 'Cedula Escolar' : 'Cedula';
  },

  paymentHolder: documentIdNumber => {
    if (Number(documentIdNumber)) return 'Cedula';

    // Usando RegEx podemos verificar si es un RIF ("J-" o "J" seguido de numeros)
    return documentIdNumber.match(/^J-?[1-9]+/i) ? 'RIF' : 'Pasaporte';
  },
};

async function getStudents() {
  const parsedExcelData = await fetchAndParseExcelLatinFileToJSON(
    'https://www.arcadat.com/apps/rptxls/eGxzZGdzYQ',
    {
      p: 'Njk1NA', // Propiedad de busqueda durante el periodo escolar 2022-2023
    }
  );

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
    'Identificador padre': 'familyMembers.parents.father.documentId.number',
    'Apellidos y nombres del padre': 'familyMembers.parents.father.fullname',
    'Teléfonos padre': 'familyMembers.parents.father.phones.secondary',
    'Teléfono celular padre': 'familyMembers.parents.father.phones.main',
    'Correo electrónico padre': 'familyMembers.parents.father.email',
    'Identificador madre': 'familyMembers.parents.mother.documentId.number',
    'Apellidos y nombres de la madre': 'familyMembers.parents.mother.fullname',
    'Teléfonos madre': 'familyMembers.parents.mother.phones.secondary',
    'Teléfono celular madre': 'familyMembers.parents.mother.phones.main',
    'Correo electrónico madre': 'familyMembers.parents.mother.email',
    'Identificador representante':
      'familyMembers.parents.admin.documentId.number',
    'Apellidos y nombres Representante': 'familyMembers.parents.admin.fullname',
    'Teléfonos representante': 'familyMembers.parents.admin.phones.secondary',
    'Teléfono celular representante': 'familyMembers.parents.admin.phones.main',
    'Correo electrónico representante': 'familyMembers.parents.admin.email',
    'Codigo de afiliado domiciliacion': 'directDebit.affiliatedCode',
    'Id afiliado domiciliacion': 'directDebit.id',
    'Nombre afiliado domiciliacion': 'directDebit.name',
    'Cuenta domiciliacion': 'directDebit.account',
  };

  // Refactorizamos la respuesta de Axios y XLSX a que solo retorne la data de los estudiantes, y estos ya ligados a sus respectivos Headers
  const schemedStudents = parsedExcelData.reduce(
    (schemedStudents, data, i, arr) => {
      // Evitamos los headers, ya que solo nos interesa la data de los estudiantes
      const headersIndex = 1;
      const headers = arr[headersIndex].data[0];
      if (i <= headersIndex) return schemedStudents;

      const studentData = data.data[0];
      // Unimos la data de los estudiantes con sus respectivos Headers
      const stringSchemedStudent = studentData.reduce(
        (schemedData, data, idx) => {
          // Eliminamos caracteres especiales innecesarios en nuestra data
          const specialCharacters = "'-";
          const findSpecialCharacters = new RegExp(
            `[${specialCharacters}]`,
            'gi'
          );
          // En este caso solo eliminamos estos characteres si la data esta sucia
          data =
            data.length > 1 ? data : data.replace(findSpecialCharacters, '');
          data = data.replace(/no posee/gi, '');

          const header = SCHEMA_MAP[headers[idx]];

          // Transformamos la fecha a una reconocida por el constructor Date de JS
          if (header === 'birthdate')
            data = DateTime.fromFormat(data, 'dd/MM/yyyy')
              .setLocale('es')
              .toLocaleString(DateTime.DATE_SHORT);

          // Si despues de validar la data, esta es un campo vacio entonces no la agregamos
          return data
            ? {
              ...schemedData,
              [header]: data,
            }
            : schemedData;
        },
        {}
      );

      // Agregamos el tipo de documento de identidad, es Cedula, Cedula Escolar o Pasaporte
      stringSchemedStudent['documentId.type'] = getDocumentIdType.student(
        stringSchemedStudent['documentId.number']
      );

      // Refactorizamos la data conviertiendo los Headers a una estructura Esquematica
      // Agregamos que esta activo ya que ARCADAT solo retorna los estudiantes cursantes
      schemedStudents.push(
        convertObjectStringToSchema({ ...stringSchemedStudent, isActive: true })
      );

      return schemedStudents;
    },
    []
  );

  // Retornamos la data de los estudiantes ya refactorizada
  return schemedStudents;
}

async function getPayments() {
  // * El endpoint de los pagos toma como parametos 'year_init' y 'year_end'
  // * Retorna los pagos tomando encuenta este rango filtrandolos por 'payment_date'

  // Creamos la data de un Formulario para hacer un Fetch Post
  var form = new URLSearchParams();
  form.append('o', '1');
  form.append('year_init', DateTime.now().minus({ years: 1 }).year); // 2020 es el año mas antiguo seleccionable
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

  // Filtramos la cantidad de pagos
  // Tomamos aquellos que el periodo escolar tenga el año actual (Toma hasta 2 periodos)
  const allowedPayments = payments.filter(payment =>
    payment.period.includes(DateTime.now().year)
  );

  // Creamos un diccionario con las propiedades del Fetch y de Payments Schema
  const SCHEMA_MAP = {
    period: 'schoolTerm',
    concept: 'concept',
    bill: 'billId',
    payment_date: 'time.date',
    payment_hour: 'time.hour',
    name_user: 'cashier.fullname',
    id_payment_holder: 'paymentHolder.documentId.number',
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
  const refactoredPaymentsSchema = allowedPayments.map(payment => {
    // Transforma las Keys de los Objects a seguir el SCHEMA_MAP
    const paymentWithSchema = Object.fromEntries(
      Object.entries(payment).map(([key, value]) => {
        const header = SCHEMA_MAP[key];
        return [header, value];
      })
    );

    // Limpiamos los valores
    const paymentDateTime = DateTime.fromFormat(
      paymentWithSchema['time.date'] + ' ' + paymentWithSchema['time.hour'],
      'yyyy/MM/dd TT'
    ).setLocale('es');
    paymentWithSchema['time.date'] = paymentDateTime.toLocaleString(
      DateTime.DATE_SHORT
    );
    paymentWithSchema['time.hour'] = paymentDateTime.toLocaleString(
      DateTime.TIME_WITH_SECONDS
    );
    paymentWithSchema['time.datetime'] = paymentDateTime.toLocaleString(
      DateTime.DATETIME_SHORT_WITH_SECONDS
    );
    paymentWithSchema['isCredit'] = Boolean(paymentWithSchema['isCredit']);
    paymentWithSchema['canceled'] = Boolean(paymentWithSchema['canceled']);
    // Añadimos propiedades faltantes a nuestro pago
    paymentWithSchema['student.documentId.type'] = getDocumentIdType.student(
      paymentWithSchema['student.documentId.number']
    );
    paymentWithSchema['paymentHolder.documentId.type'] =
      getDocumentIdType.paymentHolder(
        paymentWithSchema['paymentHolder.documentId.number']
      );
    paymentWithSchema['amount.convertionRate.date'] =
      paymentWithSchema['time.date'];
    paymentWithSchema['discount.convertionRate.date'] =
      paymentWithSchema['time.date'];
    paymentWithSchema['discount.convertionRate.rate'] =
      paymentWithSchema['amount.convertionRate.rate'];
    paymentWithSchema['discount.usd'] = Number(
      (
        paymentWithSchema['discount.bs'] /
        paymentWithSchema['amount.convertionRate.rate']
      ).toFixed(2)
    );

    // Refactorizamos el Object para que asimile al Payments Schema
    return convertObjectStringToSchema(paymentWithSchema);
  });

  // Tomamos solamente los pagos unicos (los pagos repetidos no son duplicas)
  const uniquePayments = [
    ...refactoredPaymentsSchema
      .reduce((uniquePayments, payment) => {
        // Creamos una llave unica para identificar cada pago
        const key = payment.concept + payment.billId + payment.student.fullname;

        // Buscamos cualquier pago repetido
        if (uniquePayments.has(key)) {
          // Si se repite el pago es porque es necesario sumar el monto
          const amount = {
            bs: uniquePayments.get(key).amount.bs + payment.amount.bs,
            usd: uniquePayments.get(key).amount.usd + payment.amount.usd,
            convertionRate: { ...payment.amount.convertionRate },
          };
          uniquePayments.set(key, { ...payment, amount });
        } else {
          uniquePayments.set(key, payment);
        }
        return uniquePayments;
      }, new Map())
      .values(),
  ];

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

  // Tomamos solo las deudas del ultimo año
  // ! Cualquier deuda mayor a 2 años sera excluida
  const allowedDebts = debts.filter(debt =>
    debt.period.includes(DateTime.now().year)
  );

  // Creamos un diccionario con las propiedades del Fetch y de Debts Schema
  const SCHEMA_MAP = {
    period: 'schoolTerm',
    id_student: 'student.documentId.number',
    name_student: 'student.fullname',
    concept: 'concept',
    amount: 'amount.pending.usd',
    expiration_date: 'status.issuedAt',
  };

  // Refactorizamos el Schema de las deudas registrados en Arcadat
  // A nuestro Schema de deudas
  const refactoredDebtsSchema = allowedDebts.map(debt => {
    // Transformamos las Objects Keys a las usadas en SCHEMA_MAP
    const debtWithSchema = Object.fromEntries(
      Object.entries(debt).map(([key, value]) => {
        const header = SCHEMA_MAP[key];
        // Tomamos solamente la fecha del expiration_date
        if (key === 'expiration_date')
          return [
            header,
            DateTime.fromSQL(value.date)
              .setLocale('es')
              .toLocaleString(DateTime.DATE_SHORT),
          ];

        return [header, value];
      })
    );

    debtWithSchema['status.pending'] = true;

    // Refactorizamos el Object para que asimile al Debts Schema
    return convertObjectStringToSchema(debtWithSchema);
  });

  // Agregamos deudas unicas en el record
  const uniqueDebtsMap = refactoredDebtsSchema.reduce((uniqueDebts, debt) => {
    // Creamos una llave unica para identificar cada deuda
    const key =
      debt.schoolTerm +
      debt.student.fullname +
      debt.concept +
      debt.status.issuedAt;

    // Buscamos cualquier deuda repetida
    if (uniqueDebts.has(key)) {
      // Si se repite la deuda es porque es necesario sumar el monto
      uniqueDebts.set(key, {
        ...debt,
        amount: { usd: uniqueDebts.get(key).amount.usd + debt.amount.usd },
      });
    } else {
      uniqueDebts.set(key, debt);
    }
    return uniqueDebts;
  }, new Map());

  // Tomamos solo las deudas y no el key del Map
  const uniqueDebts = [...uniqueDebtsMap.values()];
  return uniqueDebts;
}

async function getAcademicParents() {
  const parsedExcelData = await fetchAndParseExcelLatinFileToJSON(
    'https://www.arcadat.com/apps/rptxls/eGxzZGdw',
    {
      p: 'Njk1NA', // Propiedad de busqueda durante el periodo escolar 2022-2023
    }
  );

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
  const schemedParents = parsedExcelData.reduce((result, data, i, arr) => {
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
        };
      }

      // Si despues de validar la data, esta es un campo vacio entonces no la agregamos
      return data
        ? {
          ...schemedData,
          [header]: data,
        }
        : schemedData;
    }, {});

    // Refactorizamos la data conviertiendo los Headers a una estructura Esquematica
    result.push(convertObjectStringToSchema(stringSchemedParent));

    return result;
  }, []);

  // Asociamos los hijos dentro de los padres en su propiedad 'children:Array[]'
  const parents = schemedParents.reduce((parentsCollection, data, idx, arr) => {
    const isParent = !data.type.toLowerCase().includes('hijo');
    delete data.type; // Esta propiedad es innecesaria
    if (isParent) {
      // Agregamos al padre
      parentsCollection.push({
        ...data,
        documentId: {
          ...data.documentId,
          type: getDocumentIdType.paymentHolder(data.documentId.number),
        },
        children: [],
        isParentAcademic: true,
      });
    } else {
      delete data.phones;
      // Agregamos el hijo/a al ultimo padre agregado
      parentsCollection.at(-1).children.push(data);
    }

    return parentsCollection;
  }, []);

  return parents;
}

async function getAdministrativeParents() {
  const parsedExcelData = await fetchAndParseExcelLatinFileToJSON(
    'https://www.arcadat.com/apps/rptxls/eGxzZGdw',
    {
      p: 'Njk1NA', // Propiedad de busqueda durante el periodo escolar 2022-2023
      t: 'PWn',
    }
  );

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
  const schemedParents = parsedExcelData.reduce((result, data, i, arr) => {
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
        };
      }

      // Si despues de validar la data, esta es un campo vacio entonces no la agregamos
      return data
        ? {
          ...schemedData,
          [header]: data,
        }
        : schemedData;
    }, {});

    // Refactorizamos la data conviertiendo los Headers a una estructura Esquematica
    result.push(convertObjectStringToSchema(stringSchemedParent));

    return result;
  }, []);

  // Asociamos los hijos dentro de los padres en su propiedad 'children:Array[]'
  const parents = schemedParents.reduce((parentsCollection, data, idx, arr) => {
    const isParent = !data.type.toLowerCase().includes('hijo');
    delete data.type; // Esta propiedad es innecesaria
    if (isParent) {
      // Agregamos al padre
      parentsCollection.push({
        ...data,
        documentId: {
          ...data.documentId,
          type: getDocumentIdType.paymentHolder(data.documentId.number),
        },
        children: [],
        isParentAdmin: true,
      });
    } else {
      delete data.phones;
      // Agregamos el hijo/a al ultimo padre agregado
      parentsCollection.at(-1).children.push(data);
    }

    return parentsCollection;
  }, []);

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
      parentsMap.set(parentKey, { ...prevParentData, ...parent });
    } else {
      // Si aun no existe, lo agregamos al diccionario
      parentsMap.set(parentKey, parent);
    }

    return parentsMap;
  }, new Map());

  // Retornamos un Array con los Parents, en vez del Map
  return [...uniqueParents.values()];
}

async function getEmployees() {
  const parsedExcelData = await fetchAndParseExcelLatinFileToJSON(
    'https://www.arcadat.com/apps/rptxls/eGxzZGd0',
    { i: 'OTI' }
  );

  // Creamos un diccionario con las propiedades del Fetch y de Employee Schema
  const SCHEMA_MAP = {
    'Tipo de profesor': 'type',
    'N° de identificación': 'documentId.number',
    Apellidos: 'lastnames',
    Nombres: 'names',
    Sexo: 'gender',
    'Fecha de nacimiento': 'birthdate',
    Edad: 'age',
    'Lugar de nacimiento': 'addressOfBirth.full',
    Dirección: 'addresses.full',
    Teléfonos: 'phones.secondary',
    'Teléfono celular': 'phones.main',
    'Correo electrónico': 'email',
    Estatus: 'status',
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
      if (header === 'birthdate')
        data = DateTime.fromFormat(data, 'dd/MM/yyyy').toLocaleString(
          DateTime.DATE_SHORT
        );

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
    stringSchemedEmployee.fullname = `${lastnames} ${names}`;

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

async function getGrades() {
  const BASE_URL = `https://arcadat.com/apps/rptxls/eGxzX2V4cG9ydF9yZQ/`;
  // Un Map de los URLS de los archivos Excel de las notas de cada salon
  const gradesExcelFilesParamsMap = {
    // TODO: Agregar pre-escolar y primaria
    elementary: {},
    middleschool: {},
    highschool: {
      firstYear: {
        n: 'MTY2OQ', // n = salon
        p: 'Njk1NA', // p = periodo escolar
        pe: 'ODMw',
        i: 'OTI',
      },
      secondYear: {
        n: 'MTY3MA', // n = salon
        p: 'Njk1NA', // p = periodo escolar
        pe: 'ODMw',
        i: 'OTI',
      },
      thirdYear: {
        n: 'MTY3MQ', // n = salon
        p: 'Njk1NA', // p = periodo escolar
        pe: 'ODMw',
        i: 'OTI',
      },
      fourthYear: {
        n: 'MTY3Mg', // n = salon
        p: 'Njk1NA', // p = periodo escolar
        pe: 'ODMw',
        i: 'OTI',
      },
      fifthYear: {
        n: 'MTY3Mw', // n = salon
        p: 'Njk1NA', // p = periodo escolar
        pe: 'ODMw',
        i: 'OTI',
      },
    },
  };

  const fetchedGradesByStages = await Object.entries(gradesExcelFilesParamsMap).reduce(async (stages, [eduLevel, classroomGradesParams]) => {

    const fetchGradesByEducationLevel = async (level, { fetchParams }) => {
      return await Object.entries(level).reduce(async (levels, [classroomGrade, gradeParams]) => ({
        ...await levels,
        [classroomGrade]: await fetchAndParseExcelLatinFileToJSON(BASE_URL, { ...gradeParams, ...fetchParams }),
      }), {})
    }

    const stagesParamsMap = {
      first: { l: 'MQ', }, // l = lapso, 1er lapso
      second: { l: 'Mg', }, // l = lapso, 2do lapso
      third: { l: 'Mw', }, // l = lapso, 3er lapso
    }

    return {
      first: {
        ...(await stages).first,
        [eduLevel]: await fetchGradesByEducationLevel(classroomGradesParams, { fetchParams: stagesParamsMap.first }),
      },
      second: {
        ...(await stages).second,
        [eduLevel]: await fetchGradesByEducationLevel(classroomGradesParams, { fetchParams: stagesParamsMap.second }),
      },
      third: {
        ...(await stages).third,
        [eduLevel]: await fetchGradesByEducationLevel(classroomGradesParams, { fetchParams: stagesParamsMap.third }),
      },
    }

  }, { first: {}, second: {}, third: {} })

  const schemedGradesByEducationLevel = Object.entries(fetchedGradesByStages)
    .reduce((schemedGradesByEducationLevel, [stage, educationLevelsGrades]) => {
      // Esta funcion nos devolvera la data de las calificaciones del salon en el esquema de 'yearsGrades.schema.js`
      const schemeClassroomGrades = year => year.reduce((studentsGrades, { data: [data] }, idx, dataArray) => {
        const headersLastIndex = 1; // Usamos este valor para saltar datos innecesarios del array
        const headersIndex = 1;
        const headers = dataArray[headersIndex].data.flat()

        // Saltamos cualquier data que no sea del estudiante
        const isNotStudentData = isNaN(Number(data[0])) || data.length !== headers.length;
        if ((idx <= headersLastIndex) || isNotStudentData) return studentsGrades;

        const dataWithHeaders = headers.reduce((dataWithHeaders, header, idx) => ({ ...dataWithHeaders, [header]: data.at(idx) }), {})

        // Diccionario de datos de las materias dadas
        const subjectsCodeMap = {
          // TODO: agregar las materias de preescolar y primaria
          CA: 'CASTELLANO',
          ILE: 'INGLES Y OTRAS LENGUAS EXTRANJERAS',
          MA: 'MATEMÁTICA',
          EF: 'EDUCACION FISICA',
          AP: 'ARTE Y PATRIMONIO',
          CN: 'CIENCIAS NATURALES',
          GHC: 'GEOGRAFIA, HISTORIA Y CIUDADANIA',
          OC: 'ORIENTACION Y CONVIVENCIA',
          PG: 'PART. EN GRUPOS DE CREACIÓN, RECREACIÓN Y PRODUCCIÓN',
          FI: 'FISICA',
          QU: 'QUIMICA',
          BI: 'BIOLOGIA',
          CT: 'CIENCIAS DE LA TIERRA',
          FS: 'FORMACION PARA LA SOBERANIA NACIONAL',
        };

        const subjectsCodeWithGrades = Object.fromEntries(Object.entries(dataWithHeaders).filter(([key, value]) => Object.keys(subjectsCodeMap).includes(key)));

        // Formateamos la data de las materias calificadas al esquema de 'yearGrades.schema.js' 
        const schemedSubjectsWithGrades = Object.entries(subjectsCodeWithGrades).map(([code, grade]) => ({
          subject: { code, name: subjectsCodeMap[code] },
          grade,
        }))

        // Sacamos la informacion relevante del estudiante
        const student = {
          documentId: { number: dataWithHeaders['N° de Identificación'] },
          fullname: dataWithHeaders['Estudiante'],
        }
        const section = dataWithHeaders['Sección'];

        // Los estudiantes son unicos, por lo que no habra duplicados que sobreescriban la data
        studentsGrades.push({ student, stages: { [stage]: { section, subjects: schemedSubjectsWithGrades } } });

        return studentsGrades;
      }, []);

      // Creamos un esquema de los niveles academicos con sus calificaciones
      // Ex: { elementary: {...}, middleschool: {...}, highschool: { firstYear: [Grades] } }
      // ! Le falta incluir las notas por lapsos
      const schemedEducationLevelsGrades = Object.entries(educationLevelsGrades).reduce((schemedGrades, [level, classroomGrade]) => {
        const schemedClassroomsGrades = Object.fromEntries(Object.entries(classroomGrade).map(([classGrade, grades]) => [classGrade, schemeClassroomGrades(grades)]))

        return {
          ...schemedGrades,
          [level]: schemedClassroomsGrades
        };
      }, {})

      // Agregamos las notas por lapsos al esquema de notas por nivel academico
      const schemedEducationLevelsGradesByStages = Object.entries(schemedEducationLevelsGrades)
        .reduce((schema, [educationLevel, classroomGrades]) => {
          const classroomGradesByStages = Object.fromEntries(Object.entries(classroomGrades).map(([classroom, grades]) => {
            const gradesByStages = grades.map(grade => {
              const prevStagesGrades = schema[educationLevel][classroom]?.find(schemaGrade =>
                schemaGrade?.student?.fullname === grade.student.fullname
              )?.stages

              return {
                ...grade,
                stages: { ...prevStagesGrades, ...grade.stages }
              }
            })

            return [classroom, gradesByStages]
          }))

          return {
            ...schema,
            [educationLevel]: classroomGradesByStages,
          }

        }, schemedGradesByEducationLevel)

      return schemedEducationLevelsGradesByStages
    }, {
      schoolTerm: getCurrentSchoolTerm(),
      elementary: {},
      middleschool: {},
      highschool: {},
    })

  return schemedGradesByEducationLevel;
}

module.exports = {
  getStudents,
  getPayments,
  getPendingDebts,
  getAcademicParents,
  getAdministrativeParents,
  getParents,
  getEmployees,
  getGrades,
};
