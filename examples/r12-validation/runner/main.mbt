///|
fn main raise {
  let args = @env.args()
  guard args.length() == 2 else { fail("expected one DXF path") }
  let doc = @dxfkit.read_document(@fs.read_file_to_bytes(args[1]))
  assert_true(doc.profile is @dxfkit.R12)
  assert_eq(doc.read_warnings.length(), 0)
  let world = doc.drawing.expand_world(0.01)
  assert_eq(world.warnings.length(), 0)
  println("PROFILE\tR12/AC1009")
  println("RECORDS\t\{doc.records.length()}")
  println("PLACED\t\{world.placed.length()}")
  for p in world.placed {
    let path = p.instances
      .map(i => "\{i.handle}:\{i.block}[\{i.row},\{i.column}]")
      .join("/")
    println("INSTANCE\t\{p.entity.handle()}\t\{p.layer}\t\{path}")
    match p.flat {
      @dxfkit.Outline3(points~, closed~) => {
        println("OUTLINE\t\{closed}")
        for v in points {
          println("XYZ\t\{v.x}\t\{v.y}\t\{v.z}")
        }
      }
      _ => fail("expected a LINE in these fixtures")
    }
  }
}
