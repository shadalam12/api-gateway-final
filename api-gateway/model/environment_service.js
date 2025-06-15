import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

// Define the EnvironmentService model
export const EnvironmentService = sequelize.define('environment_service', {
  // Model attributes are defined here
  env_ser_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  base_url : {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  // Other model options go here
  timestamps: true,     // createdAt and updatedAt columns
});

EnvironmentService.associate = (models) => {
  EnvironmentService.hasMany(models.Service, {
    foreignKey: 'service_id',
    onDelete: 'CASCADE',
  });
};

EnvironmentService.associate = (models) => {
  EnvironmentService.hasMany(models.Environment, {
    foreignKey: 'environment_id',
    onDelete: 'CASCADE',
  });
};

export default EnvironmentService;