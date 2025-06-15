import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

// Define the Environment model
const Environment = sequelize.define('environment', {
  env_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  client_id: {
    type: DataTypes.INTEGER,
  }
}, {
  timestamps: true
});

Environment.associate = (models) => {
  Environment.hasMany(models.client, {
    foreignKey: 'client_id',
    onDelete: 'CASCADE',
  });
};

export default Environment;