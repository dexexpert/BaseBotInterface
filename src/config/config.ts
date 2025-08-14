import dotenv from "dotenv";
dotenv.config();

const {
  BET_BOT_TOKEN,

  MONGO_URI,
  MONGO_DB,
  MONGO_COL_VOLUME,
  MONGO_COL_RANK,
  MONGO_COL_HYPE,
  LB_APP_NETWORK,
  DEV,
  PROD,
} = process.env;

if (
  !BET_BOT_TOKEN ||
  !MONGO_URI ||
  !MONGO_DB ||
  !MONGO_COL_VOLUME ||
  !MONGO_COL_RANK ||
  !MONGO_COL_HYPE ||
  !LB_APP_NETWORK
) {
  throw new Error("⚠️ Missing required environment variables");
}

export const BETTING_BOT_TOKEN = BET_BOT_TOKEN;

export const URI = MONGO_URI;
export const DB = MONGO_DB;
export const COL_VOLUME = MONGO_COL_VOLUME;
export const COL_RANK = MONGO_COL_RANK;
export const COL_HYPE = MONGO_COL_HYPE;

export const NETWORK = LB_APP_NETWORK;
export const IS_DEV = DEV === "true";
export const IS_PROD = PROD === "true";
