import { ORIGIN } from "./config";

const corsConfig = {
  allowedHeaders: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  origin: ORIGIN,
};

export default corsConfig;
