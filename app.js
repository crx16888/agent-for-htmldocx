const STORAGE_KEY = "wechat-layout-editor-preferences";
const PREFERENCES_VERSION = 2;
const DEFAULT_HABIT_NOTE =
  "清爽、克制、耐读；正文 15px，行距偏松；一级标题相对醒目，二级标题清晰但不花哨；每段尽量短，长段自动拆开；二级标题前留白；重点句少量加粗并尽量单独成段；引用只用于观点、小结或金句；不用花哨分割线，不大面积使用强调色。";

const presets = {
  fresh: {
    accentColor: "#18756f",
    titleAlign: "left",
    h2Prefix: "",
    quoteBg: "#f4faf8",
    bodyColor: "#2f3836",
    titleColor: "#15201f",
    h2Color: "#18756f",
    strongBg: "#e9f6f3",
    listMarker: "#18756f",
  },
  calm: {
    accentColor: "#0f766e",
    titleAlign: "left",
    h2Prefix: "",
    quoteBg: "#f2f7f5",
    bodyColor: "#2f3432",
    titleColor: "#1e2927",
    h2Color: "#0f766e",
    strongBg: "#e6f3f0",
    listMarker: "#0f766e",
  },
  sharp: {
    accentColor: "#b42318",
    titleAlign: "left",
    h2Prefix: "▌",
    quoteBg: "#fff2f0",
    bodyColor: "#25201f",
    titleColor: "#221c1a",
    h2Color: "#b42318",
    strongBg: "#ffe8e4",
    listMarker: "#b42318",
  },
  warm: {
    accentColor: "#9a6b18",
    titleAlign: "center",
    h2Prefix: "",
    quoteBg: "#fbf4e5",
    bodyColor: "#342a1c",
    titleColor: "#332715",
    h2Color: "#9a6b18",
    strongBg: "#f8edcf",
    listMarker: "#9a6b18",
  },
};

const els = {
  stylePreset: document.querySelector("#stylePreset"),
  accentColor: document.querySelector("#accentColor"),
  fontSize: document.querySelector("#fontSize"),
  lineHeight: document.querySelector("#lineHeight"),
  paragraphGap: document.querySelector("#paragraphGap"),
  autoHeadings: document.querySelector("#autoHeadings"),
  autoShorten: document.querySelector("#autoShorten"),
  autoBold: document.querySelector("#autoBold"),
  autoDivider: document.querySelector("#autoDivider"),
  habitNote: document.querySelector("#habitNote"),
  saveHabitButton: document.querySelector("#saveHabitButton"),
  resetButton: document.querySelector("#resetButton"),
  sourceInput: document.querySelector("#sourceInput"),
  htmlOutput: document.querySelector("#htmlOutput"),
  preview: document.querySelector("#preview"),
  statusText: document.querySelector("#statusText"),
  formatButton: document.querySelector("#formatButton"),
  copyButton: document.querySelector("#copyButton"),
  downloadButton: document.querySelector("#downloadButton"),
  editTab: document.querySelector("#editTab"),
  htmlTab: document.querySelector("#htmlTab"),
  starterTemplate: document.querySelector("#starterTemplate"),
};

function getPreferences() {
  const preset = presets[els.stylePreset.value];

  return {
    version: PREFERENCES_VERSION,
    stylePreset: els.stylePreset.value,
    accentColor: els.accentColor.value || preset.accentColor,
    fontSize: Number(els.fontSize.value),
    lineHeight: Number(els.lineHeight.value),
    paragraphGap: Number(els.paragraphGap.value),
    autoHeadings: els.autoHeadings.checked,
    autoShorten: els.autoShorten.checked,
    autoBold: els.autoBold.checked,
    autoDivider: els.autoDivider.checked,
    habitNote: els.habitNote.value.trim(),
  };
}

function setPreferences(preferences) {
  const next = { ...defaultPreferences(), ...preferences };
  els.stylePreset.value = next.stylePreset;
  els.accentColor.value = next.accentColor;
  els.fontSize.value = next.fontSize;
  els.lineHeight.value = next.lineHeight;
  els.paragraphGap.value = next.paragraphGap;
  els.autoHeadings.checked = next.autoHeadings;
  els.autoShorten.checked = next.autoShorten;
  els.autoBold.checked = next.autoBold;
  els.autoDivider.checked = next.autoDivider;
  els.habitNote.value = next.habitNote || "";
}

function defaultPreferences() {
  return {
    version: PREFERENCES_VERSION,
    stylePreset: "fresh",
    accentColor: presets.fresh.accentColor,
    fontSize: 15,
    lineHeight: 1.9,
    paragraphGap: 22,
    autoHeadings: true,
    autoShorten: true,
    autoBold: true,
    autoDivider: true,
    habitNote: DEFAULT_HABIT_NOTE,
  };
}

function savePreferences() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getPreferences()));
  flashStatus("习惯已保存");
}

function loadPreferences() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    setPreferences(defaultPreferences());
    return;
  }

  try {
    const preferences = JSON.parse(saved);
    if (preferences.version !== PREFERENCES_VERSION) {
      setPreferences({
        ...defaultPreferences(),
        habitNote: preferences.habitNote || DEFAULT_HABIT_NOTE,
      });
      return;
    }
    setPreferences(preferences);
  } catch {
    setPreferences(defaultPreferences());
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function inlineFormat(text, preferences) {
  const preset = presets[preferences.stylePreset];
  let formatted = escapeHtml(text);

  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    `<strong style="font-weight: 700; color: ${preferences.accentColor}; background: ${preset.strongBg}; padding: 0 3px;">$1</strong>`
  );
  formatted = formatted.replace(
    /`(.*?)`/g,
    `<code style="font-family: Menlo, Monaco, Consolas, monospace; font-size: 0.92em; color: ${preferences.accentColor}; background: ${preset.strongBg}; padding: 1px 4px;">$1</code>`
  );

  if (preferences.autoBold) {
    formatted = formatted.replace(
      /(重点|注意|结论|建议|核心|关键)(：|:)/g,
      `<strong style="font-weight: 700; color: ${preferences.accentColor};">$1$2</strong>`
    );
  }

  return formatted;
}

function splitLongParagraph(line, preferences) {
  if (!preferences.autoShorten || line.length < 120) {
    return [line];
  }

  const pieces = line
    .replace(/([。！？!?])([^”’])/g, "$1\n$2")
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean);

  return pieces.length > 1 ? pieces : [line];
}

function parseBlocks(markdown, preferences) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let listItems = [];
  let nonEmptyIndex = 0;
  let previousBlank = true;

  function flushList() {
    if (!listItems.length) return;
    blocks.push({ type: "ul", items: listItems });
    listItems = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();
    const nextBlank = !lines[index + 1] || !lines[index + 1].trim();

    if (!line) {
      flushList();
      previousBlank = true;
      continue;
    }

    if (line.startsWith("# ")) {
      flushList();
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      nonEmptyIndex += 1;
      previousBlank = false;
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      nonEmptyIndex += 1;
      previousBlank = false;
      continue;
    }

    if (line.startsWith("> ")) {
      flushList();
      blocks.push({ type: "quote", text: line.slice(2).trim() });
      nonEmptyIndex += 1;
      previousBlank = false;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      listItems.push(line.replace(/^[-*]\s+/, "").trim());
      nonEmptyIndex += 1;
      previousBlank = false;
      continue;
    }

    if (preferences.autoHeadings) {
      const headingType = detectHeadingType(line, {
        nonEmptyIndex,
        previousBlank,
        nextBlank,
      });

      if (headingType) {
        flushList();
        blocks.push({ type: headingType, text: cleanDetectedHeading(line) });
        nonEmptyIndex += 1;
        previousBlank = false;
        continue;
      }
    }

    flushList();
    for (const paragraph of splitLongParagraph(line, preferences)) {
      blocks.push({ type: "p", text: paragraph });
    }
    nonEmptyIndex += 1;
    previousBlank = false;
  }

  flushList();
  return blocks;
}

function detectHeadingType(line, context) {
  const text = cleanDetectedHeading(line);
  const charLength = [...text].length;
  const endsLikeSentence = /[。！？!?；;，,：:]$/.test(text);
  const hasHeadingNumber = /^((第[一二三四五六七八九十\d]+[章节部分])|([一二三四五六七八九十]+、)|(\d{1,2}[.、]))/.test(text);
  const hasHeadingKeyword = /^(引言|前言|写在前面|背景|原因|问题|方法|步骤|案例|结论|总结|复盘|建议|下一步|最后|尾声)$/.test(text);

  if (context.nonEmptyIndex === 0 && charLength <= 38 && !endsLikeSentence) {
    return "h1";
  }

  if (hasHeadingNumber && charLength <= 34) {
    return "h2";
  }

  if (hasHeadingKeyword) {
    return "h2";
  }

  if (context.previousBlank && context.nextBlank && charLength >= 2 && charLength <= 22 && !endsLikeSentence) {
    return "h2";
  }

  return "";
}

function cleanDetectedHeading(line) {
  return line
    .replace(/^#+\s*/, "")
    .replace(/^【(.+)】$/, "$1")
    .replace(/^《(.+)》$/, "$1")
    .trim();
}

function blockToHtml(block, preferences) {
  const preset = presets[preferences.stylePreset];
  const accent = preferences.accentColor;
  const paragraphStyle = [
    `margin: 0 0 ${preferences.paragraphGap}px`,
    `font-size: ${preferences.fontSize}px`,
    `line-height: ${preferences.lineHeight}`,
    `color: ${preset.bodyColor}`,
    "text-align: left",
    "letter-spacing: 0",
  ].join(";");

  if (block.type === "h1") {
    return `<h1 style="margin: 0 0 32px; padding: 0 0 18px; border-bottom: 1px solid ${preset.strongBg}; text-align: ${preset.titleAlign}; font-size: 28px; line-height: 1.32; color: ${preset.titleColor}; font-weight: 800; letter-spacing: 0;">${inlineFormat(block.text, preferences)}</h1>`;
  }

  if (block.type === "h2") {
    const topMargin = preferences.autoDivider ? 38 : 24;
    const prefix = preset.h2Prefix ? `<span style="color: ${accent}; margin-right: 6px;">${preset.h2Prefix}</span>` : "";
    return `<h2 style="margin: ${topMargin}px 0 18px; padding: 0 0 0 10px; border-left: 3px solid ${accent}; font-size: 21px; line-height: 1.42; color: ${preset.h2Color}; font-weight: 800; letter-spacing: 0;">${prefix}${inlineFormat(block.text, preferences)}</h2>`;
  }

  if (block.type === "quote") {
    return `<blockquote style="margin: 6px 0 ${preferences.paragraphGap}px; padding: 16px 18px; border-left: 4px solid ${accent}; background: ${preset.quoteBg}; color: ${preset.bodyColor}; font-size: ${preferences.fontSize}px; line-height: ${preferences.lineHeight};">${inlineFormat(block.text, preferences)}</blockquote>`;
  }

  if (block.type === "ul") {
    const items = block.items
      .map(
        (item) =>
          `<li style="margin: 0 0 10px; padding-left: 2px;"><span style="color: ${preset.bodyColor};">${inlineFormat(item, preferences)}</span></li>`
      )
      .join("");
    return `<ul style="margin: 0 0 ${preferences.paragraphGap}px; padding-left: 1.2em; color: ${preset.listMarker}; font-size: ${preferences.fontSize}px; line-height: ${preferences.lineHeight};">${items}</ul>`;
  }

  return `<p style="${paragraphStyle}">${inlineFormat(block.text, preferences)}</p>`;
}

function renderWechatHtml(markdown, preferences) {
  const blocks = parseBlocks(markdown, preferences);
  const content = blocks.map((block) => blockToHtml(block, preferences)).join("\n");
  const habitComment = preferences.habitNote ? `\n<!-- Personal habit: ${escapeHtml(preferences.habitNote)} -->` : "";

  return `<section style="max-width: 677px; margin: 0 auto; padding: 0 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;">\n${content}\n</section>${habitComment}`;
}

function formatArticle() {
  const preferences = getPreferences();
  const html = renderWechatHtml(els.sourceInput.value, preferences);
  els.preview.innerHTML = html;
  els.htmlOutput.value = html;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  flashStatus("已生成");
}

async function copyHtml() {
  const html = els.htmlOutput.value || renderWechatHtml(els.sourceInput.value, getPreferences());

  if (copyRenderedArticle()) {
    flashStatus("富文本已复制");
    return;
  }

  try {
    if (window.ClipboardItem) {
      const item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([stripHtml(html)], { type: "text/plain" }),
      });
      await navigator.clipboard.write([item]);
      flashStatus("排版已复制");
      return;
    }

    await navigator.clipboard.writeText(html);
    flashStatus("源码已复制");
  } catch {
    els.htmlOutput.classList.remove("hidden");
    els.sourceInput.classList.add("hidden");
    setActiveTab("html");
    els.htmlOutput.select();
    document.execCommand("copy");
    flashStatus("请手动复制预览区");
  }
}

function copyRenderedArticle() {
  const selection = window.getSelection();
  const range = document.createRange();

  if (!selection || !els.preview.innerHTML.trim()) {
    return false;
  }

  range.selectNodeContents(els.preview);
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    return document.execCommand("copy");
  } finally {
    selection.removeAllRanges();
  }
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function downloadHtml() {
  const html = els.htmlOutput.value || renderWechatHtml(els.sourceInput.value, getPreferences());
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "wechat-article.html";
  link.click();
  URL.revokeObjectURL(url);
  flashStatus("已下载");
}

function setActiveTab(tab) {
  const isHtml = tab === "html";
  els.editTab.classList.toggle("active", !isHtml);
  els.htmlTab.classList.toggle("active", isHtml);
  els.sourceInput.classList.toggle("hidden", isHtml);
  els.htmlOutput.classList.toggle("hidden", !isHtml);
}

function flashStatus(text) {
  els.statusText.textContent = text;
  window.clearTimeout(flashStatus.timer);
  flashStatus.timer = window.setTimeout(() => {
    els.statusText.textContent = "已生成";
  }, 1600);
}

function applyPreset() {
  const preset = presets[els.stylePreset.value];
  els.accentColor.value = preset.accentColor;
  formatArticle();
}

function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  setPreferences(defaultPreferences());
  els.sourceInput.value = els.starterTemplate.innerHTML.trim();
  formatArticle();
  flashStatus("已恢复默认");
}

function bindEvents() {
  els.stylePreset.addEventListener("change", applyPreset);
  els.accentColor.addEventListener("input", formatArticle);
  els.fontSize.addEventListener("input", formatArticle);
  els.lineHeight.addEventListener("input", formatArticle);
  els.paragraphGap.addEventListener("input", formatArticle);
  els.autoHeadings.addEventListener("change", formatArticle);
  els.autoShorten.addEventListener("change", formatArticle);
  els.autoBold.addEventListener("change", formatArticle);
  els.autoDivider.addEventListener("change", formatArticle);
  els.habitNote.addEventListener("input", formatArticle);
  els.sourceInput.addEventListener("input", formatArticle);
  els.saveHabitButton.addEventListener("click", savePreferences);
  els.resetButton.addEventListener("click", resetAll);
  els.formatButton.addEventListener("click", formatArticle);
  els.copyButton.addEventListener("click", copyHtml);
  els.downloadButton.addEventListener("click", downloadHtml);
  els.editTab.addEventListener("click", () => setActiveTab("edit"));
  els.htmlTab.addEventListener("click", () => setActiveTab("html"));
}

function init() {
  loadPreferences();
  els.sourceInput.value = els.starterTemplate.innerHTML.trim();
  bindEvents();
  formatArticle();
}

init();
