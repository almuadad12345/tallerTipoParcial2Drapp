// ============================================
// MODELO - Clase Empleado (POO)
// ============================================

class Empleado {

    constructor(cedula, nombreCompleto, direccion, correo, celular, sueldoBase, tipoContrato, tipoBonificacion) {

        this.cedula           = cedula;
        this.nombreCompleto   = nombreCompleto;
        this.direccion        = direccion;
        this.correo           = correo;
        this.celular          = celular;
        this.sueldoBase       = Number(sueldoBase);
        this.tipoContrato     = tipoContrato;
        this.tipoBonificacion = tipoBonificacion;
    }

    // Calcula la adición según tipoBonificacion
    obtenerAdicion() {

        const tabla = { A: 200000, B: 150000, C: 100000, D: 50000 };

        return tabla[this.tipoBonificacion] ?? 0;
    }

    // sueldoTotal = sueldoBase + adicion
    calcularSueldoTotal() {

        return this.sueldoBase + this.obtenerAdicion();
    }
}
