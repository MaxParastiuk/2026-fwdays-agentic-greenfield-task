import fs from "node:fs";
import path from "node:path";

const PIPELINE_DIR = path.join(__dirname);

function collectImportSources(content: string): string[] {
  const imports: string[] = [];
  const importRegex = /(?:import|export)\s+.*?\sfrom\s+["']([^"']+)["']/g;

  for (const match of content.matchAll(importRegex)) {
    imports.push(match[1]);
  }

  return imports;
}

function isAllowedRunnerImport(source: string): boolean {
  if (source === "./constants" || source === "./types") {
    return true;
  }

  if (source === "@/agents/maker" || source === "@/agents/checker") {
    return true;
  }

  if (source.startsWith("@/lib/")) {
    return true;
  }

  return false;
}

describe("pipeline import boundary", () => {
  it("runner.ts imports only agents and lib modules", () => {
    const runnerPath = path.join(PIPELINE_DIR, "runner.ts");
    const content = fs.readFileSync(runnerPath, "utf-8");
    const violations: string[] = [];

    for (const source of collectImportSources(content)) {
      if (!isAllowedRunnerImport(source)) {
        violations.push(`runner.ts imports disallowed path "${source}"`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("agents do not import pipeline runner", () => {
    const agentsDir = path.join(__dirname, "..", "agents");
    const agentFiles = ["maker.ts", "checker.ts"];
    const violations: string[] = [];

    for (const fileName of agentFiles) {
      const filePath = path.join(agentsDir, fileName);
      const content = fs.readFileSync(filePath, "utf-8");

      for (const source of collectImportSources(content)) {
        if (/pipeline\/runner|pipeline\\runner/.test(source)) {
          violations.push(`${fileName} imports "${source}"`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
