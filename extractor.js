import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const CATEGORIAS = [
  "Nombres",
  "Ciudades/Paises",
  "Animales",
  "Flores",
  "Comidas",
  "Frutas y Verduras",
  "Colores",
  "Marcas",
  "TV y Cine"
]

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NOMBRE_ARCHIVO_SALIDA = 'validaciones.json';

const datosTF = {};

function normalizarPalabras(palabra){
  if(!palabra) return '';

  return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
}

async function extPaises(){
  console.log("Extrayendo paises...")
  const listaPaises = [];
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=translations");
    if (!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const paises = await response.json();

    for (const pais of paises) {
      const nombre = pais.translations?.spa?.common;
      if (nombre){
        listaPaises.push(normalizarPalabras(nombre));
      }
    }
  } catch (error) {
    console.error("Error al extraer paises:", error);
  }
  return listaPaises;
};


async function genBBDDTuttiFrutty(){
  console.log("Generando base de datos Tutti Frutty...");

  const [bbddPaises] = await Promise.all([
     extPaises()
  ]);

  const datosExtraidos = {
    "Ciudades/Paises": bbddPaises
  };

  for (const letra of LETRAS){
    datosTF[letra] = {};
    for (const cat of CATEGORIAS){
      datosTF[letra][cat] = [];
    }
  }

  console.log("Organizando datos...");

  for(const categoria in datosExtraidos){
    const listaPalabras = datosExtraidos[categoria];
    for(const palabra of listaPalabras){
      if(!palabra) continue;

      const letraInicial = palabra[0];

      if(datosTF[letraInicial] && datosTF[letraInicial][categoria]){
        datosTF[letraInicial][categoria].push(palabra);
      }

      console.log("Clasificacion completada.");

      try {
        const datosAJSON = JSON.stringify(datosTF, null, 4);

        await fs.writeFile(NOMBRE_ARCHIVO_SALIDA, datosAJSON, 'utf-8');

        console.log(`Base de datos generada exitosamente en '${NOMBRE_ARCHIVO_SALIDA}'.`);
      } catch (err){
        console.error("Error al escribir el archivo JSON:", err);
      }
    }
  }
}

genBBDDTuttiFrutty();

// Tareas pendientes:
// 1 - Completar categorias. DONE
// 2 - Completar extraccion de datos. DONE


