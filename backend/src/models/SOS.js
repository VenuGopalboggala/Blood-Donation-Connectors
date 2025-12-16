import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SOS = sequelize.define('SOS', {
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.DECIMAL(10,7),
    allowNull: true,
  },
  lng: {
    type: DataTypes.DECIMAL(10,7),
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'sos_requests'
});

export default SOS;
