// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: 'config.env' });

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {

        });
        console.log('Database connection successful');
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = dbConnection;
