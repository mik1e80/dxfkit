param(
  [Parameter(Mandatory=$true)][string]$FreeCADCmd,
  [Parameter(Mandatory=$true)][string]$OpenSCAD
)
$ErrorActionPreference='Stop'
$dxfExportRoot=$PSScriptRoot
New-Item -ItemType Directory -Path (Join-Path $dxfExportRoot 'models') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $dxfExportRoot 'actual') -Force | Out-Null
$dxfPreviousOutput=$env:DXFKIT_CAD_OUTPUT
try {
  $env:DXFKIT_CAD_OUTPUT=$dxfExportRoot
  & $FreeCADCmd (Join-Path $dxfExportRoot 'export-freecad.py') 2>&1 | Tee-Object -FilePath (Join-Path $dxfExportRoot 'actual/freecad-export.log')
  if($LASTEXITCODE -ne 0){throw 'FreeCAD export failed'}
  & $OpenSCAD --version 2>&1 | Set-Content -LiteralPath (Join-Path $dxfExportRoot 'actual/openscad-version.log') -Encoding utf8
  if($LASTEXITCODE -ne 0){throw 'OpenSCAD version query failed'}
  & $OpenSCAD -o (Join-Path $dxfExportRoot 'models/03-openscad-rectangle.dxf') (Join-Path $dxfExportRoot 'sources/03-openscad-rectangle.scad') 2>&1 | Tee-Object -FilePath (Join-Path $dxfExportRoot 'actual/openscad-export.log')
  if($LASTEXITCODE -ne 0){throw 'OpenSCAD export failed'}
  foreach($dxfExportName in @('01-freecad-four-hole-plate','02-freecad-offset-ellipse','03-openscad-rectangle')){
    if(!(Test-Path -LiteralPath (Join-Path $dxfExportRoot ('models/'+$dxfExportName+'.dxf')))){throw "Missing export: $dxfExportName"}
  }
} finally {
  $env:DXFKIT_CAD_OUTPUT=$dxfPreviousOutput
}
# Regenerating CAD source files may change timestamps/handles. Inspect geometry before
# updating provenance hashes; this script never rewrites the verification expectations.
