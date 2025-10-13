import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.spec.ts", "src/**/*.test.ts"],
    reporters: ["default"],
    coverage: {
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.spec.ts", "src/**/*.test.ts"]
    }
  }
});
