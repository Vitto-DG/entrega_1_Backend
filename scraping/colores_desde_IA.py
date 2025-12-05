import json

def generar_listado_colores():
    """
    Genera un listado de colores comunes en español,
    agrupados alfabéticamente, en formato JSON.
    """

    # Lista de colores comunes, incluyendo variantes y tonalidades reconocidas
    colores = [
        "Amarillo", "Azul", "Añil", "Avellana",
        "Beige", "Bermellón", "Blanco", "Borgoña", "Bronce",
        "Café", "Carmín", "Carmesí", "Celeste", "Cian", "Ciruela", "Cobalto",
        "Cobre", "Coral", "Crema",
        "Dorado",
        "Esmeralda",
        "Fucsia",
        "Gris", "Grisáceo",
        "Hueso",
        "Índigo",
        "Jade",
        "Khaki",
        "Ladrillo", "Lila", "Lima",
        "Marrón", "Malva", "Magenta", "Mostaza", "Morado",
        "Naranja", "Negro", "Níquel",
        "Ocre", "Oliva", "Oro",
        "Púrpura", "Plata", "Platino", "Perla", "Piel",
        "Rojo", "Rosa", "Rubí",
        "Salmón", "Sepia", "Siena",
        "Terracota", "Turquesa",
        "Ultramar",
        "Verde", "Violeta",
        "Wengué" # Color de madera oscura (marrón muy oscuro)
    ]

    # Ordenar y agrupar los colores
    colores_agrupados = {}
    ALFABETO = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

    for letra in ALFABETO:
        colores_agrupados[letra] = []

    for color in sorted(colores):
        primera_letra = color[0].upper()
        # Manejar la 'I' y la 'Í' (como ÍNDIGO)
        if primera_letra == 'Í':
            primera_letra = 'I'

        if primera_letra in colores_agrupados:
            # Poner el nombre en mayúsculas para seguir el formato solicitado
            colores_agrupados[primera_letra].append(color.upper())

    # ----------------------------------------------------
    # Generar el JSON final
    # ----------------------------------------------------
    nombre_archivo = "colores_agrupados.json"

    # Eliminar grupos vacíos (letras sin colores)
    colores_final = {k: v for k, v in colores_agrupados.items() if v}

    with open(nombre_archivo, 'w', encoding='utf-8') as f:
        json.dump(colores_final, f, ensure_ascii=False, indent=4)

    print(f"✅ ¡Lista de colores generada con éxito! Se ha guardado en el archivo: **{nombre_archivo}**")
    print("\n--- Vista Previa del Contenido JSON ---")

    # Muestra las primeras 3 entradas de cada grupo
    colores_para_preview = {k: v[:3] for k, v in colores_final.items()}
    print(json.dumps(colores_para_preview, indent=2, ensure_ascii=False))


# Ejecutar la función
generar_listado_colores()
