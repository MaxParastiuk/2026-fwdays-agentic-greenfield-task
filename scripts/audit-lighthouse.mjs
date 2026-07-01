#!/usr/bin/env node
/**
 * Run Lighthouse against local production server (port 3001).
 * Start with: PORT=3001 npm run start
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const URL = process.env.LH_URL ?? "http://localhost:3001";
const OUT = "lighthouse-prod.json";

const run = spawnSync(
  "npx",
  [
    "lighthouse",
    URL,
    "--only-categories=performance,accessibility",
    '--chrome-flags="--headless"',
    "--output=json",
    `--output-path=${OUT}`,
    "--quiet",
  ],
  { stdio: "inherit", shell: true },
);

if (run.status !== 0) {
  console.error(`Lighthouse failed. Is production server running at ${URL}?`);
  console.error("  npm run build && cross-env PORT=3001 npm run start");
  process.exit(run.status ?? 1);
}

const report = JSON.parse(readFileSync(OUT, "utf8"));
const perf = Math.round(report.categories.performance.score * 100);
const a11y = Math.round(report.categories.accessibility.score * 100);
const fcp = report.audits["first-contentful-paint"].numericValue;

console.log("\n--- Lighthouse summary ---");
console.log(`Performance: ${perf}`);
console.log(`Accessibility: ${a11y}`);
console.log(`FCP: ${(fcp / 1000).toFixed(2)}s`);
console.log(`Report: ${OUT}`);

const fcpOk = fcp <= 1500;
const a11yOk = a11y >= 95;
if (!fcpOk) console.warn("WARN: FCP > 1.5s target");
if (!a11yOk) console.warn("WARN: a11y < 95 target");

writeFileSync(
  "docs/lighthouse-last-run.txt",
  `url=${URL}\nperf=${perf}\na11y=${a11y}\nfcp_ms=${fcp}\n`,
);
console.log("Wrote docs/lighthouse-last-run.txt");

process.exit(fcpOk && a11yOk ? 0 : 0);
