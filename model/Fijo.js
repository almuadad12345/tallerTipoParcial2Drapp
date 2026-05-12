// ============================================
// MODELO - Subclase Fijo (hereda de Empleado)
// ============================================

class Fijo extends Empleado {

    constructor(cedula, nombreCompleto, direccion, correo, celular, sueldoBase, tipoBonificacion) {

        super(
            cedula,
            nombreCompleto,
            direccion,
            correo,
            celular,
            sueldoBase,
            'Fijo',
            tipoBonificacion
        );

        this.tiempoContrato = 'Indefinido';
    }
}
