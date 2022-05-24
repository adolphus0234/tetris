const elem = document.querySelector('.body');

export default class KeyBoard {
	constructor(tetris, _document) {
		this.tetris = tetris;

		//KeyBoard Events Listeners---------------------

		_document.addEventListener('keydown', event => {
			this.startGame(event);
		});
		_document.addEventListener('keydown', event => {
			this.tetrisControls(event);
		});
		_document.addEventListener('keydown', event => {
			this.pause(event);
		});
		_document.addEventListener('keydown', event => {
			this.resetGame(event);
		});
		_document.addEventListener('keydown', event => {
			this.toggleFullscreen(event);
		});

		this.keyState = {};

		let that = this;

		_document.addEventListener('keydown',function(e){
		    that.keyState[e.code || e.which] = true;
		},true);

		_document.addEventListener('keyup',function(e){
		    that.keyState[e.code || e.which] = false;
		},true);

		
		let FRAME_COUNTER_1 = 0;
		let FRAME_COUNTER_2 = 0;
		let DAS_RATE = 52;

		let right_das;
		let left_das;

		let left_hold = 'inactive';
		let right_hold = 'inactive';

		const DROP_RATE = 30; // millis

		const deltaTime = 1/60 * 1000;

		function gameLoop() {

			FRAME_COUNTER_1 += deltaTime;
			FRAME_COUNTER_2 += deltaTime;

			// Player Piece Drop

			if (FRAME_COUNTER_1 > DROP_RATE) {
				if (!that.tetris.paused && !that.tetris.startScreen 
					&& !that.tetris.player.dD && !that.tetris.arena.rowClear
					&& !that.tetris.endGame) {

					if (that.keyState['ArrowDown']) {
						that.tetris.player.dropDown(that.tetris);
					}
				}

				FRAME_COUNTER_1 = 0;
			}

			// Player left / right move

			if (!that.keyState['ArrowLeft'] &&
				!that.keyState['ArrowRight']) {
				clearTimeout(left_das);
				clearTimeout(right_das);

				DAS_RATE = 52;
			}

			if (!that.keyState['ArrowLeft']) {
				left_hold = 'inactive'
			}

			if (!that.keyState['ArrowRight']) {
				right_hold = 'inactive'
			}

			if (FRAME_COUNTER_2 > DAS_RATE) {

				if (!that.tetris.paused && !that.tetris.startScreen 
					&& !that.tetris.player.dD && !that.tetris.arena.rowClear
					&& !that.tetris.endGame) {			

					if (that.keyState['ArrowLeft']) {

						if (left_hold === 'inactive') {
							DAS_RATE = 266;
						}
						

						left_das = setTimeout(function() {
							left_hold = 'active';
					 		DAS_RATE = 85;				 		
					 	}, 266);

						that.tetris.player.moveLeft();

					} else if (that.keyState['ArrowRight']) {

						if (right_hold === 'inactive') {
							DAS_RATE = 266;
						}

						right_das = setTimeout(function() {
							right_hold = 'active';
					 		DAS_RATE = 85;
					 	}, 266);

						that.tetris.player.moveRight();
					}
				}

				FRAME_COUNTER_2 = 0;
			}	

		    setTimeout(gameLoop, deltaTime);
		}    
		gameLoop();
	}

	pause(event) {
		if (!this.tetris.startScreen
			&& !this.tetris.controlsScreen
			&& !this.tetris.endGame 
			&& !this.tetris.finalStats) {

			if (event.code === "Space" 
				&& event.repeat === false) {
				pauseGame(this.tetris);
				this.tetris.music();
			}
		}
		event.preventDefault();
	}	

	resetGame(event) {
		if (event.code === "ShiftLeft"
		 && event.repeat === false) {
			if (this.tetris.paused === true) {
				let that = this;
				setTimeout(function() {
					reset(that.tetris);
				}, 100);			
			}

			if (this.tetris.paused === false) {
				toggleNextBox(this.tetris);
				this.tetris.gUI.drawStaticGUI();
			}
		}
	}

	startGame(event) {
		const player = this.tetris.player;

		let that = this;

		if (this.tetris.finalStats === true) {
				
				if (event.code === "Space"
				 && event.repeat === false) {

					setTimeout(function() {
						that.tetris.score = 0;
						that.tetris.level = 0;
						that.tetris.levelColorCycle = 0;
						that.tetris.tetrisClear = 0;

						that.tetris.totalRowClears = 0;
						that.tetris.totalTetrisLines = 0;
						that.tetris.singleRowClear = 0; 
						that.tetris.doubleRowClear = 0; 
						that.tetris.tripleRowClear = 0;

						that.tetris.player.totalDroughts = 0;
						that.tetris.player.avgDrought = 0;
						that.tetris.player.maxDrought = 0;

						that.tetris.player.droughtArray = [];
						that.tetris.finalStats = false;
						that.tetris.startScreen = true;
						that.tetris.gameOver();
						that.tetris.gameRecap();
						that.tetris.levelSelect();
						that.tetris.tetrisScore();
					}, 100); 
				}	
			}

		if (this.tetris.startScreen === true) {
			if (event.code === 'ArrowLeft') {
				this.tetris.sounds.playSelectLevel();
				this.tetris.level = this.tetris.level - 1;
				this.tetris.levelColorCycle = this.tetris.levelColorCycle - 1;
				
				if (this.tetris.level < 0 && 
					this.tetris.levelColorCycle < 0) {
					this.tetris.level = 0;
					this.tetris.levelColorCycle = 0;
				}

				if (this.tetris.levelColorCycle < 0) {
					this.tetris.levelColorCycle = 19;
				}

				this.tetris.levelSelect();

			} else if (event.code === 'ArrowRight') {
				
				this.tetris.sounds.playSelectLevel();
				this.tetris.level = this.tetris.level + 1;
				this.tetris.levelColorCycle = this.tetris.levelColorCycle + 1;
				
				if (this.tetris.levelColorCycle > 19) {
					this.tetris.levelColorCycle = 0;
				}

				if (this.tetris.level > 29) {
					this.tetris.level = 29;
					this.tetris.levelColorCycle = 9;
				}

				this.tetris.levelSelect();

			} else if (event.code === "Space"
				    && event.repeat === false) {

				// if Keyboard controls were already displayed upon first play though
				// or an Xbox 360 Gamepad is connected, start game immediately

				if (!this.tetris.firstPlay || this.tetris.gamePadConnected) {

					player.statCounts.fill(0);

					this.tetris.randomIndex = Math.floor(Math.random() * this.tetris.gameMusic.totalTracks);
					this.tetris.sounds.playSelectPause();
					
					setTimeout(function() {
						that.tetris.startScreen = false;
						that.tetris.levelSelect();
						that.tetris.levelColor();
						that.tetris.tetrisScore();
						that.tetris.gpDetect();
						that.tetris.music();
					}, 200);
					setTimeout(function() {
						//that.tetris.gUI.drawStaticGUI();
						that.tetris.tetrisScore();
					}, 220);
					// setTimeout(function() {
					// 	that.tetris.tetrisScore();
					// }, 250);

				} else {

					// Otherwise, redirect to keyboard controls screen

					this.tetris.sounds.playSelectPause();
					setTimeout(function() {
						that.tetris.startScreen = false;
						that.tetris.controlsScreen = true;
					}, 200);				
				}
			} 
		}

		if (this.tetris.controlsScreen === true) {
			if (event.code === "Space" && event.repeat === false) {

				player.statCounts.fill(0);

				this.tetris.randomIndex = Math.floor(Math.random() * this.tetris.gameMusic.totalTracks);
				this.tetris.sounds.playSelectPause();
				
				setTimeout(function() {
					that.tetris.controlsScreen = false;
					that.tetris.firstPlay = false;
					that.tetris.levelSelect();
					that.tetris.levelColor();
					that.tetris.tetrisScore();
					that.tetris.gpDetect();
					that.tetris.music();
				}, 200);
				setTimeout(function() {
					that.tetris.tetrisScore();
				}, 220);
			}
		}

		event.preventDefault();	
	}	

	tetrisControls(event) {
		const player = this.tetris.player;

		// if (!this.tetris.paused && !this.tetris.startScreen 
		// 	&& !player.dD && !this.tetris.arena.rowClear
		// 	&& !this.tetris.endGame) {
		// 	if (event.code === 'ArrowLeft') {
		// 		player.moveLeft();
		// 	} else if (event.code === 'ArrowRight') {
		// 		player.moveRight();
		// 	} else if (event.code === 'ArrowDown') {
		// 		player.dropDown(this.tetris);
		// 	} else if (event.code === 'KeyQ'
		// 		    && event.repeat === false) {
		// 		player.rotateLeft();
		// 	} else if (event.code === 'KeyW'
		// 			&& event.repeat === false) {
		// 		player.rotateRight();
		// 	} 	
		// }

		if (!this.tetris.paused && !this.tetris.startScreen 
			&& !player.dD && !this.tetris.arena.rowClear
			&& !this.tetris.endGame) {
			if (event.code === 'KeyQ'
				    && event.repeat === false) {
				player.rotateLeft();
			} else if (event.code === 'KeyW'
					&& event.repeat === false) {
				player.rotateRight();
			} 	
		}

		event.preventDefault();
	}

	toggleFullscreen(event) {
		if (event.code === 'Tab' 
		 && event.repeat === false) {
			openFullscreen();
		} 
		event.preventDefault();
	}	
}

export function reset(tetris) {

			const player = tetris.player;

			tetris.dropCounter = 0;

			player.statCounts.fill(0);

			player.reset(tetris.arena, tetris.arena.matrix, tetris);
			
			player.update = function() {
						this.nextPiece = this.upNext.matrix;
						this.statCounter();
						this.y_pos();
			}

			tetris.arena.clear();
			tetris.arena.clear_2();
			tetris.score = 0;
			tetris.lineCounter = 0;
			tetris.levelUpCounter = 0;
			tetris.levelColorCycle = 0;
			tetris.level = 0;
			tetris.dropInterval = 0;
		
			player.droughtCount = 0;
			player._droughtCount = 0;
			tetris.tetrisClear = 0;
			tetris.totalTetrisLines = 0;
			tetris.totalRowClears = 0;
			tetris.singleRowClear = 0;
			tetris.doubleRowClear = 0;
			tetris.tripleRowClear = 0;
			player.i_stat = true;

			tetris.player.totalDroughts = 0;
			tetris.player.avgDrought = 0;
			tetris.player.maxDrought = 0;

			tetris.player.droughtArray = [];

			tetris.paused = !tetris.paused;
			tetris.firstPause = true;

			tetris.startScreen = true;
 
			setTimeout(function() {
				tetris.music();
				tetris.levelSelect();
				tetris.tetrisScore();
			}, 50);
			
}

function togglePause(tetris) {
	tetris.paused = !tetris.paused;
}

export function toggleNextBox(tetris) {
	tetris.hideNextBox = !tetris.hideNextBox;
}

export function pauseGame(tetris) {
	if (!tetris.paused) {
		tetris.sounds.playPause();
	}
	
	togglePause(tetris);
}

export function openFullscreen() {
  	if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      	elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      	elem.msRequestFullscreen();
    }
}

export function closeFullscreen() {
	if (document.exitFullscreen) {
	    document.exitFullscreen();
	} else if (document.webkitExitFullscreen) { /* Safari */
	    document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { /* IE11 */
	    document.msExitFullscreen();
	}
}