// Run with qcadcmd.com -no-gui -autostart <this script> <absolute output directory>.
include("scripts/Tools/arguments.js");

function run() {
    var di = new RDocumentInterface(new RDocument(new RMemoryStorage(), new RSpatialIndexNavel()));
    var doc = di.getDocument();
    var name = "ARRAY_MARK";
    var block = new RBlock(doc, name, new RVector(2, 3, 0));
    di.applyOperation(new RAddObjectOperation(block));
    var id = doc.getBlockId(name);
    var line = new RLineEntity(doc, new RLineData(new RVector(2, 3, 0), new RVector(5, 3, 0)));
    line.setBlockId(id);
    di.applyOperation(new RAddObjectOperation(line, false));
    var array = new RBlockReferenceEntity(doc, new RBlockReferenceData(
        id, new RVector(10, 20, 0), new RVector(2, 1, 1), Math.PI / 2, 3, 2, 7, 11
    ));
    di.applyOperation(new RAddObjectOperation(array, false));
    if (array.getData().getColumnCount() !== 3 || array.getData().getRowCount() !== 2) {
        throw new Error("QCAD did not create a 3 x 2 array");
    }
    var directory = args[args.length - 1];
    if (!new QFileInfo(directory).isAbsolute()) {
        throw new Error("Use an absolute output directory");
    }
    var output = directory + "/";
    if (!di.exportFile(output + "qcad-array.dxf", "R12 (LT2) DXF [dxflib] (*.dxf)")) {
        throw new Error("QCAD dxflib export failed");
    }
    if (!di.exportFile(output + "qcad-array-pro.dxf", "R12 (LT2) DXF")) {
        throw new Error("QCAD Professional export failed");
    }
}
run();
