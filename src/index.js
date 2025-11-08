import express from 'express';
import cors from 'cors';
import syllabusRoutes from './routes/syllabus.js';
import errorHandler from './utils/errorHandler.js';
import { getContributing } from './controllers/syllabusController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Syllabus API is running' });
});

app.use('/api/syllabus', syllabusRoutes);
app.get('/api/contributing', getContributing);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
