CREATE TABLE "core_e2ee_index" (
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"field" text NOT NULL,
	"token_hash" text NOT NULL,
	CONSTRAINT "core_e2ee_index_entity_type_entity_id_field_token_hash_pk" PRIMARY KEY("entity_type","entity_id","field","token_hash")
);
--> statement-breakpoint
CREATE TABLE "core_e2ee_payload" (
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"rev" integer NOT NULL,
	"nonce" text NOT NULL,
	"ciphertext" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "core_e2ee_payload_entity_type_entity_id_rev_pk" PRIMARY KEY("entity_type","entity_id","rev")
);
