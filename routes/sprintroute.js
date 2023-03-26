const express = require('express');
const SprintModel = require('../models/sprintmodel');
const SprintRouter = express.Router();

//create sprint
SprintRouter.post('/add', async (req, res) => {
    const {name}=req.body;

  try {
     const exist = await SprintModel.findOne({name:name});
     if(exist){
      return res.status(201).json({ message: 'Sprint alredy exist!' });
     }
     const newSprint = new SprintModel({
      name: name
    });

    // Save user to database
    await newSprint.save();

    return res.status(201).json({ message: 'Sprint created successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//get sprint
SprintRouter.post('/get', async (req, res) => {
  let{page}=req.body;
  page = Number(page)
  console.log(page)
  try {
     const allSprint = await SprintModel.aggregate([{$lookup:
        {
            from:'tasks',
            localField:'tasks',
            foreignField:'_id',
            as:'tasks'
    }}, { $skip: page*1-1 },
    { $limit: 1 }])

    res.status(201).json({status:'success',message:allSprint});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = SprintRouter