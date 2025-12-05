import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Donor = sequelize.define(
  "Donor",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bloodType: {
      type: DataTypes.STRING,
      allowNull: true, // Now optional during registration
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // NEW FIELDS BELOW
    isProfileComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },

    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },

    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    lastDonationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },

  {
    tableName: "Donors",
    timestamps: true,
  }
);

export default Donor;
