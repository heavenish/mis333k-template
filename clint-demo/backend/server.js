const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Setup
const db = mysql.createConnection({
  host: 'employeedatabase.ctd1kqohkp53.us-east-1.rds.amazonaws.com',
  user: 'adminuser34',
  password: 'Timnpw10!',
  database: 'EmployeeDB'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Route to Get Employees (GET)
app.get('/employees', (req, res) => {
  const sqlQuery = 'SELECT * FROM Employees';
  db.query(sqlQuery, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Route to Add Employee (POST)
app.post('/employees', (req, res) => {
  const { first_name, last_name, address, salary } = req.body;
  const sqlQuery = 'INSERT INTO Employees (first_name, last_name, address, salary) VALUES (?, ?, ?, ?)';
  db.query(sqlQuery, [first_name, last_name, address, salary], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: result.insertId, first_name, last_name, address, salary });
    }
  });
});

// Route to Edit Employee (PUT)
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, address, salary } = req.body;
  const sqlQuery = 'UPDATE Employees SET first_name = ?, last_name = ?, address = ?, salary = ? WHERE id = ?';
  db.query(sqlQuery, [first_name, last_name, address, salary, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id, first_name, last_name, address, salary });
    }
  });
});

// Route to Delete Employee (DELETE)
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const sqlQuery = 'DELETE FROM Employees WHERE id = ?';
  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: `Employee with ID ${id} deleted.` });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
