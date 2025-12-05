import json
import unicodedata

def eliminar_acentos(texto):
    """Convierte caracteres acentuados (incluyendo la Ñ) a su equivalente ASCII base."""
    # Normaliza la cadena a su forma canónica de descomposición (separando acentos)
    nfkd_form = unicodedata.normalize('NFKD', texto)
    # Filtra y une solo los caracteres que son ASCII (quitando tildes, diéresis, etc.)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

def generar_listado_marcas_sin_acentos():
    """
    Genera un listado extenso de marcas populares, en mayúsculas y sin acentos ni la Ñ,
    agrupadas alfabéticamente en formato JSON.
    """

    # ----------------------------------------------------
    # LISTADO INICIAL DE MARCAS (El mismo listado amplio)
    # Incluye Argentina (ARG), Sudamérica (SUD) e Internacionales (INT) conocidas.
    # ----------------------------------------------------
    marcas = [
        # A
        "Arcor (ARG)", "Aguila (ARG)", "Adidas (INT)", "Aerolíneas Argentinas (ARG)",
        "Apple (INT)", "Acqua di Gio (INT)", "Alpina (SUD)", "Alto Palermo (ARG)",
        "Ariel (INT)", "Ala (ARG)", "Atún La Campagnola (ARG)",

        # B
        "Bagley (ARG)", "Bimbo (SUD/INT)", "Banco Galicia (ARG)", "Brahma (SUD)",
        "Burger King (INT)", "Bic (INT)", "Bonafide (ARG)", "Baggio (ARG)",
        "Brother (INT)", "Bridgestone (INT)",

        # C
        "Coca-Cola (INT)", "Coto (ARG)", "Carrefour (INT)", "Claro (SUD/INT)",
        "Cheetos (INT)", "Chevrolet (INT)", "Chandon (INT)", "Clarín (ARG)",
        "Cerveza Quilmes (ARG)", "Cinzano (INT)", "Colgate (INT)", "Capitán del Espacio (ARG)",

        # D
        "Danone (INT)", "Dove (INT)", "Dolce Gusto (INT)", "Diesel (INT)",
        "DirecTV (SUD/INT)", "Don Satur (ARG)", "Disco (ARG)", "Dell (INT)",

        # E
        "Easy (ARG)", "ExxonMobil (INT)", "Edesur (ARG)", "Expreso Singer (SUD)",
        "Epson (INT)", "Edenor (ARG)", "Esso (INT)",

        # F
        "Ford (INT)", "Fargo (ARG)", "Fanta (INT)", "Fiat (INT)", "Faber-Castell (INT)",
        "Farmacity (ARG)", "Frizze (ARG)", "Freddo (ARG)", "Facundo (ARG)",

        # G
        "Google (INT)", "Gillette (INT)", "Garbarino (ARG)", "Giorgio Armani (INT)",
        "Gancia (ARG)", "Globant (ARG/INT)", "Gancia (ARG)", "Gatorade (INT)",

        # H
        "Havanna (ARG)", "HP (INT)", "Hanes (INT)", "Honda (INT)", "Head & Shoulders (INT)",
        "Hellmann's (INT)", "Huggies (INT)", "Home Depot (INT)", "HSBC (INT)",

        # I
        "Iveco (INT)", "Indio (ARG)", "Intel (INT)", "Ikea (INT)", "Isenbeck (ARG)",

        # J
        "Jumbo (ARG)", "Johnnie Walker (INT)", "J&B (INT)", "JVC (INT)",

        # K
        "Kotex (INT)", "Knorr (INT)", "Kodak (INT)", "Kyocera (INT)", "KFC (INT)",

        # L
        "La Serenísima (ARG)", "Levis (INT)", "Lays (INT)", "L'Oréal (INT)",
        "LG (INT)", "La Campagnola (ARG)", "Luchetti (ARG)", "Lucchetti (ARG)",

        # M
        "Mercado Libre (ARG/SUD)", "McDonald's (INT)", "MasterCard (INT)",
        "Microsoft (INT)", "Movistar (SUD/INT)", "Marley Coffee (SUD)",
        "Mundo Marino (ARG)", "Manaos (ARG)", "Magistral (ARG)", "Michelin (INT)",

        # N
        "Netflix (INT)", "Nestlé (INT)", "Nike (INT)", "Nivea (INT)",
        "Natura (SUD)", "Nextel (SUD)", "Nokia (INT)", "Nutella (INT)",

        # O
        "Oreo (INT)", "Oba Oba (ARG)", "Oral-B (INT)", "Old Spice (INT)",

        # P
        "Pepsi (INT)", "Patagonia Cerveza (ARG)", "Personal (ARG)", "Puma (INT)",
        "Pampers (INT)", "Phillips (INT)", "Pato (ARG)", "Pritt (INT)",

        # Q
        "Quilmes (ARG)", "Quaker (INT)", "Quickfood (ARG)", "Queso Crema Casancrem (ARG)",

        # R
        "Renault (INT)", "Reebok (INT)", "Río Paraná (ARG)", "Revlon (INT)",
        "Raid (INT)", "Rexona (INT)", "Rapsodia (ARG)", "Río de la Plata (ARG)",

        # S
        "Samsung (INT)", "Sony (INT)", "Shell (INT)", "Spotify (INT)",
        "Starbucks (INT)", "Subway (INT)", "Sancor (ARG)", "Ser (ARG)",
        "Skip (ARG)", "Sprite (INT)", "Súpermercados Día (INT)",

        # T
        "Toyota (INT)", "Tarjeta Naranja (ARG)", "Telefe (ARG)", "Twistos (INT)",
        "Telecom (ARG)", "Tigre (SUD)", "Tregar (ARG)", "Tía Maruca (ARG)",

        # U
        "Unilever (INT)", "Uber (INT)", "Unicenter (ARG)", "Universal Music (INT)",

        # V
        "Visa (INT)", "Volkswagen (INT)", "Vogue (INT)", "Vizzio (ARG)",
        "Vía Bariloche (ARG)", "Vascolet (ARG)",

        # W
        "Whirlpool (INT)", "Walmart (INT)", "Wella (INT)", "Wendy's (INT)",

        # X
        "Xiaomi (INT)", "Xerox (INT)", "X-Men (INT)",

        # Y
        "Youtube (INT)", "Yahoo (INT)", "YPF (ARG)", "Yogurísimo (ARG)",

        # Z
        "Zara (INT)", "Ziploc (INT)", "ZTE (INT)", "Zapatillas Topper (ARG)"
    ]

    # Ordenar y agrupar las marcas
    marcas_agrupadas = {}

    # Usamos un alfabeto que NO incluye la Ñ, ya que se convierte a N.
    ALFABETO = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

    for letra in ALFABETO:
        marcas_agrupadas[letra] = []

    for marca in sorted(marcas):
        # Limpiar la etiqueta de origen (ARG, INT, etc.) y pasar a mayúsculas
        nombre_limpio_temp = marca.split('(')[0].strip().upper()

        # 🚨 Aplicar la función que quita acentos y convierte Ñ a N
        nombre_final = eliminar_acentos(nombre_limpio_temp)

        # Determinar la letra de agrupación (que ya no tendrá tildes/Ñ)
        primera_letra = nombre_final[0]

        # Asegurar que solo añadimos marcas con letras válidas del alfabeto ASCII
        if primera_letra in marcas_agrupadas:
            marcas_agrupadas[primera_letra].append(nombre_final)

    # ----------------------------------------------------
    # Generar el JSON final
    # ----------------------------------------------------
    nombre_archivo = "marcas_sin_acentos_agrupadas.json"

    # Quitar grupos vacíos y eliminar duplicados.
    marcas_final = {k: sorted(list(set(v))) for k, v in marcas_agrupadas.items() if v}

    with open(nombre_archivo, 'w', encoding='utf-8') as f:
        json.dump(marcas_final, f, ensure_ascii=False, indent=4)

    print(f"✅ ¡Lista de marcas generada con éxito! Se ha guardado en el archivo: **{nombre_archivo}**")
    print(f"Total de marcas únicas encontradas: {sum(len(v) for v in marcas_final.values())}")

    print("\n--- Vista Previa del Contenido JSON (Primeras 3 por Letra) ---")
    marcas_para_preview = {k: v[:3] for k, v in marcas_final.items()}
    print(json.dumps(marcas_para_preview, indent=2, ensure_ascii=False))


# Ejecutar la función
generar_listado_marcas_sin_acentos()
