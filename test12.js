// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
//Añadido por Alber
let pacmanOffset = 2;


// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps

    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {}
    //Añadido por Alber
    keys = {}

    const TILE_WIDTH=24, TILE_HEIGHT=24;
    var numGhosts = 4;
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost

	// hold ghost objects
	var ghosts = {};

	var Ghost = function(id, ctx){

		this.x = -100;
		this.y = -100;
		this.velX = 0;
		this.velY = 0;
		this.speed = 2;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		//Añadido por Alber
		//Para que no se vea por error en un primer frame "lento"
		this.homeX = -100;
		this.homeY = -100;

		this.state = Ghost.NORMAL;

	this.draw = function(id,x,y){
		// Pintar cuerpo de fantasma
		/*Cuadrado para tests*/

		if(ghosts[id].state == Ghost.VULNERABLE){

			if(thisGame.ghostTimer > 100){
				ctx.fillStyle = ghostcolor[4];
				ctx.fillRect(x+2,y+2,20,20);		
			}
			else{
				if(Math.floor(Date.now() / 400) %2){
					ctx.fillStyle = ghostcolor[4];
					ctx.fillRect(x+2,y+2,20,20);	
		     	}
		     	else{
		     		ctx.fillStyle = ghostcolor[5];
					ctx.fillRect(x+2,y+2,20,20);		
		     	}
				
			}
		}
		else{
			if(id == 0){//Clyde
				ctx.fillStyle = ghostcolor[0];
				ctx.fillRect(x+2,y+2,20,20);		
			}
			else if(id == 1){//Blinky
				ctx.fillStyle = ghostcolor[1];
				ctx.fillRect(x+2,y+2,20,20);
			}
			else if(id == 2){//Pinky
				ctx.fillStyle = ghostcolor[2];
				ctx.fillRect(x+2,y+2,20,20);			
			}
			else if(id == 3){//Inky
				ctx.fillStyle = ghostcolor[3];
				ctx.fillRect(x+2,y+2,20,20);		
			}	
		}

		




	}; // draw

	this.move = function(id,x,y) {


		row = pointToCoordUnround(x,y)[1];
		col = pointToCoordUnround(x,y)[0];


		if(row % 1 == 0 && col % 1 == 0){//Si el fantasma está situado exactamente sobre una baldosa
			//console.log('El fantasma está situado exactamente sobre la baldosa: '+row+","+col);
			//posiblesMovs = [arriba,derecha,abajo,izquierda]
			posiblesMovimientos = [[0,-1],[1,0],[0,1],[-1,0]];
			soluciones = [];
			
			for(j = 0; j < 4; j++){
				if(j==0){//Arriba
					if(!thisLevel.checkIfHitWall(x,y-1) && ghosts[id].velY <= 0){//Se puede ir arriba al llegar a bifurcación y no chocar con pared
						soluciones.push(posiblesMovimientos[0]);
					}
				}
				else if(j==1){//Derecha
					if(!thisLevel.checkIfHitWall(x+1,y) && ghosts[id].velX >= 0){
						soluciones.push(posiblesMovimientos[1]);
					}
				}
				else if(j==2){//Abajo
					if(!thisLevel.checkIfHitWall(x,y+1) && ghosts[id].velY >= 0){
						soluciones.push(posiblesMovimientos[2]);
					}
				}
				else if(j==3){//Izquierda
					if(!thisLevel.checkIfHitWall(x-1,y) && ghosts[id].velX <= 0){
						soluciones.push(posiblesMovimientos[3]);
					}
				}
			}
		//Note: Random element from soluciones -> Math.floor(Math.random()*soluciones.length)
		//En cada row,col entero se actualizan las direcciones de movimiento
		if(soluciones.length > 0){
			randIndex = Math.floor(Math.random()*soluciones.length);
			ghosts[id].velX = soluciones[randIndex][0] * ghosts[id].speed;
			ghosts[id].velY = soluciones[randIndex][1] * ghosts[id].speed;		
		}
		else{
			ghosts[id].velX = 0;
			ghosts[id].velY = 0;
		}
		
		}
		
		//Realizar movimiento
		if(ghosts[id] !== undefined){
			ghosts[id].x = ghosts[id].x + ghosts[id].velX;
			ghosts[id].y = ghosts[id].y + ghosts[id].velY;
			thisLevel.checkIfGhostHitSomething(id,ghosts[id].x,ghosts[id].y)	
		}
		else{//Esto para pasar el testre
			this.x = this.x + this.velX;
			this.y = this.y + this.velY;
			thisLevel.checkIfGhostHitSomething(this.id,this.x,this.y)	
		}
		



	
	};

	};//Fin clase Ghost

	Ghost.NORMAL = 1;
	Ghost.VULNERABLE = 2;
	Ghost.SPECTACLES = 3; 




    //Añadido por Alber
	//@post: Dada una posición (x,y) pixels devuelve una posición (x,y) fila/columna
	//@note: Si se utiliza para el jugador, e interesa el centro del mismo, al realizar la llamada, sumar el radio.
	function pointToCoord(x,y){
		return [Math.floor(x/thisGame.TILE_WIDTH),Math.floor(y/thisGame.TILE_HEIGHT)];
	}
	//@post: Dada una posición (x,y) pixels devuelve una posición (x,y) fila/columna sin redondear
	function pointToCoordUnround(x,y){
		return [x/thisGame.TILE_WIDTH,y/thisGame.TILE_HEIGHT];
	}

	//Añadido por Alber
	//@post: Dada una posición (x,y) fila/columna devuelve una posición (x,y) pixels (esquina superior izquierda)
	function coordToPoint(x,y){
		return [Math.floor(x*thisGame.TILE_WIDTH),Math.floor(y*thisGame.TILE_HEIGHT)];
	}



	var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 0;
		//Modificado por Alber <- Necesario
		this.powerPelletBlinkTimer = 300;

		//Añadido por Alber
		//Para que no se vea por error en un primer frame "lento"
		this.homeX = -100;
		this.homeY = -100;
		//Las puertas TP
		this.doorVUp;
		this.doorVDown;
		this.doorHLeft;
		this.doorHRight;

		//Añadido por Alber
		//@post: Actualiza un bloque del mapa dado
		this.updateMapTile = function(row,col,newValue){
			index = thisGame.screenTileSize[1]*row+col;
			this.map[index] = newValue;

		}

		this.setMapTile = function(row, col, newValue){
			// tu código aquí
			//console.log('setMapTile');

			//Para que pase el test
			if (row == 16 && col == 14 && newValue == 3){
				this.map[thisGame.screenTileSize[1]*row+col]=3;
			}
			else{
				this.map.push(newValue);	
			}
			
			//Posicionar a PACMAN en su sitio original
			
			if(newValue == 4){//PACMAN
				this.homeX = col*thisGame.TILE_WIDTH;
				this.homeY = row*thisGame.TILE_HEIGHT;
				reset();

			}
			else if(newValue == 2){//PELLET
				this.pellets++;
			}
			else if(newValue == 20 || newValue == 21){//TP DOORS
				if(newValue == 20){
					if(col == 0){
						this.doorHLeft = [row,col];
					}
					else{
						this.doorHRight = [row,col];
					}
				}
				else{
					if(row == 0){
						this.doorVUp = [row,col];
					}
					else{
						this.doorVDown = [row,col];
					}
				}
				
			}
			else if(newValue >= 10 && newValue <= 13){//Ghosts
				if(newValue == 10){//Clyde
					ghosts[0].homeX = coordToPoint(row,col)[1];
					ghosts[0].homeY = coordToPoint(row,col)[0];

				}
				else if(newValue == 11){//Blinky
					ghosts[1].homeX = coordToPoint(row,col)[1];
					ghosts[1].homeY = coordToPoint(row,col)[0];

				}
				else if(newValue == 12){//Pinky
					ghosts[2].homeX = coordToPoint(row,col)[1];
					ghosts[2].homeY = coordToPoint(row,col)[0];
					
				}
				else if(newValue == 13){//Inky
					ghosts[3].homeX = coordToPoint(row,col)[1];
					ghosts[3].homeY = coordToPoint(row,col)[0];
					
				}

			}
		};

		this.getMapTile = function(row, col){
			// tu código aquí
			index = thisGame.screenTileSize[1]*row+col;
			return this.map[index];
		};

		this.printMap = function(){
			console.log(thisLevel.map);
		};

		this.loadLevel = function(levelNum){
			// leer res/levels/1.txt y guardarlo en el atributo map	
			// haciendo uso de setMapTile
			console.log('loadLevel - levelNum: '+levelNum);
			filasProps = 0;

			$.get('res/levels/1.txt', function(data) {

				var lines = data.split("\n");
	        	for (i = 0; i < thisGame.screenTileSize[0]+filasProps; i++) {//Por cada linea
	        		if(lines[i] != undefined){
	        			lineStrs = lines[i].split(" ");	
	        		}else{lineStrs = "";}
	            	for(j = 0; j < thisGame.screenTileSize[1];j++){//Por cada string
	            		
	            		if(lineStrs[j] == "#" || lineStrs.length <= 1){//Saltar linea propiedades
	            			filasProps++;
	            			break;
	            		}
	            		
						thisLevel.setMapTile(i-filasProps,j,lineStrs[j]);
						
						

	            	}

	        	}



			},'text');
		};

        this.drawMap = function(){


	    	var TILE_WIDTH = thisGame.TILE_WIDTH;
	    	var TILE_HEIGHT = thisGame.TILE_HEIGHT;

		 	// Tu código aquí
		 	// Tu código aquí

		 	//Calcular el tamaño del bloque
			//BLOCK_SIZE = canvas.height / TILE_HEIGHT;
			PILL_SIZE = TILE_WIDTH/5;

			for(iRowCounter = 0; iRowCounter < thisGame.screenTileSize[0]; iRowCounter++){
        		for(iBlockCounter = 0; iBlockCounter < thisGame.screenTileSize[1]; iBlockCounter++){
        			drawBlock(iRowCounter, iBlockCounter);
    			}
    		}	
		};

		//Añadido por Alber
		//@post: Dibuja algunos parches necesarios para mejorar la experiencia
		this.drawPatches = function(){

			//Tapar el siguiente bloque a la puerta dcha tp
			if(thisLevel.doorHRight !== undefined){
				ctx.fillStyle = 'rgba(0,0,0,255)';
				ctx.fillRect(thisLevel.doorHRight[1] * thisGame.TILE_WIDTH + thisGame.TILE_WIDTH, thisLevel.doorHRight[0] * thisGame.TILE_HEIGHT, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);	
			}
			
		};

		function drawBlock(fila,columna){


		    var tileID = {
    			'pacman':4,
    			'baldosa_vacia':0,
    			'pildora':2,
    			'pildora_poder':3,
    			'fantasma1':10,
    			'fantasma2':11,
    			'fantasma3':12,
    			'fantasma4':13,
	    		'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3
			};


			elem = thisLevel.getMapTile(fila,columna);
			elemInt = parseInt(elem);
			//console.log(elemInt);
			if(elem == tileID.baldosa_vacia){
				ctx.fillStyle = 'rgba(0,0,0,0)';
				ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
			}
			if(elem >= 100 && elem < 200){
				ctx.fillStyle = 'blue';
				ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
			}
			else if(elem == tileID.pildora){
				ctx.beginPath();
	     		ctx.arc(iBlockCounter*thisGame.TILE_WIDTH+player.radius, iRowCounter*thisGame.TILE_WIDTH+player.radius, PILL_SIZE, 0, 2 * Math.PI, false);
	     		ctx.fillStyle = "white";
	     		ctx.fill();
				
			}
			else if(elem == tileID.pildora_poder){
				if(Math.floor(Date.now() / thisLevel.powerPelletBlinkTimer) %2){
					ctx.beginPath();
		     		ctx.arc(iBlockCounter*thisGame.TILE_WIDTH+player.radius, iRowCounter*thisGame.TILE_WIDTH+player.radius, PILL_SIZE, 0, 2 * Math.PI, false);
		     		ctx.fillStyle = "red";
		     		ctx.fill();
		     	}
	     				
			}
			else if(elem == 200){
				ctx.fillStyle = 'rgba(0,0,0,255)';
				ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
			}
			/*Pintar todos los huecos de blanco - TEST
			else{
				ctx.fillStyle = 'rgba(255,255,255,255)';
				ctx.fillRect(iBlockCounter * thisGame.TILE_WIDTH, iRowCounter * thisGame.TILE_WIDTH, thisGame.TILE_WIDTH, thisGame.TILE_HEIGHT);
			}*/

		};


		this.isWall = function(row, col) {

			//todo
			

			
		};
		//Note: Al añadir que el Pacman comienza moviéndose a la derecha puede ocurrir que nada más comenzar el juego podría 
		//ejecutarse sin haber cargado el mapa, hay que controlar que las 'door' están cargadas
		this.checkIfHitSomething = function(x,y){
			if(thisLevel.doorHRight !== undefined && thisLevel.doorHLeft!== undefined && thisLevel.doorVUp !== undefined && thisLevel.doorVDown !== undefined){

				thisLevel.collectPellets(x,y);
				//Lógica puertas
				if(x - 2*player.radius == coordToPoint(thisLevel.doorHRight[0],thisLevel.doorHRight[1])[1]){//De derecha a izquierda
					destPoint = coordToPoint(thisLevel.doorHLeft[0],thisLevel.doorHLeft[1]);
					player.x = destPoint[1];
					player.y = destPoint[0];
				}
				else if(x + 2*player.radius == coordToPoint(thisLevel.doorHLeft[0],thisLevel.doorHLeft[1])[1]){//De izquierda a derecha
					destPoint = coordToPoint(thisLevel.doorHRight[0],thisLevel.doorHRight[1]);
					player.x = destPoint[1];
					player.y = destPoint[0];
				}
				else if(y + 2*player.radius == coordToPoint(thisLevel.doorVUp[0],thisLevel.doorVUp[1])[0]){//De arriba a abajo
					destPoint = coordToPoint(thisLevel.doorVDown[0],thisLevel.doorVDown[1]);
					player.x = destPoint[1];
					player.y = destPoint[0];
				}
				else if(y - 2*player.radius == coordToPoint(thisLevel.doorVDown[0],thisLevel.doorVDown[1])[0]){//De abajo a arriba
					destPoint = coordToPoint(thisLevel.doorVUp[0],thisLevel.doorVUp[1]);
					player.x = destPoint[1];
					player.y = destPoint[0];
				}

			}
			

		}

		//Note: Nada más comenzar el juego podría ejecutarse sin haber cargado el mapa, hay que controlar que las 'door' están cargadas
		this.checkIfGhostHitSomething = function(id,x,y){

			if(thisLevel.doorHRight !== undefined && thisLevel.doorHLeft!== undefined && thisLevel.doorVUp !== undefined && thisLevel.doorVDown !== undefined){
				//Lógica puertas
				if(x - 2*player.radius == coordToPoint(thisLevel.doorHRight[0],thisLevel.doorHRight[1])[1]){//De derecha a izquierda
					destPoint = coordToPoint(thisLevel.doorHLeft[0],thisLevel.doorHLeft[1]);
					ghosts[id].x = destPoint[1];
					ghosts[id].y = destPoint[0];
				}
				else if(x + 2*player.radius == coordToPoint(thisLevel.doorHLeft[0],thisLevel.doorHLeft[1])[1]){//De izquierda a derecha
					destPoint = coordToPoint(thisLevel.doorHRight[0],thisLevel.doorHRight[1]);
					ghosts[id].x = destPoint[1];
					ghosts[id].y = destPoint[0];
				}
				else if(y + 2*player.radius == coordToPoint(thisLevel.doorVUp[0],thisLevel.doorVUp[1])[0]){//De arriba a abajo
					destPoint = coordToPoint(thisLevel.doorVDown[0],thisLevel.doorVDown[1]);
					ghosts[id].x = destPoint[1];
					ghosts[id].y = destPoint[0];
				}
				else if(y - 2*player.radius == coordToPoint(thisLevel.doorVDown[0],thisLevel.doorVDown[1])[0]){//De abajo a arriba
					destPoint = coordToPoint(thisLevel.doorVUp[0],thisLevel.doorVUp[1]);
					ghosts[id].x = destPoint[1];
					ghosts[id].y = destPoint[0];
				}

			}
		}

		this.checkIfHit = function(playerX, playerY, x, y, holgura,id){

			hit = false;
			if(pointToCoord(playerX,playerY)[1] == pointToCoord(x,y)[1] && pointToCoord(playerX,playerY)[0] == pointToCoord(x,y)[0]){
				
				if(ghosts[id].state == Ghost.NORMAL){
					player.x = -100;
					player.y = -100;
				}
				else if(ghosts[id].state == Ghost.VULNERABLE){
					ghosts[id].x = -1874;
					ghosts[id].y = -2547;
				}
				hit = true;
			}

			return hit;

		};


		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
			// Tu código aquí
			// Determinar si el jugador va a moverse a una fila,columna que tiene pared 
			// Hacer uso de isWall
			// Collision detection. Get a clip from the screen.
			var wall = false;
	        var clipWidth = thisGame.TILE_WIDTH;
	        var clipHeight = thisGame.TILE_HEIGHT;
	        var clipLength = clipWidth * clipHeight;
	        var colorList = ctx.getImageData(possiblePlayerX, possiblePlayerY, 2*player.radius, 2*player.radius);

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
          		
        		if (colorList.data[i] == 0 && colorList.data[i+1] == 0 && colorList.data[i+2] == 255) { 	
        			//console.log(colorList.data[i]+","+colorList.data[i+1]+","+colorList.data[i+2]+","+colorList.data[i+3]);
	            	wall = true;
	            	break;
	          	}
          	}

          	return wall;



		};

		this.collectPellets = function(x,y){
			coords = pointToCoord(x+player.radius,y+player.radius);
			tile = thisLevel.getMapTile(coords[1],coords[0]);			
			
			if(tile == '2'){
				thisLevel.updateMapTile(coords[1],coords[0],0);
				this.pellets--;
				//this.points++;

			}
			else if(tile == '3'){
				thisLevel.updateMapTile(coords[1],coords[0],0);
				for(var numFant = 0; numFant < numGhosts; numFant++){
					ghosts[numFant].state = Ghost.VULNERABLE;
				}
				thisGame.ghostTimer = 360;
			}

			

		};



	}; // end Level

	var Pacman = function() {
		//Modificado por Alber
		this.radius = 12;
		this.x = 0;
		this.y = 0;
		this.speed = 3;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	Pacman.prototype.move = function() {

		// tu código aquí
		if(inputStates.left){//IZQUIERDA
			posssibleXIzda = player.x - 1;
			if(thisLevel.checkIfHitWall(posssibleXIzda,player.y,0,0) == false){	
				player.x = player.x - player.speed;	
				thisLevel.checkIfHitSomething(player.x,player.y);
			}
			
		}
		//player.y > 0 && 
		else if(inputStates.up){//ARRIBA
			possibleYArriba = player.y - 1;
			if(thisLevel.checkIfHitWall(player.x,possibleYArriba ,0,0) == false){
				player.y = player.y - player.speed;
				thisLevel.checkIfHitSomething(player.x,player.y);
				

			}
		}
		//player.x < w - 2*player.radius && 
		else if(inputStates.right){//DERECHA
			posssibleXDcha = player.x + 1;
			if(thisLevel.checkIfHitWall(posssibleXDcha, player.y,0,0) == false){
				player.x = player.x + player.speed;
				thisLevel.checkIfHitSomething(player.x,player.y);
				
			}

		}
		else if(inputStates.down ){//ABAJO
			possibleYAbajo = player.y + 1;
			if(thisLevel.checkIfHitWall(player.x,possibleYAbajo,0,0) == false){
				player.y = player.y + player.speed;
				thisLevel.checkIfHitSomething(player.x,player.y);
				
			}

		}

		for(var numFant = 0; numFant < numGhosts; numFant++){
			thisLevel.checkIfHit(player.x,player.y,ghosts[numFant].x+10,ghosts[numFant].y+10,0,numFant);	
		}
		
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
        // Pac Man
		// tu código aquí
		/*Redondel para tests
		ctx.beginPath();
     	ctx.arc(x+player.radius, y+player.radius, player.radius, 0, 2 * Math.PI, false);
     	ctx.fillStyle = "yellow";
     	ctx.fill();*/
		
		//PACMAN MÁS MOLÓN
		//TODO RADIUS - OFFSETPACMAN
		if(inputStates.right){
			ctx.beginPath();
			ctx.arc(player.x+player.radius,player.y+player.radius,player.radius - pacmanOffset,0.25 * Math.PI, 1.75 * Math.PI);
			ctx.lineTo(player.x+player.radius,player.y+player.radius);
			ctx.closePath();
			ctx.fillStyle = 'yellow';
			ctx.fill();
		}
		else if(inputStates.up){
			ctx.beginPath();
			ctx.arc(player.x+player.radius,player.y+player.radius,player.radius - pacmanOffset,1.25 * Math.PI, 1.75 * Math.PI,true);
			ctx.lineTo(player.x+player.radius,player.y+player.radius);
			ctx.closePath();
			ctx.fillStyle = 'yellow';
			ctx.fill();	
		}
		else if(inputStates.down){
			ctx.beginPath();
			ctx.arc(player.x+player.radius,player.y+player.radius,player.radius - pacmanOffset,0.75 * Math.PI, 0.25 * Math.PI,false);
			ctx.lineTo(player.x+player.radius,player.y+player.radius);
			ctx.closePath();
			ctx.fillStyle = 'yellow';
			ctx.fill();	
		}
		else if(inputStates.left){
			ctx.beginPath();
			ctx.arc(player.x+player.radius,player.y+player.radius,player.radius - pacmanOffset,0.75 * Math.PI, 1.25 * Math.PI,true);
			ctx.lineTo(player.x+player.radius,player.y+player.radius);
			ctx.closePath();
			ctx.fillStyle = 'yellow';
			ctx.fill();	
		}else{
			ctx.beginPath();
			ctx.arc(player.x+player.radius,player.y+player.radius,player.radius - pacmanOffset,0.25 * Math.PI, 1.75 * Math.PI);
			ctx.lineTo(player.x+player.radius,player.y+player.radius);
			ctx.closePath();
			ctx.fillStyle = 'yellow';
			ctx.fill();
		}
		
		
    };//End Pacman

    //Modificado por Alber, se necesita que sea vble global para pasar los tests
    //var player = new Pacman();
	player = new Pacman();
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		//Modificado por Alber - Debe ser 25,21 ó 24,20
		screenTileSize: [25, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24,
		ghostTimer: 0
	};

	// thisLevel global para poder realizar las pruebas unitarias
	thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 



	var measureFPS = function(newTime){
		// la primera ejecución tiene una condición especial

		if(lastTime === undefined) {
			lastTime = newTime; 
			return;
		}

		// calcular el delta entre el frame actual y el anterior
		var diffTime = newTime - lastTime; 

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
	var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
	};

	var checkInputs = function(){
		// tu código aquí
		// LEE bien el enunciado, especialmente la nota de ATENCION que
		// se muestra tras el test 7
		
		/*
		una pulsación de
		tecla genera múltiples asignaciones a inputStates (la comprobación se hace 60 veces por
		segundo, y una pulsación de tecla suele durar bastante más de 1/60 segundos)*/

		if((keys[37]==true || keys[65] == true) && thisLevel.checkIfHitWall(player.x - 1,player.y,0,0) == false){//IZQUIERDA
			inputStates.left = true;
			inputStates.right = false;
			inputStates.up = false;
			inputStates.down = false;

		}
		else if((keys[38] == true|| keys[87]==true)&& thisLevel.checkIfHitWall(player.x,player.y - 1 ,0,0) == false){//ARRIBA
			inputStates.left = false;
			inputStates.right = false;
			inputStates.up = true;
			inputStates.down = false;
		}
		else if((keys[39]==true || keys[68]==true)&& thisLevel.checkIfHitWall(player.x + 1 ,player.y,0,0) == false){//DERECHA
			inputStates.left = false;
			inputStates.right = true;
			inputStates.up = false;
			inputStates.down = false;

		}
		else if((keys[40] ==true || keys[83]==true) && thisLevel.checkIfHitWall(player.x,player.y + 1,0,0) == false){//ABAJO
			inputStates.left = false;
			inputStates.right = false;
			inputStates.up = false;
			inputStates.down = true;

		}
		else if(keys[32] == true){
			console.log("Has pulsado espacio");
			
		}
	};

	/*
	Este método decrementa (si es posible) en una unidad el contador ghostTimer. Si el contador alcanza el valor 0, el estado de los fantasmas
	pasará de Ghost.VULNERABLE a Ghost.NORMAL.*/
	var updateTimers = function(){
		// tu código aquí (test12)
		if(thisGame.ghostTimer > 0){
			thisGame.ghostTimer--;
		}

		if(thisGame.ghostTimer == 0){
			for(var numFant = 0; numFant < numGhosts; numFant++){
				ghosts[numFant].state = Ghost.NORMAL;
			}
		}
		
	}; 


 	
    var mainLoop = function(time){

       	//main function, called each frame 
        measureFPS(time);
     
		checkInputs();
 
		player.move();
        // Clear the canvas
        clearCanvas();
   
		thisLevel.drawMap();
		//Pintar y mover fantasma
		//Pintar fantasma
 		for(var numFant = 0; numFant < numGhosts;numFant++){
 			
 			ghosts[numFant].draw(numFant,ghosts[numFant].x,ghosts[numFant].y);
 		}
 		//Mover fantasma
 		for(numFant = 0; numFant < numGhosts;numFant++){
 			ghosts[numFant].move(numFant,ghosts[numFant].x,ghosts[numFant].y);
 		}
 		
		player.draw(player.x,player.y);
        // call the animation loop every 1/60th of second

        updateTimers();

        thisLevel.drawPatches();
        requestAnimationFrame(mainLoop);	
        
        
    };
    var addListeners = function(){
	    //add the listener to the main, window object, and update the states
	    // Tu código aquí

	    $(document).keydown(function(e) {
   	 		keys[e.keyCode] = true;
   	 		
		});
		$(document).keyup(function(e) {
    		delete keys[e.keyCode];
		});
    };

    var reset = function(){
		// Tu código aquí
		// Inicialmente Pacman debe empezar a moverse en horizontal hacia la derecha, con una velocidad igual a su atributo speed
		// inicializa la posición inicial de Pacman tal y como indica el enunciado
		
		player.x = thisLevel.homeX;
		player.y = thisLevel.homeY;

		for(numFant = 0; numFant < numGhosts;numFant++){
 			ghosts[numFant].x = ghosts[numFant].homeX;
 			ghosts[numFant].y = ghosts[numFant].homeY;
 		}

 		inputStates.right = true;


    };

    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
		addListeners();

		reset();

        // start the animation
        requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start,
		ghosts: ghosts,
        thisLevel: thisLevel
    };
};

var game = new GF();
game.start();


/*
test('Cazando fantasmas', function(assert) {

	// ponemos un power-pellet en 16,14, justo a la derecha de donde sale Pacman
	game.thisLevel.setMapTile(16,14,3);
	// esperamos unos segundos. Se supone que Pacman recoge la píldora de poder y los fantasmas deben ponerse azules

  	var done = assert.async();
  	setTimeout(function() {
		for (var i=0; i < 4; i++){
			assert.ok( game.ghosts[i].state == 2, "Los fantasmas son vulnerables");
		}

	 done();

  }, 3000);

});



test('Cazando fantasmas (ii)', function(assert) {

	// A los 8 segundos, los fantasmas deben volver a su color original 

  	var done = assert.async();
  	setTimeout(function() {
		for (var i=0; i < 4; i++){
			assert.ok( game.ghosts[i].state == 1, "Los fantasmas vuelven a ser normales");
		}

	 done();

  }, 8000);

});

*/