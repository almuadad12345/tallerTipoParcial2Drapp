// ============================================
// MODELO - Subclase Contrato (hereda de Empleado)
// ============================================

class Contrato extends Empleado {

    constructor(cedula, nombreCompleto, direccion, correo, celular, sueldoBase, tipoBonificacion) {

        super(
            cedula,
            nombreCompleto,
            direccion,
            correo,
            celular,
            sueldoBase,
            'Contrato',
            tipoBonificacion
        );

        this.tiempoContrato = 'Definido';
    }
}
