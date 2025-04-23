const Task = require("../models/taskModel");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Error occurred while fetching tasks");
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.getTaskById(id);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).send("Error occurred while fetching task");
  }
};

exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;
  console.log("Incoming data from client:", req.body);
  const data = { title, description, status };

  try {
    const result = await Task.postTask(data);
    console.log("Task created successfully:", result);
    return res.status(201).json({
      message: "Task created",
      task: {
        id: result.insertId, // if you're using auto_increment ID
        ...data,
      },
    });
  } catch (err) {
    console.error("Error creating task:", err);
    return res.status(500).json({ error: "Failed to create task" });
  }
};

exports.updateTask = async (req, res) => {
  const {id} = req.params;
  const {status} = req.body;

  Task.updateTaskStatus(id,status, (err, results) => {
    if (err) {
      console.error("Error updating status:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task status updated successfully", id });
  });
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Task.deleteTask(id);
    if (!result.affectedRows) {
      return res.status(404).send("Task not found");
    }
    res.json({ message: "Task deleted successfully", taskId: id });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Error occurred while deleting task");
  }
};
