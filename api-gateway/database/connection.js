// Step 1: Import Sequelize
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { DB_DIALECT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_LOGGING } = process.env;

// Step 2: Set up database connection
export const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  host: DB_HOST,      // MySQL host
  port: DB_PORT,             // Default MySQL port
  username: DB_USER,       // Your MySQL username
  password: DB_PASSWORD, // Your MySQL password
  database: DB_NAME,       // Database name
  logging: false,         // Database name
});

// Step 3: Test the connection
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to MySQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1); // Exit on connection failure
  }
}