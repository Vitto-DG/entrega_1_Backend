import { info } from 'console';
import fs from 'fs/promises';

const ARCHIVO_VALIDACIONES = 'validaciones.json';
const ARCHIVO_NOMBRES_LIMPIOS = 'animales_limpios.json';
const ARCHIVO_ANIMALES_LIMPIOS = 'animales_limpios.json';
const ARCHIVO_ANIMALES_LIMPIOS = 'animales_limpios.json';
const ARCHIVO_ANIMALES_LIMPIOS = 'animales_limpios.json';
const ARCHIVO_ANIMALES_LIMPIOS = 'animales_limpios.json';

const CATEGORIAS_FUENTES = [
  {
    nombre: "Animales",
    archivo: ARCHIVO_ANIMALES_LIMPIOS,
  },
  {
    nombre: "Animales",
    archivo: ARCHIVO_ANIMALES_LIMPIOS,
  },
  {
    nombre: "Animales",
    archivo: ARCHIVO_ANIMALES_LIMPIOS,
  },
  {
    nombre: "Animales",
    archivo: ARCHIVO_ANIMALES_LIMPIOS,
  },
  {
    nombre: "Animales",
    archivo: ARCHIVO_ANIMALES_LIMPIOS,
  },
  {
    nombre: "Animales",
    archivo: ARCHIVO_ANIMALES_LIMPIOS,
  },
  {
    nombre: "Animales",
    archivo: ARCHIVO_ANIMALES_LIMPIOS,
  },
];

function inicializarEstructura(){
  const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const CATEGORIAS_TOTALES = [
    "Nombres",
    "Ciudades/Paises",
    "Animales",
    "Flores",
    "Comidas",
    "Frutas y Verduras",
    "Colores",
    "Marcas",
    "TV y Cine"
  ];

  const estructuraInicial = {};
  for (const letra of LETRAS){
    estructuraInicial[letra] = {};
    for (const categoria of CATEGORIAS_TOTALES){
      estructuraInicial[letra][categoria] = [];
    }
}
return estructuraInicial;
}

async function consolidarDatos(){
  console.info("Consolidando datos...");

  let bbddValidaciones;

  try {
    const data = await fs.readFile(ARCHIVO_VALIDACIONES, 'utf-8');
    bbddValidaciones = JSON.parse(data);
    console.info(`Base de datos de validaciones ${ARCHIVO_VALIDACIONES} cargada.`);
  }catch (err){
    console.error(`Error al leer el archivo ${ARCHIVO_VALIDACIONES}:`, err);
    return;
  }

for (const fuente of CATEGORIAS_FUENTES){
  try {
    const dataFuente = await fs.readFile(fuente.archivo, 'utf-8');
    const datosFuente = JSON.parse(dataFuente);

    console.info(`Datos de la fuente ${fuente.archivo} cargados.`);

    let totalFusionados = 0;

    for (const letra in datosFuente)
  }
}
