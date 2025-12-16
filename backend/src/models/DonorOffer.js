import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DonorOffer = sequelize.define(
  "DonorOffer",
  {
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    donorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    availabilityDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "donor_offers",
    timestamps: true,
  }
);

export default DonorOffer;
