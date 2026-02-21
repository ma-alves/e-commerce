require("dotenv").config()
const Sequelize = require("sequelize");

export const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "",
    dialectOptions: {
      maxPreparedStatements: 100,
    },
  }
);