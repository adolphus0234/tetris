import Player from './player.js';
import Arena from './arena.js';
import SoundBoard from './sounds.js';
import ColorHandler from './colorHandler.js';

import GUI from './GUI.js';
import PopUp from './popupWindow.js';
import { animRgb } from './animation.js';

export default class Tetris {
	constructor(music) {

		//OBJECTS------------------------------------------

		this.gUI = new GUI(this);
		this.pop_up = new PopUp(this);
		this.sounds = new SoundBoard();
		this.lvl_color = new ColorHandler();
		this.gameMusic = music;

		this.arena = new Arena(10, 21, this.sounds, this.gUI);
		
		this.player = new Player(this, this.gUI, this.sounds);
		
		//CANVAS/CONTEXT VARIABLES------------------------

		this.canvas = document.querySelector('.tetris');
		this.context = this.canvas.getContext('2d');
		this.context.scale(20, 20);

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		//VARIABLES

		this.innerBlockColorLayer = this.lvl_color.colors[0][0];
		this.outerBlockColorLayer = this.lvl_color.colors[0][1];

		this.dropCounter = 0;
		this.dropInterval = 0;

		this.score = 0;
		this.topScore = 0;
		
		this.bestSessionScore = 0;
		this.avgScore = 0;
		this.scoreArray = [];

		this.lineCounter = 0;
		this.avgLines = 0;
		this.lineArray = [];

		this.level = 0;
		this.levelUpCounter = 0;
		this.levelColorCycle = 0;

		this.singleRowClear = 0;
		this.doubleRowClear = 0;
		this.tripleRowClear = 0;

		this.tetrisClear = 0;
		this.totalRowClears = 0;
		this.totalTetrisLines = 0;

		this.randomIndex = 0;

		//STATES-------------------------------

		this.paused = false;
		this.firstPause = true;
		this.startScreen = true;
		this.endGame = false;
		this.finalStats = false;

		this.hideNextBox = false;
		this.pauseSwitch = true;

		this.gamePadConnected = false;

		//GAME LOOP----------------------------

		let lastTime = 0;
		const deltaTime = 1/60 * 1000;

		this._gameLoop = (time = 0) => {

			//ADD LABELS HERE
	
			if (!this.paused && !this.startScreen
			&&  !this.endGame && !this.finalStats) {
				this.update(deltaTime, time / 10);
			}

			this.gUI.drawScreenAnimated(time);
			this.gUI.drawGUIAnimated(time);

			this.pauseScreen(deltaTime);
			this.resetBlockDropCounter(deltaTime);			

			if (!this.startScreen
			&&  !this.endGame
			&&  !this.finalStats) {
				this.pop_up.update(time);
			}

			requestAnimationFrame(this._gameLoop);
			lastTime = time;
		}

		//gameLoop();
	}

	run() {
		this._gameLoop();
	}

	blockDropCounter(deltaTime) {
		//CHANGE NAME
		this.counterDelay(deltaTime);

		let that = this;

		if (this.dropCounter > this.dropInterval) {
			this.player.drop();
		}
		
		if (this.arena.rowClear === true ||
			this.player.dD === true) {

			this.dropCounter = 0;

			setTimeout(function() {
				that.arena.rowClear = false;
				that.arena.tetrisRowClear = false;
				that.dropCounter += (deltaTime - deltaTime);
			}, 450);
		}
	}

	blockDropCounterFix(deltaTime) {
		//CHANGE NAME
		this.blockDropCounter = function() {

			let that = this;
				
			if (this.firstPause === true) {
				this.dropCounter += (deltaTime - (deltaTime));

				setTimeout(function() {
					that.firstPause = false;
				}, 1000);

			} else if (this.firstPause === false) {
				this.dropCounter += deltaTime;
			}

			if (this.dropCounter > this.dropInterval) {
				this.player.drop(this, this.arena);
			}
			
			if (this.arena.rowClear === true ||
				this.player.dD === true) {

				this.dropCounter = 0;

				setTimeout(function() {
					that.arena.rowClear = false;
					that.arena.tetrisRowClear = false;
					that.dropCounter += (deltaTime - deltaTime);
				}, 450);
			}
		}
	}

	counterDelay(deltaTime) {
		//RENAME - dropCounterStartDelay
		let that = this;
		setTimeout(function() {
			that.dropCounter += deltaTime;
		}, 1500);
	}

	draw(time) {
		//DRAW GAME BOARD

		this.gameBgColor();
		this.context.fillRect(0, 1, this.width, this.height - 1);

		//DRAW PLAYER CONTROLLED BLOCK (CURRENT BLOCK)

		if (!this.startScreen) {
			this.drawMatrix(this.player.matrix, this.player.pos, 1, this.context, time);
		}

		//DRAW STATIC BLOCKS

		this.drawMatrix(this.arena.matrix, {x: 0, y: 0}, 1, this.context, time);

		this.context.fillStyle = 'rgb(25, 25, 25)';
		this.context.fillRect(0, 0, this.width, 1);	
	}

	drawMatrix(matrix, offset, scale, context, time) {
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					context.fillStyle = this.innerBlockColorLayer[value];
					context.fillRect(x * scale + offset.x, 
									 y * scale + offset.y, 	
									 1 * scale, 1 * scale);

					context.strokeStyle = '#000';
					context.lineWidth = 0.1 * scale;
					context.strokeRect(x * scale + offset.x, 
									   y * scale + offset.y, 	
									   1 * scale, 1 * scale);

					context.strokeStyle = this.outerBlockColorLayer[value];
					context.lineWidth = 0.14 * scale;
					context.strokeRect((x + 0.1) * scale + offset.x, 
									   (y + 0.1) * scale + offset.y, 	
									    0.8 * scale, 0.8 * scale);

					context.strokeStyle = '#fff';
					context.lineWidth = 0.1 * scale;
					context.strokeRect((x + 0.15) * scale + offset.x, 
									   (y + 0.15) * scale + offset.y, 	
									    0.03 * scale, 0.03 * scale);
					if (value === 9) {
						if (this.arena.tetrisRowClear === true) {
							this.lineClearFillFlash(x, y, offset, time);
						} else {
							this.lineClearFillBlack(x, y, offset);
						}
						
					}
				}
			});
		});
	}

	drawMatrix2(matrix, offset, scale, context) {
		//CURTAIN / SHUTTER ROW
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value === 8) {
					context.fillStyle = 'rgb(30, 30, 30)';
					context.fillRect(x * scale + offset.x, 
										  y * scale + offset.y, 
										  1 * scale, 1 * scale);

					context.fillStyle = 'rgb(60, 60, 60)';
					context.fillRect(x * scale + offset.x, 
										  y * scale + offset.y, 
										  1 * scale, 0.5 * scale);

					context.fillStyle = 'rgb(95, 95, 95)';
					context.fillRect(x * scale + offset.x, 
										  y * scale + offset.y, 
										  1 * scale, 0.15 * scale);

					context.fillStyle = 'rgb(10, 10, 10)';
					context.fillRect(x * scale + offset.x, 
										  (y + 0.8) * scale + offset.y, 
										   1 * scale, 0.15 * scale);
				}
			});
		});
	}

	gameBgColor() {
		this.context.fillStyle = 'black';
	}

	gameOver() {
		this.gUI.gameOverText.text = this.endGame ? 'GAMEOVER' : '';
		this.gUI.drawStaticScreen();
	}

	gameRecap() {

		this.line_1;
		this.line_2;
		this.line_3;
		this.line_4;
		this.line_5;
		this.line_6;
		this.line_7;
		this.line_8;
		this.line_9;

		let that = this;

		if (this.finalStats === true) {

			//SHOW RECAP SCREEN STATS
			
			this.arena.clear();
			this.arena.clear_2();

			this.context.fillStyle = 'rgb(0, 0, 0)';
			this.context.fillRect(0, 1, this.width, this.height - 1);

			this.gUI.recapHeading.text = `~ Recap ~`;
			this.gUI.drawStaticScreen();

			this.line_1 = setTimeout(function() {
				that.gUI.recapLine_1.text = `SINGLE: ${that.singleRowClear}`;
				that.gUI.drawStaticScreen();
			}, 500);

			this.line_2 = setTimeout(function() {
				that.gUI.recapLine_2.text = `DOUBLE: ${that.doubleRowClear}`;
				that.gUI.drawStaticScreen();
			}, 1000);

			this.line_3 = setTimeout(function() {
				that.gUI.recapLine_3.text = `TRIPLE: ${that.tripleRowClear}`;
				that.gUI.drawStaticScreen();
			}, 1500);

			this.line_4 = setTimeout(function() {
				that.gUI.recapLine_4.text = `TETRIS: ${that.tetrisClear}`;
				that.gUI.drawStaticScreen();
			}, 2000);

			this.line_5 = setTimeout(function() {
				that.gUI.recapLine_5.text = `TET RT: ${that.arena.tetrisRate}%`;
				that.gUI.drawStaticScreen();
			}, 2500);

			this.line_6 = setTimeout(function() {
				that.gUI.recapLine_6.text = `DT TOT: ${that.player.totalDroughts}`;
				that.gUI.drawStaticScreen();
			}, 3000);

			this.line_7 = setTimeout(function() {
				that.gUI.recapLine_7.text = `DT AVG: ${that.player.avgDrought}`;
				that.gUI.drawStaticScreen();
			}, 3500);

			this.line_8 = setTimeout(function() {
				that.gUI.recapLine_8.text = `DT MAX: ${that.player.maxDrought}`;
				that.gUI.drawStaticScreen();
			}, 4000);

			this.line_9 = setTimeout(function() {
				if (that.gamePadConnected === true) {
					that.gUI.press_space.text = `PRESS START`;
					that.gUI.drawStaticScreen();
				} else {
					that.gUI.press_space.text = `PRESS SPACE`;
					that.gUI.drawStaticScreen();
				}				
			}, 4500);

		} else {

			//CLEAR RECAP SCREEN STATS && CANCEL TIMEOUTS

			clearTimeout(that.line_1);
			clearTimeout(that.line_2);
			clearTimeout(that.line_3);
			clearTimeout(that.line_4);
			clearTimeout(that.line_5);
			clearTimeout(that.line_6);
			clearTimeout(that.line_7);
			clearTimeout(that.line_8);
			clearTimeout(that.line_9);

			this.gUI.recapHeading.text = ``;
			this.gUI.recapLine_1.text = ``;
			this.gUI.recapLine_2.text = ``;
			this.gUI.recapLine_3.text = ``;
			this.gUI.recapLine_4.text = ``;
			this.gUI.recapLine_5.text = ``;
			this.gUI.recapLine_6.text = ``;
			this.gUI.recapLine_7.text = ``;
			this.gUI.recapLine_8.text = ``;
			this.gUI.press_space.text = ``;
		}
	}

	gpDetect() {
		const { gp_detect } = this.gUI;

		if (this.gamePadConnected === true) {

			gp_detect.text = 'A gamepad connected...';			
			setTimeout(function() {
				gp_detect.text = '';
			}, 7000)

		} else if (this.gamePadConnected === false) {

			gp_detect.text = 'A gamepad disconnected...';
			setTimeout(function() {
				gp_detect.text = '';
			}, 7000)
		}

		if (!this.startScreen) {
			gp_detect.text = '';
		}
	}

	levelUp() {
		if (this.levelUpCounter >= 10 && this.lineCounter >= (this.level * 10 + 10)) {

			let that = this;

			setTimeout(function() {
				that.sounds.playLevelUpAlert();
			}, 300);
			
			this.level = this.level + 1;
			this.levelColorCycle = this.levelColorCycle + 1;
			this.levelUpCounter = this.levelUpCounter - 10;

			if (this.levelColorCycle > 19) {
				this.levelColorCycle = 0;
			}
			this.levelColor();
		}
	}

	levelColor() {
		this.innerBlockColorLayer = this.lvl_color.colors[this.levelColorCycle][0];
		this.outerBlockColorLayer = this.lvl_color.colors[this.levelColorCycle][1];
		this.gUI.drawStaticGUI();
	} 

	levelSpeed(frameRate) {
		if (this.level >= 29) {
			frameRate = 1;
			return frameRate * 16.66666666666667;
		} else if (this.level >= 19) {
			frameRate = 2;
			return frameRate * 16.66666666666667;
		} else if (this.level >= 16) {
			frameRate = 3;
			return frameRate * 16.66666666666667;
		} else if (this.level >= 13) {
			frameRate = 4;
			return frameRate * 16.66666666666667;
		} else if (this.level >= 10) {
			frameRate = 5;
			return frameRate * 16.66666666666667;
		} else if (this.level === 9) {
			frameRate = 6;
			return frameRate * 16.66666666666667;
		} else {
			return (frameRate - (this.level * 5)) * 16.66666666666667;
		}	
	}

	levelSelect() {
		if (this.startScreen === true) {

			this.arena.clear();

			this.gUI.drawStaticScreen();
			this.gUI.drawStaticGUI();
			
			this.context.fillStyle = "black";
			this.context.fillRect(0, 1, this.width, this.height - 1);
		}
		

		if (!this.startScreen) {
			this.gUI.clearScreen();
		}

		//GAMEOVER SEQUENCE (move to separate function)--------------------

		if (this.endGame === true) {

			let that = this;

			this.context.fillStyle = 'rgb(30, 0, 0)';
			this.context.fillRect(0, 1, this.width, this.height - 1);

			this.music();

			setTimeout(function() {
				that.arena.curtainDrop();
			}, 300);
				
			setTimeout(function() {
				that.gameOver();
			}, 2500);
		}
	}

	lineClearFillFlash(x, y, offset, time) {
		this.context.fillStyle = animRgb(255, 255, 255, time, 2);
		this.context.fillRect(x + offset.x, 
						 	  y + offset.y, 	
						 	  1, 1);

		this.context.strokeStyle = animRgb(255, 255, 255, time, 2);
		this.context.lineWidth = 0.1;
		this.context.strokeRect(x + offset.x, 
						   		y + offset.y, 	
						   		1, 1);
	}

	lineClearFillBlack(x, y, offset) {
		this.context.fillStyle = 'black';
		this.context.fillRect(x + offset.x, 
						 	  y + offset.y, 	
						 	  1, 1);

		this.context.strokeStyle = 'black';
		this.context.lineWidth = 0.1;
		this.context.strokeRect(x + offset.x, 
						  	    y + offset.y, 	
						   		1, 1);
	}

	music() {
		this.elapseTimer;
		this.songTimer;

		if (!this.startScreen && !this.paused
		&&  !this.endGame && !this.finalStats) {
			
			this.gameMusic.playTrack(this.gameMusic.trackList[this.randomIndex]);
			this.songTimer = this.gameMusic.songLength[this.randomIndex] + 3000;

			let that = this;

			//TRACKING TIME ELAPSED IN SELECTED SONG

			this.elapseTimer = setInterval(function() {
				that.songTimer -= 1000/60;

				if (that.songTimer < 0) {
					that.songTimer = that.gameMusic.songLength[that.randomIndex] + 3000;
					that.gameMusic.stopTrack(that.gameMusic.trackList[that.randomIndex]);
					that.gameMusic.playTrack(that.gameMusic.trackList[that.randomIndex]);
				}

			}, 1000/60);
		} 

		if (this.paused) {
			this.gameMusic.pauseTrack(this.gameMusic.trackList[this.randomIndex]);
			clearInterval(this.elapseTimer);
		}

		if (this.startScreen || this.endGame || this.finalStats) {
			this.gameMusic.stopTrack(this.gameMusic.trackList[this.randomIndex]);
			clearInterval(this.elapseTimer);
			this.songTimer = this.gameMusic.songLength[this.randomIndex] + 3000;
		}
	}

	pauseScreen(deltaTime) {
		if (this.paused === true && !this.endGame
		&& !this.finalStats && !this.startScreen) {

			if (this.pauseSwitch === true) {
				this.gUI.drawStaticScreen();
				this.pauseSwitch = false;
			}
			
			this.blockDropCounterFix(deltaTime);

		} else {

			if (this.pauseSwitch === false) {
				this.gUI.clearScreen();
				this.pauseSwitch = true;
			}
			
		}
	}

	resetBlockDropCounter(deltaTime) {
		//CHANGE NAME
		if (this.startScreen === true) {

			this.blockDropCounter = function() {
				this.counterDelay(deltaTime);

				let that = this;
				
				if (this.dropCounter > this.dropInterval) {
					this.player.drop();
				}
				
				if (this.arena.rowClear === true || 
					this.player.dD === true) {

					this.dropCounter = 0;

					setTimeout(function() {
						that.arena.rowClear = false;
						that.arena.tetrisRowClear = false;
						that.dropCounter += (deltaTime - deltaTime);
					}, 450);
				}
			}
		}
	}

	runTetrisFlash() {
		this.gameBgColor = function() {
			this.tetrisFlash();
		}

		let that = this;

		setTimeout(function() {
			that.gameBgColor = function() {
				that.context.fillStyle = 'black';
			}
		}, 350)
	}

	tetrisFlash(time) {
		this.context.fillStyle = animRgb(255, 255, 255, time, 2);
	}

	tetrisScore() {
		if (!this.endGame) {
			this.arena.updateScore(this, this.player);
		}
	}

	update(deltaTime, time) {
	
		this.blockDropCounter(deltaTime);
		this.player.update(deltaTime);

		this.draw(time);

		if (this.arena.tetrisRowClear === true) {
			this.tetrisFlash(time);
		}

		this.dropInterval = this.levelSpeed(47);
	}
}