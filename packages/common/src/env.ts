import dotenv from "dotenv";
import { minLength, z } from "zod";
import type { ZodObject, ZodRawShape } from "zod";
import path from "path";
import { fileURLToPath } from "url";

// Resolves to the monorepo root regardless of where the process is started
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../../.env");
dotenv.config({ path: envPath });

interface EnvOptions {
  source?: NodeJS.ProcessEnv;
  serviceName?: string;  // remove or fix or something something
}

type SchemaOutput<TSchema extends ZodRawShape> = ZodObject<TSchema>["_output"];

const createEnv = <TSchema extends ZodRawShape>(
  schema: ZodObject<TSchema>,
  options: EnvOptions = {}
): SchemaOutput<TSchema> => {
  const { source = process.env, serviceName = "service" } = options;

  const parsed = schema.safeParse(source);
  
  if (!parsed.success) {
    const formatedErrors = z.treeifyError(parsed.error);
    throw new Error(
      `[${serviceName}] Environment variable validation failed: ${JSON.stringify(formatedErrors)}`
    );
  }

  return parsed.data;
};

export type EnvSchema<TShape extends ZodRawShape> = ZodObject<TShape>;

// todas variáveis vão passar por aqui
const envSchema = z.object({
  DATABASE_NAME: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_HOST: z.string(),
  JWT_SECRET_KEY: z.string().min(32),
  PORT: z.coerce.number().int().min(0).max(65_535).default(3000),
  // NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // USER_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4001),
  // USER_DB_URL: z.string(),
  // RABBITMQ_URL: z.string().optional(),
  // INTERNAL_API_TOKEN: z.string().min(16),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'user-service',
});

export type Env = typeof env;
