///|
/// Shared candidate-visit budget for topology, intersections and gap checks.
pub(all) struct GeometryBudget {
  max_candidates : Int
}

///|
pub fn GeometryBudget::default() -> GeometryBudget {
  { max_candidates: 1000000, }
}

///|
priv struct CheckWork {
  mut remaining : Int
  mut stopped : Bool
}

///|
fn CheckWork::spend(self : CheckWork) -> Bool {
  if self.remaining <= 0 {
    self.stopped = true
    return false
  }
  self.remaining -= 1
  true
}

///|
/// Expansion still uses its independent defaults; a partial check is explicit.
pub fn Drawing::check_with_budget(
  self : Drawing,
  opt : CheckOptions,
  budget : GeometryBudget,
) -> Report {
  self.check_expansion(opt, self.expand(opt.tol), budget~)
}

///|
fn topology_root(parent : Array[Int], i : Int) -> Int {
  let mut root = i
  while parent[root] != root {
    root = parent[root]
  }
  let mut n = i
  while parent[n] != n {
    let next = parent[n]
    parent[n] = root
    n = next
  }
  root
}

///|
fn topology_union(parent : Array[Int], a : Int, b : Int) -> Unit {
  let x = topology_root(parent, a)
  let y = topology_root(parent, b)
  if x != y {
    parent[x] = y
  }
}

///|
/// Endpoint equivalence graph, then connected edge components. Branches are
/// diagnosed, never resolved by an input-order-dependent greedy choice.
fn endpoint_topology(
  edges : Array[(Vec2, Vec2)],
  tol : Double,
  work : CheckWork,
) -> (Int, Double, Vec2, Bool) {
  let points : Array[Vec2] = []
  for edge in edges {
    points.push(edge.0)
    points.push(edge.1)
  }
  let parent = Array::makei(points.length(), i => i)
  let order = Array::makei(points.length(), i => i)
  order.sort_by((a, b) => {
    if points[a].x < points[b].x {
      -1
    } else if points[a].x > points[b].x {
      1
    } else {
      0
    }
  })
  for at = 0; at < order.length(); at = at + 1 {
    let i = order[at]
    let mut next = at + 1
    while next < order.length() && points[order[next]].x - points[i].x <= tol {
      if !work.spend() {
        return (0, 0.0, Vec2::zero(), false)
      }
      let j = order[next]
      if points[i].distance(points[j]) <= tol {
        topology_union(parent, i, j)
      }
      next += 1
    }
  }
  let degree = Array::make(points.length(), 0)
  for i = 0; i < points.length(); i = i + 1 {
    degree[topology_root(parent, i)] += 1
  }
  let components = Array::makei(points.length(), i => i)
  for i = 0; i < edges.length(); i = i + 1 {
    topology_union(
      components,
      topology_root(parent, i * 2),
      topology_root(parent, i * 2 + 1),
    )
  }
  let ends : Map[Int, Array[Vec2]] = Map([])
  let mut branched = false
  for i = 0; i < points.length(); i = i + 1 {
    if degree[i] > 0 && degree[i] != 2 {
      if degree[i] > 2 {
        branched = true
      }
      let component = topology_root(components, i)
      match ends.get(component) {
        Some(group) => group.push(points[i])
        None => ends[component] = [points[i]]
      }
    }
  }
  let mut worst = 0.0
  let mut at = Vec2::zero()
  for group in ends.values() {
    if group.length() >= 2 {
      let gap = group[0].distance(group[1])
      if gap > worst {
        worst = gap
        at = group[0]
      }
    }
  }
  (ends.length(), worst, at, branched)
}
