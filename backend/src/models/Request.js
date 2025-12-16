import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Request = sequelize.define(
  "Request",
  {
    seekerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bloodType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  { tableName: "requests" }
);

export default Request;
