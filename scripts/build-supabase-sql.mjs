import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const migrationsDir = join(root, "supabase", "migrations");
const outputPath = join(root, "supabase", "production.sql");

const migrations = readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

const header = [
  "-- Atelier Nox Growth System",
  "-- SQL bundle generated from supabase/migrations.",
  "-- Run this file in Supabase SQL Editor for first production setup.",
  ""
].join("\n");

const body = migrations
  .map((file) => {
    const content = readFileSync(join(migrationsDir, file), "utf8").trim();

    return [`-- ==================================================`, `-- ${file}`, `-- ==================================================`, content, ""].join("\n");
  })
  .join("\n");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${header}${body}`, "utf8");

console.log(`Generated ${outputPath}`);
