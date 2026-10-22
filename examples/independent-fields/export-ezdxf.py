"""Export an independent field oracle; does not invoke dxfkit or rewrite any DXF."""
import argparse, hashlib, json, math, sys
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument('--dependency-dir')
args=p.parse_args()
if args.dependency_dir: sys.path.insert(0, args.dependency_dir)
import ezdxf
assert ezdxf.__version__ == '1.4.4'
root=Path(__file__).resolve().parents[2]
files=['circle_radius_le_0.dxf','uncommon.dxf','insert_bricscad_level_1.dxf','VP4.dxf','viewports.dxf']
results=[]
for name in files:
    file=root/'testdata/ezdxf'/name
    doc=ezdxf.readfile(file)
    rows=[]
    for e in doc.entities:
        kind=e.dxftype(); d=e.dxf; h=d.handle
        if kind=='LINE': values=[*d.start,*d.end]
        elif kind=='CIRCLE': values=[*d.center,d.radius]
        elif kind=='ARC': values=[*d.center,d.radius,math.radians(d.start_angle),math.radians(d.end_angle)]
        elif kind=='ELLIPSE': values=[*d.center,*d.major_axis,d.ratio,d.start_param,d.end_param]
        elif kind=='INSERT': values=[d.name,*d.insert,d.xscale,d.yscale,d.zscale,math.radians(d.rotation)]
        elif kind=='LWPOLYLINE': values=[bool(e.closed),len(e)]; rows.append({'kind':kind,'handle':h,'values':values,'vertices':[list(p) for p in e.get_points('xyb')]}); continue
        else: continue
        rows.append({'kind':kind,'handle':h,'values':values})
    results.append({'file':'testdata/ezdxf/'+name,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'acadver':doc.dxfversion,'cad_exporter_version':None,'export_settings':None,'external_manual_dimensions':None,'rows':rows})
record={'oracle':'ezdxf','version':ezdxf.__version__,'scope':'Existing 5 external corpus inputs, ENTITIES declared fields including model/paper space, excluding BLOCKS content. No OCS transforms, layout rendering, geometry truth or full compatibility; not new CAD exports.','files':results}
out=Path(__file__).with_name('ezdxf-fields.json')
out.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Exported',sum(len(f['rows']) for f in results),'field records from',len(results),'existing external files')
