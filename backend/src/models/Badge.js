import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Badge = sequelize.define('Badge', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'badges'
});

export default Badge;
