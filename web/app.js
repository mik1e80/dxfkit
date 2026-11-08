// 页面逻辑，三步：
//   1. 把 File 读成字节，编成 base64 传给 MoonBit
//   2. 把返回的检查报告放进右栏（textContent，不拼 HTML）
//   3. 把返回的 SVG 放进左下预览区
//
// 检查、离散、渲染全在 dist/web.js 里。

// ── 文件读取 ────────────────────────────────────────────────────────────

/// 把字节编成 base64 字符串。
///
/// 分块处理：`String.fromCharCode.apply` 的参数个数有上限，
/// 一次性传一个几十 MB 的数组会直接爆栈。32KB 一块是老经验值。
function bytesToBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/// 把一段文本（UTF-8）编成 base64——内置样例用。
function textToBase64(text) {
  return bytesToBase64(new TextEncoder().encode(text));
}

// ── 内置样例 ────────────────────────────────────────────────────────────
//
// 一张故意画坏的小图纸：干净闭合的方框、和它离得过近的第二个方框、
// 一条断开的口线、两处文字（没转曲线）、一个半径为负的圆（致命）。
// 「最小净距」填 0.8 还能看到窄缝那一条。评委点「用内置样例试一下」
// 第一眼就有东西看。

const SAMPLE_LINES = [
  "0", "SECTION", "2", "HEADER", "9", "$ACADVER", "1", "AC1027",
  "0", "ENDSEC",
  "0", "SECTION", "2", "TABLES",
  "0", "TABLE", "2", "LAYER",
  "0", "LAYER", "100", "AcDbLayerTableRecord", "2", "轮廓", "70", "0", "62", "5",
  "0", "LAYER", "100", "AcDbLayerTableRecord", "2", "标注", "70", "0", "62", "1",
  "0", "ENDTAB",
  "0", "ENDSEC",
  "0", "SECTION", "2", "ENTITIES",
  // 干净的闭合方框
  "0", "LWPOLYLINE", "8", "轮廓", "100", "AcDbPolyline", "90", "4", "70", "1",
  "10", "0", "20", "0", "10", "40", "20", "0", "10", "40", "20", "20",
  "10", "0", "20", "20",
  // 第二个方框：和第一个只隔 0.8（净距阈值填 0.8 以上会被逮到）
  "0", "LWPOLYLINE", "8", "轮廓", "100", "AcDbPolyline", "90", "4", "70", "1",
  "10", "0", "20", "20.8", "10", "40", "20", "20.8", "10", "40", "20", "30",
  "10", "0", "20", "30",
  // 一条断开的口线（轮廓没闭合）
  "0", "LINE", "8", "轮廓", "10", "50", "20", "0", "11", "60", "21", "8",
  // 文字没转曲线
  "0", "TEXT", "8", "标注", "10", "2", "20", "10", "40", "2", "1", "基准孔",
  // 半径为负的圆（致命）
  "0", "CIRCLE", "8", "轮廓", "10", "20", "20", "10", "40", "-1",
  "0", "ENDSEC", "0", "EOF",
];
const SAMPLE_TEXT = SAMPLE_LINES.join("\n") + "\n";

const NORMAL_SAMPLE_TEXT = [
  "0", "SECTION", "2", "HEADER", "9", "$INSUNITS", "70", "4", "0", "ENDSEC",
  "0", "SECTION", "2", "ENTITIES",
  "0", "LWPOLYLINE", "90", "4", "70", "1",
  "10", "0", "20", "0", "10", "40", "20", "0",
  "10", "40", "20", "20", "10", "0", "20", "20",
  "0", "ENDSEC", "0", "EOF", "",
].join("\n");

// 一个可检查的圆和一个只保留字段的 3DFACE：预览局部几何，报告未覆盖部分。
const COVERAGE_SAMPLE_TEXT = [
  "0", "SECTION", "2", "ENTITIES",
  "0", "CIRCLE", "10", "0", "20", "0", "40", "5",
  "0", "3DFACE", "10", "10", "20", "0", "11", "12", "21", "0",
  "12", "10", "22", "2", "13", "12", "23", "2",
  "0", "ENDSEC", "0", "EOF", "",
].join("\n");

// ── 跑一次检查 ──────────────────────────────────────────────────────────

const MAX_FILE_BYTES = 16 * 1024 * 1024;
const ANALYSIS_TIMEOUT_MS = 15000;
let currentBase64 = "";
let currentFile = null;
let currentName = "";
let generation = 0;
let activeWorker = null;
let activeReader = null;
let activeTimer = null;
let settleActive = null;

function stopTask() {
  generation++;
  if (activeTimer !== null) clearTimeout(activeTimer);
  activeTimer = null;
  if (activeWorker) activeWorker.terminate();
  activeWorker = null;
  if (activeReader && activeReader.readyState === 1) activeReader.abort();
  activeReader = null;
  if (settleActive) settleActive(false);
  settleActive = null;
}

function showError(message) {
  document.getElementById("report").textContent = message;
  document.getElementById("preview").replaceChildren();
}

function startAnalysis(payload, name) {
  stopTask();
  const id = generation;
  currentName = name;
  document.getElementById("status").textContent = name;
  document.getElementById("preview").replaceChildren();
  const rawGap = document.getElementById("min-gap").value;
  const minGap = Number(rawGap);
  if (rawGap.trim() === "" || !Number.isFinite(minGap) || minGap < 0) {
    showError("最小净距必须是非负有限数字；0 表示不检查净距。");
    return Promise.resolve(false);
  }
  if (typeof Worker !== "function") {
    showError("当前浏览器无法启动后台检查，请使用支持 Web Worker 的浏览器。");
    return Promise.resolve(false);
  }
  document.getElementById("report").textContent = "正在检查；可取消或选择另一文件。";
  return new Promise(resolve => {
    settleActive = resolve;
    const finish = (result, error) => {
      if (id !== generation) return;
      if (error) showError(error);
      else if (!result || typeof result !== "object" || Array.isArray(result) ||
        !["report", "svg", "error", "unit"].every(k => typeof result[k] === "string") ||
        (result.svg !== "" && !result.svg.startsWith("<svg"))) {
        showError("检查器返回了无效结果，请重试。");
      } else {
        document.getElementById("report").textContent = result.report;
        const preview = document.getElementById("preview");
        if (result.svg) preview.innerHTML = result.svg;
        else preview.textContent = result.error;
      }
      settleActive = null;
      stopTask();
      resolve(!error);
    };
    try {
      activeWorker = new Worker("worker.js");
      activeWorker.onmessage = event => {
        if (id === generation && event.data && event.data.id === id)
          finish(event.data.result, event.data.error);
      };
      activeWorker.onerror = () => finish(null, "后台检查失败，请检查输入后重试。");
      activeWorker.onmessageerror = () => finish(null, "检查结果无法传回，请重试。");
      activeTimer = setTimeout(() => finish(null, "检查超过15秒，任务已终止；请拆分图纸后重试。"), ANALYSIS_TIMEOUT_MS);
      const message = {id, ...payload, minGap, tol:0.05};
      activeWorker.postMessage(message, payload.bytes ? [payload.bytes] : []);
    } catch (_) {
      finish(null, "无法启动后台检查，请重试。");
    }
  });
}

function runCheck(base64, name) {
  currentBase64 = base64;
  currentFile = null;
  if (base64.length > Math.ceil(MAX_FILE_BYTES / 3) * 4) {
    stopTask(); showError("网页文件上限为16 MiB，请使用本地工具检查较大图纸。");
    return Promise.resolve(false);
  }
  return startAnalysis({base64}, name);
}

function readFile(file) {
  stopTask();
  currentBase64 = "";
  currentFile = null;
  currentName = "";
  if (!Number.isFinite(file.size) || file.size < 0 || file.size > MAX_FILE_BYTES) {
    showError("网页文件上限为16 MiB，请使用本地工具检查较大图纸。");
    return;
  }
  currentFile = file;
  const id = generation;
  const reader = new FileReader();
  activeReader = reader;
  reader.onload = () => {
    if (id !== generation) return;
    activeReader = null;
    if (!(reader.result instanceof ArrayBuffer) || reader.result.byteLength > MAX_FILE_BYTES) {
      showError("文件内容超出读取范围。"); return;
    }
    startAnalysis({bytes:reader.result}, file.name);
  };
  reader.onerror = () => {
    if (id !== generation) return;
    stopTask(); showError("无法读取这个文件，请重新选择。");
  };
  reader.onabort = () => {};
  reader.readAsArrayBuffer(file);
}

// ── 事件 ────────────────────────────────────────────────────────────────

document.getElementById("pick").addEventListener("click", () => {
  document.getElementById("file").click();
});

document.getElementById("file").addEventListener("change", (event) => {
  const f = event.target.files[0];
  if (f) readFile(f);
});

document.getElementById("sample").addEventListener("click", () => {
  return runCheck(textToBase64(SAMPLE_TEXT), "内置样例.dxf");
});

document.getElementById("sample-normal").addEventListener("click", () => {
  return runCheck(textToBase64(NORMAL_SAMPLE_TEXT), "正常轮廓.dxf");
});

document.getElementById("sample-coverage").addEventListener("click", () => {
  return runCheck(textToBase64(COVERAGE_SAMPLE_TEXT), "未覆盖内容.dxf");
});

// 改了净距阈值就拿同一张图重跑
document.getElementById("min-gap").addEventListener("change", () => {
  if (currentFile) return readFile(currentFile);
  if (currentBase64) return runCheck(currentBase64, currentName);
});

// 整页都能拖
const dropzone = document.getElementById("dropzone");
document.body.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("dragging");
});
document.body.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragging");
});
document.body.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("dragging");
  const f = event.dataTransfer.files[0];
  if (f) readFile(f);
});

// `index.html?sample=1` 直接跑内置样例——分享给别人的链接、
// 无头浏览器自检都用它
document.getElementById("cancel").addEventListener("click", () => {
  stopTask(); showError("检查已取消。");
});

if (location.search.includes("sample=normal")) {
  runCheck(textToBase64(NORMAL_SAMPLE_TEXT), "正常轮廓.dxf");
} else if (location.search.includes("sample=coverage")) {
  runCheck(textToBase64(COVERAGE_SAMPLE_TEXT), "未覆盖内容.dxf");
} else if (location.search.includes("sample")) {
  runCheck(textToBase64(SAMPLE_TEXT), "内置样例.dxf");
}
