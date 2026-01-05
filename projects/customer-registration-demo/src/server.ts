import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { createApplication } from './config';
import { createRegistrationRoutes } from './routes/registration';
import { errorHandler } from './middleware/errorHandler';

async function startServer() {
  const app = express();
  const application = createApplication();
  
  // Initialize the application
  await application.initialize();
  
  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false // Completely disable CSP for testing
  }));
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Add no-cache headers for all responses
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });
  
  // Serve static files
  app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: '0', // Disable caching
    etag: false, // Disable ETag
    lastModified: false // Disable Last-Modified
  }));
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'Telecom Customer Registration System'
    });
  });
  
  // API routes
  app.use('/api/registration', createRegistrationRoutes(application));
  
  // Root route with API info
  app.get('/', (req, res) => {
    res.json({
      message: 'Telecom Customer Registration API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        registration: '/api/registration',
        docs: '/api/docs'
      },
      status: 'running'
    });
  });
  
  // Error handling middleware
  app.use(errorHandler);
  
  // Start server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Telecom Customer Registration API Server running on port ${port}`);
    console.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🏥 Health Check: http://localhost:${port}/health`);
  });
}

startServer().catch(console.error);