const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  tasks:[
    {type: mongoose.Types.ObjectId,ref:'tasks'}
  ],
  day: Number,
  month: Number,
  date: Number
});

sprintSchema.pre('save', function (next) {
  const currentDate = new Date();
  this.day = currentDate.getDate();
  this.month = currentDate.getMonth() + 1;
  this.date = currentDate.getFullYear();
  next();
});

const SprintModel = mongoose.model('sprints', sprintSchema);

module.exports = SprintModel;