import { reset, pauseGame, openFullscreen, 
		 closeFullscreen, toggleNextBox } from './keyBoard.js';

//Gamepad Events=====================================================//

export default class Gamepad2 {
	constructor(tetris) {
		this.tetris = tetris;
		this._gameLoop;
	}

	gamepadAPI(e) {
		const player = this.tetris.player;

		let LEFT_HOLD = 'inactive';
		let LEFT_AUTO = 'inactive';

		let RIGHT_HOLD = 'inactive';
		let RIGHT_AUTO = 'inactive';

		let right_das;
		let left_das;

		let FRAME_COUNTER = 0;
		let DAS_RATE = 52;

		let RELEASE_HOLD = false;
		let DROP_RATE = 17;
		let FRAME_COUNTER_2 = 0;

		let HOLDING_A_X = false;
		let HOLDING_B_Y = false;

		let HOLDING_START = false;
		let HOLDING_BACK = false;

		let HOLDING_L1 = false;
		let HOLDING_R1 = false;
		let fullScreen = false;

		let HOLDING_L2 = false;
		let TOGGLE_RATE = 67;
		let FRAME_COUNTER_3 = 0;

		const deltaTime = 1/60 * 1000;
		
		const gameLoop = (time = 0) => {

			if (this.tetris.gamePadConnected === true) {
				const gp = navigator.getGamepads()[e.gamepad.index];
				
				//D PAD LEFT/RIGHT---------------------------------------------

				FRAME_COUNTER += deltaTime;

				if (FRAME_COUNTER > DAS_RATE) {
					FRAME_COUNTER = 0;
				}

				const D_PAD_LEFT = gp.buttons[14].pressed;
				const D_PAD_RIGHT = gp.buttons[15].pressed;

				if (D_PAD_LEFT === false &&
					D_PAD_RIGHT === false) {
					clearTimeout(left_das);
					clearTimeout(right_das);
				}

				if (D_PAD_LEFT === false) {
					LEFT_HOLD = 'inactive';
					LEFT_AUTO = 'inactive';
				}

				if (D_PAD_RIGHT === false) {
					RIGHT_HOLD = 'inactive';
					RIGHT_AUTO = 'inactive';
				}

				if (FRAME_COUNTER === 0) {

					if (this.tetris.startScreen === true) {

						if (D_PAD_LEFT === false &&
							D_PAD_RIGHT === false) {
							DAS_RATE = 105;
						}

						if (D_PAD_LEFT === true) {
							
							setTimeout(function() {
						 		LEFT_AUTO = 'active';
						 		DAS_RATE = 105;
						 	}, 266);

							if (LEFT_HOLD === 'inactive' || LEFT_AUTO === 'active') {

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

								// if (this.tetris.level > 0) {
								// 	this.tetris.levelSelect();
								// }

								this.tetris.levelSelect();				

						 		LEFT_HOLD = 'active';
							}

						} else if (D_PAD_RIGHT === true) {
							
							setTimeout(function() {
						 		RIGHT_AUTO = 'active';
						 		DAS_RATE = 105;
						 	}, 266);

							if (RIGHT_HOLD === 'inactive' || RIGHT_AUTO === 'active') {

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

								// if (this.tetris.level < 29) {
								// 	this.tetris.levelSelect();
								// }

								this.tetris.levelSelect();
								
								RIGHT_HOLD = 'active';
							}
						}
					}

					if (!this.tetris.paused && !this.tetris.startScreen 
						&& !this.tetris.endGame && !this.tetris.finalStats) {

						if (D_PAD_LEFT === false &&
							D_PAD_RIGHT === false) {
							DAS_RATE = 52;
						}

						if (D_PAD_LEFT === true) {

							left_das = setTimeout(function() {
						 		LEFT_AUTO = 'active';
						 		DAS_RATE = 85;
						 	}, 266);

							if (!player.dD && !this.tetris.arena.rowClear) {
									if (LEFT_HOLD === 'inactive' 
									|| LEFT_AUTO === 'active') {
									player.moveLeft();
							 		LEFT_HOLD = 'active';
								}	
							}
							
						} else if (D_PAD_RIGHT === true) {

							right_das = setTimeout(function() {
						 		RIGHT_AUTO = 'active';
						 		DAS_RATE = 85;
						 	}, 266);

							if (!player.dD && !this.tetris.arena.rowClear) {
									if (RIGHT_HOLD === 'inactive' 
									|| RIGHT_AUTO === 'active') {
									player.moveRight();
									RIGHT_HOLD = 'active';
								}
							}
							
						}
					}				
				}

				//D PAD DOWN (PIECE DROP)-------------------------------------

				FRAME_COUNTER_2 += deltaTime;

				if (FRAME_COUNTER_2 > DROP_RATE) {
					FRAME_COUNTER_2 = 0;
				}

				const D_PAD_DOWN = gp.buttons[13].pressed;

				if (FRAME_COUNTER_2 === 0) {
					if (!this.tetris.paused && !this.tetris.startScreen 
						&& !this.tetris.player.dD && !this.tetris.arena.rowClear 
						&& !this.tetris.endGame && !this.tetris.finalStats) {

						if (D_PAD_DOWN === false) {
							RELEASE_HOLD = false;
						}

						if (D_PAD_DOWN === true &&
							D_PAD_LEFT === false &&
							D_PAD_RIGHT === false) {

							if (RELEASE_HOLD === false) {
								if (this.tetris.level > 28) {
									player.dropDownScoreOnly();
								} else {
									player.dropDown(this.tetris);
								}
								
								if (player.dD === true) {
									RELEASE_HOLD = true;
								}
							}
						}
					}
				}

				// A/X & B/Y (ROTATION)-----------------------------------------

				const A_BUTTON = gp.buttons[0].pressed;
				const X_BUTTON = gp.buttons[2].pressed;
				const B_BUTTON = gp.buttons[1].pressed;
				const Y_BUTTON = gp.buttons[3].pressed;

				if (!this.tetris.paused && !this.tetris.startScreen
					&& !this.tetris.player.dD && !this.tetris.arena.rowClear
					&& !this.tetris.endGame && !this.tetris.finalStats) {	

					if (A_BUTTON === false &&
						X_BUTTON === false) {
						HOLDING_A_X = false;
					}

					if (B_BUTTON === false &&
						Y_BUTTON === false) {
						HOLDING_B_Y = false;
					}

					if (A_BUTTON === true ||
						X_BUTTON === true) {
						if (HOLDING_A_X === false) {
							player.rotateLeft();
							HOLDING_A_X = true;
						}
					} else if (B_BUTTON === true ||
							   Y_BUTTON === true) {
						if (HOLDING_B_Y === false) {
							player.rotateRight();
							HOLDING_B_Y = true;
						}
					}
				}

				// START & BACK/SELECT (PAUSE/START function)------------------

				const START_BUTTON = gp.buttons[9].pressed;
				const BACK_BUTTON = gp.buttons[8].pressed;

				if (this.tetris.finalStats === true) {

					if (START_BUTTON === false) {
						HOLDING_START = false;
					}

					if (START_BUTTON === true) {
						if (HOLDING_START === false) {

							this.tetris.score = 0;
							this.tetris.level = 0;
							this.tetris.levelColorCycle = 0;
							this.tetris.tetrisClear = 0;

							this.tetris.totalRowClears = 0;
							this.tetris.totalTetrisLines = 0;
							this.tetris.singleRowClear = 0;
							this.tetris.doubleRowClear = 0;
							this.tetris.tripleRowClear = 0;

							this.tetris.player.totalDroughts = 0;
							this.tetris.player.avgDrought = 0;
							this.tetris.player.maxDrought = 0;

							this.tetris.player.droughtArray = []; 

							this.tetris.finalStats = false;
							this.tetris.startScreen = true;
							this.tetris.gameOver();
							this.tetris.gameRecap();
							this.tetris.levelSelect();
							this.tetris.tetrisScore();
								
							HOLDING_START = true;
						}
					}	
				}

				if (this.tetris.startScreen === true) {

					if (START_BUTTON === false) {
						HOLDING_START = false;
					}

					if (START_BUTTON === true) {
						if (HOLDING_START === false) {

							player.statCounts.fill(0);

							this.tetris.randomIndex = Math.floor(Math.random() 
										  		* this.tetris.gameMusic.totalTracks);
							this.tetris.sounds.playSelectPause();
							this.tetris.startScreen = false;
							this.tetris.levelSelect();
							this.tetris.levelColor();
							this.tetris.tetrisScore();
							this.tetris.gpDetect();
							this.tetris.music();

							let that = this;
							setTimeout(function() {
								that.tetris.tetrisScore();
							}, 20);
							
							HOLDING_START = true;
						}
					}
				}

				if (!this.tetris.startScreen && !this.tetris.endGame
					&& !this.tetris.finalStats) {

					if (START_BUTTON === false) {
						HOLDING_START = false;
					}

					if (BACK_BUTTON === false) {
						HOLDING_BACK = false;
					}

					if (START_BUTTON === true) {
						if (HOLDING_START === false) {
							pauseGame(this.tetris);
							this.tetris.music();
							HOLDING_START = true;
						}
					}

					if (BACK_BUTTON === true) {
						if (HOLDING_BACK === false) {
							if (this.tetris.paused === true) {
								let that = this;
								setTimeout(function() {
									reset(that.tetris);
								}, 100);

								HOLDING_BACK = true;	
							} 	
						}	
					}


					if (BACK_BUTTON === true) {
						if (HOLDING_BACK === false) {
							if (this.tetris.paused === false) {	
								toggleNextBox(this.tetris);
								this.tetris.gUI.drawStaticGUI();

								HOLDING_BACK = true;	
							}
						}
					}
				}

				// L1 & R1 (TOGGLE FULLSCREEN/ESC)----------------------------------

				const L_1 = gp.buttons[4].pressed;
				const R_1 = gp.buttons[5].pressed;

				if (L_1 === false) {
					HOLDING_L1 = false;
				}

				if (R_1 === false) {
					HOLDING_R1 = false;
				}

				if (L_1 === true && HOLDING_L1 === false) {
					openFullscreen();
					HOLDING_L1 = true;
					HOLDING_R1 = true;
					fullScreen = true;
				}

				if (R_1 === true && HOLDING_R1 === false
					&& fullScreen === true) {
					closeFullscreen();
					HOLDING_L1 = true;
					HOLDING_R1 = true;
					fullScreen = false;
				}

				// L2 (TOGGLE POPUP STATS WINDOW)---------------------------------

				FRAME_COUNTER_3 += deltaTime;

				if (FRAME_COUNTER_3 > TOGGLE_RATE) {
					FRAME_COUNTER_3 = 0;
				}

				const L_2 = gp.buttons[6].pressed;

				if (FRAME_COUNTER_3 === 0) {
					if (this.tetris.paused === true) {
						if (L_2 === false) {
							HOLDING_L2 = false;
						}

						if (L_2 === true && HOLDING_L2 === false) {
							this.tetris.pop_up.open = !this.tetris.pop_up.open;
							TOGGLE_RATE = 1005;
							HOLDING_L2 = true;
							setTimeout(function() {
								TOGGLE_RATE = 67;
							}, 1000)
						}
					}		
				}				
			}	
			this._gameLoop = requestAnimationFrame(gameLoop);			
		}
		gameLoop();
	}
}