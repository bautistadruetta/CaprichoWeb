// CAPRICHO PERFUMERÍA
// En este archivo están las funciones que hacen que la página sea interactiva.
// Los comentarios explican qué hace cada parte.

// 1. ARRAY DE PERFUMES
// Un array es una lista. Cada objeto guarda los datos de un perfume.
const perfumes = [
    { id: 1, nombre: "Sauvage Eau de Toilette", marca: "Dior", categoria: "fresco", etiqueta: "Fresco y amaderado", descripcion: "Fragancia masculina de perfil fresco, cítrico y amaderado.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Dior_Sauvage_Verpackung.jpg/500px-Dior_Sauvage_Verpackung.jpg" },
    { id: 2, nombre: "Bleu de Chanel Parfum", marca: "Chanel", categoria: "amaderado", etiqueta: "Aromático y amaderado", descripcion: "Una fragancia aromática y amaderada de estela intensa.", imagen: "https://upload.wikimedia.org/wikipedia/en/4/4f/Bleu_de_Chanel%2C_eau_de_toilette.jpg" },
    { id: 3, nombre: "Y Eau de Parfum", marca: "Yves Saint Laurent", categoria: "fresco", etiqueta: "Fresco y moderno", descripcion: "Una combinación de salvia fresca, geranio y maderas sensuales.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Yves_Saint_Laurent_Y_-_1.jpg/500px-Yves_Saint_Laurent_Y_-_1.jpg" },
    { id: 4, nombre: "Acqua di Giò", marca: "Giorgio Armani", categoria: "fresco", etiqueta: "Fresco y acuático", descripcion: "Clásico masculino de perfil fresco y acuático.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Armani_acqua_di_Gio_M.jpg/500px-Armani_acqua_di_Gio_M.jpg" }
];
// Creo el próximo número para identificar los perfumes nuevos.
let siguienteId = perfumes.length + 1;

// 2. FUNCIÓN PARA MOSTRAR TEXTO DE FORMA SEGURA
// Reemplazo algunos símbolos para que se muestren como texto y no como código HTML.
function escaparHTML(texto) {
    // Este objeto indica con qué texto reemplazo cada símbolo especial.
    const caracteres = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(texto).replace(/[&<>"']/g, caracter => caracteres[caracter]);
}

// 3. BUSCO ELEMENTOS DEL HTML
// getElementById encuentra una parte de la página usando su ID.
const contenedor = document.getElementById("contenedor-perfumes");
const buscador = document.getElementById("buscador-perfumes");
const filtro = document.getElementById("filtro-categoria");
const mensajeCatalogo = document.getElementById("mensaje-catalogo");
const sinResultados = document.getElementById("sin-resultados");

// CREO LAS TARJETAS DE LOS PERFUMES
// Esta función recibe una lista y muestra una tarjeta por cada perfume.
function mostrarPerfumes(lista) {
    if (!contenedor) return; // Si no existe esta parte, salgo porque no estoy en Tienda.
    contenedor.innerHTML = ""; // Borro las tarjetas anteriores para poner las nuevas.

    // forEach repite esta acción una vez por cada perfume de la lista.
    lista.forEach(perfume => {
        contenedor.innerHTML += `
            <article class="product-card designer-card">
                <div class="designer-image"><img src="${escaparHTML(perfume.imagen)}" alt="Frasco de ${escaparHTML(perfume.nombre)} de ${escaparHTML(perfume.marca)}" loading="lazy"></div>
                <div class="p-4">
                    <p class="brand-name">${escaparHTML(perfume.marca)}</p>
                    <h2>${escaparHTML(perfume.nombre)}</h2>
                    <p>${escaparHTML(perfume.descripcion)}</p>
                    <p class="small text-muted">${escaparHTML(perfume.etiqueta)}</p>
                    <a class="btn btn-dark" href="contacto.html?perfume=${encodeURIComponent(perfume.marca + " " + perfume.nombre)}">Consultar</a>
                    <button class="btn btn-outline-dark" type="button" data-eliminar="${perfume.id}">Eliminar</button>
                </div>
            </article>`;
    });
    if (sinResultados) sinResultados.hidden = lista.length > 0;
}

// BUSCADOR Y FILTRO
// Muestro solo los perfumes que coinciden con lo que escribió o eligió la persona.
function filtrarPerfumes() {
    const texto = buscador.value.toLowerCase().trim();
    const categoria = filtro.value;
    // filter crea una nueva lista con los perfumes que cumplen las condiciones.
    const resultados = perfumes.filter(perfume =>
        (perfume.nombre.toLowerCase().includes(texto) || perfume.marca.toLowerCase().includes(texto) || perfume.descripcion.toLowerCase().includes(texto)) &&
        (categoria === "todos" || perfume.categoria === categoria)
    );
    mostrarPerfumes(resultados);
    if (mensajeCatalogo) mensajeCatalogo.textContent = `Se encontraron ${resultados.length} perfume(s).`;
}

// ACTIVO EL BUSCADOR, EL FILTRO Y EL BOTÓN ELIMINAR
// Este if comprueba que los elementos existan antes de usarlos.
if (contenedor && buscador && filtro) {
    mostrarPerfumes(perfumes);
    buscador.addEventListener("input", filtrarPerfumes);
    filtro.addEventListener("change", filtrarPerfumes);

    // Escucho los clics. Si se presiona Eliminar, busco y saco ese perfume del array.
    contenedor.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-eliminar]");
        if (!boton) return;
        // findIndex busca la posición del perfume que tiene ese ID.
        const posicion = perfumes.findIndex(perfume => perfume.id === Number(boton.dataset.eliminar));
        if (posicion !== -1) {
            // splice elimina un elemento del array desde esa posición.
            const eliminado = perfumes.splice(posicion, 1)[0];
            filtrarPerfumes();
            mensajeCatalogo.textContent = eliminado.nombre + " se eliminó del catálogo.";
        }
    });
}

// 4. AGREGAR UN PERFUME
// Cuando se envía el formulario, guardo el nuevo perfume en el array.
const formularioPerfume = document.getElementById("formulario-perfume");
if (formularioPerfume) {
    formularioPerfume.addEventListener("submit", evento => {
        evento.preventDefault(); // Evito que el navegador recargue la página al enviar.
        const nombre = document.getElementById("nombre-perfume").value.trim();
        const categoria = document.getElementById("categoria-perfume").value;
        const descripcion = document.getElementById("descripcion-perfume").value.trim();
        const estado = document.getElementById("estado-formulario-perfume");
        if (!nombre) {
            estado.textContent = "Ingresá el nombre del perfume.";
            return;
        }
        // Elijo una etiqueta según la categoría que seleccionó la persona.
        const etiquetas = { fresco: "Fresco", amaderado: "Amaderado", intenso: "Intenso" };
        // push agrega el nuevo objeto al final del array.
        perfumes.push({ id: siguienteId++, nombre, marca: "Nuevo perfume", categoria, etiqueta: etiquetas[categoria], descripcion: descripcion || "Perfume agregado al catálogo.", imagen: perfumes[0]?.imagen || "" });
        formularioPerfume.reset(); // Limpio el formulario para poder usarlo otra vez.
        filtrarPerfumes();
        estado.textContent = nombre + " se agregó correctamente.";
    });
}

// 5. FORMULARIO DE CONTACTO
// Completo el mensaje si la persona llegó desde el botón Consultar y reviso los datos.
const formularioContacto = document.getElementById("formulario-contacto");
const respuestaContacto = document.getElementById("respuesta-contacto");
if (formularioContacto) {
    // Leo el nombre del perfume que llegó en el enlace de consulta.
    const perfume = new URLSearchParams(window.location.search).get("perfume");
    const campoMensaje = document.getElementById("mensaje");
    if (perfume && campoMensaje) campoMensaje.value = "Hola, quisiera consultar por " + perfume + ".";

    formularioContacto.addEventListener("submit", evento => {
        evento.preventDefault(); // Evito que la página se recargue. Este formulario es una demostración y no envía datos a un servidor.
        if (!formularioContacto.checkValidity()) {
            formularioContacto.reportValidity(); // El navegador muestra qué dato falta o está mal.
            return;
        }
        respuestaContacto.textContent = "¡Gracias! El formulario está completo. En esta versión de práctica no se envían los datos a un servidor.";
        respuestaContacto.className = "small mb-2 text-success";
        formularioContacto.reset();
    });
}

// 6. MENÚ PARA CELULARES
// El botón abre o cierra el menú de navegación.
const botonMenu = document.querySelector(".custom-toggler");
const menu = document.getElementById("menu-principal");
if (botonMenu && menu) {
    menu.classList.add("js-menu-cerrado"); // Al principio, el menú queda cerrado.
    botonMenu.addEventListener("click", () => {
        const abierto = menu.classList.toggle("js-menu-abierto");
        menu.classList.toggle("js-menu-cerrado", !abierto);
        botonMenu.setAttribute("aria-expanded", abierto);
    });
}

// 7. MENSAJE DE BIENVENIDA
// Pido algunos datos y después muestro un saludo personalizado.
function ejecutarBienvenida() {
    // Date obtiene la fecha actual y getFullYear devuelve el año.
    const anioActual = new Date().getFullYear();
    let nombre = prompt("¡Bienvenido/a a Capricho! ¿Cómo te llamás?");
    if (!nombre || !nombre.trim()) nombre = "visitante";

    let anioTexto = prompt("¿En qué año naciste?");
    let anio = Number(anioTexto);
    // while repite la pregunta mientras el año no sea válido. También permite cancelar.
    while (anioTexto !== null && (!Number.isInteger(anio) || anio <= 1900 || anio > anioActual)) {
        alert("Ingresá un año válido, entre 1901 y " + anioActual + ".");
        anioTexto = prompt("Volvé a ingresar tu año de nacimiento:");
        anio = Number(anioTexto);
    }
    const edad = anioTexto === null ? "" : "Tenés " + (anioActual - anio) + " años. ";
    let favorito = prompt("¿Cuál es tu perfume favorito?");
    if (!favorito || !favorito.trim()) favorito = "No indicado";
    alert(`¡Hola, ${nombre}! ${edad}Tu perfume favorito es ${favorito}. ¡Gracias por visitar Capricho!`);
}

// 8. RECOMENDACIONES
// Guardo en un objeto distintas listas según la ocasión elegida.
const recomendaciones = {
    "1": ["Acqua di Giò - Giorgio Armani", "Dior Homme - Dior", "Bleu de Chanel - Chanel"],
    "2": ["Dior Sauvage - Dior", "Y Eau de Parfum - Yves Saint Laurent", "Stronger With You - Emporio Armani"],
    "3": ["Bleu de Chanel - Chanel", "The One - Dolce & Gabbana", "Boss Bottled - Hugo Boss"]
};

// MUESTRO LAS RECOMENDACIONES
// El for recorre la lista y numera cada perfume.
function mostrarRecomendaciones(lista) {
    let texto = "Opciones recomendadas:\n";
    for (let i = 0; i < lista.length; i++) texto += `${i + 1}. ${lista[i]}\n`;
    alert(texto);
    console.log(texto);
}

// REPETIR EL RECOMENDADOR
// do...while permite consultar al menos una vez y repetir si la persona quiere.
function iniciarRecomendador() {
    let continuar;
    do {
        const opcion = prompt("SIMULADOR CAPRICHO\n1 - Para todos los días\n2 - Para salir\n3 - Para regalar\n\nEscribí ESC para terminar.");
        if (opcion === null || opcion.toUpperCase() === "ESC") {
            continuar = false;
            alert("¡Gracias por consultar en Capricho!");
        } else if (recomendaciones[opcion]) {
            mostrarRecomendaciones(recomendaciones[opcion]);
            continuar = prompt("¿Querés realizar otra consulta? Escribí SI para continuar.");
            continuar = continuar !== null && continuar.toUpperCase() === "SI";
        } else {
            alert("Opción incorrecta. Elegí 1, 2, 3 o ESC.");
            continuar = true;
        }
    } while (continuar);
}

// CONECTO EL BOTÓN CON LAS FUNCIONES DE BIENVENIDA Y RECOMENDACIÓN.
// Busco el botón que inicia las actividades.
const botonSimulador = document.getElementById("iniciar-simulador");
if (botonSimulador) botonSimulador.addEventListener("click", () => {
    ejecutarBienvenida();
    iniciarRecomendador();
});

// 9. AÑO AUTOMÁTICO
// Muestro el año actual en el pie de página, sin tener que cambiarlo a mano.
const anioFooter = document.getElementById("current-year");
if (anioFooter) anioFooter.textContent = new Date().getFullYear();
