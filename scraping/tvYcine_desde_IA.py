import json
import unicodedata

def eliminar_acentos(texto):
    """Convierte caracteres acentuados (incluyendo la Ñ) a su equivalente ASCII base."""
    # Normaliza la cadena a su forma canónica de descomposición (separando acentos)
    nfkd_form = unicodedata.normalize('NFKD', texto)
    # Filtra y une solo los caracteres que son ASCII (quitando tildes, diéresis, etc.)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

def generar_listado_tv_cine():
    """
    Genera un listado extenso de programas de TV y películas populares,
    en mayúsculas, sin acentos ni la Ñ, agrupadas alfabéticamente.
    """

    # ----------------------------------------------------
    # LISTADO INICIAL DE TÍTULOS (Más de 150 ejemplos)
    # Incluye TV y Cine, con enfoque en la popularidad global y regional.
    # ----------------------------------------------------
    titulos = [
        # A
        "Amigos (Friends)", "Avatar (Cine)", "Avengers", "Argentina, 1985",
        "Aquí no hay quien viva", "Alicia en el País de las Maravillas", "Apocalipsis Now",
        "Anatomía de Grey", "American Pie", "Alien, el octavo pasajero", "Atracción Fatal",

        # B
        "Breaking Bad", "Batman", "Better Call Saul", "Big Bang Theory",
        "Blade Runner", "Bohemian Rhapsody", "Buscando a Nemo", "Bandersnatch",
        "Buffy, la cazavampiros", "Back to the Future",

        # C
        "Casablanca", "Cien Años de Perdón", "Community", "Claro de Luna",
        "Cazafantasmas (Ghostbusters)", "CSI", "Criminal Minds", "Carrie",
        "Ciudadano Kane", "Coco (Cine)", "Crepúsculo", "Corre Lola Corre",

        # D
        "Dark", "Doctor Who", "Duro de Matar (Die Hard)", "Donnie Darko",
        "Dr. House", "Dallas", "Dumbo", "Dexter", "Drive",

        # E
        "El Padrino", "El Señor de los Anillos", "Escuadrón Suicida", "Élite",
        "Expedientes X", "E.T. el extraterrestre", "El show de Truman",
        "Euphoria", "Entourage",

        # F
        "Fargo (TV)", "Forrest Gump", "Flashdance", "Fiebre del Sábado Noche",
        "Fringe", "Full House", "Física o Química",

        # G
        "Game of Thrones", "Gladiador", "Grey's Anatomy", "Gravity",
        "Good Will Hunting", "Gossip Girl", "Gotas de Agua (TV)",

        # H
        "Harry Potter", "Homeland", "Historias de la Cripta", "Hotel Rwanda",
        "Hércules", "How I Met Your Mother", "House of Cards",

        # I
        "Interestelar", "Indiana Jones", "Inception", "IT (Cine)",
        "Invencible", "I Love Lucy",

        # J
        "Juego de Tronos", "Jurasic Park", "Jumanji", "James Bond (007)",
        "Jaws (Tiburón)", "Juego de Gemelas",

        # K
        "Kill Bill", "Kramer vs Kramer", "Karate Kid",

        # L
        "Los Soprano", "La Casa de Papel", "Lost", "Ladrón de Bicicletas",
        "La La Land", "La Dimensión Desconocida", "Lupin", "Lucifer",

        # M
        "Mad Men", "Misión Imposible", "Matrix", "Mujer Bonita",
        "Modern Family", "Malcolm in the Middle", "MasterChef", "Merlí",

        # N
        "Narcos", "Netflix and Chill", "Náufrago", "Nine Perfect Strangers",
        "National Geographic (TV)",

        # O
        "Ozark", "Orange is the New Black", "Once Upon a Time", "Operación Dragón",
        "Ocean's Eleven", "Oficina de Asuntos",

        # P
        "Perdidos (Lost)", "Pulp Fiction", "Prison Break", "Pretty Little Liars",
        "Psicosis", "Parasite", "Peaky Blinders", "Paddington",

        # Q
        "Queen's Gambit", "Quinceañera", "Qué Vida Más Triste",

        # R
        "Roma (Cine)", "Rocky", "Rápidos y Furiosos", "Riverdale",
        "Requiem por un Sueño", "Regreso al Futuro",

        # S
        "Stranger Things", "Succession", "Seinfeld", "Star Wars",
        "Scarface", "Sex and the City", "Sherlock", "Squid Game",

        # T
        "The Wire", "The Crown", "The Office", "Titanic",
        "Taxi Driver", "Terminator", "Two and a Half Men", "Toy Story",

        # U
        "Un Lugar en el Sol", "Under the Dome", "Urgencias (ER)",

        # V
        "Vikingos", "Viaje a las Estrellas (Star Trek)", "V de Vendetta",
        "Veep", "Verano Azul", "Vis a Vis",

        # W
        "The Witcher", "Westworld", "Walking Dead", "Wall-E",
        "Whiplash", "Will & Grace",

        # X
        "X-Men", "X Files", "Xena, la princesa guerrera",

        # Y
        "Yellowstone", "You (TV)", "Yoga Hosers",

        # Z
        "Zombieland", "Zoolander", "Zodiaco"
    ]

    # Ordenar y agrupar los títulos
    titulos_agrupados = {}

    # Usamos un alfabeto que NO incluye la Ñ, ya que se convierte a N.
    ALFABETO = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

    for letra in ALFABETO:
        titulos_agrupados[letra] = []

    for titulo in sorted(titulos):
        # Limpiar etiquetas de origen (si las hubiera) y pasar a mayúsculas
        nombre_limpio_temp = titulo.split('(')[0].strip().upper()

        # Aplicar la función que quita acentos y convierte Ñ a N
        nombre_final = eliminar_acentos(nombre_limpio_temp)

        # Determinar la letra de agrupación
        primera_letra = nombre_final[0]

        # Asegurar que solo añadimos títulos con letras válidas
        if primera_letra in titulos_agrupados:
            titulos_agrupados[primera_letra].append(nombre_final)

    # ----------------------------------------------------
    # Generar el JSON final
    # ----------------------------------------------------
    nombre_archivo = "tv_cine_sin_acentos_agrupados.json"

    # Quitar grupos vacíos y eliminar duplicados.
    titulos_final = {k: sorted(list(set(v))) for k, v in titulos_agrupados.items() if v}

    with open(nombre_archivo, 'w', encoding='utf-8') as f:
        json.dump(titulos_final, f, ensure_ascii=False, indent=4)

    print(f"✅ ¡Lista de TV y Cine generada con éxito! Se ha guardado en el archivo: **{nombre_archivo}**")
    print(f"Total de títulos únicos encontrados: {sum(len(v) for v in titulos_final.values())}")

    print("\n--- Vista Previa del Contenido JSON (Primeros 3 por Letra) ---")
    titulos_para_preview = {k: v[:3] for k, v in titulos_final.items()}
    print(json.dumps(titulos_para_preview, indent=2, ensure_ascii=False))

# Ejecutar la función
generar_listado_tv_cine()
