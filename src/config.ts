import { config } from 'dotenv';
config({
  path: `./.env`,
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  REDISCLOUD_URL: process.env.REDISCLOUD_URL,
  REDIS_PARTITION_KEY: process.env.REDIS_PARTITION_KEY,
};
