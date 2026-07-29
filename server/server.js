import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import researchRoutes from './routes/researchRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Middleware
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({
  path: path.join(__dirname, '.env'),
});

const app = express();

// Connect MongoDB
await connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Engineer Hub API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('====================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================');
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});