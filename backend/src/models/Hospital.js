import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Hospital = sequelize.define('Hospital', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  contactPhone: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'hospitals'
});

export default Hospital;
