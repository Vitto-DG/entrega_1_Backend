import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const URL_BASE = 'https://semequemalacomida.blogspot.com/p/recetas-por-orden-alfabetico.html';
const FILE_OUTPUT = 'recetas_alfabeticas_final.json';
const ALFABETO = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');


async function scrapeRecetasYAgruparPorInicial(url) {
    console.log(`--- 🔎 Iniciando scraping de la URL: ${url} ---`);

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        const $ = cheerio.load(response.data);
        const recetasAgrupadas = {};
        let totalRecetas = 0;

        ALFABETO.forEach(letra => {
            recetasAgrupadas[letra] = [];
        });

        const todosLosEnlaces = $('.post-body a');

        todosLosEnlaces.each((i, link) => {
            const nombreBruto = $(link).text().trim();

            if (nombreBruto.length < 3) return;

            const letraInicial = nombreBruto.charAt(0).toUpperCase();

            if (ALFABETO.includes(letraInicial)) {
                let nombreLimpio = nombreBruto;

                nombreLimpio = nombreLimpio.replace(/\s*\([^)]*\)\s*/g, '').trim();

                if (!recetasAgrupadas[letraInicial].includes(nombreLimpio)) {
                    recetasAgrupadas[letraInicial].push(nombreLimpio);
                    totalRecetas++;
                }
            }
        });

        const recetasFinal = Object.keys(recetasAgrupadas).reduce((acc, letra) => {
            if (recetasAgrupadas[letra].length > 0) {
                acc[letra] = recetasAgrupadas[letra];
            }
            return acc;
        }, {});

        const jsonContent = JSON.stringify(recetasFinal, null, 4);

        await fs.writeFile(FILE_OUTPUT, jsonContent, 'utf-8');

        console.log(`\n🎉 Scraping finalizado con éxito.`);
        console.log(`Total de grupos (letras) con recetas: ${Object.keys(recetasFinal).length}`);
        console.log(`Total de recetas encontradas: ${totalRecetas}`);
        console.log(`Base de datos guardada en **${FILE_OUTPUT}**`);

    } catch (error) {
        const status = error.response ? error.response.status : 'N/A';
        console.error(`❌ Ocurrió un error: Estado: ${status}. Mensaje: ${error.message}`);
    }
}

scrapeRecetasYAgruparPorInicial(URL_BASE);
