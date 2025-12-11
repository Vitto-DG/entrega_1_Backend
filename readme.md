Proyecto Final: Simulador interactivo en JavaScript
Objetivos generales

Crear un simulador interactivo

Puede ser un Ecommerce, Cotizador de productos/servicios, Simulador de Home banking con transacciones, Convertidor de monedas/criptomonedas, entre otros.
(Yo elegi simular un juego de categorias en base a palabras a partir de una letra seleccionada con un sistema de ruleta llamado Tutti Frutti).


Objetivos específicos

Utilizar datos remotos (o simularlos con JSON alojado en un directorio al que podemos nombrar bd o bbdd)

HTML interactivo (generado desde JS. No se permiten funciones en el html o codigo JS dentro del HTML). Archivos JS dentro del elemento script dentro del head con el atributo defer. Archivos dentro de un directorio llamado html.

Uso de las herramientas más importantes de JS, y librerías externas (recomendaron SweetAlert2 y/o Toastify). Minimo, 2 archivos JS dentro de un directorio llamado js.

Estilos con Bootstrap o Tailwind CSS. Archivos CSS dentro de un directorio llamado css.

Tiene que ser 100% funcional y con la lógica de negocio de tu proyecto elegido (Ejemplo: si creas un Ecommerce, simula el proceso completo de compra) <---------------> Se debe entregar


Proyecto HTML + CSS + JS funcional


Formato:

Link a repositorio de Github (el preferido)

debe tener el nombre “ProyectoFinal+Apellido”

Sugerencias:

Elimina console.log y derivados

Reemplaza alert, prompt, confirm por una librería JS (SweetAlert2 o Toastify)

Si incluyes formularios a completar,
precarga datos en los campos
<---------------> ## Criterios de evaluación

Funcionalidad
Se simula uno o más flujo de trabajo en termino de entrada-procesamiento-salida y no se advierten errores de cómputo.

Interactividad
Se capturan entradas empleando inputs y eventos adecuados. Las salidas son coherentes en relación a los datos ingresados y se visualizan en el HTML de forma asíncrona.

Escalabilidad
Se declaran funciones con parámetros para definir instrucciones con una tarea específica. Se definen objetos con propiedades y métodos relevantes al contexto. Se emplean arrays para agrupar valores y objetos de forma dinámica. El recorrido de las colecciones es óptimo.

Integridad
Se definen el código JavaScript en un archivo .js, referenciándolo correctamente desde el HTML. La información estática en formato JSON se utiliza adecuadamente, cargandose de forma asíncrona.

Legibilidad
Los nombres de variables. funciones y objetos son significativos para el contexto, las instrucciones se escriben de forma legible y se emplean comentarios oportunos. El código fuente es ordenado en términos de declaración y secuencia.


Mi proyecto se trata de un juego llamado Tutti Frutti, que consiste en que un jugador le indica a una ruleta que itera sobre las letras del abecedario, cuando detenerse al presionar la tecla A.
Luego de indicar que letra ha sido seleccionada, se meustra una cuenta regresiva de 3 segundos y un YA! para comenzar el juego. 
Donde el usuario debera ir completando las categorias con palabras que comiencen con esa misma letra (y que coincidan con alguna de las palabras guardadas en la bbdd). El jugador determinara el final del juego luego de presionar Enter en el anteultimo input. Se mostrara un mensaje que dice "Basta para mi, basta para todos!" con un boton que diga "Continuar". aparecera una ventana emergente solicitando ingresar el nombre y al aceptar una nueva ventana emergera y mostrara el nombre, letra, tiempo en completar la ronda y puntaje. Y debajo dos botones:
Nueva Ronda y Tabla de puntajes.
El boton Nueva Ronda, reiniciará el estado del juego y de la ruleta pero debera quedar en pantalla los inputs y valores de la ronda anterior.
El boton Tabla de puntajes, mostrara una tabla con los puntajes de todas las rondas jugadas hasta ese momento en orden de mayor puntaje en menor tiempo.

Mis aportes mas finos son:
Separar la logica del procesamiento de puntajes y resultados, del archivo js que crea los elementos dinamicos html. Tambien en un tercer archivo, la logica de la ruleta.

Los directorios json scraping y util, no son necesarios para la entrega pero los quiero conservar en mi ordenador para futuras referencias.