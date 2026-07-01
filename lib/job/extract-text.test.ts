import { extractTextFromHtml, normalizeWhitespace } from "@/lib/job/extract-text";

describe("extractTextFromHtml", () => {
  it("extracts visible body text and strips scripts", () => {
    const html = `
      <html>
        <head><title>Job</title><script>alert(1)</script></head>
        <body>
          <nav>Skip me</nav>
          <main>
            <h1>Senior Engineer</h1>
            <p>Build great software.</p>
          </main>
          <footer>Footer</footer>
        </body>
      </html>
    `;

    expect(extractTextFromHtml(html)).toBe(
      "Senior Engineer Build great software.",
    );
  });

  it("returns empty string when body has no visible text", () => {
    const html = "<html><body><script>only script</script></body></html>";

    expect(extractTextFromHtml(html)).toBe("");
  });
});

describe("normalizeWhitespace", () => {
  it("collapses whitespace", () => {
    expect(normalizeWhitespace("  hello   world \n")).toBe("hello world");
  });
});
