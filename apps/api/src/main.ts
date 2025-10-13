import "reflect-metadata";

async function bootstrap() {
  // Placeholder bootstrap; NestJS setup will be implemented in upcoming prompts.
  if (process.env.NODE_ENV !== "test") {
    console.info("[CORTEX] API bootstrap placeholder — implement NestJS server.");
  }
}

bootstrap().catch((err) => {
  console.error("[CORTEX] API bootstrap failed", err);
  process.exit(1);
});
