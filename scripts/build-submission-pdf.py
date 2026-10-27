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
p('项目说明  |  工业软件 / 开发者工具  |  0.2.0 开发候选  |  修订：2026-10-27', small)
story.append(Spacer(1, 10))
facts = Table([[Paragraph('基线<br/><b>ASCII R12 / AC1009</b>', body), Paragraph('输出<br/><b>原始记录 / WCS XYZ / 轮廓 / 诊断</b>', body), Paragraph('入口<br/><b>库 / CLI / 浏览器</b>', body)]], colWidths=[125, 233, 153])
facts.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#EEF5F7')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
story.append(facts)
section('01  用途与明确的读取终点', '面向 MoonBit 图纸导入、预览和 CAM 前人工复核，提供 ASCII DXF 源字节、有序原始记录、选择性实体字段、坐标与辅助报告。AC1009 选择 R12 记录读取配置；其他版本尽力读取。诊断孤立子记录、错误所在段及序列中断。<b>保留记录不等于全部 R12 必填字段和关联语义已验证</b>，不再承诺完整跨版本兼容。')
section('02  坐标、轮廓与检查边界', 'OCS 转为 WCS 并保留 XYZ；INSERT 支持全部行列、三维基点、缩放、旋转、八层内嵌套和实例来源。七类既有核心轮廓及受限 SOLID/TRACE 可离散，非 R12 扩展单列。只有适用 WCS Z=0 平面的轮廓进入闭合、自交、重复、退化和净距检查。<br/><b>未完成：</b>全部字段/引用符合性、完整关联属性/视口/网格/字形/标注语义；不提供写回、DWG、刀路或可加工性认证。覆盖不足、损坏和预算截断必须报告不完整。')
section('03  可调用接口与生态差异', '公开提供 read_document、Drawing::expand_world、Entity::flatten_checked 和 Drawing::check；完整性由 has_incomplete_checks 表达，CLI --strict 可拦截。核心仅依赖 MoonBit core。MoonBit 已有基本 DXF 读写模块和通用几何库，本库的独立贡献是 <b>有来源记录 + 坐标/块阵列 + 受限轮廓 + 完整性诊断</b> 的组合，不宣称唯一或全面替代。')
section('04  实测、外部参照与修复', '六份 AC1009 自建模型核对 22 实例、132 坐标分量；十类模型保存实际数据、报告和 SVG。第三方阵列专项核对 25 个 FLAG 的 100 个 WCS 顶点及 25 个圆采样，另由 ezdxf 1.4.4 作格式审计，两种证据角色分开。旋转阵列端点接触的 15 条假自交已用反例定位修复，真交叉仍检出。<br/>47 文件整图独立真值仍为 0/47，部分实体对照单列；既有三份 CAD 导出记录保留，不冒充本轮新导出。')
section('05  同一源码身份与复现', '当前 main 中的 <b>未发布 0.2.0 开发候选</b>一并保存代码、README、项目说明、本页 PDF 及证据；精确 SHA 以同提交 CI 的 source_commit 核对。默认 CI 为 <b>targeted-r12 / full_suite_run=false</b>，包含相关测试和两个曾失败的语料回归，不冒充整仓库全量。固定 SDK 0.10.14+7d59c7ec9、Node 24.19.0。<br/>Mooncakes <b>0.1.1 已发布</b>；旧 r2 标签及线上演示保持原身份。当前不发布新包、不移动标签、不更新报名表。项目采用 Apache-2.0，上游许可与参考范围单列。')
story.append(Spacer(1, 12))
p('<b>源码与材料：</b><link href="https://github.com/mik1e80/dxfkit" color="#087E83">github.com/mik1e80/dxfkit</link>　　<b>在线演示：</b><link href="https://mik1e80.github.io/dxfkit/" color="#087E83">mik1e80.github.io/dxfkit</link>', small)
p('范围矩阵、实际结果及退回响应见 docs/resubmission-evidence.md；Gitlink同步和报名状态仍由参赛者核对。', small)

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
