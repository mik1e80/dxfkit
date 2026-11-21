(() => {
  const $reinterpret_view = new DataView(new ArrayBuffer(8));
  function $i64_reinterpret_f64(a) {
    $reinterpret_view.setBigUint64(0, BigInt.asUintN(64, a), false);
    return $reinterpret_view.getFloat64(0, false);
  }
  function _M0TPC28internal7strconv9FloatInfo(param0, param1, param2) {
    this.mantissa_bits = param0;
    this.exponent_bits = param1;
    this.bias = param2;
  }
  function _M0TP27mik1e806dxfkit4Vec3(param0, param1, param2) {
    this.x = param0;
    this.y = param1;
    this.z = param2;
  }
  function _M0TP27mik1e806dxfkit4Vec2(param0, param1) {
    this.x = param0;
    this.y = param1;
  }
  function _M0TP27mik1e806dxfkit5Aabb2(param0, param1) {
    this.min = param0;
    this.max = param1;
  }
  function _M0TP27mik1e806dxfkit12ExpandLimits(param0, param1, param2) {
    this.max_placed = param0;
    this.max_points = param1;
    this.max_visits = param2;
  }
  function _M0TP27mik1e806dxfkit10ReadLimits(param0, param1, param2, param3, param4, param5) {
    this.max_file_bytes = param0;
    this.max_line_bytes = param1;
    this.max_tags = param2;
    this.max_records = param3;
    this.max_warnings = param4;
    this.max_string_bytes = param5;
  }
  function _M0TP27mik1e806dxfkit14GeometryBudget(param0) {
    this.max_candidates = param0;
  }
  function _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok.prototype.$tag = 1;
  function _M0DTP27mik1e806dxfkit8TagValue3Str(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8TagValue3Str.prototype.$tag = 0;
  function _M0DTP27mik1e806dxfkit8TagValue3I16(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8TagValue3I16.prototype.$tag = 1;
  function _M0DTP27mik1e806dxfkit8TagValue3I32(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8TagValue3I32.prototype.$tag = 2;
  function _M0DTP27mik1e806dxfkit8TagValue3I64(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8TagValue3I64.prototype.$tag = 3;
  function _M0DTP27mik1e806dxfkit8TagValue3F64(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8TagValue3F64.prototype.$tag = 4;
  function _M0DTP27mik1e806dxfkit8TagValue4Bool(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8TagValue4Bool.prototype.$tag = 5;
  function _M0DTP27mik1e806dxfkit8TagValue3Bin(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8TagValue3Bin.prototype.$tag = 6;
  function _M0TP27mik1e806dxfkit7Finding(param0, param1, param2) {
    this.check = param0;
    this.severity = param1;
    this.message = param2;
  }
  function _M0DTPC16result6ResultGOdsE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGOdsE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGOdsE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGOdsE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGRP27mik1e806dxfkit3OcssE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRP27mik1e806dxfkit3OcssE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGRP27mik1e806dxfkit3OcssE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRP27mik1e806dxfkit3OcssE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGzsE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGzsE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGzsE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGzsE2Ok.prototype.$tag = 1;
  function $oob() {
    throw new Error("Index out of bounds");
  }
  function _M0TPB13StringBuilder(param0) {
    this.val = param0;
  }
  function _M0TPC16string10StringView(param0, param1, param2) {
    this.str = param0;
    this.start = param1;
    this.end = param2;
  }
  class $PanicError extends Error {}
  function $panic() {
    throw new $PanicError();
  }
  const _M0FPB12random__seed = () => {
    if (globalThis.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      globalThis.crypto.getRandomValues(array);
      return array[0] | 0; // Convert to signed 32
    } else {
      return Math.floor(Math.random() * 0x100000000) | 0; // Fallback to Math.random
    }
  };
  const _M0FPB19int__to__string__js = (x, radix) => {
    return x.toString(radix);
  };
  function _M0TPB4IterGUsRPB4JsonEE(param0, param1) {
    this.f = param0;
    this.size_hint = param1;
  }
  function _M0TPB4IterGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(param0, param1) {
    this.f = param0;
    this.size_hint = param1;
  }
  function _M0TPB9ArrayViewGkE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB9ArrayViewGyE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function $make_array_len_and_init(a, b) {
    const arr = new Array(a);
    arr.fill(b);
    return arr;
  }
  function $makebytes(a, b) {
    const arr = new Uint8Array(a);
    if (b !== 0) {
      arr.fill(b);
    }
    return arr;
  }
  const _M0MPB7JSArray4push = (arr, val) => { arr.push(val); };
  function $compare_int(a, b) {
    return (a >= b) - (a <= b);
  }
  function _M0TPB9ArrayViewGRP27mik1e806dxfkit6RecordE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB3MapGsRPB4JsonE(param0, param1, param2, param3, param4, param5, param6) {
    this.entries = param0;
    this.size = param1;
    this.capacity = param2;
    this.capacity_mask = param3;
    this.grow_at = param4;
    this.head = param5;
    this.tail = param6;
  }
  function _M0TPB3MapGsbE(param0, param1, param2, param3, param4, param5, param6) {
    this.entries = param0;
    this.size = param1;
    this.capacity = param2;
    this.capacity_mask = param3;
    this.grow_at = param4;
    this.head = param5;
    this.tail = param6;
  }
  function _M0TPB3MapGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(param0, param1, param2, param3, param4, param5, param6) {
    this.entries = param0;
    this.size = param1;
    this.capacity = param2;
    this.capacity_mask = param3;
    this.grow_at = param4;
    this.head = param5;
    this.tail = param6;
  }
  function _M0TPB3MapGibE(param0, param1, param2, param3, param4, param5, param6) {
    this.entries = param0;
    this.size = param1;
    this.capacity = param2;
    this.capacity_mask = param3;
    this.grow_at = param4;
    this.head = param5;
    this.tail = param6;
  }
  function _M0TPB3MapGlbE(param0, param1, param2, param3, param4, param5, param6) {
    this.entries = param0;
    this.size = param1;
    this.capacity = param2;
    this.capacity_mask = param3;
    this.grow_at = param4;
    this.head = param5;
    this.tail = param6;
  }
  function _M0TPB3MapGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(param0, param1, param2, param3, param4, param5, param6) {
    this.entries = param0;
    this.size = param1;
    this.capacity = param2;
    this.capacity_mask = param3;
    this.grow_at = param4;
    this.head = param5;
    this.tail = param6;
  }
  function _M0TPB5EntryGsRPB4JsonE(param0, param1, param2, param3, param4, param5) {
    this.prev = param0;
    this.next = param1;
    this.psl = param2;
    this.hash = param3;
    this.key = param4;
    this.value = param5;
  }
  function _M0TPB5EntryGsbE(param0, param1, param2, param3, param4, param5) {
    this.prev = param0;
    this.next = param1;
    this.psl = param2;
    this.hash = param3;
    this.key = param4;
    this.value = param5;
  }
  function _M0TPB5EntryGsRP27mik1e806dxfkit5BlockE(param0, param1, param2, param3, param4, param5) {
    this.prev = param0;
    this.next = param1;
    this.psl = param2;
    this.hash = param3;
    this.key = param4;
    this.value = param5;
  }
  function _M0TPB5EntryGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(param0, param1, param2, param3, param4, param5) {
    this.prev = param0;
    this.next = param1;
    this.psl = param2;
    this.hash = param3;
    this.key = param4;
    this.value = param5;
  }
  function _M0TPB5EntryGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(param0, param1, param2, param3, param4, param5) {
    this.prev = param0;
    this.next = param1;
    this.psl = param2;
    this.hash = param3;
    this.key = param4;
    this.value = param5;
  }
  function _M0TPB5EntryGibE(param0, param1, param2, param3, param4, param5) {
    this.prev = param0;
    this.next = param1;
    this.psl = param2;
    this.hash = param3;
    this.key = param4;
    this.value = param5;
  }
  function _M0TPB5EntryGlbE(param0, param1, param2, param3, param4, param5) {
    this.prev = param0;
    this.next = param1;
    this.psl = param2;
    this.hash = param3;
    this.key = param4;
    this.value = param5;
  }
  function _M0TPB5EntryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(param0, param1, param2, param3, param4, param5) {
    this.prev = param0;
    this.next = param1;
    this.psl = param2;
    this.hash = param3;
    this.key = param4;
    this.value = param5;
  }
  function _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4None() {}
  _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4None.prototype.$tag = 0;
  const _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4None__ = new _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4None();
  function _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4Some(param0) {
    this._0 = param0;
  }
  _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4Some.prototype.$tag = 1;
  function _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4None() {}
  _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4None.prototype.$tag = 0;
  const _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4None__ = new _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4None();
  function _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4Some(param0) {
    this._0 = param0;
  }
  _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4Some.prototype.$tag = 1;
  function _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4None() {}
  _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4None.prototype.$tag = 0;
  const _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4None__ = new _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4None();
  function _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4Some(param0) {
    this._0 = param0;
  }
  _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4Some.prototype.$tag = 1;
  function _M0TPB8MutLocalGORPB5EntryGsRPB4JsonEE(param0) {
    this.val = param0;
  }
  function _M0TPB8MutLocalGiE(param0) {
    this.val = param0;
  }
  function _M0TPB8MutLocalGORPB5EntryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EEE(param0) {
    this.val = param0;
  }
  const _M0MPB7JSArray4copy = (arr) => arr.slice(0);
  const _M0MPC16double6Double8mod__ffi = (a, b) => (a % b);
  function _M0TPC15bytes9BytesView(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  const $bytes_literal$0 = new Uint8Array();
  const _M0MPB7JSArray11set__length = (arr, len) => { arr.length = len; };
  const _M0MPB7JSArray12append__view = (dst, src, src_offset, len) => {
     for (let i = 0; i < len; i++) {
       dst.push(src[src_offset + i]);
     }
   };
  const _M0MPB7JSArray3pop = (arr) => arr.pop();
  function _M0TPB12MutArrayViewGRP27mik1e806dxfkit6CutSegE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB12MutArrayViewGiE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB9ArrayViewGsE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  const _M0FPC28encoding4utf816encode__utf8__js = (() => {
     const encoder = new TextEncoder();
     return function(src, start, len, bom) {
       const end = start + len;
       const encoded = encoder.encode(src.slice(start, end));
       if (!bom) {
         return encoded;
       }
       const result = new Uint8Array(encoded.length + 3);
       result[0] = 0xEF;
       result[1] = 0xBB;
       result[2] = 0xBF;
       result.set(encoded, 3);
       return result;
     };
   })();
  const _M0FPC28encoding4utf816decode__utf8__js = ((preserveBOMDecoder, dropBOMDecoder) => function(bytes, start, len, preserveBOM) {
     try {
       const end = start + len;
       const slice = bytes.subarray(start, end);
       const decoder = preserveBOM ? preserveBOMDecoder : dropBOMDecoder;
       return [decoder.decode(slice)];
     } catch (_) {
       return [];
     }
   })(
     new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }),
     new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }),
   );
  const _M0FPC28encoding4utf823decode__utf8__lossy__js = ((preserveBOMDecoder, dropBOMDecoder) => function(bytes, start, len, preserveBOM) {
     const end = start + len;
     const slice = bytes.subarray(start, end);
     const decoder = preserveBOM ? preserveBOMDecoder : dropBOMDecoder;
     return decoder.decode(slice);
   })(
     new TextDecoder("utf-8", { ignoreBOM: true }),
     new TextDecoder("utf-8", { ignoreBOM: false }),
   );
  function _M0DTPC16result6ResultGsRPC28encoding4utf89MalformedE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGsRPC28encoding4utf89MalformedE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGsRPC28encoding4utf89MalformedE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGsRPC28encoding4utf89MalformedE2Ok.prototype.$tag = 1;
  function _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(param0) {
    this._0 = param0;
  }
  _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed.prototype.$tag = 2;
  function _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(param0) {
    this._0 = param0;
  }
  _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure.prototype.$tag = 1;
  function _M0DTPC15error5Error60moonbitlang_2fcore_2fencoding_2futf8_2eMalformed_2eMalformed(param0) {
    this._0 = param0;
  }
  _M0DTPC15error5Error60moonbitlang_2fcore_2fencoding_2futf8_2eMalformed_2eMalformed.prototype.$tag = 0;
  function _M0TPC16buffer6Buffer(param0, param1) {
    this.data = param0;
    this.len = param1;
  }
  function _M0DTPC16result6ResultGUiRPC16string10StringViewbERPB7FailureE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGUiRPC16string10StringViewbERPB7FailureE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGUiRPC16string10StringViewbERPB7FailureE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGUiRPC16string10StringViewbERPB7FailureE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGuRPB7FailureE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGuRPB7FailureE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGuRPB7FailureE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGuRPB7FailureE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGdRPB7FailureE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGdRPB7FailureE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGdRPB7FailureE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGdRPB7FailureE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGiRPB7FailureE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGiRPB7FailureE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGiRPB7FailureE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGiRPB7FailureE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGlRPB7FailureE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGlRPB7FailureE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGlRPB7FailureE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGlRPB7FailureE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok.prototype.$tag = 1;
  function _M0TPC28internal7strconv6Number(param0, param1, param2, param3) {
    this.exponent = param0;
    this.mantissa = param1;
    this.negative = param2;
    this.many_digits = param3;
  }
  function _M0DTPC16result6ResultGdRPC15error5ErrorE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGdRPC15error5ErrorE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok.prototype.$tag = 1;
  function $i64_clz(a) {
    a = BigInt.asUintN(64, a);
    if (a === 0n) return 64;
    const hi = Number(a >> 32n);
    if (hi !== 0) {
      return Math.clz32(hi);
    }
    return 32 + Math.clz32(Number(a & 0xffffffffn));
  }
  function _M0DTPC16result6ResultGlRPC15error5ErrorE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGlRPC15error5ErrorE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGlRPC15error5ErrorE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGlRPC15error5ErrorE2Ok.prototype.$tag = 1;
  function _M0DTPC16result6ResultGiRPC15error5ErrorE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGiRPC15error5ErrorE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGiRPC15error5ErrorE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGiRPC15error5ErrorE2Ok.prototype.$tag = 1;
  function _M0TPC28internal7strconv12EiselProduct(param0, param1) {
    this.lo = param0;
    this.hi = param1;
  }
  function _M0TPC28internal7strconv7Decimal(param0, param1, param2, param3, param4, param5) {
    this.digits = param0;
    this.digits_num = param1;
    this.decimal_point = param2;
    this.negative = param3;
    this.truncated = param4;
    this.overflowed = param5;
  }
  function _M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE2Ok.prototype.$tag = 1;
  function $f64_convert_i64_u(a) {
    return Number(a);
  }
  function _M0DTPC16option6OptionGdE4None() {}
  _M0DTPC16option6OptionGdE4None.prototype.$tag = 0;
  const _M0DTPC16option6OptionGdE4None__ = new _M0DTPC16option6OptionGdE4None();
  function _M0DTPC16option6OptionGdE4Some(param0) {
    this._0 = param0;
  }
  _M0DTPC16option6OptionGdE4Some.prototype.$tag = 1;
  function _M0DTPC14json10WriteFrame5Array(param0, param1) {
    this._0 = param0;
    this._1 = param1;
  }
  _M0DTPC14json10WriteFrame5Array.prototype.$tag = 0;
  function _M0DTPC14json10WriteFrame6Object(param0, param1) {
    this._0 = param0;
    this._1 = param1;
  }
  _M0DTPC14json10WriteFrame6Object.prototype.$tag = 1;
  function _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE2Ok.prototype.$tag = 1;
  function _M0TP27mik1e806dxfkit3Ocs(param0, param1, param2) {
    this.x_axis = param0;
    this.y_axis = param1;
    this.normal = param2;
  }
  function $f64_convert_i64(a) {
    return Number(BigInt.asIntN(64, a));
  }
  function _M0TP27mik1e806dxfkit8BulgeArc(param0, param1, param2, param3) {
    this.center = param0;
    this.radius = param1;
    this.start_angle = param2;
    this.end_angle = param3;
  }
  function _M0DTP27mik1e806dxfkit4Flat7Outline(param0, param1) {
    this._0 = param0;
    this._1 = param1;
  }
  _M0DTP27mik1e806dxfkit4Flat7Outline.prototype.$tag = 0;
  function _M0DTP27mik1e806dxfkit4Flat3Dot(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit4Flat3Dot.prototype.$tag = 1;
  function _M0DTP27mik1e806dxfkit4Flat5Label(param0, param1, param2) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
  }
  _M0DTP27mik1e806dxfkit4Flat5Label.prototype.$tag = 2;
  function _M0DTP27mik1e806dxfkit4Flat5Empty() {}
  _M0DTP27mik1e806dxfkit4Flat5Empty.prototype.$tag = 3;
  const _M0DTP27mik1e806dxfkit4Flat5Empty__ = new _M0DTP27mik1e806dxfkit4Flat5Empty();
  function _M0TP27mik1e806dxfkit10Transform3(param0, param1, param2, param3) {
    this.x = param0;
    this.y = param1;
    this.z = param2;
    this.origin = param3;
  }
  function _M0DTP27mik1e806dxfkit9WorldFlat8Outline3(param0, param1) {
    this._0 = param0;
    this._1 = param1;
  }
  _M0DTP27mik1e806dxfkit9WorldFlat8Outline3.prototype.$tag = 0;
  function _M0DTP27mik1e806dxfkit9WorldFlat4Dot3(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit9WorldFlat4Dot3.prototype.$tag = 1;
  function _M0DTP27mik1e806dxfkit9WorldFlat6Label3(param0, param1, param2) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
  }
  _M0DTP27mik1e806dxfkit9WorldFlat6Label3.prototype.$tag = 2;
  function _M0DTP27mik1e806dxfkit9WorldFlat5Face3(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit9WorldFlat5Face3.prototype.$tag = 3;
  function _M0DTP27mik1e806dxfkit9WorldFlat6Empty3() {}
  _M0DTP27mik1e806dxfkit9WorldFlat6Empty3.prototype.$tag = 4;
  const _M0DTP27mik1e806dxfkit9WorldFlat6Empty3__ = new _M0DTP27mik1e806dxfkit9WorldFlat6Empty3();
  function _M0TP27mik1e806dxfkit3Tag(param0, param1) {
    this.code = param0;
    this.value = param1;
  }
  function _M0TP27mik1e806dxfkit5Layer(param0, param1, param2, param3, param4, param5) {
    this.name = param0;
    this.color = param1;
    this.linetype = param2;
    this.frozen = param3;
    this.locked = param4;
    this.lineweight = param5;
  }
  function _M0TP27mik1e806dxfkit6Tables(param0, param1, param2, param3) {
    this.layers = param0;
    this.linetypes = param1;
    this.text_styles = param2;
    this.block_records = param3;
  }
  function _M0TP27mik1e806dxfkit6Placed(param0, param1, param2) {
    this.entity = param0;
    this.layer = param1;
    this.flat = param2;
  }
  function _M0TP27mik1e806dxfkit9Expansion(param0, param1) {
    this.placed = param0;
    this.warnings = param1;
  }
  function _M0TP27mik1e806dxfkit14InsertInstance(param0, param1, param2, param3) {
    this.handle = param0;
    this.block = param1;
    this.row = param2;
    this.column = param3;
  }
  function _M0TP27mik1e806dxfkit11WorldPlaced(param0, param1, param2, param3) {
    this.entity = param0;
    this.layer = param1;
    this.flat = param2;
    this.instances = param3;
  }
  function _M0TP27mik1e806dxfkit12EntityCommon(param0, param1, param2, param3) {
    this.kind = param0;
    this.layer = param1;
    this.handle = param2;
    this.record = param3;
  }
  function _M0DTPC16result6ResultGdsE3Err(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGdsE3Err.prototype.$tag = 0;
  function _M0DTPC16result6ResultGdsE2Ok(param0) {
    this._0 = param0;
  }
  _M0DTPC16result6ResultGdsE2Ok.prototype.$tag = 1;
  function _M0DTP27mik1e806dxfkit8Geometry4Line(param0, param1) {
    this._0 = param0;
    this._1 = param1;
  }
  _M0DTP27mik1e806dxfkit8Geometry4Line.prototype.$tag = 0;
  function _M0DTP27mik1e806dxfkit8Geometry5Point(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8Geometry5Point.prototype.$tag = 1;
  function _M0DTP27mik1e806dxfkit8Geometry6Circle(param0, param1) {
    this._0 = param0;
    this._1 = param1;
  }
  _M0DTP27mik1e806dxfkit8Geometry6Circle.prototype.$tag = 2;
  function _M0DTP27mik1e806dxfkit8Geometry3Arc(param0, param1, param2, param3) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
    this._3 = param3;
  }
  _M0DTP27mik1e806dxfkit8Geometry3Arc.prototype.$tag = 3;
  function _M0DTP27mik1e806dxfkit8Geometry7Ellipse(param0, param1, param2, param3, param4) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
    this._3 = param3;
    this._4 = param4;
  }
  _M0DTP27mik1e806dxfkit8Geometry7Ellipse.prototype.$tag = 4;
  function _M0DTP27mik1e806dxfkit8Geometry8Polyline(param0, param1) {
    this._0 = param0;
    this._1 = param1;
  }
  _M0DTP27mik1e806dxfkit8Geometry8Polyline.prototype.$tag = 5;
  function _M0DTP27mik1e806dxfkit8Geometry4Text(param0, param1, param2, param3) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
    this._3 = param3;
  }
  _M0DTP27mik1e806dxfkit8Geometry4Text.prototype.$tag = 6;
  function _M0DTP27mik1e806dxfkit8Geometry6Insert(param0, param1, param2, param3) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
    this._3 = param3;
  }
  _M0DTP27mik1e806dxfkit8Geometry6Insert.prototype.$tag = 7;
  function _M0DTP27mik1e806dxfkit8Geometry4Face(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8Geometry4Face.prototype.$tag = 8;
  function _M0DTP27mik1e806dxfkit8Geometry9Dimension(param0, param1, param2) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
  }
  _M0DTP27mik1e806dxfkit8Geometry9Dimension.prototype.$tag = 9;
  function _M0DTP27mik1e806dxfkit8Geometry6Spline(param0, param1, param2, param3) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
    this._3 = param3;
  }
  _M0DTP27mik1e806dxfkit8Geometry6Spline.prototype.$tag = 10;
  function _M0DTP27mik1e806dxfkit8Geometry5Hatch(param0, param1, param2, param3) {
    this._0 = param0;
    this._1 = param1;
    this._2 = param2;
    this._3 = param3;
  }
  _M0DTP27mik1e806dxfkit8Geometry5Hatch.prototype.$tag = 11;
  function _M0DTP27mik1e806dxfkit8Geometry7Unknown() {}
  _M0DTP27mik1e806dxfkit8Geometry7Unknown.prototype.$tag = 12;
  const _M0DTP27mik1e806dxfkit8Geometry7Unknown__ = new _M0DTP27mik1e806dxfkit8Geometry7Unknown();
  function _M0TP27mik1e806dxfkit10PolyVertex(param0, param1) {
    this.at = param0;
    this.bulge = param1;
  }
  function _M0TP27mik1e806dxfkit6Entity(param0, param1) {
    this.common = param0;
    this.geom = param1;
  }
  function _M0TP27mik1e806dxfkit5Block(param0, param1, param2) {
    this.name = param0;
    this.base = param1;
    this.entities = param2;
  }
  function _M0TP27mik1e806dxfkit6Blocks(param0, param1) {
    this.blocks = param0;
    this.warnings = param1;
  }
  function _M0TP27mik1e806dxfkit8Entities(param0, param1) {
    this.entities = param0;
    this.warnings = param1;
  }
  function _M0TP27mik1e806dxfkit14WorldExpansion(param0, param1) {
    this.placed = param0;
    this.warnings = param1;
  }
  function _M0TPB9ArrayViewGUsRP27mik1e806dxfkit5BlockEE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB9ArrayViewGUsbEE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TP27mik1e806dxfkit9ExpandCtx(param0, param1, param2, param3, param4, param5, param6, param7) {
    this.blocks = param0;
    this.duplicates = param1;
    this.tol = param2;
    this.warnings = param3;
    this.limits = param4;
    this.visits = param5;
    this.points = param6;
    this.stopped = param7;
  }
  function _M0TP27mik1e806dxfkit9SvgWriter(param0, param1, param2) {
    this.data = param0;
    this.remaining = param1;
    this.limited = param2;
  }
  function _M0TP27mik1e806dxfkit7Section(param0, param1) {
    this.name = param0;
    this.records = param1;
  }
  function _M0TP27mik1e806dxfkit8Subclass(param0, param1) {
    this.name = param0;
    this.tags = param1;
  }
  function _M0TP27mik1e806dxfkit6Record(param0, param1, param2) {
    this.kind = param0;
    this.common = param1;
    this.subclasses = param2;
  }
  function _M0TP27mik1e806dxfkit7Drawing(param0, param1, param2) {
    this.version = param0;
    this.sections = param1;
    this.warnings = param2;
  }
  function _M0TP27mik1e806dxfkit9RawRecord(param0, param1, param2) {
    this.section = param0;
    this.kind = param1;
    this.tags = param2;
  }
  function _M0TP27mik1e806dxfkit9TagStream(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14) {
    this.prefix = param0;
    this.line = param1;
    this.line_no = param2;
    this.pending = param3;
    this.warn = param4;
    this.enc = param5;
    this.finished = param6;
    this.eof_seen = param7;
    this.skip_lf = param8;
    this.limits = param9;
    this.decoder = param10;
    this.bytes = param11;
    this.tags = param12;
    this.records = param13;
    this.limited = param14;
  }
  function _M0DTP27mik1e806dxfkit8Encoding4Utf8() {}
  _M0DTP27mik1e806dxfkit8Encoding4Utf8.prototype.$tag = 0;
  const _M0DTP27mik1e806dxfkit8Encoding4Utf8__ = new _M0DTP27mik1e806dxfkit8Encoding4Utf8();
  function _M0DTP27mik1e806dxfkit8Encoding6Cp1252() {}
  _M0DTP27mik1e806dxfkit8Encoding6Cp1252.prototype.$tag = 1;
  const _M0DTP27mik1e806dxfkit8Encoding6Cp1252__ = new _M0DTP27mik1e806dxfkit8Encoding6Cp1252();
  function _M0DTP27mik1e806dxfkit8Encoding5Other(param0) {
    this._0 = param0;
  }
  _M0DTP27mik1e806dxfkit8Encoding5Other.prototype.$tag = 2;
  function _M0TPB9ArrayViewGUiRPB5ArrayGRP27mik1e806dxfkit4Vec2EEE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB9ArrayViewGUsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEEE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB9ArrayViewGUibEE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB9ArrayViewGUlbEE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TPB9ArrayViewGUsRPB5ArrayGRP27mik1e806dxfkit6CutSegEEE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TP27mik1e806dxfkit6CutSeg(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9) {
    this.a = param0;
    this.b = param1;
    this.min_x = param2;
    this.max_x = param3;
    this.min_y = param4;
    this.max_y = param5;
    this.owner = param6;
    this.seg = param7;
    this.count = param8;
    this.closed = param9;
  }
  function _M0TP27mik1e806dxfkit6Report(param0) {
    this.findings = param0;
  }
  function _M0TP27mik1e806dxfkit9CheckWork(param0, param1) {
    this.remaining = param0;
    this.stopped = param1;
  }
  function _M0TPB9ArrayViewGRP27mik1e806dxfkit3TagE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TP27mik1e806dxfkit7TagScan(param0, param1, param2) {
    this.tags = param0;
    this.warnings = param1;
    this.encoding = param2;
  }
  function _M0TP27mik1e806dxfkit9HeaderVar(param0, param1) {
    this.name = param0;
    this.values = param1;
  }
  function _M0TP27mik1e806dxfkit6Header(param0) {
    this.vars = param0;
  }
  function _M0TP27mik1e806dxfkit15DrawingAnalysis(param0, param1, param2) {
    this.report = param0;
    this.svg = param1;
    this.unit = param2;
  }
  function _M0DTPB4Json4Null() {}
  _M0DTPB4Json4Null.prototype.$tag = 0;
  function _M0DTPB4Json4True() {}
  _M0DTPB4Json4True.prototype.$tag = 1;
  function _M0DTPB4Json5False() {}
  _M0DTPB4Json5False.prototype.$tag = 2;
  function _M0DTPB4Json6Number(param0, param1) {
    this._0 = param0;
    this._1 = param1;
  }
  _M0DTPB4Json6Number.prototype.$tag = 3;
  function _M0DTPB4Json6String(param0) {
    this._0 = param0;
  }
  _M0DTPB4Json6String.prototype.$tag = 4;
  function _M0DTPB4Json5Array(param0) {
    this._0 = param0;
  }
  _M0DTPB4Json5Array.prototype.$tag = 5;
  function _M0DTPB4Json6Object(param0) {
    this._0 = param0;
  }
  _M0DTPB4Json6Object.prototype.$tag = 6;
  function _M0TPB9ArrayViewGUsRPB4JsonEE(param0, param1, param2) {
    this.buf = param0;
    this.start = param1;
    this.end = param2;
  }
  function _M0TP27mik1e806dxfkit12CheckOptions(param0, param1) {
    this.tol = param0;
    this.min_gap = param1;
  }
  const _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger = { method_0: _M0IPB13StringBuilderPB6Logger13write__string, method_1: _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE, method_2: _M0IPB13StringBuilderPB6Logger11write__view, method_3: _M0IPB13StringBuilderPB6Logger11write__char, method_4: _M0IP016_24default__implPB6Logger28write__string__interpolationGRPB13StringBuilderE, method_5: _M0IP016_24default__implPB6Logger5writeGRPB13StringBuilderE };
  const _M0FPB18double__max__value = $i64_reinterpret_f64(9218868437227405311n);
  const _M0FPB18double__min__value = $i64_reinterpret_f64(18442240474082181119n);
  const _M0MPB4Iter4nextN6constrS9909GUsRPB4JsonEE = 0;
  const _M0MPB4Iter4nextN6constrS9910GUsRPB4JsonEE = 0;
  const _M0MPB4Iter4nextN6constrS9909GRPB5ArrayGRP27mik1e806dxfkit4Vec2EE = 0;
  const _M0MPB4Iter4nextN6constrS9910GRPB5ArrayGRP27mik1e806dxfkit4Vec2EE = 0;
  const _M0MPB4Iter3newN6constrS9917GUsRPB4JsonEE = 0;
  const _M0MPB4Iter3newN6constrS9917GRPB5ArrayGRP27mik1e806dxfkit4Vec2EE = 0;
  const _M0FPC16double14not__a__number = $i64_reinterpret_f64(9221120237041090561n);
  const _M0FPC16double8infinity = $i64_reinterpret_f64(9218868437227405312n);
  const _M0FPC16double13neg__infinity = $i64_reinterpret_f64(18442240474082181120n);
  const _M0FPC28internal7strconv14base__err__str = "invalid base";
  const _M0FPC28internal7strconv15range__err__str = "value out of range";
  const _M0FPC28internal7strconv16syntax__err__str = "invalid syntax";
  const _M0FPC28internal7strconv17min__19digit__int = 1000000000000000000n;
  const _M0FPC28internal7strconv17parse__scientificN8exp__numS354 = 0n;
  const _M0FPC28internal7strconv20parse__int64_2einnerN7_2abindS681 = "";
  const _M0FPC28internal7strconv27eisel__lemire__pow10__table = [18054884314459144840n, 1671618768450675795n, 11284302696536965525n, 1044761730281672372n, 14105378370671206906n, 5917638181279478369n, 17631722963339008632n, 16620419763454123769n, 11019826852086880395n, 10387762352158827356n, 13774783565108600494n, 8373016921771146291n, 17218479456385750618n, 1242899115359157055n, 10761549660241094136n, 5388497965526861063n, 13451937075301367670n, 6735622456908576329n, 16814921344126709587n, 17642900107990496220n, 10509325840079193492n, 8720969558280366185n, 13136657300098991865n, 10901211947850457732n, 16420821625123739831n, 18238200953240460069n, 10263013515702337394n, 18316404623416369399n, 12828766894627921743n, 13672133742415685941n, 16035958618284902179n, 12478481159592219522n, 10022474136428063862n, 5493207715531443249n, 12528092670535079827n, 16089881681269079869n, 15660115838168849784n, 15500666083158961933n, 9787572398855531115n, 9687916301974351208n, 12234465498569413894n, 7498209359040551106n, 15293081873211767368n, 149389661945913074n, 9558176170757354605n, 93368538716195671n, 11947720213446693256n, 4728396691822632493n, 14934650266808366570n, 5910495864778290617n, 9334156416755229106n, 8305745933913819539n, 11667695520944036383n, 1158810380537498616n, 14584619401180045478n, 15283571030954036982n, 18230774251475056848n, 9881091751837770420n, 11394233907171910530n, 6175682344898606512n, 14242792383964888162n, 16942974967978033949n, 17803490479956110203n, 11955346673117766628n, 11127181549972568877n, 5166248661484910190n, 13908976937465711096n, 11069496845283525642n, 17386221171832138870n, 13836871056604407053n, 10866388232395086794n, 4036358391950366504n, 13582985290493858492n, 14268820026792733938n, 16978731613117323115n, 17836025033490917422n, 10611707258198326947n, 8841672636718129437n, 13264634072747908684n, 6440404777470273892n, 16580792590934885855n, 8050505971837842365n, 10362995369334303659n, 11949095260039733334n, 12953744211667879574n, 10324683056622278764n, 16192180264584849468n, 3682481783923072647n, 10120112665365530917n, 11524923151806696212n, 12650140831706913647n, 571095884476206553n, 15812676039633642058n, 14548927910877421904n, 9882922524771026286n, 13704765962725776594n, 12353653155963782858n, 7907585416552444934n, 15442066444954728573n, 661109733835780360n, 9651291528096705358n, 2719036592861056677n, 12064114410120881697n, 12622167777931096654n, 15080143012651102122n, 1942651667131707105n, 9425089382906938826n, 5825843310384704845n, 11781361728633673532n, 16505676174835656864n, 14726702160792091916n, 2185351144835019464n, 18408377700990114895n, 2731688931043774330n, 11505236063118821809n, 8624834609543440812n, 14381545078898527261n, 15392729280356688919n, 17976931348623159077n, 5405853545163697437n, 11235582092889474423n, 5684501474941004850n, 14044477616111843029n, 2493940825248868159n, 17555597020139803786n, 7729112049988473103n, 10972248137587377366n, 9442381049670183593n, 13715310171984221708n, 2579604275232953683n, 17144137714980277135n, 3224505344041192104n, 10715086071862673209n, 8932844867666826921n, 13393857589828341511n, 15777742103010921555n, 16742321987285426889n, 15110491610336264040n, 10463951242053391806n, 2526528228819083169n, 13079939052566739757n, 12381532322878629770n, 16349923815708424697n, 1641857348316123500n, 10218702384817765435n, 12555375888766046947n, 12773377981022206794n, 11082533842530170780n, 15966722476277758493n, 4629795266307937667n, 9979201547673599058n, 5199465050656154994n, 12474001934591998822n, 15722703350174969551n, 15592502418239998528n, 10430007150863936130n, 9745314011399999080n, 6518754469289960081n, 12181642514249998850n, 8148443086612450102n, 15227053142812498563n, 962181821410786819n, 9516908214257811601n, 16742264702877599426n, 11896135267822264502n, 7092772823314835570n, 14870169084777830627n, 18089338065998320271n, 9293855677986144142n, 8999993282035256217n, 11617319597482680178n, 2026619565689294464n, 14521649496853350222n, 11756646493966393888n, 18152061871066687778n, 5472436080603216552n, 11345038669416679861n, 8031958568804398249n, 14181298336770849826n, 14651634229432885715n, 17726622920963562283n, 9091170749936331336n, 11079139325602226427n, 3376138709496513133n, 13848924157002783033n, 18055231442152805128n, 17311155196253478792n, 8733981247408842698n, 10819471997658424245n, 5458738279630526686n, 13524339997073030306n, 11435108867965546262n, 16905424996341287883n, 5070514048102157020n, 10565890622713304927n, 863228270850154185n, 13207363278391631158n, 14914093393844856443n, 16509204097989538948n, 9419244705451294746n, 10318252561243461842n, 15110399977761835024n, 12897815701554327303n, 9664627935347517973n, 16122269626942909129n, 7469098900757009562n, 10076418516839318205n, 16197401859041600736n, 12595523146049147757n, 6411694268519837208n, 15744403932561434696n, 12626303854077184414n, 9840252457850896685n, 7891439908798240259n, 12300315572313620856n, 14475985904425188227n, 15375394465392026070n, 18094982380531485284n, 9609621540870016294n, 6697677969404790399n, 12012026926087520367n, 17595469498610763806n, 15015033657609400459n, 17382650854836066854n, 9384396036005875287n, 8558313775058847832n, 11730495045007344109n, 6086206200396171886n, 14663118806259180136n, 12219443768922602761n, 18328898507823975170n, 15274304711153253452n, 11455561567389984481n, 14158126462898171311n, 14319451959237480602n, 3862600023340550427n, 17899314949046850752n, 14051622066030463842n, 11187071843154281720n, 8782263791269039901n, 13983839803942852150n, 10977829739086299876n, 17479799754928565188n, 4498915137003099037n, 10924874846830353242n, 12035193997481712706n, 13656093558537941553n, 5820620459997365075n, 17070116948172426941n, 11887461593424094248n, 10668823092607766838n, 9735506505103752857n, 13336028865759708548n, 2946011094524915263n, 16670036082199635685n, 3682513868156144079n, 10418772551374772303n, 4607414176811284001n, 13023465689218465379n, 1147581702586717097n, 16279332111523081723n, 15269535183515560084n, 10174582569701926077n, 7237616480483531100n, 12718228212127407596n, 13658706619031801779n, 15897785265159259495n, 17073383273789752224n, 9936115790724537184n, 17588393573759676996n, 12420144738405671481n, 3538747893490044629n, 15525180923007089351n, 9035120885289943691n, 9703238076879430844n, 12564479580947296663n, 12129047596099288555n, 15705599476184120828n, 15161309495124110694n, 15020313326802763131n, 9475818434452569184n, 4776009810824339053n, 11844773043065711480n, 5970012263530423816n, 14805966303832139350n, 7462515329413029771n, 9253728939895087094n, 52386062455755702n, 11567161174868858867n, 9288854614924470436n, 14458951468586073584n, 6999382250228200141n, 18073689335732591980n, 8749227812785250177n, 11296055834832869987n, 14691639419845557168n, 14120069793541087484n, 13752863256379558556n, 17650087241926359355n, 17191079070474448196n, 11031304526203974597n, 8438581409832836170n, 13789130657754968246n, 15159912780718433117n, 17236413322193710308n, 9726518939043265588n, 10772758326371068942n, 15302446373756816800n, 13465947907963836178n, 9904685930341245193n, 16832434884954795223n, 3157485376071780683n, 10520271803096747014n, 8890957387685944783n, 13150339753870933768n, 1890324697752655170n, 16437924692338667210n, 2362905872190818963n, 10273702932711667006n, 6088502188546649756n, 12842128665889583757n, 16833999772538088003n, 16052660832361979697n, 7207441660390446292n, 10032913020226237310n, 16033866083812498692n, 12541141275282796638n, 10818960567910847557n, 15676426594103495798n, 4300328673033783639n, 9797766621314684873n, 16522763475928278486n, 12247208276643356092n, 6818396289628184396n, 15309010345804195115n, 8522995362035230495n, 9568131466127621947n, 3021029092058325107n, 11960164332659527433n, 17611344420355070096n, 14950205415824409292n, 8179122470161673908n, 9343878384890255807n, 14335323580705822000n, 11679847981112819759n, 13307468457454889596n, 14599809976391024699n, 12022649553391224092n, 18249762470488780874n, 10416625923311642211n, 11406101544055488046n, 11122077220497164286n, 14257626930069360058n, 4679224488766679549n, 17822033662586700072n, 15072402647813125244n, 11138771039116687545n, 9420251654883203278n, 13923463798895859431n, 16387000587031392001n, 17404329748619824289n, 15872064715361852097n, 10877706092887390181n, 3002511419460075705n, 13597132616109237726n, 8364825292752482535n, 16996415770136547158n, 1232659579085827361n, 10622759856335341973n, 14605470292210805812n, 13278449820419177467n, 4421779809981343554n, 16598062275523971834n, 915538744049291538n, 10373788922202482396n, 5183897733458195115n, 12967236152753102995n, 6479872166822743894n, 16209045190941378744n, 3488154190101041964n, 10130653244338361715n, 2180096368813151227n, 12663316555422952143n, 16560178516298602746n, 15829145694278690179n, 16088537126945865529n, 9893216058924181362n, 7749492695127472003n, 12366520073655226703n, 463493832054564196n, 15458150092069033378n, 14414425345350368957n, 9661343807543145861n, 13620701859271368502n, 12076679759428932327n, 3190819268807046916n, 15095849699286165408n, 17823582141290972357n, 9434906062053853380n, 11139738838306857723n, 11793632577567316725n, 13924673547883572154n, 14742040721959145907n, 3570783879572301480n, 18427550902448932383n, 18298537904747540562n, 11517219314030582739n, 18354115218108294707n, 14396524142538228424n, 18330958004207980480n, 17995655178172785531n, 4466953431550423984n, 11247284486357990957n, 486002885505321038n, 14059105607947488696n, 5219189625309039202n, 17573882009934360870n, 6523987031636299002n, 10983676256208975543n, 17912549950054850588n, 13729595320261219429n, 17779001419141175331n, 17161994150326524287n, 8388693718644305452n, 10726246343954077679n, 12160462601793772764n, 13407807929942597099n, 10588892233814828051n, 16759759912428246374n, 8624429273841147159n, 10474849945267653984n, 778582277723329070n, 13093562431584567480n, 973227847154161338n, 16366953039480709350n, 1216534808942701673n, 10229345649675443343n, 14595392310871352257n, 12786682062094304179n, 13632554370161802418n, 15983352577617880224n, 12429006944274865118n, 9989595361011175140n, 7768129340171790699n, 12486994201263968925n, 9710161675214738374n, 15608742751579961156n, 16749388112445810871n, 9755464219737475723n, 1244995533423855986n, 12194330274671844653n, 15391302472061983695n, 15242912843339805817n, 5404070034795315907n, 9526820527087378635n, 14906758817815542202n, 11908525658859223294n, 14021762503842039848n, 14885657073574029118n, 8303831092947774002n, 9303535670983768199n, 578208414664970847n, 11629419588729710248n, 14557818573613377271n, 14536774485912137810n, 18197273217016721589n, 18170968107390172263n, 13523219484416126178n, 11356855067118857664n, 15369541205401160717n, 14196068833898572081n, 765182433041899281n, 17745086042373215101n, 5568164059729762005n, 11090678776483259438n, 5785945546544795205n, 13863348470604074297n, 16455803970035769814n, 17329185588255092872n, 6734696907262548556n, 10830740992659433045n, 4209185567039092847n, 13538426240824291306n, 9873167977226253963n, 16923032801030364133n, 3118087934678041646n, 10576895500643977583n, 4254647968387469981n, 13221119375804971979n, 706623942056949572n, 16526399219756214973n, 14718337982853350677n, 10328999512347634358n, 11504804248497038125n, 12911249390434542948n, 5157633273766521849n, 16139061738043178685n, 6447041592208152311n, 10086913586276986678n, 6335244004343789146n, 12608641982846233347n, 17142427042284512241n, 15760802478557791684n, 16816347784428252397n, 9850501549098619803n, 1286845328412881940n, 12313126936373274753n, 15443614715798266137n, 15391408670466593442n, 5469460339465668959n, 9619630419041620901n, 8030098730593431003n, 12024538023802026126n, 14649309431669176658n, 15030672529752532658n, 9088264752731695015n, 9394170331095332911n, 10291851488884697288n, 11742712913869166139n, 8253128342678483706n, 14678391142336457674n, 5704724409920716729n, 18347988927920572092n, 16354277549255671720n, 11467493079950357558n, 998051431430019017n, 14334366349937946947n, 10470936326142299579n, 17917957937422433684n, 8476984389250486570n, 11198723710889021052n, 14521487280136329914n, 13998404638611276315n, 18151859100170412392n, 17498005798264095394n, 18078137856785627587n, 10936253623915059621n, 15910522178918405146n, 13670317029893824527n, 6053094668365842720n, 17087896287367280659n, 2954682317029915496n, 10679935179604550411n, 17987577512639554849n, 13349918974505688014n, 17872785872372055657n, 16687398718132110018n, 13117610303610293764n, 10429624198832568761n, 12810192458183821506n, 13037030248540710952n, 2177682517447613171n, 16296287810675888690n, 2722103146809516464n, 10185179881672430431n, 6313000485183335694n, 12731474852090538039n, 3279564588051781713n, 15914343565113172548n, 17934513790346890853n, 9946464728195732843n, 1985699082112030975n, 12433080910244666053n, 16317181907922202431n, 15541351137805832567n, 6561419329620589327n, 9713344461128645354n, 11018416108653950185n, 12141680576410806693n, 4549648098962661924n, 15177100720513508366n, 10298746142130715309n, 9485687950320942729n, 1825030320404309164n, 11857109937901178411n, 6892973918932774359n, 14821387422376473014n, 4004531380238580045n, 9263367138985295633n, 16337890167931276240n, 11579208923731619542n, 6587304654631931588n, 14474011154664524427n, 17457502855144690293n, 18092513943330655534n, 17210192550503474962n, 11307821214581659709n, 6144684325637283947n, 14134776518227074636n, 12292541425473992838n, 17668470647783843295n, 15365676781842491048n, 11042794154864902059n, 16521077016292638761n, 13803492693581127574n, 16039660251938410547n, 17254365866976409468n, 10826203278068237376n, 10783978666860255917n, 15989749085647424168n, 13479973333575319897n, 6152128301777116498n, 16849966666969149871n, 12301846395648783526n, 10531229166855718669n, 14606183024921571560n, 13164036458569648337n, 4422670725869800738n, 16455045573212060421n, 10140024425764638826n, 10284403483257537763n, 8643358275316593218n, 12855504354071922204n, 6192511825718353619n, 16069380442589902755n, 7740639782147942024n, 10043362776618689222n, 2532056854628769813n, 12554203470773361527n, 12388443105140738074n, 15692754338466701909n, 10873867862998534689n, 9807971461541688693n, 9102010423587778132n, 12259964326927110866n, 15989199047912110569n, 15324955408658888583n, 10763126773035362404n, 9578097130411805364n, 13644483260788183358n, 11972621413014756705n, 17055604075985229198n, 14965776766268445882n, 7484447039699372786n, 9353610478917778676n, 9289465418239495895n, 11692013098647223345n, 11611831772799369869n, 14615016373309029182n, 679731660717048624n, 18268770466636286477n, 10073036612751086588n, 11417981541647679048n, 8601490892183123069n, 14272476927059598810n, 10751863615228903837n, 17840596158824498513n, 4216457482181353988n, 11150372599265311570n, 14164500972431816002n, 13937965749081639463n, 8482254178684994195n, 17422457186352049329n, 5991131704928854840n, 10889035741470030830n, 15273672361649004035n, 13611294676837538538n, 9868718415206479236n, 17014118346046923173n, 3112525982153323237n, 10633823966279326983n, 4251171748059520975n, 13292279957849158729n, 702278666647013314n, 16615349947311448411n, 5489534351736154547n, 10384593717069655257n, 1125115960621402640n, 12980742146337069071n, 6018080969204141204n, 16225927682921336339n, 2910915193077788601n, 10141204801825835211n, 17960223060169475539n, 12676506002282294014n, 17838592806784456520n, 15845632502852867518n, 13074868971625794843n, 9903520314283042199n, 3560107088838733872n, 12379400392853802748n, 18285191916330581053n, 15474250491067253436n, 4409745821703674700n, 9671406556917033397n, 11979463175419572495n, 12089258196146291747n, 1139270913992301907n, 15111572745182864683n, 15259146697772541096n, 9444732965739290427n, 7231123676894144233n, 11805916207174113034n, 4427218577690292387n, 14757395258967641292n, 14757395258967641292n, 9223372036854775808n, 0n, 11529215046068469760n, 0n, 14411518807585587200n, 0n, 18014398509481984000n, 0n, 11258999068426240000n, 0n, 14073748835532800000n, 0n, 17592186044416000000n, 0n, 10995116277760000000n, 0n, 13743895347200000000n, 0n, 17179869184000000000n, 0n, 10737418240000000000n, 0n, 13421772800000000000n, 0n, 16777216000000000000n, 0n, 10485760000000000000n, 0n, 13107200000000000000n, 0n, 16384000000000000000n, 0n, 10240000000000000000n, 0n, 12800000000000000000n, 0n, 16000000000000000000n, 0n, 10000000000000000000n, 0n, 12500000000000000000n, 0n, 15625000000000000000n, 0n, 9765625000000000000n, 0n, 12207031250000000000n, 0n, 15258789062500000000n, 0n, 9536743164062500000n, 0n, 11920928955078125000n, 0n, 14901161193847656250n, 0n, 9313225746154785156n, 4611686018427387904n, 11641532182693481445n, 5764607523034234880n, 14551915228366851806n, 11817445422220181504n, 18189894035458564758n, 5548434740920451072n, 11368683772161602973n, 17302829768357445632n, 14210854715202003717n, 7793479155164643328n, 17763568394002504646n, 14353534962383192064n, 11102230246251565404n, 4359273333062107136n, 13877787807814456755n, 5449091666327633920n, 17347234759768070944n, 2199678564482154496n, 10842021724855044340n, 1374799102801346560n, 13552527156068805425n, 1718498878501683200n, 16940658945086006781n, 6759809616554491904n, 10587911840678754238n, 6530724019560251392n, 13234889800848442797n, 17386777061305090048n, 16543612251060553497n, 7898413271349198848n, 10339757656912845935n, 16465723340661719040n, 12924697071141057419n, 15970468157399760896n, 16155871338926321774n, 15351399178322313216n, 10097419586828951109n, 4982938468024057856n, 12621774483536188886n, 10840359103457460224n, 15777218104420236108n, 4327076842467049472n, 9860761315262647567n, 11927795063396681728n, 12325951644078309459n, 10298057810818464256n, 15407439555097886824n, 8260886245095692416n, 9629649721936179265n, 5163053903184807760n, 12037062152420224081n, 11065503397408397604n, 15046327690525280101n, 18443565265187884909n, 9403954806578300063n, 13833071299956122020n, 11754943508222875079n, 12679653106517764621n, 14693679385278593849n, 11237880364719817872n, 18367099231598242312n, 212292400617608628n, 11479437019748901445n, 132682750386005392n, 14349296274686126806n, 4777539456409894645n, 17936620343357658507n, 15195296357367144114n, 11210387714598536567n, 7191217214140771119n, 14012984643248170709n, 4377335499248575995n, 17516230804060213386n, 10083355392488107898n, 10947644252537633366n, 10913783138732455340n, 13684555315672041708n, 4418856886560793367n, 17105694144590052135n, 5523571108200991709n, 10691058840368782584n, 10369760970266701674n, 13363823550460978230n, 12962201212833377092n, 16704779438076222788n, 6979379479186945558n, 10440487148797639242n, 13585484211346616781n, 13050608935997049053n, 7758483227328495169n, 16313261169996311316n, 14309790052588006865n, 10195788231247694572n, 18166990819722280098n, 12744735289059618216n, 4261994450943298507n, 15930919111324522770n, 5327493063679123134n, 9956824444577826731n, 7941369183226839863n, 12446030555722283414n, 5315025460606161924n, 15557538194652854267n, 15867153862612478214n, 9723461371658033917n, 7611128154919104931n, 12154326714572542396n, 14125596212076269068n, 15192908393215677995n, 17656995265095336336n, 9495567745759798747n, 8729779031470891258n, 11869459682199748434n, 6300537770911226168n, 14836824602749685542n, 17099044250493808518n, 9273015376718553464n, 6075216638131242420n, 11591269220898191830n, 7594020797664053025n, 14489086526122739788n, 269153960225290473n, 18111358157653424735n, 336442450281613091n, 11319598848533390459n, 7127805559067090038n, 14149498560666738074n, 4298070930406474644n, 17686873200833422592n, 14595960699862869113n, 11054295750520889120n, 9122475437414293195n, 13817869688151111400n, 11403094296767866494n, 17272337110188889250n, 14253867870959833118n, 10795210693868055781n, 13520353437777283602n, 13494013367335069727n, 3065383741939440791n, 16867516709168837158n, 17666787732706464701n, 10542197943230523224n, 6430056314514152534n, 13177747429038154030n, 8037570393142690668n, 16472184286297692538n, 823590954573587527n, 10295115178936057836n, 5126430365035880108n, 12868893973670072295n, 6408037956294850135n, 16086117467087590369n, 3398361426941174765n, 10053823416929743980n, 13653190937906703988n, 12567279271162179975n, 17066488672383379985n, 15709099088952724969n, 16721424822051837077n, 9818186930595453106n, 3533361486141316317n, 12272733663244316382n, 13640073894531421205n, 15340917079055395478n, 7826720331309500698n, 9588073174409622174n, 280014188641050032n, 11985091468012027717n, 9573389772656088348n, 14981364335015034646n, 16578423234247498339n, 9363352709384396654n, 5749828502977298558n, 11704190886730495817n, 16410657665576399005n, 14630238608413119772n, 6678264026688335045n, 18287798260516399715n, 8347830033360418806n, 11429873912822749822n, 2911550761636567802n, 14287342391028437277n, 12862810488900485560n, 17859177988785546597n, 2243455055843443238n, 11161986242990966623n, 3708002419115845976n, 13952482803738708279n, 23317005467419566n, 17440603504673385348n, 13864204312116438170n, 10900377190420865842n, 17888499731927549664n, 13625471488026082303n, 13137252628054661272n, 17031839360032602879n, 11809879766640938686n, 10644899600020376799n, 14298703881791668535n, 13306124500025470999n, 13261693833812197764n, 16632655625031838749n, 11965431273837859301n, 10395409765644899218n, 9784237555362356015n, 12994262207056124023n, 3006924907348169211n, 16242827758820155028n, 17593714189467375226n, 10151767349262596893n, 1772699331562333708n, 12689709186578246116n, 6827560182880305039n, 15862136483222807645n, 8534450228600381299n, 9913835302014254778n, 7639874402088932264n, 12392294127517818473n, 326470965756389522n, 15490367659397273091n, 5019774725622874806n, 9681479787123295682n, 831516194300602802n, 12101849733904119602n, 10262767279730529310n, 15127312167380149503n, 3605087062808385830n, 9454570104612593439n, 9170708441896323000n, 11818212630765741799n, 6851699533943015846n, 14772765788457177249n, 3952938399001381903n, 9232978617785735780n, 13999801545444333449n, 11541223272232169725n, 17499751931805416812n, 14426529090290212157n, 8039631859474607303n, 18033161362862765196n, 14661225842770647033n, 11270725851789228247n, 18386638188586430203n, 14088407314736535309n, 18371611717305649850n, 17610509143420669137n, 9129456591349898601n, 11006568214637918210n, 17235125415662156385n, 13758210268297397763n, 12320534732722919674n, 17197762835371747204n, 10788982397476261688n, 10748601772107342002n, 15966486035277439363n, 13435752215134177503n, 10734735507242023396n, 16794690268917721879n, 8806733365625141341n, 10496681418073576174n, 12421737381156795194n, 13120851772591970218n, 6303799689591218185n, 16401064715739962772n, 17103121648843798539n, 10250665447337476733n, 1466078993672598279n, 12813331809171845916n, 6444284760518135752n, 16016664761464807395n, 8055355950647669691n, 10010415475915504622n, 2728754459941099604n, 12513019344894380777n, 12634315111781150314n, 15641274181117975972n, 1957835834444274180n, 9775796363198734982n, 10447019433382447170n, 12219745453998418728n, 3835402254873283155n, 15274681817498023410n, 4794252818591603944n, 9546676135936264631n, 7608094030047140369n, 11933345169920330789n, 4898431519131537557n, 14916681462400413486n, 10734725417341809851n, 9322925914000258429n, 2097517367411243253n, 11653657392500323036n, 7233582727691441970n, 14567071740625403795n, 9041978409614302462n, 18208839675781754744n, 6690786993590490174n, 11380524797363596715n, 4181741870994056359n, 14225655996704495894n, 615491320315182544n, 17782069995880619867n, 9992736187248753989n, 11113793747425387417n, 3939617107816777291n, 13892242184281734271n, 9536207403198359517n, 17365302730352167839n, 7308573235570561493n, 10853314206470104899n, 11485387299872682789n, 13566642758087631124n, 9745048106413465582n, 16958303447609538905n, 12181310133016831978n, 10598939654755961816n, 695789805494438130n, 13248674568444952270n, 869737256868047663n, 16560843210556190337n, 10310543607939835386n, 10350527006597618960n, 17973304801030866876n, 12938158758247023701n, 4019886927579031980n, 16172698447808779626n, 9636544677901177879n, 10107936529880487266n, 10634526442115624078n, 12634920662350609083n, 4069786015789754290n, 15793650827938261354n, 475546501309804958n, 9871031767461413346n, 4908902581746016003n, 12338789709326766682n, 15359500264037295811n, 15423487136658458353n, 9976003293191843956n, 9639679460411536470n, 17764217104313372233n, 12049599325514420588n, 12981899343536939483n, 15061999156893025735n, 16227374179421174354n, 9413749473058141084n, 17059637889779315827n, 11767186841322676356n, 2877803288514593168n, 14708983551653345445n, 3597254110643241460n, 18386229439566681806n, 9108253656731439729n, 11491393399729176129n, 1080972517029761926n, 14364241749661470161n, 5962901664714590312n, 17955302187076837701n, 12065313099320625794n, 11222063866923023563n, 9846663696289085073n, 14027579833653779454n, 7696643601933968437n, 17534474792067224318n, 397432465562684739n, 10959046745042015198n, 14083453346258841674n, 13698808431302518998n, 8380944645968776284n, 17123510539128148748n, 1252808770606194547n, 10702194086955092967n, 10006377518483647400n, 13377742608693866209n, 7896285879677171346n, 16722178260867332761n, 14482043368023852087n, 10451361413042082976n, 2133748077373825698n, 13064201766302603720n, 2667185096717282123n, 16330252207878254650n, 3333981370896602653n, 10206407629923909156n, 6695424375237764562n, 12758009537404886445n, 8369280469047205703n, 15947511921756108056n, 15073286604736395033n, 9967194951097567535n, 9420804127960246895n, 12458993688871959419n, 7164319141522920715n, 15573742111089949274n, 4343712908476262990n, 9733588819431218296n, 7326506586225052273n, 12166986024289022870n, 9158133232781315341n, 15208732530361278588n, 2224294504121868368n, 9505457831475799117n, 10613556101930943538n, 11881822289344748896n, 17878631145841067327n, 14852277861680936121n, 3901544858591782542n, 9282673663550585075n, 13967680582688333849n, 11603342079438231344n, 12847914709933029407n, 14504177599297789180n, 16059893387416286759n, 18130221999122236476n, 1628122660560806833n, 11331388749451397797n, 10240948699705280078n, 14164235936814247246n, 17412871893058988002n, 17705294921017809058n, 12542717829468959195n, 11065809325636130661n, 12450884661845487401n, 13832261657045163327n, 1728547772024695539n, 17290327071306454158n, 15995742770313033136n, 10806454419566533849n, 5385653213018257806n, 13508068024458167311n, 11343752534700210161n, 16885085030572709139n, 9568004649947874797n, 10553178144107943212n, 3674159897003727796n, 13191472680134929015n, 4592699871254659745n, 16489340850168661269n, 1129188820640936778n, 10305838031355413293n, 3011586022114279438n, 12882297539194266616n, 8376168546070237202n, 16102871923992833270n, 10470210682587796502n, 10064294952495520794n, 1932195658189984910n, 12580368690619400992n, 11638616609592256945n, 15725460863274251240n, 14548270761990321182n, 9828413039546407025n, 9092669226243950738n, 12285516299433008781n, 15977522551232326327n, 15356895374291260977n, 6136845133758244197n, 9598059608932038110n, 15364743254667372383n, 11997574511165047638n, 9982557031479439671n, 14996968138956309548n, 3254824252494523781n, 9373105086847693467n, 11257637194663853171n, 11716381358559616834n, 9460360474902428559n, 14645476698199521043n, 2602078556773259891n, 18306845872749401303n, 17087656251248738576n, 11441778670468375814n, 17597314184671543466n, 14302223338085469768n, 12773270693984653525n, 17877779172606837210n, 15966588367480816906n, 11173611982879273256n, 14590803748102898470n, 13967014978599091570n, 18238504685128623088n, 17458768723248864463n, 13574758819556003052n, 10911730452030540289n, 15401753289863583763n, 13639663065038175362n, 5417133557047315992n, 17049578831297719202n, 15994788983163920798n, 10655986769561074501n, 14608429132904838403n, 13319983461951343127n, 4425478360848884291n, 16649979327439178909n, 920161932633717460n, 10406237079649486818n, 2880944217109767365n, 13007796349561858522n, 12824552308241985014n, 16259745436952323153n, 6807318348447705459n, 10162340898095201970n, 15783789013848285672n, 12702926122619002463n, 10506364230455581282n, 15878657653273753079n, 8521269269642088699n, 9924161033296095674n, 12243322321167387293n, 12405201291620119593n, 6080780864604458308n, 15506501614525149491n, 12212662099182960789n, 9691563509078218432n, 5327070802775656541n, 12114454386347773040n, 6658838503469570676n, 15143067982934716300n, 8323548129336963345n, 9464417489334197687n, 14425589617690377899n, 11830521861667747109n, 13420301003685584469n, 14788152327084683887n, 2940318199324816875n, 9242595204427927429n, 8755227902219092403n, 11553244005534909286n, 15555720896201253407n, 14441555006918636608n, 10221279083396790951n, 18051943758648295760n, 12776598854245988689n, 11282464849155184850n, 7985374283903742931n, 14103081061443981063n, 758345818024902856n, 17628851326804976328n, 14782990327813292282n, 11018032079253110205n, 9239368954883307676n, 13772540099066387756n, 16160897212031522499n, 17215675123832984696n, 1754377441329851508n, 10759796952395615435n, 1096485900831157192n, 13449746190494519293n, 15205665431321110202n, 16812182738118149117n, 5172023733869224041n, 10507614211323843198n, 5538357842881958977n, 13134517764154803997n, 16146319340457224530n, 16418147205193504997n, 6347841120289366950n, 10261342003245940623n, 6273243709394548296n, 12826677504057425779n, 3229868618315797466n, 16033346880071782223n, 17872393828176910545n, 10020841800044863889n, 18087775170251650946n, 12526052250056079862n, 8774660907532399971n, 15657565312570099828n, 1744954097560724156n, 9785978320356312392n, 10313968347830228405n, 12232472900445390490n, 12892460434787785506n, 15290591125556738113n, 6892203506629956075n, 9556619453472961320n, 15836842237712192307n, 11945774316841201651n, 1349308723430688768n, 14932217896051502063n, 15521693959570524672n, 9332636185032188789n, 16618587752372659776n, 11665795231290235987n, 6938176635183661008n, 14582244039112794984n, 4061034775552188356n, 18227805048890993730n, 5076293469440235445n, 11392378155556871081n, 7784369436827535057n, 14240472694446088851n, 14342147814461806725n, 17800590868057611064n, 13315998749649870503n, 11125369292536006915n, 8322499218531169064n, 13906711615670008644n, 5791438004736573426n, 17383389519587510805n, 7239297505920716783n, 10864618449742194253n, 6830403950414141941n, 13580773062177742816n, 13149690956445065330n, 16975966327722178520n, 16437113695556331663n, 10609978954826361575n, 10273196059722707289n, 13262473693532951969n, 8229809056225996208n, 16578092116916189961n, 14898947338709883164n, 10361307573072618726n, 2394313059052595121n, 12951634466340773407n, 12216263360670519709n, 16189543082925966759n, 10658643182410761733n, 10118464426828729224n, 13579181016647807939n, 12648080533535911530n, 16973976270809759924n, 15810100666919889413n, 11994098301657424097n, 9881312916824930883n, 9802154447749584012n, 12351641146031163604n, 7641007041259592112n, 15439551432538954505n, 9551258801574490140n, 9649719645336846565n, 17498751797052526097n, 12062149556671058207n, 8038381691033493909n, 15077686945838822759n, 5436291095364479483n];
  const _M0FPC28internal7strconv12double__info = new _M0TPC28internal7strconv9FloatInfo(52, 11, -1023);
  const _M0FPC28internal7strconv25min__exponent__fast__path = 18446744073709551594n;
  const _M0FPC28internal7strconv25max__exponent__fast__path = 22n;
  const _M0FPC28internal7strconv36max__exponent__disguised__fast__path = 37n;
  const _M0FPC28internal7strconv25max__mantissa__fast__path = 9007199254740992n;
  const _M0FPC28internal7strconv6powtab = [1, 3, 6, 9, 13, 16, 19, 23, 26, 29, 33, 36, 39, 43, 46, 49, 53, 56, 59];
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1022 = { _0: 0, _1: "" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1023 = { _0: 1, _1: "5" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1024 = { _0: 1, _1: "25" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1025 = { _0: 1, _1: "125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1026 = { _0: 2, _1: "625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1027 = { _0: 2, _1: "3125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1028 = { _0: 2, _1: "15625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1029 = { _0: 3, _1: "78125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1030 = { _0: 3, _1: "390625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1031 = { _0: 3, _1: "1953125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1032 = { _0: 4, _1: "9765625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1033 = { _0: 4, _1: "48828125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1034 = { _0: 4, _1: "244140625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1035 = { _0: 4, _1: "1220703125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1036 = { _0: 5, _1: "6103515625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1037 = { _0: 5, _1: "30517578125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1038 = { _0: 5, _1: "152587890625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1039 = { _0: 6, _1: "762939453125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1040 = { _0: 6, _1: "3814697265625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1041 = { _0: 6, _1: "19073486328125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1042 = { _0: 7, _1: "95367431640625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1043 = { _0: 7, _1: "476837158203125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1044 = { _0: 7, _1: "2384185791015625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1045 = { _0: 7, _1: "11920928955078125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1046 = { _0: 8, _1: "59604644775390625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1047 = { _0: 8, _1: "298023223876953125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1048 = { _0: 8, _1: "1490116119384765625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1049 = { _0: 9, _1: "7450580596923828125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1050 = { _0: 9, _1: "37252902984619140625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1051 = { _0: 9, _1: "186264514923095703125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1052 = { _0: 10, _1: "931322574615478515625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1053 = { _0: 10, _1: "4656612873077392578125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1054 = { _0: 10, _1: "23283064365386962890625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1055 = { _0: 10, _1: "116415321826934814453125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1056 = { _0: 11, _1: "582076609134674072265625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1057 = { _0: 11, _1: "2910383045673370361328125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1058 = { _0: 11, _1: "14551915228366851806640625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1059 = { _0: 12, _1: "72759576141834259033203125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1060 = { _0: 12, _1: "363797880709171295166015625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1061 = { _0: 12, _1: "1818989403545856475830078125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1062 = { _0: 13, _1: "9094947017729282379150390625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1063 = { _0: 13, _1: "45474735088646411895751953125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1064 = { _0: 13, _1: "227373675443232059478759765625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1065 = { _0: 13, _1: "1136868377216160297393798828125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1066 = { _0: 14, _1: "5684341886080801486968994140625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1067 = { _0: 14, _1: "28421709430404007434844970703125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1068 = { _0: 14, _1: "142108547152020037174224853515625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1069 = { _0: 15, _1: "710542735760100185871124267578125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1070 = { _0: 15, _1: "3552713678800500929355621337890625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1071 = { _0: 15, _1: "17763568394002504646778106689453125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1072 = { _0: 16, _1: "88817841970012523233890533447265625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1073 = { _0: 16, _1: "444089209850062616169452667236328125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1074 = { _0: 16, _1: "2220446049250313080847263336181640625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1075 = { _0: 16, _1: "11102230246251565404236316680908203125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1076 = { _0: 17, _1: "55511151231257827021181583404541015625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1077 = { _0: 17, _1: "277555756156289135105907917022705078125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1078 = { _0: 17, _1: "1387778780781445675529539585113525390625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1079 = { _0: 18, _1: "6938893903907228377647697925567626953125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1080 = { _0: 18, _1: "34694469519536141888238489627838134765625" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1081 = { _0: 18, _1: "173472347597680709441192448139190673828125" };
  const _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1082 = { _0: 19, _1: "867361737988403547205962240695953369140625" };
  const _M0FPC28internal7strconv19left__shift__cheats = [_M0FPC28internal7strconv19left__shift__cheatsN5tupleS1022, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1023, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1024, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1025, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1026, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1027, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1028, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1029, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1030, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1031, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1032, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1033, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1034, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1035, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1036, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1037, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1038, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1039, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1040, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1041, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1042, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1043, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1044, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1045, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1046, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1047, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1048, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1049, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1050, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1051, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1052, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1053, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1054, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1055, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1056, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1057, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1058, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1059, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1060, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1061, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1062, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1063, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1064, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1065, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1066, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1067, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1068, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1069, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1070, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1071, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1072, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1073, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1074, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1075, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1076, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1077, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1078, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1079, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1080, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1081, _M0FPC28internal7strconv19left__shift__cheatsN5tupleS1082];
  const _M0FPC28internal7strconv10int__pow10 = [1n, 10n, 100n, 1000n, 10000n, 100000n, 1000000n, 10000000n, 100000000n, 1000000000n, 10000000000n, 100000000000n, 1000000000000n, 10000000000000n, 100000000000000n, 1000000000000000n];
  const _M0FPC28internal7strconv5table = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000, 1e+012, 1e+013, 1e+014, 1e+015, 1e+016, 1e+017, 1e+018, 1e+019, 1e+020, 1e+021, 1e+022, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const _M0FPC28internal7strconv12checked__mulN6constrS1163 = 0n;
  const _M0FP27mik1e806dxfkit12parse__layerN3subS2261 = "AcDbLayerTableRecord";
  const _M0FP27mik1e806dxfkit18project__expansionN7_2abindS2891 = "/";
  const _M0FP27mik1e806dxfkit21parse__codepage__nameN7_2abindS3683 = "ANSI_";
  const _M0FP27mik1e806dxfkit9gbk__rows = ["丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪乫乬乭乮乯乲乴乵乶乷乸乹乺乻乼乽乿亀亁亂亃亄亅亇亊亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂伃伄伅伆伇伈伋伌伒伓伔伕伖伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾伿佀佁佂佄佅佇佈佉佊佋佌佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢", "侤侫侭侰侱侲侳侴侶侷侸侹侺侻侼侽侾俀俁係俆俇俈俉俋俌俍俒俓俔俕俖俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿倀倁倂倃倄倅倆倇倈倉倊個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯倰倱倲倳倴倵倶倷倸倹倻倽倿偀偁偂偄偅偆偉偊偋偍偐偑偒偓偔偖偗偘偙偛偝偞偟偠偡偢偣偤偦偧偨偩偪偫偭偮偯偰偱偲偳側偵偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎傏傐傑傒傓傔傕傖傗傘備傚傛傜傝傞傟傠傡傢傤傦傪傫傭傮傯傰傱傳傴債傶傷傸傹傼", "傽傾傿僀僁僂僃僄僅僆僇僈僉僊僋僌働僎僐僑僒僓僔僕僗僘僙僛僜僝僞僟僠僡僢僣僤僥僨僩僪僫僯僰僱僲僴僶僷僸價僺僼僽僾僿儀儁儂儃億儅儈儉儊儌儍儎儏儐儑儓儔儕儖儗儘儙儚儛儜儝儞償儠儢儣儤儥儦儧儨儩優儫儬儭儮儯儰儱儲儳儴儵儶儷儸儹儺儻儼儽儾兂兇兊兌兎兏児兒兓兗兘兙兛兝兞兟兠兡兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦冧冨冩冪冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒凓凔凕凖凗", "凘凙凚凜凞凟凢凣凥処凧凨凩凪凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄剅剆則剈剉剋剎剏剒剓剕剗剘剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳剴創剶剷剸剹剺剻剼剾劀劃劄劅劆劇劉劊劋劌劍劎劏劑劒劔劕劖劗劘劙劚劜劤劥劦劧劮劯劰労劵劶劷劸効劺劻劼劽勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務勚勛勜勝勞勠勡勢勣勥勦勧勨勩勪勫勬勭勮勯勱勲勳勴勵勶勷勸勻勼勽匁匂匃匄匇匉匊匋匌匎", "匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯匰匱匲匳匴匵匶匷匸匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏厐厑厒厓厔厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯厰厱厲厳厴厵厷厸厹厺厼厽厾叀參叄叅叆叇収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝呞呟呠呡呣呥呧呩呪呫呬呭呮呯呰呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡", "咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠員哢哣哤哫哬哯哰哱哴哵哶哷哸哹哻哾唀唂唃唄唅唈唊唋唌唍唎唒唓唕唖唗唘唙唚唜唝唞唟唡唥唦唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋啌啍啎問啑啒啓啔啗啘啙啚啛啝啞啟啠啢啣啨啩啫啯啰啱啲啳啴啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠喡喢喣喤喥喦喨喩喪喫喬喭單喯喰喲喴営喸喺喼喿嗀嗁嗂嗃嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗嗘嗙嗚嗛嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸嗹嗺嗻嗼嗿嘂嘃嘄嘅", "嘆嘇嘊嘋嘍嘐嘑嘒嘓嘔嘕嘖嘗嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀噁噂噃噄噅噆噇噈噉噊噋噏噐噑噒噓噕噖噚噛噝噞噟噠噡噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽噾噿嚀嚁嚂嚃嚄嚇嚈嚉嚊嚋嚌嚍嚐嚑嚒嚔嚕嚖嚗嚘嚙嚚嚛嚜嚝嚞嚟嚠嚡嚢嚤嚥嚦嚧嚨嚩嚪嚫嚬嚭嚮嚰嚱嚲嚳嚴嚵嚶嚸嚹嚺嚻嚽嚾嚿囀囁囂囃囄囅囆囇囈囉囋囌囍囎囏囐囑囒囓囕囖囘囙囜団囥囦囧囨囩囪囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國圌圍圎圏圐圑", "園圓圔圕圖圗團圙圚圛圝圞圠圡圢圤圥圦圧圫圱圲圴圵圶圷圸圼圽圿坁坃坄坅坆坈坉坋坒坓坔坕坖坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀垁垇垈垉垊垍垎垏垐垑垔垕垖垗垘垙垚垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹垺垻垼垽垾垿埀埁埄埅埆埇埈埉埊埌埍埐埑埓埖埗埛埜埞埡埢埣埥埦埧埨埩埪埫埬埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥堦堧堨堩堫堬堭堮堯報堲堳場堶堷堸堹堺堻堼堽", "堾堿塀塁塂塃塅塆塇塈塉塊塋塎塏塐塒塓塕塖塗塙塚塛塜塝塟塠塡塢塣塤塦塧塨塩塪塭塮塯塰塱塲塳塴塵塶塷塸塹塺塻塼塽塿墂墄墆墇墈墊墋墌墍墎墏墐墑墔墕墖増墘墛墜墝墠墡墢墣墤墥墦墧墪墫墬墭墮墯墰墱墲墳墴墵墶墷墸墹墺墻墽墾墿壀壂壃壄壆壇壈壉壊壋壌壍壎壏壐壒壓壔壖壗壘壙壚壛壜壝壞壟壠壡壢壣壥壦壧壨壩壪壭壯壱売壴壵壷壸壺壻壼壽壾壿夀夁夃夅夆夈変夊夋夌夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻", "夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛奜奝奞奟奡奣奤奦奧奨奩奪奫奬奭奮奯奰奱奲奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦妧妬妭妰妱妳妴妵妶妷妸妺妼妽妿姀姁姂姃姄姅姇姈姉姌姍姎姏姕姖姙姛姞姟姠姡姢姤姦姧姩姪姫姭姮姯姰姱姲姳姴姵姶姷姸姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪娫娬娭娮娯娰娳娵娷娸娹娺娻娽娾娿婁婂婃婄婅婇婈婋婌婍婎婏婐婑婒婓婔婖婗婘婙婛婜婝婞婟婠", "婡婣婤婥婦婨婩婫婬婭婮婯婰婱婲婳婸婹婻婼婽婾媀媁媂媃媄媅媆媇媈媉媊媋媌媍媎媏媐媑媓媔媕媖媗媘媙媜媝媞媟媠媡媢媣媤媥媦媧媨媩媫媬媭媮媯媰媱媴媶媷媹媺媻媼媽媿嫀嫃嫄嫅嫆嫇嫈嫊嫋嫍嫎嫏嫐嫑嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬嫭嫮嫯嫰嫲嫳嫴嫵嫶嫷嫸嫹嫺嫻嫼嫽嫾嫿嬀嬁嬂嬃嬄嬅嬆嬇嬈嬊嬋嬌嬍嬎嬏嬐嬑嬒嬓嬔嬕嬘嬙嬚嬛嬜嬝嬞嬟嬠嬡嬢嬣嬤嬥嬦嬧嬨嬩嬪嬫嬬嬭嬮嬯嬰嬱嬳嬵嬶嬸嬹嬺嬻嬼嬽嬾嬿孁孂孃孄孅孆孇", "孈孉孊孋孌孍孎孏孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏寑寔寕寖寗寘寙寚寛寜寠寢寣實寧審寪寫寬寭寯寱寲寳寴寵寶寷寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧屨屩屪屫屬屭屰屲屳屴屵屶屷屸屻屼屽屾岀岃岄岅岆岇岉岊岋岎岏岒岓岕岝岞岟岠岡岤岥岦岧岨", "岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅峆峇峈峉峊峌峍峎峏峐峑峓峔峕峖峗峘峚峛峜峝峞峟峠峢峣峧峩峫峬峮峯峱峲峳峴峵島峷峸峹峺峼峽峾峿崀崁崄崅崈崉崊崋崌崍崏崐崑崒崓崕崗崘崙崚崜崝崟崠崡崢崣崥崨崪崫崬崯崰崱崲崳崵崶崷崸崹崺崻崼崿嵀嵁嵂嵃嵄嵅嵆嵈嵉嵍嵎嵏嵐嵑嵒嵓嵔嵕嵖嵗嵙嵚嵜嵞嵟嵠嵡嵢嵣嵤嵥嵦嵧嵨嵪嵭嵮嵰嵱嵲嵳嵵嵶嵷嵸嵹嵺嵻嵼嵽嵾嵿嶀嶁嶃嶄嶅嶆嶇嶈嶉嶊嶋嶌嶍嶎嶏嶐嶑嶒嶓嶔嶕嶖嶗嶘嶚嶛嶜嶞嶟嶠", "嶡嶢嶣嶤嶥嶦嶧嶨嶩嶪嶫嶬嶭嶮嶯嶰嶱嶲嶳嶴嶵嶶嶸嶹嶺嶻嶼嶽嶾嶿巀巁巂巃巄巆巇巈巉巊巋巌巎巏巐巑巒巓巔巕巖巗巘巙巚巜巟巠巣巤巪巬巭巰巵巶巸巹巺巻巼巿帀帄帇帉帊帋帍帎帒帓帗帞帟帠帡帢帣帤帥帨帩帪師帬帯帰帲帳帴帵帶帹帺帾帿幀幁幃幆幇幈幉幊幋幍幎幏幐幑幒幓幖幗幘幙幚幜幝幟幠幣幤幥幦幧幨幩幪幫幬幭幮幯幰幱幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨庩庪庫庬庮庯庰庱庲庴庺庻庼庽庿廀廁廂廃廄廅", "廆廇廈廋廌廍廎廏廐廔廕廗廘廙廚廜廝廞廟廠廡廢廣廤廥廦廧廩廫廬廭廮廯廰廱廲廳廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤弨弫弬弮弰弲弳弴張弶強弸弻弽弾弿彁彂彃彄彅彆彇彈彉彊彋彌彍彎彏彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢徣徤徥徦徧復徫徬徯徰徱徲徳徴徶徸徹徺徻徾徿忀忁忂忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇", "怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰怱怲怳怴怶怷怸怹怺怽怾恀恄恅恆恇恈恉恊恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽悾悿惀惁惂惃惄惇惈惉惌惍惎惏惐惒惓惔惖惗惙惛惞惡惢惣惤惥惪惱惲惵惷惸惻惼惽惾惿愂愃愄愅愇愊愋愌愐愑愒愓愔愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬愭愮愯愰愱愲愳愴愵愶愷愸愹愺愻愼愽愾慀慁慂慃慄慅慆", "慇慉態慍慏慐慒慓慔慖慗慘慙慚慛慜慞慟慠慡慣慤慥慦慩慪慫慬慭慮慯慱慲慳慴慶慸慹慺慻慼慽慾慿憀憁憂憃憄憅憆憇憈憉憊憌憍憏憐憑憒憓憕憖憗憘憙憚憛憜憞憟憠憡憢憣憤憥憦憪憫憭憮憯憰憱憲憳憴憵憶憸憹憺憻憼憽憿懀懁懃懄懅懆懇應懌懍懎懏懐懓懕懖懗懘懙懚懛懜懝懞懟懠懡懢懣懤懥懧懨懩懪懫懬懭懮懯懰懱懲懳懴懶懷懸懹懺懻懼懽懾戀戁戂戃戄戅戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸戹戺戻戼扂扄扅扆扊", "扏扐払扖扗扙扚扜扝扞扟扠扡扢扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋抌抍抎抏抐抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳挴挵挶挷挸挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖捗捘捙捚捛捜捝捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙掚掛掜掝掞掟採掤掦掫掯掱掲掵掶掹掻掽掿揀", "揁揂揃揅揇揈揊揋揌揑揓揔揕揗揘揙揚換揜揝揟揢揤揥揦揧揨揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆搇搈搉搊損搎搑搒搕搖搗搘搙搚搝搟搢搣搤搥搧搨搩搫搮搯搰搱搲搳搵搶搷搸搹搻搼搾摀摂摃摉摋摌摍摎摏摐摑摓摕摖摗摙摚摛摜摝摟摠摡摢摣摤摥摦摨摪摫摬摮摯摰摱摲摳摴摵摶摷摻摼摽摾摿撀撁撃撆撈撉撊撋撌撍撎撏撐撓撔撗撘撚撛撜撝撟撠撡撢撣撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆擇擈擉擊擋擌擏擑擓擔擕擖擙據", "擛擜擝擟擠擡擣擥擧擨擩擪擫擬擭擮擯擰擱擲擳擴擵擶擷擸擹擺擻擼擽擾擿攁攂攃攄攅攆攇攈攊攋攌攍攎攏攐攑攓攔攕攖攗攙攚攛攜攝攞攟攠攡攢攣攤攦攧攨攩攪攬攭攰攱攲攳攷攺攼攽敀敁敂敃敄敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數敹敺敻敼敽敾敿斀斁斂斃斄斅斆斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱斲斳斴斵斶斷斸斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘旙旚旛旜旝旞旟旡旣旤旪旫", "旲旳旴旵旸旹旻旼旽旾旿昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷昸昹昺昻昽昿晀時晄晅晆晇晈晉晊晍晎晐晑晘晙晛晜晝晞晠晢晣晥晧晩晪晫晬晭晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘暙暚暛暜暞暟暠暡暢暣暤暥暦暩暪暫暬暭暯暰暱暲暳暵暶暷暸暺暻暼暽暿曀曁曂曃曄曅曆曇曈曉曊曋曌曍曎曏曐曑曒曓曔曕曖曗曘曚曞曟曠曡曢曣曤曥曧曨曪曫曬曭曮曯曱曵曶書曺曻曽朁朂會", "朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠朡朢朣朤朥朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗杘杙杚杛杝杢杣杤杦杧杫杬杮東杴杶杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹枺枻枼枽枾枿柀柂柅柆柇柈柉柊柋柌柍柎柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵柶柷柸柹柺査柼柾栁栂栃栄栆栍栐栒栔栕栘栙栚栛栜栞栟栠栢栣栤栥栦栧栨栫栬栭栮栯栰栱栴栵栶栺栻栿桇桋桍桏桒桖桗桘桙桚桛", "桜桝桞桟桪桬桭桮桯桰桱桲桳桵桸桹桺桻桼桽桾桿梀梂梄梇梈梉梊梋梌梍梎梐梑梒梔梕梖梘梙梚梛梜條梞梟梠梡梣梤梥梩梪梫梬梮梱梲梴梶梷梸梹梺梻梼梽梾梿棁棃棄棅棆棇棈棊棌棎棏棐棑棓棔棖棗棙棛棜棝棞棟棡棢棤棥棦棧棨棩棪棫棬棭棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆椇椈椉椊椌椏椑椓椔椕椖椗椘椙椚椛検椝椞椡椢椣椥椦椧椨椩椪椫椬椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃楄楅楆楇楈楉楊楋楌楍楎楏楐楑楒楓楕楖楘楙楛楜楟", "楡楢楤楥楧楨楩楪楬業楯楰楲楳楴極楶楺楻楽楾楿榁榃榅榊榋榌榎榏榐榑榒榓榖榗榙榚榝榞榟榠榡榢榣榤榥榦榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽榾榿槀槂槃槄槅槆槇槈槉構槍槏槑槒槓槕槖槗様槙槚槜槝槞槡槢槣槤槥槦槧槨槩槪槫槬槮槯槰槱槳槴槵槶槷槸槹槺槻槼槾樀樁樂樃樄樅樆樇樈樉樋樌樍樎樏樐樑樒樓樔樕樖標樚樛樜樝樞樠樢樣樤樥樦樧権樫樬樭樮樰樲樳樴樶樷樸樹樺樻樼樿橀橁橂橃橅橆橈橉橊橋橌橍橎橏橑橒橓橔橕橖橗橚", "橜橝橞機橠橢橣橤橦橧橨橩橪橫橬橭橮橯橰橲橳橴橵橶橷橸橺橻橽橾橿檁檂檃檅檆檇檈檉檊檋檌檍檏檒檓檔檕檖檘檙檚檛檜檝檞檟檡檢檣檤檥檦檧檨檪檭檮檯檰檱檲檳檴檵檶檷檸檹檺檻檼檽檾檿櫀櫁櫂櫃櫄櫅櫆櫇櫈櫉櫊櫋櫌櫍櫎櫏櫐櫑櫒櫓櫔櫕櫖櫗櫘櫙櫚櫛櫜櫝櫞櫟櫠櫡櫢櫣櫤櫥櫦櫧櫨櫩櫪櫫櫬櫭櫮櫯櫰櫱櫲櫳櫴櫵櫶櫷櫸櫹櫺櫻櫼櫽櫾櫿欀欁欂欃欄欅欆欇欈欉權欋欌欍欎欏欐欑欒欓欔欕欖欗欘欙欚欛欜欝欞欟欥欦欨欩欪欫欬欭欮", "欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍歎歏歐歑歒歓歔歕歖歗歘歚歛歜歝歞歟歠歡歨歩歫歬歭歮歯歰歱歲歳歴歵歶歷歸歺歽歾歿殀殅殈殌殎殏殐殑殔殕殗殘殙殜殝殞殟殠殢殣殤殥殦殧殨殩殫殬殭殮殯殰殱殲殶殸殹殺殻殼殽殾毀毃毄毆毇毈毉毊毌毎毐毑毘毚毜毝毞毟毠毢毣毤毥毦毧毨毩毬毭毮毰毱毲毴毶毷毸毺毻毼毾毿氀氁氂氃氄氈氉氊氋氌氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋汌汍汎汏汑汒汓汖汘", "汙汚汢汣汥汦汧汫汬汭汮汯汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟洠洡洢洣洤洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽浾浿涀涁涃涄涆涇涊涋涍涏涐涒涖涗涘涙涚涜涢涥涬涭涰涱涳涴涶涷涹涺涻涼涽涾淁淂淃淈淉淊", "淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽淾淿渀渁渂渃渄渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵渶渷渹渻渼渽渾渿湀湁湂湅湆湇湈湉湊湋湌湏湐湑湒湕湗湙湚湜湝湞湠湡湢湣湤湥湦湧湨湩湪湬湭湯湰湱湲湳湴湵湶湷湸湹湺湻湼湽満溁溂溄溇溈溊溋溌溍溎溑溒溓溔溕準溗溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪滫滬滭滮滯", "滰滱滲滳滵滶滷滸滺滻滼滽滾滿漀漁漃漄漅漇漈漊漋漌漍漎漐漑漒漖漗漘漙漚漛漜漝漞漟漡漢漣漥漦漧漨漬漮漰漲漴漵漷漸漹漺漻漼漽漿潀潁潂潃潄潅潈潉潊潌潎潏潐潑潒潓潔潕潖潗潙潚潛潝潟潠潡潣潤潥潧潨潩潪潫潬潯潰潱潳潵潶潷潹潻潽潾潿澀澁澂澃澅澆澇澊澋澏澐澑澒澓澔澕澖澗澘澙澚澛澝澞澟澠澢澣澤澥澦澨澩澪澫澬澭澮澯澰澱澲澴澵澷澸澺澻澼澽澾澿濁濃濄濅濆濇濈濊濋濌濍濎濏濐濓濔濕濖濗濘濙濚濛濜濝濟濢濣濤濥", "濦濧濨濩濪濫濬濭濰濱濲濳濴濵濶濷濸濹濺濻濼濽濾濿瀀瀁瀂瀃瀄瀅瀆瀇瀈瀉瀊瀋瀌瀍瀎瀏瀐瀒瀓瀔瀕瀖瀗瀘瀙瀜瀝瀞瀟瀠瀡瀢瀤瀥瀦瀧瀨瀩瀪瀫瀬瀭瀮瀯瀰瀱瀲瀳瀴瀶瀷瀸瀺瀻瀼瀽瀾瀿灀灁灂灃灄灅灆灇灈灉灊灋灍灎灐灑灒灓灔灕灖灗灘灙灚灛灜灝灟灠灡灢灣灤灥灦灧灨灩灪灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞炟炠炡炢炣炤炥炦炧炨炩炪炰炲炴炵炶為炾炿烄烅烆烇烉烋烌烍烎烏烐烑烒烓烔烕烖烗烚", "烜烝烞烠烡烢烣烥烪烮烰烱烲烳烴烵烶烸烺烻烼烾烿焀焁焂焃焄焅焆焇焈焋焌焍焎焏焑焒焔焗焛焜焝焞焟焠無焢焣焤焥焧焨焩焪焫焬焭焮焲焳焴焵焷焸焹焺焻焼焽焾焿煀煁煂煃煄煆煇煈煉煋煍煏煐煑煒煓煔煕煖煗煘煙煚煛煝煟煠煡煢煣煥煩煪煫煬煭煯煰煱煴煵煶煷煹煻煼煾煿熀熁熂熃熅熆熇熈熉熋熌熍熎熐熑熒熓熕熖熗熚熛熜熝熞熡熢熣熤熥熦熧熩熪熫熭熮熯熰熱熲熴熶熷熸熺熻熼熽熾熿燀燁燂燄燅燆燇燈燉燊燋燌燍燏燐燑燒燓", "燖燗燘燙燚燛燜燝燞營燡燢燣燤燦燨燩燪燫燬燭燯燰燱燲燳燴燵燶燷燸燺燻燼燽燾燿爀爁爂爃爄爅爇爈爉爊爋爌爍爎爏爐爑爒爓爔爕爖爗爘爙爚爛爜爞爟爠爡爢爣爤爥爦爧爩爫爭爮爯爲爳爴爺爼爾牀牁牂牃牄牅牆牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅犆犇犈犉犌犎犐犑犓犔犕犖犗犘犙犚犛犜犝犞犠犡犢犣犤犥犦犧犨犩犪犫犮犱犲犳犵犺犻犼犽犾犿狀狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛", "　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈〉《》「」『』〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓", "ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇①②③④⑤⑥⑦⑧⑨⑩€㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ", "　！＂＃￥％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝￣", "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをん", "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ", "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω︐︒︑︓︔︕︖︵︶︹︺︿﹀︽︾﹁﹂﹃﹄︗︘︻︼︷︸︱︙︳︴", "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя", "ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▓▔▕▼▽◢◣◤◥☉⊕〒〝〞āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑḿńňǹɡㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ", "〡〢〣〤〥〦〧〨〩㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤℡㈱‐ー゛゜ヽヾ〆ゝゞ﹉﹊﹋﹌﹍﹎﹏﹐﹑﹒﹔﹕﹖﹗﹙﹚﹛﹜﹝﹞﹟﹠﹡﹢﹣﹤﹥﹦﹨﹩﹪﹫〾⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻〇─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋", "狜狝狟狢狣狤狥狦狧狪狫狵狶狹狽狾狿猀猂猄猅猆猇猈猉猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀獁獂獃獄獅獆獇獈獉獊獋獌獎獏獑獓獔獕獖獘獙獚獛獜獝獞獟獡獢獣獤獥獦獧獨獩獪獫獮獰獱", "獲獳獴獵獶獷獸獹獺獻獼獽獿玀玁玂玃玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣玤玥玦玧玨玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃珄珅珆珇珋珌珎珒珓珔珕珖珗珘珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳珴珵珶珷", "珸珹珺珻珼珽現珿琀琁琂琄琇琈琋琌琍琎琑琒琓琔琕琖琗琘琙琜琝琞琟琠琡琣琤琧琩琫琭琯琱琲琷琸琹琺琻琽琾琿瑀瑂瑃瑄瑅瑆瑇瑈瑉瑊瑋瑌瑍瑎瑏瑐瑑瑒瑓瑔瑖瑘瑝瑠瑡瑢瑣瑤瑥瑦瑧瑨瑩瑪瑫瑬瑮瑯瑱瑲瑳瑴瑵瑸瑹瑺", "瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑璒璓璔璕璖璗璘璙璚璛璝璟璠璡璢璣璤璥璦璪璫璬璭璮璯環璱璲璳璴璵璶璷璸璹璻璼璽璾璿瓀瓁瓂瓃瓄瓅瓆瓇瓈瓉瓊瓋瓌瓍瓎瓏瓐瓑瓓瓔瓕瓖瓗瓘瓙瓚瓛瓝瓟瓡瓥瓧瓨瓩瓪瓫瓬瓭瓰瓱瓲", "瓳瓵瓸瓹瓺瓻瓼瓽瓾甀甁甂甃甅甆甇甈甉甊甋甌甎甐甒甔甕甖甗甛甝甞甠甡產産甤甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘畝畞畟畠畡畢畣畤畧畨畩畫畬畭畮畯異畱畳畵當畷畺畻畼畽畾疀疁疂疄疅疇", "疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦疧疨疩疪疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄", "癅癆癇癈癉癊癋癎癏癐癑癒癓癕癗癘癙癚癛癝癟癠癡癢癤癥癦癧癨癩癪癬癭癮癰癱癲癳癴癵癶癷癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛皜皝皞皟皠皡皢皣皥皦皧皨皩皪皫皬皭皯皰皳皵皶皷皸皹皺皻皼皽皾盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥", "盄盇盉盋盌盓盕盙盚盜盝盞盠盡盢監盤盦盧盨盩盪盫盬盭盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎眏眐眑眒眓眔眕眖眗眘眛眜眝眞眡眣眤眥眧眪眫眬眮眰眱眲眳眴眹眻眽眾眿睂睄睅睆睈睉睊睋睌睍睎睏睒睓睔睕睖睗睘睙睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳", "睝睞睟睠睤睧睩睪睭睮睯睰睱睲睳睴睵睶睷睸睺睻睼瞁瞂瞃瞆瞇瞈瞉瞊瞋瞏瞐瞓瞔瞕瞖瞗瞘瞙瞚瞛瞜瞝瞞瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶瞷瞸瞹瞺瞼瞾矀矁矂矃矄矅矆矇矈矉矊矋矌矎矏矐矑矒矓矔矕矖矘矙矚矝矞矟矠矡矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖", "矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃砄砅砆砇砈砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚硛硜硞硟硠硡硢硣硤硥硦硧硨硩硯硰硱硲硳硴硵硶硸硹硺硻硽硾硿碀碁碂碃场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚", "碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨碩碪碫碬碭碮碯碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚磛磜磝磞磟磠磡磢磣磤磥磦磧磩磪磫磭磮磯磰磱磳磵磶磸磹磻磼磽磾磿礀礂礃礄礆礇礈礉礊礋礌础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮", "礍礎礏礐礑礒礔礕礖礗礘礙礚礛礜礝礟礠礡礢礣礥礦礧礨礩礪礫礬礭礮礯礰礱礲礳礵礶礷礸礹礽礿祂祃祄祅祇祊祋祌祍祎祏祐祑祒祔祕祘祙祡祣祤祦祩祪祫祬祮祰祱祲祳祴祵祶祹祻祼祽祾祿禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠", "禓禔禕禖禗禘禙禛禜禝禞禟禠禡禢禣禤禥禦禨禩禪禫禬禭禮禯禰禱禲禴禵禶禷禸禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙秚秛秜秝秞秠秡秢秥秨秪秬秮秱秲秳秴秵秶秷秹秺秼秾秿稁稄稅稇稈稉稊稌稏稐稑稒稓稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二", "稝稟稡稢稤稥稦稧稨稩稪稫稬稭種稯稰稱稲稴稵稶稸稺稾穀穁穂穃穄穅穇穈穉穊穋穌積穎穏穐穒穓穔穕穖穘穙穚穛穜穝穞穟穠穡穢穣穤穥穦穧穨穩穪穫穬穭穮穯穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服", "窣窤窧窩窪窫窮窯窰窱窲窴窵窶窷窸窹窺窻窼窽窾竀竁竂竃竄竅竆竇竈竉竊竌竍竎竏竐竑竒竓竔竕竗竘竚竛竜竝竡竢竤竧竨竩竪竫竬竮竰竱竲竳竴竵競竷竸竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹", "笯笰笲笴笵笶笷笹笻笽笿筀筁筂筃筄筆筈筊筍筎筓筕筗筙筜筞筟筡筣筤筥筦筧筨筩筪筫筬筭筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆箇箈箉箊箋箌箎箏箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹箺箻箼箽箾箿節篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈", "篅篈築篊篋篍篎篏篐篒篔篕篖篗篘篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲篳篴篵篶篸篹篺篻篽篿簀簁簂簃簄簅簆簈簉簊簍簎簐簑簒簓簔簕簗簘簙簚簛簜簝簞簠簡簢簣簤簥簨簩簫簬簭簮簯簰簱簲簳簴簵簶簷簹簺簻簼簽簾籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖", "籃籄籅籆籇籈籉籊籋籌籎籏籐籑籒籓籔籕籖籗籘籙籚籛籜籝籞籟籠籡籢籣籤籥籦籧籨籩籪籫籬籭籮籯籰籱籲籵籶籷籸籹籺籾籿粀粁粂粃粄粅粆粇粈粊粋粌粍粎粏粐粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴粵粶粷粸粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕", "粿糀糂糃糄糆糉糋糎糏糐糑糒糓糔糘糚糛糝糞糡糢糣糤糥糦糧糩糪糫糬糭糮糰糱糲糳糴糵糶糷糹糺糼糽糾糿紀紁紂紃約紅紆紇紈紉紋紌納紎紏紐紑紒紓純紕紖紗紘紙級紛紜紝紞紟紡紣紤紥紦紨紩紪紬紭紮細紱紲紳紴紵紶肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件", "紷紸紹紺紻紼紽紾紿絀絁終絃組絅絆絇絈絉絊絋経絍絎絏結絑絒絓絔絕絖絗絘絙絚絛絜絝絞絟絠絡絢絣絤絥給絧絨絩絪絫絬絭絯絰統絲絳絴絵絶絸絹絺絻絼絽絾絿綀綁綂綃綄綅綆綇綈綉綊綋綌綍綎綏綐綑綒經綔綕綖綗綘健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸", "継続綛綜綝綞綟綠綡綢綣綤綥綧綨綩綪綫綬維綯綰綱網綳綴綵綶綷綸綹綺綻綼綽綾綿緀緁緂緃緄緅緆緇緈緉緊緋緌緍緎総緐緑緒緓緔緕緖緗緘緙線緛緜緝緞緟締緡緢緣緤緥緦緧編緩緪緫緬緭緮緯緰緱緲緳練緵緶緷緸緹緺尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻", "緻緼緽緾緿縀縁縂縃縄縅縆縇縈縉縊縋縌縍縎縏縐縑縒縓縔縕縖縗縘縙縚縛縜縝縞縟縠縡縢縣縤縥縦縧縨縩縪縫縬縭縮縯縰縱縲縳縴縵縶縷縸縹縺縼總績縿繀繂繃繄繅繆繈繉繊繋繌繍繎繏繐繑繒繓織繕繖繗繘繙繚繛繜繝俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀", "繞繟繠繡繢繣繤繥繦繧繨繩繪繫繬繭繮繯繰繱繲繳繴繵繶繷繸繹繺繻繼繽繾繿纀纁纃纄纅纆纇纈纉纊纋續纍纎纏纐纑纒纓纔纕纖纗纘纙纚纜纝纞纮纴纻纼绖绤绬绹缊缐缞缷缹缻缼缽缾缿罀罁罃罆罇罈罉罊罋罌罍罎罏罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐", "罖罙罛罜罝罞罠罣罤罥罦罧罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂羃羄羅羆羇羈羉羋羍羏羐羑羒羓羕羖羗羘羙羛羜羠羢羣羥羦羨義羪羫羬羭羮羱羳羴羵羶羷羺羻羾翀翂翃翄翆翇翈翉翋翍翏翐翑習翓翖翗翙翚翛翜翝翞翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿", "翤翧翨翪翫翬翭翯翲翴翵翶翷翸翹翺翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫耬耭耮耯耰耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗聙聛聜聝聞聟聠聡聢聣聤聥聦聧聨聫聬聭聮聯聰聲聳聴聵聶職聸聹聺聻聼聽隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫", "聾肁肂肅肈肊肍肎肏肐肑肒肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇胈胉胊胋胏胐胑胒胓胔胕胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋脌脕脗脙脛脜脝脟脠脡脢脣脤脥脦脧脨脩脪脫脭脮脰脳脴脵脷脹脺脻脼脽脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸", "腀腁腂腃腄腅腇腉腍腎腏腒腖腗腘腛腜腝腞腟腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃膄膅膆膇膉膋膌膍膎膐膒膓膔膕膖膗膙膚膞膟膠膡膢膤膥膧膩膫膬膭膮膯膰膱膲膴膵膶膷膸膹膼膽膾膿臄臅臇臈臉臋臍臎臏臐臑臒臓摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁", "臔臕臖臗臘臙臚臛臜臝臞臟臠臡臢臤臥臦臨臩臫臮臯臰臱臲臵臶臷臸臹臺臽臿舃與興舉舊舋舎舏舑舓舕舖舗舘舙舚舝舠舤舥舦舧舩舮舲舺舼舽舿艀艁艂艃艅艆艈艊艌艍艎艐艑艒艓艔艕艖艗艙艛艜艝艞艠艡艢艣艤艥艦艧艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗", "艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸苺苼苽苾苿茀茊茋茍茐茒茓茖茘茙茝茞茟茠茡茢茣茤茥茦茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐", "茾茿荁荂荄荅荈荊荋荌荍荎荓荕荖荗荘荙荝荢荰荱荲荳荴荵荶荹荺荾荿莀莁莂莃莄莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡莢莣莤莥莦莧莬莭莮莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠", "菮華菳菴菵菶菷菺菻菼菾菿萀萂萅萇萈萉萊萐萒萓萔萕萖萗萙萚萛萞萟萠萡萢萣萩萪萫萬萭萮萯萰萲萳萴萵萶萷萹萺萻萾萿葀葁葂葃葄葅葇葈葉葊葋葌葍葎葏葐葒葓葔葕葖葘葝葞葟葠葢葤葥葦葧葨葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁", "葽葾葿蒀蒁蒃蒄蒅蒆蒊蒍蒏蒐蒑蒒蒓蒔蒕蒖蒘蒚蒛蒝蒞蒟蒠蒢蒣蒤蒥蒦蒧蒨蒩蒪蒫蒬蒭蒮蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗蓘蓙蓚蓛蓜蓞蓡蓢蓤蓧蓨蓩蓪蓫蓭蓮蓯蓱蓲蓳蓴蓵蓶蓷蓸蓹蓺蓻蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳", "蔃蔄蔅蔆蔇蔈蔉蔊蔋蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢蔣蔤蔥蔦蔧蔨蔩蔪蔭蔮蔯蔰蔱蔲蔳蔴蔵蔶蔾蔿蕀蕁蕂蕄蕅蕆蕇蕋蕌蕍蕎蕏蕐蕑蕒蕓蕔蕕蕗蕘蕚蕛蕜蕝蕟蕠蕡蕢蕣蕥蕦蕧蕩蕪蕫蕬蕭蕮蕯蕰蕱蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱", "薂薃薆薈薉薊薋薌薍薎薐薑薒薓薔薕薖薗薘薙薚薝薞薟薠薡薢薣薥薦薧薩薫薬薭薱薲薳薴薵薶薸薺薻薼薽薾薿藀藂藃藄藅藆藇藈藊藋藌藍藎藑藒藔藖藗藘藙藚藛藝藞藟藠藡藢藣藥藦藧藨藪藫藬藭藮藯藰藱藲藳藴藵藶藷藸恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔", "藹藺藼藽藾蘀蘁蘂蘃蘄蘆蘇蘈蘉蘊蘋蘌蘍蘎蘏蘐蘒蘓蘔蘕蘗蘘蘙蘚蘛蘜蘝蘞蘟蘠蘡蘢蘣蘤蘥蘦蘨蘪蘫蘬蘭蘮蘯蘰蘱蘲蘳蘴蘵蘶蘷蘹蘺蘻蘽蘾蘿虀虁虂虃虄虅虆虇虈虉虊虋虌虒虓處虖虗虘虙虛虜虝號虠虡虣虤虥虦虧虨虩虪獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃", "虭虯虰虲虳虴虵虶虷虸蚃蚄蚅蚆蚇蚈蚉蚎蚏蚐蚑蚒蚔蚖蚗蚘蚙蚚蚛蚞蚟蚠蚡蚢蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻蚼蚽蚾蚿蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威", "蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀蝁蝂蝃蝄蝅蝆蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚蝛蝜蝝蝞蝟蝡蝢蝦蝧蝨蝩蝪蝫蝬蝭蝯蝱蝲蝳蝵蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎螏螐螑螒螔螕螖螘螙螚螛螜螝螞螠螡螢螣螤巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺", "螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁蟂蟃蟄蟅蟇蟈蟉蟌蟍蟎蟏蟐蟔蟕蟖蟗蟘蟙蟚蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯蟰蟱蟲蟳蟴蟵蟶蟷蟸蟺蟻蟼蟽蟿蠀蠁蠂蠄蠅蠆蠇蠈蠉蠋蠌蠍蠎蠏蠐蠑蠒蠔蠗蠘蠙蠚蠜蠝蠞蠟蠠蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓", "蠤蠥蠦蠧蠨蠩蠪蠫蠬蠭蠮蠯蠰蠱蠳蠴蠵蠶蠷蠸蠺蠻蠽蠾蠿衁衂衃衆衇衈衉衊衋衎衏衐衑衒術衕衖衘衚衛衜衝衞衟衠衦衧衪衭衯衱衳衴衵衶衸衹衺衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗袘袙袚袛袝袞袟袠袡袣袥袦袧袨袩袪小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄", "袬袮袯袰袲袳袴袵袶袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚裛補裝裞裠裡裦裧裩裪裫裬裭裮裯裲裵裶裷裺裻製裿褀褁褃褄褅褆複褈褉褋褌褍褎褏褑褔褕褖褗褘褜褝褞褟褠褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶", "褸褹褺褻褼褽褾褿襀襂襃襅襆襇襈襉襊襋襌襍襎襏襐襑襒襓襔襕襖襗襘襙襚襛襜襝襠襡襢襣襤襥襧襨襩襪襫襬襭襮襯襰襱襲襳襴襵襶襷襸襹襺襼襽襾覀覂覄覅覇覈覉覊見覌覍覎規覐覑覒覓覔覕視覗覘覙覚覛覜覝覞覟覠覡摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐", "覢覣覤覥覦覧覨覩親覫覬覭覮覯覰覱覲観覴覵覶覷覸覹覺覻覼覽覾覿觀觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴觵觶觷觸觹觺觻觼觽觾觿訁訂訃訄訅訆計訉訊訋訌訍討訏訐訑訒訓訔訕訖託記訙訚訛訜訝印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉", "訞訟訠訡訢訣訤訥訦訧訨訩訪訫訬設訮訯訰許訲訳訴訵訶訷訸訹診註証訽訿詀詁詂詃詄詅詆詇詉詊詋詌詍詎詏詐詑詒詓詔評詖詗詘詙詚詛詜詝詞詟詠詡詢詣詤詥試詧詨詩詪詫詬詭詮詯詰話該詳詴詵詶詷詸詺詻詼詽詾詿誀浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧", "誁誂誃誄誅誆誇誈誋誌認誎誏誐誑誒誔誕誖誗誘誙誚誛誜誝語誟誠誡誢誣誤誥誦誧誨誩說誫説読誮誯誰誱課誳誴誵誶誷誸誹誺誻誼誽誾調諀諁諂諃諄諅諆談諈諉諊請諌諍諎諏諐諑諒諓諔諕論諗諘諙諚諛諜諝諞諟諠諡諢諣铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政", "諤諥諦諧諨諩諪諫諬諭諮諯諰諱諲諳諴諵諶諷諸諹諺諻諼諽諾諿謀謁謂謃謄謅謆謈謉謊謋謌謍謎謏謐謑謒謓謔謕謖謗謘謙謚講謜謝謞謟謠謡謢謣謤謥謧謨謩謪謫謬謭謮謯謰謱謲謳謴謵謶謷謸謹謺謻謼謽謾謿譀譁譂譃譄譅帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑", "譆譇譈證譊譋譌譍譎譏譐譑譒譓譔譕譖譗識譙譚譛譜譝譞譟譠譡譢譣譤譥譧譨譩譪譫譭譮譯議譱譲譳譴譵譶護譸譹譺譻譼譽譾譿讀讁讂讃讄讅讆讇讈讉變讋讌讍讎讏讐讑讒讓讔讕讖讗讘讙讚讛讜讝讞讟讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座", "谸谹谺谻谼谽谾谿豀豂豃豄豅豈豊豋豍豎豏豐豑豒豓豔豖豗豘豙豛豜豝豞豟豠豣豤豥豦豧豨豩豬豭豮豯豰豱豲豴豵豶豷豻豼豽豾豿貀貁貃貄貆貇貈貋貍貎貏貐貑貒貓貕貖貗貙貚貛貜貝貞貟負財貢貣貤貥貦貧貨販貪貫責貭亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝", "貮貯貰貱貲貳貴貵貶買貸貹貺費貼貽貾貿賀賁賂賃賄賅賆資賈賉賊賋賌賍賎賏賐賑賒賓賔賕賖賗賘賙賚賛賜賝賞賟賠賡賢賣賤賥賦賧賨賩質賫賬賭賮賯賰賱賲賳賴賵賶賷賸賹賺賻購賽賾賿贀贁贂贃贄贅贆贇贈贉贊贋贌贍佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼", "贎贏贐贑贒贓贔贕贖贗贘贙贚贛贜贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸赹赺赻赼赽赾赿趀趂趃趆趇趈趉趌趍趎趏趐趒趓趕趖趗趘趙趚趛趜趝趞趠趡趢趤趥趦趧趨趩趪趫趬趭趮趯趰趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺", "跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾跿踀踁踂踃踄踆踇踈踋踍踎踐踑踒踓踕踖踗踘踙踚踛踜踠踡踤踥踦踧踨踫踭踰踲踳踴踶踷踸踻踼踾踿蹃蹅蹆蹌蹍蹎蹏蹐蹓蹔蹕蹖蹗蹘蹚蹛蹜蹝蹞蹟蹠蹡蹢蹣蹤蹥蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝", "蹳蹵蹷蹸蹹蹺蹻蹽蹾躀躂躃躄躆躈躉躊躋躌躍躎躑躒躓躕躖躗躘躙躚躛躝躟躠躡躢躣躤躥躦躧躨躩躪躭躮躰躱躳躴躵躶躷躸躹躻躼躽躾躿軀軁軂軃軄軅軆軇軈軉車軋軌軍軏軐軑軒軓軔軕軖軗軘軙軚軛軜軝軞軟軠軡転軣軤堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥", "軥軦軧軨軩軪軫軬軭軮軯軰軱軲軳軴軵軶軷軸軹軺軻軼軽軾軿輀輁輂較輄輅輆輇輈載輊輋輌輍輎輏輐輑輒輓輔輕輖輗輘輙輚輛輜輝輞輟輠輡輢輣輤輥輦輧輨輩輪輫輬輭輮輯輰輱輲輳輴輵輶輷輸輹輺輻輼輽輾輿轀轁轂轃轄荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺", "轅轆轇轈轉轊轋轌轍轎轏轐轑轒轓轔轕轖轗轘轙轚轛轜轝轞轟轠轡轢轣轤轥轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆迉迊迋迌迍迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖", "這逜連逤逥逧逨逩逪逫逬逰週進逳逴逷逹逺逽逿遀遃遅遆遈遉遊運遌過達違遖遙遚遜遝遞遟遠遡遤遦遧適遪遫遬遯遰遱遲遳遶遷選遹遺遻遼遾邁還邅邆邇邉邊邌邍邎邏邐邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼", "郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅鄆鄇鄈鄉鄊鄋鄌鄍鄎鄏鄐鄑鄒鄓鄔鄕鄖鄗鄘鄚鄛鄜鄝鄟鄠鄡鄤鄥鄦鄧鄨鄩鄪鄫鄬鄭鄮鄰鄲鄳鄴鄵鄶鄷鄸鄺鄻鄼鄽鄾鄿酀酁酂酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼", "酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀醁醂醃醄醆醈醊醎醏醓醔醕醖醗醘醙醜醝醞醟醠醡醤醥醦醧醨醩醫醬醰醱醲醳醶醷醸醹醻醼醽醾醿釀釁釂釃釄釅釆釈釋釐釒釓釔釕釖釗釘釙釚釛針釞釟釠釡釢釣釤釥帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺", "釦釧釨釩釪釫釬釭釮釯釰釱釲釳釴釵釶釷釸釹釺釻釼釽釾釿鈀鈁鈂鈃鈄鈅鈆鈇鈈鈉鈊鈋鈌鈍鈎鈏鈐鈑鈒鈓鈔鈕鈖鈗鈘鈙鈚鈛鈜鈝鈞鈟鈠鈡鈢鈣鈤鈥鈦鈧鈨鈩鈪鈫鈬鈭鈮鈯鈰鈱鈲鈳鈴鈵鈶鈷鈸鈹鈺鈻鈼鈽鈾鈿鉀鉁鉂鉃鉄鉅狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧饨饩饪饫饬饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂", "鉆鉇鉈鉉鉊鉋鉌鉍鉎鉏鉐鉑鉒鉓鉔鉕鉖鉗鉘鉙鉚鉛鉜鉝鉞鉟鉠鉡鉢鉣鉤鉥鉦鉧鉨鉩鉪鉫鉬鉭鉮鉯鉰鉱鉲鉳鉵鉶鉷鉸鉹鉺鉻鉼鉽鉾鉿銀銁銂銃銄銅銆銇銈銉銊銋銌銍銏銐銑銒銓銔銕銖銗銘銙銚銛銜銝銞銟銠銡銢銣銤銥銦銧恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾", "銨銩銪銫銬銭銯銰銱銲銳銴銵銶銷銸銹銺銻銼銽銾銿鋀鋁鋂鋃鋄鋅鋆鋇鋉鋊鋋鋌鋍鋎鋏鋐鋑鋒鋓鋔鋕鋖鋗鋘鋙鋚鋛鋜鋝鋞鋟鋠鋡鋢鋣鋤鋥鋦鋧鋨鋩鋪鋫鋬鋭鋮鋯鋰鋱鋲鋳鋴鋵鋶鋷鋸鋹鋺鋻鋼鋽鋾鋿錀錁錂錃錄錅錆錇錈錉洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑", "錊錋錌錍錎錏錐錑錒錓錔錕錖錗錘錙錚錛錜錝錞錟錠錡錢錣錤錥錦錧錨錩錪錫錬錭錮錯錰錱録錳錴錵錶錷錸錹錺錻錼錽錿鍀鍁鍂鍃鍄鍅鍆鍇鍈鍉鍊鍋鍌鍍鍎鍏鍐鍑鍒鍓鍔鍕鍖鍗鍘鍙鍚鍛鍜鍝鍞鍟鍠鍡鍢鍣鍤鍥鍦鍧鍨鍩鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣", "鍬鍭鍮鍯鍰鍱鍲鍳鍴鍵鍶鍷鍸鍹鍺鍻鍼鍽鍾鍿鎀鎁鎂鎃鎄鎅鎆鎇鎈鎉鎊鎋鎌鎍鎎鎐鎑鎒鎓鎔鎕鎖鎗鎘鎙鎚鎛鎜鎝鎞鎟鎠鎡鎢鎣鎤鎥鎦鎧鎨鎩鎪鎫鎬鎭鎮鎯鎰鎱鎲鎳鎴鎵鎶鎷鎸鎹鎺鎻鎼鎽鎾鎿鏀鏁鏂鏃鏄鏅鏆鏇鏈鏉鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩", "鏎鏏鏐鏑鏒鏓鏔鏕鏗鏘鏙鏚鏛鏜鏝鏞鏟鏠鏡鏢鏣鏤鏥鏦鏧鏨鏩鏪鏫鏬鏭鏮鏯鏰鏱鏲鏳鏴鏵鏶鏷鏸鏹鏺鏻鏼鏽鏾鏿鐀鐁鐂鐃鐄鐅鐆鐇鐈鐉鐊鐋鐌鐍鐎鐏鐐鐑鐒鐓鐔鐕鐖鐗鐘鐙鐚鐛鐜鐝鐞鐟鐠鐡鐢鐣鐤鐥鐦鐧鐨鐩鐪鐫鐬鐭鐮纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡缢缣缤缥缦缧缪缫缬缭缯缰缱缲缳缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬", "鐯鐰鐱鐲鐳鐴鐵鐶鐷鐸鐹鐺鐻鐼鐽鐿鑀鑁鑂鑃鑄鑅鑆鑇鑈鑉鑊鑋鑌鑍鑎鑏鑐鑑鑒鑓鑔鑕鑖鑗鑘鑙鑚鑛鑜鑝鑞鑟鑠鑡鑢鑣鑤鑥鑦鑧鑨鑩鑪鑬鑭鑮鑯鑰鑱鑲鑳鑴鑵鑶鑷鑸鑹鑺鑻鑼鑽鑾鑿钀钁钂钃钄钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹", "锧锳锽镃镈镋镕镚镠镮镴镵長镸镹镺镻镼镽镾門閁閂閃閄閅閆閇閈閉閊開閌閍閎閏閐閑閒間閔閕閖閗閘閙閚閛閜閝閞閟閠閡関閣閤閥閦閧閨閩閪閫閬閭閮閯閰閱閲閳閴閵閶閷閸閹閺閻閼閽閾閿闀闁闂闃闄闅闆闇闈闉闊闋椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋", "闌闍闎闏闐闑闒闓闔闕闖闗闘闙闚闛關闝闞闟闠闡闢闣闤闥闦闧闬闿阇阓阘阛阞阠阣阤阥阦阧阨阩阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗陘陙陚陜陝陞陠陣陥陦陫陭陮陯陰陱陳陸陹険陻陼陽陾陿隀隁隂隃隄隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰", "隌階隑隒隓隕隖隚際隝隞隟隠隡隢隣隤隥隦隨隩險隫隬隭隮隯隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖雗雘雙雚雛雜雝雞雟雡離難雤雥雦雧雫雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗霘霙霚霛霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻", "霡霢霣霤霥霦霧霨霩霫霬霮霯霱霳霴霵霶霷霺霻霼霽霿靀靁靂靃靄靅靆靇靈靉靊靋靌靍靎靏靐靑靔靕靗靘靚靜靝靟靣靤靦靧靨靪靫靬靭靮靯靰靱靲靵靷靸靹靺靻靽靾靿鞀鞁鞂鞃鞄鞆鞇鞈鞉鞊鞌鞎鞏鞐鞓鞕鞖鞗鞙鞚鞛鞜鞝臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐", "鞞鞟鞡鞢鞤鞥鞦鞧鞨鞩鞪鞬鞮鞰鞱鞳鞵鞶鞷鞸鞹鞺鞻鞼鞽鞾鞿韀韁韂韃韄韅韆韇韈韉韊韋韌韍韎韏韐韑韒韓韔韕韖韗韘韙韚韛韜韝韞韟韠韡韢韣韤韥韨韮韯韰韱韲韴韷韸韹韺韻韼韽韾響頀頁頂頃頄項順頇須頉頊頋頌頍頎怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨", "頏預頑頒頓頔頕頖頗領頙頚頛頜頝頞頟頠頡頢頣頤頥頦頧頨頩頪頫頬頭頮頯頰頱頲頳頴頵頶頷頸頹頺頻頼頽頾頿顀顁顂顃顄顅顆顇顈顉顊顋題額顎顏顐顑顒顓顔顕顖顗願顙顚顛顜顝類顟顠顡顢顣顤顥顦顧顨顩顪顫顬顭顮睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶钷钸钹钺钼钽钿铄铈铉铊铋铌铍铎铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪", "顯顰顱顲顳顴颋颎颒颕颙颣風颩颪颫颬颭颮颯颰颱颲颳颴颵颶颷颸颹颺颻颼颽颾颿飀飁飂飃飄飅飆飇飈飉飊飋飌飍飏飐飔飖飗飛飜飝飠飡飢飣飤飥飦飩飪飫飬飭飮飯飰飱飲飳飴飵飶飷飸飹飺飻飼飽飾飿餀餁餂餃餄餅餆餇铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒锓锔锕锖锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤镥镦镧镨镩镪镫镬镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔", "餈餉養餋餌餎餏餑餒餓餔餕餖餗餘餙餚餛餜餝餞餟餠餡餢餣餤餥餦餧館餩餪餫餬餭餯餰餱餲餳餴餵餶餷餸餹餺餻餼餽餾餿饀饁饂饃饄饅饆饇饈饉饊饋饌饍饎饏饐饑饒饓饖饗饘饙饚饛饜饝饞饟饠饡饢饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨鸩鸪鸫鸬鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦鹧鹨鹩鹪鹫鹬鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙", "馌馎馚馛馜馝馞馟馠馡馢馣馤馦馧馩馪馫馬馭馮馯馰馱馲馳馴馵馶馷馸馹馺馻馼馽馾馿駀駁駂駃駄駅駆駇駈駉駊駋駌駍駎駏駐駑駒駓駔駕駖駗駘駙駚駛駜駝駞駟駠駡駢駣駤駥駦駧駨駩駪駫駬駭駮駯駰駱駲駳駴駵駶駷駸駹瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃", "駺駻駼駽駾駿騀騁騂騃騄騅騆騇騈騉騊騋騌騍騎騏騐騑騒験騔騕騖騗騘騙騚騛騜騝騞騟騠騡騢騣騤騥騦騧騨騩騪騫騬騭騮騯騰騱騲騳騴騵騶騷騸騹騺騻騼騽騾騿驀驁驂驃驄驅驆驇驈驉驊驋驌驍驎驏驐驑驒驓驔驕驖驗驘驙颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒", "驚驛驜驝驞驟驠驡驢驣驤驥驦驧驨驩驪驫驲骃骉骍骎骔骕骙骦骩骪骫骬骭骮骯骲骳骴骵骹骻骽骾骿髃髄髆髇髈髉髊髍髎髏髐髒體髕髖髗髙髚髛髜髝髞髠髢髣髤髥髧髨髩髪髬髮髰髱髲髳髴髵髶髷髸髺髼髽髾髿鬀鬁鬂鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋", "鬇鬉鬊鬋鬌鬍鬎鬐鬑鬒鬔鬕鬖鬗鬘鬙鬚鬛鬜鬝鬞鬠鬡鬢鬤鬥鬦鬧鬨鬩鬪鬫鬬鬭鬮鬰鬱鬳鬴鬵鬶鬷鬸鬹鬺鬽鬾鬿魀魆魊魋魌魎魐魒魓魕魖魗魘魙魚魛魜魝魞魟魠魡魢魣魤魥魦魧魨魩魪魫魬魭魮魯魰魱魲魳魴魵魶魷魸魹魺魻簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤", "魼魽魾魿鮀鮁鮂鮃鮄鮅鮆鮇鮈鮉鮊鮋鮌鮍鮎鮏鮐鮑鮒鮓鮔鮕鮖鮗鮘鮙鮚鮛鮜鮝鮞鮟鮠鮡鮢鮣鮤鮥鮦鮧鮨鮩鮪鮫鮬鮭鮮鮯鮰鮱鮲鮳鮴鮵鮶鮷鮸鮹鮺鮻鮼鮽鮾鮿鯀鯁鯂鯃鯄鯅鯆鯇鯈鯉鯊鯋鯌鯍鯎鯏鯐鯑鯒鯓鯔鯕鯖鯗鯘鯙鯚鯛酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜", "鯜鯝鯞鯟鯠鯡鯢鯣鯤鯥鯦鯧鯨鯩鯪鯫鯬鯭鯮鯯鯰鯱鯲鯳鯴鯵鯶鯷鯸鯹鯺鯻鯼鯽鯾鯿鰀鰁鰂鰃鰄鰅鰆鰇鰈鰉鰊鰋鰌鰍鰎鰏鰐鰑鰒鰓鰔鰕鰖鰗鰘鰙鰚鰛鰜鰝鰞鰟鰠鰡鰢鰣鰤鰥鰦鰧鰨鰩鰪鰫鰬鰭鰮鰯鰰鰱鰲鰳鰴鰵鰶鰷鰸鰹鰺鰻觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅龆龇龈龉龊龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞鲟鲠鲡鲢鲣鲥鲦鲧鲨鲩鲫鲭鲮鲰鲱鲲鲳鲴鲵鲶鲷鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋", "鰼鰽鰾鰿鱀鱁鱂鱃鱄鱅鱆鱇鱈鱉鱊鱋鱌鱍鱎鱏鱐鱑鱒鱓鱔鱕鱖鱗鱘鱙鱚鱛鱜鱝鱞鱟鱠鱡鱢鱣鱤鱥鱦鱧鱨鱩鱪鱫鱬鱭鱮鱯鱰鱱鱲鱳鱴鱵鱶鱷鱸鱹鱺鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾鲿鳀鳁鳂鳈鳉鳑鳒鳚鳛鳠鳡鳌鳍鳎鳏鳐鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄", "鳣鳤鳥鳦鳧鳨鳩鳪鳫鳬鳭鳮鳯鳰鳱鳲鳳鳴鳵鳶鳷鳸鳹鳺鳻鳼鳽鳾鳿鴀鴁鴂鴃鴄鴅鴆鴇鴈鴉鴊鴋鴌鴍鴎鴏鴐鴑鴒鴓鴔鴕鴖鴗鴘鴙鴚鴛鴜鴝鴞鴟鴠鴡鴢鴣鴤鴥鴦鴧鴨鴩鴪鴫鴬鴭鴮鴯鴰鴱鴲鴳鴴鴵鴶鴷鴸鴹鴺鴻鴼鴽鴾鴿鵀鵁鵂", "鵃鵄鵅鵆鵇鵈鵉鵊鵋鵌鵍鵎鵏鵐鵑鵒鵓鵔鵕鵖鵗鵘鵙鵚鵛鵜鵝鵞鵟鵠鵡鵢鵣鵤鵥鵦鵧鵨鵩鵪鵫鵬鵭鵮鵯鵰鵱鵲鵳鵴鵵鵶鵷鵸鵹鵺鵻鵼鵽鵾鵿鶀鶁鶂鶃鶄鶅鶆鶇鶈鶉鶊鶋鶌鶍鶎鶏鶐鶑鶒鶓鶔鶕鶖鶗鶘鶙鶚鶛鶜鶝鶞鶟鶠鶡鶢", "鶣鶤鶥鶦鶧鶨鶩鶪鶫鶬鶭鶮鶯鶰鶱鶲鶳鶴鶵鶶鶷鶸鶹鶺鶻鶼鶽鶾鶿鷀鷁鷂鷃鷄鷅鷆鷇鷈鷉鷊鷋鷌鷍鷎鷏鷐鷑鷒鷓鷔鷕鷖鷗鷘鷙鷚鷛鷜鷝鷞鷟鷠鷡鷢鷣鷤鷥鷦鷧鷨鷩鷪鷫鷬鷭鷮鷯鷰鷱鷲鷳鷴鷵鷶鷷鷸鷹鷺鷻鷼鷽鷾鷿鸀鸁鸂", "鸃鸄鸅鸆鸇鸈鸉鸊鸋鸌鸍鸎鸏鸐鸑鸒鸓鸔鸕鸖鸗鸘鸙鸚鸛鸜鸝鸞鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴鹵鹶鹷鹸鹹鹺鹻鹼鹽麀麁麃麄麅麆麉麊麌麍麎麏麐麑麔麕麖麗麘麙麚麛麜麞麠麡麢麣麤麥麧麨麩麪", "麫麬麭麮麯麰麱麲麳麵麶麷麹麺麼麿黀黁黂黃黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰黱黲黳黴黵黶黷黸黺黽黿鼀鼁鼂鼃鼄鼅鼆鼇鼈鼉鼊鼌鼏鼑鼒鼔鼕鼖鼘鼚鼛鼜鼝鼞鼟鼡鼣鼤鼥鼦鼧鼨鼩鼪鼫鼭鼮鼰鼱", "鼲鼳鼴鼵鼶鼸鼺鼼鼿齀齁齂齃齅齆齇齈齉齊齋齌齍齎齏齒齓齔齕齖齗齘齙齚齛齜齝齞齟齠齡齢齣齤齥齦齧齨齩齪齫齬齭齮齯齰齱齲齳齴齵齶齷齸齹齺齻齼齽齾龁龂龍龎龏龐龑龒龓龔龕龖龗龘龜龝龞龡龢龣龤龥郎凉秊裏隣", "兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩⺁⺄㑳㑇⺈⺋龴㖞㘚㘎⺌⺗㥮㤘龵㧏㧟㩳㧐龶龷㭎㱮㳠⺧龸⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌龹䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶龺䲣䲟䲠䲡䱷䲢䴓䴔䴕䴖䴗䴘䴙䶮龻"];
  const _M0MP27mik1e806dxfkit4Vec34zeroN6recordS5777 = new _M0TP27mik1e806dxfkit4Vec3(0, 0, 0);
  const _M0MP27mik1e806dxfkit4Vec24zeroN6recordS5791 = new _M0TP27mik1e806dxfkit4Vec2(0, 0);
  const _M0MP27mik1e806dxfkit5Aabb25emptyN6recordS5792 = new _M0TP27mik1e806dxfkit4Vec2(1e+308, 1e+308);
  const _M0MP27mik1e806dxfkit5Aabb25emptyN6recordS5793 = new _M0TP27mik1e806dxfkit4Vec2(-1e+308, -1e+308);
  const _M0MP27mik1e806dxfkit5Aabb25emptyN6recordS5794 = new _M0TP27mik1e806dxfkit5Aabb2(_M0MP27mik1e806dxfkit5Aabb25emptyN6recordS5792, _M0MP27mik1e806dxfkit5Aabb25emptyN6recordS5793);
  const _M0FP27mik1e806dxfkit17expansion__limitsN6recordS5804 = new _M0TP27mik1e806dxfkit12ExpandLimits(10000, 200000, 100000);
  const _M0MP27mik1e806dxfkit10ReadLimits7defaultN6recordS5840 = new _M0TP27mik1e806dxfkit10ReadLimits(67108864, 1048576, 1000000, 200000, 1000, 1048576);
  const _M0MP27mik1e806dxfkit14GeometryBudget7defaultN6recordS5854 = new _M0TP27mik1e806dxfkit14GeometryBudget(1000000);
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5730 = { _0: 60, _1: 79 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5731 = { _0: 170, _1: 179 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5732 = { _0: 270, _1: 289 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5733 = { _0: 370, _1: 389 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5734 = { _0: 400, _1: 409 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5735 = { _0: 1060, _1: 1070 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5736 = { _0: 90, _1: 99 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5737 = { _0: 420, _1: 429 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5738 = { _0: 440, _1: 459 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5739 = { _0: 1071, _1: 1071 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5740 = { _0: 160, _1: 169 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5741 = { _0: 10, _1: 59 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5742 = { _0: 110, _1: 149 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5743 = { _0: 210, _1: 239 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5744 = { _0: 460, _1: 469 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5745 = { _0: 1010, _1: 1059 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5746 = { _0: 290, _1: 299 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5747 = { _0: 310, _1: 319 };
  const _M0FP27mik1e806dxfkit10code__typeN5tupleS5748 = { _0: 1004, _1: 1004 };
  const _M0FPC28internal7strconv17check__underscoreN25_2atransition__table__222S230 = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 0, 1, 2, 5];
  const _M0FPC28internal7strconv15parse__inf__nanN25_2atransition__table__304S312 = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 3, 4, 14, 14, 14, 14, 14, 14, 14, 7, 14, 14, 14, 14, 5, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 6, 14, 14, 14, 0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 8, 14, 14, 14, 14, 14, 1, 14, 14, 9, 14, 14, 14, 14, 14, 14, 14, 14, 10, 14, 14, 14, 14, 14, 14, 11, 14, 14, 14, 14, 14, 14, 14, 14, 14, 12, 14, 14, 14, 14, 14, 14, 14, 14, 13, 14, 1, 14, 14, 14, 14, 14, 14, 14];
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5841 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("数值字段包含非 ASCII 字节或 NUL");
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5842 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("不是有效整数或超出32位范围");
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5843 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("数值超出16位范围");
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5844 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("不是有效浮点数");
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5845 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("数值必须有限");
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5846 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("不是有效64位整数");
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5847 = new _M0DTP27mik1e806dxfkit8TagValue4Bool(false);
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5848 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(_M0FP27mik1e806dxfkit12parse__valueN6constrS5847);
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5849 = new _M0DTP27mik1e806dxfkit8TagValue4Bool(true);
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5850 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(_M0FP27mik1e806dxfkit12parse__valueN6constrS5849);
  const _M0FP27mik1e806dxfkit12parse__valueN6constrS5851 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("布尔数值必须为0或1");
  const _M0MP27mik1e806dxfkit9TagStream13consume__lineN6constrS5852 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("UTF-8 字节序列无效");
  const _M0MP27mik1e806dxfkit9TagStream13consume__lineN6constrS5853 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE3Err("自定义代码页解码未完成；按Latin-1降级");
  const _M0FPB4seed = _M0FPB12random__seed();
  const _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einnerN6recordS5855 = new _M0TP27mik1e806dxfkit7Finding("参数", 2, "容差必须是正的有限数字，最小净距必须是非负有限数字");
  const _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einnerN6recordS5856 = new _M0TP27mik1e806dxfkit7Finding("检查覆盖", 1, "几何数值或预览资源超出安全范围；XY检查与SVG未完成");
  const _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einnerN6recordS5857 = new _M0TP27mik1e806dxfkit7Finding("检查覆盖", 1, "没有可检查的二维轮廓；空文件、文字或未支持实体不能作为检查通过的依据");
  const _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einnerN6recordS5858 = new _M0TP27mik1e806dxfkit7Finding("检查覆盖", 1, "几何候选对达到资源上限；后续拓扑/相交/净距检查未完成");
  const _M0MP27mik1e806dxfkit6Record11try__doubleN6constrS5805 = new _M0DTPC16result6ResultGOdsE3Err("数值非有限");
  const _M0MP27mik1e806dxfkit3Ocs15from__extrusionN6constrS5729 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit3OcssE3Err("OCS 挤出方向必须是有限非零向量");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5749 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("离散容差必须是正的有限数字");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5750 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条次数、控制点数或节点数无效（次数上限32，控制点上限4096）");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5751 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条权重数必须为零或等于控制点数");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5752 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条节点必须有限且不递减");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5753 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条没有非空参数域");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5754 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条参数域数值范围过大");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5755 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条需要正的有限权重");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5756 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条需要有限坐标与正的有限权重");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5757 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("节点重复次数超过次数加一");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5758 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("内部重节点使样条断裂，不能连接为单条折线");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5759 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条离散超过深度或点数上限，或遇到数值溢出；未满足指定容差");
  const _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5760 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("样条没有可离散的节点区间");
  const _M0FP27mik1e806dxfkit24ellipse__points__checkedN6constrS5761 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("椭圆需要有限参数、正容差；短长轴比必须大于0且不超过1");
  const _M0FP27mik1e806dxfkit24ellipse__points__checkedN6constrS5762 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("椭圆长轴的 XY 投影长度为零");
  const _M0FP27mik1e806dxfkit24ellipse__points__checkedN6constrS5763 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("椭圆参数跨度超出一周");
  const _M0FP27mik1e806dxfkit24ellipse__points__checkedN6constrS5764 = new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err("椭圆离散超过65536点上限");
  const _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5765 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("离散容差必须是正的有限数字");
  const _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5766 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("圆离散需要超过4096段，或半径非有限；未满足指定容差");
  const _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5767 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("圆弧参数必须有限");
  const _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5768 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("圆弧离散超过4096段上限；未满足指定容差");
  const _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5769 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("多段线 bulge 必须有限");
  const _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5770 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("多段线圆弧超出数值或4096段上限；未满足指定容差");
  const _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5771 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("离散结果含非有限坐标或字高");
  const _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5772 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("离散容差必须是正的有限数字");
  const _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5773 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("SOLID/TRACE 非零厚度未处理，已跳过轮廓");
  const _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5774 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("SOLID/TRACE 需要三个或四个完整角点");
  const _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5775 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("SOLID/TRACE 角点必须有限");
  const _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5776 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("SOLID/TRACE 面不平行于 XY 平面，已跳过轮廓");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5778 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("数值字段类型错误；不能用默认零生成几何");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5779 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("非零厚度未重建；原记录保留，轮廓未检查");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5780 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("离散容差必须是正的有限数字");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5781 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("变换后坐标非有限");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5782 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("变换后坐标非有限");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5783 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("变换后坐标非有限");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5784 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("二维多段线包含不一致的顶点 Z；原记录保留");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5785 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("非 R12 椭圆的空间平面未离散；原记录保留");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5786 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("非 R12 空间样条未离散；原记录保留");
  const _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5787 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err("变换后坐标或字高非有限");
  const _M0FP27mik1e806dxfkit13world__to__xyN6constrS5788 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("已转换 WCS，但轮廓不在 Z=0 的 XY 检查平面");
  const _M0FP27mik1e806dxfkit13world__to__xyN6constrS5789 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("点不在 XY 检查平面");
  const _M0FP27mik1e806dxfkit13world__to__xyN6constrS5790 = new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err("文字插入点不在 XY 检查平面");
  const _M0FP27mik1e806dxfkit12layer__stateN5tupleS5806 = { _0: "#808080", _1: "" };
  const _M0FP27mik1e806dxfkit12layer__stateN5tupleS5807 = { _0: "#808080", _1: "" };
  const _M0MP27mik1e806dxfkit9SvgWriter6resultN6constrS5808 = new _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE3Err(1);
  const _M0MP27mik1e806dxfkit7Drawing11render__svgN6constrS5809 = new _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE3Err(1);
  const _M0MP27mik1e806dxfkit7Drawing11render__svgN6constrS5810 = new _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE3Err(0);
  const _M0MP27mik1e806dxfkit7Drawing11render__svgN6constrS5811 = new _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE3Err(0);
  const _M0FP27mik1e806dxfkit15group__sectionsN6constrS5839 = "HEADER";
  const _M0FP37mik1e806dxfkit3web6decodeN6constrS57 = new _M0DTPC16result6ResultGzsE3Err("文件超过64 MiB读取上限");
  const _M0FP37mik1e806dxfkit3web6decodeN6constrS58 = new _M0DTPC16result6ResultGzsE3Err("没有收到文件内容");
  const _M0FP37mik1e806dxfkit3web6decodeN6constrS59 = new _M0DTPC16result6ResultGzsE3Err("文件内容解码失败，可能上传时出错了");
  function _M0FPB13consume4__acc(acc, input) {
    const _p = (acc >>> 0) + ((Math.imul(input, -1028477379) | 0) >>> 0) | 0;
    const _p$2 = 17;
    return Math.imul(_p << _p$2 | (_p >>> (32 - _p$2 | 0) | 0), 668265263) | 0;
  }
  function _M0MPC15array10FixedArray12unsafe__blitGyE(dst, dst_offset, src, src_offset, len) {
    if (dst === src && dst_offset < src_offset) {
      let _tmp = 0;
      while (true) {
        const i = _tmp;
        if (i < len) {
          const _tmp$2 = dst_offset + i | 0;
          const _tmp$3 = src_offset + i | 0;
          if (_tmp$2 >>> 0 < dst.length) {
            dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
          } else {
            $oob();
          }
          _tmp = i + 1 | 0;
          continue;
        } else {
          return;
        }
      }
    } else {
      let _tmp = len - 1 | 0;
      while (true) {
        const i = _tmp;
        if (i >= 0) {
          const _tmp$2 = dst_offset + i | 0;
          const _tmp$3 = src_offset + i | 0;
          if (_tmp$2 >>> 0 < dst.length) {
            dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
          } else {
            $oob();
          }
          _tmp = i - 1 | 0;
          continue;
        } else {
          return;
        }
      }
    }
  }
  function _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGyEE(dst, dst_offset, src, src_offset, len) {
    if (dst === src && dst_offset < src_offset) {
      let _tmp = 0;
      while (true) {
        const i = _tmp;
        if (i < len) {
          const _tmp$2 = dst_offset + i | 0;
          const _tmp$3 = src_offset + i | 0;
          if (_tmp$2 >>> 0 < dst.length) {
            dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
          } else {
            $oob();
          }
          _tmp = i + 1 | 0;
          continue;
        } else {
          return;
        }
      }
    } else {
      let _tmp = len - 1 | 0;
      while (true) {
        const i = _tmp;
        if (i >= 0) {
          const _tmp$2 = dst_offset + i | 0;
          const _tmp$3 = src_offset + i | 0;
          if (_tmp$2 >>> 0 < dst.length) {
            dst[_tmp$2] = _tmp$3 >>> 0 < src.length ? src[_tmp$3] : $oob();
          } else {
            $oob();
          }
          _tmp = i - 1 | 0;
          continue;
        } else {
          return;
        }
      }
    }
  }
  function _M0MPB18UninitializedArray12unsafe__blitGyE(dst, dst_offset, src, src_offset, len) {
    _M0MPC15array10FixedArray12unsafe__blitGRPB17UnsafeMaybeUninitGyEE(dst, dst_offset, src, src_offset, len);
  }
  function _M0MPB18UninitializedArray23unsafe__make__and__blitGyE(src, allocate_len, src_offset, dst_offset, blit_len) {
    const dst = new Uint8Array(allocate_len);
    _M0MPB18UninitializedArray12unsafe__blitGyE(dst, dst_offset, src, src_offset, blit_len);
    return dst;
  }
  function _M0MPB13StringBuilder13write__objectGsE(self, obj) {
    _M0IP016_24default__implPB4Show6outputGsE(obj, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
  }
  function _M0MPB13StringBuilder13write__objectGdE(self, obj) {
    _M0IP016_24default__implPB4Show6outputGdE(obj, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
  }
  function _M0MPB13StringBuilder13write__objectGiE(self, obj) {
    _M0IP016_24default__implPB4Show6outputGiE(obj, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
  }
  function _M0MPB13StringBuilder21StringBuilder_2einner(size_hint) {
    return new _M0TPB13StringBuilder("");
  }
  function _M0IPB13StringBuilderPB6Logger11write__char(self, ch) {
    self.val = `${self.val}${String.fromCodePoint(ch)}`;
  }
  function _M0IPB13StringBuilderPB6Logger13write__string(self, str) {
    self.val = `${self.val}${str}`;
  }
  function _M0FPB32code__point__of__surrogate__pair(leading, trailing) {
    return (((Math.imul(leading - 55296 | 0, 1024) | 0) + trailing | 0) - 56320 | 0) + 65536 | 0;
  }
  function _M0MPC16string6String16unsafe__char__at(self, index) {
    const c1 = self.charCodeAt(index);
    if (c1 >= 55296 && c1 <= 56319) {
      const c2 = self.charCodeAt(index + 1 | 0);
      return _M0FPB32code__point__of__surrogate__pair(c1, c2);
    } else {
      return c1;
    }
  }
  function _M0MPC14byte4Byte7to__hexN14to__hex__digitS4038(i) {
    if (i < 10) {
      const _p = 48;
      const _p$2 = (i + _p | 0) & 255;
      return _p$2;
    } else {
      const _p = 97;
      const _p$2 = (i + _p | 0) & 255;
      const _p$3 = 10;
      const _p$4 = (_p$2 - _p$3 | 0) & 255;
      return _p$4;
    }
  }
  function _M0MPC14byte4Byte7to__hex(b) {
    const _self = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    const _p = 16;
    _M0IPB13StringBuilderPB6Logger11write__char(_self, _M0MPC14byte4Byte7to__hexN14to__hex__digitS4038((b / _p | 0) & 255));
    const _p$2 = 16;
    _M0IPB13StringBuilderPB6Logger11write__char(_self, _M0MPC14byte4Byte7to__hexN14to__hex__digitS4038((b % _p$2 | 0) & 255));
    const _p$3 = _self;
    return _p$3.val;
  }
  function _M0MPC16string10StringView12view_2einner(self, start_offset, end_offset) {
    let end_offset$2;
    if (end_offset === undefined) {
      end_offset$2 = self.end - self.start | 0;
    } else {
      const _Some = end_offset;
      end_offset$2 = _Some;
    }
    if (start_offset >= 0 && (start_offset <= end_offset$2 && end_offset$2 <= (self.end - self.start | 0))) {
      return new _M0TPC16string10StringView(self.str, self.start + start_offset | 0, self.start + end_offset$2 | 0);
    } else {
      return $panic();
    }
  }
  function _M0IP016_24default__implPB2Eq10not__equalGRPC16string10StringViewE(x, y) {
    return !_M0IPC16string10StringViewPB2Eq5equal(x, y);
  }
  function _M0IP016_24default__implPB7Compare6op__geGsE(x, y) {
    return _M0IPC16string6StringPB7Compare7compare(x, y) >= 0;
  }
  function _M0FPB14avalanche__acc(acc) {
    let acc$2 = acc;
    acc$2 = acc$2 ^ (acc$2 >>> 15 | 0);
    acc$2 = Math.imul(acc$2, -2048144777) | 0;
    acc$2 = acc$2 ^ (acc$2 >>> 13 | 0);
    acc$2 = Math.imul(acc$2, -1028477379) | 0;
    acc$2 = acc$2 ^ (acc$2 >>> 16 | 0);
    return acc$2;
  }
  function _M0FPB13finalize__acc(acc) {
    return _M0FPB14avalanche__acc(acc);
  }
  function _M0IP016_24default__implPB6Logger28write__string__interpolationGRPB13StringBuilderE(self, show) {
    show.method_table.method_0(show.self, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
  }
  function _M0IP016_24default__implPB6Logger5writeGRPB13StringBuilderE(self, show) {
    show.method_table.method_0(show.self, { self: self, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
  }
  function _M0MPC16string6String21clamped__view_2einner(self, start, end) {
    const len = self.length;
    let lo = start < 0 ? 0 : start > len ? len : start;
    let hi;
    if (end === undefined) {
      hi = len;
    } else {
      const _Some = end;
      const _e = _Some;
      hi = _e < 0 ? 0 : _e > len ? len : _e;
    }
    let _tmp;
    if (lo > 0) {
      let _tmp$2;
      if (lo < len) {
        let _tmp$3;
        const _p = self.charCodeAt(lo);
        if (_p >= 56320 && _p <= 57343) {
          const _p$2 = self.charCodeAt(lo - 1 | 0);
          _tmp$3 = _p$2 >= 55296 && _p$2 <= 56319;
        } else {
          _tmp$3 = false;
        }
        _tmp$2 = _tmp$3;
      } else {
        _tmp$2 = false;
      }
      _tmp = _tmp$2;
    } else {
      _tmp = false;
    }
    if (_tmp) {
      lo = lo + 1 | 0;
    }
    let _tmp$2;
    if (hi > 0) {
      let _tmp$3;
      if (hi < len) {
        let _tmp$4;
        const _p = self.charCodeAt(hi);
        if (_p >= 56320 && _p <= 57343) {
          const _p$2 = self.charCodeAt(hi - 1 | 0);
          _tmp$4 = _p$2 >= 55296 && _p$2 <= 56319;
        } else {
          _tmp$4 = false;
        }
        _tmp$3 = _tmp$4;
      } else {
        _tmp$3 = false;
      }
      _tmp$2 = _tmp$3;
    } else {
      _tmp$2 = false;
    }
    if (_tmp$2) {
      hi = hi - 1 | 0;
    }
    return lo >= hi ? new _M0TPC16string10StringView(self, lo, lo) : new _M0TPC16string10StringView(self, lo, hi);
  }
  function _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE(self, value, start, len) {
    _M0IPB13StringBuilderPB6Logger11write__view(self, _M0MPC16string6String21clamped__view_2einner(value, start, start + len | 0));
  }
  function _M0IP016_24default__implPB4Show6outputGsE(self, logger) {
    logger.method_table.method_0(logger.self, self);
  }
  function _M0IP016_24default__implPB4Show6outputGdE(self, logger) {
    logger.method_table.method_0(logger.self, _M0IPC16double6DoublePB4Show10to__string(self));
  }
  function _M0IP016_24default__implPB4Show6outputGiE(self, logger) {
    logger.method_table.method_0(logger.self, _M0IPC13int3IntPB4Show10to__string(self));
  }
  function _M0MPB4Iter4nextGUsRPB4JsonEE(self) {
    const _func = self.f;
    const result = _func();
    const _bind = self.size_hint;
    if (result === undefined) {
      self.size_hint = _M0MPB4Iter4nextN6constrS9910GUsRPB4JsonEE;
    } else {
      if (_bind === undefined) {
      } else {
        const _Some = _bind;
        const _n = _Some;
        self.size_hint = _n > 0 ? _n - 1 | 0 : _M0MPB4Iter4nextN6constrS9909GUsRPB4JsonEE;
      }
    }
    return result;
  }
  function _M0MPB4Iter4nextGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self) {
    const _func = self.f;
    const result = _func();
    const _bind = self.size_hint;
    if (result.$tag === 1) {
      if (_bind === undefined) {
      } else {
        const _Some = _bind;
        const _n = _Some;
        self.size_hint = _n > 0 ? _n - 1 | 0 : _M0MPB4Iter4nextN6constrS9909GRPB5ArrayGRP27mik1e806dxfkit4Vec2EE;
      }
    } else {
      self.size_hint = _M0MPB4Iter4nextN6constrS9910GRPB5ArrayGRP27mik1e806dxfkit4Vec2EE;
    }
    return result;
  }
  function _M0MPC13int3Int18to__string_2einner(self, radix) {
    return _M0FPB19int__to__string__js(self, radix);
  }
  function _M0MPB4Iter3newGUsRPB4JsonEE(f, size_hint) {
    let size_hint$2;
    if (size_hint === undefined) {
      size_hint$2 = undefined;
    } else {
      const _Some = size_hint;
      const _n = _Some;
      size_hint$2 = _n > 0 ? _n : _M0MPB4Iter3newN6constrS9917GUsRPB4JsonEE;
    }
    return new _M0TPB4IterGUsRPB4JsonEE(f, size_hint$2);
  }
  function _M0MPB4Iter3newGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(f, size_hint) {
    let size_hint$2;
    if (size_hint === undefined) {
      size_hint$2 = undefined;
    } else {
      const _Some = size_hint;
      const _n = _Some;
      size_hint$2 = _n > 0 ? _n : _M0MPB4Iter3newN6constrS9917GRPB5ArrayGRP27mik1e806dxfkit4Vec2EE;
    }
    return new _M0TPB4IterGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(f, size_hint$2);
  }
  function _M0MPC15array10FixedArray21clamped__view_2einnerGkE(self, start, end) {
    const len = self.length;
    const lo = start < 0 ? 0 : start > len ? len : start;
    let hi;
    if (end === undefined) {
      hi = len;
    } else {
      const _Some = end;
      const _end = _Some;
      hi = _end < 0 ? 0 : _end > len ? len : _end;
    }
    const count = hi > lo ? hi - lo | 0 : 0;
    const _bind = self;
    return new _M0TPB9ArrayViewGkE(_bind, lo, lo + count | 0);
  }
  function _M0MPC15array10FixedArray21clamped__view_2einnerGyE(self, start, end) {
    const len = self.length;
    const lo = start < 0 ? 0 : start > len ? len : start;
    let hi;
    if (end === undefined) {
      hi = len;
    } else {
      const _Some = end;
      const _end = _Some;
      hi = _end < 0 ? 0 : _end > len ? len : _end;
    }
    const count = hi > lo ? hi - lo | 0 : 0;
    const _bind = self;
    return new _M0TPB9ArrayViewGyE(_bind, lo, lo + count | 0);
  }
  function _M0MPC16string10StringView11code__units(self) {
    const _p = self.str.length;
    let _tmp;
    if (_p <= 0) {
      _tmp = [];
    } else {
      const _p$2 = 0;
      const _p$3 = $make_array_len_and_init(_p, self.str.charCodeAt(_p$2));
      let _tmp$2 = 1;
      while (true) {
        const _p$4 = _tmp$2;
        if (_p$4 < _p) {
          if (_p$4 >>> 0 < _p$3.length) {
            _p$3[_p$4] = self.str.charCodeAt(_p$4);
          } else {
            $oob();
          }
          _tmp$2 = _p$4 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = _p$3;
    }
    return _M0MPC15array10FixedArray21clamped__view_2einnerGkE(_tmp, self.start, self.end);
  }
  function _M0MPC16string10StringView9to__owned(self) {
    return self.str.substring(self.start, self.end);
  }
  function _M0MPC16string6String20unsafe__range__equal(self, self_off, other, other_off, len) {
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < len) {
        const _p = self.charCodeAt(self_off + i | 0);
        const _p$2 = other.charCodeAt(other_off + i | 0);
        if (_p === _p$2) {
        } else {
          return false;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return true;
  }
  function _M0IPC16string10StringViewPB2Eq5equal(self, other) {
    const len = self.end - self.start | 0;
    if (len === (other.end - other.start | 0)) {
      if (self.str === other.str && self.start === other.start) {
        return true;
      }
      return _M0MPC16string6String20unsafe__range__equal(self.str, self.start, other.str, other.start, len);
    } else {
      return false;
    }
  }
  function _M0MPC16string6String24char__length__ge_2einner(self, len, start_offset, end_offset) {
    let end_offset$2;
    if (end_offset === undefined) {
      end_offset$2 = self.length;
    } else {
      const _Some = end_offset;
      end_offset$2 = _Some;
    }
    let _tmp = start_offset;
    let _tmp$2 = 0;
    while (true) {
      const index = _tmp;
      const count = _tmp$2;
      if (index < end_offset$2 && count < len) {
        const c1 = self.charCodeAt(index);
        if (c1 >= 55296 && c1 <= 56319 && (index + 1 | 0) < end_offset$2) {
          const c2 = self.charCodeAt(index + 1 | 0);
          if (c2 >= 56320 && c2 <= 57343) {
            _tmp = index + 2 | 0;
            _tmp$2 = count + 1 | 0;
            continue;
          } else {
            $panic();
          }
        }
        _tmp = index + 1 | 0;
        _tmp$2 = count + 1 | 0;
        continue;
      } else {
        return count >= len;
      }
    }
  }
  function _M0MPC16string6String31offset__of__nth__char__backward(self, n, start_offset, end_offset) {
    let _tmp = end_offset;
    let _tmp$2 = 0;
    while (true) {
      const utf16_offset = _tmp;
      const char_count = _tmp$2;
      if ((utf16_offset - 1 | 0) >= start_offset && char_count < n) {
        const c = self.charCodeAt(utf16_offset - 1 | 0);
        if (c >= 56320 && c <= 57343) {
          _tmp = utf16_offset - 2 | 0;
          _tmp$2 = char_count + 1 | 0;
          continue;
        } else {
          _tmp = utf16_offset - 1 | 0;
          _tmp$2 = char_count + 1 | 0;
          continue;
        }
      } else {
        return char_count < n || utf16_offset < start_offset ? undefined : utf16_offset;
      }
    }
  }
  function _M0MPC16string6String30offset__of__nth__char__forward(self, n, start_offset, end_offset) {
    if (start_offset >= 0 && start_offset <= end_offset) {
      let _tmp = start_offset;
      let _tmp$2 = 0;
      while (true) {
        const utf16_offset = _tmp;
        const char_count = _tmp$2;
        if (utf16_offset < end_offset && char_count < n) {
          const c = self.charCodeAt(utf16_offset);
          if (c >= 55296 && c <= 56319) {
            _tmp = utf16_offset + 2 | 0;
            _tmp$2 = char_count + 1 | 0;
            continue;
          } else {
            _tmp = utf16_offset + 1 | 0;
            _tmp$2 = char_count + 1 | 0;
            continue;
          }
        } else {
          return char_count < n || utf16_offset >= end_offset ? undefined : utf16_offset;
        }
      }
    } else {
      return $panic();
    }
  }
  function _M0MPC16string6String29offset__of__nth__char_2einner(self, i, start_offset, end_offset) {
    let end_offset$2;
    if (end_offset === undefined) {
      end_offset$2 = self.length;
    } else {
      const _Some = end_offset;
      end_offset$2 = _Some;
    }
    return i >= 0 ? _M0MPC16string6String30offset__of__nth__char__forward(self, i, start_offset, end_offset$2) : _M0MPC16string6String31offset__of__nth__char__backward(self, -i | 0, start_offset, end_offset$2);
  }
  function _M0MPC16string6String12view_2einner(self, start_offset, end_offset) {
    let end_offset$2;
    if (end_offset === undefined) {
      end_offset$2 = self.length;
    } else {
      const _Some = end_offset;
      end_offset$2 = _Some;
    }
    if (start_offset >= 0 && (start_offset <= end_offset$2 && end_offset$2 <= self.length)) {
      return new _M0TPC16string10StringView(self, start_offset, end_offset$2);
    } else {
      return $panic();
    }
  }
  function _M0IPB13StringBuilderPB6Logger11write__view(self, str) {
    self.val = `${self.val}${_M0MPC16string10StringView9to__owned(str)}`;
  }
  function _M0MPC16string6String6repeat(self, n) {
    if (n < 0) {
      return $panic();
    } else {
      if (n === 0) {
        return "";
      } else {
        if (n === 1) {
          return self;
        } else {
          const len = self.length;
          const total = Math.imul(len, n) | 0;
          if (len === 0 || (total / n | 0) === len) {
            const buf = _M0MPB13StringBuilder21StringBuilder_2einner(total);
            const str = self;
            let _tmp = 0;
            while (true) {
              const _ = _tmp;
              if (_ < n) {
                _M0IPB13StringBuilderPB6Logger13write__string(buf, str);
                _tmp = _ + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            return buf.val;
          } else {
            return $panic();
          }
        }
      }
    }
  }
  function _M0MPC16string6String8find__by(self, pred) {
    const _p = new _M0TPC16string10StringView(self, 0, self.length);
    const _p$2 = _p.str;
    const _p$3 = _p.start;
    const _p$4 = _p.end;
    let _tmp = _p$3;
    let _tmp$2 = 0;
    while (true) {
      const _p$5 = _tmp;
      const _p$6 = _tmp$2;
      if (_p$5 < _p$4) {
        let _p$7;
        let _p$8;
        _L: {
          const _p$9 = _p$2.charCodeAt(_p$5);
          if (_p$9 >= 55296 && _p$9 <= 56319 && (_p$5 + 1 | 0) < _p$4) {
            const _p$10 = _p$2.charCodeAt(_p$5 + 1 | 0);
            if (_p$10 >= 56320 && _p$10 <= 57343) {
              const _tmp$3 = _p$5 + 2 | 0;
              const _p$11 = (((Math.imul(_p$9 - 55296 | 0, 1024) | 0) + _p$10 | 0) - 56320 | 0) + 65536 | 0;
              _p$7 = _tmp$3;
              _p$8 = _p$11;
              break _L;
            } else {
              const _tmp$3 = _p$5 + 1 | 0;
              const _p$11 = _p$9;
              _p$7 = _tmp$3;
              _p$8 = _p$11;
              break _L;
            }
          } else {
            const _tmp$3 = _p$5 + 1 | 0;
            const _p$10 = _p$9;
            _p$7 = _tmp$3;
            _p$8 = _p$10;
            break _L;
          }
        }
        if (pred(_p$8)) {
          return _p$6;
        }
        _tmp = _p$7;
        const _p$9 = _p$8;
        _tmp$2 = _p$6 + (_p$9 <= 65535 ? 1 : 2) | 0;
        continue;
      } else {
        return undefined;
      }
    }
  }
  function _M0MPC16string10StringView11has__prefix(self, str) {
    const str_len = str.end - str.start | 0;
    if (str_len <= (self.end - self.start | 0)) {
      let _tmp;
      if (str_len === 0) {
        _tmp = true;
      } else {
        const _p = self.str.charCodeAt(self.start);
        const _p$2 = str.str.charCodeAt(str.start);
        _tmp = _p === _p$2;
      }
      if (_tmp) {
        return _M0MPC16string6String20unsafe__range__equal(self.str, self.start, str.str, str.start, str_len);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function _M0MPC16string6String11has__prefix(self, str) {
    return _M0MPC16string10StringView11has__prefix(new _M0TPC16string10StringView(self, 0, self.length), str);
  }
  function _M0MPC15array5Array4pushGRPC14json10WriteFrameE(self, value) {
    _M0MPB7JSArray4push(self, value);
  }
  function _M0MPC15array5Array4pushGyE(self, value) {
    _M0MPB7JSArray4push(self, value);
  }
  function _M0MPC15array5Array4pushGRPB5ArrayGRP27mik1e806dxfkit3TagEE(self, value) {
    _M0MPB7JSArray4push(self, value);
  }
  function _M0MPC15array5Array4pushGdE(self, value) {
    _M0MPB7JSArray4push(self, value);
  }
  function _M0FPB36string__contains__code__unit__scalar(str, start, end, code) {
    let _tmp = start;
    while (true) {
      const i = _tmp;
      if (i < end) {
        const _p = str.charCodeAt(i);
        if (_p === code) {
          return true;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return false;
  }
  function _M0FPB28string__contains__code__unit(str, start, end, code) {
    return _M0FPB36string__contains__code__unit__scalar(str, start, end, code);
  }
  function _M0MPC16string10StringView20contains__code__unit(self, code) {
    return _M0FPB28string__contains__code__unit(self.str, self.start, self.end, code);
  }
  function _M0MPC14char4Char20is__ascii__lowercase(self) {
    return self >= 97 && self <= 122;
  }
  function _M0MPC16string6String9to__upper(self) {
    const _bind = _M0MPC16string6String8find__by(self, (c) => _M0MPC14char4Char20is__ascii__lowercase(c));
    if (_bind === undefined) {
      return self;
    } else {
      const _Some = _bind;
      const _idx = _Some;
      const buf = _M0MPB13StringBuilder21StringBuilder_2einner(self.length);
      const head = _M0MPC16string6String12view_2einner(self, 0, _idx);
      _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE(buf, head.str, head.start, head.end - head.start | 0);
      const _bind$2 = _M0MPC16string6String12view_2einner(self, _idx, undefined);
      const _bind$3 = _bind$2.str;
      const _bind$4 = _bind$2.start;
      const _bind$5 = _bind$2.end;
      let _tmp = _bind$4;
      while (true) {
        const _string_index = _tmp;
        if (_string_index < _bind$5) {
          let _decoded_next_string_index;
          let _decoded_char;
          _L: {
            const _bind$6 = _bind$3.charCodeAt(_string_index);
            if (_bind$6 >= 55296 && _bind$6 <= 56319 && (_string_index + 1 | 0) < _bind$5) {
              const _bind$7 = _bind$3.charCodeAt(_string_index + 1 | 0);
              if (_bind$7 >= 56320 && _bind$7 <= 57343) {
                const _tmp$2 = _string_index + 2 | 0;
                const _p = (((Math.imul(_bind$6 - 55296 | 0, 1024) | 0) + _bind$7 | 0) - 56320 | 0) + 65536 | 0;
                _decoded_next_string_index = _tmp$2;
                _decoded_char = _p;
                break _L;
              } else {
                const _tmp$2 = _string_index + 1 | 0;
                const _p = _bind$6;
                _decoded_next_string_index = _tmp$2;
                _decoded_char = _p;
                break _L;
              }
            } else {
              const _tmp$2 = _string_index + 1 | 0;
              const _p = _bind$6;
              _decoded_next_string_index = _tmp$2;
              _decoded_char = _p;
              break _L;
            }
          }
          if (_M0MPC14char4Char20is__ascii__lowercase(_decoded_char)) {
            _M0IPB13StringBuilderPB6Logger11write__char(buf, _decoded_char - 32 | 0);
          } else {
            _M0IPB13StringBuilderPB6Logger11write__char(buf, _decoded_char);
          }
          _tmp = _decoded_next_string_index;
          continue;
        } else {
          break;
        }
      }
      return buf.val;
    }
  }
  function _M0IPC16string6StringPB12ToStringView16to__string__view(self) {
    return new _M0TPC16string10StringView(self, 0, self.length);
  }
  function _M0IPC16string6StringPB7Compare7compare(self, other) {
    const len = self.length;
    const _bind = $compare_int(len, other.length);
    if (_bind === 0) {
      let _tmp = 0;
      while (true) {
        const i = _tmp;
        if (i < len) {
          const _p = self.charCodeAt(i);
          const _p$2 = other.charCodeAt(i);
          const order = $compare_int(_p, _p$2);
          if (order !== 0) {
            return order;
          }
          _tmp = i + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      return 0;
    } else {
      return _bind;
    }
  }
  function _M0IPC13int3IntPB4Show10to__string(self) {
    return _M0MPC13int3Int18to__string_2einner(self, 10);
  }
  function _M0MPC15array9ArrayView21clamped__view_2einnerGkE(self, start, end) {
    const len = self.end - self.start | 0;
    const lo = start < 0 ? 0 : start > len ? len : start;
    let hi;
    if (end === undefined) {
      hi = len;
    } else {
      const _Some = end;
      const _end = _Some;
      hi = _end < 0 ? 0 : _end > len ? len : _end;
    }
    const count = hi > lo ? hi - lo | 0 : 0;
    const _bind = self.buf;
    const _bind$2 = self.start + lo | 0;
    return new _M0TPB9ArrayViewGkE(_bind, _bind$2, _bind$2 + count | 0);
  }
  function _M0MPC15array9ArrayView21clamped__view_2einnerGRP27mik1e806dxfkit6RecordE(self, start, end) {
    const len = self.end - self.start | 0;
    const lo = start < 0 ? 0 : start > len ? len : start;
    let hi;
    if (end === undefined) {
      hi = len;
    } else {
      const _Some = end;
      const _end = _Some;
      hi = _end < 0 ? 0 : _end > len ? len : _end;
    }
    const count = hi > lo ? hi - lo | 0 : 0;
    const _bind = self.buf;
    const _bind$2 = self.start + lo | 0;
    return new _M0TPB9ArrayViewGRP27mik1e806dxfkit6RecordE(_bind, _bind$2, _bind$2 + count | 0);
  }
  function _M0MPC15array9ArrayView4joinGsE(self, separator) {
    if ((self.end - self.start | 0) === 0) {
      return "";
    } else {
      const _hd = self.buf[self.start];
      const _x_buf = self.buf;
      const _x_start = 1 + self.start | 0;
      const _x_end = self.end;
      const hd = _M0IPC16string6StringPB12ToStringView16to__string__view(_hd);
      const _bind = _x_end - _x_start | 0;
      let size_hint;
      let _tmp = 0;
      let _tmp$2 = hd.end - hd.start | 0;
      while (true) {
        const _ = _tmp;
        const size_hint$2 = _tmp$2;
        if (_ < _bind) {
          const s = _x_buf[_x_start + _ | 0];
          _tmp = _ + 1 | 0;
          const _bind$2 = _M0IPC16string6StringPB12ToStringView16to__string__view(s);
          _tmp$2 = (size_hint$2 + (_bind$2.end - _bind$2.start | 0) | 0) + (separator.end - separator.start | 0) | 0;
          continue;
        } else {
          size_hint = size_hint$2;
          break;
        }
      }
      const size_hint$2 = size_hint << 1;
      const buf = _M0MPB13StringBuilder21StringBuilder_2einner(size_hint$2);
      _M0IPB13StringBuilderPB6Logger11write__view(buf, hd);
      if ((separator.end - separator.start | 0) === 0) {
        const _bind$2 = _x_end - _x_start | 0;
        let _tmp$3 = 0;
        while (true) {
          const _ = _tmp$3;
          if (_ < _bind$2) {
            const s = _x_buf[_x_start + _ | 0];
            const s$2 = _M0IPC16string6StringPB12ToStringView16to__string__view(s);
            _M0IPB13StringBuilderPB6Logger11write__view(buf, s$2);
            _tmp$3 = _ + 1 | 0;
            continue;
          } else {
            break;
          }
        }
      } else {
        const _bind$2 = _x_end - _x_start | 0;
        let _tmp$3 = 0;
        while (true) {
          const _ = _tmp$3;
          if (_ < _bind$2) {
            const s = _x_buf[_x_start + _ | 0];
            const s$2 = _M0IPC16string6StringPB12ToStringView16to__string__view(s);
            _M0IPB13StringBuilderPB6Logger11write__view(buf, separator);
            _M0IPB13StringBuilderPB6Logger11write__view(buf, s$2);
            _tmp$3 = _ + 1 | 0;
            continue;
          } else {
            break;
          }
        }
      }
      return buf.val;
    }
  }
  function _M0IPC16option6OptionPB2Eq5equalGsE(self, other) {
    if (self === undefined) {
      return other === undefined;
    } else {
      const _Some = self;
      const _x = _Some;
      if (other === undefined) {
        return false;
      } else {
        const _Some$2 = other;
        const _y = _Some$2;
        return _x === _y;
      }
    }
  }
  function _M0MPC13int3Int20next__power__of__two(self) {
    if (self >= 0) {
      if (self <= 1) {
        return 1;
      }
      if (self > 1073741824) {
        return 1073741824;
      }
      return (2147483647 >> (Math.clz32(self - 1 | 0) - 1 | 0)) + 1 | 0;
    } else {
      return $panic();
    }
  }
  function _M0FPB8new__mapGsRPB4JsonE(capacity) {
    const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
    const _bind = capacity$2 - 1 | 0;
    const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
    const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
    const _bind$4 = undefined;
    return new _M0TPB3MapGsRPB4JsonE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
  }
  function _M0FPB8new__mapGsbE(capacity) {
    const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
    const _bind = capacity$2 - 1 | 0;
    const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
    const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
    const _bind$4 = undefined;
    return new _M0TPB3MapGsbE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
  }
  function _M0FPB8new__mapGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(capacity) {
    const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
    const _bind = capacity$2 - 1 | 0;
    const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
    const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
    const _bind$4 = undefined;
    return new _M0TPB3MapGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
  }
  function _M0FPB8new__mapGibE(capacity) {
    const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
    const _bind = capacity$2 - 1 | 0;
    const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
    const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
    const _bind$4 = undefined;
    return new _M0TPB3MapGibE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
  }
  function _M0FPB8new__mapGlbE(capacity) {
    const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
    const _bind = capacity$2 - 1 | 0;
    const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
    const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
    const _bind$4 = undefined;
    return new _M0TPB3MapGlbE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
  }
  function _M0FPB8new__mapGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(capacity) {
    const capacity$2 = _M0MPC13int3Int20next__power__of__two(capacity);
    const _bind = capacity$2 - 1 | 0;
    const _bind$2 = (Math.imul(capacity$2, 13) | 0) / 16 | 0;
    const _bind$3 = $make_array_len_and_init(capacity$2, undefined);
    const _bind$4 = undefined;
    return new _M0TPB3MapGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(_bind$3, 0, capacity$2, _bind, _bind$2, _bind$4, -1);
  }
  function _M0FPB21capacity__for__length(length) {
    let capacity = _M0MPC13int3Int20next__power__of__two(length);
    const _p = capacity;
    if (length > ((Math.imul(_p, 13) | 0) / 16 | 0)) {
      capacity = Math.imul(capacity, 2) | 0;
    }
    return capacity;
  }
  function _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry) {
    const _bind = self.tail;
    if (_bind === -1) {
      self.head = entry;
    } else {
      const _tmp = self.entries;
      const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
      let _tmp$2;
      if (_p === undefined) {
        _tmp$2 = $panic();
      } else {
        const _p$2 = _p;
        _tmp$2 = _p$2;
      }
      _tmp$2.next = entry;
    }
    self.tail = idx;
    self.entries[idx] = entry;
    self.size = self.size + 1 | 0;
  }
  function _M0MPB3Map20add__entry__to__tailGsbE(self, idx, entry) {
    const _bind = self.tail;
    if (_bind === -1) {
      self.head = entry;
    } else {
      const _tmp = self.entries;
      const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
      let _tmp$2;
      if (_p === undefined) {
        _tmp$2 = $panic();
      } else {
        const _p$2 = _p;
        _tmp$2 = _p$2;
      }
      _tmp$2.next = entry;
    }
    self.tail = idx;
    self.entries[idx] = entry;
    self.size = self.size + 1 | 0;
  }
  function _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, entry) {
    const _bind = self.tail;
    if (_bind === -1) {
      self.head = entry;
    } else {
      const _tmp = self.entries;
      const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
      let _tmp$2;
      if (_p === undefined) {
        _tmp$2 = $panic();
      } else {
        const _p$2 = _p;
        _tmp$2 = _p$2;
      }
      _tmp$2.next = entry;
    }
    self.tail = idx;
    self.entries[idx] = entry;
    self.size = self.size + 1 | 0;
  }
  function _M0MPB3Map20add__entry__to__tailGibE(self, idx, entry) {
    const _bind = self.tail;
    if (_bind === -1) {
      self.head = entry;
    } else {
      const _tmp = self.entries;
      const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
      let _tmp$2;
      if (_p === undefined) {
        _tmp$2 = $panic();
      } else {
        const _p$2 = _p;
        _tmp$2 = _p$2;
      }
      _tmp$2.next = entry;
    }
    self.tail = idx;
    self.entries[idx] = entry;
    self.size = self.size + 1 | 0;
  }
  function _M0MPB3Map20add__entry__to__tailGlbE(self, idx, entry) {
    const _bind = self.tail;
    if (_bind === -1) {
      self.head = entry;
    } else {
      const _tmp = self.entries;
      const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
      let _tmp$2;
      if (_p === undefined) {
        _tmp$2 = $panic();
      } else {
        const _p$2 = _p;
        _tmp$2 = _p$2;
      }
      _tmp$2.next = entry;
    }
    self.tail = idx;
    self.entries[idx] = entry;
    self.size = self.size + 1 | 0;
  }
  function _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, idx, entry) {
    const _bind = self.tail;
    if (_bind === -1) {
      self.head = entry;
    } else {
      const _tmp = self.entries;
      const _p = _bind >>> 0 < _tmp.length ? _tmp[_bind] : $oob();
      let _tmp$2;
      if (_p === undefined) {
        _tmp$2 = $panic();
      } else {
        const _p$2 = _p;
        _tmp$2 = _p$2;
      }
      _tmp$2.next = entry;
    }
    self.tail = idx;
    self.entries[idx] = entry;
    self.size = self.size + 1 | 0;
  }
  function _M0MPB3Map10set__entryGsRPB4JsonE(self, entry, new_idx) {
    const _bind = entry.next;
    if (_bind === undefined) {
      self.tail = new_idx;
    } else {
      const _Some = _bind;
      const _next = _Some;
      _next.prev = new_idx;
    }
    self.entries[new_idx] = entry;
  }
  function _M0MPB3Map10set__entryGsbE(self, entry, new_idx) {
    const _bind = entry.next;
    if (_bind === undefined) {
      self.tail = new_idx;
    } else {
      const _Some = _bind;
      const _next = _Some;
      _next.prev = new_idx;
    }
    self.entries[new_idx] = entry;
  }
  function _M0MPB3Map10set__entryGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, entry, new_idx) {
    const _bind = entry.next;
    if (_bind === undefined) {
      self.tail = new_idx;
    } else {
      const _Some = _bind;
      const _next = _Some;
      _next.prev = new_idx;
    }
    self.entries[new_idx] = entry;
  }
  function _M0MPB3Map10set__entryGibE(self, entry, new_idx) {
    const _bind = entry.next;
    if (_bind === undefined) {
      self.tail = new_idx;
    } else {
      const _Some = _bind;
      const _next = _Some;
      _next.prev = new_idx;
    }
    self.entries[new_idx] = entry;
  }
  function _M0MPB3Map10set__entryGlbE(self, entry, new_idx) {
    const _bind = entry.next;
    if (_bind === undefined) {
      self.tail = new_idx;
    } else {
      const _Some = _bind;
      const _next = _Some;
      _next.prev = new_idx;
    }
    self.entries[new_idx] = entry;
  }
  function _M0MPB3Map10set__entryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, entry, new_idx) {
    const _bind = entry.next;
    if (_bind === undefined) {
      self.tail = new_idx;
    } else {
      const _Some = _bind;
      const _next = _Some;
      _next.prev = new_idx;
    }
    self.entries[new_idx] = entry;
  }
  function _M0MPB3Map10push__awayGsRPB4JsonE(self, idx, entry) {
    let _tmp = entry.psl + 1 | 0;
    let _tmp$2 = idx + 1 & self.capacity_mask;
    let _tmp$3 = entry;
    while (true) {
      const psl = _tmp;
      const idx$2 = _tmp$2;
      const entry$2 = _tmp$3;
      const _bind = self.entries[idx$2];
      if (_bind === undefined) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGsRPB4JsonE(self, entry$2, idx$2);
        return;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (psl > _curr_entry.psl) {
          entry$2.psl = psl;
          _M0MPB3Map10set__entryGsRPB4JsonE(self, entry$2, idx$2);
          _tmp = _curr_entry.psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          _tmp$3 = _curr_entry;
          continue;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map10push__awayGsbE(self, idx, entry) {
    let _tmp = entry.psl + 1 | 0;
    let _tmp$2 = idx + 1 & self.capacity_mask;
    let _tmp$3 = entry;
    while (true) {
      const psl = _tmp;
      const idx$2 = _tmp$2;
      const entry$2 = _tmp$3;
      const _bind = self.entries[idx$2];
      if (_bind === undefined) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGsbE(self, entry$2, idx$2);
        return;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (psl > _curr_entry.psl) {
          entry$2.psl = psl;
          _M0MPB3Map10set__entryGsbE(self, entry$2, idx$2);
          _tmp = _curr_entry.psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          _tmp$3 = _curr_entry;
          continue;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map10push__awayGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, entry) {
    let _tmp = entry.psl + 1 | 0;
    let _tmp$2 = idx + 1 & self.capacity_mask;
    let _tmp$3 = entry;
    while (true) {
      const psl = _tmp;
      const idx$2 = _tmp$2;
      const entry$2 = _tmp$3;
      const _bind = self.entries[idx$2];
      if (_bind === undefined) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, entry$2, idx$2);
        return;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (psl > _curr_entry.psl) {
          entry$2.psl = psl;
          _M0MPB3Map10set__entryGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, entry$2, idx$2);
          _tmp = _curr_entry.psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          _tmp$3 = _curr_entry;
          continue;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map10push__awayGibE(self, idx, entry) {
    let _tmp = entry.psl + 1 | 0;
    let _tmp$2 = idx + 1 & self.capacity_mask;
    let _tmp$3 = entry;
    while (true) {
      const psl = _tmp;
      const idx$2 = _tmp$2;
      const entry$2 = _tmp$3;
      const _bind = self.entries[idx$2];
      if (_bind === undefined) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGibE(self, entry$2, idx$2);
        return;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (psl > _curr_entry.psl) {
          entry$2.psl = psl;
          _M0MPB3Map10set__entryGibE(self, entry$2, idx$2);
          _tmp = _curr_entry.psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          _tmp$3 = _curr_entry;
          continue;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map10push__awayGlbE(self, idx, entry) {
    let _tmp = entry.psl + 1 | 0;
    let _tmp$2 = idx + 1 & self.capacity_mask;
    let _tmp$3 = entry;
    while (true) {
      const psl = _tmp;
      const idx$2 = _tmp$2;
      const entry$2 = _tmp$3;
      const _bind = self.entries[idx$2];
      if (_bind === undefined) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGlbE(self, entry$2, idx$2);
        return;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (psl > _curr_entry.psl) {
          entry$2.psl = psl;
          _M0MPB3Map10set__entryGlbE(self, entry$2, idx$2);
          _tmp = _curr_entry.psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          _tmp$3 = _curr_entry;
          continue;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map10push__awayGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, idx, entry) {
    let _tmp = entry.psl + 1 | 0;
    let _tmp$2 = idx + 1 & self.capacity_mask;
    let _tmp$3 = entry;
    while (true) {
      const psl = _tmp;
      const idx$2 = _tmp$2;
      const entry$2 = _tmp$3;
      const _bind = self.entries[idx$2];
      if (_bind === undefined) {
        entry$2.psl = psl;
        _M0MPB3Map10set__entryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, entry$2, idx$2);
        return;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (psl > _curr_entry.psl) {
          entry$2.psl = psl;
          _M0MPB3Map10set__entryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, entry$2, idx$2);
          _tmp = _curr_entry.psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          _tmp$3 = _curr_entry;
          continue;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx$2 + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map20rehash__place__entryGsRPB4JsonE(self, outer) {
    const hash = outer.hash;
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, outer);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr = _Some;
        if (psl > _curr.psl) {
          _M0MPB3Map10push__awayGsRPB4JsonE(self, idx, _curr);
          outer.psl = psl;
          outer.prev = self.tail;
          _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, outer);
          return undefined;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map20rehash__place__entryGsbE(self, outer) {
    const hash = outer.hash;
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGsbE(self, idx, outer);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr = _Some;
        if (psl > _curr.psl) {
          _M0MPB3Map10push__awayGsbE(self, idx, _curr);
          outer.psl = psl;
          outer.prev = self.tail;
          _M0MPB3Map20add__entry__to__tailGsbE(self, idx, outer);
          return undefined;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map20rehash__place__entryGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, outer) {
    const hash = outer.hash;
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, outer);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr = _Some;
        if (psl > _curr.psl) {
          _M0MPB3Map10push__awayGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, _curr);
          outer.psl = psl;
          outer.prev = self.tail;
          _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, outer);
          return undefined;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map20rehash__place__entryGibE(self, outer) {
    const hash = outer.hash;
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGibE(self, idx, outer);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr = _Some;
        if (psl > _curr.psl) {
          _M0MPB3Map10push__awayGibE(self, idx, _curr);
          outer.psl = psl;
          outer.prev = self.tail;
          _M0MPB3Map20add__entry__to__tailGibE(self, idx, outer);
          return undefined;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map20rehash__place__entryGlbE(self, outer) {
    const hash = outer.hash;
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGlbE(self, idx, outer);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr = _Some;
        if (psl > _curr.psl) {
          _M0MPB3Map10push__awayGlbE(self, idx, _curr);
          outer.psl = psl;
          outer.prev = self.tail;
          _M0MPB3Map20add__entry__to__tailGlbE(self, idx, outer);
          return undefined;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map20rehash__place__entryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, outer) {
    const hash = outer.hash;
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        outer.psl = psl;
        outer.prev = self.tail;
        _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, idx, outer);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr = _Some;
        if (psl > _curr.psl) {
          _M0MPB3Map10push__awayGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, idx, _curr);
          outer.psl = psl;
          outer.prev = self.tail;
          _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, idx, outer);
          return undefined;
        } else {
          _tmp = psl + 1 | 0;
          _tmp$2 = idx + 1 & self.capacity_mask;
          continue;
        }
      }
    }
  }
  function _M0MPB3Map4growGsRPB4JsonE(self) {
    const old_head = self.head;
    const new_capacity = self.capacity << 1;
    self.entries = $make_array_len_and_init(new_capacity, undefined);
    self.capacity = new_capacity;
    self.capacity_mask = new_capacity - 1 | 0;
    const _p = self.capacity;
    self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
    self.size = 0;
    self.head = undefined;
    self.tail = -1;
    let _tmp = old_head;
    while (true) {
      const x = _tmp;
      if (x === undefined) {
        return;
      } else {
        const _Some = x;
        const _e = _Some;
        const next_in_chain = _e.next;
        _e.next = undefined;
        _M0MPB3Map20rehash__place__entryGsRPB4JsonE(self, _e);
        _tmp = next_in_chain;
        continue;
      }
    }
  }
  function _M0MPB3Map4growGsbE(self) {
    const old_head = self.head;
    const new_capacity = self.capacity << 1;
    self.entries = $make_array_len_and_init(new_capacity, undefined);
    self.capacity = new_capacity;
    self.capacity_mask = new_capacity - 1 | 0;
    const _p = self.capacity;
    self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
    self.size = 0;
    self.head = undefined;
    self.tail = -1;
    let _tmp = old_head;
    while (true) {
      const x = _tmp;
      if (x === undefined) {
        return;
      } else {
        const _Some = x;
        const _e = _Some;
        const next_in_chain = _e.next;
        _e.next = undefined;
        _M0MPB3Map20rehash__place__entryGsbE(self, _e);
        _tmp = next_in_chain;
        continue;
      }
    }
  }
  function _M0MPB3Map4growGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self) {
    const old_head = self.head;
    const new_capacity = self.capacity << 1;
    self.entries = $make_array_len_and_init(new_capacity, undefined);
    self.capacity = new_capacity;
    self.capacity_mask = new_capacity - 1 | 0;
    const _p = self.capacity;
    self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
    self.size = 0;
    self.head = undefined;
    self.tail = -1;
    let _tmp = old_head;
    while (true) {
      const x = _tmp;
      if (x === undefined) {
        return;
      } else {
        const _Some = x;
        const _e = _Some;
        const next_in_chain = _e.next;
        _e.next = undefined;
        _M0MPB3Map20rehash__place__entryGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, _e);
        _tmp = next_in_chain;
        continue;
      }
    }
  }
  function _M0MPB3Map4growGibE(self) {
    const old_head = self.head;
    const new_capacity = self.capacity << 1;
    self.entries = $make_array_len_and_init(new_capacity, undefined);
    self.capacity = new_capacity;
    self.capacity_mask = new_capacity - 1 | 0;
    const _p = self.capacity;
    self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
    self.size = 0;
    self.head = undefined;
    self.tail = -1;
    let _tmp = old_head;
    while (true) {
      const x = _tmp;
      if (x === undefined) {
        return;
      } else {
        const _Some = x;
        const _e = _Some;
        const next_in_chain = _e.next;
        _e.next = undefined;
        _M0MPB3Map20rehash__place__entryGibE(self, _e);
        _tmp = next_in_chain;
        continue;
      }
    }
  }
  function _M0MPB3Map4growGlbE(self) {
    const old_head = self.head;
    const new_capacity = self.capacity << 1;
    self.entries = $make_array_len_and_init(new_capacity, undefined);
    self.capacity = new_capacity;
    self.capacity_mask = new_capacity - 1 | 0;
    const _p = self.capacity;
    self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
    self.size = 0;
    self.head = undefined;
    self.tail = -1;
    let _tmp = old_head;
    while (true) {
      const x = _tmp;
      if (x === undefined) {
        return;
      } else {
        const _Some = x;
        const _e = _Some;
        const next_in_chain = _e.next;
        _e.next = undefined;
        _M0MPB3Map20rehash__place__entryGlbE(self, _e);
        _tmp = next_in_chain;
        continue;
      }
    }
  }
  function _M0MPB3Map4growGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self) {
    const old_head = self.head;
    const new_capacity = self.capacity << 1;
    self.entries = $make_array_len_and_init(new_capacity, undefined);
    self.capacity = new_capacity;
    self.capacity_mask = new_capacity - 1 | 0;
    const _p = self.capacity;
    self.grow_at = (Math.imul(_p, 13) | 0) / 16 | 0;
    self.size = 0;
    self.head = undefined;
    self.tail = -1;
    let _tmp = old_head;
    while (true) {
      const x = _tmp;
      if (x === undefined) {
        return;
      } else {
        const _Some = x;
        const _e = _Some;
        const next_in_chain = _e.next;
        _e.next = undefined;
        _M0MPB3Map20rehash__place__entryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, _e);
        _tmp = next_in_chain;
        continue;
      }
    }
  }
  function _M0MPB3Map15set__with__hashGsRPB4JsonE(self, key, value, hash) {
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsRPB4JsonE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsRPB4JsonE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (_curr_entry.hash === hash && _curr_entry.key === key) {
          _curr_entry.value = value;
          return undefined;
        }
        if (psl > _curr_entry.psl) {
          if (self.size >= self.grow_at) {
            _M0MPB3Map4growGsRPB4JsonE(self);
            _tmp = 0;
            _tmp$2 = hash & self.capacity_mask;
            continue;
          }
          _M0MPB3Map10push__awayGsRPB4JsonE(self, idx, _curr_entry);
          const _bind$2 = self.tail;
          const _bind$3 = undefined;
          const entry = new _M0TPB5EntryGsRPB4JsonE(_bind$2, _bind$3, psl, hash, key, value);
          _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry);
          return undefined;
        }
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map15set__with__hashGsbE(self, key, value, hash) {
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsbE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsbE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsbE(self, idx, entry);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (_curr_entry.hash === hash && _curr_entry.key === key) {
          _curr_entry.value = value;
          return undefined;
        }
        if (psl > _curr_entry.psl) {
          if (self.size >= self.grow_at) {
            _M0MPB3Map4growGsbE(self);
            _tmp = 0;
            _tmp$2 = hash & self.capacity_mask;
            continue;
          }
          _M0MPB3Map10push__awayGsbE(self, idx, _curr_entry);
          const _bind$2 = self.tail;
          const _bind$3 = undefined;
          const entry = new _M0TPB5EntryGsbE(_bind$2, _bind$3, psl, hash, key, value);
          _M0MPB3Map20add__entry__to__tailGsbE(self, idx, entry);
          return undefined;
        }
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map15set__with__hashGsRP27mik1e806dxfkit5BlockE(self, key, value, hash) {
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsRPB4JsonE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsRP27mik1e806dxfkit5BlockE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (_curr_entry.hash === hash && _curr_entry.key === key) {
          _curr_entry.value = value;
          return undefined;
        }
        if (psl > _curr_entry.psl) {
          if (self.size >= self.grow_at) {
            _M0MPB3Map4growGsRPB4JsonE(self);
            _tmp = 0;
            _tmp$2 = hash & self.capacity_mask;
            continue;
          }
          _M0MPB3Map10push__awayGsRPB4JsonE(self, idx, _curr_entry);
          const _bind$2 = self.tail;
          const _bind$3 = undefined;
          const entry = new _M0TPB5EntryGsRP27mik1e806dxfkit5BlockE(_bind$2, _bind$3, psl, hash, key, value);
          _M0MPB3Map20add__entry__to__tailGsRPB4JsonE(self, idx, entry);
          return undefined;
        }
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map15set__with__hashGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, key, value, hash) {
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, entry);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (_curr_entry.hash === hash && _curr_entry.key === key) {
          _curr_entry.value = value;
          return undefined;
        }
        if (psl > _curr_entry.psl) {
          if (self.size >= self.grow_at) {
            _M0MPB3Map4growGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self);
            _tmp = 0;
            _tmp$2 = hash & self.capacity_mask;
            continue;
          }
          _M0MPB3Map10push__awayGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, _curr_entry);
          const _bind$2 = self.tail;
          const _bind$3 = undefined;
          const entry = new _M0TPB5EntryGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(_bind$2, _bind$3, psl, hash, key, value);
          _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, entry);
          return undefined;
        }
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map15set__with__hashGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(self, key, value, hash) {
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, entry);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (_curr_entry.hash === hash && _curr_entry.key === key) {
          _curr_entry.value = value;
          return undefined;
        }
        if (psl > _curr_entry.psl) {
          if (self.size >= self.grow_at) {
            _M0MPB3Map4growGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self);
            _tmp = 0;
            _tmp$2 = hash & self.capacity_mask;
            continue;
          }
          _M0MPB3Map10push__awayGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, _curr_entry);
          const _bind$2 = self.tail;
          const _bind$3 = undefined;
          const entry = new _M0TPB5EntryGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(_bind$2, _bind$3, psl, hash, key, value);
          _M0MPB3Map20add__entry__to__tailGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, idx, entry);
          return undefined;
        }
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map15set__with__hashGibE(self, key, value, hash) {
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGibE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGibE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGibE(self, idx, entry);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (_curr_entry.hash === hash && _curr_entry.key === key) {
          _curr_entry.value = value;
          return undefined;
        }
        if (psl > _curr_entry.psl) {
          if (self.size >= self.grow_at) {
            _M0MPB3Map4growGibE(self);
            _tmp = 0;
            _tmp$2 = hash & self.capacity_mask;
            continue;
          }
          _M0MPB3Map10push__awayGibE(self, idx, _curr_entry);
          const _bind$2 = self.tail;
          const _bind$3 = undefined;
          const entry = new _M0TPB5EntryGibE(_bind$2, _bind$3, psl, hash, key, value);
          _M0MPB3Map20add__entry__to__tailGibE(self, idx, entry);
          return undefined;
        }
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map15set__with__hashGlbE(self, key, value, hash) {
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGlbE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGlbE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGlbE(self, idx, entry);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (_curr_entry.hash === hash && BigInt.asUintN(64, _curr_entry.key) === BigInt.asUintN(64, key)) {
          _curr_entry.value = value;
          return undefined;
        }
        if (psl > _curr_entry.psl) {
          if (self.size >= self.grow_at) {
            _M0MPB3Map4growGlbE(self);
            _tmp = 0;
            _tmp$2 = hash & self.capacity_mask;
            continue;
          }
          _M0MPB3Map10push__awayGlbE(self, idx, _curr_entry);
          const _bind$2 = self.tail;
          const _bind$3 = undefined;
          const entry = new _M0TPB5EntryGlbE(_bind$2, _bind$3, psl, hash, key, value);
          _M0MPB3Map20add__entry__to__tailGlbE(self, idx, entry);
          return undefined;
        }
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map15set__with__hashGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, key, value, hash) {
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const psl = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        if (self.size >= self.grow_at) {
          _M0MPB3Map4growGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self);
          _tmp = 0;
          _tmp$2 = hash & self.capacity_mask;
          continue;
        }
        const _bind$2 = self.tail;
        const _bind$3 = undefined;
        const entry = new _M0TPB5EntryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(_bind$2, _bind$3, psl, hash, key, value);
        _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, idx, entry);
        return undefined;
      } else {
        const _Some = _bind;
        const _curr_entry = _Some;
        if (_curr_entry.hash === hash && _curr_entry.key === key) {
          _curr_entry.value = value;
          return undefined;
        }
        if (psl > _curr_entry.psl) {
          if (self.size >= self.grow_at) {
            _M0MPB3Map4growGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self);
            _tmp = 0;
            _tmp$2 = hash & self.capacity_mask;
            continue;
          }
          _M0MPB3Map10push__awayGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, idx, _curr_entry);
          const _bind$2 = self.tail;
          const _bind$3 = undefined;
          const entry = new _M0TPB5EntryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(_bind$2, _bind$3, psl, hash, key, value);
          _M0MPB3Map20add__entry__to__tailGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, idx, entry);
          return undefined;
        }
        _tmp = psl + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map3setGsRPB4JsonE(self, key, value) {
    _M0MPB3Map15set__with__hashGsRPB4JsonE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
  }
  function _M0MPB3Map3setGsbE(self, key, value) {
    _M0MPB3Map15set__with__hashGsbE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
  }
  function _M0MPB3Map3setGsRP27mik1e806dxfkit5BlockE(self, key, value) {
    _M0MPB3Map15set__with__hashGsRP27mik1e806dxfkit5BlockE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
  }
  function _M0MPB3Map3setGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, key, value) {
    _M0MPB3Map15set__with__hashGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
  }
  function _M0MPB3Map3setGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(self, key, value) {
    _M0MPB3Map15set__with__hashGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(self, key, value, _M0IPC16string6StringPB4Hash4hash(key));
  }
  function _M0MPB3Map3setGibE(self, key, value) {
    _M0MPB3Map15set__with__hashGibE(self, key, value, _M0IPC13int3IntPB4Hash4hash(key));
  }
  function _M0MPB3Map3setGlbE(self, key, value) {
    _M0MPB3Map15set__with__hashGlbE(self, key, value, _M0IPC15int645Int64PB4Hash4hash(key));
  }
  function _M0MPB3Map3setGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, key, value) {
    _M0MPB3Map15set__with__hashGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, key, value, _M0IPC13int3IntPB4Hash4hash(key));
  }
  function _M0MPB3Map3MapGsRPB4JsonE(arr, capacity) {
    const length = arr.end - arr.start | 0;
    let capacity$2;
    if (capacity === undefined) {
      capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
    } else {
      const _Some = capacity;
      const _capacity = _Some;
      const _p = _M0FPB21capacity__for__length(length);
      capacity$2 = _capacity > _p ? _capacity : _p;
    }
    const m = _M0FPB8new__mapGsRPB4JsonE(capacity$2);
    const _bind = arr.end - arr.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const e = arr.buf[arr.start + _ | 0];
        _M0MPB3Map3setGsRPB4JsonE(m, e._0, e._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return m;
  }
  function _M0MPB3Map3MapGsRP27mik1e806dxfkit5BlockE(arr, capacity) {
    const length = arr.end - arr.start | 0;
    let capacity$2;
    if (capacity === undefined) {
      capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
    } else {
      const _Some = capacity;
      const _capacity = _Some;
      const _p = _M0FPB21capacity__for__length(length);
      capacity$2 = _capacity > _p ? _capacity : _p;
    }
    const m = _M0FPB8new__mapGsRPB4JsonE(capacity$2);
    const _bind = arr.end - arr.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const e = arr.buf[arr.start + _ | 0];
        _M0MPB3Map3setGsRP27mik1e806dxfkit5BlockE(m, e._0, e._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return m;
  }
  function _M0MPB3Map3MapGsbE(arr, capacity) {
    const length = arr.end - arr.start | 0;
    let capacity$2;
    if (capacity === undefined) {
      capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
    } else {
      const _Some = capacity;
      const _capacity = _Some;
      const _p = _M0FPB21capacity__for__length(length);
      capacity$2 = _capacity > _p ? _capacity : _p;
    }
    const m = _M0FPB8new__mapGsbE(capacity$2);
    const _bind = arr.end - arr.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const e = arr.buf[arr.start + _ | 0];
        _M0MPB3Map3setGsbE(m, e._0, e._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return m;
  }
  function _M0MPB3Map3MapGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(arr, capacity) {
    const length = arr.end - arr.start | 0;
    let capacity$2;
    if (capacity === undefined) {
      capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
    } else {
      const _Some = capacity;
      const _capacity = _Some;
      const _p = _M0FPB21capacity__for__length(length);
      capacity$2 = _capacity > _p ? _capacity : _p;
    }
    const m = _M0FPB8new__mapGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(capacity$2);
    const _bind = arr.end - arr.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const e = arr.buf[arr.start + _ | 0];
        _M0MPB3Map3setGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(m, e._0, e._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return m;
  }
  function _M0MPB3Map3MapGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(arr, capacity) {
    const length = arr.end - arr.start | 0;
    let capacity$2;
    if (capacity === undefined) {
      capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
    } else {
      const _Some = capacity;
      const _capacity = _Some;
      const _p = _M0FPB21capacity__for__length(length);
      capacity$2 = _capacity > _p ? _capacity : _p;
    }
    const m = _M0FPB8new__mapGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(capacity$2);
    const _bind = arr.end - arr.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const e = arr.buf[arr.start + _ | 0];
        _M0MPB3Map3setGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(m, e._0, e._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return m;
  }
  function _M0MPB3Map3MapGibE(arr, capacity) {
    const length = arr.end - arr.start | 0;
    let capacity$2;
    if (capacity === undefined) {
      capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
    } else {
      const _Some = capacity;
      const _capacity = _Some;
      const _p = _M0FPB21capacity__for__length(length);
      capacity$2 = _capacity > _p ? _capacity : _p;
    }
    const m = _M0FPB8new__mapGibE(capacity$2);
    const _bind = arr.end - arr.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const e = arr.buf[arr.start + _ | 0];
        _M0MPB3Map3setGibE(m, e._0, e._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return m;
  }
  function _M0MPB3Map3MapGlbE(arr, capacity) {
    const length = arr.end - arr.start | 0;
    let capacity$2;
    if (capacity === undefined) {
      capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
    } else {
      const _Some = capacity;
      const _capacity = _Some;
      const _p = _M0FPB21capacity__for__length(length);
      capacity$2 = _capacity > _p ? _capacity : _p;
    }
    const m = _M0FPB8new__mapGlbE(capacity$2);
    const _bind = arr.end - arr.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const e = arr.buf[arr.start + _ | 0];
        _M0MPB3Map3setGlbE(m, e._0, e._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return m;
  }
  function _M0MPB3Map3MapGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(arr, capacity) {
    const length = arr.end - arr.start | 0;
    let capacity$2;
    if (capacity === undefined) {
      capacity$2 = length === 0 ? 8 : _M0FPB21capacity__for__length(length);
    } else {
      const _Some = capacity;
      const _capacity = _Some;
      const _p = _M0FPB21capacity__for__length(length);
      capacity$2 = _capacity > _p ? _capacity : _p;
    }
    const m = _M0FPB8new__mapGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(capacity$2);
    const _bind = arr.end - arr.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const e = arr.buf[arr.start + _ | 0];
        _M0MPB3Map3setGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(m, e._0, e._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return m;
  }
  function _M0MPB3Map3getGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, key) {
    const hash = _M0IPC16string6StringPB4Hash4hash(key);
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const i = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        return _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4None__;
      } else {
        const _Some = _bind;
        const _entry = _Some;
        if (_entry.hash === hash && _entry.key === key) {
          return new _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4Some(_entry.value);
        }
        if (i > _entry.psl) {
          return _M0DTPC16option6OptionGRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE4None__;
        }
        _tmp = i + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map3getGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(self, key) {
    const hash = _M0IPC16string6StringPB4Hash4hash(key);
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const i = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        return _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4None__;
      } else {
        const _Some = _bind;
        const _entry = _Some;
        if (_entry.hash === hash && _entry.key === key) {
          return new _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4Some(_entry.value);
        }
        if (i > _entry.psl) {
          return _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit6CutSegEE4None__;
        }
        _tmp = i + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map3getGsRP27mik1e806dxfkit5BlockE(self, key) {
    const hash = _M0IPC16string6StringPB4Hash4hash(key);
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const i = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        return undefined;
      } else {
        const _Some = _bind;
        const _entry = _Some;
        if (_entry.hash === hash && _entry.key === key) {
          return _entry.value;
        }
        if (i > _entry.psl) {
          return undefined;
        }
        _tmp = i + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map3getGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self, key) {
    const hash = _M0IPC13int3IntPB4Hash4hash(key);
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const i = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        return _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4None__;
      } else {
        const _Some = _bind;
        const _entry = _Some;
        if (_entry.hash === hash && _entry.key === key) {
          return new _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4Some(_entry.value);
        }
        if (i > _entry.psl) {
          return _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4None__;
        }
        _tmp = i + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map2atGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(self, key) {
    const hash = _M0IPC16string6StringPB4Hash4hash(key);
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const i = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        $panic();
      } else {
        const _Some = _bind;
        const _entry = _Some;
        if (_entry.hash === hash && _entry.key === key) {
          return _entry.value;
        }
        if (i <= _entry.psl) {
          _tmp = i + 1 | 0;
          _tmp$2 = idx + 1 & self.capacity_mask;
          continue;
        } else {
          $panic();
        }
      }
      continue;
    }
  }
  function _M0MPB3Map8containsGsRP27mik1e806dxfkit5BlockE(self, key) {
    const hash = _M0IPC16string6StringPB4Hash4hash(key);
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const i = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        return false;
      } else {
        const _Some = _bind;
        const _entry = _Some;
        if (_entry.hash === hash && _entry.key === key) {
          return true;
        }
        if (i > _entry.psl) {
          return false;
        }
        _tmp = i + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map8containsGsbE(self, key) {
    const hash = _M0IPC16string6StringPB4Hash4hash(key);
    let _tmp = 0;
    let _tmp$2 = hash & self.capacity_mask;
    while (true) {
      const i = _tmp;
      const idx = _tmp$2;
      const _bind = self.entries[idx];
      if (_bind === undefined) {
        return false;
      } else {
        const _Some = _bind;
        const _entry = _Some;
        if (_entry.hash === hash && _entry.key === key) {
          return true;
        }
        if (i > _entry.psl) {
          return false;
        }
        _tmp = i + 1 | 0;
        _tmp$2 = idx + 1 & self.capacity_mask;
        continue;
      }
    }
  }
  function _M0MPB3Map4iterGsRPB4JsonE(self) {
    const curr_entry = new _M0TPB8MutLocalGORPB5EntryGsRPB4JsonEE(self.head);
    const len = self.size;
    const remaining = new _M0TPB8MutLocalGiE(len);
    return _M0MPB4Iter3newGUsRPB4JsonEE(() => {
      _L: {
        if (remaining.val > 0) {
          const _bind = curr_entry.val;
          if (_bind === undefined) {
            break _L;
          } else {
            const _Some = _bind;
            const _x = _Some;
            const _key = _x.key;
            const _value = _x.value;
            const _next = _x.next;
            curr_entry.val = _next;
            remaining.val = remaining.val - 1 | 0;
            return { _0: _key, _1: _value };
          }
        } else {
          break _L;
        }
      }
      return undefined;
    }, len);
  }
  function _M0MPB3Map6valuesGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(self) {
    const curr_entry = new _M0TPB8MutLocalGORPB5EntryGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EEE(self.head);
    const len = self.size;
    const remaining = new _M0TPB8MutLocalGiE(len);
    return _M0MPB4Iter3newGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(() => {
      _L: {
        if (remaining.val > 0) {
          const _bind = curr_entry.val;
          if (_bind === undefined) {
            break _L;
          } else {
            const _Some = _bind;
            const _x = _Some;
            const _value = _x.value;
            const _next = _x.next;
            curr_entry.val = _next;
            remaining.val = remaining.val - 1 | 0;
            return new _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4Some(_value);
          }
        } else {
          break _L;
        }
      }
      return _M0DTPC16option6OptionGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE4None__;
    }, len);
  }
  function _M0MPC13int3Int8to__char(self) {
    _L: {
      if (self >= 0 && self <= 55295) {
        break _L;
      } else {
        if (self >= 57344 && self <= 1114111) {
          break _L;
        } else {
          return -1;
        }
      }
    }
    return self;
  }
  function _M0IPC15int645Int64PB4Hash4hash(self) {
    return _M0IPC16uint646UInt64PB4Hash4hash(self);
  }
  function _M0IPC16string6StringPB4Hash4hash(self) {
    let acc = (_M0FPB4seed >>> 0) + (374761393 >>> 0) | 0;
    const _bind = self.length;
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < _bind) {
        acc = (acc >>> 0) + (4 >>> 0) | 0;
        const v = self.charCodeAt(i);
        acc = _M0FPB13consume4__acc(acc, v);
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return _M0FPB13finalize__acc(acc);
  }
  function _M0IPC13int3IntPB4Hash4hash(self) {
    const acc = (((_M0FPB4seed >>> 0) + (374761393 >>> 0) | 0) >>> 0) + (4 >>> 0) | 0;
    return _M0FPB13finalize__acc(_M0FPB13consume4__acc(acc, self));
  }
  function _M0IPC16uint646UInt64PB4Hash4hash(self) {
    const acc = (((_M0FPB4seed >>> 0) + (374761393 >>> 0) | 0) >>> 0) + (8 >>> 0) | 0;
    const low = Number(BigInt.asUintN(32, BigInt.asUintN(64, self & 4294967295n))) | 0;
    const high = Number(BigInt.asUintN(32, BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, self) >> BigInt(32 & 63)) & 4294967295n))) | 0;
    const acc$2 = _M0FPB13consume4__acc(acc, low);
    const acc$3 = _M0FPB13consume4__acc(acc$2, high);
    return _M0FPB13finalize__acc(acc$3);
  }
  function _M0MPC15array10FixedArray23unsafe__make__and__blitGyE(src, allocate_len, init, src_offset, dst_offset, blit_len) {
    const dst = $makebytes(allocate_len, init);
    _M0MPC15array10FixedArray12unsafe__blitGyE(dst, dst_offset, src, src_offset, blit_len);
    return dst;
  }
  function _M0MPC15array10FixedArray23make__and__blit_2einnerGyE(src, allocate_len, init, len, src_offset, dst_offset) {
    if (allocate_len >= 0 && (len >= 0 && (src_offset >= 0 && (dst_offset >= 0 && ((src_offset + len | 0) <= src.length && (dst_offset + len | 0) <= allocate_len))))) {
      return _M0MPC15array10FixedArray23unsafe__make__and__blitGyE(src, allocate_len, init, src_offset, dst_offset, len);
    } else {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(89);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "bounds check failed: allocate_len = ");
      _M0MPB13StringBuilder13write__objectGiE(_string_builder, allocate_len);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", src_offset = ");
      _M0MPB13StringBuilder13write__objectGiE(_string_builder, src_offset);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", dst_offset = ");
      _M0MPB13StringBuilder13write__objectGiE(_string_builder, dst_offset);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", len = ");
      _M0MPB13StringBuilder13write__objectGiE(_string_builder, len);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", src.length = ");
      _M0MPB13StringBuilder13write__objectGiE(_string_builder, src.length);
      return $panic();
    }
  }
  function _M0MPC16double6Double7to__int(self) {
    return self !== self ? 0 : self >= 2147483647 ? 2147483647 : self <= -2147483648 ? -2147483648 : self | 0;
  }
  function _M0MPC16double6Double5round(_tmp) {
    return Math.round(_tmp);
  }
  function _M0IPC16double6DoublePB3Mod3mod(self, other) {
    return _M0MPC16double6Double8mod__ffi(self, other);
  }
  function _M0MPC16double6Double3min(self, other) {
    return self !== self ? other : other !== other ? self : self < other ? self : other;
  }
  function _M0MPC16double6Double3max(self, other) {
    return self !== self ? other : other !== other ? self : self > other ? self : other;
  }
  function _M0IPC16double6DoublePB4Show10to__string(self) {
    return String(self);
  }
  function _M0MPC15bytes5Bytes21clamped__view_2einner(self, start, end) {
    const len = self.length;
    const lo = start < 0 ? 0 : start > len ? len : start;
    let hi;
    if (end === undefined) {
      hi = len;
    } else {
      const _Some = end;
      const _end = _Some;
      hi = _end < 0 ? 0 : _end > len ? len : _end;
    }
    const count = hi > lo ? hi - lo | 0 : 0;
    return new _M0TPC15bytes9BytesView(self, lo, lo + count | 0);
  }
  function _M0MPC15bytes9BytesView21clamped__view_2einner(self, start, end) {
    const len = self.end - self.start | 0;
    const lo = start < 0 ? 0 : start > len ? len : start;
    let hi;
    if (end === undefined) {
      hi = len;
    } else {
      const _Some = end;
      const _end = _Some;
      hi = _end < 0 ? 0 : _end > len ? len : _end;
    }
    const count = hi > lo ? hi - lo | 0 : 0;
    const _bind = self.buf;
    const _bind$2 = self.start + lo | 0;
    return new _M0TPC15bytes9BytesView(_bind, _bind$2, _bind$2 + count | 0);
  }
  function _M0MPC15bytes5Bytes11from__array(arr) {
    const len = arr.end - arr.start | 0;
    if (len === 0) {
      return $bytes_literal$0;
    }
    const result = _M0MPB18UninitializedArray23unsafe__make__and__blitGyE(arr.buf, len, arr.start, 0, len);
    return result;
  }
  function _M0MPC15array5Array21clamped__view_2einnerGRP27mik1e806dxfkit6RecordE(self, start, end) {
    const len = self.length;
    const lo = start < 0 ? 0 : start > len ? len : start;
    let hi;
    if (end === undefined) {
      hi = len;
    } else {
      const _Some = end;
      const _end = _Some;
      hi = _end < 0 ? 0 : _end > len ? len : _end;
    }
    const count = hi > lo ? hi - lo | 0 : 0;
    const _bind = self;
    return new _M0TPB9ArrayViewGRP27mik1e806dxfkit6RecordE(_bind, lo, lo + count | 0);
  }
  function _M0MPC15array5Array28unsafe__truncate__to__lengthGyE(self, new_len) {
    _M0MPB7JSArray11set__length(self, new_len);
  }
  function _M0MPC15array5Array6appendGRP27mik1e806dxfkit3TagE(self, other) {
    const old_len = self.length;
    const append_len = other.end - other.start | 0;
    if ((old_len + append_len | 0) >= old_len) {
      _M0MPB7JSArray12append__view(self, other.buf, other.start, append_len);
      return;
    } else {
      $panic();
      return;
    }
  }
  function _M0MPC15array5Array11unsafe__popGRPC14json10WriteFrameE(self) {
    return _M0MPB7JSArray3pop(self);
  }
  function _M0MPC15array5Array3popGRPC14json10WriteFrameE(self) {
    if (self.length === 0) {
      return undefined;
    } else {
      const v = _M0MPC15array5Array11unsafe__popGRPC14json10WriteFrameE(self);
      return v;
    }
  }
  function _M0MPC15array5Array4copyGsE(self) {
    return _M0MPB7JSArray4copy(self);
  }
  function _M0MPC15array5Array4copyGdE(self) {
    return _M0MPB7JSArray4copy(self);
  }
  function _M0MPC15array5Array2atGRPB4JsonE(self, index) {
    const len = self.length;
    return index >= 0 && index < len ? self[index] : $panic();
  }
  function _M0MPC15array5Array2atGiE(self, index) {
    const len = self.length;
    return index >= 0 && index < len ? self[index] : $panic();
  }
  function _M0MPC15array5Array2atGdE(self, index) {
    const len = self.length;
    return index >= 0 && index < len ? self[index] : $panic();
  }
  function _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, i, j) {
    const temp = arr.buf[arr.start + i | 0];
    arr.buf[arr.start + i | 0] = arr.buf[arr.start + j | 0];
    arr.buf[arr.start + j | 0] = temp;
  }
  function _M0MPC15array12MutArrayView4swapGiE(arr, i, j) {
    const temp = arr.buf[arr.start + i | 0];
    arr.buf[arr.start + i | 0] = arr.buf[arr.start + j | 0];
    arr.buf[arr.start + j | 0] = temp;
  }
  function _M0MPC15array12MutArrayView5sliceGRP27mik1e806dxfkit6CutSegE(arr, start, end) {
    const _bind = arr.end - arr.start | 0;
    if (start < 0 || (start > end || end > _bind)) {
      $panic();
    }
    return new _M0TPB12MutArrayViewGRP27mik1e806dxfkit6CutSegE(arr.buf, start + arr.start | 0, end + arr.start | 0);
  }
  function _M0MPC15array12MutArrayView5sliceGiE(arr, start, end) {
    const _bind = arr.end - arr.start | 0;
    if (start < 0 || (start > end || end > _bind)) {
      $panic();
    }
    return new _M0TPB12MutArrayViewGiE(arr.buf, start + arr.start | 0, end + arr.start | 0);
  }
  function _M0MPC15array5Array3setGsE(self, index, value) {
    const len = self.length;
    if (index >= 0 && index < len) {
      self[index] = value;
      return;
    } else {
      $panic();
      return;
    }
  }
  function _M0MPC15array5Array3setGiE(self, index, value) {
    const len = self.length;
    if (index >= 0 && index < len) {
      self[index] = value;
      return;
    } else {
      $panic();
      return;
    }
  }
  function _M0MPC15array12MutArrayView14rev__in__placeGRP27mik1e806dxfkit6CutSegE(arr) {
    const len = arr.end - arr.start | 0;
    const mid_len = len / 2 | 0;
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < mid_len) {
        const j = (len - i | 0) - 1 | 0;
        const temp = arr.buf[arr.start + i | 0];
        arr.buf[arr.start + i | 0] = arr.buf[arr.start + j | 0];
        arr.buf[arr.start + j | 0] = temp;
        _tmp = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0MPC15array12MutArrayView14rev__in__placeGiE(arr) {
    const len = arr.end - arr.start | 0;
    const mid_len = len / 2 | 0;
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < mid_len) {
        const j = (len - i | 0) - 1 | 0;
        const temp = arr.buf[arr.start + i | 0];
        arr.buf[arr.start + i | 0] = arr.buf[arr.start + j | 0];
        arr.buf[arr.start + j | 0] = temp;
        _tmp = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FPB17fixed__get__limit(len) {
    let _tmp = len;
    let _tmp$2 = 0;
    while (true) {
      const len$2 = _tmp;
      const limit = _tmp$2;
      if (len$2 > 0) {
        _tmp = len$2 / 2 | 0;
        _tmp$2 = limit + 1 | 0;
        continue;
      } else {
        return limit;
      }
    }
  }
  function _M0FPB23fixed__bubble__sort__byGRP27mik1e806dxfkit6CutSegE(arr, cmp) {
    const _bind = arr.end - arr.start | 0;
    let _tmp = 1;
    while (true) {
      const i = _tmp;
      if (i < _bind) {
        let _tmp$2 = i;
        while (true) {
          const j = _tmp$2;
          if (j > 0 && cmp(arr.buf[arr.start + (j - 1 | 0) | 0], arr.buf[arr.start + j | 0]) > 0) {
            _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, j, j - 1 | 0);
            _tmp$2 = j - 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FPB23fixed__bubble__sort__byGiE(arr, cmp) {
    const _bind = arr.end - arr.start | 0;
    let _tmp = 1;
    while (true) {
      const i = _tmp;
      if (i < _bind) {
        let _tmp$2 = i;
        while (true) {
          const j = _tmp$2;
          if (j > 0 && cmp(arr.buf[arr.start + (j - 1 | 0) | 0], arr.buf[arr.start + j | 0]) > 0) {
            _M0MPC15array12MutArrayView4swapGiE(arr, j, j - 1 | 0);
            _tmp$2 = j - 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FPB24fixed__choose__pivot__byN7sort__2S444GRP27mik1e806dxfkit6CutSegE(_env, a, b) {
    const arr = _env._2;
    const cmp = _env._1;
    const swaps = _env._0;
    if (cmp(arr.buf[arr.start + a | 0], arr.buf[arr.start + b | 0]) > 0) {
      _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, a, b);
      swaps.val = swaps.val + 1 | 0;
      return;
    } else {
      return;
    }
  }
  function _M0FPB24fixed__choose__pivot__byN7sort__3S448GRP27mik1e806dxfkit6CutSegE(_env, a, b, c) {
    _M0FPB24fixed__choose__pivot__byN7sort__2S444GRP27mik1e806dxfkit6CutSegE(_env, a, b);
    _M0FPB24fixed__choose__pivot__byN7sort__2S444GRP27mik1e806dxfkit6CutSegE(_env, b, c);
    _M0FPB24fixed__choose__pivot__byN7sort__2S444GRP27mik1e806dxfkit6CutSegE(_env, a, b);
  }
  function _M0FPB24fixed__choose__pivot__byN7sort__2S444GiE(_env, a, b) {
    const arr = _env._2;
    const cmp = _env._1;
    const swaps = _env._0;
    if (cmp(arr.buf[arr.start + a | 0], arr.buf[arr.start + b | 0]) > 0) {
      _M0MPC15array12MutArrayView4swapGiE(arr, a, b);
      swaps.val = swaps.val + 1 | 0;
      return;
    } else {
      return;
    }
  }
  function _M0FPB24fixed__choose__pivot__byN7sort__3S448GiE(_env, a, b, c) {
    _M0FPB24fixed__choose__pivot__byN7sort__2S444GiE(_env, a, b);
    _M0FPB24fixed__choose__pivot__byN7sort__2S444GiE(_env, b, c);
    _M0FPB24fixed__choose__pivot__byN7sort__2S444GiE(_env, a, b);
  }
  function _M0FPB24fixed__choose__pivot__byGRP27mik1e806dxfkit6CutSegE(arr, cmp) {
    const len = arr.end - arr.start | 0;
    const swaps = new _M0TPB8MutLocalGiE(0);
    const b = Math.imul(len / 4 | 0, 2) | 0;
    if (len >= 8) {
      const a = Math.imul(len / 4 | 0, 1) | 0;
      const c = Math.imul(len / 4 | 0, 3) | 0;
      const _env = { _0: swaps, _1: cmp, _2: arr };
      if (len > 50) {
        _M0FPB24fixed__choose__pivot__byN7sort__3S448GRP27mik1e806dxfkit6CutSegE(_env, a - 1 | 0, a, a + 1 | 0);
        _M0FPB24fixed__choose__pivot__byN7sort__3S448GRP27mik1e806dxfkit6CutSegE(_env, b - 1 | 0, b, b + 1 | 0);
        _M0FPB24fixed__choose__pivot__byN7sort__3S448GRP27mik1e806dxfkit6CutSegE(_env, c - 1 | 0, c, c + 1 | 0);
      }
      _M0FPB24fixed__choose__pivot__byN7sort__3S448GRP27mik1e806dxfkit6CutSegE(_env, a, b, c);
    }
    if (swaps.val === 12) {
      _M0MPC15array12MutArrayView14rev__in__placeGRP27mik1e806dxfkit6CutSegE(arr);
      return { _0: (len - b | 0) - 1 | 0, _1: true };
    } else {
      return { _0: b, _1: swaps.val === 0 };
    }
  }
  function _M0FPB24fixed__choose__pivot__byGiE(arr, cmp) {
    const len = arr.end - arr.start | 0;
    const swaps = new _M0TPB8MutLocalGiE(0);
    const b = Math.imul(len / 4 | 0, 2) | 0;
    if (len >= 8) {
      const a = Math.imul(len / 4 | 0, 1) | 0;
      const c = Math.imul(len / 4 | 0, 3) | 0;
      const _env = { _0: swaps, _1: cmp, _2: arr };
      if (len > 50) {
        _M0FPB24fixed__choose__pivot__byN7sort__3S448GiE(_env, a - 1 | 0, a, a + 1 | 0);
        _M0FPB24fixed__choose__pivot__byN7sort__3S448GiE(_env, b - 1 | 0, b, b + 1 | 0);
        _M0FPB24fixed__choose__pivot__byN7sort__3S448GiE(_env, c - 1 | 0, c, c + 1 | 0);
      }
      _M0FPB24fixed__choose__pivot__byN7sort__3S448GiE(_env, a, b, c);
    }
    if (swaps.val === 12) {
      _M0MPC15array12MutArrayView14rev__in__placeGiE(arr);
      return { _0: (len - b | 0) - 1 | 0, _1: true };
    } else {
      return { _0: b, _1: swaps.val === 0 };
    }
  }
  function _M0FPB21fixed__sift__down__byGRP27mik1e806dxfkit6CutSegE(arr, index, cmp) {
    const len = arr.end - arr.start | 0;
    let _tmp = index;
    let _tmp$2 = (Math.imul(index, 2) | 0) + 1 | 0;
    while (true) {
      const index$2 = _tmp;
      const child = _tmp$2;
      if (child < len) {
        const child$2 = (child + 1 | 0) < len && cmp(arr.buf[arr.start + child | 0], arr.buf[arr.start + (child + 1 | 0) | 0]) < 0 ? child + 1 | 0 : child;
        if (cmp(arr.buf[arr.start + index$2 | 0], arr.buf[arr.start + child$2 | 0]) >= 0) {
          return undefined;
        }
        _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, index$2, child$2);
        _tmp = child$2;
        _tmp$2 = (Math.imul(child$2, 2) | 0) + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FPB21fixed__sift__down__byGiE(arr, index, cmp) {
    const len = arr.end - arr.start | 0;
    let _tmp = index;
    let _tmp$2 = (Math.imul(index, 2) | 0) + 1 | 0;
    while (true) {
      const index$2 = _tmp;
      const child = _tmp$2;
      if (child < len) {
        const child$2 = (child + 1 | 0) < len && cmp(arr.buf[arr.start + child | 0], arr.buf[arr.start + (child + 1 | 0) | 0]) < 0 ? child + 1 | 0 : child;
        if (cmp(arr.buf[arr.start + index$2 | 0], arr.buf[arr.start + child$2 | 0]) >= 0) {
          return undefined;
        }
        _M0MPC15array12MutArrayView4swapGiE(arr, index$2, child$2);
        _tmp = child$2;
        _tmp$2 = (Math.imul(child$2, 2) | 0) + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FPB21fixed__heap__sort__byGRP27mik1e806dxfkit6CutSegE(arr, cmp) {
    const len = arr.end - arr.start | 0;
    const _bind = len / 2 | 0;
    let _tmp = _bind - 1 | 0;
    while (true) {
      const i = _tmp;
      if (i >= 0) {
        _M0FPB21fixed__sift__down__byGRP27mik1e806dxfkit6CutSegE(arr, i, cmp);
        _tmp = i - 1 | 0;
        continue;
      } else {
        break;
      }
    }
    let _tmp$2 = len - 1 | 0;
    while (true) {
      const i = _tmp$2;
      if (i >= 1) {
        _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, 0, i);
        _M0FPB21fixed__sift__down__byGRP27mik1e806dxfkit6CutSegE(_M0MPC15array12MutArrayView5sliceGRP27mik1e806dxfkit6CutSegE(arr, 0, i), 0, cmp);
        _tmp$2 = i - 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FPB21fixed__heap__sort__byGiE(arr, cmp) {
    const len = arr.end - arr.start | 0;
    const _bind = len / 2 | 0;
    let _tmp = _bind - 1 | 0;
    while (true) {
      const i = _tmp;
      if (i >= 0) {
        _M0FPB21fixed__sift__down__byGiE(arr, i, cmp);
        _tmp = i - 1 | 0;
        continue;
      } else {
        break;
      }
    }
    let _tmp$2 = len - 1 | 0;
    while (true) {
      const i = _tmp$2;
      if (i >= 1) {
        _M0MPC15array12MutArrayView4swapGiE(arr, 0, i);
        _M0FPB21fixed__sift__down__byGiE(_M0MPC15array12MutArrayView5sliceGiE(arr, 0, i), 0, cmp);
        _tmp$2 = i - 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FPB20fixed__partition__byGRP27mik1e806dxfkit6CutSegE(arr, cmp, pivot_index) {
    _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, pivot_index, (arr.end - arr.start | 0) - 1 | 0);
    const pivot = arr.buf[arr.start + ((arr.end - arr.start | 0) - 1 | 0) | 0];
    const _bind = (arr.end - arr.start | 0) - 1 | 0;
    let _tmp = 0;
    let _tmp$2 = 0;
    let _tmp$3 = true;
    while (true) {
      const j = _tmp;
      const i = _tmp$2;
      const partitioned = _tmp$3;
      if (j < _bind) {
        if (cmp(arr.buf[arr.start + j | 0], pivot) < 0) {
          if (i !== j) {
            _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, i, j);
            _tmp = j + 1 | 0;
            _tmp$2 = i + 1 | 0;
            _tmp$3 = false;
            continue;
          } else {
            _tmp = j + 1 | 0;
            _tmp$2 = i + 1 | 0;
            continue;
          }
        } else {
          _tmp = j + 1 | 0;
          continue;
        }
      } else {
        _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, i, (arr.end - arr.start | 0) - 1 | 0);
        return { _0: i, _1: partitioned };
      }
    }
  }
  function _M0FPB20fixed__partition__byGiE(arr, cmp, pivot_index) {
    _M0MPC15array12MutArrayView4swapGiE(arr, pivot_index, (arr.end - arr.start | 0) - 1 | 0);
    const pivot = arr.buf[arr.start + ((arr.end - arr.start | 0) - 1 | 0) | 0];
    const _bind = (arr.end - arr.start | 0) - 1 | 0;
    let _tmp = 0;
    let _tmp$2 = 0;
    let _tmp$3 = true;
    while (true) {
      const j = _tmp;
      const i = _tmp$2;
      const partitioned = _tmp$3;
      if (j < _bind) {
        if (cmp(arr.buf[arr.start + j | 0], pivot) < 0) {
          if (i !== j) {
            _M0MPC15array12MutArrayView4swapGiE(arr, i, j);
            _tmp = j + 1 | 0;
            _tmp$2 = i + 1 | 0;
            _tmp$3 = false;
            continue;
          } else {
            _tmp = j + 1 | 0;
            _tmp$2 = i + 1 | 0;
            continue;
          }
        } else {
          _tmp = j + 1 | 0;
          continue;
        }
      } else {
        _M0MPC15array12MutArrayView4swapGiE(arr, i, (arr.end - arr.start | 0) - 1 | 0);
        return { _0: i, _1: partitioned };
      }
    }
  }
  function _M0FPB28fixed__try__bubble__sort__byGRP27mik1e806dxfkit6CutSegE(arr, cmp) {
    const _bind = arr.end - arr.start | 0;
    let _tmp = 1;
    let _tmp$2 = 0;
    while (true) {
      const i = _tmp;
      const tries = _tmp$2;
      if (i < _bind) {
        let sorted;
        let _tmp$3 = i;
        let _tmp$4 = true;
        while (true) {
          const j = _tmp$3;
          const sorted$2 = _tmp$4;
          if (j > 0 && cmp(arr.buf[arr.start + (j - 1 | 0) | 0], arr.buf[arr.start + j | 0]) > 0) {
            _M0MPC15array12MutArrayView4swapGRP27mik1e806dxfkit6CutSegE(arr, j, j - 1 | 0);
            _tmp$3 = j - 1 | 0;
            _tmp$4 = false;
            continue;
          } else {
            sorted = sorted$2;
            break;
          }
        }
        if (!sorted) {
          const tries$2 = tries + 1 | 0;
          if (tries$2 > 8) {
            return false;
          }
          _tmp = i + 1 | 0;
          _tmp$2 = tries$2;
          continue;
        } else {
          _tmp = i + 1 | 0;
          continue;
        }
      } else {
        return true;
      }
    }
  }
  function _M0FPB28fixed__try__bubble__sort__byGiE(arr, cmp) {
    const _bind = arr.end - arr.start | 0;
    let _tmp = 1;
    let _tmp$2 = 0;
    while (true) {
      const i = _tmp;
      const tries = _tmp$2;
      if (i < _bind) {
        let sorted;
        let _tmp$3 = i;
        let _tmp$4 = true;
        while (true) {
          const j = _tmp$3;
          const sorted$2 = _tmp$4;
          if (j > 0 && cmp(arr.buf[arr.start + (j - 1 | 0) | 0], arr.buf[arr.start + j | 0]) > 0) {
            _M0MPC15array12MutArrayView4swapGiE(arr, j, j - 1 | 0);
            _tmp$3 = j - 1 | 0;
            _tmp$4 = false;
            continue;
          } else {
            sorted = sorted$2;
            break;
          }
        }
        if (!sorted) {
          const tries$2 = tries + 1 | 0;
          if (tries$2 > 8) {
            return false;
          }
          _tmp = i + 1 | 0;
          _tmp$2 = tries$2;
          continue;
        } else {
          _tmp = i + 1 | 0;
          continue;
        }
      } else {
        return true;
      }
    }
  }
  function _M0FPB22fixed__quick__sort__byGRP27mik1e806dxfkit6CutSegE(arr, cmp, pred, limit) {
    let _tmp = limit;
    let _tmp$2 = arr;
    let _tmp$3 = pred;
    let _tmp$4 = true;
    let _tmp$5 = true;
    while (true) {
      const limit$2 = _tmp;
      const arr$2 = _tmp$2;
      const pred$2 = _tmp$3;
      const was_partitioned = _tmp$4;
      const balanced = _tmp$5;
      const len = arr$2.end - arr$2.start | 0;
      if (len <= 16) {
        if (len >= 2) {
          _M0FPB23fixed__bubble__sort__byGRP27mik1e806dxfkit6CutSegE(arr$2, cmp);
        }
        return undefined;
      }
      if (limit$2 === 0) {
        _M0FPB21fixed__heap__sort__byGRP27mik1e806dxfkit6CutSegE(arr$2, cmp);
        return undefined;
      }
      const _bind = _M0FPB24fixed__choose__pivot__byGRP27mik1e806dxfkit6CutSegE(arr$2, cmp);
      const _pivot_index = _bind._0;
      const _likely_sorted = _bind._1;
      if (was_partitioned && (balanced && _likely_sorted)) {
        if (_M0FPB28fixed__try__bubble__sort__byGRP27mik1e806dxfkit6CutSegE(arr$2, cmp)) {
          return undefined;
        }
      }
      const _bind$2 = _M0FPB20fixed__partition__byGRP27mik1e806dxfkit6CutSegE(arr$2, cmp, _pivot_index);
      const _pivot = _bind$2._0;
      const _partitioned = _bind$2._1;
      const _p = len - _pivot | 0;
      const balanced$2 = (_pivot > _p ? _p : _pivot) >= (len / 8 | 0);
      const limit$3 = !balanced$2 ? limit$2 - 1 | 0 : limit$2;
      if (pred$2 === undefined) {
      } else {
        const _Some = pred$2;
        const _p$2 = _Some;
        if (cmp(_p$2, arr$2.buf[arr$2.start + _pivot | 0]) === 0) {
          let i;
          let _tmp$6 = _pivot;
          while (true) {
            const i$2 = _tmp$6;
            if (i$2 < len && cmp(_p$2, arr$2.buf[arr$2.start + i$2 | 0]) === 0) {
              _tmp$6 = i$2 + 1 | 0;
              continue;
            } else {
              i = i$2;
              break;
            }
          }
          _tmp = limit$3;
          _tmp$2 = _M0MPC15array12MutArrayView5sliceGRP27mik1e806dxfkit6CutSegE(arr$2, i, len);
          _tmp$4 = _partitioned;
          _tmp$5 = balanced$2;
          continue;
        }
      }
      const left = _M0MPC15array12MutArrayView5sliceGRP27mik1e806dxfkit6CutSegE(arr$2, 0, _pivot);
      const right = _M0MPC15array12MutArrayView5sliceGRP27mik1e806dxfkit6CutSegE(arr$2, _pivot + 1 | 0, len);
      if ((left.end - left.start | 0) < (right.end - right.start | 0)) {
        _M0FPB22fixed__quick__sort__byGRP27mik1e806dxfkit6CutSegE(left, cmp, pred$2, limit$3);
        _tmp = limit$3;
        _tmp$2 = right;
        _tmp$3 = arr$2.buf[arr$2.start + _pivot | 0];
        _tmp$4 = _partitioned;
        _tmp$5 = balanced$2;
        continue;
      } else {
        _M0FPB22fixed__quick__sort__byGRP27mik1e806dxfkit6CutSegE(right, cmp, arr$2.buf[arr$2.start + _pivot | 0], limit$3);
        _tmp = limit$3;
        _tmp$2 = left;
        _tmp$4 = _partitioned;
        _tmp$5 = balanced$2;
        continue;
      }
    }
  }
  function _M0FPB22fixed__quick__sort__byGiE(arr, cmp, pred, limit) {
    let _tmp = limit;
    let _tmp$2 = arr;
    let _tmp$3 = pred;
    let _tmp$4 = true;
    let _tmp$5 = true;
    while (true) {
      const limit$2 = _tmp;
      const arr$2 = _tmp$2;
      const pred$2 = _tmp$3;
      const was_partitioned = _tmp$4;
      const balanced = _tmp$5;
      const len = arr$2.end - arr$2.start | 0;
      if (len <= 16) {
        if (len >= 2) {
          _M0FPB23fixed__bubble__sort__byGiE(arr$2, cmp);
        }
        return undefined;
      }
      if (limit$2 === 0) {
        _M0FPB21fixed__heap__sort__byGiE(arr$2, cmp);
        return undefined;
      }
      const _bind = _M0FPB24fixed__choose__pivot__byGiE(arr$2, cmp);
      const _pivot_index = _bind._0;
      const _likely_sorted = _bind._1;
      if (was_partitioned && (balanced && _likely_sorted)) {
        if (_M0FPB28fixed__try__bubble__sort__byGiE(arr$2, cmp)) {
          return undefined;
        }
      }
      const _bind$2 = _M0FPB20fixed__partition__byGiE(arr$2, cmp, _pivot_index);
      const _pivot = _bind$2._0;
      const _partitioned = _bind$2._1;
      const _p = len - _pivot | 0;
      const balanced$2 = (_pivot > _p ? _p : _pivot) >= (len / 8 | 0);
      const limit$3 = !balanced$2 ? limit$2 - 1 | 0 : limit$2;
      if (pred$2 === undefined) {
      } else {
        const _Some = pred$2;
        const _p$2 = _Some;
        if (cmp(_p$2, arr$2.buf[arr$2.start + _pivot | 0]) === 0) {
          let i;
          let _tmp$6 = _pivot;
          while (true) {
            const i$2 = _tmp$6;
            if (i$2 < len && cmp(_p$2, arr$2.buf[arr$2.start + i$2 | 0]) === 0) {
              _tmp$6 = i$2 + 1 | 0;
              continue;
            } else {
              i = i$2;
              break;
            }
          }
          _tmp = limit$3;
          _tmp$2 = _M0MPC15array12MutArrayView5sliceGiE(arr$2, i, len);
          _tmp$4 = _partitioned;
          _tmp$5 = balanced$2;
          continue;
        }
      }
      const left = _M0MPC15array12MutArrayView5sliceGiE(arr$2, 0, _pivot);
      const right = _M0MPC15array12MutArrayView5sliceGiE(arr$2, _pivot + 1 | 0, len);
      if ((left.end - left.start | 0) < (right.end - right.start | 0)) {
        _M0FPB22fixed__quick__sort__byGiE(left, cmp, pred$2, limit$3);
        _tmp = limit$3;
        _tmp$2 = right;
        _tmp$3 = arr$2.buf[arr$2.start + _pivot | 0];
        _tmp$4 = _partitioned;
        _tmp$5 = balanced$2;
        continue;
      } else {
        _M0FPB22fixed__quick__sort__byGiE(right, cmp, arr$2.buf[arr$2.start + _pivot | 0], limit$3);
        _tmp = limit$3;
        _tmp$2 = left;
        _tmp$4 = _partitioned;
        _tmp$5 = balanced$2;
        continue;
      }
    }
  }
  function _M0MPC15array12MutArrayView8sort__byGRP27mik1e806dxfkit6CutSegE(self, cmp) {
    _M0FPB22fixed__quick__sort__byGRP27mik1e806dxfkit6CutSegE(self, cmp, undefined, _M0FPB17fixed__get__limit(self.end - self.start | 0));
  }
  function _M0MPC15array12MutArrayView8sort__byGiE(self, cmp) {
    _M0FPB22fixed__quick__sort__byGiE(self, cmp, undefined, _M0FPB17fixed__get__limit(self.end - self.start | 0));
  }
  function _M0MPC15array5Array8sort__byGRP27mik1e806dxfkit6CutSegE(self, cmp) {
    const _bind = self.length;
    _M0MPC15array12MutArrayView8sort__byGRP27mik1e806dxfkit6CutSegE(new _M0TPB12MutArrayViewGRP27mik1e806dxfkit6CutSegE(self, 0, _bind), cmp);
  }
  function _M0MPC15array5Array8sort__byGiE(self, cmp) {
    const _bind = self.length;
    _M0MPC15array12MutArrayView8sort__byGiE(new _M0TPB12MutArrayViewGiE(self, 0, _bind), cmp);
  }
  function _M0MPC15array5Array4makeGiE(len, elem) {
    const arr = new Array(len);
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < len) {
        arr[i] = elem;
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return arr;
  }
  function _M0MPC15array5Array5clearGyE(self) {
    _M0MPC15array5Array28unsafe__truncate__to__lengthGyE(self, 0);
  }
  function _M0MPC15array5Array8containsGiE(self, value) {
    const _bind = self.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const v = self[_];
        if (v === value) {
          return true;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        return false;
      }
    }
  }
  function _M0MPC15array5Array8containsGsE(self, value) {
    const _bind = self.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const v = self[_];
        if (v === value) {
          return true;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        return false;
      }
    }
  }
  function _M0MPC15array5Array4joinGsE(self, separator) {
    return _M0MPC15array9ArrayView4joinGsE(new _M0TPB9ArrayViewGsE(self, 0, self.length), separator);
  }
  function _M0FPC28encoding4utf814encode_2einner(str, bom) {
    return _M0FPC28encoding4utf816encode__utf8__js(str.str, str.start, str.end - str.start | 0, bom);
  }
  function _M0FPC28encoding4utf821utf8__find__malformed(src, src_offset, src_length) {
    const view = _M0MPC15bytes5Bytes21clamped__view_2einner(src, src_offset, src_offset + src_length | 0);
    let _tmp = view;
    while (true) {
      const bytes = _tmp;
      let malformed;
      _L: {
        let rest;
        _L$2: {
          let rest$2;
          _L$3: {
            let rest$3;
            _L$4: {
              let rest$4;
              _L$5: {
                if ((bytes.end - bytes.start | 0) === 0) {
                  return -1;
                } else {
                  if ((bytes.end - bytes.start | 0) >= 8) {
                    const _x = bytes.buf[bytes.start];
                    if (_x <= 127) {
                      const _x$2 = bytes.buf[bytes.start + 1 | 0];
                      if (_x$2 <= 127) {
                        const _x$3 = bytes.buf[bytes.start + 2 | 0];
                        if (_x$3 <= 127) {
                          const _x$4 = bytes.buf[bytes.start + 3 | 0];
                          if (_x$4 <= 127) {
                            const _x$5 = bytes.buf[bytes.start + 4 | 0];
                            if (_x$5 <= 127) {
                              const _x$6 = bytes.buf[bytes.start + 5 | 0];
                              if (_x$6 <= 127) {
                                const _x$7 = bytes.buf[bytes.start + 6 | 0];
                                if (_x$7 <= 127) {
                                  const _x$8 = bytes.buf[bytes.start + 7 | 0];
                                  if (_x$8 <= 127) {
                                    const _x$9 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 8 | 0, bytes.end);
                                    _tmp = _x$9;
                                    continue;
                                  } else {
                                    const _x$9 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 1 | 0, bytes.end);
                                    rest$4 = _x$9;
                                    break _L$5;
                                  }
                                } else {
                                  const _x$8 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 1 | 0, bytes.end);
                                  rest$4 = _x$8;
                                  break _L$5;
                                }
                              } else {
                                const _x$7 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 1 | 0, bytes.end);
                                rest$4 = _x$7;
                                break _L$5;
                              }
                            } else {
                              const _x$6 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 1 | 0, bytes.end);
                              rest$4 = _x$6;
                              break _L$5;
                            }
                          } else {
                            const _x$5 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 1 | 0, bytes.end);
                            rest$4 = _x$5;
                            break _L$5;
                          }
                        } else {
                          const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 1 | 0, bytes.end);
                          rest$4 = _x$4;
                          break _L$5;
                        }
                      } else {
                        const _x$3 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 1 | 0, bytes.end);
                        rest$4 = _x$3;
                        break _L$5;
                      }
                    } else {
                      if (_x >= 194 && _x <= 223) {
                        const _x$2 = bytes.buf[bytes.start + 1 | 0];
                        if (_x$2 >= 128 && _x$2 <= 191) {
                          const _x$3 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 2 | 0, bytes.end);
                          rest$3 = _x$3;
                          break _L$4;
                        } else {
                          malformed = bytes;
                          break _L;
                        }
                      } else {
                        if (_x === 224) {
                          const _x$2 = bytes.buf[bytes.start + 1 | 0];
                          if (_x$2 >= 160 && _x$2 <= 191) {
                            const _x$3 = bytes.buf[bytes.start + 2 | 0];
                            if (_x$3 >= 128 && _x$3 <= 191) {
                              const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                              rest$2 = _x$4;
                              break _L$3;
                            } else {
                              malformed = bytes;
                              break _L;
                            }
                          } else {
                            malformed = bytes;
                            break _L;
                          }
                        } else {
                          if (_x >= 225 && _x <= 236) {
                            const _x$2 = bytes.buf[bytes.start + 1 | 0];
                            if (_x$2 >= 128 && _x$2 <= 191) {
                              const _x$3 = bytes.buf[bytes.start + 2 | 0];
                              if (_x$3 >= 128 && _x$3 <= 191) {
                                const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                                rest$2 = _x$4;
                                break _L$3;
                              } else {
                                malformed = bytes;
                                break _L;
                              }
                            } else {
                              malformed = bytes;
                              break _L;
                            }
                          } else {
                            if (_x === 237) {
                              const _x$2 = bytes.buf[bytes.start + 1 | 0];
                              if (_x$2 >= 128 && _x$2 <= 159) {
                                const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                if (_x$3 >= 128 && _x$3 <= 191) {
                                  const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                                  rest$2 = _x$4;
                                  break _L$3;
                                } else {
                                  malformed = bytes;
                                  break _L;
                                }
                              } else {
                                malformed = bytes;
                                break _L;
                              }
                            } else {
                              if (_x >= 238 && _x <= 239) {
                                const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                if (_x$2 >= 128 && _x$2 <= 191) {
                                  const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                  if (_x$3 >= 128 && _x$3 <= 191) {
                                    const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                                    rest$2 = _x$4;
                                    break _L$3;
                                  } else {
                                    malformed = bytes;
                                    break _L;
                                  }
                                } else {
                                  malformed = bytes;
                                  break _L;
                                }
                              } else {
                                if (_x === 240) {
                                  const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                  if (_x$2 >= 144 && _x$2 <= 191) {
                                    const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                    if (_x$3 >= 128 && _x$3 <= 191) {
                                      const _x$4 = bytes.buf[bytes.start + 3 | 0];
                                      if (_x$4 >= 128 && _x$4 <= 191) {
                                        const _x$5 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 4 | 0, bytes.end);
                                        rest = _x$5;
                                        break _L$2;
                                      } else {
                                        malformed = bytes;
                                        break _L;
                                      }
                                    } else {
                                      malformed = bytes;
                                      break _L;
                                    }
                                  } else {
                                    malformed = bytes;
                                    break _L;
                                  }
                                } else {
                                  if (_x >= 241 && _x <= 243) {
                                    const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                    if (_x$2 >= 128 && _x$2 <= 191) {
                                      const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                      if (_x$3 >= 128 && _x$3 <= 191) {
                                        const _x$4 = bytes.buf[bytes.start + 3 | 0];
                                        if (_x$4 >= 128 && _x$4 <= 191) {
                                          const _x$5 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 4 | 0, bytes.end);
                                          rest = _x$5;
                                          break _L$2;
                                        } else {
                                          malformed = bytes;
                                          break _L;
                                        }
                                      } else {
                                        malformed = bytes;
                                        break _L;
                                      }
                                    } else {
                                      malformed = bytes;
                                      break _L;
                                    }
                                  } else {
                                    if (_x === 244) {
                                      const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                      if (_x$2 >= 128 && _x$2 <= 143) {
                                        const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                        if (_x$3 >= 128 && _x$3 <= 191) {
                                          const _x$4 = bytes.buf[bytes.start + 3 | 0];
                                          if (_x$4 >= 128 && _x$4 <= 191) {
                                            const _x$5 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 4 | 0, bytes.end);
                                            rest = _x$5;
                                            break _L$2;
                                          } else {
                                            malformed = bytes;
                                            break _L;
                                          }
                                        } else {
                                          malformed = bytes;
                                          break _L;
                                        }
                                      } else {
                                        malformed = bytes;
                                        break _L;
                                      }
                                    } else {
                                      malformed = bytes;
                                      break _L;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } else {
                    const _x = bytes.buf[bytes.start];
                    if (_x >= 0 && _x <= 127) {
                      const _x$2 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 1 | 0, bytes.end);
                      rest$4 = _x$2;
                      break _L$5;
                    } else {
                      if ((bytes.end - bytes.start | 0) >= 2) {
                        if (_x >= 194 && _x <= 223) {
                          const _x$2 = bytes.buf[bytes.start + 1 | 0];
                          if (_x$2 >= 128 && _x$2 <= 191) {
                            const _x$3 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 2 | 0, bytes.end);
                            rest$3 = _x$3;
                            break _L$4;
                          } else {
                            (bytes.end - bytes.start | 0) >= 3;
                            malformed = bytes;
                            break _L;
                          }
                        } else {
                          if ((bytes.end - bytes.start | 0) >= 3) {
                            if (_x === 224) {
                              const _x$2 = bytes.buf[bytes.start + 1 | 0];
                              if (_x$2 >= 160 && _x$2 <= 191) {
                                const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                if (_x$3 >= 128 && _x$3 <= 191) {
                                  const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                                  rest$2 = _x$4;
                                  break _L$3;
                                } else {
                                  malformed = bytes;
                                  break _L;
                                }
                              } else {
                                malformed = bytes;
                                break _L;
                              }
                            } else {
                              if (_x >= 225 && _x <= 236) {
                                const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                if (_x$2 >= 128 && _x$2 <= 191) {
                                  const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                  if (_x$3 >= 128 && _x$3 <= 191) {
                                    const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                                    rest$2 = _x$4;
                                    break _L$3;
                                  } else {
                                    malformed = bytes;
                                    break _L;
                                  }
                                } else {
                                  malformed = bytes;
                                  break _L;
                                }
                              } else {
                                if (_x === 237) {
                                  const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                  if (_x$2 >= 128 && _x$2 <= 159) {
                                    const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                    if (_x$3 >= 128 && _x$3 <= 191) {
                                      const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                                      rest$2 = _x$4;
                                      break _L$3;
                                    } else {
                                      malformed = bytes;
                                      break _L;
                                    }
                                  } else {
                                    malformed = bytes;
                                    break _L;
                                  }
                                } else {
                                  if (_x >= 238 && _x <= 239) {
                                    const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                    if (_x$2 >= 128 && _x$2 <= 191) {
                                      const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                      if (_x$3 >= 128 && _x$3 <= 191) {
                                        const _x$4 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                                        rest$2 = _x$4;
                                        break _L$3;
                                      } else {
                                        malformed = bytes;
                                        break _L;
                                      }
                                    } else {
                                      malformed = bytes;
                                      break _L;
                                    }
                                  } else {
                                    if ((bytes.end - bytes.start | 0) >= 4) {
                                      if (_x === 240) {
                                        const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                        if (_x$2 >= 144 && _x$2 <= 191) {
                                          const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                          if (_x$3 >= 128 && _x$3 <= 191) {
                                            const _x$4 = bytes.buf[bytes.start + 3 | 0];
                                            if (_x$4 >= 128 && _x$4 <= 191) {
                                              const _x$5 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 4 | 0, bytes.end);
                                              rest = _x$5;
                                              break _L$2;
                                            } else {
                                              malformed = bytes;
                                              break _L;
                                            }
                                          } else {
                                            malformed = bytes;
                                            break _L;
                                          }
                                        } else {
                                          malformed = bytes;
                                          break _L;
                                        }
                                      } else {
                                        if (_x >= 241 && _x <= 243) {
                                          const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                          if (_x$2 >= 128 && _x$2 <= 191) {
                                            const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                            if (_x$3 >= 128 && _x$3 <= 191) {
                                              const _x$4 = bytes.buf[bytes.start + 3 | 0];
                                              if (_x$4 >= 128 && _x$4 <= 191) {
                                                const _x$5 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 4 | 0, bytes.end);
                                                rest = _x$5;
                                                break _L$2;
                                              } else {
                                                malformed = bytes;
                                                break _L;
                                              }
                                            } else {
                                              malformed = bytes;
                                              break _L;
                                            }
                                          } else {
                                            malformed = bytes;
                                            break _L;
                                          }
                                        } else {
                                          if (_x === 244) {
                                            const _x$2 = bytes.buf[bytes.start + 1 | 0];
                                            if (_x$2 >= 128 && _x$2 <= 143) {
                                              const _x$3 = bytes.buf[bytes.start + 2 | 0];
                                              if (_x$3 >= 128 && _x$3 <= 191) {
                                                const _x$4 = bytes.buf[bytes.start + 3 | 0];
                                                if (_x$4 >= 128 && _x$4 <= 191) {
                                                  const _x$5 = new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 4 | 0, bytes.end);
                                                  rest = _x$5;
                                                  break _L$2;
                                                } else {
                                                  malformed = bytes;
                                                  break _L;
                                                }
                                              } else {
                                                malformed = bytes;
                                                break _L;
                                              }
                                            } else {
                                              malformed = bytes;
                                              break _L;
                                            }
                                          } else {
                                            malformed = bytes;
                                            break _L;
                                          }
                                        }
                                      }
                                    } else {
                                      malformed = bytes;
                                      break _L;
                                    }
                                  }
                                }
                              }
                            }
                          } else {
                            malformed = bytes;
                            break _L;
                          }
                        }
                      } else {
                        malformed = bytes;
                        break _L;
                      }
                    }
                  }
                }
              }
              _tmp = rest$4;
              continue;
            }
            _tmp = rest$3;
            continue;
          }
          _tmp = rest$2;
          continue;
        }
        _tmp = rest;
        continue;
      }
      return malformed.start - src_offset | 0;
    }
  }
  function _M0FPC28encoding4utf825strict__malformed__suffix(bytes) {
    const input = bytes.buf;
    const src_offset = bytes.start;
    const src_length = bytes.end - bytes.start | 0;
    const malformed_offset = _M0FPC28encoding4utf821utf8__find__malformed(input, src_offset, src_length);
    return _M0MPC15bytes9BytesView21clamped__view_2einner(bytes, malformed_offset, undefined);
  }
  function _M0FPC28encoding4utf815drop__utf8__bom(bytes, ignore_bom) {
    _L: {
      if (ignore_bom) {
        _L$2: {
          if ((bytes.end - bytes.start | 0) >= 3) {
            const _x = bytes.buf[bytes.start];
            if (_x === 239) {
              const _x$2 = bytes.buf[bytes.start + 1 | 0];
              if (_x$2 === 187) {
                const _x$3 = bytes.buf[bytes.start + 2 | 0];
                if (_x$3 === 191) {
                  return new _M0TPC15bytes9BytesView(bytes.buf, bytes.start + 3 | 0, bytes.end);
                } else {
                  break _L$2;
                }
              } else {
                break _L$2;
              }
            } else {
              break _L$2;
            }
          } else {
            break _L$2;
          }
        }
        break _L;
      } else {
        break _L;
      }
    }
    return bytes;
  }
  function _M0FPC28encoding4utf814decode_2einner(bytes, ignore_bom) {
    const result = _M0FPC28encoding4utf816decode__utf8__js(bytes.buf, bytes.start, bytes.end - bytes.start | 0, !ignore_bom);
    if (result.length === 1) {
      return new _M0DTPC16result6ResultGsRPC28encoding4utf89MalformedE2Ok(0 >>> 0 < result.length ? result[0] : $oob());
    } else {
      const bytes$2 = _M0FPC28encoding4utf815drop__utf8__bom(bytes, ignore_bom);
      return new _M0DTPC16result6ResultGsRPC28encoding4utf89MalformedE3Err(new _M0DTPC15error5Error60moonbitlang_2fcore_2fencoding_2futf8_2eMalformed_2eMalformed(_M0FPC28encoding4utf825strict__malformed__suffix(bytes$2)));
    }
  }
  function _M0FPC28encoding4utf821decode__lossy_2einner(bytes, ignore_bom) {
    return _M0FPC28encoding4utf823decode__utf8__lossy__js(bytes.buf, bytes.start, bytes.end - bytes.start | 0, !ignore_bom);
  }
  function _M0FPC16buffer24buffer__growth__capacity(current, len, required) {
    if (required < len) {
      $panic();
    }
    const start = current <= 0 ? 1 : current;
    let _tmp = start;
    while (true) {
      const space = _tmp;
      if (space >= required) {
        return space;
      }
      const next = Math.imul(space, 2) | 0;
      if (next <= space) {
        return required;
      }
      _tmp = next;
      continue;
    }
  }
  function _M0MPC16buffer6Buffer4grow(self, required) {
    const new_capacity = _M0FPC16buffer24buffer__growth__capacity(self.data.length, self.len, required);
    const new_data = _M0MPC15array10FixedArray23make__and__blit_2einnerGyE(self.data, new_capacity, 0, self.len, 0, 0);
    self.data = new_data;
  }
  function _M0MPC16buffer6Buffer9to__bytes(self) {
    return _M0MPC15bytes5Bytes11from__array(_M0MPC15array10FixedArray21clamped__view_2einnerGyE(self.data, 0, self.len));
  }
  function _M0MPC16buffer6Buffer14Buffer_2einner(size_hint) {
    const initial = size_hint < 1 ? 1 : size_hint;
    const data = $makebytes(initial, 0);
    return new _M0TPC16buffer6Buffer(data, 0);
  }
  function _M0MPC16buffer6Buffer11write__byte(self, value) {
    if (self.len >= self.data.length) {
      _M0MPC16buffer6Buffer4grow(self, self.len + 1 | 0);
    }
    self.data[self.len] = value;
    self.len = self.len + 1 | 0;
  }
  function _M0FPC28internal7strconv9base__errGUiRPC16string10StringViewbEE() {
    return new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv14base__err__str));
  }
  function _M0FPC28internal7strconv25check__and__consume__base(view, base) {
    if (base === 0) {
      _L: {
        let rest;
        _L$2: {
          let rest$2;
          _L$3: {
            let rest$3;
            _L$4: {
              if ((view.end - view.start | 0) >= 2) {
                const _x = view.str.charCodeAt(view.start);
                if (_x === 48) {
                  const _x$2 = view.str.charCodeAt(view.start + 1 | 0);
                  switch (_x$2) {
                    case 120: {
                      const _x$3 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      rest$3 = _x$3;
                      break _L$4;
                    }
                    case 88: {
                      const _x$4 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      rest$3 = _x$4;
                      break _L$4;
                    }
                    case 111: {
                      const _x$5 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      rest$2 = _x$5;
                      break _L$3;
                    }
                    case 79: {
                      const _x$6 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      rest$2 = _x$6;
                      break _L$3;
                    }
                    case 98: {
                      const _x$7 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      rest = _x$7;
                      break _L$2;
                    }
                    case 66: {
                      const _x$8 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      rest = _x$8;
                      break _L$2;
                    }
                    default: {
                      break _L;
                    }
                  }
                } else {
                  break _L;
                }
              } else {
                break _L;
              }
            }
            return new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok({ _0: 16, _1: rest$3, _2: true });
          }
          return new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok({ _0: 8, _1: rest$2, _2: true });
        }
        return new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok({ _0: 2, _1: rest, _2: true });
      }
      return new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok({ _0: 10, _1: view, _2: false });
    } else {
      _L: {
        let rest;
        _L$2: {
          let rest$2;
          _L$3: {
            let rest$3;
            _L$4: {
              if ((view.end - view.start | 0) >= 2) {
                const _x = view.str.charCodeAt(view.start);
                if (_x === 48) {
                  const _x$2 = view.str.charCodeAt(view.start + 1 | 0);
                  switch (_x$2) {
                    case 120: {
                      const _x$3 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      if (base === 16) {
                        rest$3 = _x$3;
                        break _L$4;
                      } else {
                        break _L;
                      }
                    }
                    case 88: {
                      const _x$4 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      if (base === 16) {
                        rest$3 = _x$4;
                        break _L$4;
                      } else {
                        break _L;
                      }
                    }
                    case 111: {
                      const _x$5 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      if (base === 8) {
                        rest$2 = _x$5;
                        break _L$3;
                      } else {
                        break _L;
                      }
                    }
                    case 79: {
                      const _x$6 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      if (base === 8) {
                        rest$2 = _x$6;
                        break _L$3;
                      } else {
                        break _L;
                      }
                    }
                    case 98: {
                      const _x$7 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      if (base === 2) {
                        rest = _x$7;
                        break _L$2;
                      } else {
                        break _L;
                      }
                    }
                    case 66: {
                      const _x$8 = new _M0TPC16string10StringView(view.str, view.start + 2 | 0, view.end);
                      if (base === 2) {
                        rest = _x$8;
                        break _L$2;
                      } else {
                        break _L;
                      }
                    }
                    default: {
                      break _L;
                    }
                  }
                } else {
                  break _L;
                }
              } else {
                break _L;
              }
            }
            return new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok({ _0: 16, _1: rest$3, _2: true });
          }
          return new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok({ _0: 8, _1: rest$2, _2: true });
        }
        return new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok({ _0: 2, _1: rest, _2: true });
      }
      return base >= 2 && base <= 36 ? new _M0DTPC16result6ResultGUiRPC16string10StringViewbERPC15error5ErrorE2Ok({ _0: base, _1: view, _2: false }) : _M0FPC28internal7strconv9base__errGUiRPC16string10StringViewbEE();
    }
  }
  function _M0FPC28internal7strconv10range__errGuE() {
    return new _M0DTPC16result6ResultGuRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv15range__err__str));
  }
  function _M0FPC28internal7strconv11syntax__errGdE() {
    return new _M0DTPC16result6ResultGdRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
  }
  function _M0FPC28internal7strconv11syntax__errGiE() {
    return new _M0DTPC16result6ResultGiRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
  }
  function _M0FPC28internal7strconv11syntax__errGuE() {
    return new _M0DTPC16result6ResultGuRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
  }
  function _M0FPC28internal7strconv11syntax__errGlE() {
    return new _M0DTPC16result6ResultGlRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
  }
  function _M0FPC28internal7strconv11syntax__errGORPC28internal7strconv6NumberE() {
    return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPB7FailureE3Err(new _M0DTPC15error5Error48moonbitlang_2fcore_2fbuiltin_2eFailure_2eFailure(_M0FPC28internal7strconv16syntax__err__str));
  }
  function _M0EPC16string10StringViewPC28internal7strconv12fold__digitsGmE(self, init, f) {
    let _tmp = self;
    let _tmp$2 = init;
    let _tmp$3 = 0;
    while (true) {
      const str = _tmp;
      const ret = _tmp$2;
      const len = _tmp$3;
      _L: {
        if ((str.end - str.start | 0) >= 1) {
          const _x = str.str.charCodeAt(str.start);
          if (_x >= 48 && _x <= 57) {
            const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
            _tmp = _x$2;
            _tmp$2 = f(_x - 48 | 0, ret);
            _tmp$3 = len + 1 | 0;
            continue;
          } else {
            if (_x === 95) {
              const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
              _tmp = _x$2;
              continue;
            } else {
              break _L;
            }
          }
        } else {
          break _L;
        }
      }
      return { _0: str, _1: ret, _2: len };
    }
  }
  function _M0FPC28internal7strconv13parse__digits(s, x) {
    return _M0EPC16string10StringViewPC28internal7strconv12fold__digitsGmE(s, x, (digit, acc) => BigInt.asUintN(64, BigInt.asUintN(64, acc * 10n) + BigInt.asUintN(64, BigInt(digit >>> 0))));
  }
  function _M0FPC28internal7strconv20try__parse__19digits(s, x) {
    let x$2 = x;
    let len = 0;
    let _tmp = s;
    while (true) {
      const s$2 = _tmp;
      let s$3;
      _L: {
        if ((s$2.end - s$2.start | 0) >= 1) {
          const _x = s$2.str.charCodeAt(s$2.start);
          if (_x >= 48 && _x <= 57) {
            const _x$2 = new _M0TPC16string10StringView(s$2.str, s$2.start + 1 | 0, s$2.end);
            if (BigInt.asUintN(64, x$2) < BigInt.asUintN(64, _M0FPC28internal7strconv17min__19digit__int)) {
              len = len + 1 | 0;
              x$2 = BigInt.asUintN(64, BigInt.asUintN(64, x$2 * 10n) + BigInt.asUintN(64, BigInt((_x - 48 | 0) >>> 0)));
              _tmp = _x$2;
              continue;
            } else {
              s$3 = s$2;
              break _L;
            }
          } else {
            if (_x === 95) {
              const _x$2 = new _M0TPC16string10StringView(s$2.str, s$2.start + 1 | 0, s$2.end);
              _tmp = _x$2;
              continue;
            } else {
              s$3 = s$2;
              break _L;
            }
          }
        } else {
          s$3 = s$2;
          break _L;
        }
      }
      return { _0: s$3, _1: x$2, _2: len };
    }
  }
  function _M0FPC28internal7strconv17parse__scientific(s) {
    let s$2 = s;
    let neg_exp = false;
    let rest;
    let ch;
    _L: {
      _L$2: {
        const _bind = s$2;
        if ((_bind.end - _bind.start | 0) >= 1) {
          const _x = _bind.str.charCodeAt(_bind.start);
          switch (_x) {
            case 43: {
              const _x$2 = new _M0TPC16string10StringView(_bind.str, _bind.start + 1 | 0, _bind.end);
              rest = _x$2;
              ch = _x;
              break _L$2;
            }
            case 45: {
              const _x$3 = new _M0TPC16string10StringView(_bind.str, _bind.start + 1 | 0, _bind.end);
              rest = _x$3;
              ch = _x;
              break _L$2;
            }
          }
        }
        break _L;
      }
      neg_exp = ch === 45;
      s$2 = rest;
    }
    _L$2: {
      const _bind = s$2;
      if ((_bind.end - _bind.start | 0) >= 1) {
        const _x = _bind.str.charCodeAt(_bind.start);
        if (_x >= 48 && _x <= 57) {
          const _bind$2 = _M0EPC16string10StringViewPC28internal7strconv12fold__digitsGmE(s$2, _M0FPC28internal7strconv17parse__scientificN8exp__numS354, (digit, exp_num) => BigInt.asIntN(64, exp_num) < BigInt.asIntN(64, 65536n) ? BigInt.asUintN(64, BigInt.asUintN(64, 10n * exp_num) + BigInt.asUintN(64, BigInt(digit))) : exp_num);
          const _s = _bind$2._0;
          const _exp_num = _bind$2._1;
          return neg_exp ? { _0: _s, _1: BigInt.asUintN(64, -_exp_num) } : { _0: _s, _1: _exp_num };
        } else {
          break _L$2;
        }
      } else {
        break _L$2;
      }
    }
    return undefined;
  }
  function _M0FPC28internal7strconv13parse__number(s) {
    let s$2;
    let negative;
    _L: {
      let rest;
      _L$2: {
        if ((s.end - s.start | 0) >= 1) {
          const _x = s.str.charCodeAt(s.start);
          switch (_x) {
            case 45: {
              const _x$2 = new _M0TPC16string10StringView(s.str, s.start + 1 | 0, s.end);
              s$2 = _x$2;
              negative = true;
              break _L;
            }
            case 43: {
              const _x$3 = new _M0TPC16string10StringView(s.str, s.start + 1 | 0, s.end);
              rest = _x$3;
              break _L$2;
            }
            default: {
              rest = s;
              break _L$2;
            }
          }
        } else {
          rest = s;
          break _L$2;
        }
      }
      s$2 = rest;
      negative = false;
      break _L;
    }
    if ((s$2.end - s$2.start | 0) === 0) {
      return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(undefined);
    }
    const _bind = _M0FPC28internal7strconv13parse__digits(s$2, 0n);
    const _s = _bind._0;
    const _mantissa = _bind._1;
    const _consumed = _bind._2;
    let mantissa = _mantissa;
    let s$3 = _s;
    let n_digits = _consumed;
    let n_after_dot = 0;
    let exponent = 0n;
    const _bind$2 = s$3;
    if ((_bind$2.end - _bind$2.start | 0) >= 1) {
      const _x = _bind$2.str.charCodeAt(_bind$2.start);
      if (_x === 46) {
        const _x$2 = new _M0TPC16string10StringView(_bind$2.str, _bind$2.start + 1 | 0, _bind$2.end);
        s$3 = _x$2;
        const _bind$3 = _M0FPC28internal7strconv13parse__digits(s$3, mantissa);
        const _new_s = _bind$3._0;
        const _new_mantissa = _bind$3._1;
        const _consumed_digit = _bind$3._2;
        s$3 = _new_s;
        mantissa = _new_mantissa;
        n_after_dot = _consumed_digit;
        exponent = BigInt.asUintN(64, -BigInt.asUintN(64, BigInt(n_after_dot)));
      }
    }
    n_digits = n_digits + n_after_dot | 0;
    if (n_digits === 0) {
      return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(undefined);
    }
    let exp_number = 0n;
    let rest;
    _L$2: {
      _L$3: {
        const _bind$3 = s$3;
        if ((_bind$3.end - _bind$3.start | 0) >= 1) {
          const _x = _bind$3.str.charCodeAt(_bind$3.start);
          switch (_x) {
            case 101: {
              const _x$2 = new _M0TPC16string10StringView(_bind$3.str, _bind$3.start + 1 | 0, _bind$3.end);
              rest = _x$2;
              break _L$3;
            }
            case 69: {
              const _x$3 = new _M0TPC16string10StringView(_bind$3.str, _bind$3.start + 1 | 0, _bind$3.end);
              rest = _x$3;
              break _L$3;
            }
          }
        }
        break _L$2;
      }
      const _bind$3 = _M0FPC28internal7strconv17parse__scientific(rest);
      let _bind$4;
      if (_bind$3 === undefined) {
        return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(undefined);
      } else {
        const _Some = _bind$3;
        _bind$4 = _Some;
      }
      const _new_s = _bind$4._0;
      const _exp_number_val = _bind$4._1;
      s$3 = _new_s;
      exp_number = _exp_number_val;
      exponent = BigInt.asUintN(64, exponent + exp_number);
    }
    const _bind$3 = s$3;
    if ((_bind$3.end - _bind$3.start | 0) === 0) {
      if (n_digits <= 19) {
        return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(new _M0TPC28internal7strconv6Number(exponent, mantissa, negative, false));
      }
      n_digits = n_digits - 19 | 0;
      let many_digits = false;
      let _tmp = s.str;
      let _tmp$2 = s.start;
      let _tmp$3 = s.end;
      _L$3: while (true) {
        const s_str = _tmp;
        const s_start = _tmp$2;
        const s_end = _tmp$3;
        _L$4: {
          let rest$2;
          let ch;
          _L$5: {
            if ((s_end - s_start | 0) >= 1) {
              const _x = s_str.charCodeAt(s_start);
              switch (_x) {
                case 48: {
                  const _x$2 = new _M0TPC16string10StringView(s_str, s_start + 1 | 0, s_end);
                  rest$2 = _x$2;
                  ch = _x;
                  break _L$5;
                }
                case 46: {
                  const _x$3 = new _M0TPC16string10StringView(s_str, s_start + 1 | 0, s_end);
                  rest$2 = _x$3;
                  ch = _x;
                  break _L$5;
                }
                default: {
                  break _L$4;
                }
              }
            } else {
              break _L$4;
            }
          }
          n_digits = n_digits - ((ch - 46 | 0) / 2 | 0) | 0;
          _tmp = rest$2.str;
          _tmp$2 = rest$2.start;
          _tmp$3 = rest$2.end;
          continue;
        }
        break;
      }
      let mantissa$2 = mantissa;
      if (n_digits > 0) {
        many_digits = true;
        mantissa$2 = 0n;
        const _bind$4 = _M0FPC28internal7strconv20try__parse__19digits(s, mantissa$2);
        const _s$2 = _bind$4._0;
        const _new_mantissa = _bind$4._1;
        const _consumed_digit = _bind$4._2;
        mantissa$2 = _new_mantissa;
        let _tmp$4;
        if (BigInt.asUintN(64, mantissa$2) >= BigInt.asUintN(64, _M0FPC28internal7strconv17min__19digit__int)) {
          _tmp$4 = _consumed_digit;
        } else {
          if (_M0MPC16string6String24char__length__ge_2einner(_s$2.str, 1, _s$2.start, _s$2.end)) {
            const _tmp$5 = _s$2.str;
            const _bind$5 = _M0MPC16string6String29offset__of__nth__char_2einner(_s$2.str, 1, _s$2.start, _s$2.end);
            let _tmp$6;
            if (_bind$5 === undefined) {
              _tmp$6 = _s$2.end;
            } else {
              const _Some = _bind$5;
              _tmp$6 = _Some;
            }
            const _x = new _M0TPC16string10StringView(_tmp$5, _tmp$6, _s$2.end);
            const _bind$6 = _M0FPC28internal7strconv20try__parse__19digits(_x, mantissa$2);
            const _new_mantissa$2 = _bind$6._1;
            const _consumed_digit$2 = _bind$6._2;
            mantissa$2 = _new_mantissa$2;
            _tmp$4 = _consumed_digit$2;
          } else {
            return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(undefined);
          }
        }
        exponent = BigInt.asUintN(64, BigInt(_tmp$4));
        exponent = BigInt.asUintN(64, exponent + exp_number);
      }
      return new _M0DTPC16result6ResultGORPC28internal7strconv6NumberRPC15error5ErrorE2Ok(new _M0TPC28internal7strconv6Number(exponent, mantissa$2, negative, many_digits));
    } else {
      return _M0FPC28internal7strconv11syntax__errGORPC28internal7strconv6NumberE();
    }
  }
  function _M0FPC28internal7strconv15parse__inf__nan(rest) {
    let pos;
    let rest$2;
    _L: {
      let rest$3;
      _L$2: {
        if ((rest.end - rest.start | 0) >= 1) {
          const _x = rest.str.charCodeAt(rest.start);
          switch (_x) {
            case 45: {
              const _x$2 = new _M0TPC16string10StringView(rest.str, rest.start + 1 | 0, rest.end);
              pos = false;
              rest$2 = _x$2;
              break _L;
            }
            case 43: {
              const _x$3 = new _M0TPC16string10StringView(rest.str, rest.start + 1 | 0, rest.end);
              rest$3 = _x$3;
              break _L$2;
            }
            default: {
              rest$3 = rest;
              break _L$2;
            }
          }
        } else {
          rest$3 = rest;
          break _L$2;
        }
      }
      pos = true;
      rest$2 = rest$3;
      break _L;
    }
    let _cursor_295 = 0;
    const _input_end_297 = rest$2.end - rest$2.start | 0;
    const _start_296 = _cursor_295;
    let _accept_state_298 = -1;
    let _match_end_299 = -1;
    let _state_300 = 2;
    while (true) {
      if (_state_300 !== 14) {
        if (_state_300 < 2) {
          _accept_state_298 = _state_300;
          _match_end_299 = _cursor_295;
        }
        const _tmp = Math.imul(_state_300, 8) | 0;
        let _next_char_303;
        if (_cursor_295 < _input_end_297) {
          const _char_302 = rest$2.str.charCodeAt(rest$2.start + _cursor_295 | 0);
          _cursor_295 = _cursor_295 + 1 | 0;
          _next_char_303 = _char_302;
        } else {
          _next_char_303 = -1;
        }
        const _p = _tmp + (_next_char_303 < 90 ? (_next_char_303 < 73 ? (_next_char_303 < 66 ? (_next_char_303 < 0 ? 0 : _next_char_303 > 64 ? 1 : 7) : _next_char_303 > 69 ? (_next_char_303 < 71 ? 2 : 7) : 7) : _next_char_303 > 73 ? (_next_char_303 < 84 ? (_next_char_303 < 78 ? 7 : _next_char_303 > 78 ? 7 : 4) : _next_char_303 > 84 ? (_next_char_303 < 89 ? 7 : 6) : 5) : 3) : _next_char_303 > 96 ? (_next_char_303 < 110 ? (_next_char_303 < 103 ? (_next_char_303 < 98 ? 1 : _next_char_303 > 101 ? 2 : 7) : _next_char_303 > 104 ? (_next_char_303 < 106 ? 3 : 7) : 7) : _next_char_303 > 110 ? (_next_char_303 < 117 ? (_next_char_303 < 116 ? 7 : 5) : _next_char_303 > 120 ? (_next_char_303 < 122 ? 6 : 7) : 7) : 4) : 7) | 0;
        _state_300 = _M0FPC28internal7strconv15parse__inf__nanN25_2atransition__table__304S312[_p];
        continue;
      } else {
        break;
      }
    }
    const _bind = _accept_state_298;
    switch (_bind) {
      case 0: {
        _cursor_295 = _match_end_299;
        return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(_M0FPC16double14not__a__number);
      }
      case 1: {
        _cursor_295 = _match_end_299;
        return pos ? new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(_M0FPC16double8infinity) : new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(_M0FPC16double13neg__infinity);
      }
      default: {
        _cursor_295 = _start_296;
        return _M0FPC28internal7strconv11syntax__errGdE();
      }
    }
  }
  function _M0FPC28internal7strconv12checked__mul(a, b) {
    if (BigInt.asUintN(64, a) === BigInt.asUintN(64, 0n) || BigInt.asUintN(64, b) === BigInt.asUintN(64, 0n)) {
      return _M0FPC28internal7strconv12checked__mulN6constrS1163;
    }
    if (BigInt.asUintN(64, a) === BigInt.asUintN(64, 1n)) {
      return b;
    }
    if (BigInt.asUintN(64, b) === BigInt.asUintN(64, 1n)) {
      return a;
    }
    if ($i64_clz(b) === 0 || $i64_clz(a) === 0) {
      return undefined;
    }
    if (b === 0n) {
      $panic();
    }
    const quotient = BigInt.asUintN(64, BigInt.asUintN(64, 18446744073709551615n) / BigInt.asUintN(64, b));
    if (BigInt.asUintN(64, a) > BigInt.asUintN(64, quotient)) {
      return undefined;
    }
    return BigInt.asUintN(64, a * b);
  }
  function _M0FPC28internal7strconv19overflow__threshold(base, neg) {
    if (!neg) {
      if (base === 10) {
        return 922337203685477581n;
      } else {
        if (base === 16) {
          return 576460752303423488n;
        } else {
          const _tmp = BigInt.asUintN(64, BigInt(base));
          if (_tmp === 0n) {
            $panic();
          }
          return BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asIntN(64, 9223372036854775807n) / BigInt.asIntN(64, _tmp)) + 1n);
        }
      }
    } else {
      if (base === 10) {
        return 17524406870024074036n;
      } else {
        if (base === 16) {
          return 17870283321406128128n;
        } else {
          const _tmp = BigInt.asUintN(64, BigInt(base));
          if (_tmp === 0n) {
            $panic();
          }
          return BigInt.asUintN(64, BigInt.asIntN(64, 9223372036854775808n) / BigInt.asIntN(64, _tmp));
        }
      }
    }
  }
  function _M0FPC28internal7strconv20parse__int64_2einner(str, base) {
    if (_M0IP016_24default__implPB2Eq10not__equalGRPC16string10StringViewE(str, new _M0TPC16string10StringView(_M0FPC28internal7strconv20parse__int64_2einnerN7_2abindS681, 0, _M0FPC28internal7strconv20parse__int64_2einnerN7_2abindS681.length))) {
      let neg;
      let rest;
      _L: {
        let rest$2;
        _L$2: {
          if ((str.end - str.start | 0) >= 1) {
            const _x = str.str.charCodeAt(str.start);
            switch (_x) {
              case 43: {
                const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
                neg = false;
                rest = _x$2;
                break _L;
              }
              case 45: {
                const _x$3 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
                neg = true;
                rest = _x$3;
                break _L;
              }
              default: {
                rest$2 = str;
                break _L$2;
              }
            }
          } else {
            rest$2 = str;
            break _L$2;
          }
        }
        neg = false;
        rest = rest$2;
        break _L;
      }
      const _bind = _M0FPC28internal7strconv25check__and__consume__base(rest, base);
      let _bind$2;
      if (_bind.$tag === 1) {
        const _ok = _bind;
        _bind$2 = _ok._0;
      } else {
        return _bind;
      }
      const _num_base = _bind$2._0;
      const _rest = _bind$2._1;
      const _allow_underscore = _bind$2._2;
      const overflow_threshold = _M0FPC28internal7strconv19overflow__threshold(_num_base, neg);
      let has_digit;
      if ((_rest.end - _rest.start | 0) >= 1) {
        const _x = _rest.str.charCodeAt(_rest.start);
        if (_x >= 48 && _x <= 57) {
          has_digit = true;
        } else {
          if (_x >= 97 && _x <= 122) {
            has_digit = true;
          } else {
            if (_x >= 65 && _x <= 90) {
              has_digit = true;
            } else {
              if ((_rest.end - _rest.start | 0) >= 2) {
                if (_x === 95) {
                  const _x$2 = _rest.str.charCodeAt(_rest.start + 1 | 0);
                  has_digit = _x$2 >= 48 && _x$2 <= 57 ? true : _x$2 >= 97 && _x$2 <= 122 ? true : _x$2 >= 65 && _x$2 <= 90;
                } else {
                  has_digit = false;
                }
              } else {
                has_digit = false;
              }
            }
          }
        }
      } else {
        has_digit = false;
      }
      if (has_digit) {
        let _tmp;
        let _tmp$2 = _rest;
        let _tmp$3 = 0n;
        let _tmp$4 = _allow_underscore;
        while (true) {
          const rest$2 = _tmp$2;
          const acc = _tmp$3;
          const allow_underscore = _tmp$4;
          let acc$2;
          let rest$3;
          let c;
          _L$2: {
            _L$3: {
              if ((rest$2.end - rest$2.start | 0) === 1) {
                const _x = rest$2.str.charCodeAt(rest$2.start);
                if (_x === 95) {
                  const _bind$3 = _M0FPC28internal7strconv11syntax__errGuE();
                  if (_bind$3.$tag === 1) {
                    const _ok = _bind$3;
                    _ok._0;
                  } else {
                    return _bind$3;
                  }
                } else {
                  const _c = _M0MPC16string6String16unsafe__char__at(rest$2.str, _M0MPC16string6String29offset__of__nth__char_2einner(rest$2.str, 0, rest$2.start, rest$2.end));
                  const _tmp$5 = rest$2.str;
                  const _bind$3 = _M0MPC16string6String29offset__of__nth__char_2einner(rest$2.str, 1, rest$2.start, rest$2.end);
                  let _tmp$6;
                  if (_bind$3 === undefined) {
                    _tmp$6 = rest$2.end;
                  } else {
                    const _Some = _bind$3;
                    _tmp$6 = _Some;
                  }
                  const _x$2 = new _M0TPC16string10StringView(_tmp$5, _tmp$6, rest$2.end);
                  acc$2 = acc;
                  rest$3 = _x$2;
                  c = _c;
                  break _L$3;
                }
              } else {
                if ((rest$2.end - rest$2.start | 0) >= 1) {
                  const _x = rest$2.str.charCodeAt(rest$2.start);
                  if (_x === 95) {
                    if (allow_underscore === false) {
                      const _bind$3 = _M0FPC28internal7strconv11syntax__errGuE();
                      if (_bind$3.$tag === 1) {
                        const _ok = _bind$3;
                        _ok._0;
                      } else {
                        return _bind$3;
                      }
                    } else {
                      const _x$2 = new _M0TPC16string10StringView(rest$2.str, rest$2.start + 1 | 0, rest$2.end);
                      _tmp$2 = _x$2;
                      _tmp$4 = false;
                      continue;
                    }
                  } else {
                    const _c = _M0MPC16string6String16unsafe__char__at(rest$2.str, _M0MPC16string6String29offset__of__nth__char_2einner(rest$2.str, 0, rest$2.start, rest$2.end));
                    const _tmp$5 = rest$2.str;
                    const _bind$3 = _M0MPC16string6String29offset__of__nth__char_2einner(rest$2.str, 1, rest$2.start, rest$2.end);
                    let _tmp$6;
                    if (_bind$3 === undefined) {
                      _tmp$6 = rest$2.end;
                    } else {
                      const _Some = _bind$3;
                      _tmp$6 = _Some;
                    }
                    const _x$2 = new _M0TPC16string10StringView(_tmp$5, _tmp$6, rest$2.end);
                    acc$2 = acc;
                    rest$3 = _x$2;
                    c = _c;
                    break _L$3;
                  }
                } else {
                  _tmp = acc;
                  break;
                }
              }
              break _L$2;
            }
            const c$2 = c;
            let d;
            if (c$2 >= 48 && c$2 <= 57) {
              d = c$2 - 48 | 0;
            } else {
              if (c$2 >= 97 && c$2 <= 122) {
                d = c$2 + -87 | 0;
              } else {
                if (c$2 >= 65 && c$2 <= 90) {
                  d = c$2 + -55 | 0;
                } else {
                  const _bind$3 = _M0FPC28internal7strconv11syntax__errGiE();
                  if (_bind$3.$tag === 1) {
                    const _ok = _bind$3;
                    d = _ok._0;
                  } else {
                    return _bind$3;
                  }
                }
              }
            }
            if (d < _num_base) {
              if (neg) {
                if (BigInt.asIntN(64, acc$2) >= BigInt.asIntN(64, overflow_threshold)) {
                  const next_acc = BigInt.asUintN(64, BigInt.asUintN(64, acc$2 * BigInt.asUintN(64, BigInt(_num_base))) - BigInt.asUintN(64, BigInt(d)));
                  if (BigInt.asIntN(64, next_acc) <= BigInt.asIntN(64, acc$2)) {
                    _tmp$2 = rest$3;
                    _tmp$3 = next_acc;
                    _tmp$4 = true;
                    continue;
                  } else {
                    const _bind$3 = _M0FPC28internal7strconv10range__errGuE();
                    if (_bind$3.$tag === 1) {
                      const _ok = _bind$3;
                      _ok._0;
                    } else {
                      return _bind$3;
                    }
                  }
                } else {
                  const _bind$3 = _M0FPC28internal7strconv10range__errGuE();
                  if (_bind$3.$tag === 1) {
                    const _ok = _bind$3;
                    _ok._0;
                  } else {
                    return _bind$3;
                  }
                }
              } else {
                if (BigInt.asIntN(64, acc$2) < BigInt.asIntN(64, overflow_threshold)) {
                  const next_acc = BigInt.asUintN(64, BigInt.asUintN(64, acc$2 * BigInt.asUintN(64, BigInt(_num_base))) + BigInt.asUintN(64, BigInt(d)));
                  if (BigInt.asIntN(64, next_acc) >= BigInt.asIntN(64, acc$2)) {
                    _tmp$2 = rest$3;
                    _tmp$3 = next_acc;
                    _tmp$4 = true;
                    continue;
                  } else {
                    const _bind$3 = _M0FPC28internal7strconv10range__errGuE();
                    if (_bind$3.$tag === 1) {
                      const _ok = _bind$3;
                      _ok._0;
                    } else {
                      return _bind$3;
                    }
                  }
                } else {
                  const _bind$3 = _M0FPC28internal7strconv10range__errGuE();
                  if (_bind$3.$tag === 1) {
                    const _ok = _bind$3;
                    _ok._0;
                  } else {
                    return _bind$3;
                  }
                }
              }
            } else {
              const _bind$3 = _M0FPC28internal7strconv11syntax__errGuE();
              if (_bind$3.$tag === 1) {
                const _ok = _bind$3;
                _ok._0;
              } else {
                return _bind$3;
              }
            }
          }
          continue;
        }
        return new _M0DTPC16result6ResultGlRPC15error5ErrorE2Ok(_tmp);
      } else {
        return _M0FPC28internal7strconv11syntax__errGlE();
      }
    } else {
      return _M0FPC28internal7strconv11syntax__errGlE();
    }
  }
  function _M0FPC28internal7strconv18parse__int_2einner(str, base) {
    const _bind = _M0FPC28internal7strconv20parse__int64_2einner(str, base);
    let n;
    if (_bind.$tag === 1) {
      const _ok = _bind;
      n = _ok._0;
    } else {
      return _bind;
    }
    if (BigInt.asIntN(64, n) < BigInt.asIntN(64, 18446744071562067968n) || BigInt.asIntN(64, n) > BigInt.asIntN(64, 2147483647n)) {
      const _bind$2 = _M0FPC28internal7strconv10range__errGuE();
      if (_bind$2.$tag === 1) {
        const _ok = _bind$2;
        _ok._0;
      } else {
        return _bind$2;
      }
    }
    return new _M0DTPC16result6ResultGiRPC15error5ErrorE2Ok(Number(BigInt.asIntN(32, n)) | 0);
  }
  function _M0FPC28internal7strconv17check__underscore(str) {
    if (_M0MPC16string10StringView20contains__code__unit(str, 95)) {
      let rest;
      if ((str.end - str.start | 0) >= 1) {
        const _x = str.str.charCodeAt(str.start);
        switch (_x) {
          case 43: {
            const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
            rest = _x$2;
            break;
          }
          case 45: {
            const _x$3 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
            rest = _x$3;
            break;
          }
          default: {
            rest = str;
          }
        }
      } else {
        rest = str;
      }
      let rest$2;
      let allow_underscore;
      let hex;
      _L: {
        let _cursor_213 = 0;
        const _input_end_215 = rest.end - rest.start | 0;
        const _start_214 = _cursor_213;
        let _accept_state_216 = -1;
        let _match_end_217 = -1;
        let _state_218 = 3;
        while (true) {
          if (_state_218 !== 5) {
            if (_state_218 < 3) {
              _accept_state_216 = _state_218;
              _match_end_217 = _cursor_213;
            }
            const _tmp = Math.imul(_state_218, 5) | 0;
            let _next_char_221;
            if (_cursor_213 < _input_end_215) {
              const _char_220 = rest.str.charCodeAt(rest.start + _cursor_213 | 0);
              _cursor_213 = _cursor_213 + 1 | 0;
              _next_char_221 = _char_220;
            } else {
              _next_char_221 = -1;
            }
            const _p = _tmp + (_next_char_221 < 88 ? (_next_char_221 < 66 ? (_next_char_221 < 48 ? 4 : _next_char_221 > 48 ? 4 : 0) : _next_char_221 > 66 ? (_next_char_221 < 79 ? 4 : _next_char_221 > 79 ? 4 : 2) : 1) : _next_char_221 > 88 ? (_next_char_221 < 111 ? (_next_char_221 < 98 ? 4 : _next_char_221 > 98 ? 4 : 1) : _next_char_221 > 111 ? (_next_char_221 < 120 ? 4 : _next_char_221 > 120 ? 4 : 3) : 2) : 3) | 0;
            _state_218 = _M0FPC28internal7strconv17check__underscoreN25_2atransition__table__222S230[_p];
            continue;
          } else {
            break;
          }
        }
        const _bind = _accept_state_216;
        switch (_bind) {
          case 0: {
            _cursor_213 = _match_end_217;
            const rest$3 = _M0MPC16string10StringView12view_2einner(rest, _match_end_217, _input_end_215);
            rest$2 = rest$3;
            allow_underscore = true;
            hex = false;
            break _L;
          }
          case 1: {
            _cursor_213 = _match_end_217;
            const rest$4 = _M0MPC16string10StringView12view_2einner(rest, _match_end_217, _input_end_215);
            rest$2 = rest$4;
            allow_underscore = true;
            hex = false;
            break _L;
          }
          case 2: {
            _cursor_213 = _match_end_217;
            const rest$5 = _M0MPC16string10StringView12view_2einner(rest, _match_end_217, _input_end_215);
            rest$2 = rest$5;
            allow_underscore = true;
            hex = true;
            break _L;
          }
          default: {
            _cursor_213 = _start_214;
            rest$2 = rest;
            allow_underscore = false;
            hex = false;
            break _L;
          }
        }
      }
      let _tmp = rest$2.str;
      let _tmp$2 = rest$2.start;
      let _tmp$3 = rest$2.end;
      let _tmp$4 = allow_underscore;
      let _tmp$5 = false;
      while (true) {
        const rest_str = _tmp;
        const rest_start = _tmp$2;
        const rest_end = _tmp$3;
        const allow_underscore$2 = _tmp$4;
        const follow_underscore = _tmp$5;
        let rest$3;
        _L$2: {
          _L$3: {
            let rest$4;
            _L$4: {
              _L$5: {
                let rest$5;
                _L$6: {
                  let rest$6;
                  _L$7: {
                    if ((rest_end - rest_start | 0) === 0) {
                      return true;
                    } else {
                      if ((rest_end - rest_start | 0) === 1) {
                        const _x = rest_str.charCodeAt(rest_start);
                        if (_x === 95) {
                          return false;
                        } else {
                          if (_x >= 48 && _x <= 57) {
                            const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                            rest$6 = _x$2;
                            break _L$7;
                          } else {
                            if (_x >= 97 && _x <= 102) {
                              const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                              if (hex) {
                                rest$5 = _x$2;
                                break _L$6;
                              } else {
                                if (_x === 101) {
                                  if (follow_underscore === true) {
                                    break _L$5;
                                  } else {
                                    rest$4 = _x$2;
                                    break _L$4;
                                  }
                                } else {
                                  if (follow_underscore === true) {
                                    break _L$3;
                                  } else {
                                    rest$3 = _x$2;
                                    break _L$2;
                                  }
                                }
                              }
                            } else {
                              if (_x >= 65 && _x <= 70) {
                                const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                if (hex) {
                                  rest$5 = _x$2;
                                  break _L$6;
                                } else {
                                  if (_x === 69) {
                                    if (follow_underscore === true) {
                                      break _L$5;
                                    } else {
                                      rest$4 = _x$2;
                                      break _L$4;
                                    }
                                  } else {
                                    if (follow_underscore === true) {
                                      break _L$3;
                                    } else {
                                      rest$3 = _x$2;
                                      break _L$2;
                                    }
                                  }
                                }
                              } else {
                                if (_x === 46) {
                                  if (follow_underscore === true) {
                                    break _L$5;
                                  } else {
                                    const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                    rest$4 = _x$2;
                                    break _L$4;
                                  }
                                } else {
                                  if (_x === 43) {
                                    if (follow_underscore === true) {
                                      break _L$5;
                                    } else {
                                      const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                      rest$4 = _x$2;
                                      break _L$4;
                                    }
                                  } else {
                                    if (_x === 45) {
                                      if (follow_underscore === true) {
                                        break _L$5;
                                      } else {
                                        const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                        rest$4 = _x$2;
                                        break _L$4;
                                      }
                                    } else {
                                      if (follow_underscore === true) {
                                        break _L$3;
                                      } else {
                                        const _bind = _M0MPC16string6String29offset__of__nth__char_2einner(rest_str, 1, rest_start, rest_end);
                                        let _tmp$6;
                                        if (_bind === undefined) {
                                          _tmp$6 = rest_end;
                                        } else {
                                          const _Some = _bind;
                                          _tmp$6 = _Some;
                                        }
                                        const _x$2 = new _M0TPC16string10StringView(rest_str, _tmp$6, rest_end);
                                        rest$3 = _x$2;
                                        break _L$2;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      } else {
                        const _x = rest_str.charCodeAt(rest_start);
                        if (_x === 95) {
                          if (allow_underscore$2 === false) {
                            return false;
                          } else {
                            const _bind = rest_start + 1 | 0;
                            _tmp$2 = _bind;
                            _tmp$4 = false;
                            _tmp$5 = true;
                            continue;
                          }
                        } else {
                          if (_x >= 48 && _x <= 57) {
                            const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                            rest$6 = _x$2;
                            break _L$7;
                          } else {
                            if (_x >= 97 && _x <= 102) {
                              const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                              if (hex) {
                                rest$5 = _x$2;
                                break _L$6;
                              } else {
                                if (_x === 101) {
                                  if (follow_underscore === true) {
                                    break _L$5;
                                  } else {
                                    rest$4 = _x$2;
                                    break _L$4;
                                  }
                                } else {
                                  if (follow_underscore === true) {
                                    break _L$3;
                                  } else {
                                    rest$3 = _x$2;
                                    break _L$2;
                                  }
                                }
                              }
                            } else {
                              if (_x >= 65 && _x <= 70) {
                                const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                if (hex) {
                                  rest$5 = _x$2;
                                  break _L$6;
                                } else {
                                  if (_x === 69) {
                                    if (follow_underscore === true) {
                                      break _L$5;
                                    } else {
                                      rest$4 = _x$2;
                                      break _L$4;
                                    }
                                  } else {
                                    if (follow_underscore === true) {
                                      break _L$3;
                                    } else {
                                      rest$3 = _x$2;
                                      break _L$2;
                                    }
                                  }
                                }
                              } else {
                                if (_x === 46) {
                                  if (follow_underscore === true) {
                                    break _L$5;
                                  } else {
                                    const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                    rest$4 = _x$2;
                                    break _L$4;
                                  }
                                } else {
                                  if (_x === 43) {
                                    if (follow_underscore === true) {
                                      break _L$5;
                                    } else {
                                      const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                      rest$4 = _x$2;
                                      break _L$4;
                                    }
                                  } else {
                                    if (_x === 45) {
                                      if (follow_underscore === true) {
                                        break _L$5;
                                      } else {
                                        const _x$2 = new _M0TPC16string10StringView(rest_str, rest_start + 1 | 0, rest_end);
                                        rest$4 = _x$2;
                                        break _L$4;
                                      }
                                    } else {
                                      if (follow_underscore === true) {
                                        break _L$3;
                                      } else {
                                        const _bind = _M0MPC16string6String29offset__of__nth__char_2einner(rest_str, 1, rest_start, rest_end);
                                        let _tmp$6;
                                        if (_bind === undefined) {
                                          _tmp$6 = rest_end;
                                        } else {
                                          const _Some = _bind;
                                          _tmp$6 = _Some;
                                        }
                                        const _x$2 = new _M0TPC16string10StringView(rest_str, _tmp$6, rest_end);
                                        rest$3 = _x$2;
                                        break _L$2;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  _tmp = rest$6.str;
                  _tmp$2 = rest$6.start;
                  _tmp$3 = rest$6.end;
                  _tmp$4 = true;
                  _tmp$5 = false;
                  continue;
                }
                _tmp = rest$5.str;
                _tmp$2 = rest$5.start;
                _tmp$3 = rest$5.end;
                _tmp$4 = true;
                _tmp$5 = false;
                continue;
              }
              return false;
            }
            _tmp = rest$4.str;
            _tmp$2 = rest$4.start;
            _tmp$3 = rest$4.end;
            _tmp$4 = false;
            _tmp$5 = false;
            continue;
          }
          return false;
        }
        _tmp = rest$3.str;
        _tmp$2 = rest$3.start;
        _tmp$3 = rest$3.end;
        _tmp$4 = false;
        _tmp$5 = false;
        continue;
      }
    } else {
      return true;
    }
  }
  function _M0FPC28internal7strconv14eisel__umul128(a, b) {
    const a_lo = BigInt.asUintN(64, a & 4294967295n);
    const a_hi = BigInt.asUintN(64, BigInt.asUintN(64, a) >> BigInt(32 & 63));
    const b_lo = BigInt.asUintN(64, b & 4294967295n);
    const b_hi = BigInt.asUintN(64, BigInt.asUintN(64, b) >> BigInt(32 & 63));
    const x = BigInt.asUintN(64, a_lo * b_lo);
    const y = BigInt.asUintN(64, BigInt.asUintN(64, a_hi * b_lo) + BigInt.asUintN(64, BigInt.asUintN(64, x) >> BigInt(32 & 63)));
    const z = BigInt.asUintN(64, BigInt.asUintN(64, a_lo * b_hi) + BigInt.asUintN(64, y & 4294967295n));
    const hi = BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, a_hi * b_hi) + BigInt.asUintN(64, BigInt.asUintN(64, y) >> BigInt(32 & 63))) + BigInt.asUintN(64, BigInt.asUintN(64, z) >> BigInt(32 & 63)));
    return new _M0TPC28internal7strconv12EiselProduct(BigInt.asUintN(64, a * b), hi);
  }
  function _M0FPC28internal7strconv20try__eisel__lemire64(mantissa, exponent, negative) {
    if (BigInt.asUintN(64, mantissa) === BigInt.asUintN(64, 0n)) {
      return negative ? $i64_reinterpret_f64(9223372036854775808n) : 0;
    }
    if (BigInt.asIntN(64, exponent) < BigInt.asIntN(64, 18446744073709551268n) || BigInt.asIntN(64, exponent) > BigInt.asIntN(64, 347n)) {
      return _M0FPC16double14not__a__number;
    }
    const exponent$2 = Number(BigInt.asIntN(32, exponent)) | 0;
    const table_index = Math.imul(exponent$2 - -348 | 0, 2) | 0;
    const pow_hi = table_index >>> 0 < _M0FPC28internal7strconv27eisel__lemire__pow10__table.length ? _M0FPC28internal7strconv27eisel__lemire__pow10__table[table_index] : $oob();
    const _p = table_index + 1 | 0;
    const pow_lo = _p >>> 0 < _M0FPC28internal7strconv27eisel__lemire__pow10__table.length ? _M0FPC28internal7strconv27eisel__lemire__pow10__table[_p] : $oob();
    const pow_exp2 = 1 + (Math.imul(exponent$2, 108853) >> 15) | 0;
    const leading_zeros = $i64_clz(mantissa);
    const normalized = BigInt.asUintN(64, mantissa << BigInt(leading_zeros & 63));
    let result_exp2 = ((pow_exp2 + 63 | 0) + 1023 | 0) - leading_zeros | 0;
    const product = _M0FPC28internal7strconv14eisel__umul128(normalized, pow_hi);
    let product_hi = product.hi;
    let product_lo = product.lo;
    if (BigInt.asUintN(64, BigInt.asUintN(64, product_hi & 511n)) === BigInt.asUintN(64, 511n) && BigInt.asUintN(64, BigInt.asUintN(64, product_lo + normalized)) < BigInt.asUintN(64, normalized)) {
      const wider = _M0FPC28internal7strconv14eisel__umul128(normalized, pow_lo);
      let merged_hi = product_hi;
      const merged_lo = BigInt.asUintN(64, product_lo + wider.hi);
      if (BigInt.asUintN(64, merged_lo) < BigInt.asUintN(64, product_lo)) {
        merged_hi = BigInt.asUintN(64, merged_hi + 1n);
      }
      if (BigInt.asUintN(64, BigInt.asUintN(64, merged_hi & 511n)) === BigInt.asUintN(64, 511n) && (BigInt.asUintN(64, BigInt.asUintN(64, merged_lo + 1n)) === BigInt.asUintN(64, 0n) && BigInt.asUintN(64, BigInt.asUintN(64, wider.lo + normalized)) < BigInt.asUintN(64, normalized))) {
        return _M0FPC16double14not__a__number;
      }
      product_hi = merged_hi;
      product_lo = merged_lo;
    }
    const top_bit = Number(BigInt.asIntN(32, BigInt.asUintN(64, BigInt.asUintN(64, product_hi) >> BigInt(63 & 63)))) | 0;
    let result_mantissa = BigInt.asUintN(64, BigInt.asUintN(64, product_hi) >> BigInt(top_bit + 9 & 63));
    result_exp2 = result_exp2 - (1 - top_bit | 0) | 0;
    if (BigInt.asUintN(64, product_lo) === BigInt.asUintN(64, 0n) && (BigInt.asUintN(64, BigInt.asUintN(64, product_hi & 511n)) === BigInt.asUintN(64, 0n) && BigInt.asUintN(64, BigInt.asUintN(64, result_mantissa & 3n)) === BigInt.asUintN(64, 1n))) {
      return _M0FPC16double14not__a__number;
    }
    result_mantissa = BigInt.asUintN(64, result_mantissa + BigInt.asUintN(64, result_mantissa & 1n));
    result_mantissa = BigInt.asUintN(64, BigInt.asUintN(64, result_mantissa) >> BigInt(1 & 63));
    if (BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, result_mantissa) >> BigInt(53 & 63))) > BigInt.asUintN(64, 0n)) {
      result_mantissa = BigInt.asUintN(64, BigInt.asUintN(64, result_mantissa) >> BigInt(1 & 63));
      result_exp2 = result_exp2 + 1 | 0;
    }
    if (result_exp2 <= 0 || result_exp2 >= 2047) {
      return _M0FPC16double14not__a__number;
    }
    const exponent_bits = BigInt.asUintN(64, BigInt.asUintN(64, BigInt(result_exp2 >>> 0)) << BigInt(52 & 63));
    let result_bits = BigInt.asUintN(64, exponent_bits | BigInt.asUintN(64, result_mantissa & 4503599627370495n));
    if (negative) {
      result_bits = BigInt.asUintN(64, result_bits | 9223372036854775808n);
    }
    return $i64_reinterpret_f64(result_bits);
  }
  function _M0MPC28internal7strconv7Decimal9new__priv() {
    return new _M0TPC28internal7strconv7Decimal($makebytes(800, 0), 0, 0, false, false, 0);
  }
  function _M0MPC28internal7strconv7Decimal4trim(self) {
    while (true) {
      let _tmp;
      if (self.digits_num > 0) {
        const _tmp$2 = self.digits;
        const _tmp$3 = self.digits_num - 1 | 0;
        const _p = _tmp$3 >>> 0 < _tmp$2.length ? _tmp$2[_tmp$3] : $oob();
        const _p$2 = 0;
        _tmp = _p === _p$2;
      } else {
        _tmp = false;
      }
      if (_tmp) {
        self.digits_num = self.digits_num - 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (self.digits_num === 0) {
      self.decimal_point = 0;
      return;
    } else {
      return;
    }
  }
  function _M0FPC28internal7strconv26parse__decimal__from__view(str) {
    const d = _M0MPC28internal7strconv7Decimal9new__priv();
    let has_dp = false;
    let has_digits = false;
    let rest;
    _L: {
      _L$2: {
        if ((str.end - str.start | 0) >= 1) {
          const _x = str.str.charCodeAt(str.start);
          switch (_x) {
            case 45: {
              const _x$2 = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
              d.negative = true;
              rest = _x$2;
              break;
            }
            case 43: {
              rest = new _M0TPC16string10StringView(str.str, str.start + 1 | 0, str.end);
              break;
            }
            default: {
              break _L$2;
            }
          }
        } else {
          break _L$2;
        }
        break _L;
      }
      rest = str;
    }
    let rest$2;
    let _tmp = rest;
    while (true) {
      const rest$3 = _tmp;
      let rest$4;
      _L$2: {
        _L$3: {
          if ((rest$3.end - rest$3.start | 0) >= 1) {
            const _x = rest$3.str.charCodeAt(rest$3.start);
            if (_x === 95) {
              const _x$2 = new _M0TPC16string10StringView(rest$3.str, rest$3.start + 1 | 0, rest$3.end);
              _tmp = _x$2;
              continue;
            } else {
              if (_x === 46) {
                const _x$2 = new _M0TPC16string10StringView(rest$3.str, rest$3.start + 1 | 0, rest$3.end);
                if (!has_dp) {
                  has_dp = true;
                  d.decimal_point = d.digits_num;
                  _tmp = _x$2;
                  continue;
                } else {
                  const _bind = _M0FPC28internal7strconv11syntax__errGuE();
                  if (_bind.$tag === 1) {
                    const _ok = _bind;
                    _ok._0;
                  } else {
                    return _bind;
                  }
                }
              } else {
                if (_x >= 48 && _x <= 57) {
                  const _x$2 = new _M0TPC16string10StringView(rest$3.str, rest$3.start + 1 | 0, rest$3.end);
                  has_digits = true;
                  if (_x === 48 && d.digits_num === 0) {
                    d.decimal_point = d.decimal_point - 1 | 0;
                    _tmp = _x$2;
                    continue;
                  }
                  if (d.digits_num < d.digits.length) {
                    const _tmp$2 = d.digits;
                    const _tmp$3 = d.digits_num;
                    if (_tmp$3 >>> 0 < _tmp$2.length) {
                      _tmp$2[_tmp$3] = (_x - 48 | 0) & 255;
                    } else {
                      $oob();
                    }
                    d.digits_num = d.digits_num + 1 | 0;
                  } else {
                    if (!has_dp) {
                      d.overflowed = d.overflowed + 1 | 0;
                    }
                    if (_x !== 48) {
                      d.truncated = true;
                    }
                  }
                  _tmp = _x$2;
                  continue;
                } else {
                  rest$4 = rest$3;
                  break _L$3;
                }
              }
            }
          } else {
            rest$4 = rest$3;
            break _L$3;
          }
          break _L$2;
        }
        rest$2 = rest$4;
        break;
      }
      continue;
    }
    if (has_digits) {
      if (!has_dp) {
        d.decimal_point = d.digits_num;
      }
      let rest$3;
      let rest$4;
      _L$2: {
        _L$3: {
          if ((rest$2.end - rest$2.start | 0) >= 1) {
            const _x = rest$2.str.charCodeAt(rest$2.start);
            switch (_x) {
              case 101: {
                const _x$2 = new _M0TPC16string10StringView(rest$2.str, rest$2.start + 1 | 0, rest$2.end);
                rest$4 = _x$2;
                break _L$3;
              }
              case 69: {
                const _x$3 = new _M0TPC16string10StringView(rest$2.str, rest$2.start + 1 | 0, rest$2.end);
                rest$4 = _x$3;
                break _L$3;
              }
              default: {
                rest$3 = rest$2;
              }
            }
          } else {
            rest$3 = rest$2;
          }
          break _L$2;
        }
        let exp_sign = 1;
        let rest$5;
        if ((rest$4.end - rest$4.start | 0) >= 1) {
          const _x = rest$4.str.charCodeAt(rest$4.start);
          switch (_x) {
            case 43: {
              rest$5 = new _M0TPC16string10StringView(rest$4.str, rest$4.start + 1 | 0, rest$4.end);
              break;
            }
            case 45: {
              const _x$2 = new _M0TPC16string10StringView(rest$4.str, rest$4.start + 1 | 0, rest$4.end);
              exp_sign = -1;
              rest$5 = _x$2;
              break;
            }
            default: {
              rest$5 = rest$4;
            }
          }
        } else {
          rest$5 = rest$4;
        }
        _L$4: {
          _L$5: {
            if ((rest$5.end - rest$5.start | 0) >= 1) {
              const _x = rest$5.str.charCodeAt(rest$5.start);
              if (_x >= 48 && _x <= 57) {
                const effective_dp = d.decimal_point + d.overflowed | 0;
                const exp_limit = exp_sign > 0 ? (effective_dp < 311 ? 311 - effective_dp | 0 : 0) : effective_dp > -331 ? effective_dp + 331 | 0 : 0;
                let exp = 0;
                let rest$6;
                let _tmp$2 = rest$5;
                while (true) {
                  const rest$7 = _tmp$2;
                  let rest$8;
                  _L$6: {
                    if ((rest$7.end - rest$7.start | 0) >= 1) {
                      const _x$2 = rest$7.str.charCodeAt(rest$7.start);
                      if (_x$2 === 95) {
                        const _x$3 = new _M0TPC16string10StringView(rest$7.str, rest$7.start + 1 | 0, rest$7.end);
                        _tmp$2 = _x$3;
                        continue;
                      } else {
                        if (_x$2 >= 48 && _x$2 <= 57) {
                          const _x$3 = new _M0TPC16string10StringView(rest$7.str, rest$7.start + 1 | 0, rest$7.end);
                          if (exp < exp_limit) {
                            exp = (Math.imul(exp, 10) | 0) + (_x$2 - 48 | 0) | 0;
                            if (exp > exp_limit) {
                              exp = exp_limit;
                            }
                          }
                          _tmp$2 = _x$3;
                          continue;
                        } else {
                          rest$8 = rest$7;
                          break _L$6;
                        }
                      }
                    } else {
                      rest$8 = rest$7;
                      break _L$6;
                    }
                  }
                  rest$6 = rest$8;
                  break;
                }
                d.decimal_point = d.decimal_point + (Math.imul(exp_sign, exp) | 0) | 0;
                rest$3 = rest$6;
              } else {
                break _L$5;
              }
            } else {
              break _L$5;
            }
            break _L$4;
          }
          const _bind = _M0FPC28internal7strconv11syntax__errGlE();
          if (_bind.$tag === 1) {
            const _ok = _bind;
            rest$3 = _ok._0;
          } else {
            return _bind;
          }
        }
      }
      if ((rest$3.end - rest$3.start | 0) === 0) {
        _M0MPC28internal7strconv7Decimal4trim(d);
        return new _M0DTPC16result6ResultGRPC28internal7strconv7DecimalRPC15error5ErrorE2Ok(d);
      } else {
        return _M0FPC28internal7strconv11syntax__errGlE();
      }
    } else {
      return _M0FPC28internal7strconv11syntax__errGlE();
    }
  }
  function _M0FPC28internal7strconv20parse__decimal__priv(str) {
    return _M0FPC28internal7strconv26parse__decimal__from__view(str);
  }
  function _M0FPC28internal7strconv14assemble__bits(mantissa, exponent, negative) {
    const biased_exp = exponent - _M0FPC28internal7strconv12double__info.bias | 0;
    let bits = BigInt.asUintN(64, mantissa & BigInt.asUintN(64, BigInt.asUintN(64, 1n << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)) - 1n));
    const exp_bits = BigInt.asUintN(64, BigInt(biased_exp & ((1 << _M0FPC28internal7strconv12double__info.exponent_bits) - 1 | 0)));
    bits = BigInt.asUintN(64, bits | BigInt.asUintN(64, exp_bits << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)));
    if (negative) {
      bits = BigInt.asUintN(64, bits | BigInt.asUintN(64, BigInt.asUintN(64, 1n << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)) << BigInt(_M0FPC28internal7strconv12double__info.exponent_bits & 63)));
    }
    return bits;
  }
  function _M0MPC28internal7strconv7Decimal17should__round__up(self, d) {
    if (d < 0 || d >= self.digits_num) {
      return false;
    }
    let _tmp;
    const _tmp$2 = self.digits;
    if ((d >>> 0 < _tmp$2.length ? _tmp$2[d] : $oob()) === 5) {
      _tmp = (d + 1 | 0) === self.digits_num;
    } else {
      _tmp = false;
    }
    if (_tmp) {
      if (self.truncated) {
        return true;
      }
      let _tmp$3;
      if (d > 0) {
        const _tmp$4 = self.digits;
        const _tmp$5 = d - 1 | 0;
        _tmp$3 = ((_tmp$5 >>> 0 < _tmp$4.length ? _tmp$4[_tmp$5] : $oob()) % 2 | 0) !== 0;
      } else {
        _tmp$3 = false;
      }
      return _tmp$3;
    }
    const _tmp$3 = self.digits;
    return (d >>> 0 < _tmp$3.length ? _tmp$3[d] : $oob()) >= 5;
  }
  function _M0MPC28internal7strconv7Decimal16rounded__integer(self) {
    if (self.decimal_point > 20) {
      return 18446744073709551615n;
    }
    let _tmp = 0n;
    let _tmp$2 = 0;
    while (true) {
      const n = _tmp;
      const i = _tmp$2;
      if (i < self.decimal_point && i < self.digits_num) {
        const _tmp$3 = BigInt.asUintN(64, n * 10n);
        const _tmp$4 = self.digits;
        const _p = i >>> 0 < _tmp$4.length ? _tmp$4[i] : $oob();
        _tmp = BigInt.asUintN(64, _tmp$3 + BigInt.asUintN(64, BigInt(_p)));
        _tmp$2 = i + 1 | 0;
        continue;
      } else {
        let n$2;
        let _tmp$3 = n;
        let _tmp$4 = i;
        while (true) {
          const n$3 = _tmp$3;
          const i$2 = _tmp$4;
          if (i$2 < self.decimal_point) {
            _tmp$3 = BigInt.asUintN(64, n$3 * 10n);
            _tmp$4 = i$2 + 1 | 0;
            continue;
          } else {
            n$2 = n$3;
            break;
          }
        }
        return _M0MPC28internal7strconv7Decimal17should__round__up(self, self.decimal_point) ? BigInt.asUintN(64, n$2 + 1n) : n$2;
      }
    }
  }
  function _M0MPC28internal7strconv7Decimal11new__digits(self, s) {
    const new_digits = (s >>> 0 < _M0FPC28internal7strconv19left__shift__cheats.length ? _M0FPC28internal7strconv19left__shift__cheats[s] : $oob())._0;
    const cheat_num = (s >>> 0 < _M0FPC28internal7strconv19left__shift__cheats.length ? _M0FPC28internal7strconv19left__shift__cheats[s] : $oob())._1;
    const _bind = cheat_num.length;
    let less;
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < _bind) {
        const code_unit = cheat_num.charCodeAt(i);
        if (i >= self.digits_num) {
          less = true;
          break;
        }
        const d = code_unit - 48 | 0;
        const _tmp$2 = self.digits;
        if ((i >>> 0 < _tmp$2.length ? _tmp$2[i] : $oob()) !== d) {
          const _tmp$3 = self.digits;
          less = (i >>> 0 < _tmp$3.length ? _tmp$3[i] : $oob()) < d;
          break;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        less = false;
        break;
      }
    }
    return less ? new_digits - 1 | 0 : new_digits;
  }
  function _M0MPC28internal7strconv7Decimal11left__shift(self, s) {
    const new_digits = _M0MPC28internal7strconv7Decimal11new__digits(self, s);
    let read_index = self.digits_num;
    let write_index = self.digits_num + new_digits | 0;
    let acc = 0n;
    read_index = read_index - 1 | 0;
    while (true) {
      if (read_index >= 0) {
        const _tmp = self.digits;
        const _tmp$2 = read_index;
        const _p = _tmp$2 >>> 0 < _tmp.length ? _tmp[_tmp$2] : $oob();
        const d = BigInt.asUintN(64, BigInt(_p));
        acc = BigInt.asUintN(64, acc + BigInt.asUintN(64, d << BigInt(s & 63)));
        if (10n === 0n) {
          $panic();
        }
        const quo = BigInt.asUintN(64, BigInt.asIntN(64, acc) / BigInt.asIntN(64, 10n));
        const rem = Number(BigInt.asIntN(32, BigInt.asUintN(64, acc - BigInt.asUintN(64, quo * 10n)))) | 0;
        write_index = write_index - 1 | 0;
        if (write_index < self.digits.length) {
          const _tmp$3 = self.digits;
          const _tmp$4 = write_index;
          if (_tmp$4 >>> 0 < _tmp$3.length) {
            _tmp$3[_tmp$4] = rem & 255;
          } else {
            $oob();
          }
        } else {
          if (rem !== 0) {
            self.truncated = true;
          }
        }
        acc = quo;
        read_index = read_index - 1 | 0;
        continue;
      } else {
        break;
      }
    }
    while (true) {
      if (BigInt.asIntN(64, acc) > BigInt.asIntN(64, 0n)) {
        if (10n === 0n) {
          $panic();
        }
        const quo = BigInt.asUintN(64, BigInt.asIntN(64, acc) / BigInt.asIntN(64, 10n));
        const rem = Number(BigInt.asIntN(32, BigInt.asUintN(64, acc - BigInt.asUintN(64, 10n * quo)))) | 0;
        write_index = write_index - 1 | 0;
        if (write_index < self.digits.length) {
          const _tmp = self.digits;
          const _tmp$2 = write_index;
          if (_tmp$2 >>> 0 < _tmp.length) {
            _tmp[_tmp$2] = rem & 255;
          } else {
            $oob();
          }
        } else {
          if (rem !== 0) {
            self.truncated = true;
          }
        }
        acc = quo;
        continue;
      } else {
        break;
      }
    }
    self.digits_num = self.digits_num + new_digits | 0;
    if (self.digits_num > self.digits.length) {
      self.digits_num = self.digits.length;
    }
    self.decimal_point = self.decimal_point + new_digits | 0;
    _M0MPC28internal7strconv7Decimal4trim(self);
  }
  function _M0MPC28internal7strconv7Decimal12right__shift(self, s) {
    let read_index = 0;
    let write_index = 0;
    let acc = 0n;
    while (true) {
      if (BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, acc) >> BigInt(s & 63))) === BigInt.asUintN(64, 0n)) {
        if (read_index >= self.digits_num) {
          while (true) {
            if (BigInt.asUintN(64, BigInt.asUintN(64, BigInt.asUintN(64, acc) >> BigInt(s & 63))) === BigInt.asUintN(64, 0n)) {
              acc = BigInt.asUintN(64, acc * 10n);
              read_index = read_index + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          break;
        }
        const _tmp = self.digits;
        const _tmp$2 = read_index;
        const d = _tmp$2 >>> 0 < _tmp.length ? _tmp[_tmp$2] : $oob();
        acc = BigInt.asUintN(64, BigInt.asUintN(64, acc * 10n) + BigInt.asUintN(64, BigInt(d)));
        read_index = read_index + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    self.decimal_point = self.decimal_point - (read_index - 1 | 0) | 0;
    const mask = BigInt.asUintN(64, BigInt.asUintN(64, 1n << BigInt(s & 63)) - 1n);
    while (true) {
      if (read_index < self.digits_num) {
        const out = BigInt.asUintN(64, BigInt.asUintN(64, acc) >> BigInt(s & 63));
        const _tmp = self.digits;
        const _tmp$2 = write_index;
        if (_tmp$2 >>> 0 < _tmp.length) {
          _tmp[_tmp$2] = (Number(BigInt.asIntN(32, out)) | 0) & 255;
        } else {
          $oob();
        }
        write_index = write_index + 1 | 0;
        acc = BigInt.asUintN(64, acc & mask);
        const _tmp$3 = self.digits;
        const _tmp$4 = read_index;
        const d = _tmp$4 >>> 0 < _tmp$3.length ? _tmp$3[_tmp$4] : $oob();
        acc = BigInt.asUintN(64, BigInt.asUintN(64, acc * 10n) + BigInt.asUintN(64, BigInt(d)));
        read_index = read_index + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    while (true) {
      if (BigInt.asUintN(64, acc) > BigInt.asUintN(64, 0n)) {
        const out = BigInt.asUintN(64, BigInt.asUintN(64, acc) >> BigInt(s & 63));
        if (write_index < self.digits.length) {
          const _tmp = self.digits;
          const _tmp$2 = write_index;
          if (_tmp$2 >>> 0 < _tmp.length) {
            _tmp[_tmp$2] = (Number(BigInt.asIntN(32, out)) | 0) & 255;
          } else {
            $oob();
          }
          write_index = write_index + 1 | 0;
        } else {
          if (BigInt.asUintN(64, out) > BigInt.asUintN(64, 0n)) {
            self.truncated = true;
          }
        }
        acc = BigInt.asUintN(64, acc & mask);
        acc = BigInt.asUintN(64, acc * 10n);
        continue;
      } else {
        break;
      }
    }
    self.digits_num = write_index;
    _M0MPC28internal7strconv7Decimal4trim(self);
  }
  function _M0MPC28internal7strconv7Decimal11shift__priv(self, s) {
    if (self.digits_num === 0) {
      return undefined;
    }
    let s$2 = s;
    if (s$2 > 0) {
      while (true) {
        if (s$2 > 59) {
          _M0MPC28internal7strconv7Decimal11left__shift(self, 59);
          s$2 = s$2 - 59 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0MPC28internal7strconv7Decimal11left__shift(self, s$2);
    }
    if (s$2 < 0) {
      while (true) {
        if (s$2 < -59) {
          _M0MPC28internal7strconv7Decimal12right__shift(self, 59);
          s$2 = s$2 + 59 | 0;
          continue;
        } else {
          break;
        }
      }
      _M0MPC28internal7strconv7Decimal12right__shift(self, -s$2 | 0);
      return;
    } else {
      return;
    }
  }
  function _M0MPC28internal7strconv7Decimal16to__double__priv(self) {
    let exponent = 0;
    let mantissa = 0n;
    const effective_dp = self.decimal_point + self.overflowed | 0;
    if (self.digits_num === 0 || effective_dp < -330) {
      mantissa = 0n;
      exponent = _M0FPC28internal7strconv12double__info.bias;
      const bits = _M0FPC28internal7strconv14assemble__bits(mantissa, exponent, self.negative);
      return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok($i64_reinterpret_f64(bits));
    }
    if (self.decimal_point > 310) {
      const _bind = _M0FPC28internal7strconv10range__errGuE();
      if (_bind.$tag === 1) {
        const _ok = _bind;
        _ok._0;
      } else {
        return _bind;
      }
    }
    self.decimal_point = self.decimal_point + self.overflowed | 0;
    while (true) {
      if (self.decimal_point > 0) {
        let n = 0;
        if (self.decimal_point >= _M0FPC28internal7strconv6powtab.length) {
          n = 60;
        } else {
          const _p = self.decimal_point;
          n = _p >>> 0 < _M0FPC28internal7strconv6powtab.length ? _M0FPC28internal7strconv6powtab[_p] : $oob();
        }
        _M0MPC28internal7strconv7Decimal11shift__priv(self, -n | 0);
        exponent = exponent + n | 0;
        continue;
      } else {
        break;
      }
    }
    while (true) {
      let _tmp;
      if (self.decimal_point < 0) {
        _tmp = true;
      } else {
        let _tmp$2;
        if (self.decimal_point === 0) {
          const _tmp$3 = self.digits;
          _tmp$2 = (0 >>> 0 < _tmp$3.length ? _tmp$3[0] : $oob()) < 5;
        } else {
          _tmp$2 = false;
        }
        _tmp = _tmp$2;
      }
      if (_tmp) {
        let n = 0;
        if ((-self.decimal_point | 0) >= _M0FPC28internal7strconv6powtab.length) {
          n = 60;
        } else {
          const _p = -self.decimal_point | 0;
          n = _p >>> 0 < _M0FPC28internal7strconv6powtab.length ? _M0FPC28internal7strconv6powtab[_p] : $oob();
        }
        _M0MPC28internal7strconv7Decimal11shift__priv(self, n);
        exponent = exponent - n | 0;
        continue;
      } else {
        break;
      }
    }
    exponent = exponent - 1 | 0;
    if (exponent < (_M0FPC28internal7strconv12double__info.bias + 1 | 0)) {
      const n = (_M0FPC28internal7strconv12double__info.bias + 1 | 0) - exponent | 0;
      _M0MPC28internal7strconv7Decimal11shift__priv(self, -n | 0);
      exponent = exponent + n | 0;
    }
    if ((exponent - _M0FPC28internal7strconv12double__info.bias | 0) >= ((1 << _M0FPC28internal7strconv12double__info.exponent_bits) - 1 | 0)) {
      const _bind = _M0FPC28internal7strconv10range__errGuE();
      if (_bind.$tag === 1) {
        const _ok = _bind;
        _ok._0;
      } else {
        return _bind;
      }
    }
    _M0MPC28internal7strconv7Decimal11shift__priv(self, _M0FPC28internal7strconv12double__info.mantissa_bits + 1 | 0);
    mantissa = _M0MPC28internal7strconv7Decimal16rounded__integer(self);
    if (BigInt.asUintN(64, mantissa) === BigInt.asUintN(64, BigInt.asUintN(64, 2n << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)))) {
      mantissa = BigInt.asUintN(64, BigInt.asIntN(64, mantissa) >> BigInt(1 & 63));
      exponent = exponent + 1 | 0;
      if ((exponent - _M0FPC28internal7strconv12double__info.bias | 0) >= ((1 << _M0FPC28internal7strconv12double__info.exponent_bits) - 1 | 0)) {
        const _bind = _M0FPC28internal7strconv10range__errGuE();
        if (_bind.$tag === 1) {
          const _ok = _bind;
          _ok._0;
        } else {
          return _bind;
        }
      }
    }
    if (BigInt.asUintN(64, BigInt.asUintN(64, mantissa & BigInt.asUintN(64, 1n << BigInt(_M0FPC28internal7strconv12double__info.mantissa_bits & 63)))) === BigInt.asUintN(64, 0n)) {
      exponent = _M0FPC28internal7strconv12double__info.bias;
    }
    const bits = _M0FPC28internal7strconv14assemble__bits(mantissa, exponent, self.negative);
    return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok($i64_reinterpret_f64(bits));
  }
  function _M0FPC28internal7strconv17pow10__fast__path(exponent) {
    const _p = exponent & 31;
    return _p >>> 0 < _M0FPC28internal7strconv5table.length ? _M0FPC28internal7strconv5table[_p] : $oob();
  }
  function _M0MPC28internal7strconv6Number14is__fast__path(self) {
    return BigInt.asIntN(64, _M0FPC28internal7strconv25min__exponent__fast__path) <= BigInt.asIntN(64, self.exponent) && (BigInt.asIntN(64, self.exponent) <= BigInt.asIntN(64, _M0FPC28internal7strconv36max__exponent__disguised__fast__path) && (BigInt.asUintN(64, self.mantissa) <= BigInt.asUintN(64, _M0FPC28internal7strconv25max__mantissa__fast__path) && !self.many_digits));
  }
  function _M0MPC28internal7strconv6Number15try__fast__path(self) {
    if (_M0MPC28internal7strconv6Number14is__fast__path(self)) {
      let value;
      if (BigInt.asIntN(64, self.exponent) <= BigInt.asIntN(64, _M0FPC28internal7strconv25max__exponent__fast__path)) {
        const value$2 = $f64_convert_i64_u(BigInt.asUintN(64, self.mantissa));
        value = BigInt.asIntN(64, self.exponent) < BigInt.asIntN(64, 0n) ? value$2 / _M0FPC28internal7strconv17pow10__fast__path(-(Number(BigInt.asIntN(32, self.exponent)) | 0) | 0) : value$2 * _M0FPC28internal7strconv17pow10__fast__path(Number(BigInt.asIntN(32, self.exponent)) | 0);
      } else {
        const shift = BigInt.asUintN(64, self.exponent - _M0FPC28internal7strconv25max__exponent__fast__path);
        const _tmp = self.mantissa;
        const _p = Number(BigInt.asIntN(32, shift)) | 0;
        const _bind = _M0FPC28internal7strconv12checked__mul(_tmp, _p >>> 0 < _M0FPC28internal7strconv10int__pow10.length ? _M0FPC28internal7strconv10int__pow10[_p] : $oob());
        if (_bind === undefined) {
          return _M0DTPC16option6OptionGdE4None__;
        } else {
          const _Some = _bind;
          const _mantissa = _Some;
          if (BigInt.asUintN(64, _mantissa) > BigInt.asUintN(64, _M0FPC28internal7strconv25max__mantissa__fast__path)) {
            return _M0DTPC16option6OptionGdE4None__;
          }
          value = $f64_convert_i64_u(BigInt.asUintN(64, _mantissa)) * _M0FPC28internal7strconv17pow10__fast__path(Number(BigInt.asIntN(32, _M0FPC28internal7strconv25max__exponent__fast__path)) | 0);
        }
      }
      if (self.negative) {
        value = -value;
      }
      return new _M0DTPC16option6OptionGdE4Some(value);
    } else {
      return _M0DTPC16option6OptionGdE4None__;
    }
  }
  function _M0FPC28internal7strconv13parse__double(str) {
    if (!((str.end - str.start | 0) === 0)) {
      if (_M0FPC28internal7strconv17check__underscore(str)) {
        const _bind = _M0FPC28internal7strconv13parse__number(str);
        let _bind$2;
        if (_bind.$tag === 1) {
          const _ok = _bind;
          _bind$2 = _ok._0;
        } else {
          return _bind;
        }
        if (_bind$2 === undefined) {
          return _M0FPC28internal7strconv15parse__inf__nan(str);
        } else {
          const _Some = _bind$2;
          const _num = _Some;
          const _bind$3 = _M0MPC28internal7strconv6Number15try__fast__path(_num);
          if (_bind$3.$tag === 1) {
            const _Some$2 = _bind$3;
            const _value = _Some$2._0;
            return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(_value);
          } else {
            const fast = _num.many_digits ? _M0FPC16double14not__a__number : _M0FPC28internal7strconv20try__eisel__lemire64(_num.mantissa, _num.exponent, _num.negative);
            if (fast !== fast) {
              const _bind$4 = _M0FPC28internal7strconv20parse__decimal__priv(str);
              let _tmp;
              if (_bind$4.$tag === 1) {
                const _ok = _bind$4;
                _tmp = _ok._0;
              } else {
                return _bind$4;
              }
              return _M0MPC28internal7strconv7Decimal16to__double__priv(_tmp);
            } else {
              return new _M0DTPC16result6ResultGdRPC15error5ErrorE2Ok(fast);
            }
          }
        }
      } else {
        return _M0FPC28internal7strconv11syntax__errGdE();
      }
    } else {
      return _M0FPC28internal7strconv11syntax__errGdE();
    }
  }
  function _M0FPC14json20need__escape__scalar(str, escape_slash, start, end) {
    let _tmp = start;
    while (true) {
      const i = _tmp;
      if (i < end) {
        const code = str.charCodeAt(i);
        let _tmp$2;
        const _p = 34;
        if (code === _p) {
          _tmp$2 = true;
        } else {
          let _tmp$3;
          const _p$2 = 92;
          if (code === _p$2) {
            _tmp$3 = true;
          } else {
            let _tmp$4;
            if (code < 32) {
              _tmp$4 = true;
            } else {
              let _tmp$5;
              if (escape_slash) {
                const _p$3 = 47;
                _tmp$5 = code === _p$3;
              } else {
                _tmp$5 = false;
              }
              _tmp$4 = _tmp$5;
            }
            _tmp$3 = _tmp$4;
          }
          _tmp$2 = _tmp$3;
        }
        if (_tmp$2) {
          return true;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return false;
  }
  function _M0FPC14json12need__escape(str, escape_slash) {
    return _M0FPC14json20need__escape__scalar(str, escape_slash, 0, str.length);
  }
  function _M0FPC14json14write__escaped(buf, str, escape_slash) {
    if (!_M0FPC14json12need__escape(str, escape_slash)) {
      _M0IPB13StringBuilderPB6Logger13write__string(buf, str);
      return undefined;
    }
    const _bind = str.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const code = str.charCodeAt(_);
        switch (code) {
          case 34: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\\"");
            break;
          }
          case 92: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\\\");
            break;
          }
          case 47: {
            if (escape_slash) {
              _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\/");
            } else {
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 47);
            }
            break;
          }
          case 10: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\n");
            break;
          }
          case 13: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\r");
            break;
          }
          case 8: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\b");
            break;
          }
          case 9: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\t");
            break;
          }
          case 12: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\f");
            break;
          }
          default: {
            if (code < 32) {
              _M0IPB13StringBuilderPB6Logger13write__string(buf, "\\u00");
              _M0IPB13StringBuilderPB6Logger13write__string(buf, _M0MPC14byte4Byte7to__hex(code & 255));
            } else {
              _M0IPB13StringBuilderPB6Logger11write__char(buf, code);
            }
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FPC14json13write__indent(buf, cache, level, indent) {
    while (true) {
      if (cache.length <= level) {
        if (cache.length >= 1) {
          const _last = cache[cache.length - 1 | 0];
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(cache, `${_last}${_M0MPC16string6String6repeat(" ", indent)}`);
        } else {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(cache, "\n");
        }
        continue;
      } else {
        break;
      }
    }
    _M0IPB13StringBuilderPB6Logger13write__string(buf, _M0MPC15array5Array2atGRPB4JsonE(cache, level));
  }
  function _M0MPC14json4Json17stringify_2einner(self, escape_slash, indent, replacer) {
    const buf = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    const indent_cache = [];
    const stack = [];
    let depth = 0;
    let _tmp = self;
    while (true) {
      const x = _tmp;
      if (x === undefined) {
        if (stack.length === 0) {
          break;
        } else {
          const _x = stack[stack.length - 1 | 0];
          if (_x.$tag === 0) {
            const _Array = _x;
            const _arr = _Array._0;
            const _i = _Array._1;
            if (_i < _arr.length) {
              const element = _M0MPC15array5Array2atGRPB4JsonE(_arr, _i);
              _Array._1 = _i + 1 | 0;
              if (_i > 0) {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 44);
                if (indent > 0) {
                  _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
                }
              }
              _tmp = element;
              continue;
            } else {
              depth = depth - 1 | 0;
              _M0MPC15array5Array3popGRPC14json10WriteFrameE(stack);
              if (indent > 0) {
                _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
              }
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 93);
              _tmp = undefined;
              continue;
            }
          } else {
            const _Object = _x;
            const _iterator = _Object._0;
            const _first = _Object._1;
            const _bind = _M0MPB4Iter4nextGUsRPB4JsonEE(_iterator);
            if (_bind === undefined) {
              depth = depth - 1 | 0;
              _M0MPC15array5Array3popGRPC14json10WriteFrameE(stack);
              if (indent > 0) {
                _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
              }
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 125);
              _tmp = undefined;
              continue;
            } else {
              const _Some = _bind;
              const _x$2 = _Some;
              const _k = _x$2._0;
              const _v = _x$2._1;
              let v2 = _v;
              if (replacer === undefined) {
              } else {
                const _Some$2 = replacer;
                const _replacer = _Some$2;
                const _func = _replacer.f;
                const _bind$2 = _func(_k, _v);
                if (_bind$2 === undefined) {
                  _tmp = undefined;
                  continue;
                } else {
                  const _Some$3 = _bind$2;
                  const _v$2 = _Some$3;
                  v2 = _v$2;
                }
              }
              if (!_first) {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 44);
                if (indent > 0) {
                  _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
                }
              }
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
              _M0FPC14json14write__escaped(buf, _k, escape_slash);
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 58);
              if (indent > 0) {
                _M0IPB13StringBuilderPB6Logger11write__char(buf, 32);
              }
              _Object._1 = false;
              _tmp = v2;
              continue;
            }
          }
        }
      } else {
        const _Some = x;
        const _value = _Some;
        switch (_value.$tag) {
          case 6: {
            const _Object = _value;
            const _members = _Object._0;
            if (_members.size === 0) {
              _M0IPB13StringBuilderPB6Logger13write__string(buf, "{}");
            } else {
              depth = depth + 1 | 0;
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 123);
              if (indent > 0) {
                _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
              }
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(stack, new _M0DTPC14json10WriteFrame6Object(_M0MPB3Map4iterGsRPB4JsonE(_members), true));
            }
            break;
          }
          case 5: {
            const _Array = _value;
            const _arr = _Array._0;
            if (_arr.length === 0) {
              _M0IPB13StringBuilderPB6Logger13write__string(buf, "[]");
            } else {
              depth = depth + 1 | 0;
              _M0IPB13StringBuilderPB6Logger11write__char(buf, 91);
              if (indent > 0) {
                _M0FPC14json13write__indent(buf, indent_cache, depth, indent);
              }
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(stack, new _M0DTPC14json10WriteFrame5Array(_arr, 0));
            }
            break;
          }
          case 4: {
            const _String = _value;
            const _s = _String._0;
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
            _M0FPC14json14write__escaped(buf, _s, escape_slash);
            _M0IPB13StringBuilderPB6Logger11write__char(buf, 34);
            break;
          }
          case 3: {
            const _Number = _value;
            const _n = _Number._0;
            const _repr = _Number._1;
            if (_repr === undefined) {
              _M0MPB13StringBuilder13write__objectGdE(buf, _n);
            } else {
              const _Some$2 = _repr;
              const _r = _Some$2;
              _M0IPB13StringBuilderPB6Logger13write__string(buf, _r);
            }
            break;
          }
          case 1: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "true");
            break;
          }
          case 2: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "false");
            break;
          }
          default: {
            _M0IPB13StringBuilderPB6Logger13write__string(buf, "null");
          }
        }
        _tmp = undefined;
        continue;
      }
    }
    return buf.val;
  }
  function _M0FPC28encoding6base6413base64__value(code_unit) {
    return code_unit >= 65 && code_unit <= 90 ? code_unit - 65 | 0 : code_unit >= 97 && code_unit <= 122 ? (code_unit - 97 | 0) + 26 | 0 : code_unit >= 48 && code_unit <= 57 ? (code_unit - 48 | 0) + 52 | 0 : code_unit === 43 ? 62 : code_unit === 47 ? 63 : code_unit === 32 ? -3 : code_unit === 10 ? -3 : code_unit === 13 ? -3 : code_unit === 9 ? -3 : code_unit === 61 ? -2 : -1;
  }
  function _M0FPC28encoding6base6414decode__scalar(text, ignore_whitespace) {
    const buffer = _M0MPC16buffer6Buffer14Buffer_2einner(Math.imul((text.end - text.start | 0) / 4 | 0, 3) | 0);
    const quartet = $make_array_len_and_init(4, 0);
    let count = 0;
    const _bind = text.end - text.start | 0;
    let _tmp = 0;
    _L: while (true) {
      const i = _tmp;
      if (i < _bind) {
        const code_unit = text.str.charCodeAt(text.start + i | 0);
        _L$2: {
          const _bind$2 = _M0FPC28encoding6base6413base64__value(code_unit);
          switch (_bind$2) {
            case -3: {
              if (ignore_whitespace) {
                break _L$2;
              } else {
                return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
              }
            }
            case -2: {
              if (count < 2) {
                return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
              } else {
                const _tmp$2 = count;
                if (_tmp$2 >>> 0 < quartet.length) {
                  quartet[_tmp$2] = -2;
                } else {
                  $oob();
                }
                count = count + 1 | 0;
                if (count === 4) {
                  count = 0;
                  if ((2 >>> 0 < quartet.length ? quartet[2] : $oob()) === -2) {
                    const b0 = ((0 >>> 0 < quartet.length ? quartet[0] : $oob()) << 2 | (1 >>> 0 < quartet.length ? quartet[1] : $oob()) >> 4) & 255;
                    _M0MPC16buffer6Buffer11write__byte(buffer, b0);
                    if (((1 >>> 0 < quartet.length ? quartet[1] : $oob()) & 15) === 0) {
                    } else {
                      return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
                    }
                  } else {
                    const b0 = ((0 >>> 0 < quartet.length ? quartet[0] : $oob()) << 2 | (1 >>> 0 < quartet.length ? quartet[1] : $oob()) >> 4) & 255;
                    const b1 = (((1 >>> 0 < quartet.length ? quartet[1] : $oob()) & 15) << 4 | (2 >>> 0 < quartet.length ? quartet[2] : $oob()) >> 2) & 255;
                    if (((2 >>> 0 < quartet.length ? quartet[2] : $oob()) & 3) === 0) {
                      _M0MPC16buffer6Buffer11write__byte(buffer, b0);
                      _M0MPC16buffer6Buffer11write__byte(buffer, b1);
                    } else {
                      return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
                    }
                  }
                  if (ignore_whitespace) {
                    const _bind$3 = _M0MPC15array9ArrayView21clamped__view_2einnerGkE(_M0MPC16string10StringView11code__units(text), i + 1 | 0, undefined);
                    const _bind$4 = _bind$3.end - _bind$3.start | 0;
                    let _tmp$3 = 0;
                    while (true) {
                      const _ = _tmp$3;
                      if (_ < _bind$4) {
                        const code_unit$2 = _bind$3.buf[_bind$3.start + _ | 0];
                        switch (code_unit$2) {
                          case 32: {
                            break;
                          }
                          case 10: {
                            break;
                          }
                          case 13: {
                            break;
                          }
                          case 9: {
                            break;
                          }
                          default: {
                            return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
                          }
                        }
                        _tmp$3 = _ + 1 | 0;
                        continue;
                      } else {
                        break;
                      }
                    }
                  } else {
                    if ((i + 1 | 0) === (text.end - text.start | 0)) {
                    } else {
                      return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
                    }
                  }
                  break _L;
                }
              }
              break;
            }
            case -1: {
              return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
            }
            default: {
              const _tmp$2 = count;
              if (_tmp$2 >>> 0 < quartet.length) {
                quartet[_tmp$2] = _bind$2;
              } else {
                $oob();
              }
              count = count + 1 | 0;
              if (count === 4) {
                count = 0;
                if ((2 >>> 0 < quartet.length ? quartet[2] : $oob()) !== -2) {
                  const b0 = ((0 >>> 0 < quartet.length ? quartet[0] : $oob()) << 2 | (1 >>> 0 < quartet.length ? quartet[1] : $oob()) >> 4) & 255;
                  const b1 = (((1 >>> 0 < quartet.length ? quartet[1] : $oob()) & 15) << 4 | (2 >>> 0 < quartet.length ? quartet[2] : $oob()) >> 2) & 255;
                  const b2 = (((2 >>> 0 < quartet.length ? quartet[2] : $oob()) & 3) << 6 | (3 >>> 0 < quartet.length ? quartet[3] : $oob())) & 255;
                  _M0MPC16buffer6Buffer11write__byte(buffer, b0);
                  _M0MPC16buffer6Buffer11write__byte(buffer, b1);
                  _M0MPC16buffer6Buffer11write__byte(buffer, b2);
                } else {
                  return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
                }
              }
            }
          }
          break _L$2;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$2 = count;
    switch (_bind$2) {
      case 1: {
        return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
      }
      case 2: {
        const b0 = ((0 >>> 0 < quartet.length ? quartet[0] : $oob()) << 2 | (1 >>> 0 < quartet.length ? quartet[1] : $oob()) >> 4) & 255;
        if (((1 >>> 0 < quartet.length ? quartet[1] : $oob()) & 15) === 0) {
          _M0MPC16buffer6Buffer11write__byte(buffer, b0);
        } else {
          return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
        }
        break;
      }
      case 3: {
        if ((2 >>> 0 < quartet.length ? quartet[2] : $oob()) !== -2) {
          const b0$2 = ((0 >>> 0 < quartet.length ? quartet[0] : $oob()) << 2 | (1 >>> 0 < quartet.length ? quartet[1] : $oob()) >> 4) & 255;
          const b1 = (((1 >>> 0 < quartet.length ? quartet[1] : $oob()) & 15) << 4 | (2 >>> 0 < quartet.length ? quartet[2] : $oob()) >> 2) & 255;
          if (((2 >>> 0 < quartet.length ? quartet[2] : $oob()) & 3) === 0) {
            _M0MPC16buffer6Buffer11write__byte(buffer, b0$2);
            _M0MPC16buffer6Buffer11write__byte(buffer, b1);
          } else {
            return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
          }
        } else {
          return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE3Err(new _M0DTPC15error5Error62moonbitlang_2fcore_2fencoding_2fbase64_2eMalformed_2eMalformed(text));
        }
        break;
      }
    }
    return new _M0DTPC16result6ResultGzRPC28encoding6base649MalformedE2Ok(_M0MPC16buffer6Buffer9to__bytes(buffer));
  }
  function _M0FPC28encoding6base6414decode_2einner(text, ignore_whitespace) {
    return _M0FPC28encoding6base6414decode__scalar(text, ignore_whitespace);
  }
  function _M0FPC14math3sin(_tmp) {
    return Math.sin(_tmp);
  }
  function _M0FPC14math3cos(_tmp) {
    return Math.cos(_tmp);
  }
  function _M0FPC14math4acos(_tmp) {
    return Math.acos(_tmp);
  }
  function _M0FPC14math4atan(_tmp) {
    return Math.atan(_tmp);
  }
  function _M0FPC14math5atan2(_tmp, _tmp$2) {
    return Math.atan2(_tmp, _tmp$2);
  }
  function _M0FP27mik1e806dxfkit14finite__number(x) {
    return !(x !== x) && !(x > _M0FPB18double__max__value || x < _M0FPB18double__min__value);
  }
  function _M0FP27mik1e806dxfkit7finite3(p) {
    return _M0FP27mik1e806dxfkit14finite__number(p.x) && (_M0FP27mik1e806dxfkit14finite__number(p.y) && _M0FP27mik1e806dxfkit14finite__number(p.z));
  }
  function _M0FP27mik1e806dxfkit19positive__tolerance(tol) {
    return _M0FP27mik1e806dxfkit14finite__number(tol) && tol > 0;
  }
  function _M0MP27mik1e806dxfkit4Vec35cross(self, other) {
    return new _M0TP27mik1e806dxfkit4Vec3(self.y * other.z - self.z * other.y, self.z * other.x - self.x * other.z, self.x * other.y - self.y * other.x);
  }
  function _M0MP27mik1e806dxfkit4Vec33new(x, y, z) {
    return new _M0TP27mik1e806dxfkit4Vec3(x, y, z);
  }
  function _M0FP27mik1e806dxfkit13scaled__hypot(x, y) {
    const m = _M0MPC16double6Double3max(Math.abs(x), Math.abs(y));
    if (m === 0 || !_M0FP27mik1e806dxfkit14finite__number(m)) {
      return m;
    }
    const a = x / m;
    const b = y / m;
    return m * Math.sqrt(a * a + b * b);
  }
  function _M0MP27mik1e806dxfkit4Vec36length(self) {
    return _M0FP27mik1e806dxfkit13scaled__hypot(_M0FP27mik1e806dxfkit13scaled__hypot(self.x, self.y), self.z);
  }
  function _M0MP27mik1e806dxfkit4Vec39normalize(self) {
    const len = _M0MP27mik1e806dxfkit4Vec36length(self);
    return len === 0 ? self : new _M0TP27mik1e806dxfkit4Vec3(self.x / len, self.y / len, self.z / len);
  }
  function _M0MP27mik1e806dxfkit3Ocs15from__extrusion(normal) {
    const m = _M0MPC16double6Double3max(_M0MPC16double6Double3max(Math.abs(normal.x), Math.abs(normal.y)), Math.abs(normal.z));
    if (!_M0FP27mik1e806dxfkit7finite3(normal) || (!_M0FP27mik1e806dxfkit14finite__number(m) || m === 0)) {
      return _M0MP27mik1e806dxfkit3Ocs15from__extrusionN6constrS5729;
    }
    const n = _M0MP27mik1e806dxfkit4Vec39normalize(_M0MP27mik1e806dxfkit4Vec33new(normal.x / m, normal.y / m, normal.z / m));
    const helper = Math.abs(n.x) < 0.015625 && Math.abs(n.y) < 0.015625 ? _M0MP27mik1e806dxfkit4Vec33new(0, 1, 0) : _M0MP27mik1e806dxfkit4Vec33new(0, 0, 1);
    const x = _M0MP27mik1e806dxfkit4Vec39normalize(_M0MP27mik1e806dxfkit4Vec35cross(helper, n));
    return new _M0DTPC16result6ResultGRP27mik1e806dxfkit3OcssE2Ok(new _M0TP27mik1e806dxfkit3Ocs(x, _M0MP27mik1e806dxfkit4Vec35cross(n, x), n));
  }
  function _M0MP27mik1e806dxfkit6Record3get(self, code) {
    const _bind = self.common;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const t = _bind[_];
        if (t.code === code) {
          return t;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$3 = self.subclasses;
    const _bind$4 = _bind$3.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$4) {
        const sc = _bind$3[_];
        const _bind$5 = sc.tags;
        const _bind$6 = _bind$5.length;
        let _tmp$3 = 0;
        while (true) {
          const _$2 = _tmp$3;
          if (_$2 < _bind$6) {
            const t = _bind$5[_$2];
            if (t.code === code) {
              return t;
            }
            _tmp$3 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return undefined;
  }
  function _M0MP27mik1e806dxfkit8TagValue10as__double(self) {
    let v;
    _L: {
      switch (self.$tag) {
        case 4: {
          const _F64 = self;
          return _F64._0;
        }
        case 1: {
          const _I16 = self;
          const _v = _I16._0;
          v = _v;
          break _L;
        }
        case 2: {
          const _I32 = self;
          const _v$2 = _I32._0;
          v = _v$2;
          break _L;
        }
        case 3: {
          const _I64 = self;
          const _v$3 = _I64._0;
          return $f64_convert_i64(BigInt.asIntN(64, _v$3));
        }
        case 5: {
          const _Bool = self;
          const _b = _Bool._0;
          return _b ? 1 : 0;
        }
        default: {
          return 0;
        }
      }
    }
    return v + 0;
  }
  function _M0MP27mik1e806dxfkit6Record11get__double(self, code, default_) {
    const _bind = _M0MP27mik1e806dxfkit6Record3get(self, code);
    if (_bind === undefined) {
      return default_;
    } else {
      const _Some = _bind;
      const _t = _Some;
      return _M0MP27mik1e806dxfkit8TagValue10as__double(_t.value);
    }
  }
  function _M0FP27mik1e806dxfkit11record__ocs(record) {
    return _M0MP27mik1e806dxfkit3Ocs15from__extrusion(_M0MP27mik1e806dxfkit4Vec33new(_M0MP27mik1e806dxfkit6Record11get__double(record, 210, 0), _M0MP27mik1e806dxfkit6Record11get__double(record, 220, 0), _M0MP27mik1e806dxfkit6Record11get__double(record, 230, 1)));
  }
  function _M0FP27mik1e806dxfkit10in__ranges(code, ranges) {
    const _bind = ranges.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const r = ranges[_];
        if (code >= r._0 && code <= r._1) {
          return true;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return false;
  }
  function _M0FP27mik1e806dxfkit10code__type(code) {
    return _M0FP27mik1e806dxfkit10in__ranges(code, [_M0FP27mik1e806dxfkit10code__typeN5tupleS5730, _M0FP27mik1e806dxfkit10code__typeN5tupleS5731, _M0FP27mik1e806dxfkit10code__typeN5tupleS5732, _M0FP27mik1e806dxfkit10code__typeN5tupleS5733, _M0FP27mik1e806dxfkit10code__typeN5tupleS5734, _M0FP27mik1e806dxfkit10code__typeN5tupleS5735]) ? 1 : _M0FP27mik1e806dxfkit10in__ranges(code, [_M0FP27mik1e806dxfkit10code__typeN5tupleS5736, _M0FP27mik1e806dxfkit10code__typeN5tupleS5737, _M0FP27mik1e806dxfkit10code__typeN5tupleS5738, _M0FP27mik1e806dxfkit10code__typeN5tupleS5739]) ? 2 : _M0FP27mik1e806dxfkit10in__ranges(code, [_M0FP27mik1e806dxfkit10code__typeN5tupleS5740]) ? 3 : _M0FP27mik1e806dxfkit10in__ranges(code, [_M0FP27mik1e806dxfkit10code__typeN5tupleS5741, _M0FP27mik1e806dxfkit10code__typeN5tupleS5742, _M0FP27mik1e806dxfkit10code__typeN5tupleS5743, _M0FP27mik1e806dxfkit10code__typeN5tupleS5744, _M0FP27mik1e806dxfkit10code__typeN5tupleS5745]) ? 4 : _M0FP27mik1e806dxfkit10in__ranges(code, [_M0FP27mik1e806dxfkit10code__typeN5tupleS5746]) ? 5 : _M0FP27mik1e806dxfkit10in__ranges(code, [_M0FP27mik1e806dxfkit10code__typeN5tupleS5747, _M0FP27mik1e806dxfkit10code__typeN5tupleS5748]) ? 6 : 0;
  }
  function _M0FP27mik1e806dxfkit20valid__numeric__tags(record) {
    const groups = [record.common];
    const _bind = record.subclasses;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const sc = _bind[_];
        _M0MPC15array5Array4pushGRPB5ArrayGRP27mik1e806dxfkit3TagEE(groups, sc.tags);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$3 = groups.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$3) {
        const tags = groups[_];
        const _bind$4 = tags.length;
        let _tmp$3 = 0;
        while (true) {
          const _$2 = _tmp$3;
          if (_$2 < _bind$4) {
            const tag = tags[_$2];
            _L: {
              _L$2: {
                const _bind$5 = _M0FP27mik1e806dxfkit10code__type(tag.code);
                const _bind$6 = tag.value;
                switch (_bind$5) {
                  case 4: {
                    switch (_bind$6.$tag) {
                      case 4: {
                        const _F64 = _bind$6;
                        const _v = _F64._0;
                        if (!_M0FP27mik1e806dxfkit14finite__number(_v)) {
                          return false;
                        }
                        break;
                      }
                      case 1: {
                        break;
                      }
                      case 2: {
                        break;
                      }
                      case 3: {
                        break;
                      }
                      default: {
                        break _L$2;
                      }
                    }
                    break;
                  }
                  case 1: {
                    switch (_bind$6.$tag) {
                      case 1: {
                        break;
                      }
                      case 2: {
                        break;
                      }
                      default: {
                        break _L$2;
                      }
                    }
                    break;
                  }
                  case 2: {
                    switch (_bind$6.$tag) {
                      case 1: {
                        break;
                      }
                      case 2: {
                        break;
                      }
                      default: {
                        break _L$2;
                      }
                    }
                    break;
                  }
                  case 3: {
                    if (_bind$6.$tag === 3) {
                    } else {
                      break _L$2;
                    }
                    break;
                  }
                  case 5: {
                    if (_bind$6.$tag === 5) {
                    } else {
                      break _L$2;
                    }
                    break;
                  }
                  case 0: {
                    break;
                  }
                }
                break _L;
              }
              return false;
            }
            _tmp$3 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return true;
  }
  function _M0FP27mik1e806dxfkit16normalize__angle(rad) {
    let a = _M0IPC16double6DoublePB3Mod3mod(rad, 6.2831853071795862);
    if (a < 0) {
      a = a + 6.2831853071795862;
    }
    return a;
  }
  function _M0FP27mik1e806dxfkit11angle__span(from, to) {
    return _M0FP27mik1e806dxfkit16normalize__angle(to - from);
  }
  function _M0FP27mik1e806dxfkit18arc__cap__exceeded(radius, sweep, tol) {
    const s = _M0FPC14math3sin(sweep / 16384);
    return 2 * Math.abs(radius) * s * s > tol * 1.000000000001;
  }
  function _M0MP27mik1e806dxfkit4Vec25angle(self) {
    return _M0FPC14math5atan2(self.y, self.x);
  }
  function _M0MP27mik1e806dxfkit4Vec26length(self) {
    return _M0FP27mik1e806dxfkit13scaled__hypot(self.x, self.y);
  }
  function _M0MP27mik1e806dxfkit4Vec23sub(self, other) {
    return new _M0TP27mik1e806dxfkit4Vec2(self.x - other.x, self.y - other.y);
  }
  function _M0MP27mik1e806dxfkit4Vec28distance(self, other) {
    return _M0MP27mik1e806dxfkit4Vec26length(_M0MP27mik1e806dxfkit4Vec23sub(self, other));
  }
  function _M0MP27mik1e806dxfkit4Vec23new(x, y) {
    return new _M0TP27mik1e806dxfkit4Vec2(x, y);
  }
  function _M0FP27mik1e806dxfkit16arc__from__bulge(a, b, bulge) {
    const chord_angle = _M0MP27mik1e806dxfkit4Vec25angle(_M0MP27mik1e806dxfkit4Vec23sub(b, a));
    const signed_r = _M0MP27mik1e806dxfkit4Vec28distance(a, b) * (1 + bulge * bulge) / 4 / bulge;
    const center_angle = chord_angle + (1.5707963267948966 - _M0FPC14math4atan(bulge) * 2);
    const center = _M0MP27mik1e806dxfkit4Vec23new(a.x + signed_r * _M0FPC14math3cos(center_angle), a.y + signed_r * _M0FPC14math3sin(center_angle));
    const radius = Math.abs(signed_r);
    return bulge < 0 ? new _M0TP27mik1e806dxfkit8BulgeArc(center, radius, _M0MP27mik1e806dxfkit4Vec25angle(_M0MP27mik1e806dxfkit4Vec23sub(b, center)), _M0MP27mik1e806dxfkit4Vec25angle(_M0MP27mik1e806dxfkit4Vec23sub(a, center))) : new _M0TP27mik1e806dxfkit8BulgeArc(center, radius, _M0MP27mik1e806dxfkit4Vec25angle(_M0MP27mik1e806dxfkit4Vec23sub(a, center)), _M0MP27mik1e806dxfkit4Vec25angle(_M0MP27mik1e806dxfkit4Vec23sub(b, center)));
  }
  function _M0FP27mik1e806dxfkit10arc__sweep(start, end) {
    const span = _M0FP27mik1e806dxfkit11angle__span(start, end);
    return span < 1e-012 ? 6.2831853071795862 : span;
  }
  function _M0FP27mik1e806dxfkit13ellipse__span(start_param, end_param) {
    let span = end_param - start_param;
    if (span < 0) {
      span = span + 6.2831853071795862;
    }
    if (span < 1e-012) {
      span = 6.2831853071795862;
    }
    return span;
  }
  function _M0FP27mik1e806dxfkit6mix__h(a, b, t) {
    return _M0MP27mik1e806dxfkit4Vec33new((1 - t) * a.x + t * b.x, (1 - t) * a.y + t * b.y, (1 - t) * a.z + t * b.z);
  }
  function _M0FP27mik1e806dxfkit20insert__spline__knot(ctrl, knots, degree, value) {
    let span = degree;
    while (true) {
      if ((span + 1 | 0) < knots.length && _M0MPC15array5Array2atGdE(knots, span + 1 | 0) <= value) {
        span = span + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    let multiplicity = 0;
    const _bind = knots.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const u = knots[_];
        if (u === value) {
          multiplicity = multiplicity + 1 | 0;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const result = [];
    let _tmp$2 = 0;
    while (true) {
      const i = _tmp$2;
      if (i <= ctrl.length) {
        if (i <= (span - degree | 0)) {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(result, _M0MPC15array5Array2atGRPB4JsonE(ctrl, i));
        } else {
          if (i >= ((span - multiplicity | 0) + 1 | 0)) {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(result, _M0MPC15array5Array2atGRPB4JsonE(ctrl, i - 1 | 0));
          } else {
            const alpha = (value - _M0MPC15array5Array2atGdE(knots, i)) / (_M0MPC15array5Array2atGdE(knots, i + degree | 0) - _M0MPC15array5Array2atGdE(knots, i));
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(result, _M0FP27mik1e806dxfkit6mix__h(_M0MPC15array5Array2atGRPB4JsonE(ctrl, i - 1 | 0), _M0MPC15array5Array2atGRPB4JsonE(ctrl, i), alpha));
          }
        }
        _tmp$2 = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const new_knots = [];
    let _tmp$3 = 0;
    while (true) {
      const i = _tmp$3;
      if (i < knots.length) {
        _M0MPC15array5Array4pushGdE(new_knots, _M0MPC15array5Array2atGdE(knots, i));
        if (i === span) {
          _M0MPC15array5Array4pushGdE(new_knots, value);
        }
        _tmp$3 = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return { _0: result, _1: new_knots };
  }
  function _M0FP27mik1e806dxfkit10project__h(p) {
    return _M0MP27mik1e806dxfkit4Vec23new(p.x / p.z, p.y / p.z);
  }
  function _M0MP27mik1e806dxfkit4Vec23add(self, other) {
    return new _M0TP27mik1e806dxfkit4Vec2(self.x + other.x, self.y + other.y);
  }
  function _M0MP27mik1e806dxfkit4Vec25scale(self, k) {
    return new _M0TP27mik1e806dxfkit4Vec2(self.x * k, self.y * k);
  }
  function _M0FP27mik1e806dxfkit17dist__to__segment(p, a, b) {
    const ab = _M0MP27mik1e806dxfkit4Vec23sub(b, a);
    const len = _M0MP27mik1e806dxfkit4Vec26length(ab);
    if (len === 0) {
      return _M0MP27mik1e806dxfkit4Vec28distance(p, a);
    }
    const unit = _M0MP27mik1e806dxfkit4Vec23new(ab.x / len, ab.y / len);
    const _p = _M0MP27mik1e806dxfkit4Vec23sub(p, a);
    let t = (_p.x * unit.x + _p.y * unit.y) / len;
    if (t < 0) {
      t = 0;
    }
    if (t > 1) {
      t = 1;
    }
    return _M0MP27mik1e806dxfkit4Vec28distance(p, _M0MP27mik1e806dxfkit4Vec23add(a, _M0MP27mik1e806dxfkit4Vec25scale(ab, t)));
  }
  function _M0FP27mik1e806dxfkit14sample__bezier(ctrl, tol, depth, out) {
    let _tmp = ctrl;
    let _tmp$2 = depth;
    while (true) {
      const ctrl$2 = _tmp;
      const depth$2 = _tmp$2;
      if (out.length >= 65536) {
        return false;
      }
      const a = _M0FP27mik1e806dxfkit10project__h(_M0MPC15array5Array2atGRPB4JsonE(ctrl$2, 0));
      const b = _M0FP27mik1e806dxfkit10project__h(_M0MPC15array5Array2atGRPB4JsonE(ctrl$2, ctrl$2.length - 1 | 0));
      let flat = true;
      const _bind = ctrl$2.length;
      let _tmp$3 = 0;
      while (true) {
        const _ = _tmp$3;
        if (_ < _bind) {
          const h = ctrl$2[_];
          const p = _M0FP27mik1e806dxfkit10project__h(h);
          if (!_M0FP27mik1e806dxfkit14finite__number(p.x) || !_M0FP27mik1e806dxfkit14finite__number(p.y)) {
            return false;
          }
          const distance = _M0FP27mik1e806dxfkit17dist__to__segment(p, a, b);
          if (!_M0FP27mik1e806dxfkit14finite__number(distance)) {
            return false;
          }
          if (distance > tol) {
            flat = false;
          }
          _tmp$3 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      if (flat) {
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, b);
        return true;
      }
      if (depth$2 === 0) {
        return false;
      }
      const work = _M0MPC15array5Array4copyGsE(ctrl$2);
      const left = [_M0MPC15array5Array2atGRPB4JsonE(work, 0)];
      const right = [_M0MPC15array5Array2atGRPB4JsonE(work, work.length - 1 | 0)];
      let _tmp$4 = 1;
      while (true) {
        const level = _tmp$4;
        if (level < ctrl$2.length) {
          let _tmp$5 = 0;
          while (true) {
            const i = _tmp$5;
            if (i < (ctrl$2.length - level | 0)) {
              _M0MPC15array5Array3setGsE(work, i, _M0FP27mik1e806dxfkit6mix__h(_M0MPC15array5Array2atGRPB4JsonE(work, i), _M0MPC15array5Array2atGRPB4JsonE(work, i + 1 | 0), 0.5));
              _tmp$5 = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(left, _M0MPC15array5Array2atGRPB4JsonE(work, 0));
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(right, _M0MPC15array5Array2atGRPB4JsonE(work, (ctrl$2.length - level | 0) - 1 | 0));
          _tmp$4 = level + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      const reversed = [];
      let _tmp$5 = right.length - 1 | 0;
      while (true) {
        const i = _tmp$5;
        if (i >= 0) {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(reversed, _M0MPC15array5Array2atGRPB4JsonE(right, i));
          _tmp$5 = i - 1 | 0;
          continue;
        } else {
          break;
        }
      }
      if (_M0FP27mik1e806dxfkit14sample__bezier(left, tol, depth$2 - 1 | 0, out)) {
        _tmp = reversed;
        _tmp$2 = depth$2 - 1 | 0;
        continue;
      } else {
        return false;
      }
    }
  }
  function _M0FP27mik1e806dxfkit10weight__at(weights, i) {
    return i < weights.length ? _M0MPC15array5Array2atGdE(weights, i) : 1;
  }
  function _M0FP27mik1e806dxfkit23spline__points__checked(degree, knots, control_points, weights, tol) {
    const count = control_points.length;
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(tol)) {
      return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5749;
    }
    if (degree < 1 || (degree > 32 || (count <= degree || (count > 4096 || knots.length !== ((count + degree | 0) + 1 | 0))))) {
      return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5750;
    }
    if (weights.length !== 0 && weights.length !== count) {
      return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5751;
    }
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < knots.length) {
        if (!_M0FP27mik1e806dxfkit14finite__number(_M0MPC15array5Array2atGdE(knots, i)) || i > 0 && _M0MPC15array5Array2atGdE(knots, i) < _M0MPC15array5Array2atGdE(knots, i - 1 | 0)) {
          return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5752;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const start = _M0MPC15array5Array2atGdE(knots, degree);
    const end = _M0MPC15array5Array2atGdE(knots, count);
    if (end <= start) {
      return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5753;
    }
    if (!_M0FP27mik1e806dxfkit14finite__number(end - start)) {
      return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5754;
    }
    let weight_scale = 0;
    let _tmp$2 = 0;
    while (true) {
      const i = _tmp$2;
      if (i < count) {
        const weight = _M0FP27mik1e806dxfkit10weight__at(weights, i);
        if (!_M0FP27mik1e806dxfkit14finite__number(weight) || weight <= 0) {
          return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5755;
        }
        weight_scale = _M0MPC16double6Double3max(weight_scale, weight);
        _tmp$2 = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    let ctrl = [];
    let _tmp$3 = 0;
    while (true) {
      const i = _tmp$3;
      if (i < count) {
        const p = _M0MPC15array5Array2atGRPB4JsonE(control_points, i);
        const w = _M0FP27mik1e806dxfkit10weight__at(weights, i) / weight_scale;
        if (!_M0FP27mik1e806dxfkit14finite__number(p.x) || (!_M0FP27mik1e806dxfkit14finite__number(p.y) || (!_M0FP27mik1e806dxfkit14finite__number(p.z) || (!_M0FP27mik1e806dxfkit14finite__number(w) || (w < 1e-100 || (!_M0FP27mik1e806dxfkit14finite__number(p.x * w) || !_M0FP27mik1e806dxfkit14finite__number(p.y * w))))))) {
          return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5756;
        }
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(ctrl, _M0MP27mik1e806dxfkit4Vec33new(p.x * w, p.y * w, w));
        _tmp$3 = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const breaks = [];
    const _bind = knots.length;
    let _tmp$4 = 0;
    while (true) {
      const _ = _tmp$4;
      if (_ < _bind) {
        const u = knots[_];
        if (u >= start && (u <= end && (breaks.length === 0 || _M0MPC15array5Array2atGdE(breaks, breaks.length - 1 | 0) !== u))) {
          _M0MPC15array5Array4pushGdE(breaks, u);
        }
        _tmp$4 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    let refined = _M0MPC15array5Array4copyGdE(knots);
    const _bind$2 = breaks.length;
    let _tmp$5 = 0;
    while (true) {
      const _ = _tmp$5;
      if (_ < _bind$2) {
        const u = breaks[_];
        let multiplicity = 0;
        const _bind$3 = refined;
        const _bind$4 = _bind$3.length;
        let _tmp$6 = 0;
        while (true) {
          const _$2 = _tmp$6;
          if (_$2 < _bind$4) {
            const v = _bind$3[_$2];
            if (u === v) {
              multiplicity = multiplicity + 1 | 0;
            }
            _tmp$6 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        if (multiplicity > (degree + 1 | 0)) {
          return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5757;
        }
        if (u > start && (u < end && multiplicity > degree)) {
          return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5758;
        }
        while (true) {
          if (multiplicity < degree) {
            const _bind$5 = _M0FP27mik1e806dxfkit20insert__spline__knot(ctrl, refined, degree, u);
            const _next_ctrl = _bind$5._0;
            const _next_knots = _bind$5._1;
            ctrl = _next_ctrl;
            refined = _next_knots;
            multiplicity = multiplicity + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp$5 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const out = [];
    let _tmp$6 = degree;
    while (true) {
      const k = _tmp$6;
      if (k < ctrl.length) {
        _L: {
          if (_M0MPC15array5Array2atGdE(refined, k) < start || (_M0MPC15array5Array2atGdE(refined, k + 1 | 0) > end || _M0MPC15array5Array2atGdE(refined, k + 1 | 0) <= _M0MPC15array5Array2atGdE(refined, k))) {
            break _L;
          }
          const segment = [];
          let _tmp$7 = k - degree | 0;
          while (true) {
            const i = _tmp$7;
            if (i <= k) {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(segment, _M0MPC15array5Array2atGRPB4JsonE(ctrl, i));
              _tmp$7 = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          if (out.length === 0) {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, _M0FP27mik1e806dxfkit10project__h(_M0MPC15array5Array2atGRPB4JsonE(segment, 0)));
          }
          if (!_M0FP27mik1e806dxfkit14sample__bezier(segment, tol, 16, out)) {
            return _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5759;
          }
          break _L;
        }
        _tmp$6 = k + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return out.length === 0 ? _M0FP27mik1e806dxfkit23spline__points__checkedN6constrS5760 : new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE2Ok(out);
  }
  function _M0MP27mik1e806dxfkit4Vec32xy(self) {
    return new _M0TP27mik1e806dxfkit4Vec2(self.x, self.y);
  }
  function _M0FP27mik1e806dxfkit24ellipse__points__checked(center, major, ratio, start_param, end_param, tol) {
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(tol) || (!_M0FP27mik1e806dxfkit14finite__number(start_param) || (!_M0FP27mik1e806dxfkit14finite__number(end_param) || (!_M0FP27mik1e806dxfkit14finite__number(ratio) || (ratio <= 0 || ratio > 1))))) {
      return _M0FP27mik1e806dxfkit24ellipse__points__checkedN6constrS5761;
    }
    const c = _M0MP27mik1e806dxfkit4Vec32xy(center);
    const m = _M0MP27mik1e806dxfkit4Vec32xy(major);
    const n = _M0MP27mik1e806dxfkit4Vec23new(-m.y * ratio, m.x * ratio);
    if (_M0MP27mik1e806dxfkit4Vec26length(m) === 0) {
      return _M0FP27mik1e806dxfkit24ellipse__points__checkedN6constrS5762;
    }
    const span = _M0FP27mik1e806dxfkit13ellipse__span(start_param, end_param);
    if (!_M0FP27mik1e806dxfkit14finite__number(span) || span > 6.2831853071805863) {
      return _M0FP27mik1e806dxfkit24ellipse__points__checkedN6constrS5763;
    }
    let segments = _M0MPC16double6Double7to__int(span / 1.5707963267948966);
    if ((segments + 0) * 1.5707963267948966 < span) {
      segments = segments + 1 | 0;
    }
    if (segments < 1) {
      segments = 1;
    }
    const out = [];
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < segments) {
        const a = start_param + span * (i + 0) / (segments + 0);
        const b = start_param + span * ((i + 1 | 0) + 0) / (segments + 0);
        const mid = 0.5 * a + 0.5 * b;
        const w = _M0FPC14math3cos(0.5 * (b - a));
        const p0 = _M0MP27mik1e806dxfkit4Vec23add(_M0MP27mik1e806dxfkit4Vec23add(c, _M0MP27mik1e806dxfkit4Vec25scale(m, _M0FPC14math3cos(a))), _M0MP27mik1e806dxfkit4Vec25scale(n, _M0FPC14math3sin(a)));
        const p1 = _M0MP27mik1e806dxfkit4Vec23add(_M0MP27mik1e806dxfkit4Vec23add(c, _M0MP27mik1e806dxfkit4Vec25scale(m, _M0FPC14math3cos(mid) / w)), _M0MP27mik1e806dxfkit4Vec25scale(n, _M0FPC14math3sin(mid) / w));
        const p2 = _M0MP27mik1e806dxfkit4Vec23add(_M0MP27mik1e806dxfkit4Vec23add(c, _M0MP27mik1e806dxfkit4Vec25scale(m, _M0FPC14math3cos(b))), _M0MP27mik1e806dxfkit4Vec25scale(n, _M0FPC14math3sin(b)));
        const _bind = _M0FP27mik1e806dxfkit23spline__points__checked(2, [0, 0, 0, 1, 1, 1], [_M0MP27mik1e806dxfkit4Vec33new(p0.x, p0.y, 0), _M0MP27mik1e806dxfkit4Vec33new(p1.x, p1.y, 0), _M0MP27mik1e806dxfkit4Vec33new(p2.x, p2.y, 0)], [1, w, 1], tol);
        let points;
        if (_bind.$tag === 1) {
          const _Ok = _bind;
          points = _Ok._0;
        } else {
          const _Err = _bind;
          const _msg = _Err._0;
          return new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE3Err(_msg);
        }
        let _tmp$2 = i === 0 ? 0 : 1;
        while (true) {
          const j = _tmp$2;
          if (j < points.length) {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, _M0MPC15array5Array2atGRPB4JsonE(points, j));
            _tmp$2 = j + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        if (out.length > 65536) {
          return _M0FP27mik1e806dxfkit24ellipse__points__checkedN6constrS5764;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (span >= 6.2831853071785861) {
      const closed = [];
      let _tmp$2 = 0;
      while (true) {
        const i = _tmp$2;
        if ((i + 1 | 0) < out.length) {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(closed, _M0MPC15array5Array2atGRPB4JsonE(out, i));
          _tmp$2 = i + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      return new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE2Ok(closed);
    } else {
      return new _M0DTPC16result6ResultGRPB5ArrayGRP27mik1e806dxfkit4Vec2EsE2Ok(out);
    }
  }
  function _M0FP27mik1e806dxfkit16flat__is__finite(flat) {
    switch (flat.$tag) {
      case 0: {
        const _Outline = flat;
        const _points = _Outline._0;
        const _bind = _points.length;
        let _tmp = 0;
        while (true) {
          const _ = _tmp;
          if (_ < _bind) {
            const p = _points[_];
            if (!_M0FP27mik1e806dxfkit14finite__number(p.x) || !_M0FP27mik1e806dxfkit14finite__number(p.y)) {
              return false;
            }
            _tmp = _ + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        return true;
      }
      case 1: {
        const _Dot = flat;
        const _at = _Dot._0;
        return _M0FP27mik1e806dxfkit14finite__number(_at.x) && _M0FP27mik1e806dxfkit14finite__number(_at.y);
      }
      case 2: {
        const _Label = flat;
        const _at$2 = _Label._0;
        const _height = _Label._1;
        return _M0FP27mik1e806dxfkit14finite__number(_at$2.x) && (_M0FP27mik1e806dxfkit14finite__number(_at$2.y) && _M0FP27mik1e806dxfkit14finite__number(_height));
      }
      default: {
        return true;
      }
    }
  }
  function _M0FP27mik1e806dxfkit13arc__segments(radius, sweep, tol) {
    const c = 1 - tol / radius;
    const step = c >= 1 ? 0.0015339807878856412 : c <= -1 ? 6.2831853071795862 : 2 * _M0FPC14math4acos(c);
    let n = _M0MPC16double6Double7to__int(sweep / step);
    if ((n + 0) * step < sweep) {
      n = n + 1 | 0;
    }
    if (n < 1) {
      n = 1;
    }
    if (n > 4096) {
      n = 4096;
    }
    return n;
  }
  function _M0FP27mik1e806dxfkit17point__on__circle(c, r, angle) {
    return _M0MP27mik1e806dxfkit4Vec23new(c.x + r * _M0FPC14math3cos(angle), c.y + r * _M0FPC14math3sin(angle));
  }
  function _M0FP27mik1e806dxfkit11arc__points(center, radius, start_angle, end_angle, tol) {
    const r = Math.abs(radius);
    if (r === 0) {
      return [center];
    }
    const sweep = _M0FP27mik1e806dxfkit11angle__span(start_angle, end_angle);
    const n = _M0FP27mik1e806dxfkit13arc__segments(r, sweep, tol);
    const points = [];
    let i = 0;
    while (true) {
      if (i <= n) {
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, _M0FP27mik1e806dxfkit17point__on__circle(center, r, start_angle + sweep * (i + 0) / (n + 0)));
        i = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return points;
  }
  function _M0FP27mik1e806dxfkit14circle__points(center, radius, tol) {
    const r = Math.abs(radius);
    if (r === 0) {
      return [center];
    }
    const count = _M0FP27mik1e806dxfkit13arc__segments(r, 6.2831853071795862, tol);
    const n = count < 3 ? 3 : count;
    const points = [];
    let i = 0;
    while (true) {
      if (i < n) {
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, _M0FP27mik1e806dxfkit17point__on__circle(center, r, 6.2831853071795862 * (i + 0) / (n + 0)));
        i = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return points;
  }
  function _M0FP27mik1e806dxfkit15ellipse__points(center, major, ratio, start_param, end_param, tol) {
    const _bind = _M0FP27mik1e806dxfkit24ellipse__points__checked(center, major, ratio, start_param, end_param, tol);
    if (_bind.$tag === 1) {
      const _Ok = _bind;
      return _Ok._0;
    } else {
      return [];
    }
  }
  function _M0FP27mik1e806dxfkit23append__segment__points(points, a, b, tol, include_end) {
    const pa = _M0MP27mik1e806dxfkit4Vec32xy(a.at);
    const pb = _M0MP27mik1e806dxfkit4Vec32xy(b.at);
    if (a.bulge === 0) {
      if (include_end) {
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, pb);
      }
      return undefined;
    }
    if (_M0MP27mik1e806dxfkit4Vec28distance(pa, pb) === 0) {
      return undefined;
    }
    const arc = _M0FP27mik1e806dxfkit16arc__from__bulge(pa, pb, a.bulge);
    const pts = _M0FP27mik1e806dxfkit11arc__points(arc.center, arc.radius, arc.start_angle, arc.end_angle, tol);
    const last = include_end ? pts.length : pts.length - 1 | 0;
    let i = 1;
    while (true) {
      if (i < last) {
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, a.bulge < 0 ? _M0MPC15array5Array2atGRPB4JsonE(pts, (pts.length - 1 | 0) - i | 0) : _M0MPC15array5Array2atGRPB4JsonE(pts, i));
        i = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (include_end) {
      _M0MPC15array5Array3setGsE(points, points.length - 1 | 0, pb);
      return;
    } else {
      return;
    }
  }
  function _M0FP27mik1e806dxfkit16polyline__points(vertices, closed, tol) {
    const points = [];
    const n = vertices.length;
    if (n === 0) {
      return points;
    }
    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, _M0MP27mik1e806dxfkit4Vec32xy(_M0MPC15array5Array2atGRPB4JsonE(vertices, 0).at));
    const segments = closed ? n : n - 1 | 0;
    let i = 0;
    while (true) {
      if (i < segments) {
        const a = _M0MPC15array5Array2atGRPB4JsonE(vertices, i);
        const b = _M0MPC15array5Array2atGRPB4JsonE(vertices, (i + 1 | 0) % n | 0);
        const include_end = !(closed && i === (segments - 1 | 0));
        _M0FP27mik1e806dxfkit23append__segment__points(points, a, b, tol, include_end);
        i = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return points;
  }
  function _M0FP27mik1e806dxfkit14spline__points(degree, knots, control_points, weights, tol) {
    const ctrl = [];
    const _bind = control_points.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const cp = control_points[_];
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(ctrl, _M0MP27mik1e806dxfkit4Vec32xy(cp));
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const n_ctrl = ctrl.length;
    if (n_ctrl === 0) {
      return [];
    }
    if (degree < 1 || (n_ctrl <= degree || knots.length !== ((n_ctrl + degree | 0) + 1 | 0))) {
      return [_M0MPC15array5Array2atGRPB4JsonE(ctrl, 0)];
    }
    const _bind$2 = _M0FP27mik1e806dxfkit23spline__points__checked(degree, knots, control_points, weights, tol);
    if (_bind$2.$tag === 1) {
      const _Ok = _bind$2;
      return _Ok._0;
    } else {
      return [_M0MPC15array5Array2atGRPB4JsonE(ctrl, 0)];
    }
  }
  function _M0MP27mik1e806dxfkit8Geometry7flatten(self, tol) {
    _L: {
      switch (self.$tag) {
        case 0: {
          const _Line = self;
          const _start = _Line._0;
          const _end = _Line._1;
          return new _M0DTP27mik1e806dxfkit4Flat7Outline([_M0MP27mik1e806dxfkit4Vec32xy(_start), _M0MP27mik1e806dxfkit4Vec32xy(_end)], false);
        }
        case 1: {
          const _Point = self;
          const _at = _Point._0;
          return new _M0DTP27mik1e806dxfkit4Flat3Dot(_M0MP27mik1e806dxfkit4Vec32xy(_at));
        }
        case 2: {
          const _Circle = self;
          const _center = _Circle._0;
          const _radius = _Circle._1;
          return new _M0DTP27mik1e806dxfkit4Flat7Outline(_M0FP27mik1e806dxfkit14circle__points(_M0MP27mik1e806dxfkit4Vec32xy(_center), _radius, tol), true);
        }
        case 3: {
          const _Arc = self;
          const _center$2 = _Arc._0;
          const _radius$2 = _Arc._1;
          const _start_angle = _Arc._2;
          const _end_angle = _Arc._3;
          const sweep = _M0FP27mik1e806dxfkit10arc__sweep(_start_angle, _end_angle);
          return sweep >= 6.2831853071785861 ? new _M0DTP27mik1e806dxfkit4Flat7Outline(_M0FP27mik1e806dxfkit14circle__points(_M0MP27mik1e806dxfkit4Vec32xy(_center$2), _radius$2, tol), true) : new _M0DTP27mik1e806dxfkit4Flat7Outline(_M0FP27mik1e806dxfkit11arc__points(_M0MP27mik1e806dxfkit4Vec32xy(_center$2), _radius$2, _start_angle, _start_angle + sweep, tol), false);
        }
        case 4: {
          const _Ellipse = self;
          const _center$3 = _Ellipse._0;
          const _major = _Ellipse._1;
          const _ratio = _Ellipse._2;
          const _start_param = _Ellipse._3;
          const _end_param = _Ellipse._4;
          const span = _M0FP27mik1e806dxfkit13ellipse__span(_start_param, _end_param);
          return new _M0DTP27mik1e806dxfkit4Flat7Outline(_M0FP27mik1e806dxfkit15ellipse__points(_center$3, _major, _ratio, _start_param, _end_param, tol), span >= 6.2831853071785861);
        }
        case 5: {
          const _Polyline = self;
          const _vertices = _Polyline._0;
          const _closed = _Polyline._1;
          return new _M0DTP27mik1e806dxfkit4Flat7Outline(_M0FP27mik1e806dxfkit16polyline__points(_vertices, _closed, tol), _closed);
        }
        case 10: {
          const _Spline = self;
          const _degree = _Spline._0;
          const _knots = _Spline._1;
          const _control_points = _Spline._2;
          const _weights = _Spline._3;
          return new _M0DTP27mik1e806dxfkit4Flat7Outline(_M0FP27mik1e806dxfkit14spline__points(_degree, _knots, _control_points, _weights, tol), false);
        }
        case 6: {
          const _Text = self;
          const _at$2 = _Text._0;
          const _height = _Text._1;
          const _value = _Text._2;
          return new _M0DTP27mik1e806dxfkit4Flat5Label(_M0MP27mik1e806dxfkit4Vec32xy(_at$2), _height, _value);
        }
        case 8: {
          break _L;
        }
        case 7: {
          break _L;
        }
        case 9: {
          break _L;
        }
        case 11: {
          break _L;
        }
        default: {
          break _L;
        }
      }
    }
    return _M0DTP27mik1e806dxfkit4Flat5Empty__;
  }
  function _M0MP27mik1e806dxfkit8Geometry16flatten__checked(self, tol) {
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(tol)) {
      return _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5765;
    }
    switch (self.$tag) {
      case 2: {
        const _Circle = self;
        const _radius = _Circle._1;
        if (!_M0FP27mik1e806dxfkit14finite__number(_radius) || _M0FP27mik1e806dxfkit18arc__cap__exceeded(_radius, 6.2831853071795862, tol)) {
          return _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5766;
        }
        break;
      }
      case 3: {
        const _Arc = self;
        const _radius$2 = _Arc._1;
        const _start_angle = _Arc._2;
        const _end_angle = _Arc._3;
        if (!_M0FP27mik1e806dxfkit14finite__number(_radius$2) || (!_M0FP27mik1e806dxfkit14finite__number(_start_angle) || !_M0FP27mik1e806dxfkit14finite__number(_end_angle))) {
          return _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5767;
        }
        if (_M0FP27mik1e806dxfkit18arc__cap__exceeded(_radius$2, _M0FP27mik1e806dxfkit10arc__sweep(_start_angle, _end_angle), tol)) {
          return _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5768;
        }
        break;
      }
      case 5: {
        const _Polyline = self;
        const _vertices = _Polyline._0;
        const _closed = _Polyline._1;
        const count = _closed ? _vertices.length : _vertices.length - 1 | 0;
        let _tmp = 0;
        while (true) {
          const i = _tmp;
          if (i < count) {
            const a = _M0MPC15array5Array2atGRPB4JsonE(_vertices, i);
            const b = _M0MPC15array5Array2atGRPB4JsonE(_vertices, (i + 1 | 0) % _vertices.length | 0);
            if (!_M0FP27mik1e806dxfkit14finite__number(a.bulge)) {
              return _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5769;
            }
            if (a.bulge !== 0 && _M0MP27mik1e806dxfkit4Vec28distance(_M0MP27mik1e806dxfkit4Vec32xy(a.at), _M0MP27mik1e806dxfkit4Vec32xy(b.at)) > 0) {
              const arc = _M0FP27mik1e806dxfkit16arc__from__bulge(_M0MP27mik1e806dxfkit4Vec32xy(a.at), _M0MP27mik1e806dxfkit4Vec32xy(b.at), a.bulge);
              if (!_M0FP27mik1e806dxfkit14finite__number(arc.radius) || _M0FP27mik1e806dxfkit18arc__cap__exceeded(arc.radius, _M0FP27mik1e806dxfkit11angle__span(arc.start_angle, arc.end_angle), tol)) {
                return _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5770;
              }
            }
            _tmp = i + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        break;
      }
    }
    let flat;
    switch (self.$tag) {
      case 10: {
        const _Spline = self;
        const _degree = _Spline._0;
        const _knots = _Spline._1;
        const _control_points = _Spline._2;
        const _weights = _Spline._3;
        const _bind = _M0FP27mik1e806dxfkit23spline__points__checked(_degree, _knots, _control_points, _weights, tol);
        if (_bind.$tag === 1) {
          const _Ok = _bind;
          const _points = _Ok._0;
          flat = new _M0DTP27mik1e806dxfkit4Flat7Outline(_points, false);
        } else {
          const _Err = _bind;
          const _msg = _Err._0;
          return new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err(_msg);
        }
        break;
      }
      case 4: {
        const _Ellipse = self;
        const _center = _Ellipse._0;
        const _major = _Ellipse._1;
        const _ratio = _Ellipse._2;
        const _start_param = _Ellipse._3;
        const _end_param = _Ellipse._4;
        const _bind$2 = _M0FP27mik1e806dxfkit24ellipse__points__checked(_center, _major, _ratio, _start_param, _end_param, tol);
        if (_bind$2.$tag === 1) {
          const _Ok = _bind$2;
          const _points = _Ok._0;
          flat = new _M0DTP27mik1e806dxfkit4Flat7Outline(_points, _M0FP27mik1e806dxfkit13ellipse__span(_start_param, _end_param) >= 6.2831853071785861);
        } else {
          const _Err = _bind$2;
          const _msg = _Err._0;
          return new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE3Err(_msg);
        }
        break;
      }
      default: {
        flat = _M0MP27mik1e806dxfkit8Geometry7flatten(self, tol);
      }
    }
    if (!_M0FP27mik1e806dxfkit16flat__is__finite(flat)) {
      return _M0MP27mik1e806dxfkit8Geometry16flatten__checkedN6constrS5771;
    }
    return new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE2Ok(flat);
  }
  function _M0MP27mik1e806dxfkit6Entity23flatten__local__checked(self, tol) {
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(tol)) {
      return _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5772;
    }
    _L: {
      const _bind = self.geom;
      if (_bind.$tag === 8) {
        const _Face = _bind;
        const _corners = _Face._0;
        if (self.common.kind === "SOLID" || self.common.kind === "TRACE") {
          const record = self.common.record;
          if (_M0MP27mik1e806dxfkit6Record11get__double(record, 39, 0) !== 0) {
            return _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5773;
          }
          if (_corners.length !== 3 && _corners.length !== 4) {
            return _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5774;
          }
          const _bind$2 = _corners.length;
          let _tmp = 0;
          while (true) {
            const _ = _tmp;
            if (_ < _bind$2) {
              const p = _corners[_];
              if (!_M0FP27mik1e806dxfkit14finite__number(p.x) || (!_M0FP27mik1e806dxfkit14finite__number(p.y) || !_M0FP27mik1e806dxfkit14finite__number(p.z))) {
                return _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5775;
              }
              if (p.z !== _M0MPC15array5Array2atGRPB4JsonE(_corners, 0).z) {
                return _M0MP27mik1e806dxfkit6Entity23flatten__local__checkedN6constrS5776;
              }
              _tmp = _ + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          const points = [_M0MP27mik1e806dxfkit4Vec32xy(_M0MPC15array5Array2atGRPB4JsonE(_corners, 0)), _M0MP27mik1e806dxfkit4Vec32xy(_M0MPC15array5Array2atGRPB4JsonE(_corners, 1))];
          if (_corners.length === 4 && (_M0MPC15array5Array2atGRPB4JsonE(_corners, 3).x !== _M0MPC15array5Array2atGRPB4JsonE(_corners, 2).x || _M0MPC15array5Array2atGRPB4JsonE(_corners, 3).y !== _M0MPC15array5Array2atGRPB4JsonE(_corners, 2).y)) {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, _M0MP27mik1e806dxfkit4Vec32xy(_M0MPC15array5Array2atGRPB4JsonE(_corners, 3)));
          }
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, _M0MP27mik1e806dxfkit4Vec32xy(_M0MPC15array5Array2atGRPB4JsonE(_corners, 2)));
          return new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE2Ok(new _M0DTP27mik1e806dxfkit4Flat7Outline(points, true));
        } else {
          break _L;
        }
      } else {
        break _L;
      }
    }
    return _M0MP27mik1e806dxfkit8Geometry16flatten__checked(self.geom, tol);
  }
  function _M0FP27mik1e806dxfkit4add3(a, b) {
    return _M0MP27mik1e806dxfkit4Vec33new(a.x + b.x, a.y + b.y, a.z + b.z);
  }
  function _M0FP27mik1e806dxfkit6scale3(a, s) {
    return _M0MP27mik1e806dxfkit4Vec33new(a.x * s, a.y * s, a.z * s);
  }
  function _M0MP27mik1e806dxfkit10Transform36vector(self, p) {
    return _M0FP27mik1e806dxfkit4add3(_M0FP27mik1e806dxfkit4add3(_M0FP27mik1e806dxfkit6scale3(self.x, p.x), _M0FP27mik1e806dxfkit6scale3(self.y, p.y)), _M0FP27mik1e806dxfkit6scale3(self.z, p.z));
  }
  function _M0MP27mik1e806dxfkit10Transform35apply(self, p) {
    return _M0FP27mik1e806dxfkit4add3(_M0MP27mik1e806dxfkit10Transform36vector(self, p), self.origin);
  }
  function _M0MP27mik1e806dxfkit10Transform37compose(self, inner) {
    return new _M0TP27mik1e806dxfkit10Transform3(_M0MP27mik1e806dxfkit10Transform36vector(self, inner.x), _M0MP27mik1e806dxfkit10Transform36vector(self, inner.y), _M0MP27mik1e806dxfkit10Transform36vector(self, inner.z), _M0MP27mik1e806dxfkit10Transform35apply(self, inner.origin));
  }
  function _M0FP27mik1e806dxfkit19entity__world__flat(e, tol, parent) {
    if (!_M0FP27mik1e806dxfkit20valid__numeric__tags(e.common.record)) {
      return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5778;
    }
    if (_M0MP27mik1e806dxfkit6Record11get__double(e.common.record, 39, 0) !== 0) {
      return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5779;
    }
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(tol)) {
      return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5780;
    }
    const kind = e.common.kind;
    const uses_ocs = _M0MPC15array5Array8containsGsE(["CIRCLE", "ARC", "SOLID", "TRACE", "TEXT", "ATTRIB", "ATTDEF", "LWPOLYLINE", "POLYLINE"], kind);
    let transform;
    if (uses_ocs) {
      const _bind = _M0FP27mik1e806dxfkit11record__ocs(e.common.record);
      let o;
      if (_bind.$tag === 1) {
        const _Ok = _bind;
        o = _Ok._0;
      } else {
        const _Err = _bind;
        const _msg = _Err._0;
        return new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err(_msg);
      }
      transform = _M0MP27mik1e806dxfkit10Transform37compose(parent, new _M0TP27mik1e806dxfkit10Transform3(o.x_axis, o.y_axis, o.normal, _M0MP27mik1e806dxfkit4Vec34zeroN6recordS5777));
    } else {
      transform = parent;
    }
    const _bind = e.geom;
    switch (_bind.$tag) {
      case 0: {
        const _Line = _bind;
        const _start = _Line._0;
        const _end = _Line._1;
        const a = _M0MP27mik1e806dxfkit10Transform35apply(transform, _start);
        const b = _M0MP27mik1e806dxfkit10Transform35apply(transform, _end);
        if (!_M0FP27mik1e806dxfkit7finite3(a) || !_M0FP27mik1e806dxfkit7finite3(b)) {
          return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5781;
        }
        return new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE2Ok(new _M0DTP27mik1e806dxfkit9WorldFlat8Outline3([a, b], false));
      }
      case 1: {
        const _Point = _bind;
        const _at = _Point._0;
        const p = _M0MP27mik1e806dxfkit10Transform35apply(transform, _at);
        if (!_M0FP27mik1e806dxfkit7finite3(p)) {
          return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5782;
        }
        return new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE2Ok(new _M0DTP27mik1e806dxfkit9WorldFlat4Dot3(p));
      }
      case 8: {
        const _Face = _bind;
        const _corners = _Face._0;
        if (kind === "3DFACE") {
          const _p = new Array(_corners.length);
          const _p$2 = _corners.length;
          let _tmp = 0;
          while (true) {
            const _p$3 = _tmp;
            if (_p$3 < _p$2) {
              const _p$4 = _corners[_p$3];
              _p[_p$3] = _M0MP27mik1e806dxfkit10Transform35apply(transform, _p$4);
              _tmp = _p$3 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          const out = _p;
          let _tmp$2;
          let _p$3;
          _L: {
            _L$2: {
              const _p$4 = out.length;
              let _tmp$3 = 0;
              while (true) {
                const _p$5 = _tmp$3;
                if (_p$5 < _p$4) {
                  const _p$6 = out[_p$5];
                  if (!_M0FP27mik1e806dxfkit7finite3(_p$6)) {
                    _p$3 = false;
                    break _L$2;
                  }
                  _tmp$3 = _p$5 + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              _tmp$2 = true;
              break _L;
            }
            _tmp$2 = _p$3;
          }
          if (!_tmp$2) {
            return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5783;
          }
          return new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE2Ok(new _M0DTP27mik1e806dxfkit9WorldFlat5Face3(out));
        }
        break;
      }
    }
    let z;
    let center;
    _L: {
      _L$2: {
        const _bind$2 = e.geom;
        switch (_bind$2.$tag) {
          case 2: {
            const _Circle = _bind$2;
            const _center = _Circle._0;
            center = _center;
            break _L$2;
          }
          case 3: {
            const _Arc = _bind$2;
            const _center$2 = _Arc._0;
            center = _center$2;
            break _L$2;
          }
          case 6: {
            const _Text = _bind$2;
            const _at$2 = _Text._0;
            z = _at$2.z;
            break;
          }
          case 5: {
            const _Polyline = _bind$2;
            const _vertices = _Polyline._0;
            const z$2 = kind === "POLYLINE" ? _M0MP27mik1e806dxfkit6Record11get__double(e.common.record, 30, 0) : _M0MP27mik1e806dxfkit6Record11get__double(e.common.record, 38, 0);
            let _tmp;
            let _p;
            _L$3: {
              _L$4: {
                const _p$2 = _vertices.length;
                let _tmp$2 = 0;
                while (true) {
                  const _p$3 = _tmp$2;
                  if (_p$3 < _p$2) {
                    const _p$4 = _vertices[_p$3];
                    if (_p$4.at.z !== 0 && _p$4.at.z !== z$2) {
                      _p = true;
                      break _L$4;
                    }
                    _tmp$2 = _p$3 + 1 | 0;
                    continue;
                  } else {
                    break;
                  }
                }
                _tmp = false;
                break _L$3;
              }
              _tmp = _p;
            }
            if (_tmp) {
              return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5784;
            }
            z = z$2;
            break;
          }
          case 8: {
            const _Face$2 = _bind$2;
            const _corners$2 = _Face$2._0;
            z = _corners$2.length > 0 ? _M0MPC15array5Array2atGRPB4JsonE(_corners$2, 0).z : 0;
            break;
          }
          case 4: {
            const _Ellipse = _bind$2;
            const _center$3 = _Ellipse._0;
            const _major = _Ellipse._1;
            if (_major.z !== 0 || (_M0MP27mik1e806dxfkit6Record11get__double(e.common.record, 210, 0) !== 0 || (_M0MP27mik1e806dxfkit6Record11get__double(e.common.record, 220, 0) !== 0 || _M0MP27mik1e806dxfkit6Record11get__double(e.common.record, 230, 1) !== 1))) {
              return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5785;
            }
            z = _center$3.z;
            break;
          }
          case 10: {
            const _Spline = _bind$2;
            const _control_points = _Spline._2;
            const z$3 = _control_points.length === 0 ? 0 : _M0MPC15array5Array2atGRPB4JsonE(_control_points, 0).z;
            let _tmp$2;
            let _p$2;
            _L$4: {
              _L$5: {
                const _p$3 = _control_points.length;
                let _tmp$3 = 0;
                while (true) {
                  const _p$4 = _tmp$3;
                  if (_p$4 < _p$3) {
                    const _p$5 = _control_points[_p$4];
                    if (_p$5.z !== z$3) {
                      _p$2 = true;
                      break _L$5;
                    }
                    _tmp$3 = _p$4 + 1 | 0;
                    continue;
                  } else {
                    break;
                  }
                }
                _tmp$2 = false;
                break _L$4;
              }
              _tmp$2 = _p$2;
            }
            if (_tmp$2) {
              return _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5786;
            }
            z = z$3;
            break;
          }
          default: {
            z = 0;
          }
        }
        break _L;
      }
      z = center.z;
    }
    const _bind$2 = _M0MP27mik1e806dxfkit6Entity23flatten__local__checked(e, tol);
    let flat;
    if (_bind$2.$tag === 1) {
      const _Ok = _bind$2;
      flat = _Ok._0;
    } else {
      const _Err = _bind$2;
      const _msg = _Err._0;
      return new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE3Err(_msg);
    }
    let f;
    switch (flat.$tag) {
      case 0: {
        const _Outline = flat;
        const _points = _Outline._0;
        const _closed = _Outline._1;
        const _p = new Array(_points.length);
        const _p$2 = _points.length;
        let _tmp = 0;
        while (true) {
          const _p$3 = _tmp;
          if (_p$3 < _p$2) {
            const _p$4 = _points[_p$3];
            _p[_p$3] = _M0MP27mik1e806dxfkit10Transform35apply(transform, _M0MP27mik1e806dxfkit4Vec33new(_p$4.x, _p$4.y, z));
            _tmp = _p$3 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        f = new _M0DTP27mik1e806dxfkit9WorldFlat8Outline3(_p, _closed);
        break;
      }
      case 1: {
        const _Dot = flat;
        const _at$2 = _Dot._0;
        f = new _M0DTP27mik1e806dxfkit9WorldFlat4Dot3(_M0MP27mik1e806dxfkit10Transform35apply(transform, _M0MP27mik1e806dxfkit4Vec33new(_at$2.x, _at$2.y, z)));
        break;
      }
      case 2: {
        const _Label = flat;
        const _at$3 = _Label._0;
        const _height = _Label._1;
        const _value = _Label._2;
        f = new _M0DTP27mik1e806dxfkit9WorldFlat6Label3(_M0MP27mik1e806dxfkit10Transform35apply(transform, _M0MP27mik1e806dxfkit4Vec33new(_at$3.x, _at$3.y, z)), _height * Math.sqrt(_M0MP27mik1e806dxfkit4Vec36length(_M0MP27mik1e806dxfkit4Vec35cross(transform.x, transform.y))), _value);
        break;
      }
      default: {
        f = _M0DTP27mik1e806dxfkit9WorldFlat6Empty3__;
      }
    }
    let valid;
    switch (f.$tag) {
      case 0: {
        const _Outline3 = f;
        const _points$2 = _Outline3._0;
        let _p$3;
        _L$2: {
          _L$3: {
            const _p$4 = _points$2.length;
            let _tmp$2 = 0;
            while (true) {
              const _p$5 = _tmp$2;
              if (_p$5 < _p$4) {
                const _p$6 = _points$2[_p$5];
                if (!_M0FP27mik1e806dxfkit7finite3(_p$6)) {
                  _p$3 = false;
                  break _L$3;
                }
                _tmp$2 = _p$5 + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            valid = true;
            break _L$2;
          }
          valid = _p$3;
        }
        break;
      }
      case 1: {
        const _Dot3 = f;
        const _at$4 = _Dot3._0;
        valid = _M0FP27mik1e806dxfkit7finite3(_at$4);
        break;
      }
      case 2: {
        const _Label3 = f;
        const _at$5 = _Label3._0;
        const _height$2 = _Label3._1;
        valid = _M0FP27mik1e806dxfkit7finite3(_at$5) && _M0FP27mik1e806dxfkit14finite__number(_height$2);
        break;
      }
      default: {
        valid = true;
      }
    }
    return valid ? new _M0DTPC16result6ResultGRP27mik1e806dxfkit9WorldFlatsE2Ok(f) : _M0FP27mik1e806dxfkit19entity__world__flatN6constrS5787;
  }
  function _M0FP27mik1e806dxfkit13world__to__xy(flat, tol) {
    _L: {
      switch (flat.$tag) {
        case 0: {
          const _Outline3 = flat;
          const _points = _Outline3._0;
          const _closed = _Outline3._1;
          let _tmp;
          let _p;
          _L$2: {
            _L$3: {
              const _p$2 = _points.length;
              let _tmp$2 = 0;
              while (true) {
                const _p$3 = _tmp$2;
                if (_p$3 < _p$2) {
                  const _p$4 = _points[_p$3];
                  if (Math.abs(_p$4.z) > tol) {
                    _p = true;
                    break _L$3;
                  }
                  _tmp$2 = _p$3 + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              _tmp = false;
              break _L$2;
            }
            _tmp = _p;
          }
          if (_tmp) {
            return _M0FP27mik1e806dxfkit13world__to__xyN6constrS5788;
          }
          const _p$2 = new Array(_points.length);
          const _p$3 = _points.length;
          let _tmp$2 = 0;
          while (true) {
            const _p$4 = _tmp$2;
            if (_p$4 < _p$3) {
              const _p$5 = _points[_p$4];
              _p$2[_p$4] = _M0MP27mik1e806dxfkit4Vec32xy(_p$5);
              _tmp$2 = _p$4 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          return new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE2Ok(new _M0DTP27mik1e806dxfkit4Flat7Outline(_p$2, _closed));
        }
        case 1: {
          const _Dot3 = flat;
          const _at = _Dot3._0;
          return Math.abs(_at.z) > tol ? _M0FP27mik1e806dxfkit13world__to__xyN6constrS5789 : new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE2Ok(new _M0DTP27mik1e806dxfkit4Flat3Dot(_M0MP27mik1e806dxfkit4Vec32xy(_at)));
        }
        case 2: {
          const _Label3 = flat;
          const _at$2 = _Label3._0;
          const _height = _Label3._1;
          const _value = _Label3._2;
          return Math.abs(_at$2.z) > tol ? _M0FP27mik1e806dxfkit13world__to__xyN6constrS5790 : new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE2Ok(new _M0DTP27mik1e806dxfkit4Flat5Label(_M0MP27mik1e806dxfkit4Vec32xy(_at$2), _height, _value));
        }
        case 3: {
          break _L;
        }
        default: {
          break _L;
        }
      }
    }
    return new _M0DTPC16result6ResultGRP27mik1e806dxfkit4FlatsE2Ok(_M0DTP27mik1e806dxfkit4Flat5Empty__);
  }
  function _M0MP27mik1e806dxfkit4Vec24perp(self) {
    return new _M0TP27mik1e806dxfkit4Vec2(-self.y, self.x);
  }
  function _M0MP27mik1e806dxfkit4Vec33sub(self, other) {
    return new _M0TP27mik1e806dxfkit4Vec3(self.x - other.x, self.y - other.y, self.z - other.z);
  }
  function _M0MP27mik1e806dxfkit5Aabb26expand(self, p) {
    return new _M0TP27mik1e806dxfkit5Aabb2(new _M0TP27mik1e806dxfkit4Vec2(_M0MPC16double6Double3min(self.min.x, p.x), _M0MPC16double6Double3min(self.min.y, p.y)), new _M0TP27mik1e806dxfkit4Vec2(_M0MPC16double6Double3max(self.max.x, p.x), _M0MPC16double6Double3max(self.max.y, p.y)));
  }
  function _M0MP27mik1e806dxfkit5Aabb24size(self) {
    return self.min.x > self.max.x || self.min.y > self.max.y ? _M0MP27mik1e806dxfkit4Vec24zeroN6recordS5791 : _M0MP27mik1e806dxfkit4Vec23sub(self.max, self.min);
  }
  function _M0MP27mik1e806dxfkit8TagValue10as__string(self) {
    if (self.$tag === 0) {
      const _Str = self;
      return _Str._0;
    } else {
      return "";
    }
  }
  function _M0MP27mik1e806dxfkit8TagValue7as__int(self) {
    switch (self.$tag) {
      case 1: {
        const _I16 = self;
        const _v = _I16._0;
        return _v;
      }
      case 2: {
        const _I32 = self;
        const _v$2 = _I32._0;
        return _v$2;
      }
      case 3: {
        const _I64 = self;
        const _v$3 = _I64._0;
        return Number(BigInt.asIntN(32, _v$3)) | 0;
      }
      case 4: {
        const _F64 = self;
        const _v$4 = _F64._0;
        return _M0MPC16double6Double7to__int(_v$4);
      }
      case 5: {
        const _Bool = self;
        const _b = _Bool._0;
        return _b ? 1 : 0;
      }
      default: {
        return 0;
      }
    }
  }
  function _M0MP27mik1e806dxfkit3Tag3new(code, value) {
    return new _M0TP27mik1e806dxfkit3Tag(code, value);
  }
  function _M0MP27mik1e806dxfkit5Layer24is__enabled__for__checks(self) {
    return !(self.color < 0) && !self.frozen;
  }
  function _M0MP27mik1e806dxfkit6Record7get__in(self, subclass, code) {
    const _bind = self.subclasses;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const sc = _bind[_];
        if (sc.name === subclass) {
          const _bind$3 = sc.tags;
          const _bind$4 = _bind$3.length;
          let _tmp$2 = 0;
          while (true) {
            const _$2 = _tmp$2;
            if (_$2 < _bind$4) {
              const t = _bind$3[_$2];
              if (t.code === code) {
                return t;
              }
              _tmp$2 = _$2 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return undefined;
  }
  function _M0MP27mik1e806dxfkit6Record8get__int(self, code, default_) {
    const _bind = _M0MP27mik1e806dxfkit6Record3get(self, code);
    if (_bind === undefined) {
      return default_;
    } else {
      const _Some = _bind;
      const _t = _Some;
      return _M0MP27mik1e806dxfkit8TagValue7as__int(_t.value);
    }
  }
  function _M0MP27mik1e806dxfkit6Record11get__string(self, code) {
    const _bind = _M0MP27mik1e806dxfkit6Record3get(self, code);
    if (_bind === undefined) {
      return "";
    } else {
      const _Some = _bind;
      const _t = _Some;
      return _M0MP27mik1e806dxfkit8TagValue10as__string(_t.value);
    }
  }
  function _M0FP27mik1e806dxfkit12parse__layer(record) {
    const _bind = _M0MP27mik1e806dxfkit6Record7get__in(record, _M0FP27mik1e806dxfkit12parse__layerN3subS2261, 70);
    let flags;
    if (_bind === undefined) {
      flags = 0;
    } else {
      const _Some = _bind;
      const _t = _Some;
      flags = _M0MP27mik1e806dxfkit8TagValue7as__int(_t.value);
    }
    const _tmp = _M0MP27mik1e806dxfkit6Record11get__string(record, 2);
    const _bind$2 = _M0MP27mik1e806dxfkit6Record7get__in(record, _M0FP27mik1e806dxfkit12parse__layerN3subS2261, 62);
    let _tmp$2;
    if (_bind$2 === undefined) {
      _tmp$2 = 7;
    } else {
      const _Some = _bind$2;
      const _t = _Some;
      _tmp$2 = _M0MP27mik1e806dxfkit8TagValue7as__int(_t.value);
    }
    const _tmp$3 = _tmp$2;
    const _bind$3 = _M0MP27mik1e806dxfkit6Record7get__in(record, _M0FP27mik1e806dxfkit12parse__layerN3subS2261, 6);
    let _tmp$4;
    if (_bind$3 === undefined) {
      _tmp$4 = "CONTINUOUS";
    } else {
      const _Some = _bind$3;
      const _t = _Some;
      _tmp$4 = _M0MP27mik1e806dxfkit8TagValue10as__string(_t.value);
    }
    return new _M0TP27mik1e806dxfkit5Layer(_tmp, _tmp$3, _tmp$4, (flags & 1) !== 0, (flags & 4) !== 0, _M0MP27mik1e806dxfkit6Record8get__int(record, 370, -3));
  }
  function _M0FP27mik1e806dxfkit13parse__tables(section) {
    const layers = [];
    const linetypes = [];
    const text_styles = [];
    const block_records = [];
    let table_kind = undefined;
    const _bind = section.records;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const record = _bind[_];
        if (record.kind === "TABLE") {
          table_kind = _M0MP27mik1e806dxfkit6Record11get__string(record, 2);
        } else {
          if (record.kind === "ENDTAB") {
            table_kind = undefined;
          } else {
            const _bind$3 = table_kind;
            if (_bind$3 === undefined) {
            } else {
              const _Some = _bind$3;
              const _kind = _Some;
              if (_kind === "LAYER" && record.kind === "LAYER") {
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(layers, _M0FP27mik1e806dxfkit12parse__layer(record));
              } else {
                if (_kind === "LTYPE" && record.kind === "LTYPE") {
                  _M0MPC15array5Array4pushGRPC14json10WriteFrameE(linetypes, _M0MP27mik1e806dxfkit6Record11get__string(record, 2));
                } else {
                  if (_kind === "STYLE" && record.kind === "STYLE") {
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(text_styles, _M0MP27mik1e806dxfkit6Record11get__string(record, 2));
                  } else {
                    if (_kind === "BLOCK_RECORD" && record.kind === "BLOCK_RECORD") {
                      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(block_records, _M0MP27mik1e806dxfkit6Record11get__string(record, 2));
                    }
                  }
                }
              }
            }
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return new _M0TP27mik1e806dxfkit6Tables(layers, linetypes, text_styles, block_records);
  }
  function _M0MP27mik1e806dxfkit6Tables5layer(self, name) {
    const _bind = self.layers;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const l = _bind[_];
        if (l.name === name) {
          return l;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return undefined;
  }
  function _M0FP27mik1e806dxfkit18project__expansion(world, tol) {
    const warnings = _M0MPC15array5Array4copyGsE(world.warnings);
    const placed = [];
    const _bind = world.placed;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const p = _bind[_];
        const _bind$3 = _M0FP27mik1e806dxfkit13world__to__xy(p.flat, tol);
        let flat;
        if (_bind$3.$tag === 1) {
          const _Ok = _bind$3;
          flat = _Ok._0;
        } else {
          const _Err = _bind$3;
          const _msg = _Err._0;
          const _p = p.instances;
          const _p$2 = new Array(_p.length);
          const _p$3 = _p.length;
          let _tmp$2 = 0;
          while (true) {
            const _p$4 = _tmp$2;
            if (_p$4 < _p$3) {
              const _p$5 = _p[_p$4];
              const _p$6 = _M0MPB13StringBuilder21StringBuilder_2einner(4);
              _M0MPB13StringBuilder13write__objectGsE(_p$6, _p$5.handle);
              _M0IPB13StringBuilderPB6Logger13write__string(_p$6, ":");
              _M0MPB13StringBuilder13write__objectGsE(_p$6, _p$5.block);
              _M0IPB13StringBuilderPB6Logger13write__string(_p$6, "[");
              _M0MPB13StringBuilder13write__objectGiE(_p$6, _p$5.row);
              _M0IPB13StringBuilderPB6Logger13write__string(_p$6, ",");
              _M0MPB13StringBuilder13write__objectGiE(_p$6, _p$5.column);
              _M0IPB13StringBuilderPB6Logger13write__string(_p$6, "]");
              _p$2[_p$4] = _p$6.val;
              _tmp$2 = _p$4 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          const instances = _M0MPC15array5Array4joinGsE(_p$2, new _M0TPC16string10StringView(_M0FP27mik1e806dxfkit18project__expansionN7_2abindS2891, 0, _M0FP27mik1e806dxfkit18project__expansionN7_2abindS2891.length));
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(89);
          const _p$4 = p.entity;
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, _p$4.common.kind);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "（句柄 ");
          const _p$5 = p.entity;
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, _p$5.common.handle);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "，图层 ");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, p.layer);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "，实例 ");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, instances);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "）：");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, _msg);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "；XYZ 保留于 expand_world，二维检查不完整");
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
          flat = _M0DTP27mik1e806dxfkit4Flat5Empty__;
        }
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(placed, new _M0TP27mik1e806dxfkit6Placed(p.entity, p.layer, flat));
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return new _M0TP27mik1e806dxfkit9Expansion(placed, warnings);
  }
  function _M0FP27mik1e806dxfkit13expand__visit(ctx) {
    if (ctx.stopped) {
      return false;
    }
    if (ctx.warnings.length >= 1000) {
      ctx.stopped = true;
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(ctx.warnings, "展开诊断达到资源上限；检查不完整");
      return false;
    }
    if (ctx.visits >= ctx.limits.max_visits) {
      ctx.stopped = true;
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(ctx.warnings, "展开达到全局资源上限（实体访问次数）；结果不完整");
      return false;
    }
    ctx.visits = ctx.visits + 1 | 0;
    return true;
  }
  function _M0FP27mik1e806dxfkit20insert__grid__vector(rotation, offset) {
    const c = _M0FPC14math3cos(rotation);
    const s = _M0FPC14math3sin(rotation);
    return _M0MP27mik1e806dxfkit4Vec33new(c * offset.x - s * offset.y, s * offset.x + c * offset.y, 0);
  }
  function _M0MP27mik1e806dxfkit3Ocs7to__wcs(self, p) {
    return _M0MP27mik1e806dxfkit4Vec33new(self.x_axis.x * p.x + self.y_axis.x * p.y + self.normal.x * p.z, self.x_axis.y * p.x + self.y_axis.y * p.y + self.normal.y * p.z, self.x_axis.z * p.x + self.y_axis.z * p.y + self.normal.z * p.z);
  }
  function _M0FP27mik1e806dxfkit18insert__transform3(at, base, scale, rotation, offset, ocs) {
    const c = _M0FPC14math3cos(rotation);
    const s = _M0FPC14math3sin(rotation);
    const _bind = _M0MP27mik1e806dxfkit3Ocs7to__wcs(ocs, _M0MP27mik1e806dxfkit4Vec33new(c * scale.x, s * scale.x, 0));
    const _bind$2 = _M0MP27mik1e806dxfkit3Ocs7to__wcs(ocs, _M0MP27mik1e806dxfkit4Vec33new(-s * scale.y, c * scale.y, 0));
    const _bind$3 = _M0MP27mik1e806dxfkit3Ocs7to__wcs(ocs, _M0MP27mik1e806dxfkit4Vec33new(0, 0, scale.z));
    const _bind$4 = _M0MP27mik1e806dxfkit4Vec34zeroN6recordS5777;
    const t = new _M0TP27mik1e806dxfkit10Transform3(_bind, _bind$2, _bind$3, _bind$4);
    const grid = _M0FP27mik1e806dxfkit20insert__grid__vector(rotation, offset);
    return new _M0TP27mik1e806dxfkit10Transform3(_bind, _bind$2, _bind$3, _M0MP27mik1e806dxfkit4Vec33sub(_M0MP27mik1e806dxfkit3Ocs7to__wcs(ocs, _M0FP27mik1e806dxfkit4add3(at, grid)), _M0MP27mik1e806dxfkit10Transform36vector(t, base)));
  }
  function _M0MP27mik1e806dxfkit10Transform314stretch__bound(self) {
    const a = [self.x.x, self.x.y, self.x.z, self.y.x, self.y.y, self.y.z, self.z.x, self.z.y, self.z.z];
    let m = 0;
    const _bind = a.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const v = a[_];
        m = _M0MPC16double6Double3max(m, Math.abs(v));
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (m === 0 || !_M0FP27mik1e806dxfkit14finite__number(m)) {
      return m;
    }
    const x = _M0FP27mik1e806dxfkit6scale3(self.x, 1 / m);
    const y = _M0FP27mik1e806dxfkit6scale3(self.y, 1 / m);
    const z = _M0FP27mik1e806dxfkit6scale3(self.z, 1 / m);
    const one = _M0MPC16double6Double3max(_M0MPC16double6Double3max(Math.abs(x.x) + Math.abs(x.y) + Math.abs(x.z), Math.abs(y.x) + Math.abs(y.y) + Math.abs(y.z)), Math.abs(z.x) + Math.abs(z.y) + Math.abs(z.z));
    const inf = _M0MPC16double6Double3max(_M0MPC16double6Double3max(Math.abs(x.x) + Math.abs(y.x) + Math.abs(z.x), Math.abs(x.y) + Math.abs(y.y) + Math.abs(z.y)), Math.abs(x.z) + Math.abs(y.z) + Math.abs(z.z));
    return m * Math.sqrt(one * inf);
  }
  function _M0FP27mik1e806dxfkit21expand__entity__world(e, ctx, xform, inherited, path, out) {
    if (!_M0FP27mik1e806dxfkit13expand__visit(ctx)) {
      return undefined;
    }
    let layer;
    let _tmp;
    const _p = "";
    if (!(inherited === _p)) {
      _tmp = e.common.layer === "" || e.common.layer === "0";
    } else {
      _tmp = false;
    }
    if (_tmp) {
      layer = inherited;
    } else {
      layer = e.common.layer;
    }
    const _bind = e.geom;
    if (_bind.$tag === 7) {
      const _Insert = _bind;
      const _at = _Insert._0;
      const _block = _Insert._1;
      const _scale = _Insert._2;
      const _rotation = _Insert._3;
      const r = e.common.record;
      const _bind$2 = _M0FP27mik1e806dxfkit11record__ocs(r);
      let ocs;
      if (_bind$2.$tag === 1) {
        const _Ok = _bind$2;
        ocs = _Ok._0;
      } else {
        const _Err = _bind$2;
        const _msg = _Err._0;
        const _tmp$2 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(22);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "INSERT ");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, e.common.handle);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "：");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _msg);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "；未展开");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$2, _string_builder.val);
        return undefined;
      }
      const rows = _M0MP27mik1e806dxfkit6Record8get__int(r, 71, 1);
      const columns = _M0MP27mik1e806dxfkit6Record8get__int(r, 70, 1);
      const dx = _M0MP27mik1e806dxfkit6Record11get__double(r, 44, 0);
      const dy = _M0MP27mik1e806dxfkit6Record11get__double(r, 45, 0);
      if (rows < 1 || (columns < 1 || (!_M0FP27mik1e806dxfkit14finite__number(dx) || (!_M0FP27mik1e806dxfkit14finite__number(dy) || (!_M0FP27mik1e806dxfkit7finite3(_at) || (!_M0FP27mik1e806dxfkit7finite3(_scale) || (!_M0FP27mik1e806dxfkit14finite__number(_rotation) || (_scale.x === 0 || (_scale.y === 0 || _scale.z === 0))))))))) {
        const _tmp$2 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(53);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "INSERT ");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, e.common.handle);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 的行列、间距或变换无效；未展开");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$2, _string_builder.val);
        return undefined;
      }
      const name = _M0MPC16string6String9to__upper(_block);
      if (_M0MPB3Map8containsGsbE(ctx.duplicates, name)) {
        const _tmp$2 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(66);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "块名「");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _block);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」重复，引用含歧义；未展开，检查不完整");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$2, _string_builder.val);
        return undefined;
      }
      const _bind$3 = _M0MPB3Map3getGsRP27mik1e806dxfkit5BlockE(ctx.blocks, name);
      let b;
      if (_bind$3 === undefined) {
        const _tmp$2 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(42);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "引用了不存在的块「");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _block);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」，已跳过");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$2, _string_builder.val);
        return undefined;
      } else {
        const _Some = _bind$3;
        b = _Some;
      }
      if (!_M0FP27mik1e806dxfkit7finite3(b.base)) {
        const _tmp$2 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(36);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "块「");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _block);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」基点非有限；未展开");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$2, _string_builder.val);
        return undefined;
      }
      if (_M0MP27mik1e806dxfkit6Record8get__int(r, 66, 0) === 1) {
        const _tmp$2 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(94);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "INSERT ");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, e.common.handle);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 的关联 ATTRIB 记录已保留，轮廓检查未覆盖属性排版；检查不完整");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$2, _string_builder.val);
      }
      let _tmp$2;
      let _p$2;
      _L: {
        _L$2: {
          const _p$3 = path.length;
          let _tmp$3 = 0;
          while (true) {
            const _p$4 = _tmp$3;
            if (_p$4 < _p$3) {
              const _p$5 = path[_p$4];
              if (_M0MPC16string6String9to__upper(_p$5.block) === name) {
                _p$2 = true;
                break _L$2;
              }
              _tmp$3 = _p$4 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _tmp$2 = false;
          break _L;
        }
        _tmp$2 = _p$2;
      }
      if (_tmp$2) {
        const _tmp$3 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(77);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "INSERT ");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, e.common.handle);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 的块「");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _block);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」在展开链上重复出现（循环引用），已截断");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$3, _string_builder.val);
        return undefined;
      }
      if (path.length >= 8) {
        const _tmp$3 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(39);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "块嵌套超过 8 层（");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _block);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "），已截断");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$3, _string_builder.val);
        return undefined;
      }
      let _tmp$3 = 0;
      while (true) {
        const row = _tmp$3;
        if (row < rows && !ctx.stopped) {
          let _tmp$4 = 0;
          while (true) {
            const col = _tmp$4;
            if (col < columns && !ctx.stopped) {
              if (!_M0FP27mik1e806dxfkit13expand__visit(ctx)) {
                break;
              }
              const cell = _M0FP27mik1e806dxfkit18insert__transform3(_at, b.base, _scale, _rotation, _M0MP27mik1e806dxfkit4Vec33new((col + 0) * dx, (row + 0) * dy, 0), ocs);
              const current = _M0MPC15array5Array4copyGsE(path);
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(current, new _M0TP27mik1e806dxfkit14InsertInstance(e.common.handle, _block, row, col));
              const _bind$4 = b.entities;
              const _bind$5 = _bind$4.length;
              let _tmp$5 = 0;
              while (true) {
                const _ = _tmp$5;
                if (_ < _bind$5) {
                  const inner = _bind$4[_];
                  if (ctx.stopped) {
                    break;
                  }
                  _M0FP27mik1e806dxfkit21expand__entity__world(inner, ctx, _M0MP27mik1e806dxfkit10Transform37compose(xform, cell), layer, current, out);
                  _tmp$5 = _ + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              _tmp$4 = col + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _tmp$3 = row + 1 | 0;
          continue;
        } else {
          return;
        }
      }
    } else {
      if (out.length >= ctx.limits.max_placed) {
        ctx.stopped = true;
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(ctx.warnings, "展开达到全局资源上限（输出实体数）；结果不完整");
        return undefined;
      }
      const stretch = _M0MP27mik1e806dxfkit10Transform314stretch__bound(xform);
      if (!_M0FP27mik1e806dxfkit14finite__number(stretch) || !_M0FP27mik1e806dxfkit7finite3(xform.origin)) {
        const _tmp$2 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(53);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "实体 ");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, e.common.kind);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 的变换超出有限坐标范围，已跳过");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$2, _string_builder.val);
        return undefined;
      }
      const local_tol = stretch > 0 ? ctx.tol / stretch : ctx.tol;
      const _bind$2 = _M0FP27mik1e806dxfkit19entity__world__flat(e, local_tol, xform);
      let flat;
      if (_bind$2.$tag === 1) {
        const _Ok = _bind$2;
        flat = _Ok._0;
      } else {
        const _Err = _bind$2;
        const _msg = _Err._0;
        const _tmp$2 = ctx.warnings;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(35);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "实体 ");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, e.common.kind);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "（句柄 ");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, e.common.handle);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "）未能离散：");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _msg);
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_tmp$2, _string_builder.val);
        flat = _M0DTP27mik1e806dxfkit9WorldFlat6Empty3__;
      }
      let count;
      switch (flat.$tag) {
        case 0: {
          const _Outline3 = flat;
          const _points = _Outline3._0;
          count = _points.length;
          break;
        }
        case 3: {
          const _Face3 = flat;
          const _corners = _Face3._0;
          count = _corners.length;
          break;
        }
        case 1: {
          count = 1;
          break;
        }
        case 2: {
          count = 1;
          break;
        }
        default: {
          count = 0;
        }
      }
      if (count > (ctx.limits.max_points - ctx.points | 0)) {
        ctx.stopped = true;
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(ctx.warnings, "展开达到全局资源上限（离散点总数）；结果不完整");
        return undefined;
      }
      ctx.points = ctx.points + count | 0;
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, new _M0TP27mik1e806dxfkit11WorldPlaced(e, layer, flat, _M0MPC15array5Array4copyGsE(path)));
      return;
    }
  }
  function _M0FP27mik1e806dxfkit10handle__of(record) {
    const h = _M0MP27mik1e806dxfkit6Record11get__string(record, 5);
    const _p = "";
    if (!(h === _p)) {
      return h;
    } else {
      return _M0MP27mik1e806dxfkit6Record11get__string(record, 105);
    }
  }
  function _M0FP27mik1e806dxfkit10common__of(record) {
    return new _M0TP27mik1e806dxfkit12EntityCommon(record.kind, _M0MP27mik1e806dxfkit6Record11get__string(record, 8), _M0FP27mik1e806dxfkit10handle__of(record), record);
  }
  function _M0FP27mik1e806dxfkit14subclass__tags(record, name) {
    const _bind = record.subclasses;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const sc = _bind[_];
        if (sc.name === name) {
          return sc.tags;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return record.common;
  }
  function _M0FP27mik1e806dxfkit12mtext__value(record) {
    const sb = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    const _bind = _M0FP27mik1e806dxfkit14subclass__tags(record, "AcDbMText");
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const t = _bind[_];
        if (t.code === 3 || t.code === 1) {
          _M0IPB13StringBuilderPB6Logger13write__string(sb, _M0MP27mik1e806dxfkit8TagValue10as__string(t.value));
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return sb.val;
  }
  function _M0MP27mik1e806dxfkit6Record11try__double(self, code) {
    const _bind = _M0MP27mik1e806dxfkit6Record3get(self, code);
    if (_bind === undefined) {
      return new _M0DTPC16result6ResultGOdsE2Ok(_M0DTPC16option6OptionGdE4None__);
    } else {
      const _Some = _bind;
      const _t = _Some;
      let v;
      _L: {
        const _bind$2 = _t.value;
        switch (_bind$2.$tag) {
          case 4: {
            const _F64 = _bind$2;
            const _v = _F64._0;
            return _M0FP27mik1e806dxfkit14finite__number(_v) ? new _M0DTPC16result6ResultGOdsE2Ok(new _M0DTPC16option6OptionGdE4Some(_v)) : _M0MP27mik1e806dxfkit6Record11try__doubleN6constrS5805;
          }
          case 1: {
            const _I16 = _bind$2;
            const _v$2 = _I16._0;
            v = _v$2;
            break _L;
          }
          case 2: {
            const _I32 = _bind$2;
            const _v$3 = _I32._0;
            v = _v$3;
            break _L;
          }
          case 3: {
            const _I64 = _bind$2;
            const _v$4 = _I64._0;
            return new _M0DTPC16result6ResultGOdsE2Ok(new _M0DTPC16option6OptionGdE4Some($f64_convert_i64(BigInt.asIntN(64, _v$4))));
          }
          default: {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(26);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "组码 ");
            _M0MPB13StringBuilder13write__objectGiE(_string_builder, code);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 类型不是数值");
            return new _M0DTPC16result6ResultGOdsE3Err(_string_builder.val);
          }
        }
      }
      return new _M0DTPC16result6ResultGOdsE2Ok(new _M0DTPC16option6OptionGdE4Some(v + 0));
    }
  }
  function _M0MP27mik1e806dxfkit6Record15require__double(self, code) {
    const _bind = _M0MP27mik1e806dxfkit6Record11try__double(self, code);
    if (_bind.$tag === 1) {
      const _Ok = _bind;
      const _x = _Ok._0;
      if (_x.$tag === 1) {
        const _Some = _x;
        const _value = _Some._0;
        return new _M0DTPC16result6ResultGdsE2Ok(_value);
      } else {
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(19);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "缺少必填组码 ");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, code);
        return new _M0DTPC16result6ResultGdsE3Err(_string_builder.val);
      }
    } else {
      const _Err = _bind;
      const _msg = _Err._0;
      return new _M0DTPC16result6ResultGdsE3Err(_msg);
    }
  }
  function _M0FP27mik1e806dxfkit10number__of(record, code) {
    const _bind = _M0MP27mik1e806dxfkit6Record15require__double(record, code);
    if (_bind.$tag === 1) {
      const _Ok = _bind;
      const _value = _Ok._0;
      return new _M0DTPC16option6OptionGdE4Some(_value);
    } else {
      return _M0DTPC16option6OptionGdE4None__;
    }
  }
  function _M0FP27mik1e806dxfkit29diagnostic__budget__exhausted(warnings) {
    if (warnings.length < 1000) {
      return false;
    }
    _M0MPC15array5Array3setGsE(warnings, 999, "诊断达到资源上限；剩余内容未处理，检查不完整");
    return true;
  }
  function _M0MP27mik1e806dxfkit6Record7all__of(self, code) {
    const out = [];
    const _bind = self.common;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const t = _bind[_];
        if (t.code === code) {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, t);
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$3 = self.subclasses;
    const _bind$4 = _bind$3.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$4) {
        const sc = _bind$3[_];
        const _bind$5 = sc.tags;
        const _bind$6 = _bind$5.length;
        let _tmp$3 = 0;
        while (true) {
          const _$2 = _tmp$3;
          if (_$2 < _bind$6) {
            const t = _bind$5[_$2];
            if (t.code === code) {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, t);
            }
            _tmp$3 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return out;
  }
  function _M0FP27mik1e806dxfkit22warn__polyline__extent(record, codes, warnings) {
    if (_M0MP27mik1e806dxfkit6Record11get__double(record, 39, 0) !== 0) {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(61);
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, record.kind);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 非零厚度未重建；原始记录保留，轮廓未检查");
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
      return undefined;
    }
    const _bind = codes.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const code = codes[_];
        const _bind$2 = _M0MP27mik1e806dxfkit6Record7all__of(record, code);
        const _bind$3 = _bind$2.length;
        let _tmp$2 = 0;
        while (true) {
          const _$2 = _tmp$2;
          if (_$2 < _bind$3) {
            const tag = _bind$2[_$2];
            if (_M0MP27mik1e806dxfkit8TagValue10as__double(tag.value) !== 0) {
              const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(80);
              _M0MPB13StringBuilder13write__objectGsE(_string_builder, record.kind);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 含非零宽度或厚度；本工具仅检查中心线，区域/厚度未验证");
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
              return undefined;
            }
            _tmp$2 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FP27mik1e806dxfkit17parse__lwpolyline(record, warnings) {
    _M0FP27mik1e806dxfkit22warn__polyline__extent(record, [43, 40, 41, 39], warnings);
    const elevation = _M0MP27mik1e806dxfkit6Record11get__double(record, 38, 0);
    const vertices = [];
    let pending_x = _M0DTPC16option6OptionGdE4None__;
    let damaged = false;
    const _bind = _M0FP27mik1e806dxfkit14subclass__tags(record, "AcDbPolyline");
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const t = _bind[_];
        if (_M0FP27mik1e806dxfkit29diagnostic__budget__exhausted(warnings)) {
          return _M0DTP27mik1e806dxfkit8Geometry7Unknown__;
        }
        const _bind$3 = t.code;
        switch (_bind$3) {
          case 10: {
            const _bind$4 = pending_x;
            if (_bind$4.$tag === 1) {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "LWPOLYLINE 顶点缺少 Y（20），未生成该实体的轮廓");
              damaged = true;
            }
            pending_x = new _M0DTPC16option6OptionGdE4Some(_M0MP27mik1e806dxfkit8TagValue10as__double(t.value));
            break;
          }
          case 20: {
            const _bind$5 = pending_x;
            if (_bind$5.$tag === 1) {
              const _Some = _bind$5;
              const _x = _Some._0;
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(vertices, new _M0TP27mik1e806dxfkit10PolyVertex(_M0MP27mik1e806dxfkit4Vec33new(_x, _M0MP27mik1e806dxfkit8TagValue10as__double(t.value), elevation), 0));
              pending_x = _M0DTPC16option6OptionGdE4None__;
            } else {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "LWPOLYLINE 顶点缺少 X（10），未生成该实体的轮廓");
              damaged = true;
            }
            break;
          }
          case 42: {
            _L: {
              _L$2: {
                const _bind$6 = pending_x;
                if (_bind$6.$tag === 1) {
                  break _L$2;
                } else {
                  if (vertices.length === 0) {
                    break _L$2;
                  } else {
                    _M0MPC15array5Array2atGRPB4JsonE(vertices, vertices.length - 1 | 0).bulge = _M0MP27mik1e806dxfkit8TagValue10as__double(t.value);
                  }
                }
                break _L;
              }
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "LWPOLYLINE 顶点 bulge（42）没有完整坐标，未生成该实体的轮廓");
              damaged = true;
            }
            break;
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$3 = pending_x;
    if (_bind$3.$tag === 1) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "LWPOLYLINE 最后一个顶点缺少 Y（20），未生成该实体的轮廓");
      damaged = true;
    }
    if (vertices.length === 0) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "LWPOLYLINE 解析不出顶点，已跳过");
      return undefined;
    }
    const _bind$4 = _M0MP27mik1e806dxfkit6Record3get(record, 90);
    if (_bind$4 === undefined) {
    } else {
      if (_M0MP27mik1e806dxfkit6Record8get__int(record, 90, 0) !== vertices.length) {
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(75);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "LWPOLYLINE 声明顶点数 ");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, _M0MP27mik1e806dxfkit6Record8get__int(record, 90, 0));
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 与完整坐标数 ");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, vertices.length);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 不一致；请复核输入");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
      }
    }
    if (damaged) {
      return _M0DTP27mik1e806dxfkit8Geometry7Unknown__;
    }
    const closed = (_M0MP27mik1e806dxfkit6Record8get__int(record, 70, 0) & 1) !== 0;
    return new _M0DTP27mik1e806dxfkit8Geometry8Polyline(vertices, closed);
  }
  function _M0FP27mik1e806dxfkit13parse__spline(record, warnings) {
    const _bind = _M0MP27mik1e806dxfkit6Record3get(record, 71);
    let degree;
    if (_bind === undefined) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 缺少次数（71）；无法确定曲线定义，保留记录，轮廓未检查");
      return _M0DTP27mik1e806dxfkit8Geometry7Unknown__;
    } else {
      const _Some = _bind;
      const _tag = _Some;
      degree = _M0MP27mik1e806dxfkit8TagValue7as__int(_tag.value);
    }
    const flags = _M0MP27mik1e806dxfkit6Record8get__int(record, 70, 0);
    if ((flags & 3) !== 0) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 使用闭合或周期语义，本版本尚未重建该语义；保留记录，轮廓未检查");
      return _M0DTP27mik1e806dxfkit8Geometry7Unknown__;
    }
    const knots = [];
    const weights = [];
    const control = [];
    let px = _M0DTPC16option6OptionGdE4None__;
    let py = _M0DTPC16option6OptionGdE4None__;
    let damaged = false;
    const _bind$2 = _M0FP27mik1e806dxfkit14subclass__tags(record, "AcDbSpline");
    const _bind$3 = _bind$2.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$3) {
        const t = _bind$2[_];
        if (_M0FP27mik1e806dxfkit29diagnostic__budget__exhausted(warnings)) {
          return _M0DTP27mik1e806dxfkit8Geometry7Unknown__;
        }
        const _bind$4 = t.code;
        switch (_bind$4) {
          case 40: {
            _M0MPC15array5Array4pushGdE(knots, _M0MP27mik1e806dxfkit8TagValue10as__double(t.value));
            break;
          }
          case 41: {
            _M0MPC15array5Array4pushGdE(weights, _M0MP27mik1e806dxfkit8TagValue10as__double(t.value));
            break;
          }
          case 10: {
            _L: {
              _L$2: {
                const _bind$5 = px;
                const _bind$6 = py;
                if (_bind$5.$tag === 1) {
                  const _Some = _bind$5;
                  const _x = _Some._0;
                  if (_bind$6.$tag === 1) {
                    const _Some$2 = _bind$6;
                    const _y = _Some$2._0;
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(control, _M0MP27mik1e806dxfkit4Vec33new(_x, _y, 0));
                  } else {
                    break _L$2;
                  }
                } else {
                  if (_bind$6.$tag === 0) {
                  } else {
                    break _L$2;
                  }
                }
                break _L;
              }
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 控制点缺少 X/Y 坐标；保留记录，未生成该实体的轮廓");
              damaged = true;
            }
            px = new _M0DTPC16option6OptionGdE4Some(_M0MP27mik1e806dxfkit8TagValue10as__double(t.value));
            py = _M0DTPC16option6OptionGdE4None__;
            break;
          }
          case 20: {
            _L$2: {
              _L$3: {
                const _bind$5 = px;
                if (_bind$5.$tag === 0) {
                  break _L$3;
                } else {
                  const _bind$6 = py;
                  if (_bind$6.$tag === 1) {
                    break _L$3;
                  }
                }
                break _L$2;
              }
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 控制点缺少 X 或重复 Y；保留记录，未生成该实体的轮廓");
              damaged = true;
            }
            py = new _M0DTPC16option6OptionGdE4Some(_M0MP27mik1e806dxfkit8TagValue10as__double(t.value));
            break;
          }
          case 30: {
            _L$3: {
              _L$4: {
                const _bind$5 = px;
                const _bind$6 = py;
                if (_bind$5.$tag === 1) {
                  const _Some = _bind$5;
                  const _x = _Some._0;
                  if (_bind$6.$tag === 1) {
                    const _Some$2 = _bind$6;
                    const _y = _Some$2._0;
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(control, _M0MP27mik1e806dxfkit4Vec33new(_x, _y, _M0MP27mik1e806dxfkit8TagValue10as__double(t.value)));
                    px = _M0DTPC16option6OptionGdE4None__;
                    py = _M0DTPC16option6OptionGdE4None__;
                  } else {
                    break _L$4;
                  }
                } else {
                  break _L$4;
                }
                break _L$3;
              }
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 控制点的 Z 前没有完整 X/Y；未生成该实体的轮廓");
              damaged = true;
              px = _M0DTPC16option6OptionGdE4None__;
              py = _M0DTPC16option6OptionGdE4None__;
            }
            break;
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    _L: {
      _L$2: {
        const _bind$4 = px;
        const _bind$5 = py;
        if (_bind$4.$tag === 1) {
          const _Some = _bind$4;
          const _x = _Some._0;
          if (_bind$5.$tag === 1) {
            const _Some$2 = _bind$5;
            const _y = _Some$2._0;
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(control, _M0MP27mik1e806dxfkit4Vec33new(_x, _y, 0));
          } else {
            break _L$2;
          }
        } else {
          if (_bind$5.$tag === 0) {
          } else {
            break _L$2;
          }
        }
        break _L;
      }
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 最后一个控制点缺少 X/Y；保留记录，未生成该实体的轮廓");
      damaged = true;
    }
    const _bind$4 = _M0MP27mik1e806dxfkit6Record3get(record, 73);
    if (_bind$4 === undefined) {
    } else {
      if (_M0MP27mik1e806dxfkit6Record8get__int(record, 73, 0) !== control.length) {
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 声明控制点数与完整坐标数不一致；请复核输入");
      }
    }
    const _bind$5 = _M0MP27mik1e806dxfkit6Record3get(record, 72);
    if (_bind$5 === undefined) {
    } else {
      if (_M0MP27mik1e806dxfkit6Record8get__int(record, 72, 0) !== knots.length) {
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 声明节点数与实际节点数不一致；请复核输入");
      }
    }
    if (damaged) {
      return _M0DTP27mik1e806dxfkit8Geometry7Unknown__;
    }
    if (weights.length === 0) {
      const _bind$6 = control.length;
      let _tmp$2 = 0;
      while (true) {
        const _ = _tmp$2;
        if (_ < _bind$6) {
          _M0MPC15array5Array4pushGdE(weights, 1);
          _tmp$2 = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
    } else {
      if (weights.length !== control.length) {
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SPLINE 权重数量与控制点数量不一致；保留记录，未生成该实体轮廓");
        return _M0DTP27mik1e806dxfkit8Geometry7Unknown__;
      }
    }
    return new _M0DTP27mik1e806dxfkit8Geometry6Spline(degree, knots, control, weights);
  }
  function _M0MP27mik1e806dxfkit6Record11count__code(self, code) {
    let n = 0;
    const _bind = self.common;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const t = _bind[_];
        if (t.code === code) {
          n = n + 1 | 0;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$3 = self.subclasses;
    const _bind$4 = _bind$3.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$4) {
        const sc = _bind$3[_];
        const _bind$5 = sc.tags;
        const _bind$6 = _bind$5.length;
        let _tmp$3 = 0;
        while (true) {
          const _$2 = _tmp$3;
          if (_$2 < _bind$6) {
            const t = _bind$5[_$2];
            if (t.code === code) {
              n = n + 1 | 0;
            }
            _tmp$3 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return n;
  }
  function _M0MP27mik1e806dxfkit6Record5point(self, n) {
    const _bind = _M0MP27mik1e806dxfkit6Record15require__double(self, 10 + n | 0);
    let x;
    if (_bind.$tag === 1) {
      const _Ok = _bind;
      x = _Ok._0;
    } else {
      return undefined;
    }
    const _bind$2 = _M0MP27mik1e806dxfkit6Record15require__double(self, 20 + n | 0);
    let y;
    if (_bind$2.$tag === 1) {
      const _Ok = _bind$2;
      y = _Ok._0;
    } else {
      return undefined;
    }
    const _bind$3 = _M0MP27mik1e806dxfkit6Record11try__double(self, 30 + n | 0);
    let z;
    if (_bind$3.$tag === 1) {
      const _Ok = _bind$3;
      const _x = _Ok._0;
      if (_x.$tag === 1) {
        const _Some = _x;
        z = _Some._0;
      } else {
        z = 0;
      }
    } else {
      return undefined;
    }
    return _M0MP27mik1e806dxfkit4Vec33new(x, y, z);
  }
  function _M0FP27mik1e806dxfkit13parse__entity(record, warnings) {
    const kind = record.kind;
    const common = _M0FP27mik1e806dxfkit10common__of(record);
    _L: {
      _L$2: {
        _L$3: {
          switch (kind) {
            case "LINE": {
              _L$4: {
                const _bind = _M0MP27mik1e806dxfkit6Record5point(record, 0);
                const _bind$2 = _M0MP27mik1e806dxfkit6Record5point(record, 1);
                if (_bind === undefined) {
                  break _L$4;
                } else {
                  const _Some = _bind;
                  const _start = _Some;
                  if (_bind$2 === undefined) {
                    break _L$4;
                  } else {
                    const _Some$2 = _bind$2;
                    const _end = _Some$2;
                    return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry4Line(_start, _end));
                  }
                }
              }
              const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(55);
              _M0MPB13StringBuilder13write__objectGsE(_string_builder, kind);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺端点坐标（10/20 起，11/21 止），已跳过");
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
              return undefined;
            }
            case "POINT": {
              const _bind = _M0MP27mik1e806dxfkit6Record5point(record, 0);
              if (_bind === undefined) {
                const _string_builder$2 = _M0MPB13StringBuilder21StringBuilder_2einner(33);
                _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, " 缺坐标（10/20），已跳过");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$2.val);
                return undefined;
              } else {
                const _Some = _bind;
                const _at = _Some;
                return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry5Point(_at));
              }
            }
            case "CIRCLE": {
              const _bind$2 = _M0MP27mik1e806dxfkit6Record5point(record, 0);
              const _bind$3 = _M0FP27mik1e806dxfkit10number__of(record, 40);
              if (_bind$2 === undefined) {
                const _string_builder$2 = _M0MPB13StringBuilder21StringBuilder_2einner(39);
                _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, " 缺圆心坐标（10/20），已跳过");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$2.val);
                return undefined;
              } else {
                const _Some = _bind$2;
                const _center = _Some;
                if (_bind$3.$tag === 1) {
                  const _Some$2 = _bind$3;
                  const _radius = _Some$2._0;
                  return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry6Circle(_center, _radius));
                } else {
                  const _string_builder$2 = _M0MPB13StringBuilder21StringBuilder_2einner(30);
                  _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, kind);
                  _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, " 缺半径（40），已跳过");
                  _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$2.val);
                  return undefined;
                }
              }
            }
            case "ARC": {
              _L$5: {
                const _bind$4 = _M0MP27mik1e806dxfkit6Record5point(record, 0);
                const _bind$5 = _M0FP27mik1e806dxfkit10number__of(record, 40);
                const _bind$6 = _M0FP27mik1e806dxfkit10number__of(record, 50);
                const _bind$7 = _M0FP27mik1e806dxfkit10number__of(record, 51);
                if (_bind$4 === undefined) {
                  const _string_builder$2 = _M0MPB13StringBuilder21StringBuilder_2einner(39);
                  _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, kind);
                  _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, " 缺圆心坐标（10/20），已跳过");
                  _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$2.val);
                  return undefined;
                } else {
                  const _Some = _bind$4;
                  const _center = _Some;
                  if (_bind$5.$tag === 1) {
                    const _Some$2 = _bind$5;
                    const _radius = _Some$2._0;
                    if (_bind$6.$tag === 1) {
                      const _Some$3 = _bind$6;
                      const _a0 = _Some$3._0;
                      if (_bind$7.$tag === 1) {
                        const _Some$4 = _bind$7;
                        const _a1 = _Some$4._0;
                        return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry3Arc(_center, _radius, _a0 * 0.017453292519943295, _a1 * 0.017453292519943295));
                      } else {
                        break _L$5;
                      }
                    } else {
                      break _L$5;
                    }
                  } else {
                    const _string_builder$2 = _M0MPB13StringBuilder21StringBuilder_2einner(30);
                    _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, kind);
                    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, " 缺半径（40），已跳过");
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$2.val);
                    return undefined;
                  }
                }
              }
              const _string_builder$2 = _M0MPB13StringBuilder21StringBuilder_2einner(36);
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, kind);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, " 缺起止角（50/51），已跳过");
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$2.val);
              return undefined;
            }
            case "ELLIPSE": {
              _L$6: {
                const _bind$4 = _M0MP27mik1e806dxfkit6Record5point(record, 0);
                const _bind$5 = _M0MP27mik1e806dxfkit6Record5point(record, 1);
                if (_bind$4 === undefined) {
                  break _L$6;
                } else {
                  const _Some = _bind$4;
                  const _center = _Some;
                  if (_bind$5 === undefined) {
                    break _L$6;
                  } else {
                    const _Some$2 = _bind$5;
                    const _major = _Some$2;
                    const _bind$6 = _M0FP27mik1e806dxfkit10number__of(record, 40);
                    if (_bind$6.$tag === 1) {
                      const _Some$3 = _bind$6;
                      const _ratio = _Some$3._0;
                      const _bind$7 = _M0FP27mik1e806dxfkit10number__of(record, 41);
                      let start_param;
                      if (_bind$7.$tag === 1) {
                        const _Some$4 = _bind$7;
                        start_param = _Some$4._0;
                      } else {
                        start_param = 0;
                      }
                      const _bind$8 = _M0FP27mik1e806dxfkit10number__of(record, 42);
                      let end_param;
                      if (_bind$8.$tag === 1) {
                        const _Some$4 = _bind$8;
                        end_param = _Some$4._0;
                      } else {
                        end_param = 6.2831853071795862;
                      }
                      return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry7Ellipse(_center, _major, _ratio, start_param, end_param));
                    } else {
                      const _string_builder$3 = _M0MPB13StringBuilder21StringBuilder_2einner(54);
                      _M0MPB13StringBuilder13write__objectGsE(_string_builder$3, kind);
                      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, " 缺短长轴比（40），推不出形状，已跳过");
                      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$3.val);
                      return undefined;
                    }
                  }
                }
              }
              const _string_builder$3 = _M0MPB13StringBuilder21StringBuilder_2einner(56);
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$3, kind);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, " 缺圆心或长轴向量（10/20、11/21），已跳过");
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$3.val);
              return undefined;
            }
            case "TEXT": {
              break _L$3;
            }
            case "MTEXT": {
              break _L$3;
            }
            case "ATTRIB": {
              break _L$3;
            }
            case "ATTDEF": {
              break _L$3;
            }
            case "LWPOLYLINE": {
              const _bind$4 = _M0FP27mik1e806dxfkit17parse__lwpolyline(record, warnings);
              if (_bind$4 === undefined) {
                return undefined;
              } else {
                const _Some = _bind$4;
                const _geom = _Some;
                return new _M0TP27mik1e806dxfkit6Entity(common, _geom);
              }
            }
            case "INSERT": {
              const _bind$5 = _M0MP27mik1e806dxfkit6Record5point(record, 0);
              if (_bind$5 === undefined) {
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "INSERT 缺插入点坐标（10/20），已跳过");
                return undefined;
              } else {
                const _Some = _bind$5;
                const _at = _Some;
                const block = _M0MP27mik1e806dxfkit6Record11get__string(record, 2);
                if (block === "") {
                  _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "INSERT 缺块名（2），已跳过");
                  return undefined;
                } else {
                  const _p = _M0MP27mik1e806dxfkit6Record11get__double(record, 50, 0);
                  return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry6Insert(_at, block, _M0MP27mik1e806dxfkit4Vec33new(_M0MP27mik1e806dxfkit6Record11get__double(record, 41, 1), _M0MP27mik1e806dxfkit6Record11get__double(record, 42, 1), _M0MP27mik1e806dxfkit6Record11get__double(record, 43, 1)), _p * 0.017453292519943295));
                }
              }
            }
            case "SOLID": {
              break _L$2;
            }
            case "TRACE": {
              break _L$2;
            }
            case "3DFACE": {
              break _L$2;
            }
            case "SPLINE": {
              return new _M0TP27mik1e806dxfkit6Entity(common, _M0FP27mik1e806dxfkit13parse__spline(record, warnings));
            }
            case "HATCH": {
              const _bind$6 = _M0MP27mik1e806dxfkit6Record5point(record, 0);
              if (_bind$6 === undefined) {
                const _string_builder$4 = _M0MPB13StringBuilder21StringBuilder_2einner(42);
                _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, " 缺标高点坐标（10/20），已跳过");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder$4.val);
                return undefined;
              } else {
                const _Some = _bind$6;
                const _at = _Some;
                return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry5Hatch(_at, _M0MP27mik1e806dxfkit6Record8get__int(record, 70, 0) !== 0, _M0MP27mik1e806dxfkit6Record11get__string(record, 2), _M0MP27mik1e806dxfkit6Record8get__int(record, 91, 0)));
              }
            }
            case "DIMENSION": {
              break _L;
            }
            case "ARC_DIMENSION": {
              break _L;
            }
            case "LARGE_RADIAL_DIMENSION": {
              break _L;
            }
            default: {
              return new _M0TP27mik1e806dxfkit6Entity(common, _M0DTP27mik1e806dxfkit8Geometry7Unknown__);
            }
          }
        }
        const _bind = _M0MP27mik1e806dxfkit6Record5point(record, 0);
        if (_bind === undefined) {
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(42);
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, kind);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺插入点坐标（10/20），已跳过");
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
          return undefined;
        } else {
          const _Some = _bind;
          const _at = _Some;
          const _bind$2 = _M0FP27mik1e806dxfkit10number__of(record, 40);
          if (_bind$2.$tag === 1) {
            const _Some$2 = _bind$2;
            const _height = _Some$2._0;
            const value = kind === "MTEXT" ? _M0FP27mik1e806dxfkit12mtext__value(record) : _M0MP27mik1e806dxfkit6Record11get__string(record, 1);
            const _p = _M0MP27mik1e806dxfkit6Record11get__double(record, 50, 0);
            return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry4Text(_at, _height, value, _p * 0.017453292519943295));
          } else {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(30);
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, kind);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺字高（40），已跳过");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
            return undefined;
          }
        }
      }
      _L$3: {
        const _bind = _M0MP27mik1e806dxfkit6Record5point(record, 0);
        const _bind$2 = _M0MP27mik1e806dxfkit6Record5point(record, 1);
        const _bind$3 = _M0MP27mik1e806dxfkit6Record5point(record, 2);
        if (_bind === undefined) {
          break _L$3;
        } else {
          const _Some = _bind;
          const _a = _Some;
          if (_bind$2 === undefined) {
            break _L$3;
          } else {
            const _Some$2 = _bind$2;
            const _b = _Some$2;
            if (_bind$3 === undefined) {
              break _L$3;
            } else {
              const _Some$3 = _bind$3;
              const _c = _Some$3;
              const corners = [_a, _b, _c];
              const _bind$4 = _M0MP27mik1e806dxfkit6Record5point(record, 3);
              if (_bind$4 === undefined) {
                if (((_M0MP27mik1e806dxfkit6Record11count__code(record, 13) + _M0MP27mik1e806dxfkit6Record11count__code(record, 23) | 0) + _M0MP27mik1e806dxfkit6Record11count__code(record, 33) | 0) > 0) {
                  const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(64);
                  _M0MPB13StringBuilder13write__objectGsE(_string_builder, kind);
                  _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 第四角点坐标不完整，已跳过；不能当作三角形");
                  _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
                  return undefined;
                }
                if (kind === "SOLID" || kind === "TRACE") {
                  const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(64);
                  _M0MPB13StringBuilder13write__objectGsE(_string_builder, kind);
                  _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺第四角点，按三个已有角点恢复；检查不完整");
                  _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
                }
              } else {
                const _Some$4 = _bind$4;
                const _d = _Some$4;
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(corners, _d);
              }
              return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry4Face(corners));
            }
          }
        }
      }
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(42);
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, kind);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺角点坐标（10/11/12），已跳过");
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
      return undefined;
    }
    const _bind = _M0MP27mik1e806dxfkit6Record5point(record, 0);
    if (_bind === undefined) {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(42);
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, kind);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺定义点坐标（10/20），已跳过");
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
      return undefined;
    } else {
      const _Some = _bind;
      const _at = _Some;
      return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry9Dimension(_at, _M0MP27mik1e806dxfkit6Record11get__string(record, 2), _M0MP27mik1e806dxfkit6Record11get__double(record, 42, 0)));
    }
  }
  function _M0FP27mik1e806dxfkit23parse__polyline__entity(record, vertex_records, warnings) {
    _M0FP27mik1e806dxfkit22warn__polyline__extent(record, [40, 41, 39], warnings);
    let vertex_width = false;
    const _bind = vertex_records.end - vertex_records.start | 0;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const vr = vertex_records.buf[vertex_records.start + _ | 0];
        if (!_M0FP27mik1e806dxfkit20valid__numeric__tags(vr)) {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "POLYLINE 顶点数值类型错误；保留记录，不生成猜测几何");
          return new _M0TP27mik1e806dxfkit6Entity(_M0FP27mik1e806dxfkit10common__of(record), _M0DTP27mik1e806dxfkit8Geometry7Unknown__);
        }
        const _bind$2 = [40, 41];
        const _bind$3 = _bind$2.length;
        let _tmp$2 = 0;
        while (true) {
          const _$2 = _tmp$2;
          if (_$2 < _bind$3) {
            const code = _bind$2[_$2];
            const _bind$4 = _M0MP27mik1e806dxfkit6Record7all__of(vr, code);
            const _bind$5 = _bind$4.length;
            let _tmp$3 = 0;
            while (true) {
              const _$3 = _tmp$3;
              if (_$3 < _bind$5) {
                const tag = _bind$4[_$3];
                if (_M0MP27mik1e806dxfkit8TagValue10as__double(tag.value) !== 0) {
                  vertex_width = true;
                }
                _tmp$3 = _$3 + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            _tmp$2 = _$2 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (vertex_width) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "POLYLINE 顶点含非零宽度；本工具仅检查中心线，区域/厚度未验证");
    }
    const common = _M0FP27mik1e806dxfkit10common__of(record);
    const flags = _M0MP27mik1e806dxfkit6Record8get__int(record, 70, 0);
    if ((flags & 126) !== 0) {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(80);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "POLYLINE 标志 ");
      _M0MPB13StringBuilder13write__objectGiE(_string_builder, flags);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 超出普通二维折线范围；保留记录，轮廓未检查");
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
      return new _M0TP27mik1e806dxfkit6Entity(common, _M0DTP27mik1e806dxfkit8Geometry7Unknown__);
    }
    const vertices = [];
    let damaged = false;
    const _bind$2 = vertex_records.end - vertex_records.start | 0;
    let _tmp$2 = 0;
    while (true) {
      const index = _tmp$2;
      if (index < _bind$2) {
        const vr = vertex_records.buf[vertex_records.start + index | 0];
        if (_M0FP27mik1e806dxfkit29diagnostic__budget__exhausted(warnings)) {
          return new _M0TP27mik1e806dxfkit6Entity(common, _M0DTP27mik1e806dxfkit8Geometry7Unknown__);
        }
        if (_M0MP27mik1e806dxfkit6Record8get__int(vr, 70, 0) !== 0) {
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(74);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "POLYLINE 顶点 ");
          _M0MPB13StringBuilder13write__objectGiE(_string_builder, index + 1 | 0);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 带拟合或空间标志；保留记录，轮廓未检查");
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
          damaged = true;
        }
        const _bind$3 = _M0MP27mik1e806dxfkit6Record5point(vr, 0);
        if (_bind$3 === undefined) {
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(64);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "POLYLINE 顶点 ");
          _M0MPB13StringBuilder13write__objectGiE(_string_builder, index + 1 | 0);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺少 X/Y 坐标；未生成该实体的轮廓");
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
          damaged = true;
        } else {
          const _Some = _bind$3;
          const _at = _Some;
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(vertices, new _M0TP27mik1e806dxfkit10PolyVertex(_at, _M0MP27mik1e806dxfkit6Record11get__double(vr, 42, 0)));
        }
        _tmp$2 = index + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (vertices.length === 0) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "POLYLINE 解析不出顶点，已跳过");
      return undefined;
    }
    if (damaged) {
      return new _M0TP27mik1e806dxfkit6Entity(common, _M0DTP27mik1e806dxfkit8Geometry7Unknown__);
    }
    return new _M0TP27mik1e806dxfkit6Entity(common, new _M0DTP27mik1e806dxfkit8Geometry8Polyline(vertices, (flags & 1) !== 0));
  }
  function _M0FP27mik1e806dxfkit14parse__records(records, warnings) {
    const entities = [];
    let i = 0;
    while (true) {
      if (i < (records.end - records.start | 0)) {
        if (warnings.length >= 1000) {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "实体解码诊断达到资源上限；剩余记录未解码，检查不完整");
          break;
        }
        const _bind = i;
        if (_bind < 0 || _bind >= (records.end - records.start | 0)) {
          $panic();
        }
        const record = records.buf[records.start + _bind | 0];
        if (!_M0FP27mik1e806dxfkit20valid__numeric__tags(record)) {
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(64);
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, record.kind);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 数值字段类型错误；保留记录，不生成猜测几何");
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(entities, new _M0TP27mik1e806dxfkit6Entity(_M0FP27mik1e806dxfkit10common__of(record), _M0DTP27mik1e806dxfkit8Geometry7Unknown__));
          i = i + 1 | 0;
          continue;
        }
        if (record.kind === "POLYLINE") {
          let j = i + 1 | 0;
          while (true) {
            let _tmp;
            if (j < (records.end - records.start | 0)) {
              const _bind$2 = j;
              if (_bind$2 < 0 || _bind$2 >= (records.end - records.start | 0)) {
                $panic();
              }
              _tmp = records.buf[records.start + _bind$2 | 0].kind === "VERTEX";
            } else {
              _tmp = false;
            }
            if (_tmp) {
              j = j + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          const _bind$2 = _M0FP27mik1e806dxfkit23parse__polyline__entity(record, _M0MPC15array9ArrayView21clamped__view_2einnerGRP27mik1e806dxfkit6RecordE(records, i + 1 | 0, j), warnings);
          if (_bind$2 === undefined) {
          } else {
            const _Some = _bind$2;
            const _e = _Some;
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(entities, _e);
          }
          let _tmp;
          if (j < (records.end - records.start | 0)) {
            const _bind$3 = j;
            if (_bind$3 < 0 || _bind$3 >= (records.end - records.start | 0)) {
              $panic();
            }
            _tmp = records.buf[records.start + _bind$3 | 0].kind === "SEQEND";
          } else {
            _tmp = false;
          }
          if (_tmp) {
            j = j + 1 | 0;
          } else {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "POLYLINE 缺少 SEQEND；已保留可读取记录，请复核输入完整性");
          }
          i = j;
        } else {
          if (record.kind === "VERTEX" || record.kind === "SEQEND") {
            i = i + 1 | 0;
          } else {
            const _bind$2 = _M0FP27mik1e806dxfkit13parse__entity(record, warnings);
            if (_bind$2 === undefined) {
            } else {
              const _Some = _bind$2;
              const _e = _Some;
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(entities, _e);
            }
            i = i + 1 | 0;
          }
        }
        continue;
      } else {
        break;
      }
    }
    return entities;
  }
  function _M0FP27mik1e806dxfkit13parse__blocks(section) {
    const blocks = [];
    const warnings = [];
    const records = section.records;
    let i = 0;
    while (true) {
      if (i < records.length) {
        const _p = _M0MPC15array5Array2atGRPB4JsonE(records, i).kind;
        const _p$2 = "BLOCK";
        if (!(_p === _p$2)) {
          i = i + 1 | 0;
          continue;
        }
        const head = _M0MPC15array5Array2atGRPB4JsonE(records, i);
        let j = i + 1 | 0;
        while (true) {
          let _tmp;
          if (j < records.length) {
            let _tmp$2;
            const _p$3 = _M0MPC15array5Array2atGRPB4JsonE(records, j).kind;
            const _p$4 = "ENDBLK";
            if (!(_p$3 === _p$4)) {
              const _p$5 = _M0MPC15array5Array2atGRPB4JsonE(records, j).kind;
              const _p$6 = "BLOCK";
              _tmp$2 = !(_p$5 === _p$6);
            } else {
              _tmp$2 = false;
            }
            _tmp = _tmp$2;
          } else {
            _tmp = false;
          }
          if (_tmp) {
            j = j + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        const name = _M0MP27mik1e806dxfkit6Record11get__string(head, 2);
        let _tmp;
        if (j >= records.length) {
          _tmp = true;
        } else {
          const _p$3 = _M0MPC15array5Array2atGRPB4JsonE(records, j).kind;
          const _p$4 = "ENDBLK";
          _tmp = !(_p$3 === _p$4);
        }
        if (_tmp) {
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(85);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "块「");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, name);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」缺少 ENDBLK；按下一 BLOCK 或 BLOCKS 段末尾恢复，检查不完整");
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
        }
        if (name === "") {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "BLOCK 没有名字，已跳过");
        } else {
          const _bind = _M0MP27mik1e806dxfkit6Record5point(head, 0);
          let base;
          if (_bind === undefined) {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(47);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "块「");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, name);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」缺基点（10/20），按原点处理");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
            base = _M0MP27mik1e806dxfkit4Vec34zeroN6recordS5777;
          } else {
            const _Some = _bind;
            base = _Some;
          }
          const entities = _M0FP27mik1e806dxfkit14parse__records(_M0MPC15array5Array21clamped__view_2einnerGRP27mik1e806dxfkit6RecordE(records, i + 1 | 0, j), warnings);
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(blocks, new _M0TP27mik1e806dxfkit5Block(name, base, entities));
        }
        if (j < records.length && _M0MPC15array5Array2atGRPB4JsonE(records, j).kind === "ENDBLK") {
          j = j + 1 | 0;
        }
        i = j;
        continue;
      } else {
        break;
      }
    }
    return new _M0TP27mik1e806dxfkit6Blocks(blocks, warnings);
  }
  function _M0MP27mik1e806dxfkit7Drawing7section(self, name) {
    const _bind = self.sections;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const s = _bind[_];
        if (s.name === name) {
          return s;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return undefined;
  }
  function _M0MP27mik1e806dxfkit7Drawing6blocks(self) {
    const _bind = _M0MP27mik1e806dxfkit7Drawing7section(self, "BLOCKS");
    if (_bind === undefined) {
      const blocks = [];
      const warnings = [];
      return new _M0TP27mik1e806dxfkit6Blocks(blocks, warnings);
    } else {
      const _Some = _bind;
      const _s = _Some;
      return _M0FP27mik1e806dxfkit13parse__blocks(_s);
    }
  }
  function _M0FP27mik1e806dxfkit15parse__entities(section) {
    const warnings = [];
    const _bind = section.records;
    const entities = _M0FP27mik1e806dxfkit14parse__records(new _M0TPB9ArrayViewGRP27mik1e806dxfkit6RecordE(_bind, 0, _bind.length), warnings);
    return new _M0TP27mik1e806dxfkit8Entities(entities, warnings);
  }
  function _M0MP27mik1e806dxfkit7Drawing8entities(self) {
    const _bind = _M0MP27mik1e806dxfkit7Drawing7section(self, "ENTITIES");
    if (_bind === undefined) {
      const entities = [];
      const warnings = [];
      return new _M0TP27mik1e806dxfkit8Entities(entities, warnings);
    } else {
      const _Some = _bind;
      const _s = _Some;
      return _M0FP27mik1e806dxfkit15parse__entities(_s);
    }
  }
  function _M0MP27mik1e806dxfkit10Transform38identity() {
    return new _M0TP27mik1e806dxfkit10Transform3(_M0MP27mik1e806dxfkit4Vec33new(1, 0, 0), _M0MP27mik1e806dxfkit4Vec33new(0, 1, 0), _M0MP27mik1e806dxfkit4Vec33new(0, 0, 1), _M0MP27mik1e806dxfkit4Vec34zeroN6recordS5777);
  }
  function _M0MP27mik1e806dxfkit7Drawing27expand__world__with__limits(self, tol, limits) {
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(tol)) {
      return new _M0TP27mik1e806dxfkit14WorldExpansion([], ["离散容差必须是正的有限数字"]);
    }
    if (limits.max_placed <= 0 || (limits.max_points <= 0 || limits.max_visits <= 0)) {
      return new _M0TP27mik1e806dxfkit14WorldExpansion([], ["展开资源预算必须为正整数；检查不完整"]);
    }
    const es = _M0MP27mik1e806dxfkit7Drawing8entities(self);
    const blocks = _M0MP27mik1e806dxfkit7Drawing6blocks(self);
    const warnings = _M0MPC15array5Array4copyGsE(self.warnings);
    const _bind = es.warnings;
    _M0MPC15array5Array6appendGRP27mik1e806dxfkit3TagE(warnings, new _M0TPB9ArrayViewGsE(_bind, 0, _bind.length));
    const _bind$2 = blocks.warnings;
    _M0MPC15array5Array6appendGRP27mik1e806dxfkit3TagE(warnings, new _M0TPB9ArrayViewGsE(_bind$2, 0, _bind$2.length));
    const _bind$3 = [];
    const index = _M0MPB3Map3MapGsRP27mik1e806dxfkit5BlockE(new _M0TPB9ArrayViewGUsRP27mik1e806dxfkit5BlockEE(_bind$3, 0, 0), undefined);
    const _bind$4 = [];
    const duplicates = _M0MPB3Map3MapGsbE(new _M0TPB9ArrayViewGUsbEE(_bind$4, 0, 0), undefined);
    const _bind$5 = blocks.blocks;
    const _bind$6 = _bind$5.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$6) {
        const block = _bind$5[_];
        const name = _M0MPC16string6String9to__upper(block.name);
        if (_M0MPB3Map8containsGsRP27mik1e806dxfkit5BlockE(index, name)) {
          _M0MPB3Map3setGsbE(duplicates, name, true);
        } else {
          _M0MPB3Map3setGsRP27mik1e806dxfkit5BlockE(index, name, block);
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const ctx = new _M0TP27mik1e806dxfkit9ExpandCtx(index, duplicates, tol, warnings, limits, 0, 0, false);
    const placed = [];
    const _bind$7 = es.entities;
    const _bind$8 = _bind$7.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$8) {
        const e = _bind$7[_];
        if (ctx.stopped) {
          break;
        }
        _M0FP27mik1e806dxfkit21expand__entity__world(e, ctx, _M0MP27mik1e806dxfkit10Transform38identity(), "", [], placed);
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return new _M0TP27mik1e806dxfkit14WorldExpansion(placed, warnings);
  }
  function _M0MP27mik1e806dxfkit7Drawing20expand__with__limits(self, tol, limits) {
    return _M0FP27mik1e806dxfkit18project__expansion(_M0MP27mik1e806dxfkit7Drawing27expand__world__with__limits(self, tol, limits), tol);
  }
  function _M0MP27mik1e806dxfkit7Drawing6expand(self, tol) {
    return _M0MP27mik1e806dxfkit7Drawing20expand__with__limits(self, tol, _M0FP27mik1e806dxfkit17expansion__limitsN6recordS5804);
  }
  function _M0FP27mik1e806dxfkit3fmt(v) {
    return String(v);
  }
  function _M0FP27mik1e806dxfkit10aci__color(index) {
    switch (index) {
      case 1: {
        return "#ff0000";
      }
      case 2: {
        return "#ffff00";
      }
      case 3: {
        return "#00ff00";
      }
      case 4: {
        return "#00ffff";
      }
      case 5: {
        return "#0000ff";
      }
      case 6: {
        return "#ff00ff";
      }
      case 7: {
        return "#000000";
      }
      case 8: {
        return "#808080";
      }
      case 9: {
        return "#c0c0c0";
      }
      default: {
        return "#808080";
      }
    }
  }
  function _M0FP27mik1e806dxfkit12layer__state(tables, layer) {
    if (tables === undefined) {
      return _M0FP27mik1e806dxfkit12layer__stateN5tupleS5807;
    } else {
      const _Some = tables;
      const _t = _Some;
      const _bind = _M0MP27mik1e806dxfkit6Tables5layer(_t, layer);
      if (_bind === undefined) {
        return _M0FP27mik1e806dxfkit12layer__stateN5tupleS5806;
      } else {
        const _Some$2 = _bind;
        const _l = _Some$2;
        const color = _M0FP27mik1e806dxfkit10aci__color(_l.color < 0 ? -_l.color | 0 : _l.color);
        return !_M0MP27mik1e806dxfkit5Layer24is__enabled__for__checks(_l) ? { _0: color, _1: " opacity=\"0.25\"" } : { _0: color, _1: "" };
      }
    }
  }
  function _M0FP27mik1e806dxfkit12safe__scalar(x) {
    return x === 0 || Math.abs(x) >= 1e-100 && Math.abs(x) <= 1e+100;
  }
  function _M0FP27mik1e806dxfkit8safe__xy(p) {
    return _M0FP27mik1e806dxfkit14finite__number(p.x) && (_M0FP27mik1e806dxfkit14finite__number(p.y) && (_M0FP27mik1e806dxfkit12safe__scalar(p.x) && _M0FP27mik1e806dxfkit12safe__scalar(p.y)));
  }
  function _M0FP27mik1e806dxfkit18preview__range__ok(exp) {
    let count = 0;
    let text = 0;
    const _bind = exp.placed;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const placed = _bind[_];
        const _bind$3 = placed.flat;
        switch (_bind$3.$tag) {
          case 0: {
            const _Outline = _bind$3;
            const _points = _Outline._0;
            count = count + _points.length | 0;
            let _tmp$2;
            let _p;
            _L: {
              _L$2: {
                const _p$2 = _points.length;
                let _tmp$3 = 0;
                while (true) {
                  const _p$3 = _tmp$3;
                  if (_p$3 < _p$2) {
                    const _p$4 = _points[_p$3];
                    if (!_M0FP27mik1e806dxfkit8safe__xy(_p$4)) {
                      _p = false;
                      break _L$2;
                    }
                    _tmp$3 = _p$3 + 1 | 0;
                    continue;
                  } else {
                    break;
                  }
                }
                _tmp$2 = true;
                break _L;
              }
              _tmp$2 = _p;
            }
            if (!_tmp$2) {
              return false;
            }
            break;
          }
          case 1: {
            const _Dot = _bind$3;
            const _at = _Dot._0;
            if (!_M0FP27mik1e806dxfkit8safe__xy(_at)) {
              return false;
            }
            break;
          }
          case 2: {
            const _Label = _bind$3;
            const _at$2 = _Label._0;
            const _height = _Label._1;
            const _value = _Label._2;
            text = text + _value.length | 0;
            if (!_M0FP27mik1e806dxfkit8safe__xy(_at$2) || (!_M0FP27mik1e806dxfkit14finite__number(_height) || !_M0FP27mik1e806dxfkit12safe__scalar(_height))) {
              return false;
            }
            break;
          }
        }
        if (count > 200000 || text > 65536) {
          return false;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return true;
  }
  function _M0MP27mik1e806dxfkit9SvgWriter13write__string(self, value) {
    if (self.limited) {
      return undefined;
    }
    const bytes = _M0FPC28encoding4utf814encode_2einner(new _M0TPC16string10StringView(value, 0, value.length), false).length;
    if (bytes > self.remaining) {
      self.limited = true;
      return;
    } else {
      self.remaining = self.remaining - bytes | 0;
      _M0IPB13StringBuilderPB6Logger13write__string(self.data, value);
      return;
    }
  }
  function _M0FP27mik1e806dxfkit18write__svg__points(sb, points) {
    let i = 0;
    while (true) {
      if (i < points.length && !sb.limited) {
        if (i > 0) {
          _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, " ");
        }
        _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, _M0FP27mik1e806dxfkit3fmt(_M0MPC15array5Array2atGRPB4JsonE(points, i).x));
        _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, ",");
        _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, _M0FP27mik1e806dxfkit3fmt(_M0MPC15array5Array2atGRPB4JsonE(points, i).y));
        i = i + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FP27mik1e806dxfkit11xml__escape(s) {
    const sb = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    const _bind = s.length;
    let _tmp = 0;
    while (true) {
      const _string_index = _tmp;
      if (_string_index < _bind) {
        let _decoded_next_string_index;
        let _decoded_char;
        _L: {
          const _bind$2 = s.charCodeAt(_string_index);
          if (_bind$2 >= 55296 && _bind$2 <= 56319 && (_string_index + 1 | 0) < _bind) {
            const _bind$3 = s.charCodeAt(_string_index + 1 | 0);
            if (_bind$3 >= 56320 && _bind$3 <= 57343) {
              const _tmp$2 = _string_index + 2 | 0;
              const _p = (((Math.imul(_bind$2 - 55296 | 0, 1024) | 0) + _bind$3 | 0) - 56320 | 0) + 65536 | 0;
              _decoded_next_string_index = _tmp$2;
              _decoded_char = _p;
              break _L;
            } else {
              const _tmp$2 = _string_index + 1 | 0;
              const _p = _bind$2;
              _decoded_next_string_index = _tmp$2;
              _decoded_char = _p;
              break _L;
            }
          } else {
            const _tmp$2 = _string_index + 1 | 0;
            const _p = _bind$2;
            _decoded_next_string_index = _tmp$2;
            _decoded_char = _p;
            break _L;
          }
        }
        switch (_decoded_char) {
          case 38: {
            _M0IPB13StringBuilderPB6Logger13write__string(sb, "&amp;");
            break;
          }
          case 60: {
            _M0IPB13StringBuilderPB6Logger13write__string(sb, "&lt;");
            break;
          }
          case 62: {
            _M0IPB13StringBuilderPB6Logger13write__string(sb, "&gt;");
            break;
          }
          case 34: {
            _M0IPB13StringBuilderPB6Logger13write__string(sb, "&quot;");
            break;
          }
          default: {
            const cp = _decoded_char;
            if (cp < 32 && (cp !== 9 && (cp !== 10 && cp !== 13)) || (cp === 65534 || cp === 65535)) {
              _M0IPB13StringBuilderPB6Logger11write__char(sb, 65533);
            } else {
              _M0IPB13StringBuilderPB6Logger11write__char(sb, _decoded_char);
            }
          }
        }
        _tmp = _decoded_next_string_index;
        continue;
      } else {
        break;
      }
    }
    return sb.val;
  }
  function _M0MP27mik1e806dxfkit9SvgWriter6result(self) {
    if (self.limited) {
      return _M0MP27mik1e806dxfkit9SvgWriter6resultN6constrS5808;
    } else {
      const _p = self.data;
      return new _M0DTPC16result6ResultGsRP27mik1e806dxfkit8SvgErrorE2Ok(_p.val);
    }
  }
  function _M0MP27mik1e806dxfkit7Drawing11render__svg(self, exp, max_bytes) {
    if (max_bytes <= 0) {
      return _M0MP27mik1e806dxfkit7Drawing11render__svgN6constrS5809;
    }
    if (!_M0FP27mik1e806dxfkit18preview__range__ok(exp)) {
      return _M0MP27mik1e806dxfkit7Drawing11render__svgN6constrS5810;
    }
    let box = _M0MP27mik1e806dxfkit5Aabb25emptyN6recordS5794;
    const _bind = exp.placed;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const p = _bind[_];
        const _bind$3 = p.flat;
        switch (_bind$3.$tag) {
          case 0: {
            const _Outline = _bind$3;
            const _points = _Outline._0;
            const _bind$4 = _points.length;
            let _tmp$2 = 0;
            while (true) {
              const _$2 = _tmp$2;
              if (_$2 < _bind$4) {
                const pt = _points[_$2];
                box = _M0MP27mik1e806dxfkit5Aabb26expand(box, pt);
                _tmp$2 = _$2 + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            break;
          }
          case 1: {
            const _Dot = _bind$3;
            const _at = _Dot._0;
            box = _M0MP27mik1e806dxfkit5Aabb26expand(box, _at);
            break;
          }
          case 2: {
            const _Label = _bind$3;
            const _at$2 = _Label._0;
            box = _M0MP27mik1e806dxfkit5Aabb26expand(box, _at$2);
            break;
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const sb = new _M0TP27mik1e806dxfkit9SvgWriter(_M0MPB13StringBuilder21StringBuilder_2einner(0), max_bytes, false);
    const _p = box;
    if (_p.min.x > _p.max.x || _p.min.y > _p.max.y) {
      _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\" viewBox=\"0 0 800 600\"></svg>");
      return _M0MP27mik1e806dxfkit9SvgWriter6result(sb);
    }
    const size = _M0MP27mik1e806dxfkit5Aabb24size(box);
    const margin = _M0MPC16double6Double3max(_M0MPC16double6Double3max(size.x, size.y), 1) * 0.02;
    const vx = box.min.x - margin;
    const vy = -(box.max.y + margin);
    const vw = size.x + margin * 2;
    const vh = size.y + margin * 2;
    const height = 800 * (vh / vw);
    const diag = _M0FP27mik1e806dxfkit13scaled__hypot(vw, vh);
    const _p$2 = [vx, vy, vw, vh, height, diag];
    let _tmp$2;
    let _p$3;
    _L: {
      _L$2: {
        const _p$4 = _p$2.length;
        let _tmp$3 = 0;
        while (true) {
          const _p$5 = _tmp$3;
          if (_p$5 < _p$4) {
            const _p$6 = _p$2[_p$5];
            if (!_M0FP27mik1e806dxfkit14finite__number(_p$6)) {
              _p$3 = false;
              break _L$2;
            }
            _tmp$3 = _p$5 + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp$2 = true;
        break _L;
      }
      _tmp$2 = _p$3;
    }
    if (!_tmp$2) {
      return _M0MP27mik1e806dxfkit7Drawing11render__svgN6constrS5811;
    }
    const stroke = diag / 400;
    const _bind$3 = _M0MP27mik1e806dxfkit7Drawing7section(self, "TABLES");
    let tables;
    if (_bind$3 === undefined) {
      tables = undefined;
    } else {
      const _Some = _bind$3;
      const _t = _Some;
      tables = _M0FP27mik1e806dxfkit13parse__tables(_t);
    }
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(77);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit3fmt(height));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "\" viewBox=\"");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit3fmt(vx));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " ");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit3fmt(vy));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " ");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit3fmt(vw));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " ");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit3fmt(vh));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "\">\n");
    _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, _string_builder.val);
    const _string_builder$2 = _M0MPB13StringBuilder21StringBuilder_2einner(52);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, "<rect x=\"");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, _M0FP27mik1e806dxfkit3fmt(vx));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, "\" y=\"");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, _M0FP27mik1e806dxfkit3fmt(vy));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, "\" width=\"");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, _M0FP27mik1e806dxfkit3fmt(vw));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, "\" height=\"");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder$2, _M0FP27mik1e806dxfkit3fmt(vh));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$2, "\" fill=\"#ffffff\"/>\n");
    _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, _string_builder$2.val);
    _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, "<g transform=\"scale(1,-1)\">\n");
    const _bind$4 = exp.placed;
    const _bind$5 = _bind$4.length;
    let _tmp$3 = 0;
    while (true) {
      const _ = _tmp$3;
      if (_ < _bind$5) {
        const p = _bind$4[_];
        if (sb.limited) {
          break;
        }
        const _bind$6 = _M0FP27mik1e806dxfkit12layer__state(tables, p.layer);
        const _color = _bind$6._0;
        const _dim = _bind$6._1;
        const _bind$7 = p.flat;
        switch (_bind$7.$tag) {
          case 0: {
            const _Outline = _bind$7;
            const _points = _Outline._0;
            const _closed = _Outline._1;
            if (_points.length >= 2) {
              const tag = _closed ? "polygon" : "polyline";
              const _string_builder$3 = _M0MPB13StringBuilder21StringBuilder_2einner(10);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, "<");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$3, tag);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, " points=\"");
              _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, _string_builder$3.val);
              _M0FP27mik1e806dxfkit18write__svg__points(sb, _points);
              const _string_builder$4 = _M0MPB13StringBuilder21StringBuilder_2einner(42);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, "\" fill=\"none\" stroke=\"");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _color);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, "\" stroke-width=\"");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _M0FP27mik1e806dxfkit3fmt(stroke));
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, "\"");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _dim);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, "/>\n");
              _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, _string_builder$4.val);
            }
            break;
          }
          case 1: {
            const _Dot = _bind$7;
            const _at = _Dot._0;
            const _string_builder$3 = _M0MPB13StringBuilder21StringBuilder_2einner(35);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, "<circle cx=\"");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder$3, _M0FP27mik1e806dxfkit3fmt(_at.x));
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, "\" cy=\"");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder$3, _M0FP27mik1e806dxfkit3fmt(_at.y));
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, "\" r=\"");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder$3, _M0FP27mik1e806dxfkit3fmt(stroke * 2));
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, "\" fill=\"");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder$3, _color);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, "\"");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder$3, _dim);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$3, "/>\n");
            _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, _string_builder$3.val);
            break;
          }
          case 2: {
            const _Label = _bind$7;
            const _at$2 = _Label._0;
            const _height = _Label._1;
            const _value = _Label._2;
            let _tmp$4;
            const _p$4 = "";
            if (!(_value === _p$4)) {
              _tmp$4 = _height > 0;
            } else {
              _tmp$4 = false;
            }
            if (_tmp$4) {
              const _string_builder$4 = _M0MPB13StringBuilder21StringBuilder_2einner(84);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, "<text x=\"0\" y=\"0\" transform=\"translate(");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _M0FP27mik1e806dxfkit3fmt(_at$2.x));
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, " ");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _M0FP27mik1e806dxfkit3fmt(_at$2.y));
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, ") scale(1 -1)\" font-size=\"");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _M0FP27mik1e806dxfkit3fmt(_height));
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, "\" fill=\"");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _color);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, "\"");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _dim);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, ">");
              _M0MPB13StringBuilder13write__objectGsE(_string_builder$4, _M0FP27mik1e806dxfkit11xml__escape(_value));
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder$4, "</text>\n");
              _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, _string_builder$4.val);
            }
            break;
          }
        }
        _tmp$3 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    _M0MP27mik1e806dxfkit9SvgWriter13write__string(sb, "</g>\n</svg>\n");
    return _M0MP27mik1e806dxfkit9SvgWriter6result(sb);
  }
  function _M0FP27mik1e806dxfkit17find__header__var(sections, name) {
    const _bind = sections.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const s = sections[_];
        _L: {
          const _p = s.name;
          const _p$2 = "HEADER";
          if (!(_p === _p$2)) {
            break _L;
          }
          const _bind$2 = s.records;
          const _bind$3 = _bind$2.length;
          let _tmp$2 = 0;
          while (true) {
            const _$2 = _tmp$2;
            if (_$2 < _bind$3) {
              const record = _bind$2[_$2];
              const tags = record.common;
              let i = 0;
              while (true) {
                if ((i + 1 | 0) < tags.length) {
                  if (_M0MPC15array5Array2atGRPB4JsonE(tags, i).code === 9 && _M0MP27mik1e806dxfkit8TagValue10as__string(_M0MPC15array5Array2atGRPB4JsonE(tags, i).value) === name) {
                    return _M0MP27mik1e806dxfkit8TagValue10as__string(_M0MPC15array5Array2atGRPB4JsonE(tags, i + 1 | 0).value);
                  }
                  i = i + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              _tmp$2 = _$2 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          break _L;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return undefined;
  }
  function _M0FP27mik1e806dxfkit15group__sections(records, warnings) {
    const sections = [];
    let current = undefined;
    let current_records = [];
    const _bind = records.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const record = records[_];
        if (_M0FP27mik1e806dxfkit29diagnostic__budget__exhausted(warnings)) {
          return sections;
        }
        if (record.kind === "SECTION") {
          const _bind$2 = current;
          if (_bind$2 === undefined) {
          } else {
            const _Some = _bind$2;
            const _name = _Some;
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(62);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "段「");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, _name);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」没有 ENDSEC 就结束了（后面又开了新段）");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(sections, new _M0TP27mik1e806dxfkit7Section(_name, current_records));
          }
          current = _M0MP27mik1e806dxfkit6Record11get__string(record, 2);
          current_records = [];
          if (_M0IPC16option6OptionPB2Eq5equalGsE(current, _M0FP27mik1e806dxfkit15group__sectionsN6constrS5839)) {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(current_records, record);
          }
        } else {
          if (record.kind === "ENDSEC") {
            const _bind$2 = current;
            if (_bind$2 === undefined) {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "出现了没有对应 SECTION 的 ENDSEC，已忽略");
            } else {
              const _Some = _bind$2;
              const _name = _Some;
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(sections, new _M0TP27mik1e806dxfkit7Section(_name, current_records));
              current = undefined;
              current_records = [];
            }
          } else {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(current_records, record);
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$2 = current;
    if (_bind$2 === undefined) {
    } else {
      const _Some = _bind$2;
      const _name = _Some;
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(52);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "文件在段「");
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, _name);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」中间就结束了，没有 ENDSEC");
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(sections, new _M0TP27mik1e806dxfkit7Section(_name, current_records));
    }
    return sections;
  }
  function _M0FP27mik1e806dxfkit14split__records(tags) {
    const out = [];
    let kind = undefined;
    let common = [];
    let subs = [];
    let sub_name = undefined;
    let sub_tags = [];
    const _bind = tags.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const tag = tags[_];
        if (tag.code === 0) {
          const _bind$2 = kind;
          if (_bind$2 === undefined) {
          } else {
            const _Some = _bind$2;
            const _k = _Some;
            const finished = _M0MPC15array5Array4copyGsE(subs);
            const _bind$3 = sub_name;
            if (_bind$3 === undefined) {
            } else {
              const _Some$2 = _bind$3;
              const _n = _Some$2;
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(finished, new _M0TP27mik1e806dxfkit8Subclass(_n, sub_tags));
            }
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, new _M0TP27mik1e806dxfkit6Record(_k, common, finished));
          }
          kind = _M0MP27mik1e806dxfkit8TagValue10as__string(tag.value);
          common = [tag];
          subs = [];
          sub_name = undefined;
          sub_tags = [];
        } else {
          if (tag.code === 100) {
            const _bind$2 = sub_name;
            if (_bind$2 === undefined) {
            } else {
              const _Some = _bind$2;
              const _n = _Some;
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(subs, new _M0TP27mik1e806dxfkit8Subclass(_n, sub_tags));
            }
            sub_name = _M0MP27mik1e806dxfkit8TagValue10as__string(tag.value);
            sub_tags = [];
          } else {
            const _bind$2 = sub_name;
            if (_bind$2 === undefined) {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(common, tag);
            } else {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(sub_tags, tag);
            }
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$2 = kind;
    if (_bind$2 === undefined) {
    } else {
      const _Some = _bind$2;
      const _k = _Some;
      const finished = _M0MPC15array5Array4copyGsE(subs);
      const _bind$3 = sub_name;
      if (_bind$3 === undefined) {
      } else {
        const _Some$2 = _bind$3;
        const _n = _Some$2;
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(finished, new _M0TP27mik1e806dxfkit8Subclass(_n, sub_tags));
      }
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, new _M0TP27mik1e806dxfkit6Record(_k, common, finished));
    }
    return out;
  }
  function _M0FP27mik1e806dxfkit27validate__record__structure(records, warnings) {
    let section = "";
    let table = false;
    let block = false;
    let sequence = "";
    let eof = false;
    const _bind = records.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const r = records[_];
        if (warnings.length >= 1000) {
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "结构诊断达到资源上限；检查不完整");
          break;
        }
        if (r.kind === "SECTION") {
          const _p = section;
          const _p$2 = "";
          if (!(_p === _p$2)) {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SECTION 嵌套，读取结构不完整");
          }
          section = r.section;
          if (section === "") {
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SECTION 缺少段名");
          }
        } else {
          if (r.kind === "ENDSEC" || r.kind === "EOF") {
            if (table) {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "TABLE 缺少 ENDTAB");
              table = false;
            }
            if (block) {
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "BLOCK 缺少 ENDBLK");
              block = false;
            }
            const _p = sequence;
            const _p$2 = "";
            if (!(_p === _p$2)) {
              const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(14);
              _M0MPB13StringBuilder13write__objectGsE(_string_builder, sequence);
              _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺少 SEQEND");
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
              sequence = "";
            }
            if (r.kind === "ENDSEC") {
              if (section === "") {
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "ENDSEC 没有对应 SECTION");
              }
              section = "";
            } else {
              const _p$3 = section;
              const _p$4 = "";
              if (!(_p$3 === _p$4)) {
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "EOF 前缺少 ENDSEC");
              }
              eof = true;
            }
          } else {
            if (section === "") {
              let _tmp$2;
              if (r.kind === "") {
                const _p = r.tags;
                let _tmp$3;
                let _p$2;
                _L: {
                  _L$2: {
                    const _p$3 = _p.length;
                    let _tmp$4 = 0;
                    while (true) {
                      const _p$4 = _tmp$4;
                      if (_p$4 < _p$3) {
                        const _p$5 = _p[_p$4];
                        if (!(_p$5.code === 999)) {
                          _p$2 = false;
                          break _L$2;
                        }
                        _tmp$4 = _p$4 + 1 | 0;
                        continue;
                      } else {
                        break;
                      }
                    }
                    _tmp$3 = true;
                    break _L;
                  }
                  _tmp$3 = _p$2;
                }
                _tmp$2 = _tmp$3;
              } else {
                _tmp$2 = false;
              }
              if (!_tmp$2) {
                const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(38);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "段外记录 ");
                _M0MPB13StringBuilder13write__objectGsE(_string_builder, r.kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 已保留，结构无效");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
              }
            } else {
              const child = sequence === "POLYLINE" && r.kind === "VERTEX" || (sequence === "INSERT/ATTRIB" && r.kind === "ATTRIB" || r.kind === "SEQEND");
              let _tmp$2;
              const _p = sequence;
              const _p$2 = "";
              if (!(_p === _p$2)) {
                _tmp$2 = !child;
              } else {
                _tmp$2 = false;
              }
              if (_tmp$2) {
                const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(64);
                _M0MPB13StringBuilder13write__objectGsE(_string_builder, sequence);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺少 SEQEND，遇到 ");
                _M0MPB13StringBuilder13write__objectGsE(_string_builder, r.kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 时结束恢复；读取结构不完整");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
                sequence = "";
              }
              let _tmp$3;
              if (r.kind === "VERTEX") {
                const _p$3 = sequence;
                const _p$4 = "POLYLINE";
                _tmp$3 = !(_p$3 === _p$4);
              } else {
                _tmp$3 = false;
              }
              if (_tmp$3) {
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "VERTEX 没有所属 POLYLINE 序列；记录已保留");
              }
              let _tmp$4;
              if (r.kind === "ATTRIB") {
                const _p$3 = sequence;
                const _p$4 = "INSERT/ATTRIB";
                _tmp$4 = !(_p$3 === _p$4);
              } else {
                _tmp$4 = false;
              }
              if (_tmp$4) {
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "ATTRIB 没有所属 INSERT 属性序列；记录已保留");
              }
              let _tmp$5;
              if (r.kind === "TABLE" || r.kind === "ENDTAB") {
                const _p$3 = section;
                const _p$4 = "TABLES";
                _tmp$5 = !(_p$3 === _p$4);
              } else {
                _tmp$5 = false;
              }
              if (_tmp$5) {
                const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(44);
                _M0MPB13StringBuilder13write__objectGsE(_string_builder, r.kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 所在段必须是 TABLES；记录已保留");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
              }
              let _tmp$6;
              if (r.kind === "BLOCK" || r.kind === "ENDBLK") {
                const _p$3 = section;
                const _p$4 = "BLOCKS";
                _tmp$6 = !(_p$3 === _p$4);
              } else {
                _tmp$6 = false;
              }
              if (_tmp$6) {
                const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(44);
                _M0MPB13StringBuilder13write__objectGsE(_string_builder, r.kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 所在段必须是 BLOCKS；记录已保留");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
              }
              let _tmp$7;
              if (section === "TABLES") {
                let _tmp$8;
                if (!table) {
                  let _tmp$9;
                  const _p$3 = r.kind;
                  const _p$4 = "TABLE";
                  if (!(_p$3 === _p$4)) {
                    const _p$5 = r.kind;
                    const _p$6 = "ENDTAB";
                    _tmp$9 = !(_p$5 === _p$6);
                  } else {
                    _tmp$9 = false;
                  }
                  _tmp$8 = _tmp$9;
                } else {
                  _tmp$8 = false;
                }
                _tmp$7 = _tmp$8;
              } else {
                _tmp$7 = false;
              }
              if (_tmp$7) {
                const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(44);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "表项 ");
                _M0MPB13StringBuilder13write__objectGsE(_string_builder, r.kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 没有所属 TABLE；记录已保留");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
              }
              let _tmp$8;
              if (section === "BLOCKS") {
                let _tmp$9;
                if (!block) {
                  let _tmp$10;
                  const _p$3 = r.kind;
                  const _p$4 = "BLOCK";
                  if (!(_p$3 === _p$4)) {
                    const _p$5 = r.kind;
                    const _p$6 = "ENDBLK";
                    _tmp$10 = !(_p$5 === _p$6);
                  } else {
                    _tmp$10 = false;
                  }
                  _tmp$9 = _tmp$10;
                } else {
                  _tmp$9 = false;
                }
                _tmp$8 = _tmp$9;
              } else {
                _tmp$8 = false;
              }
              if (_tmp$8) {
                const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(44);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "实体 ");
                _M0MPB13StringBuilder13write__objectGsE(_string_builder, r.kind);
                _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 没有所属 BLOCK；记录已保留");
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
              }
              const _bind$2 = r.kind;
              switch (_bind$2) {
                case "TABLE": {
                  if (table) {
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "TABLE 嵌套或缺少 ENDTAB");
                  }
                  table = true;
                  break;
                }
                case "ENDTAB": {
                  if (!table) {
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "ENDTAB 没有对应 TABLE");
                  }
                  table = false;
                  break;
                }
                case "BLOCK": {
                  if (block) {
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "BLOCK 嵌套或缺少 ENDBLK");
                  }
                  block = true;
                  break;
                }
                case "ENDBLK": {
                  if (!block) {
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "ENDBLK 没有对应 BLOCK");
                  }
                  block = false;
                  break;
                }
                case "POLYLINE": {
                  const _p$3 = sequence;
                  const _p$4 = "";
                  if (!(_p$3 === _p$4)) {
                    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(14);
                    _M0MPB13StringBuilder13write__objectGsE(_string_builder, sequence);
                    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 缺少 SEQEND");
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, _string_builder.val);
                  }
                  sequence = "POLYLINE";
                  break;
                }
                case "INSERT": {
                  const _bind$3 = r.tags;
                  const _bind$4 = _bind$3.length;
                  let _tmp$9 = 0;
                  while (true) {
                    const _$2 = _tmp$9;
                    if (_$2 < _bind$4) {
                      const t = _bind$3[_$2];
                      if (t.code === 66 && _M0MP27mik1e806dxfkit8TagValue7as__int(t.value) === 1) {
                        sequence = "INSERT/ATTRIB";
                      }
                      _tmp$9 = _$2 + 1 | 0;
                      continue;
                    } else {
                      break;
                    }
                  }
                  break;
                }
                case "SEQEND": {
                  if (sequence === "") {
                    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "SEQEND 没有对应序列");
                  }
                  sequence = "";
                  break;
                }
              }
            }
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (!eof) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(warnings, "缺少 EOF；读取结构不完整");
      return;
    } else {
      return;
    }
  }
  function _M0FP27mik1e806dxfkit19build__drawing__raw(scan, raw) {
    const _bind = scan.tags;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const tag = _bind[_];
        const _bind$3 = tag.value;
        if (_bind$3.$tag === 0) {
          const _Str = _bind$3;
          const _text = _Str._0;
          const identifier = _M0MPC15array5Array8containsGiE([0, 2, 5, 6, 8, 100, 105], tag.code);
          if (identifier && _text.length > 256 || _text.length > 65536) {
            return new _M0TP27mik1e806dxfkit7Drawing("", [], ["语义字段文本达到资源上限；原始tag保留，检查不完整"]);
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const records = _M0FP27mik1e806dxfkit14split__records(scan.tags);
    const warnings = _M0MPC15array5Array4copyGsE(scan.warnings);
    const sections = _M0FP27mik1e806dxfkit15group__sections(records, warnings);
    _M0FP27mik1e806dxfkit27validate__record__structure(raw, warnings);
    const _bind$3 = _M0FP27mik1e806dxfkit17find__header__var(sections, "$ACADVER");
    let version;
    if (_bind$3 === undefined) {
      version = "";
    } else {
      const _Some = _bind$3;
      version = _Some;
    }
    return new _M0TP27mik1e806dxfkit7Drawing(version, sections, warnings);
  }
  function _M0FP27mik1e806dxfkit18raw__section__name(tags) {
    const _bind = tags.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const t = tags[_];
        if (t.code === 2) {
          return _M0MP27mik1e806dxfkit8TagValue10as__string(t.value);
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return "";
  }
  function _M0FP27mik1e806dxfkit12raw__records(tags) {
    const records = [];
    let section = "";
    let pending = [];
    let kind = "";
    const _bind = tags.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const tag = tags[_];
        if (tag.code === 0 && pending.length > 0) {
          if (kind === "SECTION") {
            section = _M0FP27mik1e806dxfkit18raw__section__name(pending);
          }
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(records, new _M0TP27mik1e806dxfkit9RawRecord(section, kind, pending));
          if (kind === "ENDSEC") {
            section = "";
          }
          pending = [];
        }
        if (tag.code === 0) {
          kind = _M0MP27mik1e806dxfkit8TagValue10as__string(tag.value);
        }
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(pending, tag);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (pending.length > 0) {
      if (kind === "SECTION") {
        section = _M0FP27mik1e806dxfkit18raw__section__name(pending);
      }
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(records, new _M0TP27mik1e806dxfkit9RawRecord(section, kind, pending));
    }
    return records;
  }
  function _M0FP27mik1e806dxfkit14build__drawing(scan) {
    if (scan.tags.length > _M0MP27mik1e806dxfkit10ReadLimits7defaultN6recordS5840.max_tags) {
      return new _M0TP27mik1e806dxfkit7Drawing("", [], ["手工TagScan超过tag资源上限；检查不完整"]);
    }
    return _M0FP27mik1e806dxfkit19build__drawing__raw(scan, _M0FP27mik1e806dxfkit12raw__records(scan.tags));
  }
  function _M0MP27mik1e806dxfkit9TagStream11stop__limit(self, reason) {
    if (self.limited) {
      return undefined;
    }
    self.limited = true;
    self.line = [];
    const _p = self.limits.max_warnings;
    const _p$2 = 1;
    const cap = _p > _p$2 ? _p : _p$2;
    if (self.warn.length >= cap) {
      _M0MPC15array5Array3popGRPC14json10WriteFrameE(self.warn);
    }
    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(self.warn, `读取资源上限：${reason}；读取/检查不完整`);
  }
  function _M0FP27mik1e806dxfkit17make__tag__stream(limits, decoder) {
    const stream = new _M0TP27mik1e806dxfkit9TagStream([], [], 0, undefined, [], undefined, false, false, false, limits, decoder, 0, 0, 0, false);
    if (limits.max_file_bytes <= 0 || (limits.max_line_bytes <= 0 || (limits.max_tags <= 0 || (limits.max_records <= 0 || (limits.max_warnings <= 0 || limits.max_string_bytes <= 0))))) {
      _M0MP27mik1e806dxfkit9TagStream11stop__limit(stream, "读取预算必须为正整数");
    }
    return stream;
  }
  function _M0MP27mik1e806dxfkit9TagStream12with__limits(limits) {
    return _M0FP27mik1e806dxfkit17make__tag__stream(limits, undefined);
  }
  function _M0MP27mik1e806dxfkit9TagStream7warning(self, message) {
    if (self.warn.length >= self.limits.max_warnings) {
      _M0MP27mik1e806dxfkit9TagStream11stop__limit(self, "警告数量");
      return;
    } else {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(self.warn, message);
      return;
    }
  }
  function _M0FP27mik1e806dxfkit21parse__codepage__name(name) {
    if (name === "ANSI_1252") {
      return _M0DTP27mik1e806dxfkit8Encoding6Cp1252__;
    } else {
      if (_M0MPC16string6String11has__prefix(name, new _M0TPC16string10StringView(_M0FP27mik1e806dxfkit21parse__codepage__nameN7_2abindS3683, 0, _M0FP27mik1e806dxfkit21parse__codepage__nameN7_2abindS3683.length))) {
        const digits = _M0MPC16string10StringView9to__owned(_M0MPC16string6String21clamped__view_2einner(name, 5, undefined));
        let n;
        let _try_err;
        _L: {
          _L$2: {
            const _bind = _M0FPC28internal7strconv13parse__double(new _M0TPC16string10StringView(digits, 0, digits.length));
            if (_bind.$tag === 1) {
              const _ok = _bind;
              n = _ok._0;
            } else {
              const _err = _bind;
              _try_err = _err._0;
              break _L$2;
            }
            break _L;
          }
          return _M0DTP27mik1e806dxfkit8Encoding6Cp1252__;
        }
        return n !== n || (n > _M0FPB18double__max__value || n < _M0FPB18double__min__value || n !== _M0MPC16double6Double5round(n)) ? _M0DTP27mik1e806dxfkit8Encoding6Cp1252__ : new _M0DTP27mik1e806dxfkit8Encoding5Other(_M0MPC16double6Double7to__int(n));
      } else {
        return _M0DTP27mik1e806dxfkit8Encoding6Cp1252__;
      }
    }
  }
  function _M0FP27mik1e806dxfkit21code__point__to__char(c) {
    const _bind = _M0MPC13int3Int8to__char(c);
    return _bind === -1 ? 65533 : _bind;
  }
  function _M0FP27mik1e806dxfkit16bytes__to__ascii(data, from, to) {
    const sb = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    let _tmp = from;
    while (true) {
      const i = _tmp;
      if (i < to) {
        const c = (i >>> 0 < data.length ? data[i] : $oob()) & 255;
        if (c > 0 && c < 128) {
          _M0IPB13StringBuilderPB6Logger11write__char(sb, _M0FP27mik1e806dxfkit21code__point__to__char(c));
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return sb.val;
  }
  function _M0FP27mik1e806dxfkit18trim__ascii__range(data, from, to) {
    let start = from;
    let stop = to;
    while (true) {
      if (start < stop) {
        const _tmp = start;
        const c = (_tmp >>> 0 < data.length ? data[_tmp] : $oob()) & 255;
        if (c === 32 || c === 9) {
          start = start + 1 | 0;
        } else {
          break;
        }
        continue;
      } else {
        break;
      }
    }
    while (true) {
      if (stop > start) {
        const _tmp = stop - 1 | 0;
        const c = (_tmp >>> 0 < data.length ? data[_tmp] : $oob()) & 255;
        if (c === 32 || c === 9) {
          stop = stop - 1 | 0;
        } else {
          break;
        }
        continue;
      } else {
        break;
      }
    }
    return { _0: start, _1: stop };
  }
  function _M0FP27mik1e806dxfkit18parse__group__code(data, from, to) {
    const _bind = _M0FP27mik1e806dxfkit18trim__ascii__range(data, from, to);
    const _start = _bind._0;
    const _stop = _bind._1;
    if (_start >= _stop) {
      return undefined;
    }
    let value = 0;
    let negative = false;
    let i = _start;
    const _tmp = i;
    const _p = _tmp >>> 0 < data.length ? data[_tmp] : $oob();
    const _p$2 = 45;
    if (_p === _p$2) {
      negative = true;
      i = i + 1 | 0;
    }
    if (i >= _stop) {
      return undefined;
    }
    while (true) {
      if (i < _stop) {
        const _tmp$2 = i;
        const c = (_tmp$2 >>> 0 < data.length ? data[_tmp$2] : $oob()) & 255;
        if (c < 48 || c > 57) {
          return undefined;
        }
        if (value > 214748364 || value === 214748364 && (c - 48 | 0) > 7) {
          return undefined;
        }
        value = (Math.imul(value, 10) | 0) + (c - 48 | 0) | 0;
        i = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return negative ? -value | 0 : value;
  }
  function _M0FP27mik1e806dxfkit23probe__header__encoding(data) {
    const _p = data.length;
    const _p$2 = 1024;
    const limit = _p < _p$2 ? _p : _p$2;
    let offset = 0;
    let group = undefined;
    let awaiting_section = false;
    let in_header = false;
    let variable = "";
    let version = "";
    let codepage = "";
    while (true) {
      if (offset < limit) {
        const start = offset;
        while (true) {
          let _tmp;
          if (offset < limit) {
            let _tmp$2;
            const _tmp$3 = offset;
            if ((_tmp$3 >>> 0 < data.length ? data[_tmp$3] : $oob()) !== 10) {
              const _tmp$4 = offset;
              _tmp$2 = (_tmp$4 >>> 0 < data.length ? data[_tmp$4] : $oob()) !== 13;
            } else {
              _tmp$2 = false;
            }
            _tmp = _tmp$2;
          } else {
            _tmp = false;
          }
          if (_tmp) {
            offset = offset + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        if (offset === limit) {
          break;
        }
        const stop = offset;
        offset = offset + 1 | 0;
        let _tmp;
        const _p$3 = stop >>> 0 < data.length ? data[stop] : $oob();
        const _p$4 = 13;
        if (_p$3 === _p$4) {
          let _tmp$2;
          if (offset < limit) {
            const _tmp$3 = offset;
            const _p$5 = _tmp$3 >>> 0 < data.length ? data[_tmp$3] : $oob();
            const _p$6 = 10;
            _tmp$2 = _p$5 === _p$6;
          } else {
            _tmp$2 = false;
          }
          _tmp = _tmp$2;
        } else {
          _tmp = false;
        }
        if (_tmp) {
          offset = offset + 1 | 0;
        }
        const _bind = group;
        if (_bind === undefined) {
          group = _M0FP27mik1e806dxfkit18parse__group__code(data, start, stop);
        } else {
          const _Some = _bind;
          const _code = _Some;
          group = undefined;
          if (_code === 999) {
            continue;
          }
          const _bind$2 = _M0FP27mik1e806dxfkit18trim__ascii__range(data, start, stop);
          const _from = _bind$2._0;
          const _to = _bind$2._1;
          const value = _M0FP27mik1e806dxfkit16bytes__to__ascii(data, _from, _to);
          if (_code === 0) {
            if (in_header) {
              break;
            }
            awaiting_section = value === "SECTION";
          } else {
            if (_code === 2 && awaiting_section) {
              in_header = value === "HEADER";
              awaiting_section = false;
            } else {
              if (in_header) {
                if (_code === 9) {
                  variable = value;
                } else {
                  if (variable === "$ACADVER" && (_code === 1 && version === "")) {
                    version = value;
                  } else {
                    if (variable === "$DWGCODEPAGE" && (_code === 3 && codepage === "")) {
                      codepage = value;
                    }
                  }
                  variable = "";
                }
              }
            }
          }
        }
        continue;
      } else {
        break;
      }
    }
    return { _0: version, _1: codepage };
  }
  function _M0FP27mik1e806dxfkit9utf8__bom(data) {
    if (data.length >= 3) {
      let _tmp;
      const _p = 0 >>> 0 < data.length ? data[0] : $oob();
      const _p$2 = 239;
      if (_p === _p$2) {
        let _tmp$2;
        const _p$3 = 1 >>> 0 < data.length ? data[1] : $oob();
        const _p$4 = 187;
        if (_p$3 === _p$4) {
          const _p$5 = 2 >>> 0 < data.length ? data[2] : $oob();
          const _p$6 = 191;
          _tmp$2 = _p$5 === _p$6;
        } else {
          _tmp$2 = false;
        }
        _tmp = _tmp$2;
      } else {
        _tmp = false;
      }
      return _tmp;
    } else {
      return false;
    }
  }
  function _M0FP27mik1e806dxfkit16decide__encoding(data) {
    if (_M0FP27mik1e806dxfkit9utf8__bom(data)) {
      return _M0DTP27mik1e806dxfkit8Encoding4Utf8__;
    }
    const _bind = _M0FP27mik1e806dxfkit23probe__header__encoding(data);
    const _version = _bind._0;
    const _codepage = _bind._1;
    return _M0IP016_24default__implPB7Compare6op__geGsE(_version, "AC1021") ? _M0DTP27mik1e806dxfkit8Encoding4Utf8__ : _version === "" || _codepage === "" ? _M0DTP27mik1e806dxfkit8Encoding6Cp1252__ : _M0FP27mik1e806dxfkit21parse__codepage__name(_codepage);
  }
  function _M0MP27mik1e806dxfkit8Encoding12is__fallback(self) {
    if (self.$tag === 2) {
      const _Other = self;
      const _x = _Other._0;
      if (_x === 936) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  function _M0MP27mik1e806dxfkit8Encoding11to__display(self) {
    switch (self.$tag) {
      case 0: {
        return "UTF-8";
      }
      case 1: {
        return "CP1252（西欧）";
      }
      default: {
        const _Other = self;
        const _x = _Other._0;
        if (_x === 936) {
          return "ANSI_936（GBK）";
        } else {
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(10);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "代码页 ");
          _M0MPB13StringBuilder13write__objectGiE(_string_builder, _x);
          return _string_builder.val;
        }
      }
    }
  }
  function _M0FP27mik1e806dxfkit11decode__gbk(data) {
    const out = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    let valid = true;
    let i = 0;
    while (true) {
      if (i < data.length) {
        const _tmp = i;
        const lead = _tmp >>> 0 < data.length ? data[_tmp] : $oob();
        i = i + 1 | 0;
        if (lead < 128) {
          _M0IPB13StringBuilderPB6Logger11write__char(out, _M0FP27mik1e806dxfkit21code__point__to__char(lead));
        } else {
          if (lead === 128) {
            _M0IPB13StringBuilderPB6Logger11write__char(out, 8364);
          } else {
            if (lead >= 129 && (lead <= 254 && i < data.length)) {
              const _tmp$2 = i;
              const trail = _tmp$2 >>> 0 < data.length ? data[_tmp$2] : $oob();
              if (trail >= 64 && (trail <= 254 && trail !== 127)) {
                const column = trail - (trail < 127 ? 64 : 65) | 0;
                const _tmp$3 = lead - 129 | 0;
                const _tmp$4 = _tmp$3 >>> 0 < _M0FP27mik1e806dxfkit9gbk__rows.length ? _M0FP27mik1e806dxfkit9gbk__rows[_tmp$3] : $oob();
                const value = column >>> 0 < _tmp$4.length ? _tmp$4.charCodeAt(column) : $oob();
                _M0IPB13StringBuilderPB6Logger11write__char(out, _M0FP27mik1e806dxfkit21code__point__to__char(value));
                i = i + 1 | 0;
                continue;
              }
            }
            valid = false;
            _M0IPB13StringBuilderPB6Logger11write__char(out, 65533);
          }
        }
        continue;
      } else {
        break;
      }
    }
    return { _0: out.val, _1: valid };
  }
  function _M0FP27mik1e806dxfkit12cp1252__high(b) {
    const table = [8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, 157, 382, 376];
    const idx = b - 128 | 0;
    return idx >= 0 && idx < table.length ? _M0FP27mik1e806dxfkit21code__point__to__char(_M0MPC15array5Array2atGiE(table, idx)) : _M0FP27mik1e806dxfkit21code__point__to__char(b);
  }
  function _M0FP27mik1e806dxfkit14decode__cp1252(data) {
    const sb = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < data.length) {
        const b = (i >>> 0 < data.length ? data[i] : $oob()) & 255;
        if (b >= 128 && b <= 159) {
          _M0IPB13StringBuilderPB6Logger11write__char(sb, _M0FP27mik1e806dxfkit12cp1252__high(b));
        } else {
          _M0IPB13StringBuilderPB6Logger11write__char(sb, _M0FP27mik1e806dxfkit21code__point__to__char(b));
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return sb.val;
  }
  function _M0FP27mik1e806dxfkit14decode__latin1(data) {
    const sb = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    let _tmp = 0;
    while (true) {
      const i = _tmp;
      if (i < data.length) {
        _M0IPB13StringBuilderPB6Logger11write__char(sb, _M0FP27mik1e806dxfkit21code__point__to__char((i >>> 0 < data.length ? data[i] : $oob()) & 255));
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return sb.val;
  }
  function _M0FP27mik1e806dxfkit12decode__text(data, enc) {
    switch (enc.$tag) {
      case 0: {
        return _M0FPC28encoding4utf821decode__lossy_2einner(new _M0TPC15bytes9BytesView(data, 0, data.length), false);
      }
      case 1: {
        return _M0FP27mik1e806dxfkit14decode__cp1252(data);
      }
      default: {
        const _Other = enc;
        const _x = _Other._0;
        if (_x === 936) {
          return _M0FP27mik1e806dxfkit11decode__gbk(data)._0;
        } else {
          return _M0FP27mik1e806dxfkit14decode__latin1(data);
        }
      }
    }
  }
  function _M0FP27mik1e806dxfkit15line__is__blank(data, from, to) {
    let _tmp = from;
    while (true) {
      const i = _tmp;
      if (i < to) {
        const c = (i >>> 0 < data.length ? data[i] : $oob()) & 255;
        if (c !== 32 && c !== 9) {
          return false;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return true;
  }
  function _M0FP27mik1e806dxfkit12slice__range(data, from, to) {
    const out = [];
    let _tmp = from;
    while (true) {
      const i = _tmp;
      if (i < to) {
        _M0MPC15array5Array4pushGyE(out, i >>> 0 < data.length ? data[i] : $oob());
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return _M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(out, 0, out.length));
  }
  function _M0FP27mik1e806dxfkit12parse__value(code, data, from, to, encoding) {
    const kind = _M0FP27mik1e806dxfkit10code__type(code);
    _L: {
      _L$2: {
        if (kind === 0) {
          break _L$2;
        } else {
          if (kind === 6) {
            break _L$2;
          }
        }
        break _L;
      }
      return new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(new _M0DTP27mik1e806dxfkit8TagValue3Str(_M0FP27mik1e806dxfkit12decode__text(_M0FP27mik1e806dxfkit12slice__range(data, from, to), encoding)));
    }
    const _bind = _M0FP27mik1e806dxfkit18trim__ascii__range(data, from, to);
    const _start = _bind._0;
    const _stop = _bind._1;
    let _tmp = _start;
    while (true) {
      const i = _tmp;
      if (i < _stop) {
        const byte = i >>> 0 < data.length ? data[i] : $oob();
        if (byte === 0 || byte >= 128) {
          return _M0FP27mik1e806dxfkit12parse__valueN6constrS5841;
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const text = _M0FP27mik1e806dxfkit16bytes__to__ascii(data, _start, _stop);
    _L$2: {
      _L$3: {
        switch (kind) {
          case 4: {
            let value;
            let _try_err;
            _L$4: {
              _L$5: {
                const _bind$2 = _M0FPC28internal7strconv13parse__double(new _M0TPC16string10StringView(text, 0, text.length));
                if (_bind$2.$tag === 1) {
                  const _ok = _bind$2;
                  value = _ok._0;
                } else {
                  const _err = _bind$2;
                  _try_err = _err._0;
                  break _L$5;
                }
                break _L$4;
              }
              return _M0FP27mik1e806dxfkit12parse__valueN6constrS5844;
            }
            if (!_M0FP27mik1e806dxfkit14finite__number(value)) {
              return _M0FP27mik1e806dxfkit12parse__valueN6constrS5845;
            }
            return new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(new _M0DTP27mik1e806dxfkit8TagValue3F64(value));
          }
          case 1: {
            break _L$3;
          }
          case 2: {
            break _L$3;
          }
          case 3: {
            let value$2;
            let _try_err$2;
            _L$5: {
              _L$6: {
                const _bind$2 = _M0FPC28internal7strconv20parse__int64_2einner(new _M0TPC16string10StringView(text, 0, text.length), 0);
                if (_bind$2.$tag === 1) {
                  const _ok = _bind$2;
                  value$2 = _ok._0;
                } else {
                  const _err = _bind$2;
                  _try_err$2 = _err._0;
                  break _L$6;
                }
                break _L$5;
              }
              return _M0FP27mik1e806dxfkit12parse__valueN6constrS5846;
            }
            return new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(new _M0DTP27mik1e806dxfkit8TagValue3I64(value$2));
          }
          case 5: {
            return text === "0" ? _M0FP27mik1e806dxfkit12parse__valueN6constrS5848 : text === "1" ? _M0FP27mik1e806dxfkit12parse__valueN6constrS5850 : _M0FP27mik1e806dxfkit12parse__valueN6constrS5851;
          }
          case 0: {
            break _L$2;
          }
          default: {
            break _L$2;
          }
        }
      }
      let value;
      let _try_err;
      _L$4: {
        _L$5: {
          const _bind$2 = _M0FPC28internal7strconv18parse__int_2einner(new _M0TPC16string10StringView(text, 0, text.length), 0);
          if (_bind$2.$tag === 1) {
            const _ok = _bind$2;
            value = _ok._0;
          } else {
            const _err = _bind$2;
            _try_err = _err._0;
            break _L$5;
          }
          break _L$4;
        }
        return _M0FP27mik1e806dxfkit12parse__valueN6constrS5842;
      }
      if (kind === 1) {
        _L$5: {
          _L$6: {
            if (value < -32768) {
              break _L$6;
            } else {
              if (value > 65535) {
                break _L$6;
              }
            }
            break _L$5;
          }
          return _M0FP27mik1e806dxfkit12parse__valueN6constrS5843;
        }
      }
      let _tmp$2;
      if (kind === 1) {
        _tmp$2 = new _M0DTP27mik1e806dxfkit8TagValue3I16(value);
      } else {
        _tmp$2 = new _M0DTP27mik1e806dxfkit8TagValue3I32(value);
      }
      return new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(_tmp$2);
    }
    return new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(new _M0DTP27mik1e806dxfkit8TagValue3Str(text));
  }
  function _M0FP27mik1e806dxfkit7preview(data, from, to) {
    const sb = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    const stop = (to - from | 0) > 40 ? from + 40 | 0 : to;
    let _tmp = from;
    while (true) {
      const i = _tmp;
      if (i < stop) {
        const c = (i >>> 0 < data.length ? data[i] : $oob()) & 255;
        if (c >= 32 && c < 127) {
          _M0IPB13StringBuilderPB6Logger11write__char(sb, _M0FP27mik1e806dxfkit21code__point__to__char(c));
        } else {
          _M0IPB13StringBuilderPB6Logger11write__char(sb, 63);
        }
        _tmp = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return sb.val;
  }
  function _M0MP27mik1e806dxfkit9TagStream13consume__line(self, out) {
    const _bind = self.line;
    const data = _M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(_bind, 0, _bind.length));
    self.line = [];
    self.line_no = self.line_no + 1 | 0;
    const n = data.length;
    const start = self.line_no === 1 && _M0FP27mik1e806dxfkit9utf8__bom(data) ? 3 : 0;
    const _bind$2 = self.pending;
    if (_bind$2 === undefined) {
      const _bind$3 = _M0FP27mik1e806dxfkit18parse__group__code(data, start, n);
      if (_bind$3 === undefined) {
        if (!_M0FP27mik1e806dxfkit15line__is__blank(data, 0, n)) {
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(83);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "第 ");
          _M0MPB13StringBuilder13write__objectGiE(_string_builder, self.line_no);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 行：这一行应该是组码，但读不出整数（内容：");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit7preview(data, 0, n));
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "），已跳过");
          _M0MP27mik1e806dxfkit9TagStream7warning(self, _string_builder.val);
          return;
        } else {
          return;
        }
      } else {
        const _Some = _bind$3;
        const _code = _Some;
        self.pending = _code;
        return;
      }
    } else {
      const _Some = _bind$2;
      const _code = _Some;
      if (self.tags >= self.limits.max_tags || _code === 0 && self.records >= self.limits.max_records) {
        _M0MP27mik1e806dxfkit9TagStream11stop__limit(self, "tag 或记录数量");
        return undefined;
      }
      _L: {
        _L$2: {
          const _bind$3 = _M0FP27mik1e806dxfkit10code__type(_code);
          if (_bind$3 === 0) {
            break _L$2;
          } else {
            const _bind$4 = _M0FP27mik1e806dxfkit10code__type(_code);
            if (_bind$4 === 6) {
              break _L$2;
            }
          }
          break _L;
        }
        if (n > self.limits.max_string_bytes) {
          _M0MP27mik1e806dxfkit9TagStream11stop__limit(self, "字符串字节数");
          return undefined;
        }
      }
      const _p = self.enc;
      let enc;
      if (_p === undefined) {
        enc = $panic();
      } else {
        const _p$2 = _p;
        enc = _p$2;
      }
      let parsed;
      _L$2: {
        _L$3: {
          const _bind$3 = _M0FP27mik1e806dxfkit10code__type(_code);
          if (_bind$3 === 0) {
            _L$4: {
              _L$5: {
                if (enc.$tag === 2) {
                  const _Other = enc;
                  const _x = _Other._0;
                  if (_x === 936) {
                    const _bind$4 = _M0FP27mik1e806dxfkit11decode__gbk(data);
                    const _decoded = _bind$4._0;
                    const _valid = _bind$4._1;
                    if (!_valid) {
                      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(81);
                      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "第");
                      _M0MPB13StringBuilder13write__objectGiE(_string_builder, self.line_no);
                      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "行组码");
                      _M0MPB13StringBuilder13write__objectGiE(_string_builder, _code);
                      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "：ANSI_936 字节序列无效；已用替代字符，检查不完整");
                      _M0MP27mik1e806dxfkit9TagStream7warning(self, _string_builder.val);
                    }
                    parsed = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(new _M0DTP27mik1e806dxfkit8TagValue3Str(_decoded));
                  } else {
                    break _L$5;
                  }
                } else {
                  break _L$5;
                }
                break _L$4;
              }
              break _L$3;
            }
          } else {
            break _L$3;
          }
          break _L$2;
        }
        _L$4: {
          _L$5: {
            const _bind$3 = _M0FP27mik1e806dxfkit10code__type(_code);
            if (_bind$3 === 0) {
              if (enc.$tag === 2) {
                const _Other = enc;
                const _page = _Other._0;
                const _bind$4 = self.decoder;
                if (_bind$4 === undefined) {
                  break _L$5;
                } else {
                  const _Some$2 = _bind$4;
                  const _decode = _Some$2;
                  const _bind$5 = _decode(_page, data);
                  if (_bind$5 === undefined) {
                    parsed = _M0MP27mik1e806dxfkit9TagStream13consume__lineN6constrS5853;
                  } else {
                    const _Some$3 = _bind$5;
                    const _value = _Some$3;
                    if (_M0FPC28encoding4utf814encode_2einner(new _M0TPC16string10StringView(_value, 0, _value.length), false).length > self.limits.max_string_bytes) {
                      _M0MP27mik1e806dxfkit9TagStream11stop__limit(self, "自定义解码后的字符串字节数");
                      return undefined;
                    }
                    parsed = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(new _M0DTP27mik1e806dxfkit8TagValue3Str(_value));
                  }
                }
              } else {
                break _L$5;
              }
            } else {
              break _L$5;
            }
            break _L$4;
          }
          _L$6: {
            _L$7: {
              const _bind$3 = _M0FP27mik1e806dxfkit10code__type(_code);
              if (_bind$3 === 0) {
                if (enc.$tag === 0) {
                  let _try_err;
                  _L$8: {
                    _L$9: {
                      const _bind$4 = _M0FPC28encoding4utf814decode_2einner(new _M0TPC15bytes9BytesView(data, 0, data.length), true);
                      let _tmp;
                      if (_bind$4.$tag === 1) {
                        const _ok = _bind$4;
                        _tmp = _ok._0;
                      } else {
                        const _err = _bind$4;
                        _try_err = _err._0;
                        break _L$9;
                      }
                      parsed = new _M0DTPC16result6ResultGRP27mik1e806dxfkit8TagValuesE2Ok(new _M0DTP27mik1e806dxfkit8TagValue3Str(_tmp));
                      break _L$8;
                    }
                    parsed = _M0MP27mik1e806dxfkit9TagStream13consume__lineN6constrS5852;
                  }
                } else {
                  break _L$7;
                }
              } else {
                break _L$7;
              }
              break _L$6;
            }
            parsed = _M0FP27mik1e806dxfkit12parse__value(_code, data, 0, n, enc);
          }
        }
      }
      let value;
      if (parsed.$tag === 1) {
        const _Ok = parsed;
        value = _Ok._0;
      } else {
        const _Err = parsed;
        const _msg = _Err._0;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(54);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "第");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, self.line_no);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "行组码");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, _code);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "：");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _msg);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "；保留原文，几何结果需复核");
        _M0MP27mik1e806dxfkit9TagStream7warning(self, _string_builder.val);
        value = new _M0DTP27mik1e806dxfkit8TagValue3Str(_M0FP27mik1e806dxfkit12decode__text(data, enc));
      }
      if (self.limited) {
        return undefined;
      }
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(out, _M0MP27mik1e806dxfkit3Tag3new(_code, value));
      self.tags = self.tags + 1 | 0;
      if (_code === 0) {
        self.records = self.records + 1 | 0;
      }
      self.pending = undefined;
      if (_code === 0 && _M0MP27mik1e806dxfkit8TagValue10as__string(value) === "EOF") {
        self.eof_seen = true;
        return;
      } else {
        return;
      }
    }
  }
  function _M0MP27mik1e806dxfkit9TagStream13consume__byte(self, byte, out) {
    if (self.skip_lf) {
      self.skip_lf = false;
      const _p = 10;
      if (byte === _p) {
        return undefined;
      }
    }
    let _tmp;
    const _p = 13;
    if (byte === _p) {
      _tmp = true;
    } else {
      const _p$2 = 10;
      _tmp = byte === _p$2;
    }
    if (_tmp) {
      const _p$2 = 13;
      self.skip_lf = byte === _p$2;
      _M0MP27mik1e806dxfkit9TagStream13consume__line(self, out);
      return;
    } else {
      if (self.line.length >= self.limits.max_line_bytes) {
        _M0MP27mik1e806dxfkit9TagStream11stop__limit(self, "单行字节数");
        return;
      } else {
        _M0MPC15array5Array4pushGyE(self.line, byte);
        return;
      }
    }
  }
  function _M0MP27mik1e806dxfkit9TagStream16choose__encoding(self, out) {
    const _bind = self.prefix;
    const enc = _M0FP27mik1e806dxfkit16decide__encoding(_M0MPC15bytes5Bytes11from__array(new _M0TPB9ArrayViewGyE(_bind, 0, _bind.length)));
    self.enc = enc;
    if (_M0MP27mik1e806dxfkit8Encoding12is__fallback(enc)) {
      const _bind$2 = self.decoder;
      if (_bind$2 === undefined) {
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(55);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "未支持的");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0MP27mik1e806dxfkit8Encoding11to__display(enc));
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "按Latin-1降级解码；文字可能失真");
        _M0MP27mik1e806dxfkit9TagStream7warning(self, _string_builder.val);
      }
    }
    const _bind$2 = self.prefix;
    const _bind$3 = _bind$2.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$3) {
        const byte = _bind$2[_];
        if (self.eof_seen || self.limited) {
          break;
        }
        _M0MP27mik1e806dxfkit9TagStream13consume__byte(self, byte, out);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    _M0MPC15array5Array5clearGyE(self.prefix);
  }
  function _M0MP27mik1e806dxfkit9TagStream4feed(self, chunk) {
    const out = [];
    if (self.finished || (self.eof_seen || self.limited)) {
      return out;
    }
    if (chunk.length > (self.limits.max_file_bytes - self.bytes | 0)) {
      _M0MP27mik1e806dxfkit9TagStream11stop__limit(self, "文件字节数");
      return out;
    }
    self.bytes = self.bytes + chunk.length | 0;
    const _bind = chunk.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const byte = chunk[_];
        if (self.eof_seen || self.limited) {
          break;
        }
        const _bind$2 = self.enc;
        if (_bind$2 === undefined) {
          _M0MPC15array5Array4pushGyE(self.prefix, byte);
          if (self.prefix.length === 1024) {
            _M0MP27mik1e806dxfkit9TagStream16choose__encoding(self, out);
          }
        } else {
          _M0MP27mik1e806dxfkit9TagStream13consume__byte(self, byte, out);
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return out;
  }
  function _M0MP27mik1e806dxfkit9TagStream6finish(self) {
    const out = [];
    if (self.finished) {
      return out;
    }
    self.finished = true;
    const _bind = self.enc;
    if (_bind === undefined) {
      _M0MP27mik1e806dxfkit9TagStream16choose__encoding(self, out);
    }
    if (self.eof_seen || self.limited) {
      return out;
    }
    if (self.line.length > 0) {
      _M0MP27mik1e806dxfkit9TagStream13consume__line(self, out);
    }
    if (!self.limited) {
      const _bind$2 = self.pending;
      if (_bind$2 === undefined) {
      } else {
        const _Some = _bind$2;
        const _code = _Some;
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(89);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "文件在最后一行截断了：组码 ");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, _code);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 后面没有值（可能是文件被切断了）");
        _M0MP27mik1e806dxfkit9TagStream7warning(self, _string_builder.val);
      }
    }
    return out;
  }
  function _M0MP27mik1e806dxfkit9TagStream8warnings(self) {
    return _M0MPC15array5Array4copyGsE(self.warn);
  }
  function _M0MP27mik1e806dxfkit6Report23has__incomplete__checks(self) {
    const _p = self.findings;
    const _p$2 = _p.length;
    let _tmp = 0;
    while (true) {
      const _p$3 = _tmp;
      if (_p$3 < _p$2) {
        const _p$4 = _p[_p$3];
        const _p$5 = _p$4.check;
        let _tmp$2;
        switch (_p$5) {
          case "解析": {
            _tmp$2 = true;
            break;
          }
          case "检查覆盖": {
            _tmp$2 = true;
            break;
          }
          case "文字未转曲线": {
            _tmp$2 = true;
            break;
          }
          case "参数": {
            _tmp$2 = true;
            break;
          }
          default: {
            _tmp$2 = false;
          }
        }
        if (_tmp$2) {
          return true;
        }
        _tmp = _p$3 + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return false;
  }
  function _M0FP27mik1e806dxfkit4bump(counts, key) {
    let i = 0;
    while (true) {
      if (i < counts.length) {
        if (_M0MPC15array5Array2atGRPB4JsonE(counts, i)._0 === key) {
          _M0MPC15array5Array3setGsE(counts, i, { _0: key, _1: _M0MPC15array5Array2atGRPB4JsonE(counts, i)._1 + 1 | 0 });
          return undefined;
        }
        i = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    _M0MPC15array5Array4pushGRPC14json10WriteFrameE(counts, { _0: key, _1: 1 });
  }
  function _M0FP27mik1e806dxfkit14topology__root(parent, i) {
    let root = i;
    while (true) {
      if (_M0MPC15array5Array2atGiE(parent, root) !== root) {
        root = _M0MPC15array5Array2atGiE(parent, root);
        continue;
      } else {
        break;
      }
    }
    let n = i;
    while (true) {
      if (_M0MPC15array5Array2atGiE(parent, n) !== n) {
        const next = _M0MPC15array5Array2atGiE(parent, n);
        _M0MPC15array5Array3setGiE(parent, n, root);
        n = next;
        continue;
      } else {
        break;
      }
    }
    return root;
  }
  function _M0FP27mik1e806dxfkit15topology__union(parent, a, b) {
    const x = _M0FP27mik1e806dxfkit14topology__root(parent, a);
    const y = _M0FP27mik1e806dxfkit14topology__root(parent, b);
    if (x !== y) {
      _M0MPC15array5Array3setGiE(parent, x, y);
      return;
    } else {
      return;
    }
  }
  function _M0MP27mik1e806dxfkit9CheckWork5spend(self) {
    if (self.remaining <= 0) {
      self.stopped = true;
      return false;
    }
    self.remaining = self.remaining - 1 | 0;
    return true;
  }
  function _M0FP27mik1e806dxfkit18endpoint__topology(edges, tol, work) {
    const points = [];
    const _bind = edges.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const edge = edges[_];
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, edge._0);
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(points, edge._1);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _p = points.length;
    let parent;
    if (_p <= 0) {
      parent = [];
    } else {
      const _p$2 = new Array(_p);
      let _tmp$2 = 0;
      while (true) {
        const _p$3 = _tmp$2;
        if (_p$3 < _p) {
          _p$2[_p$3] = _p$3;
          _tmp$2 = _p$3 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      parent = _p$2;
    }
    const _p$2 = points.length;
    let order;
    if (_p$2 <= 0) {
      order = [];
    } else {
      const _p$3 = new Array(_p$2);
      let _tmp$2 = 0;
      while (true) {
        const _p$4 = _tmp$2;
        if (_p$4 < _p$2) {
          _p$3[_p$4] = _p$4;
          _tmp$2 = _p$4 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      order = _p$3;
    }
    let vertical;
    if (points.length > 0) {
      let _tmp$2;
      let _p$3;
      _L: {
        _L$2: {
          const _p$4 = points.length;
          let _tmp$3 = 0;
          while (true) {
            const _p$5 = _tmp$3;
            if (_p$5 < _p$4) {
              const _p$6 = points[_p$5];
              if (!(_p$6.x === _M0MPC15array5Array2atGRPB4JsonE(points, 0).x)) {
                _p$3 = false;
                break _L$2;
              }
              _tmp$3 = _p$5 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _tmp$2 = true;
          break _L;
        }
        _tmp$2 = _p$3;
      }
      vertical = _tmp$2;
    } else {
      vertical = false;
    }
    const _env = { _0: vertical, _1: points };
    _M0MPC15array5Array8sort__byGiE(order, (a, b) => {
      const _p$3 = _env._1;
      const _p$4 = _env._0;
      const _tmp$2 = _p$4 ? _M0MPC15array5Array2atGRPB4JsonE(_p$3, a).y : _M0MPC15array5Array2atGRPB4JsonE(_p$3, a).x;
      const _p$5 = _env._1;
      const _p$6 = _env._0;
      if (_tmp$2 < (_p$6 ? _M0MPC15array5Array2atGRPB4JsonE(_p$5, b).y : _M0MPC15array5Array2atGRPB4JsonE(_p$5, b).x)) {
        return -1;
      } else {
        const _p$7 = _env._1;
        const _p$8 = _env._0;
        const _tmp$3 = _p$8 ? _M0MPC15array5Array2atGRPB4JsonE(_p$7, a).y : _M0MPC15array5Array2atGRPB4JsonE(_p$7, a).x;
        const _p$9 = _env._1;
        const _p$10 = _env._0;
        if (_tmp$3 > (_p$10 ? _M0MPC15array5Array2atGRPB4JsonE(_p$9, b).y : _M0MPC15array5Array2atGRPB4JsonE(_p$9, b).x)) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    let _tmp$2 = 0;
    while (true) {
      const at = _tmp$2;
      if (at < order.length) {
        const i = _M0MPC15array5Array2atGiE(order, at);
        let next = at + 1 | 0;
        while (true) {
          let _tmp$3;
          if (next < order.length) {
            const _p$3 = _M0MPC15array5Array2atGiE(order, next);
            const _p$4 = _env._1;
            const _p$5 = _env._0;
            const _tmp$4 = _p$5 ? _M0MPC15array5Array2atGRPB4JsonE(_p$4, _p$3).y : _M0MPC15array5Array2atGRPB4JsonE(_p$4, _p$3).x;
            const _p$6 = _env._1;
            const _p$7 = _env._0;
            _tmp$3 = _tmp$4 - (_p$7 ? _M0MPC15array5Array2atGRPB4JsonE(_p$6, i).y : _M0MPC15array5Array2atGRPB4JsonE(_p$6, i).x) <= tol;
          } else {
            _tmp$3 = false;
          }
          if (_tmp$3) {
            if (!_M0MP27mik1e806dxfkit9CheckWork5spend(work)) {
              return { _0: 0, _1: 0, _2: _M0MP27mik1e806dxfkit4Vec24zeroN6recordS5791, _3: false };
            }
            const j = _M0MPC15array5Array2atGiE(order, next);
            if (_M0MP27mik1e806dxfkit4Vec28distance(_M0MPC15array5Array2atGRPB4JsonE(points, i), _M0MPC15array5Array2atGRPB4JsonE(points, j)) <= tol) {
              _M0FP27mik1e806dxfkit15topology__union(parent, i, j);
            }
            next = next + 1 | 0;
            continue;
          } else {
            break;
          }
        }
        _tmp$2 = at + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const degree = _M0MPC15array5Array4makeGiE(points.length, 0);
    let _tmp$3 = 0;
    while (true) {
      const i = _tmp$3;
      if (i < points.length) {
        const _index_4 = _M0FP27mik1e806dxfkit14topology__root(parent, i);
        _M0MPC15array5Array3setGiE(degree, _index_4, _M0MPC15array5Array2atGiE(degree, _index_4) + 1 | 0);
        _tmp$3 = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _p$3 = points.length;
    let components;
    if (_p$3 <= 0) {
      components = [];
    } else {
      const _p$4 = new Array(_p$3);
      let _tmp$4 = 0;
      while (true) {
        const _p$5 = _tmp$4;
        if (_p$5 < _p$3) {
          _p$4[_p$5] = _p$5;
          _tmp$4 = _p$5 + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      components = _p$4;
    }
    let _tmp$4 = 0;
    while (true) {
      const i = _tmp$4;
      if (i < edges.length) {
        _M0FP27mik1e806dxfkit15topology__union(components, _M0FP27mik1e806dxfkit14topology__root(parent, Math.imul(i, 2) | 0), _M0FP27mik1e806dxfkit14topology__root(parent, (Math.imul(i, 2) | 0) + 1 | 0));
        _tmp$4 = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$2 = [];
    const ends = _M0MPB3Map3MapGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(new _M0TPB9ArrayViewGUiRPB5ArrayGRP27mik1e806dxfkit4Vec2EEE(_bind$2, 0, 0), undefined);
    let branched = false;
    let _tmp$5 = 0;
    while (true) {
      const i = _tmp$5;
      if (i < points.length) {
        if (_M0MPC15array5Array2atGiE(degree, i) > 0 && _M0MPC15array5Array2atGiE(degree, i) !== 2) {
          if (_M0MPC15array5Array2atGiE(degree, i) > 2) {
            branched = true;
          }
          const component = _M0FP27mik1e806dxfkit14topology__root(components, i);
          const _bind$3 = _M0MPB3Map3getGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(ends, component);
          if (_bind$3.$tag === 1) {
            const _Some = _bind$3;
            const _group = _Some._0;
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_group, _M0MPC15array5Array2atGRPB4JsonE(points, i));
          } else {
            _M0MPB3Map3setGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(ends, component, [_M0MPC15array5Array2atGRPB4JsonE(points, i)]);
          }
        }
        _tmp$5 = i + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    let worst = 0;
    let at = _M0MP27mik1e806dxfkit4Vec24zeroN6recordS5791;
    const _it = _M0MPB3Map6valuesGiRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(ends);
    while (true) {
      const _bind$3 = _M0MPB4Iter4nextGRPB5ArrayGRP27mik1e806dxfkit4Vec2EE(_it);
      if (_bind$3.$tag === 1) {
        const _Some = _bind$3;
        const _group = _Some._0;
        if (_group.length >= 2) {
          const gap = _M0MP27mik1e806dxfkit4Vec28distance(_M0MPC15array5Array2atGRPB4JsonE(_group, 0), _M0MPC15array5Array2atGRPB4JsonE(_group, 1));
          if (gap > worst) {
            worst = gap;
            at = _M0MPC15array5Array2atGRPB4JsonE(_group, 0);
          }
        }
        continue;
      } else {
        break;
      }
    }
    return { _0: ends.size, _1: worst, _2: at, _3: branched };
  }
  function _M0FP27mik1e806dxfkit16is__uncut__layer(tables, name) {
    if (tables === undefined) {
      return false;
    } else {
      const _Some = tables;
      const _t = _Some;
      const _bind = _M0MP27mik1e806dxfkit6Tables5layer(_t, name);
      if (_bind === undefined) {
        return false;
      } else {
        const _Some$2 = _bind;
        const _l = _Some$2;
        return !_M0MP27mik1e806dxfkit5Layer24is__enabled__for__checks(_l);
      }
    }
  }
  function _M0FP27mik1e806dxfkit14check__closure(placed, tables, tol, findings, work) {
    const _bind = [];
    const by_layer = _M0MPB3Map3MapGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(new _M0TPB9ArrayViewGUsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEEE(_bind, 0, 0), undefined);
    const names = [];
    const _bind$2 = placed.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const p = placed[_];
        _L: {
          _L$2: {
            const _bind$3 = p.flat;
            if (_bind$3.$tag === 0) {
              const _Outline = _bind$3;
              const _points = _Outline._0;
              const _x = _Outline._1;
              if (_x === false) {
                if (_points.length >= 2) {
                  if (!_M0FP27mik1e806dxfkit16is__uncut__layer(tables, p.layer)) {
                    const edge = { _0: _M0MPC15array5Array2atGRPB4JsonE(_points, 0), _1: _M0MPC15array5Array2atGRPB4JsonE(_points, _points.length - 1 | 0) };
                    const _bind$4 = _M0MPB3Map3getGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(by_layer, p.layer);
                    if (_bind$4.$tag === 1) {
                      const _Some = _bind$4;
                      const _edges = _Some._0;
                      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(_edges, edge);
                    } else {
                      _M0MPB3Map3setGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(by_layer, p.layer, [edge]);
                      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(names, p.layer);
                    }
                  }
                }
              } else {
                break _L$2;
              }
            } else {
              break _L$2;
            }
            break _L;
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$3 = names.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$3) {
        const layer = names[_];
        const edges = _M0MPB3Map2atGsRPB5ArrayGURP27mik1e806dxfkit4Vec2RP27mik1e806dxfkit4Vec2EEE(by_layer, layer);
        const _bind$4 = _M0FP27mik1e806dxfkit18endpoint__topology(edges, tol, work);
        const _open_count = _bind$4._0;
        const _worst_gap = _bind$4._1;
        const _at = _bind$4._2;
        const _branched = _bind$4._3;
        if (work.stopped) {
          return undefined;
        }
        if (_branched) {
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(75);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, layer);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」存在分叉或多重端点连接；不能视为普通闭合环");
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("轮廓连接", 1, _string_builder.val));
        }
        if (_open_count > 0) {
          const description = _branched ? "非简单闭合环的连通分量（开放或分叉）" : "轮廓没闭合";
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(152);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, layer);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」上有 ");
          _M0MPB13StringBuilder13write__objectGiE(_string_builder, _open_count);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 处");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, description);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "——端点间距样本 ");
          _M0MPB13StringBuilder13write__objectGdE(_string_builder, _worst_gap);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "（(");
          _M0MPB13StringBuilder13write__objectGdE(_string_builder, _at.x);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", ");
          _M0MPB13StringBuilder13write__objectGdE(_string_builder, _at.y);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ") 附近）；若用于封闭区域切割，请确认端点连接；开放刀路需按工艺判断");
          _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("轮廓闭合", 1, _string_builder.val));
        }
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FP27mik1e806dxfkit14adjacent__segs(s, t) {
    const d = s.seg > t.seg ? s.seg - t.seg | 0 : t.seg - s.seg | 0;
    if (d === 1) {
      return true;
    }
    return s.closed && d === (s.count - 1 | 0);
  }
  function _M0FP27mik1e806dxfkit15overlap__length(a1, a2, b1, b2, tol) {
    const dir = _M0MP27mik1e806dxfkit4Vec23sub(a2, a1);
    const len = _M0MP27mik1e806dxfkit4Vec26length(dir);
    if (len <= tol) {
      return 0;
    }
    const unit = _M0MP27mik1e806dxfkit4Vec25scale(dir, 1 / len);
    const normal = _M0MP27mik1e806dxfkit4Vec24perp(unit);
    let _tmp;
    const _p = _M0MP27mik1e806dxfkit4Vec23sub(b1, a1);
    if (Math.abs(_p.x * normal.x + _p.y * normal.y) > tol) {
      _tmp = true;
    } else {
      const _p$2 = _M0MP27mik1e806dxfkit4Vec23sub(b2, a1);
      _tmp = Math.abs(_p$2.x * normal.x + _p$2.y * normal.y) > tol;
    }
    if (_tmp) {
      return 0;
    }
    const _p$2 = _M0MP27mik1e806dxfkit4Vec23sub(b1, a1);
    const t1 = _p$2.x * unit.x + _p$2.y * unit.y;
    const _p$3 = _M0MP27mik1e806dxfkit4Vec23sub(b2, a1);
    const t2 = _p$3.x * unit.x + _p$3.y * unit.y;
    const over = _M0MPC16double6Double3min(_M0MPC16double6Double3max(t1, t2), len) - _M0MPC16double6Double3max(_M0MPC16double6Double3min(t1, t2), 0);
    return over < 0 ? 0 : over;
  }
  function _M0FP27mik1e806dxfkit6orient(a, b, c) {
    const _p = _M0MP27mik1e806dxfkit4Vec23sub(b, a);
    const _p$2 = _M0MP27mik1e806dxfkit4Vec23sub(c, a);
    return _p.x * _p$2.y - _p.y * _p$2.x;
  }
  function _M0FP27mik1e806dxfkit13proper__cross(a1, a2, b1, b2, tol) {
    if (_M0FP27mik1e806dxfkit17dist__to__segment(a1, b1, b2) <= tol || (_M0FP27mik1e806dxfkit17dist__to__segment(a2, b1, b2) <= tol || (_M0FP27mik1e806dxfkit17dist__to__segment(b1, a1, a2) <= tol || _M0FP27mik1e806dxfkit17dist__to__segment(b2, a1, a2) <= tol))) {
      return false;
    }
    const d1 = _M0FP27mik1e806dxfkit6orient(a1, a2, b1);
    const d2 = _M0FP27mik1e806dxfkit6orient(a1, a2, b2);
    const d3 = _M0FP27mik1e806dxfkit6orient(b1, b2, a1);
    const d4 = _M0FP27mik1e806dxfkit6orient(b1, b2, a2);
    return (d1 > 0 && d2 < 0 || d1 < 0 && d2 > 0) && (d3 > 0 && d4 < 0 || d3 < 0 && d4 > 0);
  }
  function _M0FP27mik1e806dxfkit16check__crossings(layers, tol, findings, work) {
    const _bind = layers.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const _foreach_element = layers[_];
        const _layer = _foreach_element._0;
        const _segs = _foreach_element._1;
        _L: {
          if (_segs.length < 2) {
            break _L;
          }
          const _bind$2 = [];
          const self_crossed = _M0MPB3Map3MapGibE(new _M0TPB9ArrayViewGUibEE(_bind$2, 0, 0), undefined);
          let dup_pairs = 0;
          let dup_len = 0;
          let dup_at = _M0MP27mik1e806dxfkit4Vec24zeroN6recordS5791;
          let dup_has = false;
          let i = 0;
          while (true) {
            if (i < _segs.length) {
              const s = _M0MPC15array5Array2atGRPB4JsonE(_segs, i);
              let j = i + 1 | 0;
              while (true) {
                if (j < _segs.length && _M0MPC15array5Array2atGRPB4JsonE(_segs, j).min_x <= s.max_x + tol) {
                  if (!_M0MP27mik1e806dxfkit9CheckWork5spend(work)) {
                    return undefined;
                  }
                  const t = _M0MPC15array5Array2atGRPB4JsonE(_segs, j);
                  if (!(t.min_y > s.max_y + tol || s.min_y > t.max_y + tol)) {
                    if (!(s.owner === t.owner && _M0FP27mik1e806dxfkit14adjacent__segs(s, t))) {
                      if (s.owner === t.owner && _M0FP27mik1e806dxfkit13proper__cross(s.a, s.b, t.a, t.b, tol)) {
                        _M0MPB3Map3setGibE(self_crossed, s.owner, true);
                      }
                      const over = _M0FP27mik1e806dxfkit15overlap__length(s.a, s.b, t.a, t.b, tol);
                      if (over > tol) {
                        dup_pairs = dup_pairs + 1 | 0;
                        dup_len = dup_len + over;
                        if (!dup_has) {
                          dup_at = s.a;
                          dup_has = true;
                        }
                      }
                    }
                  }
                  j = j + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              i = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          if (self_crossed.size > 0) {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(65);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, _layer);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」有 ");
            _M0MPB13StringBuilder13write__objectGiE(_string_builder, self_crossed.size);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 条轮廓自相交，请确认是否符合设计");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("自相交", 1, _string_builder.val));
          }
          if (dup_pairs > 0) {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(99);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, _layer);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」有 ");
            _M0MPB13StringBuilder13write__objectGiE(_string_builder, dup_pairs);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 对线段重叠（共 ");
            _M0MPB13StringBuilder13write__objectGdE(_string_builder, dup_len);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 长度，(");
            _M0MPB13StringBuilder13write__objectGdE(_string_builder, dup_at.x);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", ");
            _M0MPB13StringBuilder13write__objectGdE(_string_builder, dup_at.y);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ") 附近），请确认是否存在重复路径");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("重复切割", 1, _string_builder.val));
          }
          break _L;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FP27mik1e806dxfkit9where__of(p) {
    const _p = p.entity;
    const h = _p.common.handle;
    if (h === "") {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(12);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, p.layer);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」");
      return _string_builder.val;
    } else {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(20);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, p.layer);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」句柄 ");
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, h);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " ");
      return _string_builder.val;
    }
  }
  function _M0FP27mik1e806dxfkit13check__radius(p, what, radius, findings) {
    if (radius < 0) {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(51);
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit9where__of(p));
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "的");
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, what);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "半径是负数（");
      _M0MPB13StringBuilder13write__objectGdE(_string_builder, radius);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "），需要修正几何定义");
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("退化几何", 2, _string_builder.val));
      return;
    } else {
      if (radius === 0) {
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(38);
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit9where__of(p));
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "的");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, what);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "半径是 0——退化成一个点");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("退化几何", 1, _string_builder.val));
        return;
      } else {
        return;
      }
    }
  }
  function _M0FP27mik1e806dxfkit17check__degenerate(p, findings) {
    const _bind = p.entity.geom;
    switch (_bind.$tag) {
      case 2: {
        const _Circle = _bind;
        const _radius = _Circle._1;
        _M0FP27mik1e806dxfkit13check__radius(p, "圆", _radius, findings);
        break;
      }
      case 3: {
        const _Arc = _bind;
        const _radius$2 = _Arc._1;
        _M0FP27mik1e806dxfkit13check__radius(p, "圆弧", _radius$2, findings);
        break;
      }
    }
    const _bind$2 = p.flat;
    if (_bind$2.$tag === 0) {
      const _Outline = _bind$2;
      const _points = _Outline._0;
      const _closed = _Outline._1;
      const n = _points.length;
      if (n === 0) {
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(18);
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit9where__of(p));
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "有一条空轮廓");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("退化几何", 1, _string_builder.val));
        return;
      } else {
        if (n === 1) {
          const _p = p.entity;
          const kind = _p.common.kind;
          if (!(kind === "CIRCLE" || kind === "ARC")) {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(33);
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit9where__of(p));
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "有只有一个点的轮廓（");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, kind);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "）");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("退化几何", 1, _string_builder.val));
            return;
          } else {
            return;
          }
        } else {
          const segs = _closed ? n : n - 1 | 0;
          let zeros = 0;
          let i = 0;
          while (true) {
            if (i < segs) {
              if (_M0MP27mik1e806dxfkit4Vec28distance(_M0MPC15array5Array2atGRPB4JsonE(_points, i), _M0MPC15array5Array2atGRPB4JsonE(_points, (i + 1 | 0) % n | 0)) === 0) {
                zeros = zeros + 1 | 0;
              }
              i = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          if (zeros > 0) {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(35);
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit9where__of(p));
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "的轮廓里有 ");
            _M0MPB13StringBuilder13write__objectGiE(_string_builder, zeros);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 段零长度线段");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("退化几何", 1, _string_builder.val));
            return;
          } else {
            return;
          }
        }
      }
    } else {
      return;
    }
  }
  function _M0FP27mik1e806dxfkit13check__layers(tables, placed, findings) {
    let tables$2;
    if (tables === undefined) {
      return undefined;
    } else {
      const _Some = tables;
      tables$2 = _Some;
    }
    const _bind = tables$2.layers;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const l = _bind[_];
        _L: {
          let status = "";
          if (l.color < 0) {
            status = "关闭";
          } else {
            if (l.frozen) {
              status = "冻结";
            }
          }
          if (status === "") {
            break _L;
          }
          let n = 0;
          const _bind$3 = placed.length;
          let _tmp$2 = 0;
          while (true) {
            const _$2 = _tmp$2;
            if (_$2 < _bind$3) {
              const p = placed[_$2];
              if (p.layer === l.name) {
                n = n + 1 | 0;
              }
              _tmp$2 = _$2 + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          if (n > 0) {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(153);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, l.name);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」是");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, status);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "的，上面有 ");
            _M0MPB13StringBuilder13write__objectGiE(_string_builder, n);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 条实体：本工具在部分几何检查中跳过该关闭/冻结图层，请确认下游软件的实际处理方式。");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("图层", 0, _string_builder.val));
          }
          break _L;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const unknown = [];
    const _bind$3 = placed.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$3) {
        const p = placed[_];
        const _p = p.layer;
        const _p$2 = "";
        if (!(_p === _p$2)) {
          const _bind$4 = _M0MP27mik1e806dxfkit6Tables5layer(tables$2, p.layer);
          if (_bind$4 === undefined) {
            _M0FP27mik1e806dxfkit4bump(unknown, p.layer);
          }
        }
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$4 = unknown.length;
    let _tmp$3 = 0;
    while (true) {
      const _ = _tmp$3;
      if (_ < _bind$4) {
        const u = unknown[_];
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(59);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, u._0);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」不在图层表里，但有 ");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, u._1);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 条实体引用它");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("图层", 1, _string_builder.val));
        _tmp$3 = _ + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FP27mik1e806dxfkit11on__segment(a, b, p) {
    return p.x >= _M0MPC16double6Double3min(a.x, b.x) && (p.x <= _M0MPC16double6Double3max(a.x, b.x) && (p.y >= _M0MPC16double6Double3min(a.y, b.y) && p.y <= _M0MPC16double6Double3max(a.y, b.y)));
  }
  function _M0FP27mik1e806dxfkit19segments__intersect(a1, a2, b1, b2) {
    const d1 = _M0FP27mik1e806dxfkit6orient(b1, b2, a1);
    const d2 = _M0FP27mik1e806dxfkit6orient(b1, b2, a2);
    const d3 = _M0FP27mik1e806dxfkit6orient(a1, a2, b1);
    const d4 = _M0FP27mik1e806dxfkit6orient(a1, a2, b2);
    if ((d1 > 0 && d2 < 0 || d1 < 0 && d2 > 0) && (d3 > 0 && d4 < 0 || d3 < 0 && d4 > 0)) {
      return true;
    }
    if (d1 === 0 && _M0FP27mik1e806dxfkit11on__segment(b1, b2, a1)) {
      return true;
    }
    if (d2 === 0 && _M0FP27mik1e806dxfkit11on__segment(b1, b2, a2)) {
      return true;
    }
    if (d3 === 0 && _M0FP27mik1e806dxfkit11on__segment(a1, a2, b1)) {
      return true;
    }
    if (d4 === 0 && _M0FP27mik1e806dxfkit11on__segment(a1, a2, b2)) {
      return true;
    }
    return false;
  }
  function _M0FP27mik1e806dxfkit12segment__gap(a1, a2, b1, b2) {
    if (_M0FP27mik1e806dxfkit19segments__intersect(a1, a2, b1, b2)) {
      return 0;
    }
    const d1 = _M0FP27mik1e806dxfkit17dist__to__segment(a1, b1, b2);
    const d2 = _M0FP27mik1e806dxfkit17dist__to__segment(a2, b1, b2);
    const d3 = _M0FP27mik1e806dxfkit17dist__to__segment(b1, a1, a2);
    const d4 = _M0FP27mik1e806dxfkit17dist__to__segment(b2, a1, a2);
    return _M0MPC16double6Double3min(_M0MPC16double6Double3min(_M0MPC16double6Double3min(d1, d2), d3), d4);
  }
  function _M0FP27mik1e806dxfkit15check__min__gap(layers, opt, findings, work) {
    if (opt.min_gap <= 0) {
      return undefined;
    }
    const tol = opt.tol;
    const _bind = layers.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const _foreach_element = layers[_];
        const _layer = _foreach_element._0;
        const _segs = _foreach_element._1;
        _L: {
          if (_segs.length < 2) {
            break _L;
          }
          const _bind$2 = [];
          const near = _M0MPB3Map3MapGlbE(new _M0TPB9ArrayViewGUlbEE(_bind$2, 0, 0), undefined);
          let worst = opt.min_gap;
          let at = _M0MP27mik1e806dxfkit4Vec24zeroN6recordS5791;
          let i = 0;
          while (true) {
            if (i < _segs.length) {
              const s = _M0MPC15array5Array2atGRPB4JsonE(_segs, i);
              let j = i + 1 | 0;
              while (true) {
                if (j < _segs.length && _M0MPC15array5Array2atGRPB4JsonE(_segs, j).min_x <= s.max_x + opt.min_gap) {
                  if (!_M0MP27mik1e806dxfkit9CheckWork5spend(work)) {
                    return undefined;
                  }
                  const t = _M0MPC15array5Array2atGRPB4JsonE(_segs, j);
                  if (s.owner !== t.owner && !(t.min_y > s.max_y + opt.min_gap || s.min_y > t.max_y + opt.min_gap)) {
                    const touching = _M0MP27mik1e806dxfkit4Vec28distance(s.a, t.a) <= tol || (_M0MP27mik1e806dxfkit4Vec28distance(s.a, t.b) <= tol || (_M0MP27mik1e806dxfkit4Vec28distance(s.b, t.a) <= tol || _M0MP27mik1e806dxfkit4Vec28distance(s.b, t.b) <= tol));
                    if (!touching) {
                      const gap = _M0FP27mik1e806dxfkit12segment__gap(s.a, s.b, t.a, t.b);
                      if (gap < opt.min_gap) {
                        const _p = s.owner;
                        const _p$2 = t.owner;
                        const a = BigInt.asUintN(64, BigInt(_p < _p$2 ? _p : _p$2));
                        const _p$3 = s.owner;
                        const _p$4 = t.owner;
                        const b = BigInt.asUintN(64, BigInt(_p$3 > _p$4 ? _p$3 : _p$4));
                        _M0MPB3Map3setGlbE(near, BigInt.asUintN(64, BigInt.asUintN(64, a << BigInt(32 & 63)) | b), true);
                        if (gap < worst) {
                          worst = gap;
                          at = s.a;
                        }
                      }
                    }
                  }
                  j = j + 1 | 0;
                  continue;
                } else {
                  break;
                }
              }
              i = i + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          if (near.size > 0) {
            const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(140);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
            _M0MPB13StringBuilder13write__objectGsE(_string_builder, _layer);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」有 ");
            _M0MPB13StringBuilder13write__objectGiE(_string_builder, near.size);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 对实体轮廓距离低于阈值——折线最小距离 ");
            _M0MPB13StringBuilder13write__objectGdE(_string_builder, worst);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "（(");
            _M0MPB13StringBuilder13write__objectGdE(_string_builder, at.x);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ", ");
            _M0MPB13StringBuilder13write__objectGdE(_string_builder, at.y);
            _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, ") 附近）；请结合单位、离散容差与工艺复核");
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("最小间隙", 1, _string_builder.val));
          }
          break _L;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FP27mik1e806dxfkit12check__texts(placed, findings) {
    const counts = [];
    const _bind = placed.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const p = placed[_];
        const _p = p.entity;
        const _bind$2 = _p.common.kind;
        let is_text;
        switch (_bind$2) {
          case "TEXT": {
            is_text = true;
            break;
          }
          case "MTEXT": {
            is_text = true;
            break;
          }
          case "ATTRIB": {
            is_text = true;
            break;
          }
          case "ATTDEF": {
            is_text = true;
            break;
          }
          default: {
            is_text = false;
          }
        }
        if (is_text) {
          _M0FP27mik1e806dxfkit4bump(counts, p.layer);
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$2 = counts.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$2) {
        const c = counts[_];
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(140);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "图层「");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, c._0);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "」上有 ");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, c._1);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 处文字：文字尚未转换为轮廓，本工具不检查字形几何，请确认下游软件的文字处理方式。");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("文字未转曲线", 1, _string_builder.val));
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        return;
      }
    }
  }
  function _M0FP27mik1e806dxfkit22index__layer__segments(placed, tables) {
    const _bind = [];
    const index = _M0MPB3Map3MapGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(new _M0TPB9ArrayViewGUsRPB5ArrayGRP27mik1e806dxfkit6CutSegEEE(_bind, 0, 0), undefined);
    const layers = [];
    const _bind$2 = placed.length;
    let _tmp = 0;
    while (true) {
      const owner = _tmp;
      if (owner < _bind$2) {
        const p = placed[owner];
        _L: {
          const _bind$3 = p.flat;
          if (_bind$3.$tag === 0) {
            const _Outline = _bind$3;
            const _points = _Outline._0;
            const _closed = _Outline._1;
            const n = _points.length;
            if (n < 2 || _M0FP27mik1e806dxfkit16is__uncut__layer(tables, p.layer)) {
              break _L;
            }
            const _bind$4 = _M0MPB3Map3getGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(index, p.layer);
            let segs;
            if (_bind$4.$tag === 1) {
              const _Some = _bind$4;
              segs = _Some._0;
            } else {
              const segs$2 = [];
              _M0MPB3Map3setGsRPB5ArrayGRP27mik1e806dxfkit6CutSegEE(index, p.layer, segs$2);
              _M0MPC15array5Array4pushGRPC14json10WriteFrameE(layers, { _0: p.layer, _1: segs$2 });
              segs = segs$2;
            }
            const count = _closed ? n : n - 1 | 0;
            let _tmp$2 = 0;
            while (true) {
              const i = _tmp$2;
              if (i < count) {
                const a = _M0MPC15array5Array2atGRPB4JsonE(_points, i);
                const b = _M0MPC15array5Array2atGRPB4JsonE(_points, (i + 1 | 0) % n | 0);
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(segs, new _M0TP27mik1e806dxfkit6CutSeg(a, b, _M0MPC16double6Double3min(a.x, b.x), _M0MPC16double6Double3max(a.x, b.x), _M0MPC16double6Double3min(a.y, b.y), _M0MPC16double6Double3max(a.y, b.y), owner, i, count, _closed));
                _tmp$2 = i + 1 | 0;
                continue;
              } else {
                break;
              }
            }
          } else {
            break _L;
          }
          break _L;
        }
        _tmp = owner + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$3 = layers.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$3) {
        const _foreach_element = layers[_];
        const _segs = _foreach_element._1;
        _M0MPC15array5Array8sort__byGRP27mik1e806dxfkit6CutSegE(_segs, (a, b) => a.min_x < b.min_x ? -1 : a.min_x > b.min_x ? 1 : 0);
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return layers;
  }
  function _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einner(self, opt, exp, budget) {
    const tol = opt.tol;
    const findings = [];
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(tol) || (!_M0FP27mik1e806dxfkit14finite__number(opt.min_gap) || opt.min_gap < 0)) {
      return new _M0TP27mik1e806dxfkit6Report([_M0MP27mik1e806dxfkit7Drawing24check__expansion_2einnerN6recordS5855]);
    }
    const _bind = exp.warnings;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const w = _bind[_];
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("解析", 1, w));
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (!_M0FP27mik1e806dxfkit18preview__range__ok(exp) || (tol < 1e-100 || (tol > 1e+100 || opt.min_gap > 1e+100))) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einnerN6recordS5856);
      return new _M0TP27mik1e806dxfkit6Report(findings);
    }
    const unsupported = [];
    let outlines = 0;
    const _bind$3 = exp.placed;
    const _bind$4 = _bind$3.length;
    let _tmp$2 = 0;
    while (true) {
      const _ = _tmp$2;
      if (_ < _bind$4) {
        const p = _bind$3[_];
        const _bind$5 = p.flat;
        if (_bind$5.$tag === 0) {
          const _Outline = _bind$5;
          const _points = _Outline._0;
          if (_points.length >= 2) {
            outlines = outlines + 1 | 0;
          }
        }
        _L: {
          _L$2: {
            const _bind$6 = p.entity.geom;
            switch (_bind$6.$tag) {
              case 8: {
                let _tmp$3;
                let _tmp$4;
                const _p = p.entity;
                if (_p.common.kind === "SOLID") {
                  _tmp$4 = true;
                } else {
                  const _p$2 = p.entity;
                  _tmp$4 = _p$2.common.kind === "TRACE";
                }
                if (_tmp$4) {
                  const _bind$7 = p.flat;
                  let _tmp$5;
                  if (_bind$7.$tag === 0) {
                    _tmp$5 = true;
                  } else {
                    _tmp$5 = false;
                  }
                  _tmp$3 = _tmp$5;
                } else {
                  _tmp$3 = false;
                }
                if (!_tmp$3) {
                  const _p$2 = p.entity;
                  _M0FP27mik1e806dxfkit4bump(unsupported, _p$2.common.kind);
                }
                break;
              }
              case 11: {
                break _L$2;
              }
              case 9: {
                break _L$2;
              }
              case 12: {
                break _L$2;
              }
            }
            break _L;
          }
          const _p = p.entity;
          _M0FP27mik1e806dxfkit4bump(unsupported, _p.common.kind);
        }
        _tmp$2 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    const _bind$5 = unsupported.length;
    let _tmp$3 = 0;
    while (true) {
      const _ = _tmp$3;
      if (_ < _bind$5) {
        const item = unsupported[_];
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(75);
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, item._1);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 个 ");
        _M0MPB13StringBuilder13write__objectGsE(_string_builder, item._0);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 实体的轮廓未参与检查；保留记录不表示已验证几何");
        _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, new _M0TP27mik1e806dxfkit7Finding("检查覆盖", 1, _string_builder.val));
        _tmp$3 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    if (outlines === 0) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einnerN6recordS5857);
    }
    const _bind$6 = exp.placed;
    const _bind$7 = _bind$6.length;
    let _tmp$4 = 0;
    while (true) {
      const _ = _tmp$4;
      if (_ < _bind$7) {
        const p = _bind$6[_];
        _M0FP27mik1e806dxfkit17check__degenerate(p, findings);
        _tmp$4 = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    _M0FP27mik1e806dxfkit12check__texts(exp.placed, findings);
    const _bind$8 = _M0MP27mik1e806dxfkit7Drawing7section(self, "TABLES");
    let tables;
    if (_bind$8 === undefined) {
      tables = undefined;
    } else {
      const _Some = _bind$8;
      const _t = _Some;
      tables = _M0FP27mik1e806dxfkit13parse__tables(_t);
    }
    _M0FP27mik1e806dxfkit13check__layers(tables, exp.placed, findings);
    const work = new _M0TP27mik1e806dxfkit9CheckWork(budget.max_candidates, budget.max_candidates <= 0);
    if (!work.stopped) {
      _M0FP27mik1e806dxfkit14check__closure(exp.placed, tables, tol, findings, work);
    }
    if (!work.stopped) {
      const segments = _M0FP27mik1e806dxfkit22index__layer__segments(exp.placed, tables);
      _M0FP27mik1e806dxfkit16check__crossings(segments, tol, findings, work);
      if (!work.stopped) {
        _M0FP27mik1e806dxfkit15check__min__gap(segments, opt, findings, work);
      }
    }
    if (work.stopped) {
      _M0MPC15array5Array4pushGRPC14json10WriteFrameE(findings, _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einnerN6recordS5858);
    }
    return new _M0TP27mik1e806dxfkit6Report(findings);
  }
  function _M0MP27mik1e806dxfkit7Drawing16check__expansion(self, opt, exp, budget$46$opt) {
    let budget;
    if (budget$46$opt === undefined) {
      budget = _M0MP27mik1e806dxfkit14GeometryBudget7defaultN6recordS5854;
    } else {
      const _Some = budget$46$opt;
      budget = _Some;
    }
    return _M0MP27mik1e806dxfkit7Drawing24check__expansion_2einner(self, opt, exp, budget);
  }
  function _M0MP27mik1e806dxfkit7Drawing5check(self, opt) {
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(opt.tol) || (!_M0FP27mik1e806dxfkit14finite__number(opt.min_gap) || opt.min_gap < 0)) {
      return _M0MP27mik1e806dxfkit7Drawing16check__expansion(self, opt, new _M0TP27mik1e806dxfkit9Expansion([], []), undefined);
    }
    return _M0MP27mik1e806dxfkit7Drawing16check__expansion(self, opt, _M0MP27mik1e806dxfkit7Drawing6expand(self, opt.tol), undefined);
  }
  function _M0FP27mik1e806dxfkit24scan__tags__with__limits(data, limits) {
    const stream = _M0MP27mik1e806dxfkit9TagStream12with__limits(limits);
    const tags = _M0MP27mik1e806dxfkit9TagStream4feed(stream, data);
    const _bind = _M0MP27mik1e806dxfkit9TagStream6finish(stream);
    _M0MPC15array5Array6appendGRP27mik1e806dxfkit3TagE(tags, new _M0TPB9ArrayViewGRP27mik1e806dxfkit3TagE(_bind, 0, _bind.length));
    const _tmp = _M0MP27mik1e806dxfkit9TagStream8warnings(stream);
    const _p = stream.enc;
    let _tmp$2;
    if (_p === undefined) {
      _tmp$2 = $panic();
    } else {
      const _p$2 = _p;
      _tmp$2 = _p$2;
    }
    return new _M0TP27mik1e806dxfkit7TagScan(tags, _tmp, _tmp$2);
  }
  function _M0FP27mik1e806dxfkit10scan__tags(data) {
    return _M0FP27mik1e806dxfkit24scan__tags__with__limits(data, _M0MP27mik1e806dxfkit10ReadLimits7defaultN6recordS5840);
  }
  function _M0MP27mik1e806dxfkit7Drawing20svg__from__expansion(self, exp) {
    const _bind = _M0MP27mik1e806dxfkit7Drawing11render__svg(self, exp, 33554432);
    if (_bind.$tag === 1) {
      const _Ok = _bind;
      return _Ok._0;
    } else {
      return "";
    }
  }
  function _M0MP27mik1e806dxfkit7Drawing7to__svg(self, tol) {
    const exp = _M0MP27mik1e806dxfkit7Drawing6expand(self, tol);
    return _M0MP27mik1e806dxfkit7Drawing20svg__from__expansion(self, exp);
  }
  function _M0FP27mik1e806dxfkit13parse__header(section) {
    const vars = [];
    const _bind = section.records;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const record = _bind[_];
        const tags = record.common;
        let i = 0;
        while (true) {
          if (i < tags.length) {
            if (_M0MPC15array5Array2atGRPB4JsonE(tags, i).code !== 9) {
              i = i + 1 | 0;
              continue;
            }
            const values = [];
            let j = i + 1 | 0;
            while (true) {
              if (j < tags.length && _M0MPC15array5Array2atGRPB4JsonE(tags, j).code !== 9) {
                _M0MPC15array5Array4pushGRPC14json10WriteFrameE(values, _M0MPC15array5Array2atGRPB4JsonE(tags, j));
                j = j + 1 | 0;
                continue;
              } else {
                break;
              }
            }
            _M0MPC15array5Array4pushGRPC14json10WriteFrameE(vars, new _M0TP27mik1e806dxfkit9HeaderVar(_M0MP27mik1e806dxfkit8TagValue10as__string(_M0MPC15array5Array2atGRPB4JsonE(tags, i).value), values));
            i = j;
            continue;
          } else {
            break;
          }
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return new _M0TP27mik1e806dxfkit6Header(vars);
  }
  function _M0MP27mik1e806dxfkit6Header3get(self, name) {
    const _bind = self.vars;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const v = _bind[_];
        if (v.name === name) {
          return v;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return undefined;
  }
  function _M0MP27mik1e806dxfkit6Header8get__int(self, name, default_) {
    const _bind = _M0MP27mik1e806dxfkit6Header3get(self, name);
    if (_bind === undefined) {
      return default_;
    } else {
      const _Some = _bind;
      const _v = _Some;
      return _v.values.length > 0 ? _M0MP27mik1e806dxfkit8TagValue7as__int(_M0MPC15array5Array2atGRPB4JsonE(_v.values, 0).value) : default_;
    }
  }
  function _M0MP27mik1e806dxfkit6Header8insunits(self) {
    return _M0MP27mik1e806dxfkit6Header8get__int(self, "$INSUNITS", 0);
  }
  function _M0FP27mik1e806dxfkit10unit__name(code) {
    switch (code) {
      case 0: {
        return "未指定";
      }
      case 1: {
        return "英寸";
      }
      case 2: {
        return "英尺";
      }
      case 3: {
        return "英里";
      }
      case 4: {
        return "毫米";
      }
      case 5: {
        return "厘米";
      }
      case 6: {
        return "米";
      }
      case 7: {
        return "千米";
      }
      case 8: {
        return "微英寸";
      }
      case 9: {
        return "密尔";
      }
      case 10: {
        return "码";
      }
      case 11: {
        return "埃";
      }
      case 12: {
        return "纳米";
      }
      case 13: {
        return "微米";
      }
      case 14: {
        return "分米";
      }
      case 15: {
        return "十米";
      }
      case 16: {
        return "百米";
      }
      case 17: {
        return "兆米";
      }
      case 18: {
        return "天文单位";
      }
      case 19: {
        return "光年";
      }
      case 20: {
        return "秒差距";
      }
      default: {
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(12);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "未知（");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, code);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "）");
        return _string_builder.val;
      }
    }
  }
  function _M0MP27mik1e806dxfkit7Drawing21declared__unit__label(self) {
    const _bind = _M0MP27mik1e806dxfkit7Drawing7section(self, "HEADER");
    if (_bind === undefined) {
      return "未声明";
    } else {
      const _Some = _bind;
      const _section = _Some;
      return _M0FP27mik1e806dxfkit10unit__name(_M0MP27mik1e806dxfkit6Header8insunits(_M0FP27mik1e806dxfkit13parse__header(_section)));
    }
  }
  function _M0MP27mik1e806dxfkit6Report5count(self, severity) {
    let n = 0;
    const _bind = self.findings;
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const f = _bind[_];
        const _bind$3 = f.severity;
        let hit;
        switch (_bind$3) {
          case 0: {
            if (severity === 0) {
              hit = true;
            } else {
              hit = false;
            }
            break;
          }
          case 1: {
            if (severity === 1) {
              hit = true;
            } else {
              hit = false;
            }
            break;
          }
          default: {
            if (severity === 2) {
              hit = true;
            } else {
              hit = false;
            }
          }
        }
        if (hit) {
          n = n + 1 | 0;
        }
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
    return n;
  }
  function _M0MP27mik1e806dxfkit6Report7verdict(self) {
    const fatal = _M0MP27mik1e806dxfkit6Report5count(self, 2);
    let summary;
    if (fatal > 0) {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(65);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "本次检查发现 ");
      _M0MPB13StringBuilder13write__objectGiE(_string_builder, fatal);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 个严重问题，请修正并复核图纸。");
      summary = _string_builder.val;
    } else {
      const warn = _M0MP27mik1e806dxfkit6Report5count(self, 1);
      if (warn > 0) {
        const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(65);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "本次检查发现 ");
        _M0MPB13StringBuilder13write__objectGiE(_string_builder, warn);
        _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " 个警告，请复核图纸与加工条件。");
        summary = _string_builder.val;
      } else {
        summary = "本次已覆盖的检查项没发现问题；不构成可加工保证，请确认单位、材料、刀具和工艺。";
      }
    }
    if (_M0MP27mik1e806dxfkit6Report23has__incomplete__checks(self)) {
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(72);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "检查不完整：存在未解析、未转换或未能检查的内容。");
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, summary);
      return _string_builder.val;
    } else {
      return summary;
    }
  }
  function _M0FP27mik1e806dxfkit15severity__label(sev) {
    switch (sev) {
      case 0: {
        return "提示";
      }
      case 1: {
        return "警告";
      }
      default: {
        return "致命";
      }
    }
  }
  function _M0MP27mik1e806dxfkit6Report8to__text(self) {
    const sb = _M0MPB13StringBuilder21StringBuilder_2einner(0);
    if (self.findings.length === 0) {
      _M0IPB13StringBuilderPB6Logger13write__string(sb, "（没有发现）\n");
    } else {
      const _bind = self.findings;
      const _bind$2 = _bind.length;
      let _tmp = 0;
      while (true) {
        const _ = _tmp;
        if (_ < _bind$2) {
          const f = _bind[_];
          const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(7);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "[");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0FP27mik1e806dxfkit15severity__label(f.severity));
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "] [");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, f.check);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "] ");
          _M0MPB13StringBuilder13write__objectGsE(_string_builder, f.message);
          _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "\n");
          _M0IPB13StringBuilderPB6Logger13write__string(sb, _string_builder.val);
          _tmp = _ + 1 | 0;
          continue;
        } else {
          break;
        }
      }
    }
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(30);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "致命 ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, _M0MP27mik1e806dxfkit6Report5count(self, 2));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " · 警告 ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, _M0MP27mik1e806dxfkit6Report5count(self, 1));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, " · 提示 ");
    _M0MPB13StringBuilder13write__objectGiE(_string_builder, _M0MP27mik1e806dxfkit6Report5count(self, 0));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "\n");
    _M0IPB13StringBuilderPB6Logger13write__string(sb, _string_builder.val);
    _M0IPB13StringBuilderPB6Logger13write__string(sb, _M0MP27mik1e806dxfkit6Report7verdict(self));
    return sb.val;
  }
  function _M0MP27mik1e806dxfkit7Drawing7analyze(self, opt) {
    if (!_M0FP27mik1e806dxfkit19positive__tolerance(opt.tol) || (!_M0FP27mik1e806dxfkit14finite__number(opt.min_gap) || opt.min_gap < 0)) {
      return new _M0TP27mik1e806dxfkit15DrawingAnalysis(_M0MP27mik1e806dxfkit7Drawing5check(self, opt), "", _M0MP27mik1e806dxfkit7Drawing21declared__unit__label(self));
    }
    const expansion = _M0MP27mik1e806dxfkit7Drawing6expand(self, opt.tol);
    return new _M0TP27mik1e806dxfkit15DrawingAnalysis(_M0MP27mik1e806dxfkit7Drawing16check__expansion(self, opt, expansion, undefined), _M0MP27mik1e806dxfkit7Drawing20svg__from__expansion(self, expansion), _M0MP27mik1e806dxfkit7Drawing21declared__unit__label(self));
  }
  function _M0FP37mik1e806dxfkit3web6decode(file_base64) {
    if (file_base64.length > 89478488) {
      return _M0FP37mik1e806dxfkit3web6decodeN6constrS57;
    }
    if (file_base64.length === 0) {
      return _M0FP37mik1e806dxfkit3web6decodeN6constrS58;
    }
    let _try_err;
    _L: {
      const _bind = _M0FPC28encoding6base6414decode_2einner(new _M0TPC16string10StringView(file_base64, 0, file_base64.length), false);
      let _tmp;
      if (_bind.$tag === 1) {
        const _ok = _bind;
        _tmp = _ok._0;
      } else {
        const _err = _bind;
        _try_err = _err._0;
        break _L;
      }
      return new _M0DTPC16result6ResultGzsE2Ok(_tmp);
    }
    return _M0FP37mik1e806dxfkit3web6decodeN6constrS59;
  }
  function _M0FP37mik1e806dxfkit3web7analyze(file_base64, min_gap, tol) {
    const _bind = _M0FP37mik1e806dxfkit3web6decode(file_base64);
    let data;
    if (_bind.$tag === 1) {
      const _Ok = _bind;
      data = _Ok._0;
    } else {
      const _Err = _bind;
      const _msg = _Err._0;
      const _p = `读不了：${_msg}`;
      const _tmp = { _0: "report", _1: new _M0DTPB4Json6String(_p) };
      const _p$2 = "";
      const _tmp$2 = { _0: "svg", _1: new _M0DTPB4Json6String(_p$2) };
      const _tmp$3 = { _0: "error", _1: new _M0DTPB4Json6String(_msg) };
      const _p$3 = "";
      const _bind$2 = [_tmp, _tmp$2, _tmp$3, { _0: "unit", _1: new _M0DTPB4Json6String(_p$3) }];
      const _p$4 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 4), undefined);
      return _M0MPC14json4Json17stringify_2einner(new _M0DTPB4Json6Object(_p$4), false, 0, undefined);
    }
    const drawing = _M0FP27mik1e806dxfkit14build__drawing(_M0FP27mik1e806dxfkit10scan__tags(data));
    const result = _M0MP27mik1e806dxfkit7Drawing7analyze(drawing, new _M0TP27mik1e806dxfkit12CheckOptions(tol, min_gap));
    const error = result.svg === "" ? "SVG未生成：参数、数值或预览资源超出安全范围；请查看报告" : "";
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(76);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "单位声明：");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder, result.unit);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "；坐标及阈值使用图纸原始单位，请先确认。\n");
    const report = `${_string_builder.val}${_M0MP27mik1e806dxfkit6Report8to__text(result.report)}`;
    const _tmp = { _0: "report", _1: new _M0DTPB4Json6String(report) };
    const _p = result.svg;
    const _tmp$2 = { _0: "svg", _1: new _M0DTPB4Json6String(_p) };
    const _tmp$3 = { _0: "error", _1: new _M0DTPB4Json6String(error) };
    const _p$2 = result.unit;
    const _bind$2 = [_tmp, _tmp$2, _tmp$3, { _0: "unit", _1: new _M0DTPB4Json6String(_p$2) }];
    const _p$3 = _M0MPB3Map3MapGsRPB4JsonE(new _M0TPB9ArrayViewGUsRPB4JsonEE(_bind$2, 0, 4), undefined);
    return _M0MPC14json4Json17stringify_2einner(new _M0DTPB4Json6Object(_p$3), false, 0, undefined);
  }
  function _M0FP37mik1e806dxfkit3web5check(file_base64, min_gap) {
    const _bind = _M0FP37mik1e806dxfkit3web6decode(file_base64);
    let data;
    if (_bind.$tag === 1) {
      const _Ok = _bind;
      data = _Ok._0;
    } else {
      const _Err = _bind;
      const _msg = _Err._0;
      const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(12);
      _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "读不了：");
      _M0MPB13StringBuilder13write__objectGsE(_string_builder, _msg);
      return _string_builder.val;
    }
    const drawing = _M0FP27mik1e806dxfkit14build__drawing(_M0FP27mik1e806dxfkit10scan__tags(data));
    const _string_builder = _M0MPB13StringBuilder21StringBuilder_2einner(76);
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "单位声明：");
    _M0MPB13StringBuilder13write__objectGsE(_string_builder, _M0MP27mik1e806dxfkit7Drawing21declared__unit__label(drawing));
    _M0IPB13StringBuilderPB6Logger13write__string(_string_builder, "；坐标及阈值使用图纸原始单位，请先确认。\n");
    return `${_string_builder.val}${_M0MP27mik1e806dxfkit6Report8to__text(_M0MP27mik1e806dxfkit7Drawing5check(drawing, new _M0TP27mik1e806dxfkit12CheckOptions(0.05, min_gap)))}`;
  }
  function _M0FP37mik1e806dxfkit3web3svg(file_base64, tol) {
    const _bind = _M0FP37mik1e806dxfkit3web6decode(file_base64);
    if (_bind.$tag === 1) {
      const _Ok = _bind;
      const _data = _Ok._0;
      return _M0MP27mik1e806dxfkit7Drawing7to__svg(_M0FP27mik1e806dxfkit14build__drawing(_M0FP27mik1e806dxfkit10scan__tags(_data)), tol);
    } else {
      return "";
    }
  }
  function _M0FP37mik1e806dxfkit3web10svg__error(file_base64) {
    const _bind = _M0FP37mik1e806dxfkit3web6decode(file_base64);
    if (_bind.$tag === 1) {
      return "";
    } else {
      const _Err = _bind;
      return _Err._0;
    }
  }
  globalThis.analyze = _M0FP37mik1e806dxfkit3web7analyze;
  globalThis.check = _M0FP37mik1e806dxfkit3web5check;
  globalThis.svg = _M0FP37mik1e806dxfkit3web3svg;
  globalThis.svg_error = _M0FP37mik1e806dxfkit3web10svg__error;
})();
