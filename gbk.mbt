///|
/// Uses the two-byte portion of the WHATWG index. ANSI_936 does not opt into
/// the four-byte sequences defined for GB18030.
fn decode_gbk(data : Bytes) -> (String, Bool) {
  let out = StringBuilder()
  let mut valid = true
  let mut i = 0
  while i < data.length() {
    let lead = data[i].to_int()
    i += 1
    if lead < 0x80 {
      out.write_char(code_point_to_char(lead))
    } else if lead == 0x80 {
      out.write_char('\u{20AC}')
    } else {
      if lead >= 0x81 && lead <= 0xFE && i < data.length() {
        let trail = data[i].to_int()
        if trail >= 0x40 && trail <= 0xFE && trail != 0x7F {
          let column = trail - (if trail < 0x7F { 0x40 } else { 0x41 })
          let value = gbk_rows[lead - 0x81].code_unit_at(column).to_int()
          out.write_char(code_point_to_char(value))
          i += 1
          continue
        }
      }
      valid = false
      out.write_char('\u{FFFD}')
    }
  }
  (out.to_string(), valid)
}
