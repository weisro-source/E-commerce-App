
const categoryRoutes = require('./routes/category_routes');

const subCategoryRoute = require('./routes/sub_category_route');

const brandRoute = require('./routes/brand_route');

const productRoute = require('./routes/product_route');

const userRoutes = require('./routes/user_routes');

const authRoutes = require('./routes/authRoute');

const ApiError = require('./utils/ApiError');

const globalError = require('./middlewares/errorMiddleware');

const path = require('path');

const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });


const express = require('express');

const morgan = require('morgan');

const fs = require('fs');




const app = express();
const customMorganFormat = ':method :url :status :response-time ms';

// Create a writable stream for logging to a file (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Apply Morgan logging to both the console and the access log file
if (process.env.NODE_ENV === 'development') {
  // Log to both console and file in development
  app.use(morgan(customMorganFormat)); // Logs to console
  app.use(morgan(customMorganFormat, { stream: accessLogStream })); // Logs to file
  console.log(`Node environment: ${process.env.NODE_ENV}`);
} else {
  // Log to both console and file in production or other environments
  app.use(morgan('combined', { stream: accessLogStream })); // Logs to file
  app.use(morgan('combined')); // Logs to console
}

// Parse JSON request bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Define API routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brand', brandRoute);
app.use("/api/v1/products", productRoute);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Welcome To E-commerce App",
    version: "1.0.0",
    author: "Nassim soliman",
    contact: "nassimsoliman22@gmail.com",
    baseUrl: process.env.BASE_URL,
    links: {
      github:
        "https://github.com/nassimFlutter/ecommerce-nodejs"

    }
  });
});

// Handle undefined routes (404 errors)
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find the route ${req.originalUrl}`, 404));
});

// Global error handling middleware
app.use(globalError);

module.exports = app;
