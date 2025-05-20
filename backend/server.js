const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const auth = require('./middleware/auth');

// Suppress punycode deprecation warning
process.removeAllListeners('warning');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB with retry
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connection successful');

    // Create default admin if not exists
    await ensureAdminUser();
    console.log('Admin user check completed');

    // Parse allowed origins from environment variable
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5001').split(',');

    // Middleware
    app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          console.log('Blocked by CORS:', origin);
          return callback(new Error('Not allowed by CORS'), false);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Request logging middleware
    app.use((req, res, next) => {
      console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);
      console.log('Request headers:', req.headers);
      console.log('Request query:', req.query);
      console.log('Request body:', req.body);
      next();
    });

    // Serve uploaded images
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Root route
    app.get('/', (req, res) => {
      console.log('Root route accessed');
      res.json({ message: 'Barangay Management System API is running' });
    });

    // Public routes
    app.use('/api/auth', require('./routes/authRoutes'));
    
    // Resident routes
    const residentRoutes = require('./routes/residentRoutes');
    
    // Public resident route (no auth)
    app.get('/api/residents/public/:id', async (req, res) => {
      console.log('Public resident route accessed:', req.params);
      await residentRoutes.getPublicResident(req, res);
    });
    
    // Protected routes with auth middleware
    const protectedRouter = express.Router();
    protectedRouter.use(auth);
    
    // Protected resident routes
    protectedRouter.use('/residents', residentRoutes.router);
    protectedRouter.use('/events', require('./routes/eventRoutes'));
    protectedRouter.use('/records', require('./routes/recordRoutes'));
    protectedRouter.use('/transactions', require('./routes/transactionRoutes'));

    // Mount the protected router under /api
    app.use('/api', protectedRouter);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      console.error('Error stack:', err.stack);
      res.status(500).json({ 
        message: 'Internal server error',
        error: err.message 
      });
    });

    // Start server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`\nServer is running on port ${PORT}`);
      console.log(`API is accessible at http://localhost:${PORT}/api`);
      console.log('Ready to handle requests...\n');
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Create default admin if not exists
async function ensureAdminUser() {
  try {
    const adminExists = await User.findOne({ username: process.env.DEFAULT_ADMIN_USERNAME || 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 10);
      await User.create({
        username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
        password: hashedPassword,
        fullname: 'System Administrator',
        role: 'admin'
      });
      console.log(`Default admin user created: username=${process.env.DEFAULT_ADMIN_USERNAME || 'admin'}, password=${process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'}`);
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error in ensureAdminUser:', error);
    throw error; // Propagate error to stop server startup
  }
}

// Start the server
startServer(); 