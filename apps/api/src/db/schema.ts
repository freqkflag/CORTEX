import { pgSchema, pgTable, serial } from "drizzle-orm/pg-core";

const publicSchema = pgSchema("public");

export const migrationsExample = publicSchema.table(
  "drizzle_migrations_example",
  {
    id: serial("id").primaryKey()
  }
);

export type MigrationExample = typeof migrationsExample.$inferSelect;
