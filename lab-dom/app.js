const titulo = document.querySelector('#titulo');
const items = document.querySelectorAll('li');

console.log(titulo.textContent);
items.forEach((li) => console.log(li.textContent));

titulo.textContent = '¡Hola DOM!';
titulo.classList.add('destacado');
titulo.setAttribute('title', 'Encabezado');
titulo.dataset.estado = 'activo';
titulo.style.color = 'steelblue';

const lista = document.querySelector('#lista');
const lenguajes = ['HTML', 'CSS', 'JavaScript'];

for (const nombre of lenguajes) {
  const li = document.createElement('li');
  li.textContent = nombre;
  lista.append(li);
}

lista.lastElementChild.remove();

const boton = document.querySelector('#saludar');

boton.addEventListener('click', (event) => {
  console.log(event.type);
  console.log(event.target);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') console.log('Cerrar modal');
});

const form = document.querySelector('#registro');

const reglas = {
  nombre: (v) => v.trim().length >= 3 || 'Escribe al menos 3 caracteres.',
  correo: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    'Usa un correo como nombre@dominio.com.',
  cedula: (v) =>
    /^([1-9]|1[0-3]|PE|E|N)-\d{1,4}-\d{1,6}$/.test(v) ||
    'Formato: 8-123-4567.',
  clave: (v) =>
    (v.length >= 8 && /[A-Z]/.test(v) && /\d/.test(v)) ||
    'Mínimo 8 caracteres, una mayúscula y un número.',
  clave2: (v) => v === form.clave.value || 'Las contraseñas no coinciden.',
};

function validarCampo(input) {
  const resultado = reglas[input.name](input.value);
  const valido = resultado === true;
  const error = document.getElementById(`${input.name}-error`);

  input.setAttribute('aria-invalid', String(!valido));
  error.textContent = valido ? '' : resultado;
  return valido;
}

const tocados = new Set();

form.addEventListener('blur', (e) => {
  if (!reglas[e.target.name]) return;
  tocados.add(e.target.name);
  validarCampo(e.target);
}, true);

form.addEventListener('input', (e) => {
  if (tocados.has(e.target.name)) validarCampo(e.target);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const campos = [...form.elements].filter((el) => reglas[el.name]);
  const invalidos = campos.filter((el) => !validarCampo(el));
  if (invalidos.length) {
    invalidos[0].focus();
    return;
  }
  const datos = new FormData(form);
  console.log(Object.fromEntries(datos));
  form.reset();
});
