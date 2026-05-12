// ============================================
// VISTA - Renderizado de tabla y utilidades UI
// ============================================

function formatearPeso(valor) {

    return '$' + Number(valor).toLocaleString('es-CO');
}

function pintarTabla() {

    const lista = obtenerLista();
    const tbody = document.getElementById('cuerpoTablaPersonal');
    const totEl = document.getElementById('celdaTotalNomina');

    if (lista.length === 0) {

        tbody.innerHTML = '<tr><td colspan="12" class="text-center text-muted fst-italic py-4">No hay empleados registrados aún.</td></tr>';
        totEl.textContent = formatearPeso(0);
        return;
    }

    let filas = '';

    lista.forEach(function (p, idx) {

        const obj   = new Empleado(
            p.cedula, p.nombreCompleto, p.direccion,
            p.correo, p.celular, p.sueldoBase,
            p.tipoContrato, p.tipoBonificacion
        );

        const total = obj.calcularSueldoTotal();

        filas += '<tr>'
               +   '<td>' + (idx + 1) + '</td>'
               +   '<td>' + p.cedula + '</td>'
               +   '<td>' + p.nombreCompleto + '</td>'
               +   '<td>' + p.direccion + '</td>'
               +   '<td>' + p.correo + '</td>'
               +   '<td>' + p.celular + '</td>'
               +   '<td>' + formatearPeso(p.sueldoBase) + '</td>'
               +   '<td>' + p.tipoContrato + '</td>'
               +   '<td><span class="badge bg-primary">' + p.tipoBonificacion + '</span></td>'
               +   '<td class="fw-bold text-success">' + formatearPeso(total) + '</td>'
               +   '<td>'
               +     '<button class="btn btn-warning btn-sm" onclick="abrirEdicion(\'' + p.cedula + '\')">'
               +       'Actualizar'
               +     '</button>'
               +   '</td>'
               +   '<td>'
               +     '<button class="btn btn-danger btn-sm" onclick="pedirEliminacion(\'' + p.cedula + '\')">'
               +       'Eliminar'
               +     '</button>'
               +   '</td>'
               + '</tr>';
    });

    tbody.innerHTML = filas;
    totEl.textContent = formatearPeso(hallarTotalNomina());
}
