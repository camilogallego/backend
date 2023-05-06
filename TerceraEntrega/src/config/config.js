import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  ORIGIN,
  NODE_ENV,
  MONGO_URL,
  GITHUB_CLIENT,
  GITHUB_SECRET,
  PERSISTENCE,
  SESSION_SECRET,
  BASE_PREFIX,
} = process.env;
