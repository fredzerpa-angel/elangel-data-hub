const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const phonesSchema = require('../schemas/phones.schema');

const userSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    // select: false,
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
    required: false,
  },
  phones: phonesSchema,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  privileges: {
    users: {
      read: {
        type: Boolean,
        default: true,
      },
      upsert: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    events: {
      read: {
        type: Boolean,
        default: true,
      },
      upsert: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
  },
  notifications: {
    students: {
      // Estudiantes que necesitan asistencia academica
      assistance: {
        type: Boolean,
        default: true,
      },
    },
    events: {
      // Eventos que estan en curso
      onGoing: {
        type: Boolean,
        default: true,
      },
    },
    debts: {
      // Deudas de los estudiantes que necesitan ser vigiladas por su acumulacion
      onWatch: {
        type: Boolean,
        default: true,
      },
    }
  }
});

userSchema.pre('save', async function (next) {
  // Solo encriptamos la calve si ha sido modificada o es nueva
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(String(this.password), salt); // bcrypt solo usa Strings
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(String(password), this.password) // bcrypt solo compara Strings
}

// Eliminamos datos sensibles al enviarlos por nuestro API al cliente
userSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.password;
    delete ret._id;
    delete ret.__v;
  }
});

// Conecta userSchema con "Users" colleccion
module.exports = mongoose.model('User', userSchema);
