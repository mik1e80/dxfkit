///|
/// 同一 Drawing、同一展开结果生成报告和 SVG。
pub(all) struct DrawingAnalysis {
  report : Report
  svg : String
  unit : String
}

///|
pub fn Drawing::analyze(self : Drawing, opt : CheckOptions) -> DrawingAnalysis {
  if !positive_tolerance(opt.tol) ||
    !finite_number(opt.min_gap) ||
    opt.min_gap < 0.0 {
    return {
      report: self.check(opt),
      svg: "",
      unit: self.declared_unit_label(),
    }
  }
  let expansion = self.expand(opt.tol)
  {
    report: self.check_expansion(opt, expansion),
    svg: self.svg_from_expansion(expansion),
    unit: self.declared_unit_label(),
  }
}
