import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DonorBadge = sequelize.define('DonorBadge', {
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  badgeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awardedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'donor_badges',
  timestamps: false
});

export default DonorBadge;
