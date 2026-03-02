import dotenv from 'dotenv';
import path from 'path';

// In dev: __dirname is src/config → ../../.env hits project root
// In prod (built): dist/app.js → try /app/.env (Docker workdir), fall back to ../../.env
const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve(process.cwd(), '.env')
  : path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: requireEnv('MONGODB_URI'),
  RABBITMQ_URI: requireEnv('RABBITMQ_URI'),
} as const;

export const IS_DEV = ENV.NODE_ENV === 'development';
export const IS_PROD = ENV.NODE_ENV === 'production';