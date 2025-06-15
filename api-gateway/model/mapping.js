import {  DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

// Define the RouteMapping model
export const RouteMapping = sequelize.define('route_mappings', {
  // Model attributes are defined here
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  route_prefix: {
    type: DataTypes.STRING(100),
  },
  target_url : {
    type: DataTypes.STRING(100),
  },
  time_window: {
    type: DataTypes.INTEGER,
  },
  max_requests: {
    type: DataTypes.INTEGER,
  },
}, {
  // Other model options go here
  timestamps: false,     // createdAt and updatedAt columns
  tableName: 'route_mappings'
});