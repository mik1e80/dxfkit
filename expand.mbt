///|
/// A checked XY outline and its original entity. Use expand_world for XYZ data.
pub(all) struct Placed {
  entity : Entity
  layer : String
  flat : Flat
}

///|
pub(all) struct Expansion {
  placed : Array[Placed]
  warnings : Array[String]
}

///|
pub(all) struct ExpandLimits {
  max_placed : Int
  max_points : Int
  max_visits : Int
}

///|
/// A zero-based array cell in the outer-to-inner INSERT instance path.
pub(all) struct InsertInstance {
  handle : String
  block : String
  row : Int
  column : Int
}

///|
/// WCS results preserve Z. Empty3 retains the entity record, not a geometry claim.
pub(all) enum WorldFlat {
  Outline3(points~ : Array[Vec3], closed~ : Bool)
  Dot3(at~ : Vec3)
  Label3(at~ : Vec3, height~ : Double, value~ : String)
  Face3(corners~ : Array[Vec3])
  Empty3
}

///|
pub(all) struct WorldPlaced {
  entity : Entity
  layer : String
  flat : WorldFlat
  instances : Array[InsertInstance]
}

///|
pub(all) struct WorldExpansion {
  placed : Array[WorldPlaced]
  warnings : Array[String]
}

///|
priv struct ExpandCtx {
  blocks : Array[Block]
  tol : Double
  warnings : Array[String]
  limits : ExpandLimits
  mut visits : Int
  mut points : Int
  mut stopped : Bool
}

///|
fn expansion_limits() -> ExpandLimits {
  { max_placed: 10000, max_points: 200000, max_visits: 100000, }
}

///|
/// Expand blocks, arrays and OCS coordinates; retain XYZ and instance provenance.
pub fn Drawing::expand_world(self : Drawing, tol : Double) -> WorldExpansion {
  self.expand_world_with_limits(tol, expansion_limits())
}

///|
/// All array cells and empty block visits share one drawing-wide resource budget.
pub fn Drawing::expand_world_with_limits(
  self : Drawing,
  tol : Double,
  limits : ExpandLimits,
) -> WorldExpansion {
  if !positive_tolerance(tol) {
    return {
      placed: [],
      warnings: ["离散容差必须是正的有限数字"],
    }
  }
  if limits.max_placed <= 0 || limits.max_points <= 0 || limits.max_visits <= 0 {
    return {
      placed: [],
      warnings: ["展开资源预算必须为正整数；检查不完整"],
    }
  }
  let es = self.entities()
  let blocks = self.blocks()
  let warnings = self.warnings.copy()
  warnings.append(es.warnings)
  warnings.append(blocks.warnings)
  let ctx : ExpandCtx = {
    blocks: blocks.blocks,
    tol,
    warnings,
    limits,
    visits: 0,
    points: 0,
    stopped: false,
  }
  let placed : Array[WorldPlaced] = []
  for e in es.entities {
    if ctx.stopped {
      break
    }
    expand_entity_world(e, ctx, Transform3::identity(), "", [], placed)
  }
  { placed, warnings, }
}

///|
fn expand_visit(ctx : ExpandCtx) -> Bool {
  if ctx.stopped {
    return false
  }
  if ctx.visits >= ctx.limits.max_visits {
    ctx.stopped = true
    ctx.warnings.push(
      "展开达到全局资源上限（实体访问次数）；结果不完整",
    )
    return false
  }
  ctx.visits += 1
  true
}

///|
fn expand_entity_world(
  e : Entity,
  ctx : ExpandCtx,
  xform : Transform3,
  inherited : String,
  path : Array[InsertInstance],
  out : Array[WorldPlaced],
) -> Unit {
  if !expand_visit(ctx) {
    return
  }
  let layer = if inherited != "" && (e.layer() == "" || e.layer() == "0") {
    inherited
  } else {
    e.layer()
  }
  match e.geom {
    Insert(at~, block~, scale~, rotation~) => {
      let r = e.common.record
      let ocs = match record_ocs(r) {
        Ok(o) => o
        Err(msg) => {
          ctx.warnings.push("INSERT \{e.handle()}：\{msg}；未展开")
          return
        }
      }
      let rows = r.get_int(71, 1)
      let columns = r.get_int(70, 1)
      let dx = r.get_double(44, 0.0)
      let dy = r.get_double(45, 0.0)
      if rows < 1 ||
        columns < 1 ||
        !finite_number(dx) ||
        !finite_number(dy) ||
        !finite3(at) ||
        !finite3(scale) ||
        !finite_number(rotation) ||
        scale.x == 0.0 ||
        scale.y == 0.0 ||
        scale.z == 0.0 {
        ctx.warnings.push(
          "INSERT \{e.handle()} 的行列、间距或变换无效；未展开",
        )
        return
      }
      let mut found : Block? = None
      for b in ctx.blocks {
        if b.name == block {
          found = Some(b)
        }
      }
      let b = match found {
        Some(b) => b
        None => {
          ctx.warnings.push(
            "引用了不存在的块「\{block}」，已跳过",
          )
          return
        }
      }
      if !finite3(b.base) {
        ctx.warnings.push("块「\{block}」基点非有限；未展开")
        return
      }
      if r.get_int(66, 0) == 1 {
        ctx.warnings.push(
          "INSERT \{e.handle()} 的关联 ATTRIB 记录已保留，完整属性布局/阵列复制未重建；检查不完整",
        )
      }
      if path.any(p => p.block == block) {
        ctx.warnings.push(
          "INSERT \{e.handle()} 的块「\{block}」在展开链上重复出现（循环引用），已截断",
        )
        return
      }
      if path.length() >= 8 {
        ctx.warnings.push("块嵌套超过 8 层（\{block}），已截断")
        return
      }
      for row = 0; row < rows && !ctx.stopped; row = row + 1 {
        for col = 0; col < columns && !ctx.stopped; col = col + 1 {
          if !expand_visit(ctx) {
            break
          }
          let cell = insert_transform3(
            at,
            b.base,
            scale,
            rotation,
            Vec3::new(col.to_double() * dx, row.to_double() * dy, 0.0),
            ocs,
          )
          let current = path.copy()
          current.push({ handle: e.handle(), block, row, column: col, })
          for inner in b.entities {
            if ctx.stopped {
              break
            }
            expand_entity_world(
              inner,
              ctx,
              xform.compose(cell),
              layer,
              current,
              out,
            )
          }
        }
      }
    }
    _ => {
      if out.length() >= ctx.limits.max_placed {
        ctx.stopped = true
        ctx.warnings.push(
          "展开达到全局资源上限（输出实体数）；结果不完整",
        )
        return
      }
      let stretch = xform.stretch_bound()
      if !finite_number(stretch) || !finite3(xform.origin) {
        ctx.warnings.push(
          "实体 \{e.kind()} 的变换超出有限坐标范围，已跳过",
        )
        return
      }
      let local_tol = if stretch > 0.0 { ctx.tol / stretch } else { ctx.tol }
      let flat = match entity_world_flat(e, local_tol, xform) {
        Ok(flat) => flat
        Err(msg) => {
          ctx.warnings.push(
            "实体 \{e.kind()}（句柄 \{e.handle()}）未能离散：\{msg}",
          )
          Empty3
        }
      }
      let count = match flat {
        Outline3(points~, ..) => points.length()
        Face3(corners~) => corners.length()
        Dot3(..) | Label3(..) => 1
        Empty3 => 0
      }
      if count > ctx.limits.max_points - ctx.points {
        ctx.stopped = true
        ctx.warnings.push(
          "展开达到全局资源上限（离散点总数）；结果不完整",
        )
        return
      }
      ctx.points += count
      out.push({ entity: e, layer, flat, instances: path.copy(), })
    }
  }
}

///|
/// The checker uses WCS XY at Z=0; XYZ results remain available in expand_world.
pub fn Drawing::expand(self : Drawing, tol : Double) -> Expansion {
  self.expand_with_limits(tol, expansion_limits())
}

///|
pub fn Drawing::expand_with_limits(
  self : Drawing,
  tol : Double,
  limits : ExpandLimits,
) -> Expansion {
  let world = self.expand_world_with_limits(tol, limits)
  let warnings = world.warnings.copy()
  let placed : Array[Placed] = []
  for p in world.placed {
    let flat = match world_to_xy(p.flat, tol) {
      Ok(f) => f
      Err(msg) => {
        let instances = p.instances
          .map(i => "\{i.handle}:\{i.block}[\{i.row},\{i.column}]")
          .join("/")
        warnings.push(
          "\{p.entity.kind()}（句柄 \{p.entity.handle()}，图层 \{p.layer}，实例 \{instances}）：\{msg}；XYZ 保留于 expand_world，二维检查不完整",
        )
        Empty
      }
    }
    placed.push({ entity: p.entity, layer: p.layer, flat, })
  }
  { placed, warnings, }
}
