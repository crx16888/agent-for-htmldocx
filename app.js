const STORAGE_KEY = "wechat-layout-editor-preferences";
const PREFERENCES_VERSION = 6;
const DEFAULT_HABIT_NOTE =
  "始终使用项目内 skills/dong-kehan 的生成约束；清爽、克制、耐读；正文 15px，行距偏松；一级标题相对醒目，二级标题清晰但不花哨；每段尽量短，长段自动拆开；二级标题前留白；重点句少量加粗并尽量单独成段；引用只用于观点、小结或金句；不用花哨分割线，不大面积使用强调色。";
const DEFAULT_WORD_HABIT_NOTE =
  "商务合同风格；使用 skills/dong-kehan 的事实边界与克制表达约束，但不模仿公众号文风；标题居中、庄重；正文使用宋体小四或近似字号；条款层级清晰；甲乙方信息单独排版；正文首行缩进；签署区留白充足；避免花哨颜色，整体正式、克制、可打印。";
const DEFAULT_IMAGE_STYLE_NOTE =
  "真实、有现场感、克制留白；不要廉价科技感；画面像一张能放在公众号首屏的摄影或编辑部海报。";
const DONG_KEHAN_SKILL_PATH = "skills/dong-kehan/SKILL.md";
const DONG_KEHAN_PROFILE_PATH = "skills/dong-kehan/references/dong-kehan-profile.md";
const DONG_KEHAN_SKILL_PROFILE = {
  objectiveMemory:
    "只使用用户提供或已验证的事实；不补写具体人名、日期、地点、引用、项目经历或文章数量；无法确认的信息保留为空或标注为待确认。",
  subjectiveSoul:
    "核心关系是时间、方向、选择和行动；重视方向胜过单纯努力，重视诚实判断胜过表演式正确。",
  styleGuide:
    "从具体场景进入，经由观察、分析和转折抵达价值判断；常用“不是A，而是B”“如果...”和带有修正意味的“而是”；结尾短、克制、留白。",
  generationRules:
    "生成时以 Dong Kehan-style informed draft 表述，不冒充董科含本人；事实、解释和生成规则分离；少堆金句，多保留真实判断。",
};

const presets = {
  fresh: {
    accentColor: "#007aff",
    titleAlign: "left",
    h2Prefix: "",
    quoteBg: "#eef6ff",
    bodyColor: "#1d1d1f",
    titleColor: "#111113",
    h2Color: "#007aff",
    strongBg: "#e7f1ff",
    listMarker: "#007aff",
  },
  calm: {
    accentColor: "#5856d6",
    titleAlign: "left",
    h2Prefix: "",
    quoteBg: "#f2f1ff",
    bodyColor: "#1d1d1f",
    titleColor: "#111113",
    h2Color: "#5856d6",
    strongBg: "#ecebff",
    listMarker: "#5856d6",
  },
  sharp: {
    accentColor: "#ff3b30",
    titleAlign: "left",
    h2Prefix: "▌",
    quoteBg: "#fff2f0",
    bodyColor: "#1d1d1f",
    titleColor: "#111113",
    h2Color: "#ff3b30",
    strongBg: "#ffe8e6",
    listMarker: "#ff3b30",
  },
  warm: {
    accentColor: "#ff9500",
    titleAlign: "center",
    h2Prefix: "",
    quoteBg: "#fff7e8",
    bodyColor: "#1d1d1f",
    titleColor: "#111113",
    h2Color: "#ff9500",
    strongBg: "#fff0d6",
    listMarker: "#ff9500",
  },
};

const els = {
  appEyebrow: document.querySelector("#appEyebrow"),
  appTitle: document.querySelector("#appTitle"),
  wechatModeButton: document.querySelector("#wechatModeButton"),
  wordModeButton: document.querySelector("#wordModeButton"),
  stylePreset: document.querySelector("#stylePreset"),
  accentColor: document.querySelector("#accentColor"),
  fontSize: document.querySelector("#fontSize"),
  lineHeight: document.querySelector("#lineHeight"),
  paragraphGap: document.querySelector("#paragraphGap"),
  autoImproveContent: document.querySelector("#autoImproveContent"),
  autoTypography: document.querySelector("#autoTypography"),
  useDongKehan: document.querySelector("#useDongKehan"),
  narrativeDepth: document.querySelector("#narrativeDepth"),
  keepFactsStrict: document.querySelector("#keepFactsStrict"),
  autoHeadings: document.querySelector("#autoHeadings"),
  autoShorten: document.querySelector("#autoShorten"),
  autoBold: document.querySelector("#autoBold"),
  autoDivider: document.querySelector("#autoDivider"),
  autoContractNumbering: document.querySelector("#autoContractNumbering"),
  autoPartyBlock: document.querySelector("#autoPartyBlock"),
  autoSignatureBlock: document.querySelector("#autoSignatureBlock"),
  habitNote: document.querySelector("#habitNote"),
  imageStyleNote: document.querySelector("#imageStyleNote"),
  imagePromptOutput: document.querySelector("#imagePromptOutput"),
  imageStage: document.querySelector("#imageStage"),
  imagePromptButton: document.querySelector("#imagePromptButton"),
  templateCards: document.querySelectorAll(".template-card"),
  themeSwatches: document.querySelectorAll(".theme-swatch"),
  panelAiButton: document.querySelector("#panelAiButton"),
  wordCount: document.querySelector("#wordCount"),
  previewStyleLabel: document.querySelector("#previewStyleLabel"),
  modeHint: document.querySelector("#modeHint"),
  saveHabitButton: document.querySelector("#saveHabitButton"),
  resetButton: document.querySelector("#resetButton"),
  sourceInput: document.querySelector("#sourceInput"),
  htmlOutput: document.querySelector("#htmlOutput"),
  preview: document.querySelector("#preview"),
  previewTitle: document.querySelector("#previewTitle"),
  copyTip: document.querySelector("#copyTip"),
  statusText: document.querySelector("#statusText"),
  improveArticleButton: document.querySelector("#improveArticleButton"),
  promptPackButton: document.querySelector("#promptPackButton"),
  smartContractButton: document.querySelector("#smartContractButton"),
  formatButton: document.querySelector("#formatButton"),
  copyButton: document.querySelector("#copyButton"),
  downloadButton: document.querySelector("#downloadButton"),
  editTab: document.querySelector("#editTab"),
  htmlTab: document.querySelector("#htmlTab"),
  starterTemplate: document.querySelector("#starterTemplate"),
  wordTemplate: document.querySelector("#wordTemplate"),
};

let currentMode = "wechat";
let wechatDraft = "";
let wordDraft = "";
let selectedTemplateName = "董科含长文";

function getPreferences() {
  const preset = presets[els.stylePreset.value];

  return {
    version: PREFERENCES_VERSION,
    appMode: currentMode,
    stylePreset: els.stylePreset.value,
    accentColor: els.accentColor.value || preset.accentColor,
    fontSize: Number(els.fontSize.value),
    lineHeight: Number(els.lineHeight.value),
    paragraphGap: Number(els.paragraphGap.value),
    autoImproveContent: els.autoImproveContent.checked,
    autoTypography: els.autoTypography.checked,
    useDongKehan: true,
    narrativeDepth: Number(els.narrativeDepth.value),
    keepFactsStrict: els.keepFactsStrict.checked,
    autoHeadings: els.autoHeadings.checked,
    autoShorten: els.autoShorten.checked,
    autoBold: els.autoBold.checked,
    autoDivider: els.autoDivider.checked,
    autoContractNumbering: els.autoContractNumbering.checked,
    autoPartyBlock: els.autoPartyBlock.checked,
    autoSignatureBlock: els.autoSignatureBlock.checked,
    habitNote: els.habitNote.value.trim(),
    imageStyleNote: els.imageStyleNote.value.trim(),
  };
}

function setPreferences(preferences) {
  const next = { ...defaultPreferences(), ...preferences };
  els.stylePreset.value = next.stylePreset;
  els.accentColor.value = next.accentColor;
  els.fontSize.value = next.fontSize;
  els.lineHeight.value = next.lineHeight;
  els.paragraphGap.value = next.paragraphGap;
  els.autoImproveContent.checked = next.autoImproveContent;
  els.autoTypography.checked = next.autoTypography;
  els.useDongKehan.checked = true;
  els.narrativeDepth.value = next.narrativeDepth;
  els.keepFactsStrict.checked = next.keepFactsStrict;
  els.autoHeadings.checked = next.autoHeadings;
  els.autoShorten.checked = next.autoShorten;
  els.autoBold.checked = next.autoBold;
  els.autoDivider.checked = next.autoDivider;
  els.autoContractNumbering.checked = next.autoContractNumbering;
  els.autoPartyBlock.checked = next.autoPartyBlock;
  els.autoSignatureBlock.checked = next.autoSignatureBlock;
  els.habitNote.value = next.habitNote || "";
  els.imageStyleNote.value = next.imageStyleNote || DEFAULT_IMAGE_STYLE_NOTE;
}

function defaultPreferences() {
  return {
    version: PREFERENCES_VERSION,
    stylePreset: "fresh",
    accentColor: presets.fresh.accentColor,
    fontSize: 15,
    lineHeight: 1.9,
    paragraphGap: 22,
    autoImproveContent: true,
    autoTypography: true,
    useDongKehan: true,
    narrativeDepth: 3,
    keepFactsStrict: true,
    autoHeadings: true,
    autoShorten: true,
    autoBold: true,
    autoDivider: true,
    autoContractNumbering: true,
    autoPartyBlock: true,
    autoSignatureBlock: true,
    habitNote: DEFAULT_HABIT_NOTE,
    imageStyleNote: DEFAULT_IMAGE_STYLE_NOTE,
  };
}

function savePreferences() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getPreferences()));
  flashStatus("习惯已保存");
}

function updateWordCount() {
  const count = [...els.sourceInput.value.replace(/\s/g, "")].length;
  els.wordCount.textContent = `字数: ${count}`;
}

function syncVisualControls() {
  els.templateCards.forEach((card) => {
    const cardName = card.querySelector("strong")?.textContent || "";
    card.classList.toggle("active", cardName === selectedTemplateName);
  });

  els.themeSwatches.forEach((swatch) => {
    swatch.classList.toggle("active", swatch.dataset.color.toLowerCase() === els.accentColor.value.toLowerCase());
  });

  if (els.previewStyleLabel) {
    els.previewStyleLabel.textContent = currentMode === "word" ? "当前模式：Word 合同" : `当前风格：${selectedTemplateName}`;
  }
}

function loadPreferences() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    setPreferences(defaultPreferences());
    return;
  }

  try {
    const preferences = JSON.parse(saved);
    currentMode = preferences.appMode === "word" ? "word" : "wechat";
    if (preferences.version !== PREFERENCES_VERSION) {
      setPreferences({
        ...defaultPreferences(),
        habitNote: currentMode === "word" ? DEFAULT_WORD_HABIT_NOTE : preferences.habitNote || DEFAULT_HABIT_NOTE,
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

function isPartyLine(text) {
  return /^(甲方|乙方|丙方|丁方|委托方|受托方|买方|卖方|出租方|承租方|服务方|客户方|统一社会信用代码|地址|联系人|联系电话|开户行|账号)(：|:)/.test(text);
}

function isSignatureLine(text) {
  return /(盖章|签字|授权代表|法定代表人|日期)(：|:|____|__)/.test(text);
}

function isContractHeading(text) {
  return /^第[一二三四五六七八九十百\d]+条/.test(text) || /^\d{1,2}[.、]/.test(text);
}

function hasContractShape(text) {
  const headingCount = (text.match(/第[一二三四五六七八九十百\d]+条/g) || []).length;
  return headingCount >= 3 && /甲方|乙方/.test(text);
}

function extractField(text, labels, fallback) {
  for (const label of labels) {
    const pattern = new RegExp(`${label}[：:是为]?\\s*([^\\n；;，,。]+)`);
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return fallback;
}

function normalizeChineseNumber(text) {
  const digits = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  if (/^[零一二两三四五六七八九]$/.test(text)) return digits[text];
  if (text === "十") return 10;
  const tenMatch = text.match(/^([一二两三四五六七八九])?十([一二三四五六七八九])?$/);
  if (tenMatch) {
    return (tenMatch[1] ? digits[tenMatch[1]] : 1) * 10 + (tenMatch[2] ? digits[tenMatch[2]] : 0);
  }
  return Number(text);
}

function extractMoney(text) {
  const match = text.match(/((人民币|RMB|¥)?\s*[\d,.]+\s*(万)?\s*(元|块)?)/i);
  if (match && /\d/.test(match[1])) {
    const rawNumber = Number(match[1].replace(/[^\d.]/g, ""));
    if (match[3]) return `人民币${rawNumber}万元`;
    return `人民币${rawNumber.toLocaleString("zh-CN")}元`;
  }

  const chineseMatch = text.match(/([一二两三四五六七八九十]+)\s*万\s*(元|块)?/);
  if (chineseMatch) {
    return `人民币${normalizeChineseNumber(chineseMatch[1])}万元`;
  }

  return "人民币__________元";
}

function extractDateRange(text) {
  const range = text.match(/(\d{4}年\d{1,2}月\d{1,2}日|\d{4}[./-]\d{1,2}[./-]\d{1,2}).{0,8}(至|到|-|—).{0,8}(\d{4}年\d{1,2}月\d{1,2}日|\d{4}[./-]\d{1,2}[./-]\d{1,2})/);
  if (range) return range[0];

  const looseTime = text.match(/(\d{1,2}|[一二三四五六七八九十]+)\s*月\s*(上旬|中旬|下旬|初|底|末)?(的)?(一个)?(上午|下午|晚上|全天)?/);
  if (looseTime) {
    const month = /\d+/.test(looseTime[1]) ? looseTime[1] : normalizeChineseNumber(looseTime[1]);
    return `____年${month}月${looseTime[2] || "____"}${looseTime[5] ? `（${looseTime[5]}）` : ""}`;
  }

  const duration = text.match(/(合作期|服务期|期限)[：:为是]?\s*([^\n。；;]+)/);
  return duration ? duration[2].trim() : "____年__月__日至____年__月__日";
}

function extractDelivery(text) {
  if (/活动/.test(text)) {
    return "活动策划方案、执行排期、现场执行支持、活动复盘资料及双方确认的其他活动服务成果";
  }
  const delivery = text.match(/(交付|成果| deliverable|deliverables)[：:为是]?\s*([^\n。；;]+)/i);
  if (delivery) return delivery[2].trim();
  return "符合双方书面确认的服务成果、交付物、阶段报告或其他工作成果";
}

function extractPaymentTerm(text) {
  if (/分期|节点|预付款|尾款/.test(text)) {
    return "甲方按照双方确认的付款节点向乙方支付服务费用；如约定预付款、阶段款或尾款的，甲方应在对应节点条件成就后支付。";
  }
  if (/一次性|一次付清/.test(text)) {
    return "甲方应在本合同生效后____个工作日内一次性向乙方支付全部服务费用。";
  }
  return "甲方应按照双方另行确认的付款安排向乙方支付服务费用；乙方应在收款前或收款后按甲方要求提供合法有效的发票或收款凭证。";
}

function splitBriefItems(text, keywords) {
  const lines = text
    .split(/[\n；;]/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.filter((line) => keywords.some((keyword) => line.includes(keyword))).slice(0, 4);
}

function inferNaturalLanguageContract(brief) {
  const normalized = brief.replace(/\s+/g, " ").trim();
  const counterpartMatch = normalized.match(/(?:和|与|跟)([^，。,；;\s]+)(?:谈|签|做|进行|合作)/);
  const payorMatch = normalized.match(/对方|他们|甲方|客户|委托方/);
  const selfAsServiceProvider = /我.*(帮|为|给).*?(做|提供|负责|执行|策划|承办)/.test(normalized);
  const activityMatch = normalized.match(/(?:帮|为|给)?(?:他们|对方|甲方|客户)?(?:去)?做([^，。,；;]*活动)|活动/);
  const servicePhraseMatch = normalized.match(/我.*?(?:帮|为|给).*?(?:他们|对方|甲方|客户)?(?:去)?(做|提供|负责|执行|策划|承办)([^，。,；;]*)/);
  const serviceCore = servicePhraseMatch && servicePhraseMatch[2] ? servicePhraseMatch[2].trim() : "";
  const project = activityMatch ? `${serviceCore || ""}${serviceCore.includes("活动") ? "" : "活动"}服务`.replace(/^活动服务$/, "活动策划与执行服务") : serviceCore || extractField(normalized, ["项目", "合作内容", "服务内容", "事项"], "相关商务合作项目");
  const partyA = counterpartMatch ? counterpartMatch[1].trim() : extractField(normalized, ["甲方", "委托方", "客户方", "买方"], "__________");
  const partyB = selfAsServiceProvider ? "__________（服务提供方）" : extractField(normalized, ["乙方", "受托方", "服务方", "卖方"], "__________");

  return {
    partyA,
    partyB,
    project,
    contractTitle: /活动/.test(project) ? "活动服务合作合同" : "商务合作合同",
    serviceProviderRole: selfAsServiceProvider ? "乙方" : "乙方",
    clientRole: payorMatch ? "甲方" : "甲方",
    naturalLanguage: true,
  };
}

function buildSmartContractDraft(brief) {
  const normalized = brief.trim();
  const inferred = inferNaturalLanguageContract(normalized);
  const partyA = inferred.partyA;
  const partyB = inferred.partyB;
  const project = inferred.project;
  const contractTitle = inferred.contractTitle;
  const fee = extractMoney(normalized);
  const dateRange = extractDateRange(normalized);
  const delivery = extractDelivery(normalized);
  const paymentTerm = extractPaymentTerm(normalized);
  const rights = splitBriefItems(normalized, ["权益", "权利", "分成", "所有权", "使用权", "授权"]);
  const obligations = splitBriefItems(normalized, ["负责", "义务", "提供", "配合", "交付", "验收"]);
  const confidentiality = /保密|秘密|客户信息|数据/.test(normalized)
    ? "双方应对合作过程中知悉的商业秘密、技术资料、客户信息、经营数据及其他未公开信息承担保密义务。"
    : "双方对在合作过程中获知的对方未公开信息负有保密义务，未经对方书面同意不得向第三方披露。";

  const rightsText = rights.length
    ? rights.map((item, index) => `${index + 1}. ${item.replace(/^[-*\d.、\s]+/, "")}`).join("\n")
    : /活动/.test(project)
      ? "1. 甲方有权要求乙方按照确认的活动目标、时间安排和服务范围完成活动服务。\n2. 甲方在足额支付合同费用后，有权在本次活动及相关宣传范围内使用乙方交付的活动方案、执行资料及复盘材料。\n3. 未经对方书面同意，任何一方不得超出本次合作目的使用对方名称、商标、资料或其他权益。"
      : "1. 双方基于本合同取得的合作权益以合同约定及双方书面确认为准。\n2. 未经对方书面同意，任何一方不得超出合作目的使用对方的名称、商标、资料、成果或其他权益。";
  const obligationsText = obligations.length
    ? obligations.map((item, index) => `${index + 1}. ${item.replace(/^[-*\d.、\s]+/, "")}`).join("\n")
    : /活动/.test(project)
      ? "1. 甲方应及时向乙方提供活动目标、品牌要求、场地信息、嘉宾或参与人员安排及其他必要资料。\n2. 甲方应按照合同约定及时支付服务费用，并对乙方提交的方案、物料或执行安排及时反馈确认意见。\n3. 乙方应根据甲方需求完成活动策划、执行准备、现场协调及活动复盘等服务。\n4. 乙方应合理安排服务人员和执行计划，并在活动执行过程中及时与甲方沟通进度及突发事项。"
      : "1. 甲方应按约定提供必要资料、需求说明和配合条件。\n2. 乙方应按约定完成服务内容，并及时向甲方反馈进度。";

  return `${contractTitle}

合同编号：__________

甲方：${partyA}
统一社会信用代码：__________
地址：__________
联系人：__________

乙方：${partyB}
统一社会信用代码：__________
地址：__________
联系人：__________

鉴于甲方拟委托乙方提供“${project}”，乙方具备相应服务能力，双方本着平等自愿、诚实信用、互利共赢的原则，经友好协商，订立本合同，以共同遵守。

第一条 合作内容

1. 甲方委托乙方提供与“${project}”相关的策划、组织、执行、协调及支持服务。
2. 乙方应结合甲方需求完成活动方案沟通、执行准备、现场支持及活动后的必要复盘工作。
3. 活动暂定于${dateRange}开展；具体日期、地点、议程、人员分工及执行细节以双方后续书面确认的信息为准。
4. 如合作内容需进一步细化，双方可通过补充协议、需求确认单、项目计划、聊天记录、邮件等书面形式确认。

第二条 双方权利与义务

${obligationsText}

第三条 合作权益

${rightsText}

第四条 交付与验收

1. 乙方应向甲方交付：${delivery}。
2. 甲方应在收到交付成果后____个工作日内完成验收；如甲方提出合理修改意见，乙方应在合理期限内予以调整。
3. 甲方逾期未提出书面异议的，视为对应交付成果验收通过。

第五条 合作期限

本合同合作期限为：自本合同生效之日起至本次活动执行完毕并完成结算之日止。活动时间暂定为${dateRange}。合作期限届满后，如双方继续合作，应另行签署书面协议或补充协议。

第六条 费用及支付

1. 本合同项下合作费用为：${fee}。
2. ${paymentTerm}
3. 如因甲方需求变更导致工作量、成本或交付周期明显增加，双方应另行协商费用及进度调整。

第七条 保密义务

${confidentiality}保密义务不因本合同终止、解除或履行完毕而失效。

第八条 知识产权

1. 双方在合作前已经拥有的知识产权仍归原权利方所有。
2. 因本合同产生的服务成果、文档、方案、素材或其他成果的权属及使用范围，由双方根据合作目的另行确认；未明确约定的，任何一方不得擅自转让、许可第三方使用或用于本合同目的之外的事项。

第九条 违约责任

任何一方违反本合同约定，导致合同目的无法实现或给对方造成损失的，应承担违约责任，并赔偿守约方因此遭受的实际损失。因不可抗力导致不能履行的，受影响方应及时通知对方，并在合理范围内减轻损失。

第十条 合同变更与解除

本合同的变更、补充或解除应经双方书面确认。任何一方未经对方书面同意，不得擅自变更或解除本合同，法律另有规定或本合同另有约定的除外。

第十一条 争议解决

因本合同产生或与本合同有关的争议，双方应先友好协商解决；协商不成的，任一方可向合同签署地有管辖权的人民法院提起诉讼。

第十二条 其他

1. 本合同自双方盖章或授权代表签字之日起生效。
2. 本合同一式两份，甲乙双方各执一份，具有同等法律效力。
3. 本合同根据双方已提供或已确认的信息生成；未明确填明的信息，不视为任一方已作出承诺，应以双方后续书面确认为准。
4. 本合同未尽事宜，双方可另行签署补充协议，补充协议与本合同具有同等法律效力。

甲方（盖章）：__________          乙方（盖章）：__________

授权代表：__________              授权代表：__________

日期：____年__月__日              日期：____年__月__日`;
}

function extractTitle(text) {
  const firstLine = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  if (!firstLine) return "一篇还需要方向感的文章";
  return cleanDetectedHeading(firstLine).replace(/^#+\s*/, "").slice(0, 36);
}

function extractKeywords(text) {
  const candidates = text
    .replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 2 && word.length <= 8);
  const stopWords = new Set(["这个", "我们", "他们", "一个", "不是", "而是", "因为", "所以", "如果", "可以", "没有", "需要", "已经"]);
  const counts = new Map();
  candidates.forEach((word) => {
    if (!stopWords.has(word)) counts.set(word, (counts.get(word) || 0) + 1);
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word);
}

function getDongKehanSkillBrief(context = "article") {
  const baseRules = [
    `Skill source: ${DONG_KEHAN_SKILL_PATH}`,
    `Profile source: ${DONG_KEHAN_PROFILE_PATH}`,
    DONG_KEHAN_SKILL_PROFILE.objectiveMemory,
    DONG_KEHAN_SKILL_PROFILE.subjectiveSoul,
    DONG_KEHAN_SKILL_PROFILE.styleGuide,
    DONG_KEHAN_SKILL_PROFILE.generationRules,
  ];

  if (context === "contract") {
    return [
      ...baseRules,
      "合同生成只采用事实边界、克制表达和不虚构原则；保持商务合同体例，不写成公众号文章。",
    ].join("\n");
  }

  if (context === "image") {
    return [
      ...baseRules,
      "图片提示词优先呈现场景、方向感、时间感和真实现场，不生成夸张符号化视觉。",
    ].join("\n");
  }

  return baseRules.join("\n");
}

function buildOpeningScene(text, preferences) {
  const title = extractTitle(text);
  const keywords = extractKeywords(text);
  const anchor = keywords[0] || title;
  const depth = preferences.narrativeDepth || 3;

  if (depth <= 1) {
    return `# ${title}\n\n真正值得写下来的，不只是${anchor}本身，而是它背后那个反复出现的方向问题。`;
  }

  return `# ${title}\n\n有时候，一个问题不是在会议室里出现的，而是在你停下来、重新看一遍手上的材料时出现的。\n\n${anchor}看起来只是一个具体事项，但它真正提醒我们的，是时间、方向和选择之间的关系。`;
}

function normalizeWechatParagraphs(text) {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .flatMap((chunk) => chunk.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter(Boolean);
}

function improveParagraph(line, preferences) {
  const text = line.trim();
  if (!text || text.startsWith("#") || text.startsWith(">") || /^[-*]\s+/.test(text)) return text;
  if ([...text].length < 24) return text;

  const isQuestion = /[?？]$/.test(text);
  const depth = preferences.narrativeDepth || 3;
  let improved = text;

  improved = improved.replace(/很重要/g, "真正重要");
  improved = improved.replace(/非常/g, "更");
  improved = improved.replace(/大家/g, "我们");

  if (depth >= 3 && !/[。！？!?]不是/.test(improved) && /是|需要|应该|重要|关键/.test(improved)) {
    improved += `\n\n不是把它做得更热闹，而是先弄清楚它为什么值得被做。`;
  }

  if (depth >= 4 && !isQuestion) {
    improved += `\n\n如果把时间拉长一点看，这件事最后留下来的，往往不是一段漂亮表述，而是一次更诚实的判断。`;
  }

  return improved;
}

function buildDongKehanDraft(rawText, preferences) {
  const original = rawText.trim();
  if (!original) return "";

  const paragraphs = normalizeWechatParagraphs(original);
  const title = extractTitle(original);
  const body = paragraphs
    .filter((line, index) => index !== 0 || cleanDetectedHeading(line) !== title)
    .map((line) => improveParagraph(line, preferences))
    .join("\n\n");
  const opening = buildOpeningScene(original, preferences);
  const ending =
    preferences.narrativeDepth >= 3
      ? "\n\n## 最后\n\n很多事情不是输在努力不够，而是输在没有及时确认方向。\n\n先把方向说清楚，再继续往前走。"
      : "\n\n## 最后\n\n把方向说清楚，再继续往前走。";

  return `${opening}\n\n${body}${ending}`;
}

function analyzeTypography(text) {
  const paragraphs = normalizeWechatParagraphs(text);
  const lengths = paragraphs.map((line) => [...line].length).filter(Boolean);
  const average = lengths.length ? lengths.reduce((sum, len) => sum + len, 0) / lengths.length : 40;
  const total = lengths.reduce((sum, len) => sum + len, 0);

  if (total > 2600 || average > 90) {
    return { fontSize: 15, lineHeight: 1.95, paragraphGap: 24 };
  }

  if (total < 900 && average < 48) {
    return { fontSize: 16, lineHeight: 1.85, paragraphGap: 20 };
  }

  return { fontSize: 15, lineHeight: 1.9, paragraphGap: 22 };
}

function getRenderPreferences(preferences, text) {
  if (currentMode !== "wechat" || !preferences.autoTypography) return preferences;
  return { ...preferences, ...analyzeTypography(text) };
}

function getWechatWorkingText(preferences) {
  if (currentMode !== "wechat" || !preferences.autoImproveContent) return els.sourceInput.value;
  return buildDongKehanDraft(els.sourceInput.value, preferences);
}

function buildPromptPack() {
  const preferences = getPreferences();
  const source = els.sourceInput.value.trim();
  const keywords = extractKeywords(source).join("、") || "待提炼";

  return `请使用项目内 dong-kehan skill 改善这篇公众号文章，并输出可直接进入公众号排版的 Markdown。

约束：
- ${getDongKehanSkillBrief("article").replace(/\n/g, "\n- ")}
- 事实边界：${preferences.keepFactsStrict ? "只使用原文事实，不补写具体人名、日期、地点、引用和案例。" : "可在不冒充真实事实的前提下进行轻度抽象扩写。"}
- 叙事强度：${preferences.narrativeDepth}/5
- 排版习惯：${preferences.habitNote || DEFAULT_HABIT_NOTE}
- 关键词：${keywords}

输出结构：
1. 先给一版优化后的标题。
2. 正文用 Markdown，保留短段落。
3. 重点句用 **加粗**。
4. 不要声称这是董科含本人写的，只说是 Dong Kehan-style informed draft。

原文：
${source || "（在这里粘贴原文）"}`;
}

async function copyText(text, successText) {
  try {
    await navigator.clipboard.writeText(text);
    flashStatus(successText);
  } catch {
    els.htmlOutput.classList.remove("hidden");
    els.sourceInput.classList.add("hidden");
    setActiveTab("html");
    els.htmlOutput.value = text;
    els.htmlOutput.select();
    document.execCommand("copy");
    flashStatus("已放入 HTML 区");
  }
}

function improveWechatArticle() {
  if (currentMode !== "wechat") {
    setMode("wechat");
  }

  const draft = buildDongKehanDraft(els.sourceInput.value, getPreferences());
  if (!draft) {
    flashStatus("请先粘贴文章");
    return;
  }

  els.sourceInput.value = draft;
  setActiveTab("edit");
  formatArticle();
  flashStatus("已按 kehan skill 改稿");
}

function buildImagePrompt() {
  const source = els.sourceInput.value.trim();
  const title = extractTitle(source);
  const keywords = extractKeywords(source).join(", ");
  const style = els.imageStyleNote.value.trim() || DEFAULT_IMAGE_STYLE_NOTE;

  return `公众号文章配图/封面生成提示词：
主题：${title}
关键词：${keywords || "方向、时间、选择、现场感"}
画面：一个克制、有真实现场感的编辑部视觉；留出标题空间；画面不要过满；情绪安静但有行动感。
kehan skill 约束：${getDongKehanSkillBrief("image").replace(/\n/g, " ")}
风格预设：${style}
构图：横版 16:9，可裁切为公众号首图；主体明确，背景干净；不要出现乱码文字、水印、夸张符号。
模型策略：优先使用最高质量图像模型，先生成 4 张方向稿，再选 1 张精修。`;
}

function generateImagePrompt() {
  const prompt = buildImagePrompt();
  els.imagePromptOutput.value = prompt;
  els.imageStage.innerHTML = `<span>${escapeHtml(extractTitle(els.sourceInput.value || "文章配图"))}<br>图片提示词已生成，等待接入生图模型。</span>`;
  flashStatus("图片提示词已生成");
}

function wordInlineFormat(text) {
  return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function wordBlockToHtml(block, preferences) {
  const text = block.text || "";

  if (block.type === "h1") {
    return `<h1 style="margin: 0 0 18pt; text-align: center; font-family: SimHei, 'Microsoft YaHei', sans-serif; font-size: 22pt; line-height: 1.4; font-weight: 700; color: #111;">${wordInlineFormat(text)}</h1>`;
  }

  if (block.type === "h2" || (preferences.autoContractNumbering && isContractHeading(text))) {
    return `<h2 style="margin: 16pt 0 8pt; font-family: SimHei, 'Microsoft YaHei', sans-serif; font-size: 14pt; line-height: 1.5; font-weight: 700; color: #111;">${wordInlineFormat(text)}</h2>`;
  }

  if (block.type === "quote") {
    return `<p style="margin: 0 0 10pt; padding: 8pt 10pt; border-left: 3pt solid #777; background: #f5f5f5; font-family: SimSun, STSong, serif; font-size: 12pt; line-height: 1.8;">${wordInlineFormat(text)}</p>`;
  }

  if (block.type === "ul") {
    const items = block.items.map((item) => `<li style="margin: 0 0 5pt;">${wordInlineFormat(item)}</li>`).join("");
    return `<ul style="margin: 0 0 10pt 22pt; padding: 0; font-family: SimSun, STSong, serif; font-size: 12pt; line-height: 1.8;">${items}</ul>`;
  }

  if (preferences.autoPartyBlock && isPartyLine(text)) {
    return `<p style="margin: 0 0 6pt; font-family: SimSun, STSong, serif; font-size: 12pt; line-height: 1.8; font-weight: 700;">${wordInlineFormat(text)}</p>`;
  }

  if (preferences.autoSignatureBlock && isSignatureLine(text)) {
    return `<p style="margin: 18pt 0 10pt; font-family: SimSun, STSong, serif; font-size: 12pt; line-height: 2.2;">${wordInlineFormat(text).replace(/\s{2,}/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")}</p>`;
  }

  return `<p style="margin: 0 0 10pt; font-family: SimSun, STSong, serif; font-size: 12pt; line-height: 1.8; text-indent: 24pt; color: #111;">${wordInlineFormat(text)}</p>`;
}

function renderWordHtml(markdown, preferences, fullDocument = false) {
  const blocks = parseBlocks(markdown, { ...preferences, autoShorten: false });
  const content = blocks.map((block) => wordBlockToHtml(block, preferences)).join("\n");
  const body = `<section class="word-page" style="width: 794px; min-height: 1123px; margin: 0 auto; padding: 76px 86px; background: #fff; color: #111; box-shadow: 0 16px 44px rgba(23, 31, 31, 0.14);">\n${content}\n</section>`;

  if (!fullDocument) {
    return body;
  }

  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>商务合同</title>
  <style>
    @page { size: A4; margin: 2.54cm 3.18cm 2.54cm 3.18cm; }
    body { margin: 0; font-family: SimSun, STSong, serif; color: #111; }
    h1, h2, p, li { mso-pagination: widow-orphan; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
}

function renderWechatHtml(markdown, preferences) {
  const blocks = parseBlocks(markdown, preferences);
  const content = blocks.map((block) => blockToHtml(block, preferences)).join("\n");
  const habitComment = preferences.habitNote ? `\n<!-- Personal habit: ${escapeHtml(preferences.habitNote)} -->` : "";

  return `<section style="max-width: 677px; margin: 0 auto; padding: 0 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;">\n${content}\n</section>${habitComment}`;
}

function formatArticle() {
  const preferences = getPreferences();
  const workingText = currentMode === "word" ? els.sourceInput.value : getWechatWorkingText(preferences);
  const renderPreferences = currentMode === "word" ? preferences : getRenderPreferences(preferences, workingText);
  const html = currentMode === "word" ? renderWordHtml(workingText, renderPreferences) : renderWechatHtml(workingText, renderPreferences);
  const output = currentMode === "word" ? renderWordHtml(workingText, renderPreferences, true) : html;

  els.preview.innerHTML = html;
  els.htmlOutput.value = output;
  updateWordCount();
  syncVisualControls();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  flashStatus("已生成");
}

async function copyHtml() {
  const preferences = getPreferences();
  const workingText = currentMode === "word" ? els.sourceInput.value : getWechatWorkingText(preferences);
  const renderPreferences = currentMode === "word" ? preferences : getRenderPreferences(preferences, workingText);
  const html = els.htmlOutput.value || (currentMode === "word" ? renderWordHtml(workingText, renderPreferences, true) : renderWechatHtml(workingText, renderPreferences));

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
  const preferences = getPreferences();
  const workingText = currentMode === "word" ? els.sourceInput.value : getWechatWorkingText(preferences);
  const renderPreferences = currentMode === "word" ? preferences : getRenderPreferences(preferences, workingText);
  const html = currentMode === "word" ? renderWordHtml(workingText, renderPreferences, true) : els.htmlOutput.value || renderWechatHtml(workingText, renderPreferences);
  const blob = new Blob([html], { type: currentMode === "word" ? "application/msword;charset=utf-8" : "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = currentMode === "word" ? "business-contract.doc" : "wechat-article.html";
  link.click();
  URL.revokeObjectURL(url);
  flashStatus("已下载");
}

function generateSmartContract() {
  if (currentMode !== "word") {
    setMode("word");
  }

  const brief = els.sourceInput.value.trim();
  if (!brief) {
    els.sourceInput.value =
      "甲方：____公司\n乙方：____公司\n合作内容：乙方为甲方提供____服务\n费用：人民币____元\n期限：____年__月__日至____年__月__日\n双方权益：____\n交付成果：____";
    formatArticle();
    flashStatus("已放入填写提示");
    return;
  }

  if (hasContractShape(brief)) {
    formatArticle();
    flashStatus("已识别为合同原文");
    return;
  }

  els.sourceInput.value = buildSmartContractDraft(brief);
  wordDraft = els.sourceInput.value;
  setActiveTab("edit");
  formatArticle();
  flashStatus("合同已按 kehan 约束生成");
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

function applyTemplatePreset(presetName, card) {
  if (!presets[presetName]) return;
  selectedTemplateName = card?.querySelector("strong")?.textContent || selectedTemplateName;
  els.stylePreset.value = presetName;
  applyPreset();
}

function applyThemeColor(color) {
  els.accentColor.value = color;
  formatArticle();
}

function setMode(mode) {
  if (mode === currentMode) return;

  if (currentMode === "wechat") {
    wechatDraft = els.sourceInput.value;
  } else {
    wordDraft = els.sourceInput.value;
  }

  currentMode = mode;
  applyModeUi(true);
  formatArticle();
}

function applyModeUi(shouldSwapContent = false) {
  const isWord = currentMode === "word";

  document.body.classList.toggle("word-mode", isWord);
  els.wechatModeButton.classList.toggle("active", !isWord);
  els.wordModeButton.classList.toggle("active", isWord);
  els.appTitle.textContent = isWord ? "合同处理" : "预设模板";
  els.appEyebrow.textContent = isWord ? "Contract Controls" : "Preset Templates";
  els.previewTitle.textContent = isWord ? "Word 合同预览" : "模板预览";
  els.copyTip.textContent = isWord
    ? "下载的是 Word 可打开的 .doc 文件；后续可接后端生成真正 .docx。"
    : "如果公众号后台没有保留样式，请点击右侧预览区，按 Command/Ctrl + A，再复制粘贴到正文编辑器。";
  els.modeHint.textContent = isWord
    ? "Word 模式会使用 kehan skill 的事实边界与克制表达约束，自动识别合同标题、甲乙方信息、条款编号和签署区，并生成可由 Word 打开的文件。"
    : "公众号模式会先按 kehan skill 改善表达，再自动判断字号、行距和段落节奏。复制任务包可交给 Codex/模型做更强改稿。";
  els.copyButton.title = isWord ? "复制合同富文本" : "复制富文本到公众号";
  els.downloadButton.title = isWord ? "下载 Word 文件" : "下载 HTML 文件";
  if (shouldSwapContent) {
    els.sourceInput.value = isWord ? wordDraft || els.wordTemplate.innerHTML.trim() : wechatDraft || els.starterTemplate.innerHTML.trim();
  }

  if (isWord && els.habitNote.value === DEFAULT_HABIT_NOTE) {
    els.habitNote.value = DEFAULT_WORD_HABIT_NOTE;
  }

  if (!isWord && els.habitNote.value === DEFAULT_WORD_HABIT_NOTE) {
    els.habitNote.value = DEFAULT_HABIT_NOTE;
  }

  if (!els.imageStyleNote.value.trim()) {
    els.imageStyleNote.value = DEFAULT_IMAGE_STYLE_NOTE;
  }

  els.smartContractButton.classList.toggle("hidden", !isWord);
  syncVisualControls();
}

function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  setPreferences(defaultPreferences());
  els.sourceInput.value = currentMode === "word" ? els.wordTemplate.innerHTML.trim() : els.starterTemplate.innerHTML.trim();
  els.habitNote.value = currentMode === "word" ? DEFAULT_WORD_HABIT_NOTE : DEFAULT_HABIT_NOTE;
  els.imageStyleNote.value = DEFAULT_IMAGE_STYLE_NOTE;
  updateWordCount();
  generateImagePrompt();
  formatArticle();
  flashStatus("已恢复默认");
}

function bindEvents() {
  els.wechatModeButton.addEventListener("click", () => setMode("wechat"));
  els.wordModeButton.addEventListener("click", () => setMode("word"));
  els.stylePreset.addEventListener("change", applyPreset);
  els.templateCards.forEach((card) => {
    card.addEventListener("click", () => applyTemplatePreset(card.dataset.preset, card));
  });
  els.themeSwatches.forEach((swatch) => {
    swatch.addEventListener("click", () => applyThemeColor(swatch.dataset.color));
  });
  els.accentColor.addEventListener("input", formatArticle);
  els.fontSize.addEventListener("input", formatArticle);
  els.lineHeight.addEventListener("input", formatArticle);
  els.paragraphGap.addEventListener("input", formatArticle);
  els.autoImproveContent.addEventListener("change", formatArticle);
  els.autoTypography.addEventListener("change", formatArticle);
  els.useDongKehan.addEventListener("change", formatArticle);
  els.narrativeDepth.addEventListener("input", formatArticle);
  els.keepFactsStrict.addEventListener("change", formatArticle);
  els.autoHeadings.addEventListener("change", formatArticle);
  els.autoShorten.addEventListener("change", formatArticle);
  els.autoBold.addEventListener("change", formatArticle);
  els.autoDivider.addEventListener("change", formatArticle);
  els.autoContractNumbering.addEventListener("change", formatArticle);
  els.autoPartyBlock.addEventListener("change", formatArticle);
  els.autoSignatureBlock.addEventListener("change", formatArticle);
  els.habitNote.addEventListener("input", formatArticle);
  els.imageStyleNote.addEventListener("input", generateImagePrompt);
  els.sourceInput.addEventListener("input", () => {
    updateWordCount();
    formatArticle();
  });
  els.saveHabitButton.addEventListener("click", savePreferences);
  els.resetButton.addEventListener("click", resetAll);
  els.formatButton.addEventListener("click", formatArticle);
  els.improveArticleButton.addEventListener("click", improveWechatArticle);
  els.panelAiButton.addEventListener("click", improveWechatArticle);
  els.promptPackButton.addEventListener("click", () => copyText(buildPromptPack(), "任务包已复制"));
  els.imagePromptButton.addEventListener("click", generateImagePrompt);
  els.smartContractButton.addEventListener("click", generateSmartContract);
  els.copyButton.addEventListener("click", copyHtml);
  els.downloadButton.addEventListener("click", downloadHtml);
  els.editTab.addEventListener("click", () => setActiveTab("edit"));
  els.htmlTab.addEventListener("click", () => setActiveTab("html"));
}

function init() {
  loadPreferences();
  wechatDraft = els.starterTemplate.innerHTML.trim();
  wordDraft = els.wordTemplate.innerHTML.trim();
  els.sourceInput.value = currentMode === "word" ? wordDraft : wechatDraft;
  applyModeUi(false);
  bindEvents();
  generateImagePrompt();
  formatArticle();
}

init();
