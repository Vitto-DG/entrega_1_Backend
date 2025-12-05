import json

def generar_listado_fv_argentina():
    """
    Genera un listado de frutas y verduras comunes en Argentina,
    agrupados alfabéticamente, en formato JSON.
    """

    # Lista de frutas y verduras comunes en Argentina
    productos = [
        "Acelga", "Achicoria", "Ají", "Ajo", "Albahaca", "Alcaucil (Alcachofa)",
        "Almendra", "Ananá (Piña)", "Arándano", "Arveja", "Avellana",
        "Banana", "Batata (Boniato)", "Berenjena", "Brócoli",
        "Calabacín (Zapallito)", "Calabaza", "Cebolla", "Cereza", "Chaucha (Vaina)",
        "Choclo (Maíz)", "Ciruela", "Coco", "Coliflor", "Durazno (Melocotón)",
        "Endibia", "Espárrago", "Espinaca", "Frambuesa", "Frutilla (Fresa)",
        "Grosella", "Guayaba", "Higo", "Hinojo", "Kiwi", "Lima", "Limón",
        "Lechuga", "Mandarina", "Mango", "Manzana", "Maracuyá", "Melón",
        "Membrillo", "Menta", "Nabo", "Naranja", "Níspero", "Nuez", "Papa",
        "Palta (Aguacate)", "Pepino", "Pera", "Pimiento (Morrón)", "Pomelo (Toronja)",
        "Poroto (Frijol/Haba)", "Puerro", "Quince (Membrillo)", "Rábano",
        "Remolacha (Betabel)", "Repollo (Col)", "Rúcula", "Sandía", "Tomate",
        "Uva", "Vainilla", "Zapallo (Calabaza grande)", "Zanahoria", "Zapallito (Calabacín)"
    ]

    # Ordenar y agrupar los productos
    productos_agrupados = {}

    # 🚨 ¡CORRECCIÓN APLICADA AQUÍ! 🚨
    ALFABETO = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

    for letra in ALFABETO:
        productos_agrupados[letra] = []

    for producto in sorted(productos):
        primera_letra = producto[0].upper()
        if primera_letra in productos_agrupados:
            productos_agrupados[primera_letra].append(producto.upper())

    # Agregamos Ñ manualmente ya que no está en el alfabeto inglés
    productos_agrupados['Ñ'] = ["ÑAME"] # Ejemplo, no común en Argentina

    # Generar el JSON final
    nombre_archivo = "fv_argentina_agrupadas.json"

    with open(nombre_archivo, 'w', encoding='utf-8') as f:
        # Aquí se usa productos_agrupados, si deseas excluir las letras sin productos,
        # deberías usar el diccionario 'productos_final' de la versión anterior.
        json.dump(productos_agrupados, f, ensure_ascii=False, indent=4)

    print(f"✅ ¡Lista generada con éxito! Se ha guardado en el archivo: **{nombre_archivo}**")
    print("\n--- Vista Previa del Contenido JSON ---")

    # Muestra las primeras 3 entradas de cada grupo no vacío
    productos_para_preview = {k: v[:3] for k, v in productos_agrupados.items() if v}
    print(json.dumps(productos_para_preview, indent=2, ensure_ascii=False))


# Ejecutar la función
generar_listado_fv_argentina()
