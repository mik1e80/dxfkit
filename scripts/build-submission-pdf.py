"""Build the one-page project brief. Requires reportlab and an embeddable CJK TTF/TTC."""
import argparse
from pathlib import Path
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--font', required=True, help='CJK TrueType font, e.g. Microsoft YaHei or Noto Sans SC TTF')
parser.add_argument('--bold-font')
args = parser.parse_args()
pdfmetrics.registerFont(TTFont('CJK', args.font))
pdfmetrics.registerFont(TTFont('CJK-Bold', args.bold_font or args.font))
pdfmetrics.registerFontFamily('CJK', normal='CJK', bold='CJK-Bold', italic='CJK', boldItalic='CJK-Bold')
output = ROOT / 'output/pdf/dxfkit-submission-one-page.pdf'
output.parent.mkdir(parents=True, exist_ok=True)
navy, teal, muted = colors.HexColor('#16324B'), colors.HexColor('#087E83'), colors.HexColor('#526375')
body = ParagraphStyle('body', fontName='CJK', fontSize=9.4, leading=15.2, textColor=navy, wordWrap='CJK', alignment=TA_LEFT)
small = ParagraphStyle('small', parent=body, fontSize=8, leading=12.5, textColor=muted)
heading = ParagraphStyle('heading', parent=body, fontName='CJK-Bold', fontSize=11, leading=17, textColor=teal, spaceBefore=10, spaceAfter=4)
title = ParagraphStyle('title', parent=body, fontName='CJK-Bold', fontSize=25, leading=32)
subtitle = ParagraphStyle('subtitle', parent=body, fontSize=12, leading=19)
story = []
def p(text, style=body):
    story.append(Paragraph(text, style))
def section(label, text):
    p(label, heading)
    p(text)

p('dxfkit', title)
p('MoonBit ASCII DXF 读取与二维轮廓辅助检查库', subtitle)
p('项目申报简版  |  工业软件 / 开发者工具  |  材料修订：2026-10-22', small)
story.append(Spacer(1, 10))
facts = Table([[Paragraph('输入<br/><b>ASCII DXF</b>', body), Paragraph('输出<br/><b>数据模型 / XY 轮廓 / 诊断 / SVG</b>', body), Paragraph('入口<br/><b>库 / CLI / 浏览器</b>', body)]], colWidths=[105, 253, 153])
facts.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#EEF5F7')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
story.append(facts)
section('01  解决的问题与交付终点', '为 MoonBit 开发者提供从 DXF 原始记录、实体字段到二维轮廓的可复用调用链，并辅助发现开放边界、重复路径、自交、退化及指定净距问题。用于图纸读取、预览和 CAM 前人工复核；输出明确标示未检查内容，不承诺图纸可以直接加工。')
section('02  明确的能力边界', '<b>七类核心轮廓：</b>LINE、CIRCLE、ARC、ELLIPSE、LWPOLYLINE、普通二维 POLYLINE、受限 SPLINE。另支持默认 OCS、零厚度、同 Z 角点的 SOLID/TRACE 边界，以及普通 INSERT 的 XY 展开、图层继承和最多 8 层嵌套。<br/><b>未覆盖：</b>二进制 DXF、写回、完整 OCS、其余阵列实例、填充/标注/字体轮廓重建及通用三维面/体。读取成功、实体解码和几何已验证分层表述，撤回 R10-R2018 完整覆盖承诺。')
section('03  开发者接口与生态价值', '公开提供 scan_tags / build_drawing、Drawing::expand、Entity::flatten_checked 和 Drawing::check。报告通过 has_incomplete_checks 标识恢复、覆盖限制和离散失败；CLI --strict 可拦截。独立 MoonBit 工程无需复制实现或依赖网页。与 MoonBit 的 STEP、通用二维几何、G-code、位图描摹和 Gerber 项目存在交集，本库的组合价值是 <b>DXF 数据模型 + 块展开 + 带来源轮廓 + 完整性诊断</b>。')
section('04  模型、证据与正确性验证', '<b>十类参数化模型</b>覆盖矩形、四孔板、圆弧、椭圆、bulge、样条、块变换、多图层、错误图及覆盖边界；在 examples/model-validation 保存 DXF、设计真值、公开接口数据、报告、SVG、解析 CSV 和总结，10/10 通过针对性断言。另保留已有 CLI 与库正确性证据。bulge 未做 CAD 目视确认，样条参考为独立 Bernstein 采样，未做外部 CAD 导出对照。<br/><b>47 个第三方 DXF</b>保留来源与逐文件分层记录；独立逐图纸几何真值仍为 0/47，不称为标准兼容认证。')
section('05  统一申报版本与复现', '代码、README、本页 PDF、模型和证据统一收录于 <b>submission-0.1.1-20261022</b>；提交 SHA 以该标签及同提交 CI / Pages 的 release.json、verification.json 为准。固定 MoonBit 发行包 0.10.14+7d59c7ec9、Node 24.19.0；最终完整 CI 通过后建立该标签，平时按改动轻量验证。源码版本 0.1.1 尚未完成对应 Mooncakes 发布；Apache-2.0，外部语料许可单列。')
story.append(Spacer(1, 12))
p('<b>源码与材料：</b><link href="https://github.com/mik1e80/dxfkit" color="#087E83">github.com/mik1e80/dxfkit</link>　　<b>在线演示：</b><link href="https://mik1e80.github.io/dxfkit/" color="#087E83">mik1e80.github.io/dxfkit</link>', small)
p('分层能力、实际报告、独立对照、复现命令与退回意见响应统一收录于仓库 docs/resubmission-evidence.md。', small)

def page(canvas, doc):
    canvas.setStrokeColor(teal)
    canvas.setLineWidth(3)
    canvas.line(42, A4[1]-28, A4[0]-42, A4[1]-28)
    canvas.setFont('CJK', 7)
    canvas.setFillColor(muted)
    canvas.drawString(42, 24, 'DXFKit  /  范围、证据与限制均可复核')
    canvas.drawRightString(A4[0]-42, 24, f'{doc.page}')

doc = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=42, bottomMargin=40, title='DXFKit 项目申报简版', author='mik1e80', pageCompression=1)
doc.build(story, onFirstPage=page, onLaterPages=page)
print(output)
