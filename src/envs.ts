import  dotenv  from "dotenv"

dotenv.config();

export const envs = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
};