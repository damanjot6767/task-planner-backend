const express = require('express');
const mongoose = require('mongoose');
const SprintModel = require('../models/sprintmodel');
const TaskModel = require('../models/taskmodel');
const UserModel = require('../models/usermodel');
const UserTaskModel = require('../models/usertaskmodel');
const TaskRouter = express.Router();

//create task
TaskRouter.post('/add', async (req, res) => {
    let {name,id}=req.body
  try {
    const exist =  await TaskModel.findOne({name,sprintId:id})
    if(exist){
    return res.status(201).json({ message: 'Task already Exist!' });
    }
     let newTask = new TaskModel({
      name: name,
      sprintId:id
    });
    // Save task to database
    newTask=await newTask.save();
    const result = await SprintModel.findByIdAndUpdate(id,{$push:{tasks:newTask._id}},{new:true});
    console.log(result)
    return res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

//change statuss
TaskRouter.put('/status/:id', async (req, res) => {
    let {id}=req.params
  try {
     const allTask = await TaskModel.findByIdAndUpdate(id,{$set:{isCompleted:true}},{new:true})
    res.status(201).json({status:'success',message:'Task Completed'});
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//assign task

TaskRouter.post('/assign/:id', async (req, res) => {
    let {userId}=req.body;
    let {id}=req.params;
  try {
    const Task = await UserTaskModel.findOne({userId});
    if(Task){
      Task.tasks.push(id)
      await Task.save()
      return res.status(201).json({ message: 'Task assigned successfully' });
    }
    let tasks=[];
    tasks.push(id);
    const NewTask = await UserTaskModel({userId,tasks});
    await NewTask.save();
    return res.status(201).json({ message: 'Task assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

TaskRouter.post("/All",async (req, res) => {
  const{page}=req.body;
  try {
    const Alluser = await UserModel.find().limit(1).skip(page*1-1)
    const Usertask = await UserTaskModel.aggregate([{
      $match:
      {
      userId:Alluser[0]._id
  }},
  {
      $lookup:
      {
          from:'tasks',
          localField:'tasks',
          foreignField:'_id',
          as:'tasks'
  }
  }
])
    res.status(201).json({ message: 'User fetch successfully',result:Alluser,result1:Usertask});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

TaskRouter.get('/alluser', async (req, res) => {
  try {
    const Alluser = await UserModel.find()
    console.log(Alluser)
    res.status(201).json({ message: 'User fetch successfully',result:Alluser});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

TaskRouter.get('/alltasks', async (req, res) => {
  try {
    const Alluser = await TaskModel.find()
    res.status(201).json({ message: 'tasks fetch successfully',result:Alluser});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

module.exports = TaskRouter