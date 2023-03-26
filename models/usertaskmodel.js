const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref:'users'
      },
    tasks:[ {type: mongoose.Types.ObjectId,ref:'tasks'}],
   day: Number,
   month: Number,
   date: Number
});

userTaskSchema.pre('save', function (next) {
  const currentDate = new Date();
  this.day = currentDate.getDate();
  this.month = currentDate.getMonth() + 1;
  this.date = currentDate.getFullYear();
  next();
});

const UserTaskModel = mongoose.model('usertasks', userTaskSchema);

module.exports = UserTaskModel;