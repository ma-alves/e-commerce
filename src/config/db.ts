import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DATABASE_NAME || "usersdb",
  process.env.DATABASE_USER || "postgres",
  process.env.DATABASE_PASSWORD || "postgres",
  {
    host: process.env.DATABASE_HOST || "localhost",
    dialect: "postgres",
    dialectOptions: {
      maxPreparedStatements: 100,
      connectTimeout: 5000
    },
    logging: true,
  }
);

export const connectDB = async (retries = 5, delay = 2000) => {
  let attempts = 0;
  while (attempts < retries) {
    try {
      await sequelize.authenticate();
      console.log('Conectado com sucesso');
      return;
    } catch (err) {
      const error = err as Error;
      attempts++;
      console.error(`Erro ao conectar (tentativa ${attempts}/${retries}): ${error.message}`);
      if (attempts < retries) {
        console.log(`Tentando em ${delay / 1000} segundos...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.error(err);
        }
        process.exit(1);
      }
    }
  }
};

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("All tables created or already exist");
  } catch (err) {
    console.error(`Error syncing models: ${err}`);
  }
};