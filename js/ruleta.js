let ruletaActiva = false;
let letraActual = "";
let intervaloRuleta = null;

const mensaje = document.getElementById("presiona-tecla");
const abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split("");
const btnADarle = document.createElement('button');
btnADarle.innerHTML = 'A darle!';
btnADarle.id = "btn-aDarle";
const btnBasta = document.getElementById("btn-basta");
const letra = document.createElement('div');
letra.innerHTML = '<p id="letra-display">A</p>'
letraRuleta.appendChild(letra);



// ========================
//    Iniciar Ruleta
// ========================
function iniciarRuleta() {
  if (ruletaActiva) return;
  if (intervaloRuleta) clearInterval(intervaloRuleta);
  ruletaActiva = true;

  visibilidad(mensaje, false);
  visibilidad(btnADarle, false);
  visibilidad(btnBasta, true);

  let index = 0;
  intervaloRuleta = setInterval(() => {
    letraActual = abecedario[index];
    if (letraActual) letraRuleta.innerText = letraActual;
    index = (index + 1) % abecedario.length;
  }, 50)

  btnBasta.onclick = () => {
    contenedorGeneral.appendChild(btnADarle);
    detenerRuleta()
  };
};


btnADarle.onclick = () => {
  contenedorGeneral.classList.add("oculto");
  cuentaRegresiva(() => {
    const filas = document.querySelectorAll("#cuerpo-tabla tr");
    const ultimaFila = filas[filas.length - 1];
    const primerInput = ultimaFila.querySelector("input");
    primerInput.focus();
  });
};

function visibilidad(elemento, mostrar) {
  if (!elemento) return;
  elemento.classList.toggle("oculto", mostrar);
}


// =================================
//      Detener Ruleta
// =================================
function detenerRuleta() {
  if (!ruletaActiva) return;

  clearInterval(intervaloRuleta);
  intervaloRuleta = null;
  ruletaActiva = false;

  visibilidad(btnBasta, true);
  mensaje.innerHTML = "Letra seleccionada: ";
  mensaje.classList.remove("oculto");

  if (letrasUsadas.includes(letraActual)) {
    if (mensaje) {
      btnADarle.classList.add("oculto");
      mensaje.innerHTML = `
      <h4>La letra ${letraActual} ya fue usada.</h4>
      <p> Presiona <strong>"A"</strong> nuevamente.</p>`;
    }
    return;
  }

  /* if (btnADarle) {
    if (!document.getElementById("btn-aDarle")) {
      contenedorGeneral.appendChild(btnADarle);
    }
    btnADarle.classList.remove("oculto");
  }
 */
  letrasUsadas.push(letraActual);
  sessionStorage.setItem("letrasUsadas", JSON.stringify(letrasUsadas));
}

// =================================
//        Reiniciar ruleta
// =================================

function reiniciarRuleta() {
  ruletaActiva = false;
  letraActual = "";

  if (contenedorGeneral) {
    contenedorGeneral.innerHTML =
      `<h3 id="presiona-tecla">Presiona la tecla A para comenzar</h3>
    <div id="letra-ruleta">
    <p id="letra-display">A</p>
    </div>
    <button id="btn-basta" class="">Basta!</button>`;
  }

  letraRuleta = document.getElementById("letra-ruleta");
  const btnBastaLocal = document.getElementById("btn-basta");
  if (btnBastaLocal) {
    btnBastaLocal.onclick = detenerRuleta;
  }
}
