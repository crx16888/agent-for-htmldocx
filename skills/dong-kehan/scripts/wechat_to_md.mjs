import fs from "node:fs/promises";
import TurndownService from "turndown";
import { chromium } from "playwright";

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/wechat_to_md.mjs <wechat_article_url> [output_dir]");
  process.exit(1);
}

const outputDir = process.argv[3] || ".";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  locale: "zh-CN",
});

try {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("#js_content", { timeout: 60000 });

  const data = await page.evaluate(() => {
    const pickText = (selector) =>
      document.querySelector(selector)?.textContent?.trim() || "";

    document.querySelectorAll("img[data-src]").forEach((img) => {
      const dataSrc = img.getAttribute("data-src");
      if (dataSrc && !img.getAttribute("src")) img.setAttribute("src", dataSrc);
    });

    const title = pickText("#activity-name") || document.title || "wechat_article";
    const author =
      pickText("#js_name") || pickText(".rich_media_meta.rich_media_meta_text");
    const publishTime =
      pickText("#publish_time") || pickText("#publish_time_meta");
    const contentEl = document.querySelector("#js_content");
    const html = contentEl ? contentEl.innerHTML : "";
    const cover =
      document.querySelector("meta[property='og:image']")?.getAttribute("content") ||
      "";

    return { title, author, publishTime, html, cover };
  });

  if (!data.html.trim()) {
    throw new Error("Found #js_content but it was empty.");
  }

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

  const mdBody = turndown.turndown(data.html).replace(/\n{3,}/g, "\n\n").trim();
  const safeTitle = data.title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 80);
  const outPath = `${outputDir.replace(/\/$/, "")}/${safeTitle}.md`;

  const md = [
    `> 来源：${url}`,
    data.publishTime ? `> 发布时间：${data.publishTime}` : null,
    data.author ? `> 作者：${data.author}` : null,
    "",
    data.cover ? `![cover](${data.cover})` : null,
    "",
    `# ${data.title}`,
    "",
    mdBody,
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outPath, md, "utf-8");
  console.log(`Saved: ${outPath}`);
} finally {
  await browser.close();
}
