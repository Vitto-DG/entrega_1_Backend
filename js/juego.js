

// Elementos html <div id="app">
//

// Juego


let letraRuleta = document.getElementById("letra-ruleta");
const btnBasta = document.getElementById("btn-basta");
let ruletaActiva = false;
let letraActual = "";
const ruleta = document.getElementById("ruleta");
const presionaA = document.getElementById("presiona-tecla");

// Array de letras que ya tocaron.
let letrasUsadas = JSON.parse(sessionStorage.getItem('letrasUsadas')) || [];


const btnRuleta = document.getElementById("btn-ruleta");
btnRuleta.onclick = () => {
  ruleta.classList.remove("oculto")
  presionaA.classList.remove("oculto");
  btnRuleta.classList.add("oculto");
  // Manifestacion visual de la ruleta
  const letra = document.createElement('div');
  letra.innerHTML = '<p id="letra-display">A</p>'
  letraRuleta.appendChild(letra);
  const letraDisplay = letra.querySelector("p");

  // Detonante para iniciar la ruleta
  document.addEventListener("keyup", (e) => {
    if (e.key.toUpperCase() === "A" && !ruletaActiva){
  iniciarRuleta();
    }
  })
}

// =======================================
//              Categorias
// =======================================

const tablaCategorias = ["Letra","Nombre", "Ciudades/\nPaises", "Animales", "Flores", "Comida", "Frutas y\n verduras", "Colores", "Marcas", "TV y Cine", "Total"];

function crearEncabezados(){
  const encabezado = document.getElementById("encabezado");
  encabezado.innerHTML = "";


  const filaCategorias = document.createElement("tr");
  filaCategorias.id = "categorias";

  for (const categoria of tablaCategorias){
    const cat = document.createElement("th");
    cat.innerHTML = categoria;
    filaCategorias.appendChild(cat)
  }
  encabezado.appendChild(filaCategorias);
}
 crearEncabezados(tablaCategorias);

 // Crear nuevas filas para cada ronda

 function crearFilaRespuestas(){
  const cuerpo = document.getElementById("cuerpo-tabla");
const fila = document.createElement("tr");
fila.classList.add("fila-ronda");

// para poder saltar de input en input con tecla Enter
const inputs = [];

for (const categoria of tablaCategorias){
  const dato = document.createElement("td");
  const input = document.createElement("input");

  input.type = "text";
  input.classList.add("campo");
  input.autocomplete = "off";

  dato.appendChild(input);
  fila.appendChild(dato)
  inputs.push(input);
}

// De input en input al presionar Enter
let index = 0;
for(const inp of inputs) {

  const currentIndex = index;

  inp.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
      e.preventDefault();

      const siguiente = inputs[currentIndex + 1];

      if(siguiente){
        siguiente.focus();
      } else {
        // terminar la ronda y mostrar un mensaje de "Basta para mi, Basta para todos!"
        bastaParaMi();
      }
    }
  });
  index++;
}
inputs[0].focus();



cuerpo.appendChild(fila);
 }
crearFilaRespuestas();

// ================================
//              Ruleta
// ================================

function iniciarRuleta(){
  ruletaActiva = true;
  const abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split("");
  let index = 0;
  btnBasta.classList.remove("oculto");


  // Bucle visual
   let intervalo = setInterval(() => {
    letraActual = abecedario[index];
    letraRuleta.innerText = letraActual;
    index = (index + 1) % abecedario.length;
  }, 50)

  btnBasta.onclick = () => {
    clearInterval(intervalo);
    intervalo = null;

    // la letra ya fue usada?
    if(letrasUsadas.includes(letraActual)){
      alert(`La letra ${letraActual} ya fue usada. Presiona "A" nuevamente.`);
      btnBasta.classList.add("oculto")
      iniciarRuleta();
      return;
    }else{
      // Si no toco letra repetida, seguimos con el flujo
      const aDarle = document.createElement('button');
      aDarle.innerHTML = 'A darle!';
      aDarle.classList.add("btn-aDarle");
      ruleta.appendChild(aDarle)

      aDarle.onclick = () => {
        ruleta.classList.add("oculto");
        cuentaRegresiva(() => {
          const primerInput = document.querySelector("#cuerpo-tabla input");
          primerInput.focus();
        })
      }
    }

    // Guardamos la letra usada
    letrasUsadas.push(letraActual);
    sessionStorage.setItem("letrasUsadas", JSON.stringify(letrasUsadas));

  }


}



// Cuenta regresiva

function cuentaRegresiva(callback){
  const overlay = document.getElementById("cuenta-regresiva");
  overlay.classList.remove("oculto");

  let contador = 3;
  overlay.textContent = contador

  const intervalo = setInterval(() => {
    contador--;
    if(contador > 0){
      overlay.textContent = contador;
    } else {
      clearInterval(intervalo);
      overlay.classList.add("oculto");
      callback();
    }
  }, 1000);

}





// =================================
//          Jugar Ronda
// =================================


function jugarRonda(letra){
  // Necesitamos las categorias
  //const categorias = ["Nombre", "Ciudades o Paises", "Animales", "Flores", "Comida", "Frutas y verduras", "Colores", "Marcas", "TV y Cine"];

  // un lugar donde guardar las respuestas
  const palabrasRonda = [];

  // alert("Tocó la letra: " + letra);

// tiempo de inicio para cronometrar
const inicio = Date.now();

// procesamiento de categorias y respuestas
/* for(const categoria of categorias){

    const respuesta = prompt(categoria + " con: " + letra);

    if(!respuesta){
      // si dejamos el campo vacio
      palabrasRonda.push(categoria + ": nada .. 0 puntos");
      continue;
    }

    const primeraLetra = respuesta[0].toUpperCase();

    if(primeraLetra === letra){
      palabrasRonda.push(categoria + ": " + respuesta + " ... +10 puntos");
      totalPuntos += 10;
    } else {
      palabrasRonda.push(categoria + ": " + respuesta + " ... -5 puntos" );
      totalPuntos -= 5;
    }
} */


  // Tiempo final
  const fin = Date.now();
  const duracion = ((fin - inicio) / 1000).toFixed(2) // se mostrara en segundos
  console.log(duracion)


  rondas.push(palabrasRonda);
  alert("Fin de la ronda.\n" + palabrasRonda.join("\n"));
  puntaje(duracion);
}
