import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(__dirname, "..");

const CLIENT_DIRS = [
  path.join(ROOT, "components"),
  path.join(ROOT, "lib", "hooks"),
];

const AI_IMPORT = /from\s+["']ai["']/;

function collectTsFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(fullPath));
      continue;
    }
    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("client import boundary", () => {
  it("components and lib/hooks do not import ai", () => {
    const violations: string[] = [];

    for (const dir of CLIENT_DIRS) {
      if (!fs.existsSync(dir)) {
        continue;
      }

      for (const filePath of collectTsFiles(dir)) {
        const content = fs.readFileSync(filePath, "utf-8");
        if (AI_IMPORT.test(content)) {
          violations.push(path.relative(ROOT, filePath));
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
