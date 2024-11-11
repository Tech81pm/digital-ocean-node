// server.js

const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});

// Routes

// GET all users
app.get('/table', (req, res) => {
  db.query('SELECT * FROM test_table', (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// POST new user
app.post('/table', (req, res) => {
  const { name, age, address } = req.body;

  if (!name || !age || !address) {
    return res.status(400).send({ error: 'Info are required' });
  }

  const query = 'INSERT INTO test_table (name, age, address) VALUES (?, ?, ?)';
  db.query(query, [name, age, address], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Database insert error' });
    }
    res.status(201).json({
      id: result.insertId,
      name,
      age,
      address
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
