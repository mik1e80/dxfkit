# 第三方 DXF 图纸逐文件验证记录

本表保留现有 47 个 ezdxf 文件，分别记录读取、实体解码输出和独立几何验证。**没有“兼容通过”这一统一结论。**

实测读取 47/47；顶层实体输出 5524，其中 5404 个 is_decoded=true；46 份检查报告标为不完整。
**独立几何真值验证：0/47。** 已运行离散、展开及检查不变量，不等于验证每张图纸的坐标、尺寸或完整语义。P0 的自建解析几何测试不能自动替代这些外部文件的真值。

## 来源与身份

来源：[mozman/ezdxf examples_dxf](https://github.com/mozman/ezdxf/tree/master/examples_dxf)，MIT；完整许可见[第三方声明](../THIRD_PARTY_NOTICES.md)。
本仓库首次收录提交：[6f5d182](https://github.com/mik1e80/dxfkit/commit/6f5d18250170d52921e9cc35cee583c045355ab5)。未记录上游提交号，不能补猜。表中来源链接是历史文件路径引用，master 的文件可能移动或删除。
本轮保留全部 DXF 字节；每个文件的大小、SHA-256、上游路径及实际诊断见[机器记录](corpus-validation.json)。DXF 哈希取原始字节，审计依赖的源码哈希规范化为 LF，以便跨平台复核。本地哈希标识被测文件，不是与当前上游逐字节一致的证明。

## 判读方式

- 读取“成功”：文件读取、tag、EOF、组码范围不变量成立，完整结构语义仍受限。扫描和结构警告分别保存在机器记录。
- 解码“d/n”：ENTITIES 解码结果中 d 个提供字段、n 个实体外壳；Unknown 仍保留。全部可解码也不代表所有字段被实现，文字、面、填充和标注可能仅保留元数据。0/0 表示无顶层实体，不算解码通过。
- 几何“未独立验证”：这些文件没有独立坐标/尺寸/误差真值。不把生成点列、预览、无警告或检查完整性状态当作几何验证。
- 未覆盖列合并顶层和展开后类型；它列出已知限制，不构成完整 DXF 特性的穷尽清单。净距统一关闭，所有文件均未验证净距结论。

## 逐文件案例表

| 图纸 | 来源 | 读取 | 实体字段解码 d/n | 几何真值验证 | 实际测试 | 未覆盖/限制 |
| --- | --- | --- | --- | --- | --- | --- |
| [3dface.dxf](../testdata/ezdxf/3dface.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/3dface.dxf) | 成功 | 71/71 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 3DFACE/MTEXT/TEXT；缺少逐图纸独立几何真值 |
| [Minimal_DXF_AC1006.dxf](../testdata/ezdxf/Minimal_DXF_AC1006.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/Minimal_DXF_AC1006.dxf) | 成功 | 3/3 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0, A3 | 仅字段/元数据 3DFACE；缺少逐图纸独立几何真值 |
| [Minimal_DXF_AC1009.dxf](../testdata/ezdxf/Minimal_DXF_AC1009.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/Minimal_DXF_AC1009.dxf) | 成功 | 0/0（不适用） | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0, A2, A4, CLI1 | 无顶层实体，解码不适用；缺少逐图纸独立几何真值 |
| [Minimal_DXF_AC1021.dxf](../testdata/ezdxf/Minimal_DXF_AC1021.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/Minimal_DXF_AC1021.dxf) | 成功 | 0/0（不适用） | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0, A3 | 无顶层实体，解码不适用；缺少逐图纸独立几何真值 |
| [VP4.dxf](../testdata/ezdxf/VP4.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/VP4.dxf) | 成功 | 22/27 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 VIEWPORT；仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [acad_table_simple.dxf](../testdata/ezdxf/acad_table_simple.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/acad_table_simple.dxf) | 成功 | 0/1 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 ACAD_TABLE；缺少逐图纸独立几何真值 |
| [acad_table_with_blk_ref.dxf](../testdata/ezdxf/acad_table_with_blk_ref.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/acad_table_with_blk_ref.dxf) | 成功 | 0/1 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 ACAD_TABLE；缺少逐图纸独立几何真值 |
| [caret_encoding.dxf](../testdata/ezdxf/caret_encoding.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/caret_encoding.dxf) | 成功 | 61/61 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT；缺少逐图纸独立几何真值 |
| [circle_radius_le_0.dxf](../testdata/ezdxf/circle_radius_le_0.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/circle_radius_le_0.dxf) | 成功 | 2/2 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0, A1, A5 | 缺少逐图纸独立几何真值 |
| [clockwise_arcs_hatch.dxf](../testdata/ezdxf/clockwise_arcs_hatch.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/clockwise_arcs_hatch.dxf) | 成功 | 1/1 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 HATCH；缺少逐图纸独立几何真值 |
| [colors.dxf](../testdata/ezdxf/colors.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/colors.dxf) | 成功 | 28/28 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT；缺少逐图纸独立几何真值 |
| [columns_R2007.dxf](../testdata/ezdxf/columns_R2007.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/columns_R2007.dxf) | 成功 | 69/69 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT；缺少逐图纸独立几何真值 |
| [columns_R2018.dxf](../testdata/ezdxf/columns_R2018.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/columns_R2018.dxf) | 成功 | 52/52 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT；缺少逐图纸独立几何真值 |
| [dimension_in_block.dxf](../testdata/ezdxf/dimension_in_block.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/dimension_in_block.dxf) | 成功 | 4/4 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 DIMENSION；缺少逐图纸独立几何真值 |
| [dimension_in_nested_blocks.dxf](../testdata/ezdxf/dimension_in_nested_blocks.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/dimension_in_nested_blocks.dxf) | 成功 | 4/4 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 DIMENSION/TEXT；缺少逐图纸独立几何真值 |
| [hatch_issues.dxf](../testdata/ezdxf/hatch_issues.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/hatch_issues.dxf) | 成功 | 12/12 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 HATCH；缺少逐图纸独立几何真值 |
| [hatch_text_box_in_fill.dxf](../testdata/ezdxf/hatch_text_box_in_fill.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/hatch_text_box_in_fill.dxf) | 成功 | 4/4 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 HATCH/MTEXT；缺少逐图纸独立几何真值 |
| [hatch_text_box_in_hole.dxf](../testdata/ezdxf/hatch_text_box_in_hole.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/hatch_text_box_in_hole.dxf) | 成功 | 4/4 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 HATCH/MTEXT；缺少逐图纸独立几何真值 |
| [hatch_text_box_overlapping_fill_and_hole.dxf](../testdata/ezdxf/hatch_text_box_overlapping_fill_and_hole.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/hatch_text_box_overlapping_fill_and_hole.dxf) | 成功 | 4/4 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 HATCH/MTEXT；缺少逐图纸独立几何真值 |
| [hatches_1.dxf](../testdata/ezdxf/hatches_1.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/hatches_1.dxf) | 成功 | 32/32 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 HATCH；缺少逐图纸独立几何真值 |
| [hatches_2.dxf](../testdata/ezdxf/hatches_2.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/hatches_2.dxf) | 成功 | 11/11 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 HATCH/MTEXT；缺少逐图纸独立几何真值 |
| [images.dxf](../testdata/ezdxf/images.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/images.dxf) | 成功 | 174/233 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 IMAGE；仅字段/元数据 MTEXT/TEXT；外部图像未加载；缺少逐图纸独立几何真值 |
| [insert_bricscad_level_1.dxf](../testdata/ezdxf/insert_bricscad_level_1.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/insert_bricscad_level_1.dxf) | 成功 | 24/24 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [mtext_columns_R2000.dxf](../testdata/ezdxf/mtext_columns_R2000.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/mtext_columns_R2000.dxf) | 成功 | 9/9 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT；缺少逐图纸独立几何真值 |
| [mtext_columns_R2007.dxf](../testdata/ezdxf/mtext_columns_R2007.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/mtext_columns_R2007.dxf) | 成功 | 9/9 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT；缺少逐图纸独立几何真值 |
| [mtext_columns_R2018.dxf](../testdata/ezdxf/mtext_columns_R2018.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/mtext_columns_R2018.dxf) | 成功 | 3/3 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT；缺少逐图纸独立几何真值 |
| [mtext_complex_inline_codes.dxf](../testdata/ezdxf/mtext_complex_inline_codes.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/mtext_complex_inline_codes.dxf) | 成功 | 12/12 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT；非默认 OCS 未转换；缺少逐图纸独立几何真值 |
| [multi_insert_with_attribs.dxf](../testdata/ezdxf/multi_insert_with_attribs.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/multi_insert_with_attribs.dxf) | 成功 | 4/4 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 ATTDEF/ATTRIB；阵列其余实例未展开；缺少逐图纸独立几何真值 |
| [text.dxf](../testdata/ezdxf/text.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text.dxf) | 成功 | 226/228 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 VIEWPORT；仅字段/元数据 ATTDEF/ATTRIB/MTEXT/TEXT；缺少逐图纸独立几何真值 |
| [text_alignments.dxf](../testdata/ezdxf/text_alignments.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_alignments.dxf) | 成功 | 58/58 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [text_fonts.dxf](../testdata/ezdxf/text_fonts.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_fonts.dxf) | 成功 | 1344/1344 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [text_in_viewports.dxf](../testdata/ezdxf/text_in_viewports.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_in_viewports.dxf) | 成功 | 18/25 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 VIEWPORT；仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [text_mirror_shx_font.dxf](../testdata/ezdxf/text_mirror_shx_font.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_mirror_shx_font.dxf) | 成功 | 672/672 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [text_mirror_true_type_font.dxf](../testdata/ezdxf/text_mirror_true_type_font.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_mirror_true_type_font.dxf) | 成功 | 672/672 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [text_negative_extrusion.dxf](../testdata/ezdxf/text_negative_extrusion.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_negative_extrusion.dxf) | 成功 | 226/228 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 VIEWPORT；仅字段/元数据 ATTDEF/ATTRIB/MTEXT/TEXT；非默认 OCS 未转换；缺少逐图纸独立几何真值 |
| [text_oblique_rotate.dxf](../testdata/ezdxf/text_oblique_rotate.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_oblique_rotate.dxf) | 成功 | 317/317 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [text_stacked_shx_font.dxf](../testdata/ezdxf/text_stacked_shx_font.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_stacked_shx_font.dxf) | 成功 | 439/439 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [text_stacked_true_type_font.dxf](../testdata/ezdxf/text_stacked_true_type_font.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/text_stacked_true_type_font.dxf) | 成功 | 439/439 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [transform_hatch_pattern.dxf](../testdata/ezdxf/transform_hatch_pattern.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/transform_hatch_pattern.dxf) | 成功 | 24/24 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 HATCH/MTEXT；缺少逐图纸独立几何真值 |
| [uncommon.dxf](../testdata/ezdxf/uncommon.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/uncommon.dxf) | 成功 | 72/85 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 3DSOLID/MESH/MULTILEADER/POLYLINE/RAY/VIEWPORT/XLINE；仅字段/元数据 ATTDEF/ATTRIB/DIMENSION/MTEXT；非普通二维 POLYLINE 未生成轮廓；缺少逐图纸独立几何真值 |
| [valid_lineweights.dxf](../testdata/ezdxf/valid_lineweights.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/valid_lineweights.dxf) | 成功 | 50/50 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [viewport_frozen_layers.dxf](../testdata/ezdxf/viewport_frozen_layers.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/viewport_frozen_layers.dxf) | 成功 | 7/11 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 VIEWPORT；仅字段/元数据 TEXT；缺少逐图纸独立几何真值 |
| [viewports.dxf](../testdata/ezdxf/viewports.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/viewports.dxf) | 成功 | 19/36 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 IMAGE/VIEWPORT；仅字段/元数据 MTEXT/TEXT；缺少逐图纸独立几何真值 |
| [visibility.dxf](../testdata/ezdxf/visibility.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/visibility.dxf) | 成功 | 6/6 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 仅字段/元数据 MTEXT/TEXT；缺少逐图纸独立几何真值 |
| [wipeout_door.dxf](../testdata/ezdxf/wipeout_door.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/wipeout_door.dxf) | 成功 | 148/149 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 WIPEOUT；仅字段/元数据 MTEXT；缺少逐图纸独立几何真值 |
| [wipeout_random.dxf](../testdata/ezdxf/wipeout_random.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/wipeout_random.dxf) | 成功 | 30/31 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 WIPEOUT；缺少逐图纸独立几何真值 |
| [xclip.dxf](../testdata/ezdxf/xclip.dxf) | [ezdxf](https://github.com/mozman/ezdxf/blob/master/examples_dxf/xclip.dxf) | 成功 | 18/25 | 未独立验证 | R1, R2, R3, R4, E1, E2, G0, G1, C0 | 未解码 VIEWPORT；仅字段/元数据 MTEXT；未加载外部参照/未验证裁剪；缺少逐图纸独立几何真值 |

## 实际参与的测试

R/E/G/C/A 项均由 [conformance/corpus_wbtest.mbt](../conformance/corpus_wbtest.mbt) 的真实测试执行；带“汇总”的测试不提供逐文件几何真值。

| ID | 测试名称 | 实际断言范围 |
| --- | --- | --- |
| R1 | 语料里每个文件都能扫出 tag | 扫描产生 tag |
| R2 | 每个文件都以 EOF 结尾 | 扫描结果以 EOF 结束 |
| R3 | 扫出来的组码都是合理的非负数 | 组码在 0–1071 |
| R4 | 流式扫描与整份扫描逐 tag 等价 | 4096/8191 字节分块与全量逐 tag 相同 |
| E1 | 语料整体：实体解析的锚点 | 汇总实体/解码数量及诊断锚点，不是逐字段真值 |
| E2 | 语料里未解码的实体类型都在预期清单里 | 未解码类型集合 |
| G0 | 语料 Geometry 离散：曲线有点列，无实体身份的 Face 不猜轮廓 | Geometry 点列不变量、汇总数量和无身份 Face 的空结果；不是几何误差验证 |
| G1 | 语料块展开：记录未支持的阵列实例 | 展开记录总量和受限输入诊断；不是变换坐标真值 |
| C0 | 语料加工检查：锚点 | 报告锚点及 uncommon.dxf 的 59B SOLID 三点坐标断言，不是逐文件完整真值 |
| A1 | circle_radius_le_0：3016 行 → 1508 个 tag | 扫描数量及无扫描警告 |
| A2 | Minimal_DXF_AC1009：35 字节的最小文件 | 四个 tag 的值与顺序 |
| A3 | 带 HEADER 的 Minimal 文件能读出正确的版本号 | HEADER 版本字段 |
| A4 | 没有 HEADER 段的最小文件：不该崩，也不能假装知道版本 | 版本缺失与 CP1252 回退 |
| A5 | circle.dxf 声明的是 CP1252 但实际是 UTF-8 | 扫描编码选择 UTF-8 |
| CLI1 | 空外部最小文件 strict 门禁 | 实际退出 1，报告无可检查轮廓 |

## 复现与更新

```sh
moon run conformance -- --audit
node scripts/verify-corpus-records.cjs
node scripts/verify-corpus-records.cjs --write
```

脚本先真实运行 14 条语料测试及 CLI1，再对 47 份文件生成 JSON 审计。默认只比较记录，结果或文件哈希变化会失败；--write 经人工审阅后更新两份记录。CI 执行默认复核。
审计固定 tol=0.05、min_gap=0；旧离散不变量测试使用 tol=0.01。完整警告、展开记录类型及报告发现逐文件保存在 JSON。所有“未独立验证”保留，不会因为解码或离散成功自动升级。
