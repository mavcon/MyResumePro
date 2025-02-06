const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const parserRoutes = require('./routes/parser');

const app = express();

// Security middleware
app.use(helmet());

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourproductiondomain.com'] 
    : ['http://localhost:3006', 'http://frontend:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50 // Stricter limit for parsing service
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing - increased limit for file uploads
app.use(express.json({ limit: '5mb' }));
app.use(express.raw({ type: 'application/pdf', limit: '5mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Parser routes
app.use('/api/parser', parserRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Parser service running on port ${PORT}`);
});

module.exports = app; 