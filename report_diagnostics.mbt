///|
/// Stable categories for integrations. Individual legacy messages may change.
pub(all) enum DiagnosticCode {
  InvalidOptions
  InputOrExpansion
  IncompleteCoverage
  UnsupportedText
  DegenerateGeometry
  LayerState
  BranchedContour
  OpenContour
  SelfIntersection
  OverlappingPaths
  InsufficientClearance
  ScanWarning
  DocumentWarning
  OtherCheck
}

///|
pub(all) struct Diagnostic {
  code : DiagnosticCode
  severity : Severity
  message : String
}

///|
/// Describes the result of a check over the selected scope.
pub(all) enum CheckStatus {
  Complete
  CompleteWithFindings
  Incomplete
  InvalidOptions
}

///|
pub(all) enum ReadStatus {
  ReadComplete
  ReadWithWarnings
  ReadFailed
}

///|
/// Status of the record reader, separately from geometry coverage.
pub fn ReadDocument::read_status(self : ReadDocument) -> ReadStatus {
  if self.scan.tags.length() == 0 {
    ReadFailed
  } else if self.read_warnings.length() > 0 {
    ReadWithWarnings
  } else {
    ReadComplete
  }
}

///|
/// These categories identify the public stage at which a warning is exposed.
/// DocumentWarning collects structural, derived-input and profile warnings.
pub fn ReadDocument::diagnostics(self : ReadDocument) -> Array[Diagnostic] {
  let result : Array[Diagnostic] = []
  let scanned : Map[String, Int] = Map([])
  for message in self.scan.warnings {
    result.push({ code: ScanWarning, severity: Warn, message, })
    scanned[message] = scanned.get(message).unwrap_or(0) + 1
  }
  for message in self.read_warnings {
    let count = scanned.get(message).unwrap_or(0)
    if count > 0 {
      scanned[message] = count - 1
    } else {
      result.push({ code: DocumentWarning, severity: Warn, message, })
    }
  }
  result
}

///|
pub fn Finding::diagnostic(self : Finding) -> Diagnostic {
  let code : DiagnosticCode = match self.check {
    "参数" => InvalidOptions
    "解析" => InputOrExpansion
    "检查覆盖" => IncompleteCoverage
    "文字未转曲线" => UnsupportedText
    "退化几何" => DegenerateGeometry
    "图层" => LayerState
    "轮廓连接" => BranchedContour
    "轮廓闭合" => OpenContour
    "自相交" => SelfIntersection
    "重复切割" => OverlappingPaths
    "最小间隙" => InsufficientClearance
    _ => OtherCheck
  }
  { code, severity: self.severity, message: self.message, }
}

///|
pub fn Report::status(self : Report) -> CheckStatus {
  if self.findings.any(f => f.check == "参数") {
    InvalidOptions
  } else if self.has_incomplete_checks() {
    Incomplete
  } else if self.findings.length() > 0 {
    CompleteWithFindings
  } else {
    Complete
  }
}

///|
/// Apply caller-selected expansion and candidate budgets in a single check.
pub fn Drawing::check_with_budgets(
  self : Drawing,
  opt : CheckOptions,
  expansion : ExpandLimits,
  geometry : GeometryBudget,
) -> Report {
  if !positive_tolerance(opt.tol) ||
    !finite_number(opt.min_gap) ||
    opt.min_gap < 0.0 {
    return self.check(opt)
  }
  self.check_expansion(
    opt,
    self.expand_with_limits(opt.tol, expansion),
    budget=geometry,
  )
}

///|
/// Curve sampling, projection onto Z=0, and endpoint/check comparisons have
/// independent tolerances. The original CheckOptions API keeps its behavior.
pub(all) struct CheckTolerances {
  curve : Double
  plane : Double
  comparison : Double
}

///|
pub fn Drawing::check_with_tolerances(
  self : Drawing,
  tolerances : CheckTolerances,
  min_gap : Double,
) -> Report {
  let opt : CheckOptions = { tol: tolerances.comparison, min_gap, }
  if !positive_tolerance(tolerances.curve) ||
    !positive_tolerance(tolerances.plane) ||
    !positive_tolerance(tolerances.comparison) ||
    !finite_number(min_gap) ||
    min_gap < 0.0 {
    return {
      findings: [
        {
          check: "参数",
          severity: Fatal,
          message: "曲线、平面及比较容差须为正有限数字，净距须为非负有限数字",
        },
      ],
    }
  }
  let world = self.expand_world(tolerances.curve)
  self.check_expansion(opt, project_expansion(world, tolerances.plane))
}
