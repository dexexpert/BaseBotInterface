import { MongoClient } from "mongodb";
import { URI, DB , COL_VOLUME , COL_RANK , COL_HYPE } from "../config";

const mongoClient = new MongoClient(URI);

let colVolume: any;
let colRank: any;
let colHype: any;

export const ConnectDB = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DB);
    colVolume = db.collection(COL_VOLUME);
    colRank = db.collection(COL_RANK);
    colHype = db.collection(COL_HYPE);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("⚠️ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export { colVolume , colRank , colHype };
