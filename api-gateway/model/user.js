import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

// Define the User model
const User = sequelize.define('user', {
  // Model attributes are defined here
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
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
  },
  role : {
    type: DataTypes.STRING(10),
    defaultValue: 'guest'
  }
}, {
  // Other model options go here
  timestamps: true // createdAt columns
});

export default User;