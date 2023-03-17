const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
  }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hashSync(this.password, 10, (err, passwordHashed) => {
    if (err) return next(err);

    this.password = passwordHashed;
    next();
  })
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.methods.setPassword = async function (password, cb) {
  const passwordHashed = await bcrypt.hash(password, 10);
  return await this.updateOne({ password: passwordHashed }, cb);
}

// Conecta userSchema con "Users" colleccion
module.exports = mongoose.model('User', userSchema);
