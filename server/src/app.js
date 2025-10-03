const express = require('express');
const cors = require('cors');
const employeesRoutes = require('./routes/employees.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/employees', employeesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const path = require('path');

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../client/dist'); // path to client build directory
  app.use(express.static(distPath));

  // SPA: send index.html for any route not handled by API
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
