import { Sequelize } from "sequelize";
import { env } from "@e-commerce/common/src/env.ts"
import { userLogger } from "@e-commerce/common/src/logger.ts"

export const sequelize = new Sequelize(
  env.DATABASE_NAME || "usersdb",
  env.DATABASE_USER || "postgres",
  env.DATABASE_PASSWORD || "postgres",
  {
    host: process.env.DATABASE_HOST || "localhost",
    dialect: "postgres",
    dialectOptions: {
      maxPreparedStatements: 100,
      connectTimeout: 5000
    },
    // logging: true,
  }
);

export const connectDB = async (retries = 5, delay = 2000) => {
  let attempts = 0;
  while (attempts < retries) {
    try {
      await sequelize.authenticate();
      userLogger.info('Conectado com sucesso');
      return;
    } catch (err) {
      const error = err as Error;
      attempts++;
      userLogger.error(`Erro ao conectar (tentativa ${attempts}/${retries}): ${error.message}`);
      if (attempts < retries) {
        userLogger.info(`Tentando em ${delay / 1000} segundos...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        if (process.env.NODE_ENV !== 'production') {
          userLogger.error(err);
        }
        process.exit(1);
      }
    }
  }
};

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    userLogger.info("All tables created or already exist");
  } catch (err) {
    userLogger.error(`Error syncing models: ${err}`);
  }
};