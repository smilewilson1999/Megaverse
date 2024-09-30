import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  API_BASE_URL:
    process.env.API_BASE_URL || "https://challenge.crossmint.io/api",
  CANDIDATE_ID: process.env.CANDIDATE_ID || "",
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
};
