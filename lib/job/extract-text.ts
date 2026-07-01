import * as cheerio from "cheerio";

const REMOVED_SELECTORS = "script, style, noscript, nav, footer, header";

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function extractTextFromHtml(html: string): string {
  const $ = cheerio.load(html);
  $(REMOVED_SELECTORS).remove();

  $("br").replaceWith(" ");
  $("p, div, h1, h2, h3, h4, h5, h6, li, tr, blockquote, section, article").each(
    (_, element) => {
      $(element).prepend(" ");
      $(element).append(" ");
    },
  );

  const bodyText = $("body").text();
  return normalizeWhitespace(bodyText);
}
