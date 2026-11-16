///|
/// Stop derived decoding before one record can flood diagnostics. Raw records
/// and source bytes remain available. This cap is per stage, not global memory.
fn diagnostic_budget_exhausted(warnings : Array[String]) -> Bool {
  if warnings.length() < 1000 {
    return false
  }
  warnings[999] = "诊断达到资源上限；剩余内容未处理，检查不完整"
  true
}
