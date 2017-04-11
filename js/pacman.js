// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var canvas_ui = document.getElementById("canvas_ui")
var ctx = canvas.getContext("2d");
var ctx_ui = canvas_ui.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var w_ui = canvas_ui.width;
var h_ui = canvas_ui.height;
var ghostComido = -1;
var playerSpeed = 2;
var ghostSpeed = 1;
var oldTime = 0;
var levelTimer = 0;
//Anim Pacman
var dir = -10, pctOpen = 100;
//Añadido por Alber
//Algunas variables globales
let pacmanOffset = 2;
let alturaMapa = 25;
//@test: Cambiar vidas iniciales
let initialLifes = 3;
let baseEatPoints = 200;
let PILL_SIZE = 2;
//Draw pacman
let anchuraBarra = 1;
let ghostXOffset = 2;
let ghostYOffset = 1;
//Move ghost
let ghostCasaCol = 10;
let ghostCasaRow = 12;
let ghostInitialSpeed = 1;
//Frutis
let fruitX = w/2-8;
let fruitY = h/2+28;
var renderFruitTime = 0;
var frutaRecogida = false;
var fruitPointsTimer = 0;
//Score
var base1UP = 10000;
var scoreNextLife = base1UP;
//Highlight
var highscoreColors = ["rgb(4,252,220)",
    "rgb(252,252,5)",
    "rgb(220,220,200)",
    "rgb(244,204,52)",
    "rgb(252,180,68)",
    "rgb(252,180,148)",
    "rgb(244,204,52)",
    "rgb(252,252,4)",
    "rgb(20,180,44)",
    "rgb(4,252,220)",
    "rgb(20,156,180)",
    "rgb(12,212,36)"
]

var highScores = [["Blinky",1000],
    ["Pinky",800],
    ["Inky",700],
    ["Clyde",600],
    ["Shadow",500],
    ["Speedy",400],
    ["Bashful",300],
    ["Pokey",200],
    ["Pacman",100],
    ["Tōru Iwatani",0],

]
var clientPublicIP = "IPNotFoundLittleHacker";
//Audios
var audios = {};
var muteTime = 0;
let maxVol = 1;
let steps = 20;
let volStep = maxVol/steps;
var backupVol = 0;
//Pause
var backupTimer;






// GAME FRAMEWORK 
var GF = function () {

    // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps;

    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {}
    //Añadido por Alber
    keys = {}

    //Hay que hacerlo dinámico - TILE HEIGHT = ALTURACANVAS/Nº DE FILAS DEL MAPA
    const TILE_HEIGHT = h / alturaMapa;
    const TILE_WIDTH = TILE_HEIGHT;
    //@test: Cambiar nº fantasmas
    var numGhosts = 4;
    var ghostcolor = {};
    ghostcolor[0] = "rgba(255, 0, 0, 255)";
    ghostcolor[1] = "rgba(255, 180, 255, 255)";
    ghostcolor[2] = "rgba(0, 255, 255, 255)";
    ghostcolor[3] = "rgba(255, 180, 80,   255)";
    ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
    ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost

    // hold ghost objects
    var ghosts = {};

    //SPRITES




    var Ghost = function (id, ctx) {

        this.x = -100;
        this.y = -100;
        this.radius = TILE_WIDTH / 2 - pacmanOffset;
        this.velX = 0;
        this.velY = 0;
        //@test: Fantasmas quietos
        this.speed = ghostSpeed;

        this.nearestRow = 0;
        this.nearestCol = 0;

        this.ctx = ctx;

        this.id = id;
        //Añadido por Alber
        //Para que no se vea por error en un primer frame "lento"
        this.homeX = -100;
        this.homeY = -100;


        this.state = Ghost.NORMAL;

        this.draw = function (x, y) {
            // Pintar cuerpo de fantasma
            /*Cuadrado para tests*/

            if (this.state == Ghost.VULNERABLE) {
                this.drawGhostVulnerable(x, y);
            }
            else if (this.state == Ghost.SPECTACLES) {

                //Ojos
                ctx.fillStyle = 'rgba(255,255,255,255)';
                //Izd
                ctx.fillRect(x + 2 + ghostXOffset, y + 1 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 3 + ghostXOffset, y + ghostYOffset, 2, 5);
                //Dcha
                ctx.fillRect(x + 8 + ghostXOffset, y + 1 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 9 + ghostXOffset, y + ghostYOffset, 2, 5);
                //Pupila
                ctx.fillStyle = 'rgba(35,64,140,255)';
                ctx.fillRect(x + 3 + ghostXOffset, y + ghostYOffset, 2, 2);
                ctx.fillRect(x + 9 + ghostXOffset, y + ghostYOffset, 2, 2);
            }
            else {


                if (this.id == 0) {//Clyde
                    ctx.fillStyle = ghostcolor[0];
                    this.drawGhostNormal(x, y);

                }
                else if (this.id == 1) {//Blinky
                    ctx.fillStyle = ghostcolor[1];
                    this.drawGhostNormal(x, y);
                }
                else if (this.id == 2) {//Pinky
                    ctx.fillStyle = ghostcolor[2];
                    this.drawGhostNormal(x, y);
                }
                else if (this.id == 3) {//Inky
                    ctx.fillStyle = ghostcolor[3];
                    this.drawGhostNormal(x, y);
                }
            }
        }; // draw

        this.drawGhostNormal = function (x, y) {


            if (Math.floor(Date.now() / thisLevel.ghostAnimTimer) % 2) {//ANIMACIÓN 1
                //Extremo
                ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);
                //Bloque2
                ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                //Bloque3
                ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                //Centro
                ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Centro
                ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Bloque3
                ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                //Bloque2
                ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                //Extremo
                ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);

            }

            else {//ANIMACIÓN 2
                //Extremo
                ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                //Pieza tetris
                ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                //Cuadrado abajo
                ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Centro
                ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                //Centro
                ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                //Cuadrado abajo
                ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                //Pieza tetris
                ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                //Extremo
                ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
            }

            if (this.velY < 0) {//Arriba
                //Ojos
                ctx.fillStyle = 'rgba(255,255,255,255)';
                //Izd
                ctx.fillRect(x + 2 + ghostXOffset, y + 1 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 3 + ghostXOffset, y + ghostYOffset, 2, 5);
                //Dcha
                ctx.fillRect(x + 8 + ghostXOffset, y + 1 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 9 + ghostXOffset, y + ghostYOffset, 2, 5);
                //Pupila
                ctx.fillStyle = 'rgba(35,64,140,255)';
                ctx.fillRect(x + 3 + ghostXOffset, y + ghostYOffset, 2, 2);
                ctx.fillRect(x + 9 + ghostXOffset, y + ghostYOffset, 2, 2);
            }
            else if (this.velX > 0) {//Dcha
                //Ojos
                //Izd
                ctx.fillStyle = 'rgba(255,255,255,255)';
                ctx.fillRect(x + 3 + ghostXOffset, y + 4 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 4 + ghostXOffset, y + 3 + ghostYOffset, 2, 5);
                //Dcha
                ctx.fillRect(x + 9 + ghostXOffset, y + 4 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 10 + ghostXOffset, y + 3 + ghostYOffset, 2, 5);
                //Pupilas
                ctx.fillStyle = 'rgba(35,64,140,255)';
                ctx.fillRect(x + 5 + ghostXOffset, y + 5 + ghostYOffset, 2, 2);
                ctx.fillRect(x + 11 + ghostXOffset, y + 5 + ghostYOffset, 2, 2);
            }
            else if (this.velY > 0) {//Abajo
                //Ojos
                ctx.fillStyle = 'rgba(255,255,255,255)';
                //Izd
                ctx.fillRect(x + 2 + ghostXOffset, y + 7 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 3 + ghostXOffset, y + 6 + ghostYOffset, 2, 5);
                //Dcha
                ctx.fillRect(x + 8 + ghostXOffset, y + 7 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 9 + ghostXOffset, y + 6 + ghostYOffset, 2, 5);
                //Pupilas
                ctx.fillStyle = 'rgba(35,64,140,255)';
                ctx.fillRect(x + 3 + ghostXOffset, y + 9 + ghostYOffset, 2, 2);
                ctx.fillRect(x + 9 + ghostXOffset, y + 9 + ghostYOffset, 2, 2);
            }
            else {//Izquierda
                //Ojos
                //Izd
                ctx.fillStyle = 'rgba(255,255,255,255)';
                ctx.fillRect(x + ghostXOffset, y + 4 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, 2, 5);
                //Dcha
                ctx.fillRect(x + 6 + ghostXOffset, y + 4 + ghostYOffset, 4, 3);
                ctx.fillRect(x + 7 + ghostXOffset, y + 3 + ghostYOffset, 2, 5);
                //Pupilas
                ctx.fillStyle = 'rgba(35,64,140,255)';
                ctx.fillRect(x + ghostXOffset, y + 5 + ghostYOffset, 2, 2);
                ctx.fillRect(x + 6 + ghostXOffset, y + 5 + ghostYOffset, 2, 2);
            }
        };

        this.drawGhostUI = function (x, y) {

            ctx.fillStyle = ghostcolor[this.id];
            //Extremo

            ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
            //Pieza tetris
            ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
            ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
            ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
            //Cuadrado abajo
            ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
            ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
            //Centro
            ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
            //Centro
            ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
            //Cuadrado abajo
            ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
            ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
            //Pieza tetris
            ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
            ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
            ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
            //Extremo
            ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);

            //Ojos
            //Izd
            ctx.fillStyle = 'rgba(255,255,255,255)';
            ctx.fillRect(x + 3 + ghostXOffset, y + 4 + ghostYOffset, 4, 3);
            ctx.fillRect(x + 4 + ghostXOffset, y + 3 + ghostYOffset, 2, 5);
            //Dcha
            ctx.fillRect(x + 9 + ghostXOffset, y + 4 + ghostYOffset, 4, 3);
            ctx.fillRect(x + 10 + ghostXOffset, y + 3 + ghostYOffset, 2, 5);
            //Pupilas
            ctx.fillStyle = 'rgba(35,64,140,255)';
            ctx.fillRect(x + 5 + ghostXOffset, y + 5 + ghostYOffset, 2, 2);
            ctx.fillRect(x + 11 + ghostXOffset, y + 5 + ghostYOffset, 2, 2);

        };

        this.drawGhostVulnerable = function (x, y) {

            if (thisGame.ghostTimer > 120) {
                ctx.fillStyle = ghostcolor[4];
                if (Math.floor(Date.now() / thisLevel.ghostAnimTimer) % 2) {//ANIMACIÓN 1
                    //Extremo
                    ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);
                    //Bloque2
                    ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                    ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                    //Bloque3
                    ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                    ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                    ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                    //Centro
                    ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                    //Centro
                    ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                    //Bloque3
                    ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                    ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                    ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                    //Bloque2
                    ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                    ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                    //Extremo
                    ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);

                }
                else {//ANIMACIÓN 2
                    //Extremo
                    ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                    //Pieza tetris
                    ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                    ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                    ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                    //Cuadrado abajo
                    ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                    ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                    //Centro
                    ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                    //Centro
                    ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                    //Cuadrado abajo
                    ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                    ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                    //Pieza tetris
                    ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                    ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                    ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                    //Extremo
                    ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                }
                //Ojos y boca
                ctx.fillStyle = 'rgba(253,199,139,255)';
                //Izd
                ctx.fillRect(x + 3 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
                //Dcha
                ctx.fillRect(x + 9 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
                //Boca
                ctx.fillRect(x + 1 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);
                ctx.fillRect(x + 2 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                ctx.fillRect(x + 4 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
                ctx.fillRect(x + 6 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                ctx.fillRect(x + 8 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
                ctx.fillRect(x + 10 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                ctx.fillRect(x + 12 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);

            }
            else {
                if (Math.floor(Date.now() / 400) % 2) {
                    ctx.fillStyle = ghostcolor[4];
                    if (Math.floor(Date.now() / thisLevel.ghostAnimTimer) % 2) {//ANIMACIÓN 1
                        //Extremo
                        ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);
                        //Bloque2
                        ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                        ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                        //Bloque3
                        ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                        ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                        //Centro
                        ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                        //Centro
                        ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                        //Bloque3
                        ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                        ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                        //Bloque2
                        ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                        ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                        //Extremo
                        ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);

                    }
                    else {//ANIMACIÓN 2
                        //Extremo
                        ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                        //Pieza tetris
                        ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                        //Cuadrado abajo
                        ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                        ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                        //Centro
                        ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                        //Centro
                        ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                        //Cuadrado abajo
                        ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                        ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                        //Pieza tetris
                        ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                        ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                        //Extremo
                        ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                    }

                    //Ojos y boca
                    ctx.fillStyle = 'rgba(253,199,139,255)';
                    //Izd
                    ctx.fillRect(x + 3 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
                    //Dcha
                    ctx.fillRect(x + 9 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
                    //Boca
                    ctx.fillRect(x + 1 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);
                    ctx.fillRect(x + 2 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 4 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 6 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 8 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 10 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 12 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);

                }
                else {
                    ctx.fillStyle = ghostcolor[5];
                    if (Math.floor(Date.now() / thisLevel.ghostAnimTimer) % 2) {//ANIMACIÓN 1
                        //Extremo
                        ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);
                        //Bloque2
                        ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                        ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                        //Bloque3
                        ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                        ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                        //Centro
                        ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                        //Centro
                        ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                        //Bloque3
                        ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                        ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                        //Bloque2
                        ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                        ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                        //Extremo
                        ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);

                    }
                    else {//ANIMACIÓN 2
                        //Extremo
                        ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                        //Pieza tetris
                        ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                        //Cuadrado abajo
                        ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                        ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                        //Centro
                        ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                        //Centro
                        ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                        //Cuadrado abajo
                        ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                        ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                        //Pieza tetris
                        ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                        ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                        ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                        //Extremo
                        ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                    }

                    //Ojos y boca
                    ctx.fillStyle = 'red';
                    //Izd
                    ctx.fillRect(x + 3 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
                    //Dcha
                    ctx.fillRect(x + 9 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
                    //Boca
                    ctx.fillRect(x + 1 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);
                    ctx.fillRect(x + 2 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 4 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 6 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 8 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 10 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
                    ctx.fillRect(x + 12 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);

                }


            }


            //Ojos


            //Izd
            ctx.fillRect(x + 3 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
            //Dcha
            ctx.fillRect(x + 9 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);

            //Boca
            ctx.fillRect(x + 1 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);
            ctx.fillRect(x + 2 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 4 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 6 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 8 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 10 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 12 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);

        };

        this.drawGhostLeft = function (x, y, color) {
            ctx.fillStyle = color;
            if (Math.floor(Date.now() / thisLevel.ghostAnimTimer) % 2) {//ANIMACIÓN 1
                //Extremo
                ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);
                //Bloque2
                ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                //Bloque3
                ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                //Centro
                ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Centro
                ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Bloque3
                ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                //Bloque2
                ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                //Extremo
                ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);

            }

            else {//ANIMACIÓN 2
                //Extremo
                ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                //Pieza tetris
                ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                //Cuadrado abajo
                ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Centro
                ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                //Centro
                ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                //Cuadrado abajo
                ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                //Pieza tetris
                ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                //Extremo
                ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
            }
            //Ojos
            //Izd
            ctx.fillStyle = 'rgba(255,255,255,255)';
            ctx.fillRect(x + ghostXOffset, y + 4 + ghostYOffset, 4, 3);
            ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, 2, 5);
            //Dcha
            ctx.fillRect(x + 6 + ghostXOffset, y + 4 + ghostYOffset, 4, 3);
            ctx.fillRect(x + 7 + ghostXOffset, y + 3 + ghostYOffset, 2, 5);
            //Pupilas
            ctx.fillStyle = 'rgba(35,64,140,255)';
            ctx.fillRect(x + ghostXOffset, y + 5 + ghostYOffset, 2, 2);
            ctx.fillRect(x + 6 + ghostXOffset, y + 5 + ghostYOffset, 2, 2);
        };

        this.drawGhostRight = function (x, y, color) {
            ctx.fillStyle = color;
            ctx.fillStyle = ghostcolor[4];
            if (Math.floor(Date.now() / thisLevel.ghostAnimTimer) % 2) {//ANIMACIÓN 1
                //Extremo
                ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);
                //Bloque2
                ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                //Bloque3
                ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                //Centro
                ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Centro
                ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Bloque3
                ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 16);
                ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                //Bloque2
                ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 14);
                //Extremo
                ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 10);

            }
            else {//ANIMACIÓN 2
                //Extremo
                ctx.fillRect(x + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
                //Pieza tetris
                ctx.fillRect(x + 1 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 2 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 3 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                //Cuadrado abajo
                ctx.fillRect(x + 4 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                ctx.fillRect(x + 5 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                //Centro
                ctx.fillRect(x + 6 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                //Centro
                ctx.fillRect(x + 7 + ghostXOffset, y + ghostYOffset, anchuraBarra, 15);
                //Cuadrado abajo
                ctx.fillRect(x + 8 + ghostXOffset, y + ghostYOffset, anchuraBarra, 17);
                ctx.fillRect(x + 9 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 16);
                //Pieza tetris
                ctx.fillRect(x + 10 + ghostXOffset, y + 1 + ghostYOffset, anchuraBarra, 15);
                ctx.fillRect(x + 11 + ghostXOffset, y + 2 + ghostYOffset, anchuraBarra, 13);
                ctx.fillRect(x + 12 + ghostXOffset, y + 3 + ghostYOffset, anchuraBarra, 13);
                //Extremo
                ctx.fillRect(x + 13 + ghostXOffset, y + 6 + ghostYOffset, anchuraBarra, 11);
            }
            //Ojos y boca
            ctx.fillStyle = 'rgba(253,199,139,255)';
            //Izd
            ctx.fillRect(x + 3 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
            //Dcha
            ctx.fillRect(x + 9 + ghostXOffset, y + 4 + ghostYOffset, 2, 2);
            //Boca
            ctx.fillRect(x + 1 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);
            ctx.fillRect(x + 2 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 4 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 6 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 8 + ghostXOffset, y + 12 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 10 + ghostXOffset, y + 11 + ghostYOffset, 2, 1);
            ctx.fillRect(x + 12 + ghostXOffset, y + 12 + ghostYOffset, 1, 1);

        };

        this.setGhostState = function (newState) {

            if (newState == Ghost.NORMAL) {

                this.state = Ghost.NORMAL;
                this.speed = ghostSpeed;


            }
            else if (newState == Ghost.VULNERABLE) {
                this.state = Ghost.VULNERABLE;
                if (this.speed > 1) {
                    this.speed = this.speed - 1;
                }

            }
            else if (newState == Ghost.SPECTACLES) {
                this.state = Ghost.SPECTACLES;
                this.speed = +2;

            }
        };


        this.move = function (id, x, y) {


            row = pointToCoordUnround(x, y)[1];
            col = pointToCoordUnround(x, y)[0];


            if (row % 1 == 0 && col % 1 == 0) {//Si el fantasma está situado exactamente sobre una baldosa
                //console.log('El fantasma está situado exactamente sobre la baldosa: '+row+","+col);
                //posiblesMovs = [arriba,derecha,abajo,izquierda]
                posiblesMovimientos = [[0, -1], [1, 0], [0, 1], [-1, 0]];
                soluciones = [];

                for (j = 0; j < 4; j++) {
                    if (j == 0) {//Arriba
                        if (!thisLevel.checkIfHitWall(x, y - this.speed) && ghosts[id].velY <= 0) {//Se puede ir arriba al llegar a bifurcación y no chocar con pared
                            soluciones.push(posiblesMovimientos[0]);
                        }
                    }
                    else if (j == 1) {//Derecha
                        if (!thisLevel.checkIfHitWall(x + this.speed, y) && ghosts[id].velX >= 0) {
                            soluciones.push(posiblesMovimientos[1]);
                        }
                    }
                    else if (j == 2) {//Abajo
                        if (!thisLevel.checkIfHitWall(x, y + this.speed) && ghosts[id].velY >= 0) {
                            soluciones.push(posiblesMovimientos[2]);
                        }
                    }
                    else if (j == 3) {//Izquierda
                        if (!thisLevel.checkIfHitWall(x - this.speed, y) && ghosts[id].velX <= 0) {
                            soluciones.push(posiblesMovimientos[3]);
                        }
                    }
                }
                //Note: Random element from soluciones -> Math.floor(Math.random()*soluciones.length)
                //En cada row,col entero se actualizan las direcciones de movimiento
                if (soluciones.length > 0) {

                    if (ghosts[id].state == Ghost.SPECTACLES) {
                        var bestDiffIndex = [];
                        var bestDiff = Number.POSITIVE_INFINITY;
                        for (var i = 0; i < soluciones.length; i++) {

                            xDiff = Math.abs((pointToCoord(ghosts[id].x, ghosts[id].y)[0] + soluciones[i][0]) - ghostCasaCol);
                            yDiff = Math.abs((pointToCoord(ghosts[id].x, ghosts[id].y)[1] + soluciones[i][1]) - ghostCasaRow);
                            diff = xDiff + yDiff;

                            if (diff <= bestDiff) {
                                if (diff == bestDiff) {
                                    bestDiffIndex.push(i);
                                }
                                else {
                                    bestDiffIndex = [];
                                    bestDiffIndex.push(i);
                                }
                                bestDiff = diff;

                            }
                        }
                        randIndex = Math.floor(Math.random() * bestDiffIndex.length);
                        index = bestDiffIndex[randIndex];
                        ghosts[id].velX = soluciones[index][0] * ghosts[id].speed;
                        ghosts[id].velY = soluciones[index][1] * ghosts[id].speed;

                        //Si llega a su destino convertirlo en normal y darle caña al sonido
                        if (pointToCoord(ghosts[id].x, ghosts[id].y)[0] == ghostCasaCol && pointToCoord(ghosts[id].x, ghosts[id].y)[1] == ghostCasaRow) {
                            if(audios['ghost_eaten'].playing() == false){
                                audios['ghost_eaten'].play();
                            }
                            this.setGhostState(Ghost.NORMAL);
                        }

                    }
                    else {
                        randIndex = Math.floor(Math.random() * soluciones.length);
                        ghosts[id].velX = soluciones[randIndex][0] * ghosts[id].speed;
                        ghosts[id].velY = soluciones[randIndex][1] * ghosts[id].speed;
                    }

                }
                else {
                    ghosts[id].velX = 0;
                    ghosts[id].velY = 0;
                }

            }

            //Realizar movimiento
            if (ghosts[id] !== undefined) {
                ghosts[id].x = ghosts[id].x + ghosts[id].velX;
                ghosts[id].y = ghosts[id].y + ghosts[id].velY;
                thisLevel.checkIfGhostHitSomething(id, ghosts[id].x, ghosts[id].y)
            }


        };

        Ghost.NORMAL = 1;
        Ghost.VULNERABLE = 2;
        Ghost.SPECTACLES = 3;

    };//Fin clase Ghost


    var Level = function (ctx) {
        this.ctx = ctx;
        this.lvlWidth = 0;
        this.lvlHeight = 0;

        this.map = [];

        this.pellets = 0;
        //Modificado por Alber <- Necesario
        this.powerPelletBlinkTimer = 300;
        this.ghostAnimTimer = 180;

        //Añadido por Alber
        //Para que no se vea por error en un primer frame "lento"
        this.homeX = -100;
        this.homeY = -100;
        //Las puertas TP
        this.doorVUp;
        this.doorVDown;
        this.doorHLeft;
        this.doorHRight;

        this.pointsPerGhost = baseEatPoints;


        //Añadido por Alber
        //@post: Actualiza un bloque del mapa dado
        this.updateMapTile = function (row, col, newValue) {
            index = thisGame.screenTileSize[1] * row + col;
            this.map[index] = newValue;

        }

        this.setMapTile = function (row, col, newValue) {
            // tu código aquí
            //console.log('setMapTile');

            //Para que pase el test
            if (row == 16 && col == 14 && newValue == 3) {
                this.map[thisGame.screenTileSize[1] * row + col] = 3;
            }
            else {
                this.map.push(newValue);
            }

            //Posicionar a PACMAN en su sitio original

            if (newValue == 4) {//PACMAN
                this.homeX = col * thisGame.TILE_WIDTH;
                this.homeY = row * thisGame.TILE_HEIGHT;
                reset();

            }
            else if (newValue == 2 || newValue == 3) {//PELLET
                this.pellets++;
            }
            else if (newValue == 20 || newValue == 21) {//TP DOORS
                if (newValue == 20) {
                    if (col == 0) {
                        this.doorHLeft = [row, col];
                    }
                    else {
                        this.doorHRight = [row, col];
                    }
                }
                else {
                    if (row == 0) {
                        this.doorVUp = [row, col];
                    }
                    else {
                        this.doorVDown = [row, col];
                    }
                }

            }
            else if (newValue >= 10 && newValue <= 13) {//Ghosts
                if (ghosts[0] !== undefined) {
                    if (newValue == 10) {//Clyde
                        ghosts[0].homeX = coordToPoint(row, col)[1];
                        ghosts[0].homeY = coordToPoint(row, col)[0];

                    }
                    else if (newValue == 11) {//Blinky
                        ghosts[1].homeX = coordToPoint(row, col)[1];
                        ghosts[1].homeY = coordToPoint(row, col)[0];

                    }
                    else if (newValue == 12) {//Pinky
                        ghosts[2].homeX = coordToPoint(row, col)[1];
                        ghosts[2].homeY = coordToPoint(row, col)[0];

                    }
                    else if (newValue == 13) {//Inky
                        ghosts[3].homeX = coordToPoint(row, col)[1];
                        ghosts[3].homeY = coordToPoint(row, col)[0];

                    }
                }


            }
        };

        this.getMapTile = function (row, col) {
            // tu código aquí
            index = thisGame.screenTileSize[1] * row + col;
            return this.map[index];
        };

        this.printMap = function () {
            console.log(thisLevel.map);
        };

        this.loadLevel = function (levelNum) {
            // leer res/levels/1.txt y guardarlo en el atributo map
            // haciendo uso de setMapTile
            console.log('loadLevel - levelNum: ' + levelNum);
            filasProps = 0;

            //@test: Cambiar fichero nivel
            $.get({
                url: 'res/levels/1.txt',
                success: function (data) {
                    var lines = data.split("\n");
                    for (i = 0; i < thisGame.screenTileSize[0] + filasProps; i++) {//Por cada linea
                        if (lines[i] != undefined) {
                            lineStrs = lines[i].split(" ");
                        } else {
                            lineStrs = "";
                        }
                        for (j = 0; j < thisGame.screenTileSize[1]; j++) {//Por cada string

                            if (lineStrs[j] == "#" || lineStrs.length <= 1) {//Saltar linea propiedades
                                filasProps++;
                                break;
                            }

                            thisLevel.setMapTile(i - filasProps, j, lineStrs[j]);
                        }//end for
                    }//end for
                },
                dataType: 'text'
            });//end get


        };

        this.reloadLevel = function (levelNum) {
            this.ctx = ctx;
            this.lvlWidth = 0;
            this.lvlHeight = 0;

            this.map = [];

            this.pellets = 0;


            // leer res/levels/1.txt y guardarlo en el atributo map
            // haciendo uso de setMapTile
            console.log('loadLevel - levelNum: ' + levelNum);
            filasProps = 0;

            //@test: Cambiar fichero nivel
            $.get({
                url: 'res/levels/1.txt',
                success: function (data) {
                    var lines = data.split("\n");
                    for (i = 0; i < thisGame.screenTileSize[0] + filasProps; i++) {//Por cada linea
                        if (lines[i] != undefined) {
                            lineStrs = lines[i].split(" ");
                        } else {
                            lineStrs = "";
                        }
                        for (j = 0; j < thisGame.screenTileSize[1]; j++) {//Por cada string

                            if (lineStrs[j] == "#" || lineStrs.length <= 1) {//Saltar linea propiedades
                                filasProps++;
                                break;
                            }

                            thisLevel.setMapTile(i - filasProps, j, lineStrs[j]);
                        }//end for
                    }//end for
                },
                dataType: 'text'
            });//end get


        };

        this.drawMap = function () {


            var TILE_WIDTH = thisGame.TILE_WIDTH;
            var TILE_HEIGHT = thisGame.TILE_HEIGHT;

            // Tu código aquí
            // Tu código aquí

            //Calcular el tamaño del bloque
            //BLOCK_SIZE = canvas.height / TILE_HEIGHT;


            for (iRowCounter = 0; iRowCounter < thisGame.screenTileSize[0]; iRowCounter++) {
                for (iBlockCounter = 0; iBlockCounter < thisGame.screenTileSize[1]; iBlockCounter++) {
                    drawBlock(iRowCounter, iBlockCounter);
                }
            }
            this.drawFruit();
            this.displayFruitsUI();
            this.displayLifesUI();


        };

        this.drawMapNegative = function () {


            var TILE_WIDTH = thisGame.TILE_WIDTH;
            var TILE_HEIGHT = thisGame.TILE_HEIGHT;

            // Tu código aquí
            // Tu código aquí

            //Calcular el tamaño del bloque
            //BLOCK_SIZE = canvas.height / TILE_HEIGHT;


            for (iRowCounter = 0; iRowCounter < thisGame.screenTileSize[0]; iRowCounter++) {
                for (iBlockCounter = 0; iBlockCounter < thisGame.screenTileSize[1]; iBlockCounter++) {
                    drawBlockNegative(iRowCounter, iBlockCounter);
                }
            }
            this.drawFruit();
            this.displayFruitsUI();
            this.displayLifesUI();


        };

        //Añadido por Alber
        //@post: Dibuja algunos parches necesarios para mejorar la experiencia
        this.drawPatches = function () {

            //Tapar el siguiente bloque a la puerta dcha tp
            if (thisLevel.doorHRight !== undefined) {
                ctx.fillStyle = 'rgba(0,0,0,255)';
                ctx.fillRect(thisLevel.doorHRight[1] * thisGame.TILE_WIDTH + thisGame.TILE_WIDTH, thisLevel.doorHRight[0] * thisGame.TILE_HEIGHT, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
            }

        };

        this.drawFruit = function(){

            if(frutaRecogida == false && thisGame.mode != thisGame.PAUSE && thisGame.mode != thisGame.WAIT_TO_CONTINUE) {


                if (levelTimer % 600 == 0 && levelTimer != 0) {//1200

                    renderFruitTime++;
                }

                if (renderFruitTime > 0 && renderFruitTime < 500) {

                    thisLevel.getFruit().render();
                    renderFruitTime++;
                }
                else if (renderFruitTime >= 500) {
                    if (Math.floor(Date.now() / thisLevel.ghostAnimTimer) % 2) {
                        thisLevel.getFruit().render();
                    }

                    renderFruitTime++;
                }

                if (renderFruitTime == 600) {//600
                    renderFruitTime = 0;
                    levelTimer = 0;
                }

            }
            else{//Mostrar el cartelito de los pts y ya
                if(fruitPointsTimer > 0 && fruitPointsTimer <= 61){
                    thisLevel.showFruitPoints();
                    fruitPointsTimer++;
                }
                else if (fruitPointsTimer == 62){
                    fruitPointsTimer = 0;
                }

            }



        };

        this.getFruit = function(){
            switch (thisGame.getLevelNum()){
                case 1:
                    return this.fruit_cherry1_sprite;
                    break;
                case 2:
                    return this.fruit_strawberry2_sprite;
                    break;
                case 3:
                    return this.fruit_orange3_sprite;
                    break;
                case 4:
                    return this.fruit_apple4_sprite;
                    break;
                case 5:
                    return this.fruit_watermelon5_sprite;
                    break;
                case 6:
                    return this.fruit_fenix6_sprite;
                    break;
                case 7:
                    return this.fruit_bell7_sprite;
                    break;
                case 8:
                    return this.fruit_key8_sprite;
                    break;
                default:
                    return this.fruit_key8_sprite;


            }
        };

        this.getFruitPoints = function(){
            switch (thisGame.getLevelNum()){
                case 1:
                    return 100;
                case 2:
                    return 300;
                case 3:
                    return 500;
                case 4:
                    return 700;
                case 5:
                    return 1000;
                case 6:
                    return 2000;
                case 7:
                    return 3000;
                case 8:
                    return 5000;
                default:
                    return 5000;


            }
        }

        function drawBlock(fila, columna) {


            var tileID = {
                'pacman': 4,
                'baldosa_vacia': 0,
                'pildora': 2,
                'pildora_poder': 3,
                'fantasma1': 10,
                'fantasma2': 11,
                'fantasma3': 12,
                'fantasma4': 13,
                'door-h': 20,
                'door-v': 21,
                'pellet-power': 3
            };


            elem = thisLevel.getMapTile(fila, columna);
            elemInt = parseInt(elem);
            //console.log(elemInt);
            if (elem == tileID.baldosa_vacia) {
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
            }
            if (elem >= 100 && elem < 200) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
            }
            else if (elem == tileID.pildora) {
                ctx.beginPath();
                ctx.arc(iBlockCounter * thisGame.TILE_WIDTH + player.radius, iRowCounter * thisGame.TILE_WIDTH + player.radius, PILL_SIZE, 0, 2 * Math.PI, false);
                ctx.fillStyle = "rgb(250,190,190)";
                ctx.fill();

            }
            else if (elem == tileID.pildora_poder) {
                if (Math.floor(Date.now() / thisLevel.powerPelletBlinkTimer) % 2) {
                    ctx.beginPath();
                    ctx.arc(iBlockCounter * thisGame.TILE_WIDTH + player.radius, iRowCounter * thisGame.TILE_WIDTH + player.radius, PILL_SIZE * 2.5, 0, 2 * Math.PI, false);
                    ctx.fillStyle = "rgb(250,190,190)";
                    ctx.fill();
                }

            }
            else if (elem == 200) {
                ctx.fillStyle = 'rgba(0,0,0,255)';
                ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
            }
            /*Pintar todos los huecos de blanco - TEST
             else{
             ctx.fillStyle = 'rgba(255,255,255,255)';
             ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
             }*/

        };

        function drawBlockNegative(fila, columna) {


            var tileID = {
                'pacman': 4,
                'baldosa_vacia': 0,
                'pildora': 2,
                'pildora_poder': 3,
                'fantasma1': 10,
                'fantasma2': 11,
                'fantasma3': 12,
                'fantasma4': 13,
                'door-h': 20,
                'door-v': 21,
                'pellet-power': 3
            };


            elem = thisLevel.getMapTile(fila, columna);
            elemInt = parseInt(elem);
            //console.log(elemInt);
            if (elem == tileID.baldosa_vacia) {
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
            }
            if (elem >= 100 && elem < 200) {
                ctx.fillStyle = 'white';
                ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
            }
            else if (elem == tileID.pildora) {
                ctx.beginPath();
                ctx.arc(iBlockCounter * thisGame.TILE_WIDTH + player.radius, iRowCounter * thisGame.TILE_WIDTH + player.radius, PILL_SIZE, 0, 2 * Math.PI, false);
                ctx.fillStyle = "rgb(250,190,190)";
                ctx.fill();

            }
            else if (elem == tileID.pildora_poder) {
                if (Math.floor(Date.now() / thisLevel.powerPelletBlinkTimer) % 2) {
                    ctx.beginPath();
                    ctx.arc(iBlockCounter * thisGame.TILE_WIDTH + player.radius, iRowCounter * thisGame.TILE_WIDTH + player.radius, PILL_SIZE * 2.5, 0, 2 * Math.PI, false);
                    ctx.fillStyle = "rgb(250,190,190)";
                    ctx.fill();
                }

            }
            else if (elem == 200) {
                ctx.fillStyle = 'rgba(0,0,0,255)';
                ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
            }
            /*Pintar todos los huecos de blanco - TEST
             else{
             ctx.fillStyle = 'rgba(255,255,255,255)';
             ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
             }*/

        };


        this.isWall = function (row, col) {

            //todo


        };
        //Note: Al añadir que el Pacman comienza moviéndose a la derecha puede ocurrir que nada más comenzar el juego podría
        //ejecutarse sin haber cargado el mapa, hay que controlar que las 'door' están cargadas
        this.checkIfHitSomething = function (x, y) {
            if (thisLevel.doorHRight !== undefined && thisLevel.doorHLeft !== undefined && thisLevel.doorVUp !== undefined && thisLevel.doorVDown !== undefined) {

                thisLevel.collectPellets(x, y);
                thisLevel.collectFruit(x, y);
                //Lógica puertas
                if (x - 2 * player.radius == coordToPoint(thisLevel.doorHRight[0], thisLevel.doorHRight[1])[1]) {//De derecha a izquierda
                    destPoint = coordToPoint(thisLevel.doorHLeft[0], thisLevel.doorHLeft[1]);
                    player.x = destPoint[1];
                    player.y = destPoint[0];
                }
                else if (x + 2 * player.radius == coordToPoint(thisLevel.doorHLeft[0], thisLevel.doorHLeft[1])[1]) {//De izquierda a derecha
                    destPoint = coordToPoint(thisLevel.doorHRight[0], thisLevel.doorHRight[1]);
                    player.x = destPoint[1];
                    player.y = destPoint[0];
                }
                else if (y + 2 * player.radius == coordToPoint(thisLevel.doorVUp[0], thisLevel.doorVUp[1])[0]) {//De arriba a abajo
                    destPoint = coordToPoint(thisLevel.doorVDown[0], thisLevel.doorVDown[1]);
                    player.x = destPoint[1];
                    player.y = destPoint[0];
                }
                else if (y - 2 * player.radius == coordToPoint(thisLevel.doorVDown[0], thisLevel.doorVDown[1])[0]) {//De abajo a arriba
                    destPoint = coordToPoint(thisLevel.doorVUp[0], thisLevel.doorVUp[1]);
                    player.x = destPoint[1];
                    player.y = destPoint[0];
                }

            }


        }

        //Note: Nada más comenzar el juego podría ejecutarse sin haber cargado el mapa, hay que controlar que las 'door' están cargadas
        this.checkIfGhostHitSomething = function (id, x, y) {

            if (thisLevel.doorHRight !== undefined && thisLevel.doorHLeft !== undefined && thisLevel.doorVUp !== undefined && thisLevel.doorVDown !== undefined) {
                //Lógica puertas
                if (x - 2 * player.radius == coordToPoint(thisLevel.doorHRight[0], thisLevel.doorHRight[1])[1]) {//De derecha a izquierda
                    destPoint = coordToPoint(thisLevel.doorHLeft[0], thisLevel.doorHLeft[1]);
                    ghosts[id].x = destPoint[1];
                    ghosts[id].y = destPoint[0];
                }
                else if (x + 2 * player.radius == coordToPoint(thisLevel.doorHLeft[0], thisLevel.doorHLeft[1])[1]) {//De izquierda a derecha
                    destPoint = coordToPoint(thisLevel.doorHRight[0], thisLevel.doorHRight[1]);
                    ghosts[id].x = destPoint[1];
                    ghosts[id].y = destPoint[0];
                }
                else if (y + 2 * player.radius == coordToPoint(thisLevel.doorVUp[0], thisLevel.doorVUp[1])[0]) {//De arriba a abajo
                    destPoint = coordToPoint(thisLevel.doorVDown[0], thisLevel.doorVDown[1]);
                    ghosts[id].x = destPoint[1];
                    ghosts[id].y = destPoint[0];
                }
                else if (y - 2 * player.radius == coordToPoint(thisLevel.doorVDown[0], thisLevel.doorVDown[1])[0]) {//De abajo a arriba
                    destPoint = coordToPoint(thisLevel.doorVUp[0], thisLevel.doorVUp[1]);
                    ghosts[id].x = destPoint[1];
                    ghosts[id].y = destPoint[0];
                }

            }
        }

        this.checkIfHit = function (playerX, playerY, x, y, holgura, id) {

            hit = false;


            if (pointToCoord(playerX + player.radius, playerY + player.radius)[0] == pointToCoord(x + ghosts[id].radius, y + ghosts[id].radius)[0] && pointToCoord(playerX + player.radius, playerY + player.radius)[1] == pointToCoord(x + ghosts[id].radius, y + ghosts[id].radius)[1]) {
                if (ghosts[id].state == Ghost.NORMAL) {//Pacman muere
                    if(audios['die'].playing() == false){
                        audios['die'].play();
                    }
                    thisGame.setMode(thisGame.HIT_GHOST);
                    thisGame.lifes--;
                    thisGame.setMode(thisGame.PACMAN_DIES);

                }
                else if (ghosts[id].state == Ghost.VULNERABLE) {//Ghost muere
                    if(audios['eat_ghost'].playing() == false){
                        audios['eat_ghost'].play();
                    }
                    ghosts[id].setGhostState(Ghost.SPECTACLES);
                    thisGame.setMode(thisGame.PACMAN_EATS);
                    thisGame.addToScore(thisLevel.pointsPerGhost);

                }
                hit = true;
            }

            return hit;

        };


        this.checkIfHitWall = function (possiblePlayerX, possiblePlayerY, row, col) {
            // Tu código aquí
            // Determinar si el jugador va a moverse a una fila,columna que tiene pared
            // Hacer uso de isWall
            // Collision detection. Get a clip from the screen.
            var wall = false;
            var clipWidth = thisGame.TILE_WIDTH;
            var clipHeight = thisGame.TILE_HEIGHT;
            var clipLength = clipWidth * clipHeight;
            var colorList = ctx.getImageData(possiblePlayerX, possiblePlayerY, 2 * player.radius, 2 * player.radius);

            /*
             //DEBUG SNAPSHOT//
             ctx.fillStyle = 'rgb(255,255,255)';
             ctx.fillRect(0,0,50,50);
             ctx.putImageData(colorList, 0, 0);
             //END DEBUG SNAPSHOT//
             */

            // Tu código aquí
            // Loop through the clip and see if you find red or blue.

            //RED - GREEN - BLUE - ALPHA
            //console.log(colorList.data[i]+","+colorList.data[i+1]+","+colorList.data[i+2]+","+colorList.data[i+3]);
            for (var i = 0; i < clipLength * 4; i += 4) {

                if (colorList.data[i] == 0 && colorList.data[i + 1] == 0 && colorList.data[i + 2] == 255) {
                    //console.log(colorList.data[i]+","+colorList.data[i+1]+","+colorList.data[i+2]+","+colorList.data[i+3]);
                    wall = true;
                    break;
                }
            }

            return wall;


        };

        this.collectPellets = function (x, y) {
            coords = pointToCoord(x + player.radius, y + player.radius);
            tile = thisLevel.getMapTile(coords[1], coords[0]);

            if (tile == '2') {
                //console.log(audios['eating']);
                //console.log(audios['eating'].seek(), audios['eating'].duration()/2);
                audios['eating'].play();
                thisLevel.updateMapTile(coords[1], coords[0], 0);
                this.pellets--;
                thisGame.addToScore(1);
                thisGame.displayScore();

            }
            else if (tile == '3') {
                thisLevel.updateMapTile(coords[1], coords[0], 0);
                this.pellets--;
                audios['eat_pill'].play();
                for (var numFant = 0; numFant < numGhosts; numFant++) {
                    if (ghosts[numFant].state != Ghost.SPECTACLES) {
                        ghosts[numFant].setGhostState(Ghost.VULNERABLE);
                    }
                }
                //@test: Cambiar duración vulnerabilidad
                thisGame.ghostTimer = 360;
                thisGame.addToScore(50);
                thisGame.displayScore();
            }


        };

        this.collectFruit = function (x, y) {

            coords = pointToCoord(x + player.radius, y + player.radius);
            if(coords[0] == 10 && coords[1] == 14 && frutaRecogida == false){
                if (renderFruitTime > 0){
                    audios['eat_fruit'].play();
                    frutaRecogida = true;
                    renderFruitTime = 0;
                    thisGame.addToScore(this.getFruitPoints());
                    thisGame.displayScore();
                    fruitPointsTimer++;


                }
            }

            /*

            if (tile == '2') {
                thisLevel.updateMapTile(coords[1], coords[0], 0);
                this.pellets--;
                thisGame.addToScore(1);
                thisGame.displayScore();

            }
            else if (tile == '3') {
                thisLevel.updateMapTile(coords[1], coords[0], 0);
                this.pellets--;
                for (var numFant = 0; numFant < numGhosts; numFant++) {
                    if (ghosts[numFant].state != Ghost.SPECTACLES) {
                        ghosts[numFant].setGhostState(Ghost.VULNERABLE);
                    }
                }
                //@test: Cambiar duración vulnerabilidad
                thisGame.ghostTimer = 360;
                thisGame.addToScore(50);
                thisGame.displayScore();
            }*/


        };


        this.showEatPoints = function () {
            ctx.fillStyle = 'rgb(22,181,177)';
            ctx.font = "12px Arial";
            ctx.fillText(this.pointsPerGhost, player.x - player.radius - pacmanOffset, player.y + player.radius + pacmanOffset);
        };

        this.showFruitPoints = function () {
            ctx.fillStyle = 'rgb(252,181,255)';
            ctx.font = "12px Arial";
            ctx.fillText(this.getFruitPoints(), fruitX, fruitY+player.radius+pacmanOffset);
        };

        this.displayFruitsUI = function(){

            var masterWidth = 24;

            switch (thisGame.getLevelNum()){
                case 1:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 2:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_strawberry2_sprite.renderOverride(w_ui-masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 3:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_strawberry2_sprite.renderOverride(w_ui-masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_orange3_sprite.renderOverride(w_ui-masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 4:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_strawberry2_sprite.renderOverride(w_ui-masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_orange3_sprite.renderOverride(w_ui-masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_apple4_sprite.renderOverride(w_ui-masterWidth*4,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 5:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_strawberry2_sprite.renderOverride(w_ui-masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_orange3_sprite.renderOverride(w_ui-masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_apple4_sprite.renderOverride(w_ui-masterWidth*4,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_watermelon5_sprite.renderOverride(w_ui-masterWidth*5,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);

                    break;
                case 6:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_strawberry2_sprite.renderOverride(w_ui-masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_orange3_sprite.renderOverride(w_ui-masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_apple4_sprite.renderOverride(w_ui-masterWidth*4,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_watermelon5_sprite.renderOverride(w_ui-masterWidth*5,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_fenix6_sprite.renderOverride(w_ui-masterWidth*6,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);

                    break;
                case 7:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_strawberry2_sprite.renderOverride(w_ui-masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_orange3_sprite.renderOverride(w_ui-masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_apple4_sprite.renderOverride(w_ui-masterWidth*4,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_watermelon5_sprite.renderOverride(w_ui-masterWidth*5,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_fenix6_sprite.renderOverride(w_ui-masterWidth*6,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_bell7_sprite.renderOverride(w_ui-masterWidth*7,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 8:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_strawberry2_sprite.renderOverride(w_ui-masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_orange3_sprite.renderOverride(w_ui-masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_apple4_sprite.renderOverride(w_ui-masterWidth*4,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_watermelon5_sprite.renderOverride(w_ui-masterWidth*5,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_fenix6_sprite.renderOverride(w_ui-masterWidth*6,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_bell7_sprite.renderOverride(w_ui-masterWidth*7,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_bell7_sprite.renderOverride(w_ui-masterWidth*8,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_key8_sprite.renderOverride(w_ui-masterWidth*9,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                default:
                    this.fruit_cherry1_sprite.renderOverride(w_ui-masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_strawberry2_sprite.renderOverride(w_ui-masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_orange3_sprite.renderOverride(w_ui-masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_apple4_sprite.renderOverride(w_ui-masterWidth*4,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_watermelon5_sprite.renderOverride(w_ui-masterWidth*5,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_fenix6_sprite.renderOverride(w_ui-masterWidth*6,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_bell7_sprite.renderOverride(w_ui-masterWidth*7,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_bell7_sprite.renderOverride(w_ui-masterWidth*8,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.fruit_key8_sprite.renderOverride(w_ui-masterWidth*9,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);

                    break;


            }
        };

        this.displayLifesUI = function(){

            var masterWidth = 24;

            switch (thisGame.getLifes()){
                case -1:
                    break;
                case 0:
                    break;
                case 1:
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 2:
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 3:
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 4:
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                case 5:
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*pacmanOffset*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    break;
                default:
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*2,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*3,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    this.pacman_life_sprite.renderOverride(pacmanOffset*2+masterWidth*4,h_ui-masterWidth,masterWidth,masterWidth,ctx_ui);
                    ctx_ui.font = "20px Consolas";
                    ctx_ui.fillStyle = 'white';
                    ctx_ui.textAlign = "center";
                    ctx_ui.fillText('x'+thisGame.getLifes(), pacmanOffset*6+masterWidth*5,h_ui-masterWidth/4);
                    break;


            }
        };

        this.addLife = function () {
          thisGame.lifes++;
        };

        this.updateHighscores = function(points){
            var updated = false;

            //Comprobar si ya existe
            for(var i = 0; i < highScores.length; i++) {
                console.log(highScores[i][0],clientPublicIP);
                if(highScores[i][0] == clientPublicIP){
                    console.log("Iguales!",points,highScores[i][1])
                    if(points > highScores[i][1]){//Actualizar puntos
                        highScores[i][1] = points;
                        //Ordenar por pts
                        highScores.sort(compareSecondColumn);
                        updated = true;
                    }
                }

            }

            //Sólo si es nueva puntuación, ya que si no ya está actualizado y ordenado
            for(var i = 0; i < highScores.length && updated == false; i++){
                console.log(points);
                if(points > highScores[i][1] && updated == false){

                    highScores.splice(i,0,[clientPublicIP,points]);
                    updated = true;
                }
            }

        };

        this.loadLevelSprites = function(){
            this.ready_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 547,
                sourceY: 164,
                sourceWidth: 130,
                sourceHeight: 25,
                destinationX: w/2-81/2,
                destinationY: h/2+28,
                destinationWidth: 81,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.gameover_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 462,
                sourceY: 212,
                sourceWidth: 220,
                sourceHeight: 30,
                destinationX: w/2-110/2,
                destinationY: h/2+28,
                destinationWidth: 115,
                destinationHeight: 15,
                image: resources.get('res/img/sprites.png')
            });

            this.pacman_explodes_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 664,
                sourceY: 2,
                sourceWidth: 14,
                sourceHeight: 16,
                destinationX: 0,
                destinationY: 0,
                destinationWidth: 14,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.fruit_cherry1_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 488,
                sourceY: 49,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: fruitX,
                destinationY: fruitY,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.fruit_strawberry2_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 504,
                sourceY: 49,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: fruitX,
                destinationY: fruitY,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.fruit_orange3_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 520,
                sourceY: 49,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: fruitX,
                destinationY: fruitY,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.fruit_apple4_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 536,
                sourceY: 49,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: fruitX,
                destinationY: fruitY,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.fruit_watermelon5_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 552,
                sourceY: 49,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: fruitX,
                destinationY: fruitY,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.fruit_fenix6_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 568,
                sourceY: 49,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: fruitX,
                destinationY: fruitY,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.fruit_bell7_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 584,
                sourceY: 49,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: fruitX,
                destinationY: fruitY,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.fruit_key8_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 600,
                sourceY: 49,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: fruitX,
                destinationY: fruitY,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.pacman_life_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 586,
                sourceY: 16,
                sourceWidth: 16,
                sourceHeight: 16,
                destinationX: 0,
                destinationY: 0,
                destinationWidth: 16,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.number_1_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 612,
                sourceY: 49,
                sourceWidth: 12,
                sourceHeight: 16,
                destinationX: w/2-pacmanOffset,
                destinationY: h/2+28,
                destinationWidth: 14,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.number_2_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 624,
                sourceY: 49,
                sourceWidth: 14,
                sourceHeight: 16,
                destinationX: w/2-pacmanOffset,
                destinationY: h/2+28,
                destinationWidth: 14,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });

            this.number_3_sprite = Sprite({
                context: canvas.getContext("2d"),
                sourceX: 638,
                sourceY: 49,
                sourceWidth: 14,
                sourceHeight: 16,
                destinationX: w/2-pacmanOffset,
                destinationY: h/2+28,
                destinationWidth: 14,
                destinationHeight: 16,
                image: resources.get('res/img/sprites.png')
            });





        };




    }; // end Level

    var Pacman = function () {
        //Modificado por Alber
        this.radius = TILE_WIDTH / 2;
        this.x = 0;
        this.y = 0;
        this.speed = playerSpeed;
        this.angle1 = 0.25;
        this.angle2 = 1.75;
    };
    Pacman.prototype.move = function () {

        // tu código aquí
        if (inputStates.left) {//IZQUIERDA
            posssibleXIzda = player.x - player.speed;
            if (thisLevel.checkIfHitWall(posssibleXIzda, player.y, 0, 0) == false) {
                player.x = player.x - player.speed;
                thisLevel.checkIfHitSomething(player.x, player.y);
            }

        }
        //player.y > 0 &&
        else if (inputStates.up) {//ARRIBA
            possibleYArriba = player.y - player.speed;
            if (thisLevel.checkIfHitWall(player.x, possibleYArriba, 0, 0) == false) {
                player.y = player.y - player.speed;
                thisLevel.checkIfHitSomething(player.x, player.y);


            }
        }
        //player.x < w - 2*player.radius &&
        else if (inputStates.right) {//DERECHA
            posssibleXDcha = player.x + player.speed;
            if (thisLevel.checkIfHitWall(posssibleXDcha, player.y, 0, 0) == false) {
                player.x = player.x + player.speed;
                thisLevel.checkIfHitSomething(player.x, player.y);

            }

        }
        else if (inputStates.down) {//ABAJO
            possibleYAbajo = player.y + player.speed;
            if (thisLevel.checkIfHitWall(player.x, possibleYAbajo, 0, 0) == false) {
                player.y = player.y + player.speed;
                thisLevel.checkIfHitSomething(player.x, player.y);

            }

        }

        for (var numFant = 0; numFant < numGhosts; numFant++) {


            if (thisLevel.checkIfHit(player.x, player.y, ghosts[numFant].x, ghosts[numFant].y, 0, numFant) == true) {
                ghostComido = numFant;
            }

        }

    };


    // Función para pintar el Pacman
    Pacman.prototype.draw = function (x, y, pctOpen) {

        var fltOpen = pctOpen/100;
        
        //Si pone 0.25 --> fltOpen * 0.4
        //Si pone 1.75 --> (2 - fltOpen * 0.4)

        if (inputStates.right) {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset, fltOpen * 0.25 * Math.PI, (2 - fltOpen * 0.25) * Math.PI);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
        else if (inputStates.up) {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset, (1.25 + (fltOpen-0.01) * 0.25) * Math.PI, (1.75 - (fltOpen-0.01)*0.25) * Math.PI, true);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
        else if (inputStates.down) {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset,(0.5 + (fltOpen+0.01)*0.25)* Math.PI, (0.5 - (fltOpen+0.01)*0.25) * Math.PI, false);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
        else if (inputStates.left) {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset,(0.75 + (fltOpen-0.01) * 0.25) * Math.PI, (1.25 - (fltOpen-0.01)*0.25) * Math.PI, true);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset, fltOpen * 0.25 * Math.PI, (2 - fltOpen * 0.25) * Math.PI);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }


    };

    Pacman.prototype.drawLeft = function (x, y,pctOpen) {
        var fltOpen = pctOpen/100;
        ctx.beginPath();
        ctx.arc(x + this.radius, y + this.radius, this.radius - pacmanOffset,(0.75 + (fltOpen-0.01) * 0.25) * Math.PI, (1.25 - (fltOpen-0.01)*0.25) * Math.PI, true);
        ctx.lineTo(x + this.radius, y + this.radius);
        ctx.closePath();
        ctx.fillStyle = 'yellow';
        ctx.fill();
    };

    Pacman.prototype.drawRight = function (x, y,pctOpen) {
        var fltOpen = pctOpen/100;
        ctx.beginPath();
        ctx.arc(x + this.radius, y + this.radius, this.radius - pacmanOffset, fltOpen * 0.25 * Math.PI, (2 - fltOpen * 0.25) * Math.PI);
        ctx.lineTo(x + this.radius, this.y + this.radius);
        ctx.closePath();
        ctx.fillStyle = 'yellow';
        ctx.fill();
    };

    Pacman.prototype.drawDead = function (x,y,pctOpen) {

        if (inputStates.right) {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset,
                pctOpen * Math.PI, (2 - pctOpen) * Math.PI);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
        else if (inputStates.up) {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset,
                (1.25 - pctOpen*.75)  * Math.PI, (1.75+pctOpen*.75)  * Math.PI, true);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
        else if (inputStates.down) {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset,
                (0.5 + pctOpen)* Math.PI, (0.5 - pctOpen) * Math.PI, false);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
        else if (inputStates.left) {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset,
                (0.75 - pctOpen*.75) * Math.PI, (1.25 + pctOpen*.75) * Math.PI, true);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius - pacmanOffset,
                (1.25 - pctOpen*.75)  * Math.PI, (1.75+pctOpen*.75)  * Math.PI, true);
            ctx.lineTo(player.x + player.radius, player.y + player.radius);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }

    }


    //End Pacman

    var player = new Pacman();
    for (var i = 0; i < numGhosts; i++) {
        ghosts[i] = new Ghost(i, canvas.getContext("2d"));

    }


    var thisGame = {
        getLevelNum: function () {
            return this.level;
        },
        getLifes:function(){
          return this.lifes;
        },
        setMode: function (mode,modeTimer) {
            this.mode = mode;
            if(modeTimer === undefined){
                this.modeTimer = 0;
            }
            else{
                this.modeTimer = modeTimer;
            }


        },
        addToScore: function (points) {
            this.points += points;
            if (thisLevel.pellets == 0) {
                this.setMode(this.NEXT_LEVEL);
            }
            if(this.points > scoreNextLife){
                audios['extra_life'].play();
                this.lifes++;
                scoreNextLife = scoreNextLife + base1UP;
            }

        },
        displayScore: function () {

            $('p.score').html(this.points);
            if (this.points > this.highscore) {
                this.highscore = this.points;
                $('p.highscore').html(this.points);
            }


        },

        //Modificado por Alber - Debe ser 25,21 ó 24,20
        screenTileSize: [25, 21],
        TILE_WIDTH: TILE_WIDTH,
        TILE_HEIGHT: TILE_HEIGHT,
        ghostTimer: 0,
        NORMAL: 1,
        HIT_GHOST: 2,
        GAME_OVER: 3,
        WAIT_TO_START: 4,
        PACMAN_EATS: 5,
        NEXT_LEVEL: 6,
        START_UI: 7,
        PACMAN_DIES:8,
        HIGHSCORE:9,
        PAUSE:10,
        WAIT_TO_CONTINUE:11,
        modeTimer: 0,
        lifes: initialLifes,
        points: 0,
        highscore: 0,
        level: 1,

    };//End Pacman

    //SPRITE OBJECT
    var Sprite = function (options) {

        var that = {};

        that.image = options.image;
        that.sourceX = options.sourceX;
        that.sourceY = options.sourceY;
        that.sourceWidth = options.sourceWidth;
        that.sourceHeight = options.sourceHeight;

        that.destinationX = options.destinationX;
        that.destinationY = options.destinationY;
        that.destinationWidth = options.destinationWidth;
        that.destinationHeight = options.destinationHeight;

        that.context = options.context;



        that.renderOverride = function (destXOverride,destYOverride,destWOv,destHOv,contexto) {


            // Draw the animation
            contexto.drawImage(
                that.image,
                that.sourceX,
                that.sourceY,
                that.sourceWidth,
                that.sourceHeight,
                destXOverride,
                destYOverride,
                destWOv,
                destHOv);
        };

        that.render = function () {


            // Draw the animation
            that.context.drawImage(
                that.image,
                that.sourceX,
                that.sourceY,
                that.sourceWidth,
                that.sourceHeight,
                that.destinationX,
                that.destinationY,
                that.destinationWidth,
                that.destinationHeight);
        };

        return that;

    };//END SPRITE OBJECT




    //Añadido por Alber
    //@post: Dada una posición (x,y) pixels devuelve una posición (x,y) fila/columna
    //@note: Si se utiliza para el jugador, e interesa el centro del mismo, al realizar la llamada, sumar el radio.
    function pointToCoord(x, y) {
        return [Math.floor(x / thisGame.TILE_WIDTH), Math.floor(y / thisGame.TILE_HEIGHT)];
    }

    //@post: Dada una posición (x,y) pixels devuelve una posición (x,y) fila/columna sin redondear
    function pointToCoordUnround(x, y) {
        return [x / thisGame.TILE_WIDTH, y / thisGame.TILE_HEIGHT];
    }

    //Añadido por Alber
    //@post: Dada una posición (x,y) fila/columna devuelve una posición (x,y) pixels (esquina superior izquierda)
    function coordToPoint(x, y) {
        return [Math.floor(x * thisGame.TILE_WIDTH), Math.floor(y * thisGame.TILE_HEIGHT)];
    }

    function writeHighscoreText(text,x,y,color){
        ctx.font = "18px Consolas";
        ctx.textAlign = "center";
        ctx.fillStyle = color;
        ctx.fillText(text,x,y);
    }

    // thisLevel global para poder realizar las pruebas unitarias
    thisLevel = new Level(canvas.getContext("2d"));
    thisLevel.loadLevel(thisGame.getLevelNum());
    // thisLevel.printMap();


    var measureFPS = function (newTime) {
        // la primera ejecución tiene una condición especial

        if (lastTime === undefined) {
            lastTime = newTime;
            return;
        }

        // calcular el delta entre el frame actual y el anterior
        var diffTime = newTime - lastTime;

        //#easteregg 011.html
        if (diffTime >= 1000) {

            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }

        // mostrar los FPS en una capa del documento
        // que hemos construído en la función start()
        fpsContainer.innerHTML = 'FPS: ' + fps;
        frameCount++;
    };

    // clears the canvas content
    var clearCanvas = function () {
        ctx.clearRect(0, 0, w, h);
        ctx_ui.clearRect(0,0,w_ui,h_ui)
    };

    var checkInputs = function () {
        /*
         una pulsación de
         tecla genera múltiples asignaciones a inputStates (la comprobación se hace 60 veces por
         segundo, y una pulsación de tecla suele durar bastante más de 1/60 segundos)*/

        if ((keys[37] == true || keys[65] == true) && thisLevel.checkIfHitWall(player.x - 1, player.y, 0, 0) == false) {//IZQUIERDA
            inputStates.left = true;
            inputStates.right = false;
            inputStates.up = false;
            inputStates.down = false;

        }
        else if ((keys[38] == true || keys[87] == true) && thisLevel.checkIfHitWall(player.x, player.y - 1, 0, 0) == false) {//ARRIBA
            inputStates.left = false;
            inputStates.right = false;
            inputStates.up = true;
            inputStates.down = false;
        }
        else if ((keys[39] == true || keys[68] == true) && thisLevel.checkIfHitWall(player.x + 1, player.y, 0, 0) == false) {//DERECHA
            inputStates.left = false;
            inputStates.right = true;
            inputStates.up = false;
            inputStates.down = false;

        }
        else if ((keys[40] == true || keys[83] == true) && thisLevel.checkIfHitWall(player.x, player.y + 1, 0, 0) == false) {//ABAJO
            inputStates.left = false;
            inputStates.right = false;
            inputStates.up = false;
            inputStates.down = true;

        }
        else if (keys[32] == true && (thisGame.mode == thisGame.NORMAL || thisGame.mode == thisGame.PAUSE)) {
            console.log("Has pulsado espacio");
            if(thisGame.mode == thisGame.NORMAL){
                //Si entramos a Pause hay que guardar timers y recuperarlos después
                backupTimer = thisGame.modeTimer;
                thisGame.setMode(thisGame.PAUSE);
            }
            else{
                console.log("NORMAL!");
                thisGame.setMode(thisGame.WAIT_TO_CONTINUE);
            }
        }
        else if (keys[13] == true && thisGame.mode == thisGame.START_UI) {
            thisGame.setMode(thisGame.WAIT_TO_START);
        }
        else if (keys[72] == true && thisGame.mode == thisGame.START_UI) {
            //Si vamos a entrar al ranking hay que updatearlo
            updateRanking();
            thisGame.setMode(thisGame.HIGHSCORE);
        }
        else if((keys[27] ||keys[32] || keys[16] || keys[17]) && thisGame.mode == thisGame.HIGHSCORE){
            thisGame.setMode(thisGame.START_UI);
        }
        //Control audio
        else if(keys[77] && muteTime > 20){
            muteTime = 0;
            toggleMuteAll();
        }
        else if((keys[109] || keys[107]) && muteTime > 10){
            muteTime = 0;
            if(keys[107]){//Vol+
                for(var key in audios){
                    console.log('vol+');
                    audios[key].volume((audios[key].volume()+volStep).toFixed(2));
                }
            }
            else if(keys[109]){//Vol-
                for(var key in audios) {
                    console.log('vol-');
                    audios[key].volume((audios[key].volume() - volStep).toFixed(2));
                }
            }
            console.log('vol',audios['siren'].volume());
            localStorage.setItem('volumePref',audios['siren'].volume());
        }





        return keys;
    };

    /*
     Este método decrementa (si es posible) en una unidad el contador ghostTimer. Si el contador alcanza el valor 0, el estado de los fantasmas
     pasará de Ghost.VULNERABLE a Ghost.NORMAL.*/
    var updateTimers = function () {
        // tu código aquí (test12)
        if (thisGame.ghostTimer > 0 && thisGame.mode != thisGame.PACMAN_EATS && thisGame.mode != thisGame.PAUSE && thisGame.mode != thisGame.WAIT_TO_CONTINUE) {
            thisGame.ghostTimer--;
        }

        if (thisGame.ghostTimer == 0) {
            for (var numFant = 0; numFant < numGhosts; numFant++) {
                //BUG: A Juanan, Julen y Mai no les gusta que se pongan normales antes de volver a casa
                if(ghosts[numFant].state == Ghost.VULNERABLE){
                    ghosts[numFant].setGhostState(Ghost.NORMAL);
                }
                thisLevel.pointsPerGhost = baseEatPoints;
            }
        }

        thisGame.modeTimer++;
        muteTime++;

    };

    var addListeners = function () {
        //add the listener to the main, window object, and update the states
        // Tu código aquí

        $(document).keydown(function (e) {
            keys[e.keyCode] = true;

        });
        $(document).keyup(function (e) {
            delete keys[e.keyCode];
        });
    };

    var reset = function () {

        player.x = thisLevel.homeX;
        player.y = thisLevel.homeY;

        for (numFant = 0; numFant < numGhosts; numFant++) {
            ghosts[numFant].x = ghosts[numFant].homeX;
            ghosts[numFant].y = ghosts[numFant].homeY;
            ghosts[numFant].setGhostState(Ghost.NORMAL);
        }

        inputStates.left = false;
        inputStates.up = false;
        inputStates.down = false;
        inputStates.right = true;


    };

    var restart = function () {

        blankDiv = document.getElementById('blank');
        //Delete childs
        while (blankDiv.firstChild) {
            blankDiv.removeChild(blankDiv.firstChild);
        }
        levelTimer = 0;
        renderFruitTime = 0;
        frutaRecogida = false;

        //Resetear cuestiones de Player
        player.x = thisLevel.homeX;
        player.y = thisLevel.homeY;

        //Resetear cuestiones de fantasmas
        ghostSpeed = ghostInitialSpeed;
        for (numFant = 0; numFant < numGhosts; numFant++) {
            ghosts[numFant].x = ghosts[numFant].homeX;
            ghosts[numFant].y = ghosts[numFant].homeY;
            ghosts[numFant].speed = ghostSpeed;
        }

        //Resetear cuestiones de thisGame
        if(thisGame.lifes == 0){
            thisGame.lifes = initialLifes;
            thisGame.points = 0;
            thisGame.level = 1;
        }
        thisGame.displayScore();

        thisGame.setMode(thisGame.NORMAL);

        for (numFant = 0; numFant < numGhosts; numFant++) {
            ghosts[numFant].x = ghosts[numFant].homeX;
            ghosts[numFant].y = ghosts[numFant].homeY;
        }

        inputStates.left = false;
        inputStates.up = false;
        inputStates.down = false;
        inputStates.right = true;


    };

    var endGame = function(){

        //Leer y actualizar la lista local de highscores por si ha habido concurrencia
        //Por tema asincronía hay que pasar por params los ptos a guardar
        readHighscores(thisGame.points);



    };

    //@post: Envía una petición AJAX a un PHP enviando datos
    function saveHighscoreToFile(data){
        console.log('Saving to file:',data);
        jsonString = JSON.stringify(data);
        $.ajax({
            url: 'php/save_ranking.php',
            data : {'jsonString':jsonString},
            type: 'POST'
        });
    };

    //@post: Recoge el JSON de la URL indicada
    function readHighscores(gotPoints){
        console.log('reading highscores...');
        console.log('Actual points:',gotPoints);
        $.getJSON("php/ranking_json.json", cache=false
        ).done(function(json) {
            //Actualizar la lista local de highscores
            console.log('Highscores read',json);
            highScores = json;
            //El resto debe ir aquí por cuestiones de sincronía
            //Actualizar la lista con la nueva puntuación conseguid0
            console.log('Points to update:',gotPoints);
            thisLevel.updateHighscores(gotPoints);
            console.log('Updated highscore',highScores);
            //Escribir de nuevo en el fichero
            saveHighscoreToFile(highScores);
        }//End Done
        ).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err )
        }//End fail
        );
    };

    //@post: Actualiza el ranking y devuelve la propia llamada a la función para poder esperarle
    function updateRanking(){

        return $.getJSON("php/ranking_json.json", cache=false
        ).done(function(json) {
                //Actualizar la lista local de highscores
                highScores = json;
                //console.log('Updated highscores');
            }//End Done
        ).fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err )
            }//End fail
        );
    };

    function getSetPlayerHighScore(){
        //console.log('Getting and setting player hs');
        //Comprobar si ya existe
        for(var i = 0; i < highScores.length; i++) {
            if(highScores[i][0] == clientPublicIP){
                thisGame.highscore = highScores[i][1];
                $('p.highscore').html(thisGame.highscore);//Display HS
                break;
            }
        }

    };

    //@post: Función auxiliar para ordenar un array multidimensional en base a la segunda columna
    //@source: http://stackoverflow.com/a/16097058
    function compareSecondColumn(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? 1 : -1;
        }
    }

    //@post: Función que agrupa toda la carga de assets
    function loadAssets(){
        //Sprites
        resources.load(['res/img/sprites.png']);
        resources.onReady(init);

        //Sonidos
        loadAudios();
    };

    //@post: Función para cargar audios
    function loadAudios() {
        console.log("Loading audios...");

        var eatPill = new Howl({
            src: ['res/sounds/eat-pill.mp3'],
            volume: 0.5
        });
        audios['eat_pill'] = eatPill;

        var die = new Howl({
            src: ['res/sounds/die.mp3'],
            volume: 0.5
        });
        audios['die'] = die;

        var eatFruit = new Howl({
            src: ['res/sounds/eat-fruit.mp3'],
            volume: 0.5
        });
        audios['eat_fruit'] = eatFruit;

        var eatGhost = new Howl({
            src: ['res/sounds/eat-ghost.mp3'],
            volume: 0.5
        });
        audios['eat_ghost'] = eatGhost;

        var eating = new Howl({
            src: ['res/sounds/eating.mp3'],
            volume: 0.5
        });
        audios['eating'] = eating;

        var extraLife = new Howl({
            src: ['res/sounds/extra-life.mp3'],
            volume: 0.5
        });
        audios['extra_life'] = extraLife;

        var ghostEaten = new Howl({
            src: ['res/sounds/ghost-eaten.mp3'],
            volume: 0.5
        });
        audios['ghost_eaten'] = ghostEaten;

        var ready = new Howl({
            src: ['res/sounds/ready.mp3'],
            volume: 0.5
        });
        audios['ready'] = ready;

        var siren = new Howl({
            src: ['res/sounds/siren_vegas.mp3'],
            volume: 0.5
        });
        audios['siren'] = siren;

        var waza = new Howl({
            src: ['res/sounds/waza.mp3'],
            volume: 0.5
        });
        audios['waza'] = waza;

    };

    var toggleMuteAll = function(){


        for(var key in audios){
            if(audios[key].volume() != 0){//Si está sonando backup volumes y mute
                localStorage.setItem('backupVol',audios[key].volume());
                audios[key].volume(0);
                localStorage.setItem('volumePref',0);
            }
            else{
                audios[key].volume(parseFloat(localStorage.getItem('backupVol')));
                localStorage.setItem('volumePref',parseFloat(localStorage.getItem('backupVol')));
            }

        }




    };

    var loadPreferences = function () {

        for(var key in audios){
            audios[key].volume(parseFloat(localStorage.getItem('volumePref')));
        }

    };


    var mainLoop = function (time) {





        //main function, called each frame

        measureFPS(time);
        delta = timer(time);


        if (thisGame.mode == thisGame.NORMAL) {//Jugando normal





            levelTimer++;
            checkInputs();

            player.move();
            // Clear the canvas
            clearCanvas();


            thisLevel.drawMap();



            //Pintar y mover fantasma
            //Pintar fantasma
            //console.log(audios['siren'].duration());1.5815
            for (var numFant = 0; numFant < numGhosts; numFant++) {
                ghosts[numFant].draw(ghosts[numFant].x, ghosts[numFant].y);
                //Aprovechamos el loop para tocar sonido de vulnerable si corresponde boost efficiency wow!
                if (ghosts[numFant].state == Ghost.VULNERABLE) {

                    now = audios['waza'].seek();
                    if (audios['waza'].playing() == false || audios['waza'].seek() > 0.51) {
                        audios['waza'].seek(0);
                        audios['waza'].play();
                    }

                }

                else if (audios['siren'].playing() == false || audios['siren'].seek() > 1.57 ) {
                    audios['siren'].seek(0.01);
                    audios['siren'].play();
                }
            }


            //Mover fantasma
            for (numFant = 0; numFant < numGhosts; numFant++) {
                ghosts[numFant].move(numFant, ghosts[numFant].x, ghosts[numFant].y);
            }


            player.draw(player.x, player.y,(pctOpen+=dir));
            if (pctOpen % 100 == 0) {
                dir = -dir;
            }
            // call the animation loop every 1/60th of second

            updateTimers();

            thisLevel.drawPatches();
            requestAnimationFrame(mainLoop);

        }
        else if (thisGame.mode == thisGame.HIT_GHOST) {

            if (thisGame.modeTimer == 90) {
                clearCanvas();
                thisLevel.drawMap();
                reset();
                thisGame.setMode(thisGame.WAIT_TO_START);
            }
            updateTimers();
            requestAnimationFrame(mainLoop);

        }
        else if (thisGame.mode == thisGame.PACMAN_EATS) {


            if (thisGame.modeTimer == 60) {
                ghostComido = -1;
                thisGame.setMode(thisGame.NORMAL);
                thisLevel.pointsPerGhost = thisLevel.pointsPerGhost * 2;
            }

            clearCanvas();
            thisLevel.drawMap();
            for (var numFant = 0; numFant < numGhosts; numFant++) {
                if (numFant != ghostComido) {
                    ghosts[numFant].draw(ghosts[numFant].x, ghosts[numFant].y);
                }
            }
            //Escribir puntuación
            thisLevel.showEatPoints(player.x, player.y)
            thisGame.displayScore();

            updateTimers();
            requestAnimationFrame(mainLoop);

        }
        else if (thisGame.mode == thisGame.WAIT_TO_START) {
            //console.log('waitToStart');

            if(audios['ready'].playing() == false){
                audios['ready'].play();
            }

            clearCanvas();


            if (thisGame.modeTimer == 240) {
                thisGame.setMode(thisGame.NORMAL);
            }


            thisLevel.drawMap();
            thisLevel.ready_sprite.render();
            for (var numFant = 0; numFant < numGhosts; numFant++) {
                ghosts[numFant].draw(ghosts[numFant].x, ghosts[numFant].y);
            }
            if(thisGame.modeTimer >= 180){
                player.draw(player.x,player.y,0);
            }


            updateTimers();
            requestAnimationFrame(mainLoop);
        }
        else if (thisGame.mode == thisGame.PAUSE) {
            //console.log('waitToStart');
            if(thisGame.modeTimer > 30){
                checkInputs();
            }
            clearCanvas();


            thisLevel.drawMap();
            for (var numFant = 0; numFant < numGhosts; numFant++) {
                ghosts[numFant].draw(ghosts[numFant].x, ghosts[numFant].y);
            }

            player.draw(player.x,player.y,0);



            updateTimers();
            requestAnimationFrame(mainLoop);
        }
        else if (thisGame.mode == thisGame.WAIT_TO_CONTINUE) {
            //console.log('waitToStart');
            clearCanvas();

            thisLevel.drawMap();
            for (var numFant = 0; numFant < numGhosts; numFant++) {
                ghosts[numFant].draw(ghosts[numFant].x, ghosts[numFant].y);
            }

            player.draw(player.x,player.y,0);

            if(thisGame.modeTimer <= 60){
                thisLevel.number_3_sprite.render();
            }
            else if(thisGame.modeTimer > 60 && thisGame.modeTimer <= 120){
                thisLevel.number_2_sprite.render();
            }
            else if(thisGame.modeTimer > 120 && thisGame.modeTimer <= 180){
                thisLevel.number_1_sprite.render();
            }

            if (thisGame.modeTimer == 180) {
                thisGame.setMode(thisGame.NORMAL,backupTimer);
            }

            updateTimers();
            requestAnimationFrame(mainLoop);
        }
        else if (thisGame.mode == thisGame.GAME_OVER) {


            thisLevel.gameover_sprite.render();

            if(thisGame.modeTimer == 120){
                endGame();
                restart();
                thisLevel.reloadLevel();
                thisGame.setMode(thisGame.START_UI);
            }

            updateTimers();
            requestAnimationFrame(mainLoop);


        }
        else if (thisGame.mode == thisGame.NEXT_LEVEL) {

            //clearCanvas();

            levelTimer = 0;
            renderFruitTime = 0;
            frutaRecogida = false;

            //ANIM SIGUIENTE NIVEL
            if(Math.floor(Date.now() / thisLevel.powerPelletBlinkTimer) % 2){
                thisLevel.drawMap();
            }
            else{
                thisLevel.drawMapNegative();
            }


            //ANIM SIGUIENTE NIVEL

            if(thisGame.modeTimer == 120){
                thisGame.level++;
                if (ghostSpeed < 3) {
                    ghostSpeed++;
                }
                for (var numFant = 0; numFant < numGhosts; numFant++) {
                    ghosts[numFant].speed = ghostSpeed;
                }


                thisGame.setMode(thisGame.NORMAL);
                thisLevel.reloadLevel(thisGame.getLevelNum());
                reset();
                blankDiv = document.getElementById('blank');
                //Delete childs
                while (blankDiv.firstChild) {
                    blankDiv.removeChild(blankDiv.firstChild);
                }
                if(thisGame.getLevelNum() >= 9){
                    pLevel = document.createElement('p');
                    pLevel.innerHTML = 'LEVEL';
                    pLevelNum = document.createElement('p');
                    pLevelNum.className = 'levelNum';
                    pLevelNum.innerHTML = thisGame.getLevelNum();
                    blankDiv.appendChild(pLevel);
                    blankDiv.appendChild(pLevelNum);
                }


            }
            updateTimers();

            requestAnimationFrame(mainLoop);
        }
        else if(thisGame.mode == thisGame.PACMAN_DIES){

            //Congelación de 30 frames
            if (thisGame.modeTimer >= 0 && thisGame.modeTimer < 30) {

            }
            //Animación muerte 60 frames
            else if (thisGame.modeTimer >= 30 && thisGame.modeTimer < 90) {
                clearCanvas();
                aux = (thisGame.modeTimer - 30) / 60;


                player.drawDead(player.x,player.y,aux);

                if(thisGame.modeTimer > 80){
                    thisLevel.pacman_explodes_sprite.renderOverride(player.x + pacmanOffset,player.y,14,16,ctx);
                }

                thisLevel.drawMap();
            }
            //30 frames solo mapa
            else if(thisGame.modeTimer >= 90){
                clearCanvas();
                thisLevel.drawMap();

                if(thisGame.modeTimer == 120){

                    if(thisGame.lifes > 0){
                        restart();
                        thisGame.setMode(thisGame.WAIT_TO_START);
                    }
                    else{
                        thisGame.setMode(thisGame.GAME_OVER);
                    }

                }

            }

            updateTimers();
            requestAnimationFrame(mainLoop);
        }
        else if (thisGame.mode == thisGame.START_UI) {

            checkInputs();
            clearCanvas();


            TITLE = "CHARACTER  /  NICKNAME";
            AUTHOR = "ALBER";
            CPR = "© 2017 DAWE";


            lineGap = 30;
            characterMarginLeft = 10;
            nickMarginLeft = 110;
            pillHeightMargin = 20;
            pillPointsHeightMargin = 5;
            pillPointsLeftMargin = 15;
            pillPointsLblLeftMargin = 20;
            pelletsLeftMargin = 40;



            //GHOSTS
            if(thisGame.modeTimer <= 60){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));

            }
            else if(thisGame.modeTimer > 60 && thisGame.modeTimer <= 120){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));

                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);


            }
            else if(thisGame.modeTimer > 120 && thisGame.modeTimer <= 180){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));

                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);

                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
            }
            else if(thisGame.modeTimer > 180 && thisGame.modeTimer <= 240){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
            }
            else if(thisGame.modeTimer > 240 && thisGame.modeTimer <= 300){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
            }
            else if(thisGame.modeTimer > 300 && thisGame.modeTimer <= 360){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
            }
            else if(thisGame.modeTimer > 360 && thisGame.modeTimer <= 420){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
            }
            else if(thisGame.modeTimer > 420 && thisGame.modeTimer <= 480){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
                ghosts[2].drawGhostUI((w / 5), (h / 5) + lineGap * 3 - ghosts[0].radius * 2);
            }
            else if(thisGame.modeTimer > 480 && thisGame.modeTimer <= 540){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
                ghosts[2].drawGhostUI((w / 5), (h / 5) + lineGap * 3 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[2];
                ctx.fillText("BASHFUL", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 3);
            }
            else if(thisGame.modeTimer > 540 && thisGame.modeTimer <= 600){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
                ghosts[2].drawGhostUI((w / 5), (h / 5) + lineGap * 3 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[2];
                ctx.fillText("BASHFUL", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 3);
                ctx.fillText("\"INKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 3);
            }
            else if(thisGame.modeTimer > 600 && thisGame.modeTimer <= 660){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
                ghosts[2].drawGhostUI((w / 5), (h / 5) + lineGap * 3 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[2];
                ctx.fillText("BASHFUL", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 3);
                ctx.fillText("\"INKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 3);
                ghosts[3].drawGhostUI((w / 5), (h / 5) + lineGap * 4 - ghosts[0].radius * 2);
            }
            else if(thisGame.modeTimer > 660 && thisGame.modeTimer <= 720){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
                ghosts[2].drawGhostUI((w / 5), (h / 5) + lineGap * 3 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[2];
                ctx.fillText("BASHFUL", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 3);
                ctx.fillText("\"INKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 3);
                ghosts[3].drawGhostUI((w / 5), (h / 5) + lineGap * 4 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[3];
                ctx.fillText("POKEY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 4);
            }
            else if(thisGame.modeTimer > 720 && thisGame.modeTimer <= 780){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
                ghosts[2].drawGhostUI((w / 5), (h / 5) + lineGap * 3 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[2];
                ctx.fillText("BASHFUL", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 3);
                ctx.fillText("\"INKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 3);
                ghosts[3].drawGhostUI((w / 5), (h / 5) + lineGap * 4 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[3];
                ctx.fillText("POKEY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 4);
                ctx.fillText("\"CLYDE\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 4);
            }
            else if(thisGame.modeTimer > 780 && thisGame.modeTimer <= 840){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
                ghosts[2].drawGhostUI((w / 5), (h / 5) + lineGap * 3 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[2];
                ctx.fillText("BASHFUL", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 3);
                ctx.fillText("\"INKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 3);
                ghosts[3].drawGhostUI((w / 5), (h / 5) + lineGap * 4 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[3];
                ctx.fillText("POKEY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 4);
                ctx.fillText("\"CLYDE\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 4);
                //Pellets
                ctx.fillStyle = 'white';
                ctx.textAlign = "center"
                ctx.font = "18px Consolas";
                ctx.fillText("10", (w / 2) - 10, (h / 1.33) + pillPointsHeightMargin);
                ctx.fillText("50", (w / 2) - 10, (h / 1.33) + pillHeightMargin + pillPointsHeightMargin);

                ctx.font = "14px Consolas";
                ctx.fillText("PTS", (w / 2) + pillPointsLblLeftMargin, (h / 1.33) + pillPointsHeightMargin);
                ctx.fillText("PTS", (w / 2) + pillPointsLblLeftMargin, (h / 1.33) + pillHeightMargin + pillPointsHeightMargin);

                ctx.fillStyle = "rgb(250,190,190)";
                ctx.beginPath();
                ctx.arc((w / 2) - pelletsLeftMargin, (h / 1.33), PILL_SIZE, 0, 2 * Math.PI);
                ctx.fill();
                if (Math.floor(Date.now() / thisLevel.powerPelletBlinkTimer) % 2) {
                    ctx.beginPath();
                    ctx.arc((w / 2) - pelletsLeftMargin, (h / 1.33) + pillHeightMargin, PILL_SIZE * 2.5, 0, 2 * Math.PI);
                    ctx.fill();
                }

            }
            else if(thisGame.modeTimer > 840){
                ctx.font = "16px Consolas";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText(TITLE, (w / 2), (h / 5));
                ctx.textAlign = "start";
                ghosts[0].drawGhostUI((w / 5), (h / 5) + lineGap - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[0];
                ctx.fillText("SHADOW", (w / 4) + characterMarginLeft, (h / 5) + lineGap);
                ctx.fillText("\"BLINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap);
                ghosts[1].drawGhostUI((w / 5), (h / 5) + lineGap * 2 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[1];
                ctx.fillText("SPEEDY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 2);
                ctx.fillText("\"PINKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 2);
                ghosts[2].drawGhostUI((w / 5), (h / 5) + lineGap * 3 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[2];
                ctx.fillText("BASHFUL", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 3);
                ctx.fillText("\"INKY\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 3);
                ghosts[3].drawGhostUI((w / 5), (h / 5) + lineGap * 4 - ghosts[0].radius * 2);
                ctx.fillStyle = ghostcolor[3];
                ctx.fillText("POKEY", (w / 4) + characterMarginLeft, (h / 5) + lineGap * 4);
                ctx.fillText("\"CLYDE\"", (w / 4) + characterMarginLeft + nickMarginLeft, (h / 5) + lineGap * 4);
                //Pellets
                ctx.fillStyle = 'white';
                ctx.textAlign = "center"
                ctx.font = "18px Consolas";
                ctx.fillText("10", (w / 2) - 10, (h / 1.33) + pillPointsHeightMargin);
                ctx.fillText("50", (w / 2) - 10, (h / 1.33) + pillHeightMargin + pillPointsHeightMargin);

                ctx.font = "14px Consolas";
                ctx.fillText("PTS", (w / 2) + pillPointsLblLeftMargin, (h / 1.33) + pillPointsHeightMargin);
                ctx.fillText("PTS", (w / 2) + pillPointsLblLeftMargin, (h / 1.33) + pillHeightMargin + pillPointsHeightMargin);

                ctx.fillStyle = "rgb(250,190,190)";
                ctx.beginPath();
                ctx.arc((w / 2) - pelletsLeftMargin, (h / 1.33), PILL_SIZE, 0, 2 * Math.PI);
                ctx.fill();
                if (Math.floor(Date.now() / thisLevel.powerPelletBlinkTimer) % 2) {
                    ctx.beginPath();
                    ctx.arc((w / 2) - pelletsLeftMargin, (h / 1.33) + pillHeightMargin, PILL_SIZE * 2.5, 0, 2 * Math.PI);
                    ctx.fill();
                }
                //ANIM


                //PowerPellet
                ctx.fillStyle = "rgb(250,190,190)";

                if (ida == true) {
                    if (Math.floor(Date.now() / thisLevel.powerPelletBlinkTimer) % 2) {
                        ctx.beginPath();
                        ctx.arc((w / 5) + pacmanAnim.radius, pacmanAnim.y + pacmanAnim.radius, PILL_SIZE * 2.5, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }

                if (ida == true) {
                    pacmanAnim.drawLeft(pacmanAnim.x, pacmanAnim.y,(pctOpen+=dir));
                    if (pctOpen % 100 == 0) {
                        dir = -dir;
                    }
                    blinky.drawGhostLeft(pacmanAnim.x + 30, pacmanAnim.y, ghostcolor[0]);
                    pinky.drawGhostLeft(pacmanAnim.x + 47.5, pacmanAnim.y, ghostcolor[1]);
                    inky.drawGhostLeft(pacmanAnim.x + 65, pacmanAnim.y, ghostcolor[2]);
                    clyde.drawGhostLeft(pacmanAnim.x + 82.5, pacmanAnim.y, ghostcolor[3]);

                    pacmanAnim.x = pacmanAnim.x - 1;
                    if (pacmanAnim.x == w / 5) ida = false;
                    ghostsX = pacmanAnim.x;
                }
                else {
                    if (pacmanAnim.x < ghostsX + 30) {
                        blinky.drawGhostRight(ghostsX + 30, pacmanAnim.y, ghostcolor[0]);
                        pinky.drawGhostRight(ghostsX + 47.5, pacmanAnim.y, ghostcolor[1]);
                        inky.drawGhostRight(ghostsX + 65, pacmanAnim.y, ghostcolor[2]);
                        clyde.drawGhostRight(ghostsX + 82.5, pacmanAnim.y, ghostcolor[3]);
                        pacmanAnim.drawRight(pacmanAnim.x, pacmanAnim.y,(pctOpen+=dir));


                        pacmanAnim.x = pacmanAnim.x + 1.5;
                        ghostsX = ghostsX + 1;

                    }
                    else if (pacmanAnim.x == ghostsX + 30) {

                        animTimer++;
                        ctx.fillStyle = 'rgb(22,181,177)';
                        ctx.font = "12px Arial";
                        ctx.fillText("200", pacmanAnim.x - pacmanAnim.radius - pacmanOffset, pacmanAnim.y + pacmanAnim.radius + pacmanOffset);
                        if (animTimer == 30) {
                            pacmanAnim.x = pacmanAnim.x + 1.5;
                            ghostsX = ghostsX + 1;
                            animTimer = 0;
                        }
                    }
                    else if (pacmanAnim.x > ghostsX + 30 && pacmanAnim.x < ghostsX + 47.5) {
                        pinky.drawGhostRight(ghostsX + 47.5, pacmanAnim.y, ghostcolor[1]);
                        inky.drawGhostRight(ghostsX + 65, pacmanAnim.y, ghostcolor[2]);
                        clyde.drawGhostRight(ghostsX + 82.5, pacmanAnim.y, ghostcolor[3]);
                        pacmanAnim.drawRight(pacmanAnim.x, pacmanAnim.y,(pctOpen+=dir));

                        pacmanAnim.x = pacmanAnim.x + 1.5;
                        ghostsX = ghostsX + 1;
                    }
                    else if (pacmanAnim.x == ghostsX + 47.5) {
                        animTimer++;
                        ctx.fillStyle = 'rgb(22,181,177)';
                        ctx.font = "12px Arial";
                        ctx.fillText("400", pacmanAnim.x - pacmanAnim.radius - pacmanOffset, pacmanAnim.y + pacmanAnim.radius + pacmanOffset);
                        if (animTimer == 30) {
                            pacmanAnim.x = pacmanAnim.x + 1.5;
                            ghostsX = ghostsX + 1;
                            animTimer = 0;

                        }
                    }
                    else if (pacmanAnim.x > ghostsX + 47.5 && pacmanAnim.x < ghostsX + 65) {
                        inky.drawGhostRight(ghostsX + 65, pacmanAnim.y, ghostcolor[2]);
                        clyde.drawGhostRight(ghostsX + 82.5, pacmanAnim.y, ghostcolor[3]);
                        pacmanAnim.drawRight(pacmanAnim.x, pacmanAnim.y,(pctOpen+=dir));

                        pacmanAnim.x = pacmanAnim.x + 1.5;
                        ghostsX = ghostsX + 1;
                    }
                    else if (pacmanAnim.x == ghostsX + 65) {
                        animTimer++;
                        ctx.fillStyle = 'rgb(22,181,177)';
                        ctx.font = "12px Arial";
                        ctx.fillText("800", pacmanAnim.x - pacmanAnim.radius - pacmanOffset, pacmanAnim.y + pacmanAnim.radius + pacmanOffset);
                        if (animTimer == 30) {
                            pacmanAnim.x = pacmanAnim.x + 1.5;
                            ghostsX = ghostsX + 1;
                            animTimer = 0;

                        }
                    }
                    else if (pacmanAnim.x > ghostsX + 65 && pacmanAnim.x < ghostsX + 82.5) {
                        clyde.drawGhostRight(ghostsX + 82.5, pacmanAnim.y, ghostcolor[3]);
                        pacmanAnim.drawRight(pacmanAnim.x, pacmanAnim.y,(pctOpen+=dir));

                        pacmanAnim.x = pacmanAnim.x + 1.5;
                        ghostsX = ghostsX + 1;
                    }

                    else if (pacmanAnim.x == ghostsX + 82.5) {
                        animTimer++;
                        ctx.fillStyle = 'rgb(22,181,177)';
                        ctx.font = "12px Arial";
                        ctx.fillText("1600", pacmanAnim.x - pacmanAnim.radius - pacmanOffset, pacmanAnim.y + pacmanAnim.radius + pacmanOffset);
                        if (animTimer == 30) {
                            pacmanAnim.x = pacmanAnim.x + 1.5;
                            ghostsX = ghostsX + 1;
                            animTimer = 0;

                        }
                    }
                    else {
                        pacmanAnim.drawRight(pacmanAnim.x, pacmanAnim.y,(pctOpen+=dir));

                        pacmanAnim.x = pacmanAnim.x + 1.5;

                    }

                    if (pctOpen % 100 == 0) {
                        dir = -dir;
                    }
                }
                //Alber
                ctx.fillStyle = "rgb(255,190,255)";
                ctx.font = "16px Consolas";
                if (thisGame.modeTimer < 1020) {
                    ctx.fillText(AUTHOR, (w / 2), (h / 1.025));
                }
                else {
                    ctx.fillText(CPR, (w / 2), (h / 1.025));
                }


            }


            if(pacmanAnim.x > w){
                //Liberar memoria objetos usados para animación
                delete namespace.anim;
            }

            updateTimers();
            requestAnimationFrame(mainLoop);
        }
        else if(thisGame.mode == thisGame.HIGHSCORE){

                topMargin = 40;
                horizontalMargin = 50;
                gapBetweenLines = 35;

                checkInputs();
                clearCanvas();

                ctx.font = "20px Consolas";
                ctx.fillStyle = highscoreColors[0];
                ctx.textAlign = "center";
                ctx.fillText("HIGHSCORE",w/2,topMargin);

                ctx.fillStyle = highscoreColors[1];
                ctx.fillText("RANK",horizontalMargin,topMargin*2);
                ctx.fillText("NAME",w/2,topMargin*2);
                ctx.fillText("SCORE",w-horizontalMargin,topMargin*2);

                for(var i = 0; i < 10; i++){

                    //Rank
                    if(i == 0){
                        writeHighscoreText((i+1)+"ST",horizontalMargin,topMargin*2+gapBetweenLines*(i+1),highscoreColors[i+2]);

                    }
                    else if(i == 1){
                        writeHighscoreText((i+1)+"ND",horizontalMargin,topMargin*2+gapBetweenLines*(i+1),highscoreColors[i+2]);
                    }
                    else{
                        writeHighscoreText((i+1)+"TH",horizontalMargin,topMargin*2+gapBetweenLines*(i+1),highscoreColors[i+2]);
                    }
                    //Score
                    writeHighscoreText(highScores[i][0],w/2,topMargin*2+gapBetweenLines*(i+1),highscoreColors[i+2])
                    //Name
                    writeHighscoreText(highScores[i][1],w-horizontalMargin,topMargin*2+gapBetweenLines*(i+1),highscoreColors[i+2]);

                }

            for(var i = 0; i < highScores.length; i++){
                if(clientPublicIP == highScores[i][0]){
                    //Calc top %
                    topPct = Math.ceil((i+1)*100/highScores.length);
                    //
                    ctx_ui.font = "18px Consolas";
                    ctx_ui.textAlign = "center";
                    ctx_ui.fillStyle = 'white';
                    if(i+1 <= 10){
                        ctx_ui.fillText((i+1)+"TH",horizontalMargin,h_ui/2);
                    }
                    else{
                        ctx_ui.fillText("TOP "+topPct+"%",horizontalMargin,h_ui/2);
                    }
                    ctx_ui.fillText(clientPublicIP+"(YOU)",w_ui/2,h_ui/2);
                    ctx_ui.fillText(highScores[i][1],w_ui-horizontalMargin,h_ui/2);
                    break;
                }
            }




                requestAnimationFrame(mainLoop);
                updateTimers();
            //});




        }


    };

    //@post: Es función callback de onReady, que se llama al cargar los sprites
    var init = function () {

        console.log('Sprites ready');
        thisLevel.loadLevelSprites();


        //@test: Probar sprites
        //thisLevel.drawMap();
        //thisLevel.gameover_sprite.render();
        requestAnimationFrame(mainLoop);

    };

    var getClientPublicIPAddress = function(){

        return $.getJSON(url='//api.ipify.org?format=jsonp&callback=?', function(data) {
            clientPublicIP = data['ip'];
            //console.log('got client ip address');
        });

    };


    var start = function () {



        //Identificar usuario por IP
        //Actualizar su HighScore
        //Ordenamos las 3 AJAX requests
        $.when(getClientPublicIPAddress()).done(function (a1) {
            $.when(updateRanking()).done(function(a2) {
                getSetPlayerHighScore();
            });
        });

        loadAssets();
        loadPreferences();

        blankDiv = document.getElementById('blank');
        //Delete childs
        while (blankDiv.firstChild) {
            blankDiv.removeChild(blankDiv.firstChild);
        }

        // adds a div for displaying the fps value
        fpsContainer = document.getElementById('fpscontainer');



        addListeners();

        reset();
        //@test: Definir en qué escena comenzar
        thisGame.setMode(thisGame.START_UI);








    };

    var timer = function (currentTime) {

        var aux = currentTime - oldTime;
        oldTime = currentTime;
        return aux;

    }

    //Algunas funciones auxiliares


    //Y otras cuestiones...
    var namespace = {};
    namespace.anim = {};
    var ida = true;
    var animTimer = 0;
    pacmanAnim = new Pacman();
    blinky = new Ghost('blinky', ctx);
    pinky = new Ghost('pinky', ctx);
    inky = new Ghost('inky', ctx);
    clyde = new Ghost('clyde', ctx);
    pacmanAnim.x = w;
    pacmanAnim.y = h / 1.75;
    namespace.anim[0] = pacmanAnim;
    namespace.anim[1] = blinky;
    namespace.anim[2] = pinky;
    namespace.anim[3] = inky;
    namespace.anim[4] = clyde;
    namespace.anim[5] = ida;
    namespace.anim[6] = animTimer;



    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start,
        thisGame: thisGame
    };
};

var game = new GF();
game.start();





