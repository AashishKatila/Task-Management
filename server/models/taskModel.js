const db = require("../config/db");

exports.getAllTasks = (callback) => {
  db.query("SELECT * FROM task_management", callback);
};

exports.getTaskById = (id, callback) => {
  db.query("SELECT * FROM task_management WHERE id = ?", [id], callback);
};

exports.postTask = (data,callback) => {
  db.query("INSERT INTO task_management (title,description,status) VALUES (?,?,?)",[data.title,data.description,data.status],callback);
}

exports.updateTask = (id,data,callback) => {
  db.query("UPDATE task_management SET title = ?, description = ?, status = ? WHERE id = ?",[data.title,data.description,data.status,id],callback);
}

exports.deleteTask = (id,callback) => {
  db.query("DELETE FROM task_management WHERE id = ?",[id],callback);
}