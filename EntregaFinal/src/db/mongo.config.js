import {Logger } from '../helpers/index.js';
import { connect } from "mongoose";
import { DB_USE_ATLAS, DB_USER, DB_NAME, DB_PASSWORD, LOCAL_DB_NAME, LOCAL_DB_HOST, LOCAL_DB_PORT } from '../config/config.js';
const LOCAL_MONGO_CONNECTION=`mongodb://${LOCAL_DB_HOST}:${LOCAL_DB_PORT}/${LOCAL_DB_NAME}`;
const WEB_MONGO_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}.aqkxapv.mongodb.net/${DB_NAME}`
const configConnection = {
  url: DB_USE_ATLAS === "true" ? WEB_MONGO_CONNECTION : LOCAL_MONGO_CONNECTION,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const mongoDBconnection = async () => {
  try {
    await connect(configConnection.url, configConnection.options);
    Logger.debug(`=================================`);
    Logger.debug(
      `======= URL: ${configConnection.url} =======`
    );
    Logger.debug(`=================================`);
  } catch (error) {
    Logger.fatal(
      error
    );
    throw new Error(error);
  }
};

export  {
  configConnection,
  mongoDBconnection,
};
