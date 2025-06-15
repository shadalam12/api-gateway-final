// Step 1: Import Sequelize
import { Sequelize, DataTypes } from 'sequelize';

// Step 2: Set up database connection
export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',      // MySQL host
  port: 3306,             // Default MySQL port
  username: 'root',       // Your MySQL username
  password: 'Alambaba@7033', // Your MySQL password
  database: 'apigateway',
  logging: false,         // Database name
});

// Step 3: Test the connection
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to MySQL has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1); // Exit on connection failure
  }
}