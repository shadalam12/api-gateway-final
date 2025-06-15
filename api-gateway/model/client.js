import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

// Define the Client model
const Client = sequelize.define('client', {
  client_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  timestamps: true
});


export  { Client };