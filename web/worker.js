// Application worker: transfer file bytes off the main thread before encoding.
importScripts("dist/web.js");
self.onmessage = event => {
  const {id, bytes, base64, minGap, tol} = event.data;
  try {
    let encoded = base64;
    if (bytes) {
      const input = new Uint8Array(bytes);
      if (input.byteLength > 16 * 1024 * 1024) throw new Error("file limit");
      const chunks = [];
      for (let i = 0; i < input.length; i += 32768)
        chunks.push(String.fromCharCode.apply(null, input.subarray(i, i + 32768)));
      encoded = btoa(chunks.join(""));
    }
    if (typeof encoded !== "string" || encoded.length > 22369624) throw new Error("file limit");
    self.postMessage({id, result:JSON.parse(analyze(encoded, minGap, tol))});
  } catch (_) {
    self.postMessage({id, error:"后台检查无法处理此输入；读取或检查未完成。"});
  }
};
