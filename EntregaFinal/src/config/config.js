import { config } from "dotenv"

config({ path: `.env.${process.env.NODE_ENV || "development"}.local`});

export const {
  LOCAL_TEST_DB_NAME,
  API_VERSION,
  NODE_ENV,
  PORT,
  HOST,
  ORIGIN,
  DB_CNN,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  DB_USE_ATLAS,
  LOCAL_DB_HOST,
  LOCAL_DB_NAME,
  LOCAL_DB_PORT,
  SESSION_SECRET,
  MAIL_USER,
  MAIL_PORT,
  MAIL_SERVICE,
  MAIL_PASSWORD,
} = process.env;


