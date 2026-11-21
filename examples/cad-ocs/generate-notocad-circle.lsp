; Native UCS and CIRCLE commands create the model. DXFOUT writes ASCII R12.
(setvar "DXFVERSION" "R12")
(command "UCS" "3point" '(3.0 4.0 5.0) '(4.0 4.0 5.0) '(3.0 4.8 4.4))
(command "CIRCLE" '(3.0 4.0 5.0) 2.0)
(dxfout "examples/cad-ocs/notocad-tilted-circle.dxf")
