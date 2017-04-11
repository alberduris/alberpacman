# alberpacman

<h1>Desarrollo del juego “Pacman” mediante HTML5 y JS</h1>

<h2>Introducción</h2>
El objetivo primario de la práctica es desarrollar el juego Pacman mediante HTML5 y JS. 
En este documento se detallan las funcionalidades extra que se han implementado como segunda parte de la práctica.
La URL para acceder al juego completo es: alberpacman.hol.es

<h2>Funcionalidades extra</h2>
<h3>Niveles</h3>
Se ha implementado un sistema de niveles. Cuando el jugador ha comido todas las píldoras, incluidas las de poder, pasará automáticamente al siguiente nivel.
A diferencia de los especificado en la sugerencia del enunciado, todos los niveles son estructural y visualmente iguales (como en el juego original).
Por otro lado, cada nivel tiene sus ciertas características propias. Una fruta específica y velocidades diferentes para el jugador/fantasmas.

<h3>Frutas</h3>
Se han implementado elementos coleccionables en el juego. Al igual que en el original, dichos coleccionables son “frutas”. 
Las frutas aparecen en una posición fija del mapa durante cortos periodos de tiempo, en intervalos. La recolección de las mismas aportará puntos extra al jugador. Como se ha mencionado anteriormente, cada nivel tendrá una fruta característica.

<h3>Puntuación</h3>
Se ha implementado un sistema de puntuación. Realizar ciertas acciones en el juego proporcionará puntos al jugador. Se consiguen puntos por: Recoger píldoras, píldoras de poder y frutas y por comer fantasmas.
Además, al llegar a una cierta cantidad de puntos, se otorgará una vida extra al jugador.
La puntuación actual se podrá ver en pantalla en todo momento.

<h3>Pausar el juego</h3>
Se ha implementado la posibilidad de pausar el juego. La manera de acceder al modo pausa será pulsar la barra espaciadora mientras se está jugando. En ese momento la imagen se congelará y el juego estará pausado, para reanudar el juego habrá que volver a pulsar la barra espaciadora, tras un breve periodo de tiempo, para dar tiempo a prepararse de nuevo al jugador, se podrá seguir jugando.

<h3>Hall Of Fame</h3>
Se ha implementado un ranking online. Cuando un jugador juegue por primera vez y establezca una puntuación, se almacenará en el ranking. Si posteriormente vuelve a jugar y supera la puntuación, su puntuación máxima se actualizará. 
Se almacena un ranking con todos los jugadores que han establecido una puntuación, pero sólo se mostrarán 10 en el Hall Of Fame (y al propio jugador se le mostrará su posición global y en qué porcentaje del ranking se encuentra)
Para acceder al Hall Of Fame se pulsará la tecla “H” desde el menú principal y para salir de éste se pulsará la tecla “Esc”.
La identificación de usuario, para evitar teclear nombres o apodos y, de esa manera, empeorar la inmersión en el juego, se realizará mediante la dirección IP pública del jugador.

<h3>Soporte multibrowser</h3>
Se puede jugar desde todos los principales navegadores: Chrome, Firefox, Explorer. Aunque es cierto que no se ha implementado ninguna estrategia concreta para proveer dicha característica.
No se ha implementado soporte para dispositivos móviles, por lo que no puede jugarse desde ellos.
Animación personajes mediante Canvas
Se han realizado animaciones empleando únicamente el elemento Canvas de HTML5 y JS. Aunque en el enunciado de la práctica se sugiere implementar animaciones mediante Sprites, esto no se ha realizado.

<h3>IA</h3>
Se ha implementado una IA sencilla, que se activa cuando el jugador come a un fantasma vulnerable, para que los estos vuelvan a su punto de partida y vuelvan a su estado normal.

<h3>Otros</h3>
Además, se han implementado otras funcionalidades/características menores que pueden apreciarse durante la experiencia de juego y no merece la pena mencionarlas detalladamente.
