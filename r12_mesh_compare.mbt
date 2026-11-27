///|
/// Point-by-point comparison in the stored M-major order. distances[i]
/// compares input sample i to the reconstructed sample with the same index.
pub(all) struct R12MeshComparison {
  distances : Array[Double]
  max_error : Double
  worst_index : Int32
  outside_tolerance : Int32
}

///|
/// Compare a preserved CAD sample grid to a refit of the same resolution.
/// This API requires the exporter to retain both the frame and samples.
pub fn R12FittedMesh::compare_refit(
  self : R12FittedMesh,
  tol : Double,
  max_points~ : Int32 = 100_000,
) -> Result[R12MeshComparison, String] {
  if !positive_tolerance(tol) ||
    !r12_grid_matches(self.samples.length(), self.sample_m, self.sample_n) {
    return Err(
      "逐点对照需要已存样点、匹配的网格尺寸与正容差",
    )
  }
  match self.refit(self.sample_m, self.sample_n, max_points~) {
    Err(msg) => Err(msg)
    Ok(refitted) => {
      let distances = []
      let mut max_error = 0.0
      let mut worst_index = 0
      let mut outside_tolerance = 0
      for i, p in self.samples {
        let distance = p.sub(refitted.samples[i]).length()
        if !finite_number(distance) {
          return Err("逐点对照产生非有限误差")
        }
        distances.push(distance)
        if distance > max_error {
          max_error = distance
          worst_index = i
        }
        if distance > tol {
          outside_tolerance += 1
        }
      }
      Ok({ distances, max_error, worst_index, outside_tolerance, })
    }
  }
}
