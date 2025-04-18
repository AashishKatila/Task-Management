const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database", err);
  } else {
    console.log("Connected to database");
  }
});

module.exports = db;