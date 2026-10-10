// 语料文件的读取。
//
// 这些是**源文件**而不是测试文件，有两个原因：
//
//   1. `moon check` 不编译测试文件。只被测试用到的导入会被误报
//      `unused_package`。放源文件里，导入就是真的在用。
//   2. 后面要加别的语料工具（批量生成期望值、统计覆盖率）时直接复用。

///|
/// 语料目录。
const CORPUS_DIR : String = "testdata/ezdxf"

///|
/// 列出语料里所有的 .dxf 文件。
fn corpus_files() -> Array[String] raise {
  let out : Array[String] = []
  for name in @fs.read_dir(CORPUS_DIR) {
    // read_dir 有的实现给全路径、有的给文件名，两种都兜住
    let path = if name.contains("/") || name.contains("\\") {
      name
    } else {
      CORPUS_DIR + "/" + name
    }
    if path.has_suffix(".dxf") {
      out.push(path)
    }
  }
  out
}

///|
/// 读一个语料文件并扫成 tag。
fn scan_corpus_file(path : String) -> @dxfkit.TagScan raise {
  let data = @fs.read_file_to_bytes(path) catch {
    @fs.IOError(msg) => fail("读不了 \{path}：\{msg}")
  }
  @dxfkit.scan_tags(data)
}

// `join_problems` 在测试文件里——它只被测试用，放这里会被报成 unused。
