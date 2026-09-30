const form = document.querySelector('#inscripcion');
const campoSede = document.getElementById('campo-sede');
const confirmacion = document.getElementById('confirmacion');
const fuerzaCaja = document.getElementById('clave-fuerza');
const fuerzaRelleno = document.getElementById('fuerza-relleno');
const fuerzaTexto = document.getElementById('fuerza-texto');
const contador = document.getElementById('comentarios-contador');
const tocados = new Set();

const reglas = {
  nombre: (v) => {
    const valor = v.trim();
    if (!valor) return 'Escribe tu nombre y apellido.';
    if (valor.length < 5 || valor.length > 60) return 'El nombre debe tener entre 5 y 60 caracteres.';
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+)+$/.test(valor)) {
      return 'Escribe tu nombre y apellido.';
    }
    return true;
  },

  cedula: (v) =>
    /^([1-9]|1[0-3]|PE|E|N)-\d{1,4}-\d{1,6}$/i.test(v.trim()) ||
    'Usa el formato 8-123-4567.',

  correo: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ||
    'Usa un correo como nombre@dominio.com.',

  celular: (v) =>
    /^6\d{3}-?\d{4}$/.test(v.trim()) ||
    'El celular debe tener 8 dígitos y empezar con 6.',

  nacimiento: (v) => {
    if (!v) return 'Debes tener al menos 16 años.';
    const partes = v.split('-').map(Number);
    if (partes.length !== 3 || partes.some((n) => Number.isNaN(n))) {
      return 'Debes tener al menos 16 años.';
    }
    const fecha = new Date(partes[0], partes[1] - 1, partes[2]);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha > hoy) return 'La fecha de nacimiento no puede ser futura.';

    const limite = new Date();
    limite.setFullYear(limite.getFullYear() - 16);
    if (fecha > limite) return 'Debes tener al menos 16 años.';
    return true;
  },

  curso: (v) => (v !== '' && v !== 'Selecciona un curso') || 'Elige un curso.',

  modalidad: (v) => v === 'presencial' || v === 'virtual' || 'Elige una modalidad.',

  sede: (v) => {
    if (modalidadActual() !== 'presencial') return true;
    return v !== '' || 'Elige una sede.';
  },

  clave: (v) => {
    const falta = [];
    if (v.length < 8) falta.push('8 caracteres');
    if (!/[A-Z]/.test(v)) falta.push('una mayúscula');
    if (!/[a-z]/.test(v)) falta.push('una minúscula');
    if (!/\d/.test(v)) falta.push('un número');
    if (!/[^A-Za-z0-9]/.test(v)) falta.push('un símbolo');
    return falta.length === 0 || `Te falta: ${falta.join(', ')}.`;
  },

  confirmar: (v) =>
    (v.length > 0 && v === form.clave.value) ||
    'Las contraseñas no coinciden.',

  comentarios: (v) =>
    v.length <= 200 || 'Máximo 200 caracteres.',

  terminos: (v) => v === true || 'Debes aceptar los términos.',
};

function modalidadActual() {
  const elegido = form.querySelector('input[name="modalidad"]:checked');
  return elegido ? elegido.value : '';
}

function valorDe(input) {
  if (input.type === 'checkbox') return input.checked;
  if (input.type === 'radio') return modalidadActual();
  return input.value;
}

function errorDe(input) {
  return document.getElementById(`${input.name}-error`);
}

function validarCampo(input) {
  const regla = reglas[input.name];
  if (!regla) return true;

  if (input.name === 'sede' && modalidadActual() !== 'presencial') {
    limpiarError(input);
    return true;
  }

  const resultado = regla(valorDe(input));
  const valido = resultado === true;
  const error = errorDe(input);

  if (input.type === 'radio') {
    form.querySelectorAll('input[name="modalidad"]').forEach((radio) => {
      radio.setAttribute('aria-invalid', String(!valido));
    });
  } else {
    input.setAttribute('aria-invalid', String(!valido));
  }

  if (error) error.textContent = valido ? '' : resultado;
  return valido;
}

function limpiarError(input) {
  input.removeAttribute('aria-invalid');
  const error = errorDe(input);
  if (error) error.textContent = '';
}

function camposConRegla() {
  const vistos = new Set();
  return [...form.elements].filter((el) => {
    if (!reglas[el.name] || vistos.has(el.name)) return false;
    if (el.name === 'sede' && modalidadActual() !== 'presencial') return false;
    vistos.add(el.name);
    return true;
  });
}

function actualizarSede() {
  const presencial = modalidadActual() === 'presencial';
  campoSede.hidden = !presencial;

  if (!presencial) {
    form.sede.value = '';
    tocados.delete('sede');
    limpiarError(form.sede);
  } else if (tocados.has('sede') || tocados.has('modalidad')) {
    validarCampo(form.sede);
  }
}

function actualizarFuerza(valor) {
  let puntos = 0;
  if (valor.length >= 8) puntos += 1;
  if (/[A-Z]/.test(valor)) puntos += 1;
  if (/[a-z]/.test(valor)) puntos += 1;
  if (/\d/.test(valor)) puntos += 1;
  if (/[^A-Za-z0-9]/.test(valor)) puntos += 1;

  fuerzaCaja.hidden = valor.length === 0;
  fuerzaCaja.classList.remove('fuerza--debil', 'fuerza--media', 'fuerza--fuerte');

  if (!valor) {
    fuerzaTexto.textContent = '';
    return;
  }

  if (puntos <= 2) {
    fuerzaCaja.classList.add('fuerza--debil');
    fuerzaTexto.textContent = 'Fuerza: débil';
  } else if (puntos <= 4) {
    fuerzaCaja.classList.add('fuerza--media');
    fuerzaTexto.textContent = 'Fuerza: media';
  } else {
    fuerzaCaja.classList.add('fuerza--fuerte');
    fuerzaTexto.textContent = 'Fuerza: fuerte';
  }
}

function actualizarContador() {
  const largo = form.comentarios.value.length;
  contador.textContent = `${largo} / 200`;
  contador.classList.toggle('alerta', largo >= 180 && largo < 200);
  contador.classList.toggle('limite', largo >= 200);
}

function mostrarConfirmacion(datos) {
  confirmacion.textContent = '';

  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta';

  const titulo = document.createElement('h2');
  titulo.textContent = 'Inscripción recibida';

  const texto = document.createElement('p');
  texto.textContent = 'Tus datos se registraron sin recargar la página. La contraseña no se muestra.';

  const lista = document.createElement('dl');
  const filas = [
    ['Nombre', datos.get('nombre')],
    ['Cédula', datos.get('cedula')],
    ['Correo', datos.get('correo')],
    ['Celular', datos.get('celular')],
    ['Fecha de nacimiento', datos.get('nacimiento')],
    ['Curso', datos.get('curso')],
    ['Modalidad', datos.get('modalidad')],
  ];

  if (datos.get('modalidad') === 'presencial') {
    filas.push(['Sede', datos.get('sede')]);
  }

  const comentarios = (datos.get('comentarios') || '').trim();
  if (comentarios) filas.push(['Comentarios', comentarios]);

  filas.forEach(([etiqueta, valor]) => {
    const dt = document.createElement('dt');
    dt.textContent = etiqueta;
    const dd = document.createElement('dd');
    dd.textContent = valor;
    lista.append(dt, dd);
  });

  tarjeta.append(titulo, texto, lista);
  confirmacion.append(tarjeta);
}

function reiniciarEstado() {
  tocados.clear();
  campoSede.hidden = true;
  actualizarFuerza('');
  actualizarContador();
  [...form.elements].forEach((el) => {
    if (el.name) limpiarError(el);
  });
}

form.addEventListener('blur', (e) => {
  if (!reglas[e.target.name]) return;
  tocados.add(e.target.name);
  validarCampo(e.target);
}, true);

form.addEventListener('input', (e) => {
  if (e.target.name === 'clave') {
    actualizarFuerza(e.target.value);
    if (tocados.has('confirmar')) validarCampo(form.confirmar);
  }

  if (e.target.name === 'comentarios') actualizarContador();

  if (tocados.has(e.target.name)) validarCampo(e.target);
});

form.addEventListener('change', (e) => {
  if (e.target.name === 'modalidad') {
    tocados.add('modalidad');
    validarCampo(e.target);
    actualizarSede();
  }

  if (e.target.name === 'curso' || e.target.name === 'sede' || e.target.name === 'terminos') {
    tocados.add(e.target.name);
    validarCampo(e.target);
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const campos = camposConRegla();
  campos.forEach((el) => tocados.add(el.name));

  const invalidos = campos.filter((el) => !validarCampo(el));
  if (invalidos.length) {
    invalidos[0].focus();
    return;
  }

  const datos = new FormData(form);
  mostrarConfirmacion(datos);
  form.reset();
  reiniciarEstado();
});

actualizarSede();
actualizarContador();
