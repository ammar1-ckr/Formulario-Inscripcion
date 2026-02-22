const form = document.getElementById('form-inscripcion');
const lista = document.getElementById('lista');
const mensajes = document.getElementById('mensajes');

const iNombre = document.getElementById('nombre');
const iCorreo = document.getElementById('correo');
const iTelefono = document.getElementById('telefono');
const iEdad = document.getElementById('edad');
const iFecha = document.getElementById('fecha');
const iActividad = document.getElementById('actividad');
const iCondiciones = document.getElementById('condiciones');

const eNombre = document.getElementById('error-nombre');
const eCorreo = document.getElementById('error-correo');
const eTelefono = document.getElementById('error-telefono');
const eEdad = document.getElementById('error-edad');
const eFecha = document.getElementById('error-fecha');
const eActividad = document.getElementById('error-actividad');
const eHorario = document.getElementById('error-horario');
const eComentarios = document.getElementById('error-comentarios');
const eCondiciones = document.getElementById('error-condiciones');

function limpiarMensajes() {
    mensajes.textContent = '';
    mensajes.className = 'mensajes';
}
function mostrarMensajeGeneral(texto, clase) {
    limpiarMensajes();
    mensajes.textContent = texto;
    mensajes.classList.add(clase);
}
function marcarError(campo, contenedor, texto) {
    if (campo) {
        campo.classList.remove('input-ok');
        campo.classList.add('input-error');
    }
    if (contenedor) contenedor.textContent = texto;
}
function marcarOk(campo, contenedor) {
    if (campo) {
        campo.classList.remove('input-error');
        campo.classList.add('input-ok');
    }
    if (contenedor) contenedor.textContent = '';
}

function msgHTML5(campo) {
    if (campo.validity.valueMissing) return 'Este campo es obligatorio';
    if (campo.validity.typeMismatch) return 'Formato no válido';
    if (campo.validity.patternMismatch) return 'El formato no coincide';
    if (campo.validity.tooShort) return `Mínimo ${campo.minLength} caracteres`;
    if (campo.validity.rangeUnderflow) return `El valor mínimo es ${campo.min}`;
    if (campo.validity.rangeOverflow) return `El valor máximo es ${campo.max}`;
    if (campo.validationMessage) return campo.validationMessage;
    return 'Valor incorrecto';
}
function validarHTML5(campo, errorBox) {
    if (campo.checkValidity()) { marcarOk(campo, errorBox); return true; }
    marcarError(campo, errorBox, msgHTML5(campo));
    return false;
}

function validarNombre() {
    const baseOk = validarHTML5(iNombre, eNombre);
    if (!baseOk) return false;
    const partes = iNombre.value.trim().split(/\s+/);
    if (partes.length < 2) {
        iNombre.setCustomValidity('Escribe nombre y apellido (mínimo 2 palabras)');
        marcarError(iNombre, eNombre, 'Escribe nombre y apellido (mínimo 2 palabras)');
        return false;
    }
    iNombre.setCustomValidity('');
    marcarOk(iNombre, eNombre);
    return true;
}

(function ponerMinHoy() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    iFecha.min = `${yyyy}-${mm}-${dd}`;
})();

function validarFecha() {
    const ok = validarHTML5(iFecha, eFecha);
    if (!ok) return false;
    const horario = document.querySelector('input[name="horario"]:checked');
    if (horario && horario.value === 'manana') {
        const d = new Date(iFecha.value + 'T00:00:00');
        const dia = d.getDay();
        if (dia === 0 || dia === 6) {
            marcarError(iFecha, eFecha, 'Para horario de mañana, elige un día laborable (L-V)');
            return false;
        }
    }
    marcarOk(iFecha, eFecha);
    return true;
}

function validarTelefono() {
    if (!iTelefono.value) { marcarOk(iTelefono, eTelefono); return true; }
    return validarHTML5(iTelefono, eTelefono);
}

function validarActividadVsEdad() {
    const okEdad = validarHTML5(iEdad, eEdad);
    const okAct = validarHTML5(iActividad, eActividad);
    if (!okEdad || !okAct) return false;
    const edad = Number(iEdad.value);
    if (edad < 18 && iActividad.value === 'css') {
        marcarError(iActividad, eActividad, 'CSS intermedio requiere ser mayor de 18');
        return false;
    }
    marcarOk(iActividad, eActividad);
    return true;
}

function validarHorario() {
    const elegido = document.querySelector('input[name="horario"]:checked');
    if (!elegido) { eHorario.textContent = 'Selecciona un horario'; return false; }
    eHorario.textContent = ''; return true;
}

function validarCondiciones() {
    if (!iCondiciones.checked) { eCondiciones.textContent = 'Debes aceptar las condiciones'; return false; }
    eCondiciones.textContent = ''; return true;
}

function validarFormulario() {
    let valido = true;
    if (!validarNombre()) valido = false;
    if (!validarHTML5(iCorreo, eCorreo)) valido = false;
    if (!validarTelefono()) valido = false;
    if (!validarHTML5(iEdad, eEdad)) valido = false;
    if (!validarFecha()) valido = false;
    if (!validarHTML5(iActividad, eActividad)) valido = false;
    if (!validarActividadVsEdad()) valido = false;
    if (!validarHorario()) valido = false;
    if (!validarCondiciones()) valido = false;
    return valido;
}

function textoActividad() {
    const opt = iActividad.options[iActividad.selectedIndex];
    return opt ? opt.textContent : '';
}
function anadirInscripcion() {
    const nombre = iNombre.value.trim();
    const correo = iCorreo.value.trim();
    const act = textoActividad();
    const horario = (document.querySelector('input[name="horario"]:checked') || {}).value || '';
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `${nombre} – ${act} (${correo}) - ${horario}`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Eliminar';
    btn.addEventListener('click', () => {
        li.remove();
        mostrarMensajeGeneral('Inscripción eliminada', 'mensaje-ok');
    });
    li.appendChild(span);
    li.appendChild(btn);
    lista.appendChild(li);
}

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    limpiarMensajes();
    [iNombre, iCorreo, iTelefono, iEdad, iFecha, iActividad].forEach(c => c.classList.remove('input-ok', 'input-error'));
    [eNombre, eCorreo, eTelefono, eEdad, eFecha, eActividad, eHorario, eComentarios, eCondiciones].forEach(e => e.textContent = '');
    const ok = validarFormulario();
    if (!ok) {
        mostrarMensajeGeneral('Hay errores. Revisa los campos marcados.', 'mensaje-error');
        const primero = document.querySelector('.input-error');
        if (primero && typeof primero.focus === 'function') primero.focus();
        return;
    }
    anadirInscripcion();
    mostrarMensajeGeneral('Inscripción añadida correctamente.', 'mensaje-ok');
    form.reset();
    [iNombre, iCorreo, iTelefono, iEdad, iFecha, iActividad].forEach(c => c.classList.remove('input-ok', 'input-error'));
});