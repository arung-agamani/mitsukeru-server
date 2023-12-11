import path from "path";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: path.resolve(__dirname, "..", ".env") });

const config = {
  BUCKET_NAME: process.env.BUCKET_NAME,
};

export default config;
