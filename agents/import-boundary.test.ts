import fs from "node:fs";
import path from "node:path";

const AGENTS_DIR = path.join(__dirname);

const CHECKER_PIPELINE_FORBIDDEN = [
  /agents\/maker/,
  /agents\\maker/,
  /\.\/maker/,
  /\.\.\/agents\/maker/,
  /pipeline\/runner/,
  /pipeline\\runner/,
  /\.\/runner/,
  /\.\.\/pipeline\/runner/,
];

const MAKER_CHECKER_PIPELINE_FORBIDDEN = [
  /agents\/checker/,
  /agents\\checker/,
  /\.\/checker/,
  /\.\.\/agents\/checker/,
  /pipeline\/runner/,
  /pipeline\\runner/,
  /\.\/runner/,
  /\.\.\/pipeline\/runner/,
];

function collectImportSources(content: string): string[] {
  const imports: string[] = [];
  const importRegex = /(?:import|export)\s+.*?\sfrom\s+["']([^"']+)["']/g;

  for (const match of content.matchAll(importRegex)) {
    imports.push(match[1]);
  }

  return imports;
}

function findViolations(
  fileName: string,
  content: string,
  patterns: RegExp[],
): string[] {
  const violations: string[] = [];

  for (const source of collectImportSources(content)) {
    if (patterns.some((pattern) => pattern.test(source))) {
      violations.push(`${fileName} imports "${source}"`);
    }
  }

  return violations;
}

describe("agents import boundary", () => {
  it("maker.ts does not import checker or pipeline runner", () => {
    const makerPath = path.join(AGENTS_DIR, "maker.ts");
    const content = fs.readFileSync(makerPath, "utf-8");
    const violations = findViolations(
      "maker.ts",
      content,
      MAKER_CHECKER_PIPELINE_FORBIDDEN,
    );

    expect(violations).toEqual([]);
  });

  it("checker.ts does not import maker or pipeline runner", () => {
    const checkerPath = path.join(AGENTS_DIR, "checker.ts");
    const content = fs.readFileSync(checkerPath, "utf-8");
    const violations = findViolations(
      "checker.ts",
      content,
      CHECKER_PIPELINE_FORBIDDEN,
    );

    expect(violations).toEqual([]);
  });
});
