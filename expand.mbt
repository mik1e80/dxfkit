// 块展开：把 INSERT 换成世界坐标下的实际几何。
//
// 块是图纸的复用单位：BLOCKS 段里定义一次，ENTITIES 段里用 INSERT
// 带着位置 / 缩放 / 旋转引用多次。这一层把它们**摊平**——下游的
// 加工检查不该再关心「这条线在哪个块的哪一层引用里」。
//
// 两个关键决定：
//
// **先离散、再变换。** 非均匀缩放会把圆变成椭圆、圆弧变成椭圆弧，
// 在几何层变换形状要把每种曲线都推导一遍；在折线点列上变换就一行
// 矩阵乘法。精度由离散容差控制，和别的曲线一个口径。
//
// **变换用仿射矩阵复合。** 嵌套引用（块里再插块）的变换是一层层
// 乘出来的——「减基点 → 缩放 → 旋转 → 平移」单层好写，但旋转和
// 缩放不同级之间不可交换，复合必须老老实实按矩阵乘。
//
// 图层有个 DXF 的老规矩：**块内画在图层 0 上的实体继承引用的图层**。
// 加工检查判断「这条轮廓归哪个图层」靠的就是它——不实现这条，
// 块画的轮廓会全落回图层 0，按图层过滤就错了。

///|
/// 二维仿射变换：线性部分（2×2）+ 平移。
priv struct Affine {
  a : Double
  b : Double
  c : Double
  d : Double
  tx : Double
  ty : Double
}

///|
fn Affine::identity() -> Affine {
  { a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0 }
}

///|
fn Affine::apply(self : Affine, p : Vec2) -> Vec2 {
  Vec2::new(
    self.a * p.x + self.b * p.y + self.tx,
    self.c * p.x + self.d * p.y + self.ty,
  )
}

///|
/// `self ∘ inner`：先做 inner、再做 self（嵌套时父变换在外层）。
fn Affine::compose(self : Affine, inner : Affine) -> Affine {
  {
    a: self.a * inner.a + self.b * inner.c,
    b: self.a * inner.b + self.b * inner.d,
    c: self.c * inner.a + self.d * inner.c,
    d: self.c * inner.b + self.d * inner.d,
    tx: self.a * inner.tx + self.b * inner.ty + self.tx,
    ty: self.c * inner.tx + self.d * inner.ty + self.ty,
  }
}

///|
/// 一条 INSERT 的变换：块内坐标先减基点，再缩放（sx/sy），
/// 再旋转，最后平移到插入点。线性部分就是 R·S。
fn insert_transform(at : Vec3, base : Vec2, scale : Vec3, rotation : Double) -> Affine {
  let cs = @math.cos(rotation)
  let sn = @math.sin(rotation)
  let a = cs * scale.x
  let b = -sn * scale.y
  let c = sn * scale.x
  let d = cs * scale.y
  let p = at.xy()
  // 平移 = 插入点 − 线性部分·基点（基点映射到插入点）
  {
    a,
    b,
    c,
    d,
    tx: p.x - (a * base.x + b * base.y),
    ty: p.y - (c * base.x + d * base.y),
  }
}

///|
/// 展开之后的一条几何：世界坐标。
pub(all) struct Placed {
  /// 源实体——类型名、句柄、原记录都在里面。检查报告要引用它们
  ///（「图层『轮廓』句柄 2D 的圆半径是负数」），所以不能只留离散结果
  entity : Entity
  /// 生效图层——块内画在图层 0 上的实体继承引用的图层
  layer : String
  flat : Flat
}

///|
/// 展开结果。
pub(all) struct Expansion {
  placed : Array[Placed]
  /// 引用缺失的块、循环引用、超深度，都记在这
  warnings : Array[String]
}

///|
/// 展开过程共享的东西。
priv struct ExpandCtx {
  blocks : Array[Block]
  tol : Double
  warnings : Array[String]
}

///|
/// 图纸全部实体展开成世界坐标的几何。
///
/// INSERT 递归展开，块定义来自 BLOCKS 段；普通实体先按容差离散、
/// 再套上当前累积的变换。展开不了的东西（缺块、循环、太深）
/// **跳过并警告**，不猜位置。
pub fn Drawing::expand(self : Drawing, tol : Double) -> Expansion {
  let es = self.entities()
  let ctx : ExpandCtx = {
    blocks: self.blocks().blocks,
    tol,
    warnings: es.warnings.copy(),
  }
  let placed : Array[Placed] = []
  for e in es.entities {
    expand_entity(e, ctx, Affine::identity(), "", [], placed)
  }
  { placed, warnings: ctx.warnings }
}

///|
/// 展开一条实体。`xform` 是当前累积的变换（顶层是单位阵），
/// `inherited` 是外层 INSERT 的图层（顶层是空串 = 不继承），
/// `path` 是当前展开链（循环检测用）。
fn expand_entity(
  e : Entity,
  ctx : ExpandCtx,
  xform : Affine,
  inherited : String,
  path : Array[String],
  out : Array[Placed],
) -> Unit {
  match e.geom {
    Insert(at~, block~, scale~, rotation~) => {
      let mut found : Block? = None
      for b in ctx.blocks {
        if b.name == block {
          found = Some(b)
        }
      }
      match found {
        None => ctx.warnings.push("引用了不存在的块「\{block}」，已跳过")
        Some(b) => {
          let mut cyclic = false
          for n in path {
            if n == block {
              cyclic = true
            }
          }
          if cyclic {
            ctx.warnings.push("块「\{block}」在展开链上重复出现（循环引用），已截断")
          } else if path.length() >= 8 {
            ctx.warnings.push("块嵌套超过 8 层（\{block}），已截断")
          } else {
            // 引用的生效图层：自己不是 0 层就用自己，是 0 层就继承外层
            let insert_layer = if e.layer() == "" || e.layer() == "0" {
              inherited
            } else {
              e.layer()
            }
            let inner_xform = xform.compose(insert_transform(at, b.base.xy(), scale, rotation))
            let new_path = path.copy()
            new_path.push(block)
            for inner in b.entities {
              expand_entity(inner, ctx, inner_xform, insert_layer, new_path, out)
            }
          }
        }
      }
    }
    _ => {
      // 图层继承只发生在块里：顶层的 0 层实体就是 0 层
      let eff = if inherited != "" && (e.layer() == "" || e.layer() == "0") {
        inherited
      } else {
        e.layer()
      }
      out.push({
        entity: e,
        layer: eff,
        flat: transform_flat(e.geom.flatten(ctx.tol), xform),
      })
    }
  }
}

///|
/// 把离散好的折线套上变换。点列变换就一行矩阵乘法——
/// 非均匀缩放把圆变成椭圆也是自动的，不用管形状语义。
fn transform_flat(flat : Flat, xform : Affine) -> Flat {
  match flat {
    Outline(points~, closed~) => {
      let out : Array[Vec2] = []
      for p in points {
        out.push(xform.apply(p))
      }
      Outline(points=out, closed=closed)
    }
    Dot(at~) => Dot(at=xform.apply(at))
    // 文字：位置跟着变换走；字高按缩放的比例因子放大
    //（均匀缩放精确，非均匀取几何平均——预览够用）。
    // 旋转这版不带，斜着排的字画出来是平的。
    Label(at~, height~, value~) => {
      let scale = (xform.a * xform.d - xform.b * xform.c).abs().sqrt()
      Label(at=xform.apply(at), height=height * scale, value=value)
    }
    Empty => Empty
  }
}
