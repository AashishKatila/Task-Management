const Task = require("../models/taskModel");

exports.getAllTasks = (req, res) => {
  Task.getAllTasks((err, results) => {
    if (err) return res.status(500).send("Error occurred");
    res.send(results);
  });
};

exports.getTaskById = (req, res) => {
  const { id } = req.params;
  Task.getTaskById(id, (err, results) => {
    if (err) return res.status(500).send("Error occurred");
    res.send(results);
  });
};

exports.createTask = (req, res) => {
  const { title, description, status } = req.body;
  Task.createTask(title, description, status, (err, results) => {
    if (err) return res.status(500).send("Error occurred");
    res.send(results);
  });
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  Task.updateTask(id, title, description, status, (err, results) => {
    if (err) return res.status(500).send("Error occurred");
    res.send(results);
  });
};

exports.deleteTask = (req,res) =>{
    const {id} = req.params;
    Task.deleteTask(id,(err,results)=>{
        if(err) return res.status(500).send("Error occurred");
        res.send(results);
    })
}