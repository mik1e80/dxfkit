///|
/// Missing fields return None; type errors/nonfinite numbers return Err.
/// Legacy get/as APIs remain permissive for compatibility.
pub fn Record::try_double(self : Record, code : Int) -> Result[Double?, String] {
  match self.get(code) {
    None => Ok(None)
    Some(t) =>
      match t.value {
        F64(v) =>
          if finite_number(v) {
            Ok(Some(v))
          } else {
            Err("数值非有限")
          }
        I16(v) | I32(v) => Ok(Some(v.to_double()))
        I64(v) => Ok(Some(v.to_double()))
        _ => Err("组码 \{code} 类型不是数值")
      }
  }
}

///|
pub fn Record::require_double(
  self : Record,
  code : Int,
) -> Result[Double, String] {
  match self.try_double(code) {
    Ok(Some(value)) => Ok(value)
    Ok(None) => Err("缺少必填组码 \{code}")
    Err(msg) => Err(msg)
  }
}

///|
pub fn Record::try_int(self : Record, code : Int) -> Result[Int?, String] {
  match self.get(code) {
    None => Ok(None)
    Some(t) =>
      match t.value {
        I16(v) | I32(v) => Ok(Some(v))
        _ => Err("组码 \{code} 类型不是32位整数")
      }
  }
}

///|
pub fn Record::require_int(self : Record, code : Int) -> Result[Int, String] {
  match self.try_int(code) {
    Ok(Some(value)) => Ok(value)
    Ok(None) => Err("缺少必填组码 \{code}")
    Err(msg) => Err(msg)
  }
}

///|
fn valid_numeric_tags(record : Record) -> Bool {
  let groups = [record.common]
  for sc in record.subclasses {
    groups.push(sc.tags)
  }
  for tags in groups {
    for tag in tags {
      match (code_type(tag.code), tag.value) {
        (F64, F64(v)) => if !finite_number(v) { return false }
        (F64, I16(_) | I32(_) | I64(_)) => ()
        (I16 | I32, I16(_) | I32(_)) => ()
        (I64, I64(_)) | (Bool, Bool(_)) | (Str | Bin, _) => ()
        _ => return false
      }
    }
  }
  true
}
