// src/config/db.js

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Add this line to debug
console.log('--- Checking Environment Variables ---');
console.log('Database Dialect read from .env:', process.env.DB_DIALECT);
console.log('------------------------------------');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

export default sequelize;