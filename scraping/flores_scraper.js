// Asegúrate de tener instaladas las dependencias: npm install cheerio puppeteer

import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';

const URL_BASE = 'https://www.picturethisai.com/es/wiki/plants';
const FILE_OUTPUT = 'nombres_flores_agrupadas_v4_final.json';
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

/**
 * Rastrea la página de la enciclopedia de plantas, usando Puppeteer, forzando
 * el scroll y la espera para la carga completa.
 */
async function scrapeNombresFloresConPuppeteer(url) {
    console.log(`--- 🔎 Iniciando scraping DINÁMICO de la Enciclopedia de Plantas: ${url} ---`);

    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // 1. Esperar a que el selector de la TARJETA de planta (el más fiable) aparezca.
        const CARD_SELECTOR = '.plant-card-content-title';
        console.log(`   -> Esperando que el primer elemento (${CARD_SELECTOR}) de la lista aparezca...`);
        await page.waitForSelector(CARD_SELECTOR, { timeout: 30000 });

        // 2. ¡CORRECCIÓN CLAVE! Forzar el scroll hasta el final de la página para cargar la lista alfabética.
        console.log("   -> Desplazándose hacia abajo para forzar la carga de la lista alfabética...");
        await page.evaluate(async () => {
            const delay = 100;
            const scrollDistance = 500;
            let totalHeight = 0;

            // Simular scroll repetitivo hasta el final para asegurar la carga perezosa (lazy-loading)
            while (totalHeight < document.body.scrollHeight) {
                window.scrollBy(0, scrollDistance);
                totalHeight += scrollDistance;
                await new Promise(r => setTimeout(r, delay));
            }
        });

        // 3. Espera de tiempo adicional para que el navegador procese el scroll y el contenido.
        console.log("   -> Esperando 2 segundos adicionales para el renderizado completo...");
        await new Promise(r => setTimeout(r, 2000));

        // 4. Obtener el HTML renderizado (todo el contenido dinámico ya debería estar ahí)
        const htmlContent = await page.content();

        // 5. Procesar el HTML con Cheerio
        const $ = cheerio.load(htmlContent);
        const plantasAgrupadas = {};
        let totalPlantas = 0;

        ALFABETO.forEach(letra => {
            plantasAgrupadas[letra] = [];
        });

        // 6. El selector que identifica los nombres es:
        const nombresDePlantas = $(CARD_SELECTOR);

        // 7. Iterar sobre los títulos y agrupar
        nombresDePlantas.each((i, element) => {
            const nombreBruto = $(element).text().trim();

            if (nombreBruto.length < 3) return;

            const letraInicial = nombreBruto.charAt(0).toUpperCase();

            if (ALFABETO.includes(letraInicial)) {
                let nombreLimpio = nombreBruto.toUpperCase();

                if (!plantasAgrupadas[letraInicial].includes(nombreLimpio)) {
                    plantasAgrupadas[letraInicial].push(nombreLimpio);
                    totalPlantas++;
                }
            }
        });

        // 8. Generar el resultado final
        const plantasFinal = Object.keys(plantasAgrupadas).reduce((acc, letra) => {
            if (plantasAgrupadas[letra].length > 0) {
                acc[letra] = plantasAgrupadas[letra];
            }
            return acc;
        }, {});

        // 9. Guardar el resultado
        const jsonContent = JSON.stringify(plantasFinal, null, 4);
        await fs.writeFile(FILE_OUTPUT, jsonContent, 'utf-8');

        console.log(`\n🎉 Scraping finalizado con éxito.`);
        console.log(`Total de grupos (letras) con plantas: ${Object.keys(plantasFinal).length}`);
        console.log(`Total de plantas encontradas: ${totalPlantas}`);
        console.log(`Base de datos guardada en **${FILE_OUTPUT}**`);

    } catch (error) {
        console.error(`\n❌ Ocurrió un error grave durante la ejecución o espera: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// --- Ejecución del Script ---
scrapeNombresFloresConPuppeteer(URL_BASE);
