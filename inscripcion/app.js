const titulo = document.querySelector('#titulo');     // primer elemento que coincide
const items  = document.querySelectorAll('li');     // NodeList con todos

console.log(titulo.textContent);
items.forEach(li => console.log(li.textContent));



titulo.textContent = '¡Hola DOM!';          // texto seguro
titulo.classList.add('destacado');          // add / remove / toggle / contains
titulo.setAttribute('title', 'Encabezado');
titulo.dataset.estado = 'activo';           // crea data-estado="activo"
titulo.style.color = 'steelblue';            // estilo en línea (úsalo poco)


const lista = document.querySelector('#lista');
const lenguajes = ['HTML', 'CSS', 'JavaScript'];

for (const nombre of lenguajes) {
  const li = document.createElement('li');
  li.textContent = nombre;
  lista.append(li);                         // lo agrega al final
}

lista.lastElementChild.remove();           // elimina "JavaScript"




const boton = document.querySelector('#saludar');

boton.addEventListener('click', (event) => {
  console.log(event.type);     // "click"
  console.log(event.target);   // el elemento que recibió el clic
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') console.log('Cerrar modal');
}); 



const lista2 = document.querySelector('#tareas');

lista2.addEventListener('click', (e) => {
  const borrar = e.target.closest('.borrar');
  if (borrar) {
    borrar.closest('li').remove();
    return;
  }
  const texto = e.target.closest('.texto');
  console.log("Texto encontrado! y es: " + texto);
  if (texto) texto.closest('li').classList.toggle('hecha');
});