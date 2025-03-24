import * as dotenv from 'dotenv';
dotenv.config();

export type ConfigType = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  ACCESS_TOKEN_KEY: string;
  ACCESS_TOKEN_TIME: string;
  REFRESH_TOKEN_KEY: string;
  REFRESH_TOKEN_TIME: string;
};

export const config: ConfigType = {
  PORT: Number(process.env.PORT) as number,
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: Number(process.env.DB_PORT) as number,
  DB_USER: process.env.DB_USER as string,
  DB_PASS: process.env.DB_PASS as string,
  DB_NAME: process.env.DB_NAME as string,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY as string,
  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME as string,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY as string,
  REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME as string,
};
