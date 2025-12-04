import fs from 'fs/promises';

const NOMBRE_ARCHIVO_ANIMALES = 'animales_raspados.json';
const ARCHIVO_ANIMALES_LIMPIOS = 'animales_limpios.json';

const BASURA = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "†"
];

async function limpiarDatosLocales(){
  console.info("Iniciando limpieza de datos locales...");

  const animalesUnicosSet = new Set();

  let totalAntes = 0;
  let totalDespues = 0;

  try {
    const data = await fs.readFile(NOMBRE_ARCHIVO_ANIMALES, 'utf-8');
    const animalesJSON = JSON.parse(data);

for (const letra in animalesJSON){
  if(animalesJSON.hasOwnProperty(letra) && Array.isArray(animalesJSON[letra])){
    let arrayAnimales = animalesJSON[letra];
    totalAntes += arrayAnimales.length;

    const listaLimpia = arrayAnimales.filter(animal => {
      return !BASURA.includes(animal)
})

listaLimpia.forEach(animal => animalesUnicosSet.add(animal));
  }
}

const animalesObjetoLimpio = {};
const animalesUnicosArray = Array.from(animalesUnicosSet).sort();

totalDespues = animalesUnicosArray.length;

for (let i = 65; i<= 90; i++){
  animalesObjetoLimpio[String.fromCharCode(i)] = [];
}

animalesUnicosArray.forEach(animal => {
  const letraInicial = animal[0];
  if(animalesObjetoLimpio[letraInicial]){
    animalesObjetoLimpio[letraInicial].push(animal);
  }
});

const datosJSON = JSON.stringify(animalesObjetoLimpio, null, 4);

await fs.writeFile(ARCHIVO_ANIMALES_LIMPIOS, datosJSON, 'utf-8');


console.info(`Animales originales: ${totalAntes}`);
console.info(`Animales limpios: ${totalDespues}`);


console.info(`Archivo de animales limpios creado: ${ARCHIVO_ANIMALES_LIMPIOS}`);
  } catch (err) {
    console.error("Error al limpiar datos locales:", err);
  }
}

limpiarDatosLocales();
