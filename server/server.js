require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db.js");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/tasks", async (req, res) => {
    db.query("SELECT * FROM task_management",(err,results)=>{
      if(err){
        console.log("Error occured",err);
        return res.status(500).send("Error occured");
      }
      console.log("All datas from db",results);
      return res.send(results);
    });
});

app.get("/tasks/:id", (req, res) => {
  db.query("SELECT * FROM task_management WHERE id = ?", [req.params.id], (err, results) => {
    if (err) {
      console.log("Error occured", err);
      return res.status(500).send("Error occured");
    }
    console.log("All datas from db", results);
    return res.send(results); 
  });
});

app.post('/tasks',(req,res) =>{
  const {title,description,status} = req.body;

  console.log("Incoming data",req.body);
  
  if(!title){
    res.status(400).send("Title is required");
  }
  let finalStatus = status;
  if (!status || !['todo', 'in_progress', 'completed'].includes(status)) {
    finalStatus = 'todo'; 
  }

  db.query("INSERT INTO task_management (title,description,status) VALUES (?,?,?)",[title,description,finalStatus],(err,results)=>{
    
    if(err){
      console.log("Error occured",err);
      return res.status(500).send("Error occured");
    }
    console.log("All datas from db",results);
    return res.status(201).json({
      title,
      description,
      status: finalStatus,
    });
  });
})

app.put('/tasks/:id', (req, res) => {
  const { taskId, status } = req.body;

  // Validate taskId and status
  if (!taskId) {
    return res.status(400).send("Task ID is required");
  }

  const allowedStatuses = ["todo", "in_progress", "completed"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).send("Invalid status value");
  }

  // Update the task status
  db.query("UPDATE task_management SET status = ? WHERE id = ?", [status, taskId], (err, results) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).send("Error updating task");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    res.status(200).json({ message: "Task status updated successfully", taskId, status });
  });
});

app.delete('/tasks/:id', (req,res) =>{
  const {id} = req.params;

  console.log("Incoming data",id);
  
  if(!id){
    res.status(400).send("Id is required");
  }

  db.query("DELETE FROM task_management where id = ?",[id],(err,results)=>{ 
    if(err){
      console.log("Error deleting task",err);
      return res.status(500).send("Error deleting task");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }
    res.status(200).json({ message: "Task deleted successfully", id });
  });
})


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});