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
p('MoonBit ASCII DXF R12 记录读取与二维轮廓辅助检查库', subtitle)
p('项目说明  |  工业软件 / 开发者工具  |  正式发布 0.2.1', small)
story.append(Spacer(1, 10))
facts = Table([[Paragraph('基线<br/><b>ASCII R12 / AC1009</b>', body), Paragraph('输出<br/><b>原始记录 / WCS XYZ / 轮廓 / 诊断</b>', body), Paragraph('入口<br/><b>库 / CLI / 浏览器</b>', body)]], colWidths=[125, 233, 153])
facts.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#EEF5F7')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
story.append(facts)
section('01  用途与读取范围', '面向 MoonBit 图纸导入、预览和 CAM 前人工复核。以 ASCII DXF R12（AC1009）为基线，在读取预算内保留源字节、有序组码、重复及未知字段、XDATA 和结构记录，并诊断段、表、块与子实体序列问题。已校验的字段及实体语义见兼容矩阵。')
section('02  坐标、轮廓与检查边界', '适用实体从 OCS 转为 WCS 并保留 XYZ。INSERT 支持行列阵列、三维基点、缩放、旋转、八层内嵌套和实例来源。对位于 WCS Z=0 容差内的受支持轮廓检查闭合、自交、共线重叠、退化和指定净距。损坏、未覆盖内容和预算截断会报告检查不完整。项目范围限 ASCII DXF 读取与受支持的二维辅助检查。')
section('03  接口与使用入口', 'MoonBit API、CLI 和在线预览共用核心实现，提供原始记录、坐标及块实例、二维轮廓、诊断和 SVG。CLI 严格模式可在检查不完整时返回失败。可通过 Mooncakes 安装 mik1e80/dxfkit@0.2.1。项目采用 Apache-2.0，第三方代码及语料分别记录许可。')
section('04  案例与独立对照', '十类参数模型和十四个输入边界案例保存预期与实际结果。BricsCAD V20.1.08 原生 R12 开放三次 B 样条导出的 56 个样点全部在容差内，最大偏差约 2.18×10<super>-15</super> 图纸单位。47 份 ezdxf 文件用于分层回归，字段对照、几何验证与样例来源分别记录。')
section('05  固定源码与完整 CI', '<b>v0.2.1</b> 对应源码 <b>e07ec17f478628d38d3558b1bcf7532e55191c86</b>。<br/>完整 CI #45405781541 已通过该提交的构建及 Wasm、JavaScript、Native、Wasm GC 四后端测试。Mooncakes 0.2.1 和线上演示使用同一源码。演示页面保留其部署时的定向记录，完整结果见 CI。')
story.append(Spacer(1, 12))
p('<link href="https://github.com/mik1e80/dxfkit/tree/v0.2.1" color="#087E83">GitHub v0.2.1</link>　·　<link href="https://github.com/mik1e80/dxfkit/actions/runs/45405781541" color="#087E83">完整 CI</link>　·　<link href="https://mooncakes.io/docs/mik1e80/dxfkit%400.2.1" color="#087E83">Mooncakes 0.2.1</link>　·　<link href="https://mik1e80.github.io/dxfkit/" color="#087E83">线上演示</link>　·　<link href="https://github.com/mik1e80/dxfkit/blob/main/docs/acceptance-0.2.1.md" color="#087E83">验收说明</link>', small)
p('历史材料见 <link href="https://github.com/mik1e80/dxfkit/blob/submission-0.1.1-20261022-r2/output/pdf/dxfkit-submission-one-page.pdf" color="#087E83">r2 原版 PDF</link>（源码 94509f3）。', small)

def page(canvas, doc):
    canvas.setStrokeColor(teal)
    canvas.setLineWidth(3)
    canvas.line(42, A4[1]-28, A4[0]-42, A4[1]-28)
    canvas.setFont('CJK', 7)
    canvas.setFillColor(muted)
    canvas.drawString(42, 24, 'DXFKit  /  范围、证据与限制均可复核')
    canvas.drawRightString(A4[0]-42, 24, f'{doc.page}')

doc = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=42, bottomMargin=40, title='dxfkit 0.2.1 项目说明', author='mik1e80', pageCompression=1)
doc.build(story, onFirstPage=page, onLaterPages=page)
print(output)
