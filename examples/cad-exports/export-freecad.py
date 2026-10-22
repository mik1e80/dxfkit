"""Run with FreeCADCmd 1.1.3. Uses FreeCAD's native DXF exporter, not ezdxf."""
import json
import os
import pathlib
import FreeCAD as App
import Part
import Import

root = pathlib.Path(os.environ['DXFKIT_CAD_OUTPUT']).resolve()
(root / 'sources').mkdir(parents=True, exist_ok=True)
(root / 'models').mkdir(exist_ok=True)
records = []

def export_model(name, shapes, truth):
    doc = App.newDocument(name.replace('-', '_'))
    objects = []
    for i, shape in enumerate(shapes):
        ob = doc.addObject('Part::Feature', 'Contour' + str(i))
        ob.Shape = shape
        objects.append(ob)
    doc.recompute()
    doc.saveAs(str(root / 'sources' / (name + '.FCStd')))
    # R14, native C++ exporter; do not force curves to polylines.
    # Use a dedicated option source rather than personal Draft preferences.
    Import.writeDXFObject(objects, str(root / 'models' / (name + '.dxf')), 14, False,
                          'User parameter:DXFKitCADExport')
    measured = []
    for ob in objects:
        b = ob.Shape.BoundBox
        measured.append({'bounds': [b.XMin, b.YMin, b.XMax, b.YMax],
                         'length': ob.Shape.Length, 'closed': ob.Shape.isClosed(),
                         'edges': len(ob.Shape.Edges)})
    records.append({'id': name, 'truth': truth, 'occ_measurements': measured})
    App.closeDocument(doc.Name)

V = App.Vector
corners = [V(0,0,0), V(100,0,0), V(100,60,0), V(0,60,0), V(0,0,0)]
centers = [[10,10], [90,10], [90,50], [10,50]]
holes = [Part.Wire([Part.makeCircle(3, V(x,y,0))]) for x,y in centers]
export_model('01-freecad-four-hole-plate', [Part.makePolygon(corners)] + holes,
             {'unit': 'mm', 'outer_bounds': [0,0,100,60], 'outer_edges': 4,
              'outer_area': 6000, 'hole_centers': centers, 'radius': 3,
              'outer_clearance': 7})
ellipse = Part.Ellipse(V(10,20,0), 10, 5)
export_model('02-freecad-offset-ellipse', [Part.Wire([ellipse.toShape()])],
             {'unit': 'mm', 'center': [10,20], 'major_vector': [10,0],
              'ratio': 0.5, 'bounds': [0,15,20,25]})
(root / 'freecad-export.json').write_text(json.dumps({
    'application': 'FreeCAD', 'version': App.Version(), 'gui_used': False,
    'exporter': 'Import.writeDXFObject', 'dxf_version': 14,
    'use_polyline_override': False, 'option_source': 'User parameter:DXFKitCADExport',
    'models': records,
}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Exported two models with actual FreeCAD native DXF exporter')
