import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

loadEnv({ path: "../../.env", override: false });
loadEnv({ path: "../../.env.local", override: true });

const connectionString = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/cortex";

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run Drizzle migrations");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: connectionString
  },
  migrations: {
    table: "drizzle_migrations",
    schema: "public"
  }
});
