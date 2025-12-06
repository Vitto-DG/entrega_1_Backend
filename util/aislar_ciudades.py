import json

def aislar_y_limpiar_ciudades(archivo_entrada, archivo_salida):
    """
    Carga el archivo validaciones.json, extrae y combina todos los arrays
    de 'Ciudades/Paises' en una lista única y elimina duplicados.
    """
    print(f"--- 🔎 Iniciando la lectura de {archivo_entrada} ---")

    try:
        # 1. Cargar el contenido del JSON principal
        with open(archivo_entrada, 'r', encoding='utf-8') as f:
            datos = json.load(f)

        lista_ciudades_paises = []

        # 2. Iterar sobre las claves (letras) del diccionario principal
        # Los datos son un diccionario donde las claves son las letras ("A", "B", etc.)
        for letra, contenido in datos.items():
            # Verificamos que la clave 'Ciudades/Paises' exista y sea una lista
            if isinstance(contenido, dict) and 'Ciudades/Paises' in contenido and isinstance(contenido['Ciudades/Paises'], list):
                # 3. Extender la lista principal con los elementos de la lista anidada
                lista_ciudades_paises.extend(contenido['Ciudades/Paises'])
                print(f"   -> Extraídas {len(contenido['Ciudades/Paises'])} entradas de la letra '{letra}'.")
            else:
                print(f"   -> Advertencia: La clave '{letra}' no contiene el formato esperado 'Ciudades/Paises'.")

        # 4. Limpiar duplicados (usando un set) y ordenar
        # La conversión a set elimina duplicados de forma eficiente.
        lista_unica_ordenada = sorted(list(set(lista_ciudades_paises)))

        print(f"\n✅ Total de entradas extraídas (antes de limpiar): {len(lista_ciudades_paises)}")
        print(f"✅ Total de Ciudades/Países únicos y ordenados: {len(lista_unica_ordenada)}")

        # 5. Guardar la lista limpia en un nuevo archivo JSON
        with open(archivo_salida, 'w', encoding='utf-8') as f:
            # Guardamos la lista como el objeto raíz del nuevo JSON
            json.dump(lista_unica_ordenada, f, ensure_ascii=False, indent=4)

        print(f"--- 🎉 Proceso finalizado. La lista ha sido guardada en **{archivo_salida}** ---")

    except FileNotFoundError:
        print(f"❌ Error: El archivo de entrada '{archivo_entrada}' no fue encontrado.")
    except json.JSONDecodeError:
        print(f"❌ Error: El archivo de entrada '{archivo_entrada}' no es un JSON válido.")
    except Exception as e:
        print(f"❌ Ocurrió un error inesperado: {e}")

# --- Ejecución del Script ---
ARCHIVO_ENTRADA = '../json/comidas_data.json'
ARCHIVO_SALIDA = '../ddbb/comidas_validaciones.json'

aislar_y_limpiar_ciudades(ARCHIVO_ENTRADA, ARCHIVO_SALIDA)
