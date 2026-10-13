import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const adapter = new PrismaMariaDb({
  host: requiredEnv("DATABASE_HOST"),
  user: requiredEnv("DATABASE_USER"),
  password: requiredEnv("DATABASE_PASSWORD"),
  database: requiredEnv("DATABASE_NAME"),
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };