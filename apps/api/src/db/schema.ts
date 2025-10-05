import { sql } from "drizzle-orm";
import {
  AnyPgTable,
  bigint,
  bigserial,
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector
} from "drizzle-orm/pg-core";

export const coreTaskStatus = pgEnum("core_task_status", [
  "todo",
  "doing",
  "done",
  "blocked",
  "canceled"
]);

export const coreNote = pgTable("core_note", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  contentMd: text("content_md").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const coreLink = pgTable("core_link", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  srcType: text("src_type").notNull(),
  srcId: uuid("src_id").notNull(),
  tgtType: text("tgt_type").notNull(),
  tgtId: uuid("tgt_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const coreTask = pgTable("core_task", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  descriptionMd: text("description_md"),
  status: coreTaskStatus("status").notNull().default("todo"),
  priority: smallint("priority").default(3),
  dueAt: timestamp("due_at", { withTimezone: true }),
  recurRrule: text("recur_rrule"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const coreEvent = pgTable("core_event", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  timezone: text("timezone").notNull(),
  location: text("location"),
  recurRrule: text("recur_rrule"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const coreJournalEntry = pgTable("core_journal_entry", {
  id: uuid("id").defaultRandom().primaryKey(),
  entryDate: date("entry_date").notNull(),
  contentMd: text("content_md"),
  mood: smallint("mood"),
  energy: smallint("energy"),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const coreTag = pgTable(
  "core_tag",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
    color: text("color"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    slugKey: uniqueIndex("core_tag_slug_key").on(table.slug)
  })
);

export const coreTagMap = pgTable(
  "core_tag_map",
  {
    tagId: uuid("tag_id")
      .notNull()
      .references(() => coreTag.id, { onDelete: "cascade" }),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.tagId, table.entityType, table.entityId] })
  })
);

export const coreProp = pgTable("core_prop", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  name: text("name").notNull(),
  valueType: text("value_type").notNull(),
  value: jsonb("value").notNull(),
  isEncrypted: boolean("is_encrypted").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const coreFile = pgTable("core_file", {
  id: uuid("id").defaultRandom().primaryKey(),
  storageDriver: text("storage_driver").notNull(),
  storageKey: text("storage_key").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type"),
  byteSize: bigint("byte_size", { mode: "number" }).notNull(),
  checksum: text("checksum"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const coreAttachment = pgTable("core_attachment", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileId: uuid("file_id")
    .notNull()
    .references(() => coreFile.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const coreEmbedding = pgTable("core_embedding", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  dimensions: integer("dimensions").notNull().default(1536),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const schema = {
  coreNote,
  coreLink,
  coreTask,
  coreEvent,
  coreJournalEntry,
  coreTag,
  coreTagMap,
  coreProp,
  coreFile,
  coreAttachment,
  coreEmbedding
} satisfies Record<string, AnyPgTable>;

export type CoreNote = typeof coreNote.$inferSelect;
export type NewCoreNote = typeof coreNote.$inferInsert;
export type CoreLink = typeof coreLink.$inferSelect;
export type NewCoreLink = typeof coreLink.$inferInsert;
export type CoreTask = typeof coreTask.$inferSelect;
export type NewCoreTask = typeof coreTask.$inferInsert;
export type CoreEvent = typeof coreEvent.$inferSelect;
export type NewCoreEvent = typeof coreEvent.$inferInsert;
export type CoreJournalEntry = typeof coreJournalEntry.$inferSelect;
export type NewCoreJournalEntry = typeof coreJournalEntry.$inferInsert;
export type CoreTag = typeof coreTag.$inferSelect;
export type NewCoreTag = typeof coreTag.$inferInsert;
export type CoreTagMap = typeof coreTagMap.$inferSelect;
export type NewCoreTagMap = typeof coreTagMap.$inferInsert;
export type CoreProp = typeof coreProp.$inferSelect;
export type NewCoreProp = typeof coreProp.$inferInsert;
export type CoreFile = typeof coreFile.$inferSelect;
export type NewCoreFile = typeof coreFile.$inferInsert;
export type CoreAttachment = typeof coreAttachment.$inferSelect;
export type NewCoreAttachment = typeof coreAttachment.$inferInsert;
export type CoreEmbedding = typeof coreEmbedding.$inferSelect;
export type NewCoreEmbedding = typeof coreEmbedding.$inferInsert;
