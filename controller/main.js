// ============================================
// CONTROLADOR - Lógica CRUD + localStorage
// ============================================

const CLAVE_LS = 'drapps_personal_v1';

// ---------- API localStorage ----------

function obtenerLista() {

    const raw = localStorage.getItem(CLAVE_LS);

    return raw ? JSON.parse(raw) : [];
}

function persistirLista(lista) {

    localStorage.setItem(CLAVE_LS, JSON.stringify(lista));
}

// ---------- CRUD ----------

function registrarEmpleado(instancia) {

    const lista  = obtenerLista();
    const existe = lista.some(p => String(p.cedula) === String(instancia.cedula));

    if (existe) {
        return { exito: false, mensaje: 'Ya existe un empleado con esa cédula.' };
    }

    lista.push(instancia);
    persistirLista(lista);

    return { exito: true };
}

function modificarEmpleado(cedulaOriginal, datos) {

    const lista = obtenerLista();
    const pos   = lista.findIndex(p => String(p.cedula) === String(cedulaOriginal));

    if (pos === -1) {
        return { exito: false, mensaje: 'Empleado no encontrado.' };
    }

    lista[pos] = { ...lista[pos], ...datos };
    persistirLista(lista);

    return { exito: true };
}

function removerEmpleado(cedula) {

    const lista = obtenerLista().filter(p => String(p.cedula) !== String(cedula));

    persistirLista(lista);
}

function buscarPorTexto(termino) {

    const t = termino.toLowerCase().trim();

    return obtenerLista().filter(p =>
        String(p.cedula).includes(t) ||
        p.nombreCompleto.toLowerCase().includes(t)
    );
}

// Calcula el total de la nómina mensual
function hallarTotalNomina() {

    return obtenerLista().reduce((acum, p) => {

        const obj = new Empleado(
            p.cedula, p.nombreCompleto, p.direccion,
            p.correo, p.celular, p.sueldoBase,
            p.tipoContrato, p.tipoBonificacion
        );

        return acum + obj.calcularSueldoTotal();

    }, 0);
}

// ---------- Inicializar al cargar la página ----------

document.addEventListener('DOMContentLoaded', function () {

    pintarTabla();
});

// ---------- Leer campos del formulario ----------

function leerCamposFormulario() {

    return {
        cedula:           document.getElementById('campoCedula').value.trim(),
        nombreCompleto:   document.getElementById('campoNombreCompleto').value.trim(),
        direccion:        document.getElementById('campoDireccion').value.trim(),
        correo:           document.getElementById('campoCorreo').value.trim(),
        celular:          document.getElementById('campoCelular').value.trim(),
        sueldoBase:       document.getElementById('campoSueldoBase').value.trim(),
        tipoContrato:     document.getElementById('campoTipoContrato').value,
        tipoBonificacion: document.getElementById('campoBonificacion').value,
    };
}

function limpiarFormulario() {

    ['campoCedula', 'campoNombreCompleto', 'campoDireccion',
     'campoCorreo', 'campoCelular', 'campoSueldoBase'].forEach(function (id) {

        document.getElementById(id).value = '';
    });

    document.getElementById('campoTipoContrato').value   = 'Fijo';
    document.getElementById('campoBonificacion').value   = 'A';
    document.getElementById('campoIdEdicion').value      = '';
}

// ---------- Mostrar / ocultar panel registro (div oculto) ----------

function togglePanelRegistro() {

    const panel   = document.getElementById('panelRegistro');
    const visible = panel.style.display === 'block';

    if (visible) {

        panel.style.display = 'none';
        limpiarFormulario();

    } else {

        document.getElementById('tituloPanel').textContent        = 'Registro de Nuevo Empleado';
        document.getElementById('campoCedula').disabled           = false;
        panel.style.display = 'block';
    }
}

function ocultarPanel() {

    document.getElementById('panelRegistro').style.display = 'none';
    limpiarFormulario();
}

// ---------- Guardar nuevo empleado ----------

function procesarGuardado() {

    const d = leerCamposFormulario();

    if (!d.cedula || !d.nombreCompleto || !d.direccion || !d.correo || !d.celular || !d.sueldoBase) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Instanciar subclase correcta
    const nuevo = d.tipoContrato === 'Fijo'
        ? new Fijo(d.cedula, d.nombreCompleto, d.direccion, d.correo, d.celular, d.sueldoBase, d.tipoBonificacion)
        : new Contrato(d.cedula, d.nombreCompleto, d.direccion, d.correo, d.celular, d.sueldoBase, d.tipoBonificacion);

    const resp = registrarEmpleado(nuevo);

    if (!resp.exito) {
        alert(resp.mensaje);
        return;
    }

    alert('Empleado registrado correctamente.');
    ocultarPanel();
    pintarTabla();
}

// ---------- Abrir modal de edición ----------

function abrirEdicion(cedula) {

    const reg = obtenerLista().find(p => String(p.cedula) === String(cedula));

    if (!reg) {
        alert('No se encontró el empleado.');
        return;
    }

    document.getElementById('editCedula').value          = reg.cedula;
    document.getElementById('editNombre').value          = reg.nombreCompleto;
    document.getElementById('editDireccion').value       = reg.direccion;
    document.getElementById('editCorreo').value          = reg.correo;
    document.getElementById('editCelular').value         = reg.celular;
    document.getElementById('editSueldo').value          = reg.sueldoBase;
    document.getElementById('editTipoContrato').value    = reg.tipoContrato;
    document.getElementById('editBonificacion').value    = reg.tipoBonificacion;

    new bootstrap.Modal(document.getElementById('ventanaEdicion')).show();
}

// ---------- Confirmar edición ----------

function confirmarEdicion() {

    const cedula = document.getElementById('editCedula').value;

    const datos = {
        nombreCompleto:   document.getElementById('editNombre').value.trim(),
        direccion:        document.getElementById('editDireccion').value.trim(),
        correo:           document.getElementById('editCorreo').value.trim(),
        celular:          document.getElementById('editCelular').value.trim(),
        sueldoBase:       Number(document.getElementById('editSueldo').value),
        tipoContrato:     document.getElementById('editTipoContrato').value,
        tipoBonificacion: document.getElementById('editBonificacion').value,
    };

    if (!datos.nombreCompleto || !datos.direccion || !datos.correo || !datos.celular || !datos.sueldoBase) {
        alert('Completa todos los campos antes de actualizar.');
        return;
    }

    const resp = modificarEmpleado(cedula, datos);

    if (!resp.exito) {
        alert(resp.mensaje);
        return;
    }

    bootstrap.Modal.getInstance(document.getElementById('ventanaEdicion')).hide();
    alert('Empleado actualizado correctamente.');
    pintarTabla();
}

// ---------- Eliminar ----------

function pedirEliminacion(cedula) {

    const reg = obtenerLista().find(p => String(p.cedula) === String(cedula));

    if (!reg) return;

    if (!confirm('¿Confirmas que deseas eliminar a "' + reg.nombreCompleto + '" (CC: ' + cedula + ')?')) return;

    removerEmpleado(cedula);
    alert('Empleado eliminado.');
    pintarTabla();
}

// ---------- Buscar (modal) ----------

function ejecutarBusqueda() {

    const termino = document.getElementById('terminoBusqueda').value.trim();
    const zona    = document.getElementById('zonaBusqueda');

    if (!termino) {
        zona.innerHTML = '<p class="text-warning small">Escribe algo para buscar.</p>';
        return;
    }

    const hallados = buscarPorTexto(termino);

    if (hallados.length === 0) {
        zona.innerHTML = '<div class="alert alert-danger py-2">No se encontraron resultados.</div>';
        return;
    }

    let html = '';

    hallados.forEach(function (p) {

        const obj = new Empleado(
            p.cedula, p.nombreCompleto, p.direccion,
            p.correo, p.celular, p.sueldoBase,
            p.tipoContrato, p.tipoBonificacion
        );

        html += '<div class="card mb-2">'
              +   '<div class="card-body py-2 px-3">'
              +     '<div class="d-flex justify-content-between">'
              +       '<span class="fw-bold">' + p.nombreCompleto + '</span>'
              +       '<span class="text-success fw-bold">' + formatearPeso(obj.calcularSueldoTotal()) + '</span>'
              +     '</div>'
              +     '<small class="text-muted">CC: ' + p.cedula + ' | ' + p.correo + ' | Bono: ' + p.tipoBonificacion + ' | ' + p.tipoContrato + '</small>'
              +   '</div>'
              + '</div>';
    });

    zona.innerHTML = html;
}
