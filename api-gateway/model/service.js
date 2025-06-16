import {  DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

// Define the Service model
const Service = sequelize.define('service', {
  // Model attributes are defined here
  service_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  client_id: {
    type: DataTypes.INTEGER,
  }
}, {
  // Other model options go here
  timestamps: true,     // createdAt and updatedAt columns
});

// Define associations
Service.associate = (models) => {
  Service.hasMany(models.Client, {
    foreignKey: 'client_id',
    onDelete: 'CASCADE',
  });
};

export default Service;