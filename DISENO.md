# FIBO — sistema de diseño del sitio

Referencia obligatoria para cualquier sección o contenido nuevo. Lo que se agregue debe verse y moverse igual que el sitio actual (`index.html`).

## Tipografía
- **Space Grotesk**: títulos de sección y textos ("Un FIBO para cada momento", "Proteína que sí se antoja.", "22g").
- **JetBrains Mono**: etiquetas, datos, notas y franjas ("Barra de proteína // Deporte", "01 / 04", "Abre. Come. Sigue.").
- **Anton**: títulos de impacto, como en el empaque ("CON FIBO TE ENCUENTRAS", "CUATRO SABORES").
- Etiquetas entre corchetes: `[ SABORES ]`.

## Color
Rojo `#D6161D` · Negro `#0C0B0A` · Crema `#F2EFE8` · Azul `#3A5CFF` · Lima `#C9F23A`.
Cada sección es un bloque de color sólido a todo lo ancho. Colores de sabor solo en sabores y escáner.

## Componentes (reutilizar, no inventar nuevos)
| Componente | Sección actual |
|---|---|
| Portada lima con bloques de pixel negros/rojos/azules + barras reales | Hero |
| Franja animada roja con palabras y ✳ | Marquee |
| Barra 3D con rayas brillantes, se arrastra | FIBO en 360° |
| Logo / cifra en matriz de puntos que reacciona al cursor | Wordmark rojo, footer "22G" |
| Filas numeradas de color que crecen al pasar el cursor | Un FIBO para cada momento |
| Tarjetas tipo bento con cifra que cuenta | Proteína que sí se antoja / 22g |
| Escáner pixel a color por sabor con contador 00G→22G | Cuatro sabores |
| Río de barritas que se dispersan con el cursor | Hecha para moverse |
| Ventana con cuadrícula de colores y título que aparece letra por letra | Tu proteína de hoy |
| Espiral de Fibonacci con rayas brillantes | Cada día suma al anterior |
| Flecha de pixel, cursor cuadrado | Todo el sitio |

## Movimiento
- Todo aparece al entrar en pantalla (no antes); nada queda oculto si no hay animación.
- Interacciones al cursor: bloques que se encienden, puntos que se encogen, filas que crecen, barras que se dispersan, objetos que se arrastran.
- Animaciones continuas suaves (franja, flotación, giro); respetar "reducir movimiento".

## Lo que NO se hace
- No convertir el sitio en diapositivas ni cambiar su estructura de página con scroll.
- No agregar tipografías, paletas ni estilos de presentación distintos.
