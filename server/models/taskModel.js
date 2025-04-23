const db = require("../config/db");

// Ensure you're using promise-based query
exports.getAllTasks = async () => {
  try {
    const [results] = await db.promise().query("SELECT * FROM task_management");
    return results;
  } catch (err) {
    throw new Error('Error fetching tasks: ' + err);
  }
};

exports.getTaskById = async (id) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM task_management WHERE id = ?", [id]);
    return results;
  } catch (err) {
    throw new Error('Error fetching task: ' + err);
  }
};

exports.postTask = async (data) => {
  try {
    const [results] = await db.promise().query(
      "INSERT INTO task_management (title, description, status) VALUES (?, ?, ?)",
      [data.title, data.description, data.status]
    );
    return results;
  } catch (err) {
    throw new Error('Error inserting task: ' + err);
  }
};

exports.updateTaskStatus = (id, status, callback) => {
  const allowedStatuses = ["todo", "in_progress", "completed"];
  if (!allowedStatuses.includes(status)) {
    return callback(new Error("Invalid status"));
  }

  db.query(
    "UPDATE task_management SET status = ? WHERE id = ?",
    [status, id],
    callback
  );
};

exports.deleteTask = async (id) => {
  try {
    const [results] = await db.promise().query("DELETE FROM task_management WHERE id = ?", [id]);
    return results;
  } catch (err) {
    throw new Error('Error deleting task: ' + err);
  }
};
