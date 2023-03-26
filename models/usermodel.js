const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  day: Number,
  month: Number,
  date: Number
});

userSchema.pre('save', function (next) {
  const currentDate = new Date();
  this.day = currentDate.getDate();
  this.month = currentDate.getMonth() + 1;
  this.date = currentDate.getFullYear();
  next();
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;