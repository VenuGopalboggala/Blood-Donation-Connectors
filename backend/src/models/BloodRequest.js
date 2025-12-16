import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const BloodRequest = sequelize.define(
  "BloodRequest",
  {
    seekerId: { type: DataTypes.INTEGER, allowNull: false },
    donorId: { type: DataTypes.INTEGER, allowNull: true },
    seekerName: { type: DataTypes.STRING, allowNull: false },
    bloodType: { type: DataTypes.STRING, allowNull: false },
    hospitalName: { type: DataTypes.STRING, allowNull: false },
    contactPhone: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
  },
  {
    tableName: "blood_requests",
    timestamps: true,
  }
);

export default BloodRequest;
