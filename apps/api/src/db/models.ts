import {
  CoreAttachment,
  CoreE2eeIndex,
  CoreE2eePayload,
  CoreEmbedding,
  CoreEvent,
  CoreFile,
  CoreJournalEntry,
  CoreLink,
  CoreNote,
  CoreProp,
  CoreTag,
  CoreTagMap,
  CoreTask,
  NewCoreAttachment,
  NewCoreE2eeIndex,
  NewCoreE2eePayload,
  NewCoreEmbedding,
  NewCoreEvent,
  NewCoreFile,
  NewCoreJournalEntry,
  NewCoreLink,
  NewCoreNote,
  NewCoreProp,
  NewCoreTag,
  NewCoreTagMap,
  NewCoreTask
} from "./schema";

export type NoteModel = CoreNote;
export type NewNoteModel = NewCoreNote;

export type LinkModel = CoreLink;
export type NewLinkModel = NewCoreLink;

export type TaskModel = CoreTask;
export type NewTaskModel = NewCoreTask;

export type EventModel = CoreEvent;
export type NewEventModel = NewCoreEvent;

export type JournalEntryModel = CoreJournalEntry;
export type NewJournalEntryModel = NewCoreJournalEntry;

export type TagModel = CoreTag;
export type NewTagModel = NewCoreTag;

export type TagMapModel = CoreTagMap;
export type NewTagMapModel = NewCoreTagMap;

export type PropModel = CoreProp;
export type NewPropModel = NewCoreProp;

export type FileModel = CoreFile;
export type NewFileModel = NewCoreFile;

export type AttachmentModel = CoreAttachment;
export type NewAttachmentModel = NewCoreAttachment;

export type EmbeddingModel = CoreEmbedding;
export type NewEmbeddingModel = NewCoreEmbedding;

export type E2eePayloadModel = CoreE2eePayload;
export type NewE2eePayloadModel = NewCoreE2eePayload;

export type E2eeIndexModel = CoreE2eeIndex;
export type NewE2eeIndexModel = NewCoreE2eeIndex;

export type CoreEntityType =
  | "note"
  | "link"
  | "task"
  | "event"
  | "journal"
  | "journalEntry"
  | "file"
  | "attachment"
  | "tag"
  | "tagMap"
  | "prop"
  | "embedding";
