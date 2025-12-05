// backend/src/models/Recipient.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Recipient = sequelize.define('Recipient', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {                      // <-- FIXED (missing before)
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,               // prevents duplicate emails
    validate: {
      isEmail: true,
    },
  },
  password: {                   // <-- seekers MUST have a password
    type: DataTypes.STRING,
    allowNull: false,
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hospitalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
}, {
  tableName: 'Recipients',
  timestamps: true,
});

export default Recipient;
