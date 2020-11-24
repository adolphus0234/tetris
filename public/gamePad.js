import { reset, pauseGame, openFullscreen, closeFullscreen } from './keyBoard.js';

//Gamepad Events------------------------------

export default class Gamepad {
	constructor(tetris, popup) {
		this.tetris = tetris;
		this.pop_up = popup;
	}

	gamepadMove(e) {
		const player = this.tetris.player;

		let p1 = 'press';
		let g1 = 'press';

		let p2 = 'press';
		let g2 = 'press';

		let rate = 68;

		const gameLoop = (time = 0) => {
			
			const gp = navigator.getGamepads()[e.gamepad.index];
			const D_PAD_LEFT = gp.buttons[14].pressed;
			const D_PAD_RIGHT = gp.buttons[15].pressed;

			if (this.tetris.startScreen === true) {
				if (D_PAD_LEFT === false) {
						p1 = 'press';
						g1 = 'press';
					}

					if (D_PAD_RIGHT === false) {
						p2 = 'press';
						g2 = 'press';
					}

					if (D_PAD_LEFT === false &&
						D_PAD_RIGHT === false) {
						rate = 100;
					}

					if (D_PAD_LEFT === true) {
						
						setTimeout(function() {
					 		g1 = 'holding';
					 		rate = 100;
					 	}, 266);

						if (p1 === 'press' || g1 === 'holding') {
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

					 		p1 = 'holding';
						}	
					} else if (D_PAD_RIGHT === true) {
						
						setTimeout(function() {
					 		g2 = 'holding';
					 		rate = 100;
					 	}, 266);

						if (p2 === 'press' || g2 === 'holding') {
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

							p2 = 'holding';
							
						}
					}
			}

			if (!this.tetris.paused && !this.tetris.startScreen 
				&& !this.tetris.endGame && !this.tetris.finalStats) {

					if (D_PAD_LEFT === false) {
						p1 = 'press';
						g1 = 'press';
					}

					if (D_PAD_RIGHT === false) {
						p2 = 'press';
						g2 = 'press';
					}

					if (D_PAD_LEFT === false &&
						D_PAD_RIGHT === false) {
						rate = 68;
					}

					if (D_PAD_LEFT === true) {

						setTimeout(function() {
					 		g1 = 'holding';
					 		rate = 100;
					 	}, 266);

						if (!player.dD && !this.tetris.arena.rC) {
								if (p1 === 'press' || g1 === 'holding') {
								player.moveLeft();
						 		p1 = 'holding';
							}	
						}
						
					} else if (D_PAD_RIGHT === true) {

						setTimeout(function() {
					 		g2 = 'holding';
					 		rate = 100;
					 	}, 266);

						if (!player.dD && !this.tetris.arena.rC) {
								if (p2 === 'press' || g2 === 'holding') {
								player.moveRight();
								p2 = 'holding';
							}
						}
						
					}
			}
			setTimeout(gameLoop, rate);
		}
		gameLoop();
	}


	gamepadDrop(e) {
		const player = this.tetris.player;

		let RELEASE_HOLD = false;

		const gameLoop = (time = 0) => {

			if (!this.tetris.paused && !this.tetris.startScreen 
				&& !this.tetris.player.dD && !this.tetris.arena.rC 
				&& !this.tetris.endGame && !this.tetris.finalStats) {		
				const gp = navigator.getGamepads()[e.gamepad.index];
				const D_PAD_DOWN = gp.buttons[13].pressed;
				const D_PAD_LEFT = gp.buttons[14].pressed;
				const D_PAD_RIGHT = gp.buttons[15].pressed;

				if (D_PAD_DOWN === false) {
					RELEASE_HOLD = false;
				}

				if (D_PAD_DOWN === true &&
					D_PAD_LEFT === false &&
					D_PAD_RIGHT === false) {

					if (RELEASE_HOLD === false) {
						player.dropDown(this.tetris);
						if (player.dD === true) {
							RELEASE_HOLD = true;
						}
					}
				}
			} 
			setTimeout(gameLoop, 35);		
		}
		gameLoop();
	}


	gamepadRotate(e) {
			const player = this.tetris.player;

			let HOLDING_A_X = false;
			let HOLDING_B_Y = false;

		const gameLoop = (time = 0) => {
			if (!this.tetris.paused && !this.tetris.startScreen
				&& !this.tetris.player.dD && !this.tetris.arena.rC
				&& !this.tetris.endGame && !this.tetris.finalStats) {	
				const gp = navigator.getGamepads()[e.gamepad.index];
				const A_BUTTON = gp.buttons[0].pressed;
				const X_BUTTON = gp.buttons[2].pressed;
				const B_BUTTON = gp.buttons[1].pressed;
				const Y_BUTTON = gp.buttons[3].pressed;

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
						// console.log('counter-clockwise')
					}
				} else if (B_BUTTON === true ||
						   Y_BUTTON === true) {
						if (HOLDING_B_Y === false) {
							player.rotateRight();
							HOLDING_B_Y = true;
							// console.log('clockwise')
						}
				}
			}
			requestAnimationFrame(gameLoop);	
		}
		gameLoop();
	}

	gamepadPause(e) {
		const player = this.tetris.player;

		let HOLDING_START = false;

		const gameLoop = (time = 0) => {
					
			const gp = navigator.getGamepads()[e.gamepad.index];
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

						this.tetris.n = Math.floor(Math.random() * this.tetris.gameMusic.t);

						this.tetris.sounds.playSelectPause();
						this.tetris.startScreen = false;
						
						HOLDING_START = true;
					}
				}
			}

			if (!this.tetris.startScreen && !this.tetris.endGame
				&& !this.tetris.finalStats) {

				if (START_BUTTON === false) {
					HOLDING_START = false;
				}

				if (START_BUTTON === true) {
					if (HOLDING_START === false) {
						pauseGame(this.tetris);
						HOLDING_START = true;
					}
				}

				if (BACK_BUTTON === true &&
					this.tetris.paused === true) {
						reset(this.tetris);
				}
			}
				requestAnimationFrame(gameLoop);
		}
		gameLoop();
	}

	toggleFullscreen(e) {
		let HOLDING_L1 = false;
		let HOLDING_R1 = false;
		let fullScreen = false;

		const gameLoop = (time = 0) => {

			const gp = navigator.getGamepads()[e.gamepad.index];
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
			requestAnimationFrame(gameLoop);
		}
		gameLoop();
	}

	togglePopUp(e) {
		let HOLDING_L2 = false;
		let rate = 60;

		const gameLoop = (time = 0) => {

			const gp = navigator.getGamepads()[e.gamepad.index];
			const L_2 = gp.buttons[6].pressed;
			// const R_2 = gp.buttons[7].pressed;
			if (this.tetris.paused === true) {
				if (L_2 === false) {
					HOLDING_L2 = false;
				}

				if (L_2 === true && HOLDING_L2 === false) {
					this.pop_up.open = !this.pop_up.open;
					rate = 1000;
					HOLDING_L2 = true;
					setTimeout(function() {
						rate = 60;
					}, 1000)
				}
			}
				
			setTimeout(gameLoop, rate);
		}
		gameLoop();
	}	
}

