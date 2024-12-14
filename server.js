// server.js
const dotenv = require('dotenv');
const app = require('./app');
const dbConnection = require('./utils/db_connection');

// Load environment variables
dotenv.config({ path: 'config.env' });

// Connect to the database
dbConnection().then(() => {
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });

  // Gracefully handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error('Shutting down...');
      process.exit(1);
    });
  });
});
