///|
/// The signed, one-based face indices follow the DXF convention. A negative
/// index hides the edge starting at that vertex. Polygon meshes use M-major
/// order, so vertex (m_index, n_index) is at m_index * n + n_index.
fn r12_spatial(
  records : Array[RawRecord],
  first : Int,
  flags : Int,
) -> R12EntitySemantics raise R12SemanticError {
  let header = records[first]
  let mode = flags & 88
  let fit = r12_integer(header, 75, Some(0))
  if mode == 16 && fit != 0 {
    return r12_fitted_mesh(records, first, flags, fit)
  }
  guard (mode == 8 || mode == 16 || mode == 64) && (flags & 6) == 0 && fit == 0 else {
    raise InvalidSemantic(
      "空间 POLYLINE 类型标志冲突或使用未实现的拟合",
    )
  }
  let points : Array[Vec3] = []
  let faces : Array[Array[Int]] = []
  let mut i = first + 1
  while i < records.length() &&
        records[i].section == header.section &&
        records[i].kind == "VERTEX" {
    let r = records[i]
    let vertex_kind = r12_integer(r, 70, Some(0)) & 224
    if mode == 64 && vertex_kind == 128 {
      let face : Array[Int] = []
      let mut ended = false
      for code in 71..<=74 {
        let v = r12_integer(r, code, Some(0))
        if v == 0 {
          ended = true
        } else {
          guard !ended && v >= -32768 && v <= 32767 else {
            raise InvalidSemantic(
              "VERTEX 记录 \{i} 的面索引超范围或位于终止零之后",
            )
          }
          face.push(v)
        }
      }
      guard face.length() >= 3 else {
        raise InvalidSemantic("VERTEX 记录 \{i} 的面少于三个角点")
      }
      faces.push(face)
    } else {
      let expected = if mode == 8 { 32 } else if mode == 16 { 64 } else { 192 }
      guard vertex_kind == expected && r12_number(r, 42, Some(0.0)) == 0.0 else {
        raise InvalidSemantic(
          "VERTEX 记录 \{i} 的类型与空间 POLYLINE 不符或含凸度",
        )
      }
      points.push(r12_point(r, 10, require_z=true))
    }
    i += 1
  }
  guard i < records.length() &&
    records[i].section == header.section &&
    records[i].kind == "SEQEND" else {
    raise InvalidSemantic("空间 POLYLINE 缺少 SEQEND")
  }
  guard points.length() >= 2 else {
    raise InvalidSemantic("空间 POLYLINE 顶点不足")
  }
  match mode {
    8 => SpatialPolyline(points~, closed=(flags & 1) != 0)
    16 => {
      let m = r12_integer(header, 71, None)
      let n = r12_integer(header, 72, None)
      guard m >= 2 &&
        n >= 2 &&
        points.length() / m == n &&
        points.length() % m == 0 else {
        raise InvalidSemantic("网格 M/N 尺寸与顶点数不符")
      }
      PolygonMesh(
        points~,
        m~,
        n~,
        closed_m=(flags & 1) != 0,
        closed_n=(flags & 32) != 0,
      )
    }
    _ => {
      // The DXF reference allows readers to ignore declared polyface counts and
      // requires accepting coordinate records that follow face records.
      guard !faces.is_empty() &&
        faces.all(face => face.all(v => v.abs() <= points.length())) else {
        raise InvalidSemantic(
          "Polyface 缺少面或面引用了不存在的顶点",
        )
      }
      Polyface(points~, faces~)
    }
  }
}
