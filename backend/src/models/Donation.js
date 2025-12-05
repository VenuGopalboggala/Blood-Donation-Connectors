import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Donation = sequelize.define('Donation', {
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'donations'
});

export default Donation;
