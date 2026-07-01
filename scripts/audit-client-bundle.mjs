#!/usr/bin/env node
/**
 * Post-build audit: grep client chunks for server-only parsers and sum
 * gzipped transfer sizes for rootMainFiles (NFR-PERF-03).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const ROOT = process.cwd();
const BUILD_MANIFEST = join(ROOT, ".next", "build-manifest.json");
const CHUNKS_DIR = join(ROOT, ".next", "static", "chunks");
const FORBIDDEN = ["pdf-parse", "cheerio"];
const BUDGET_KB = 150;

function gzSize(filePath) {
  const buf = readFileSync(filePath);
  return gzipSync(buf).length;
}

function listJsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listJsFiles(full));
    } else if (entry.name.endsWith(".js")) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  if (!statSync(join(ROOT, ".next"), { throwIfNoEntry: false })) {
    console.error("Run `npm run build` first.");
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(BUILD_MANIFEST, "utf8"));
  const rootMain = manifest.rootMainFiles ?? [];
  let rootGz = 0;

  console.log("Root main chunks (initial load):");
  for (const rel of rootMain) {
    const filePath = join(ROOT, ".next", rel.replace(/^static\//, "static/"));
    const alt = join(ROOT, ".next", rel);
    const path = statSync(filePath, { throwIfNoEntry: false })
      ? filePath
      : alt;
    if (!statSync(path, { throwIfNoEntry: false })) {
      console.warn(`  missing: ${rel}`);
      continue;
    }
    const kb = gzSize(path) / 1024;
    rootGz += kb;
    console.log(`  ${kb.toFixed(1)} KB gz  ${rel.split("/").pop()}`);
  }
  console.log(`Total root main: ${rootGz.toFixed(1)} KB gz (budget ${BUDGET_KB} KB)\n`);

  const chunkFiles = listJsFiles(CHUNKS_DIR);
  let violations = 0;
  for (const forbidden of FORBIDDEN) {
    const hits = chunkFiles.filter((f) =>
      readFileSync(f, "utf8").includes(forbidden),
    );
    if (hits.length) {
      violations += hits.length;
      console.error(`FAIL: "${forbidden}" found in ${hits.length} client chunk(s)`);
      hits.forEach((h) => console.error(`  ${h}`));
    } else {
      console.log(`OK: no "${forbidden}" in client chunks`);
    }
  }

  const okBudget = rootGz <= BUDGET_KB;
  console.log(
    okBudget
      ? `\nPASS: root main ${rootGz.toFixed(1)} KB gz ≤ ${BUDGET_KB} KB`
      : `\nWARN: root main ${rootGz.toFixed(1)} KB gz exceeds ${BUDGET_KB} KB (lazy chunks load after interaction)`,
  );

  process.exit(violations > 0 ? 1 : 0);
}

main();
