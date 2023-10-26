// Estos const son seleccionados desde el css/tailwind.min.css para ser motificados en este archivo
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const btnGuardar = document.querySelector('#btnGuardar');

// Ejecuta un evento cada vez que se presiona el boton de buscar clima, el cual se encarga de buscar el clima
window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

// Es la función encargada de realizar la lógica para buscar el clima
function buscarClima (e) {
    e.preventDefault();
    console.log(e);
    // Validar
    const ciudad = document.querySelector('#ciudad').value; // Captura el valor  insertado en el campo "Ciudad"
    const pais = document.querySelector('#pais').value; // Captura el valor insertado en el canpo "Pais"

    // Validación de su ambos campos estan llenos 
    if(ciudad === '' || pais === ''){ 
        // there was a mistake
        mostrarError('Ambos campos son obligatorios'); // Llama a la función "mostrarError" y se envia como paránetro el mensaje de error
        return;
    }

    //consultariamos la API
    consultarAPI(ciudad, pais); // Llama a la función "consultarAPI" y le envía por parámetros la cuidad y país
}

// En caso de que los campos de ciudad y país esten vacíos, se ejecuta esta función
function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    //Create alert
    if(!alerta){
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;
        container.appendChild(alerta);
        
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}

// Función que se encarga de convertir de Kelvin a Centigrados
function kelvinACentigrados(grados) {
    return parseInt(grados - 273.15);
}

// Esta es la función encarga de consumir la API donde se obtiene el clima
function consultarAPI (ciudad, pais) {
    const appId = 'aaf61516cc3dd72f5855752ba2e2c139'; // La API necesita que por medio de la URL se le envíe un id como parámetro
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`; // La URL a la cual se le hace la consulta con los parámetros requeridos

    Spinner(); // Show a charger spinner

    // Se realiza la consulta oficial por medio del 'fetch'
    fetch(url)
        .then(respuesta => respuesta.json()) // Recibe la respuesta en formato json
        .then(datos => { 
            limpiarHTML(); //Clean HTML
            if(datos.cod === "404"){ // Manejo de errores en caso de que la ciudad no exista
                mostrarError('Ciudad no encontrada'); // Llama a la función mostrar error y se le pasa como parámetro el mensaje 
                return;
            }

            //Print the HTML answer
            mostrarClima(datos); // Se llama a la función mostrarClima con los datos substraidos de la consulta  como parámetro
        })
}

// Función que se encarga de pintar en pantalla los resultados que fueron consumidos de la API
function mostrarClima(datos){
    const { name, main: { temp, temp_max, temp_min } } = datos;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    const actual = document.createElement('p');

     const nombreCiudad = document.createElement('p');
     nombreCiudad.textContent = `El clima en ${name}`;
     nombreCiudad.classList.add('font_bold', 'text-2XL');

    actual.innerHTML = `${centigrados} &#8451`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTM = `Max: ${max} &#8451`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);


    resultado.appendChild(resultadoDiv);

    // Mostrar botón Guardar
    const botonGuardar = document.createElement('input');
    botonGuardar.classList.add('mt-5', 'w-full', 'bg-orange-500', 'p-3',  'uppercase', 'font-bold', 'cursor-pointer', 'rounded');
    botonGuardar.type = "button";
    botonGuardar.value = "Guardar Clima";
    botonGuardar.onclick = function() {
        GuardarClima(kelvinACentigrados(temp));
    }

    btnGuardar.appendChild(botonGuardar);
}

function GuardarClima (temp) {
    console.log(temp);
}

// Se encarga de limpiar el HTML, cada vez que se presiona el botón "Obtener Clima" esta función elimina los campos llenos y resultados de la consulta anterior, en caso de que hayan
function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {
    limpiarHTML();
    
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>    
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
  
    `;
    resultado.appendChild(divSpinner);
}