const mongoose = require('mongoose');
const addressSchema = require('../schemas/addresses.schema');
const documentsIdSchema = require('../schemas/documentsId.schema');
const yearGradeSchema = require('../schemas/yearGrades.schema');
const phonesSchema = require('../schemas/phones.schema');

const studentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  imageUrl: {
    type: String,
    required: false,
  },
  documentId: {
    type: documentsIdSchema,
    required: false,
  },
  gradeLevelAttended: {
    type: String,
    required: false,
  },
  paymentPlan: {
    type: String,
    required: false,
  },
  discountPlan: {
    type: String,
    required: false,
  },
  names: {
    type: String,
    required: false,
  },
  lastnames: {
    type: String,
    required: false,
  },
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
    // Chequea que sean valores unicos si no son null
    // Existen correos repetidos entre estudiantes, usan el de los padres
    // index: {
    //   unique: true,
    //   partialFilterExpression: { email: { $type: 'string' } },
    // },
  },
  gender: {
    type: String,
    required: false,
  },
  birthdate: {
    type: String,
    required: false,
  },
  // Se separa de las direcciones tradicionales, ya que es unica
  addressOfBirth: {
    type: addressSchema,
    required: false,
  },
  // Se puede tener 1 o mas direcciones
  addresses: {
    type: [addressSchema],
    required: false,
  },
  phones: phonesSchema,

  familyMembers: {
    parents: {
      father: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: false,
      },
      mother: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: false,
      },
      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: false,
      },
      academic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: false,
      },
    },
    siblings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  },

  // Domiciliación
  directDebit: {
    id: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    account: {
      type: Number,
      required: false,
    },
  },

  isActive: {
    type: Boolean,
    required: false
  },

  grades: { // Calificaciones
    elementary: {
      firstLevel: [yearGradeSchema],
      secondLevel: [yearGradeSchema],
      thirdLevel: [yearGradeSchema],
    },
    middleschool: {
      firstGrade: [yearGradeSchema],
      secondGrade: [yearGradeSchema],
      thirdGrade: [yearGradeSchema],
      fourthGrade: [yearGradeSchema],
      fifthGrade: [yearGradeSchema],
      sixthGrade: [yearGradeSchema],
    },
    highschool: {
      firstYear: [yearGradeSchema],
      secondYear: [yearGradeSchema],
      thirdYear: [yearGradeSchema],
      fourthYear: [yearGradeSchema],
      fifthYear: [yearGradeSchema],
    }
  }
});

// Eliminamos datos sensibles al enviarlos por nuestro API al cliente
studentSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret._id;
    delete ret.__v;
  }
});

// Conecta studentSchema con "Students" colleccion
module.exports = mongoose.model('Student', studentSchema);
