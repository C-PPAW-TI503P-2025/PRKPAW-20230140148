// server.js

const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Mengaktifkan CORS
app.use(express.json()); // Body parser untuk JSON

// Middleware untuk logging setiap request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Menggunakan routing dari books.js untuk endpoint /api/books
app.use('/api/books', bookRoutes);

// Middleware untuk menangani 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});