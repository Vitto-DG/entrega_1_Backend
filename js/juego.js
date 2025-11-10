

// Elementos html <div id="app">
//

// Menu

let letraRuleta = document.getElementById("letra-ruleta");
const btnBasta = document.getElementById("btn-basta");
let ruletaActiva = false;

// Array de letras que ya tocaron.
let letrasUsadas = JSON.parse(sessionStorage.getItem('letrasUsadas')) || [];

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

// ================================
//              Ruleta
// ================================

function iniciarRuleta(){
  ruletaActiva = true;
  const abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split("");
  let letraActual = "";
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
      const aDarle = document.createElement('button');
      aDarle.classList.add("btn-aDarle");
      aDarle.onclick = () => {

      }

    }

// Guardamos la letra usada
letrasUsadas.push(letraActual);
sessionStorage.setItem("letrasUsadas", JSON.stringify(letrasUsadas));

  }

}

const btnRuleta = document.getElementById("btn-ruleta");
const ruleta = document.getElementById("ruleta")
btnRuleta.onclick = () => {
  ruleta.classList.remove("oculto")
}

// =================================
//          Jugar Ronda
// =================================

function jugarRonda(letra){
  // Necesitamos las categorias
  const categorias = ["Nombre", "Ciudades o Paises", "Animales", "Flores", "Comida", "Frutas y verduras", "Colores", "Marcas", "TV y Cine"];

  // un lugar donde guardar las respuestas
  const palabrasRonda = [];

  alert("Tocó la letra: " + letra);

// tiempo de inicio para cronometrar
const inicio = Date.now();

// procesamiento de categorias y respuestas
for(const categoria of categorias){

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
}


  // Tiempo final
  const fin = Date.now();
  const duracion = ((fin - inicio) / 1000).toFixed(2) // se mostrara en segundos
  console.log(duracion)


  rondas.push(palabrasRonda);
  alert("Fin de la ronda.\n" + palabrasRonda.join("\n"));
  puntaje(duracion);
}
