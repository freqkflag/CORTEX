import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import {
  coreAttachment,
  coreEmbedding,
  coreEvent,
  coreFile,
  coreJournalEntry,
  coreLink,
  coreNote,
  coreProp,
  coreTag,
  coreTagMap,
  coreTask,
  NewCoreAttachment,
  NewCoreEmbedding,
  NewCoreEvent,
  NewCoreFile,
  NewCoreJournalEntry,
  NewCoreLink,
  NewCoreNote,
  NewCoreProp,
  NewCoreTag,
  NewCoreTagMap,
  NewCoreTask,
  schema
} from "./schema";

export type Database = NodePgDatabase<typeof schema>;

type NoteUpdate = Partial<Omit<NewCoreNote, "id" | "createdAt" | "updatedAt">>;
type TaskUpdate = Partial<Omit<NewCoreTask, "id" | "createdAt" | "updatedAt">>;
type EventUpdate = Partial<Omit<NewCoreEvent, "id" | "createdAt" | "updatedAt">>;
type JournalUpdate = Partial<Omit<NewCoreJournalEntry, "id" | "createdAt">>;
type EmbeddingQuery = Pick<NewCoreEmbedding, "entityType" | "entityId" | "provider" | "model">;

export class NoteRepository {
  constructor(private readonly db: Database) {}

  async getById(id: string) {
    return this.db.query.coreNote.findFirst({ where: eq(coreNote.id, id) });
  }

  async listByIds(ids: readonly string[]) {
    if (!ids.length) return [];
    return this.db.select().from(coreNote).where(inArray(coreNote.id, ids as string[]));
  }

  async create(payload: NewCoreNote) {
    const [created] = await this.db.insert(coreNote).values(payload).returning();
    return created;
  }

  async update(id: string, patch: NoteUpdate) {
    if (!Object.keys(patch).length) {
      return this.getById(id);
    }

    const [updated] = await this.db
      .update(coreNote)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(coreNote.id, id))
      .returning();

    return updated ?? null;
  }

  async delete(id: string) {
    const [deleted] = await this.db.delete(coreNote).where(eq(coreNote.id, id)).returning();
    return deleted ?? null;
  }
}

export class LinkRepository {
  constructor(private readonly db: Database) {}

  async create(payload: NewCoreLink) {
    const [created] = await this.db.insert(coreLink).values(payload).returning();
    return created;
  }

  async listBySource(srcType: string, srcId: string) {
    return this.db
      .select()
      .from(coreLink)
      .where(and(eq(coreLink.srcType, srcType), eq(coreLink.srcId, srcId)));
  }
}

export class TaskRepository {
  constructor(private readonly db: Database) {}

  async getById(id: string) {
    return this.db.query.coreTask.findFirst({ where: eq(coreTask.id, id) });
  }

  async listByStatus(statuses: readonly string[]) {
    if (!statuses.length) {
      return this.db.select().from(coreTask);
    }

    return this.db.select().from(coreTask).where(inArray(coreTask.status, statuses as string[]));
  }

  async create(payload: NewCoreTask) {
    const [created] = await this.db.insert(coreTask).values(payload).returning();
    return created;
  }

  async update(id: string, patch: TaskUpdate) {
    if (!Object.keys(patch).length) {
      return this.getById(id);
    }

    const [updated] = await this.db
      .update(coreTask)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(coreTask.id, id))
      .returning();

    return updated ?? null;
  }
}

export class EventRepository {
  constructor(private readonly db: Database) {}

  async listBetween(start: Date, end: Date) {
    return this.db
      .select()
      .from(coreEvent)
      .where(and(gte(coreEvent.startsAt, start), lte(coreEvent.endsAt, end)));
  }

  async create(payload: NewCoreEvent) {
    const [created] = await this.db.insert(coreEvent).values(payload).returning();
    return created;
  }

  async update(id: string, patch: EventUpdate) {
    if (!Object.keys(patch).length) {
      return this.db.query.coreEvent.findFirst({ where: eq(coreEvent.id, id) });
    }

    const [updated] = await this.db
      .update(coreEvent)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(coreEvent.id, id))
      .returning();

    return updated ?? null;
  }
}

export class JournalRepository {
  constructor(private readonly db: Database) {}

  async listByDateRange(start: Date, end: Date) {
    return this.db
      .select()
      .from(coreJournalEntry)
      .where(and(gte(coreJournalEntry.entryDate, start), lte(coreJournalEntry.entryDate, end)));
  }

  async create(payload: NewCoreJournalEntry) {
    const [created] = await this.db.insert(coreJournalEntry).values(payload).returning();
    return created;
  }

  async update(id: string, patch: JournalUpdate) {
    if (!Object.keys(patch).length) {
      return this.db.query.coreJournalEntry.findFirst({ where: eq(coreJournalEntry.id, id) });
    }

    const [updated] = await this.db
      .update(coreJournalEntry)
      .set(patch)
      .where(eq(coreJournalEntry.id, id))
      .returning();

    return updated ?? null;
  }
}

export class TagRepository {
  constructor(private readonly db: Database) {}

  async upsert(payload: NewCoreTag) {
    const existing = await this.db.query.coreTag.findFirst({ where: eq(coreTag.slug, payload.slug) });
    if (existing) {
      const patch: Partial<Pick<NewCoreTag, "label" | "color">> = {};
      if (payload.label && payload.label !== existing.label) {
        patch.label = payload.label;
      }
      if (payload.color !== undefined && payload.color !== existing.color) {
        patch.color = payload.color;
      }

      if (!Object.keys(patch).length) {
        return existing;
      }

      const [updated] = await this.db
        .update(coreTag)
        .set(patch)
        .where(eq(coreTag.id, existing.id))
        .returning();
      return updated ?? existing;
    }

    const [created] = await this.db.insert(coreTag).values(payload).returning();
    return created;
  }

  async attachTag(payload: NewCoreTagMap) {
    const existing = await this.db.query.coreTagMap.findFirst({
      where: and(
        eq(coreTagMap.tagId, payload.tagId),
        eq(coreTagMap.entityType, payload.entityType),
        eq(coreTagMap.entityId, payload.entityId)
      )
    });

    if (existing) {
      return existing;
    }

    const [created] = await this.db.insert(coreTagMap).values(payload).returning();
    return created;
  }

  async detachTag(tagId: string, entityType: string, entityId: string) {
    const [deleted] = await this.db
      .delete(coreTagMap)
      .where(
        and(eq(coreTagMap.tagId, tagId), eq(coreTagMap.entityType, entityType), eq(coreTagMap.entityId, entityId))
      )
      .returning();
    return deleted ?? null;
  }

  async listTagsForEntity(entityType: string, entityId: string) {
    return this.db
      .select({
        id: coreTag.id,
        slug: coreTag.slug,
        label: coreTag.label,
        color: coreTag.color,
        createdAt: coreTag.createdAt
      })
      .from(coreTagMap)
      .innerJoin(coreTag, eq(coreTag.id, coreTagMap.tagId))
      .where(and(eq(coreTagMap.entityType, entityType), eq(coreTagMap.entityId, entityId)));
  }
}

export class PropRepository {
  constructor(private readonly db: Database) {}

  async upsert(payload: NewCoreProp) {
    const existing = await this.db.query.coreProp.findFirst({
      where: and(
        eq(coreProp.entityType, payload.entityType),
        eq(coreProp.entityId, payload.entityId),
        eq(coreProp.name, payload.name)
      )
    });

    if (existing) {
      const update = {
        valueType: payload.valueType,
        value: payload.value,
        isEncrypted: payload.isEncrypted
      };

      const [updated] = await this.db
        .update(coreProp)
        .set({ ...update, updatedAt: new Date() })
        .where(eq(coreProp.id, existing.id))
        .returning();
      return updated ?? existing;
    }

    const [created] = await this.db.insert(coreProp).values(payload).returning();
    return created;
  }

  async list(entityType: string, entityId: string) {
    return this.db
      .select()
      .from(coreProp)
      .where(and(eq(coreProp.entityType, entityType), eq(coreProp.entityId, entityId)));
  }
}

export class FileRepository {
  constructor(private readonly db: Database) {}

  async create(payload: NewCoreFile) {
    const [created] = await this.db.insert(coreFile).values(payload).returning();
    return created;
  }

  async getById(id: string) {
    return this.db.query.coreFile.findFirst({ where: eq(coreFile.id, id) });
  }
}

export class AttachmentRepository {
  constructor(private readonly db: Database) {}

  async create(payload: NewCoreAttachment) {
    const [created] = await this.db.insert(coreAttachment).values(payload).returning();
    return created;
  }

  async listForEntity(entityType: string, entityId: string) {
    return this.db
      .select()
      .from(coreAttachment)
      .where(and(eq(coreAttachment.entityType, entityType), eq(coreAttachment.entityId, entityId)));
  }
}

export class EmbeddingRepository {
  constructor(private readonly db: Database) {}

  async upsert(payload: NewCoreEmbedding) {
    const selector: EmbeddingQuery = {
      entityType: payload.entityType,
      entityId: payload.entityId,
      provider: payload.provider,
      model: payload.model
    };

    const existing = await this.db.query.coreEmbedding.findFirst({
      where: and(
        eq(coreEmbedding.entityType, selector.entityType),
        eq(coreEmbedding.entityId, selector.entityId),
        eq(coreEmbedding.provider, selector.provider),
        eq(coreEmbedding.model, selector.model)
      )
    });

    if (existing) {
      const [updated] = await this.db
        .update(coreEmbedding)
        .set({ embedding: payload.embedding, dimensions: payload.dimensions, updatedAt: new Date() })
        .where(eq(coreEmbedding.id, existing.id))
        .returning();
      return updated ?? existing;
    }

    const [created] = await this.db.insert(coreEmbedding).values(payload).returning();
    return created;
  }

  async listForEntity(entityType: string, entityId: string) {
    return this.db
      .select()
      .from(coreEmbedding)
      .where(and(eq(coreEmbedding.entityType, entityType), eq(coreEmbedding.entityId, entityId)));
  }
}
