// Entry point for Express server
// Folder: server/src/index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const historyRoutes = require('./routes/historyRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'AI Content Summarizer API is running',
    frontend: 'http://localhost:5173',
    endpoints: ['/api/auth', '/api/summaries', '/api/history']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/history', historyRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
