import json
import os

def aplanar_y_ordenar_json(archivo_entrada, archivo_salida_sugerido):
    """
    Carga un archivo JSON agrupado por letras (Diccionario de Arrays),
    lo convierte en una lista única de palabras, la ordena alfabéticamente
    y elimina duplicados.
    """
    print(f"--- 🔎 Iniciando el proceso para {archivo_entrada} ---")

    # 1. Validar la existencia del archivo de entrada
    if not os.path.exists(archivo_entrada):
        print(f"❌ Error: El archivo de entrada '{archivo_entrada}' no fue encontrado.")
        return

    try:
        # 2. Cargar el contenido del JSON agrupado
        with open(archivo_entrada, 'r', encoding='utf-8') as f:
            datos_agrupados = json.load(f)

        lista_palabras = []

        # 3. Iterar sobre los valores del diccionario (que son los arrays de palabras)
        # La clave es la letra, el valor es el array de palabras para esa letra.
        for letra, palabras in datos_agrupados.items():
            if isinstance(palabras, list):
                lista_palabras.extend(palabras)

        # 4. Eliminar duplicados y ordenar alfabéticamente
        # Usamos set() para una eliminación de duplicados rápida.
        lista_unica_ordenada = sorted(list(set(lista_palabras)))

        print(f"\n✅ Total de palabras encontradas (antes de limpiar): {len(lista_palabras)}")
        print(f"✅ Total de palabras únicas y ordenadas: {len(lista_unica_ordenada)}")

        # 5. Guardar la lista limpia en el nuevo archivo JSON
        with open(archivo_salida_sugerido, 'w', encoding='utf-8') as f:
            # Guardamos la lista como el objeto raíz del nuevo JSON
            json.dump(lista_unica_ordenada, f, ensure_ascii=False, indent=4)

        print(f"--- 🎉 Proceso finalizado. El archivo **{archivo_salida_sugerido}** ha sido creado. ---")

    except json.JSONDecodeError:
        print(f"❌ Error: El archivo de entrada '{archivo_entrada}' no es un JSON válido.")
    except Exception as e:
        print(f"❌ Ocurrió un error inesperado: {e}")

# =======================================================================
# --- EJEMPLO DE USO ---
# =======================================================================

# Define el archivo que quieres procesar
ARCHIVO_DE_ENTRADA = '../json/tv_cine_data.json'
# Define el nombre del archivo de salida que tendrá la lista única
ARCHIVO_DE_SALIDA = '../ddbb/tv_cine_validacion.json'

aplanar_y_ordenar_json(ARCHIVO_DE_ENTRADA, ARCHIVO_DE_SALIDA)

# Para procesar frutas y verduras, simplemente cambiarías las líneas de abajo:
# ARCHIVO_DE_ENTRADA = 'frutasYverduras_por_la_IA.json'
# ARCHIVO_DE_SALIDA = 'frutasYverduras_lista_unica.json'
# aplanar_y_ordenar_json(ARCHIVO_DE_ENTRADA, ARCHIVO_DE_SALIDA)
