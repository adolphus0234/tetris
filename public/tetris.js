import Player from './player.js';
import Arena from './arena.js';
import SoundBoard from './sounds.js';
import ColorHandler from './colorHandler.js';
import DomRef from './domRef.js';

export const animRgb = (r, g, b, time, f) => {
	let c1 = Math.floor(Math.sin(time) * r / f) + r / 2;
	let c2 = Math.floor(Math.sin(time) * g / f) + g / 2;
	let c3 = Math.floor(Math.sin(time) * b / f) + b / 2;

	return `rgb(${c1}, ${c2}, ${c3})`;
}

//Constants-------------------------

const dom = new DomRef();
const sounds = new SoundBoard();
const lvl_color = new ColorHandler();

const context = dom.canvas.getContext('2d');
context.scale(20, 20);
const context_next = dom.canvas_next.getContext('2d');
context_next.scale(30, 30);
const context_stat = dom.canvas_stat.getContext('2d');
context_stat.scale(8, 8);

const width = dom.canvas.width;
const height = dom.canvas.height;
const width_n = dom.canvas_next.width;
const height_n = dom.canvas_next.height;
const width_s = dom.canvas_stat.width;
const height_s = dom.canvas_stat.height;

//Global variables------------------

let lastCount;
let speedDec = 5;
let gridCount = 0;

export default class Tetris {
	constructor(music) {

		this.arena = new Arena(10, 21, context, sounds, dom);
		this.player = new Player(this, dom.canvas_next, dom.canvas_stat, sounds);

		this.level = 0;

		this.colors = lvl_color.colors[0][0];
		this.colorsA = lvl_color.colors[0][1];

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

		this.levelUpCounter = 0;
		this.levelColorCycle = 0;

		this.singleRowClear = 0;
		this.doubleRowClear = 0;
		this.tripleRowClear = 0;

		this.tetrisClear = 0;
		this.totalRowClears = 0;
		this.totalTetrisLines = 0;

		this.n = 0;

		//States-------------------------------

		this.paused = false;
		this.firstPause = true;
		this.startScreen = true;
		this.endGame = false;
		this.finalStats = false;

		this.gamePadConnected = false;

		//-------------------------------------

		this.sounds = sounds;
		this.gameMusic = music;

		//Game Loop----------------------------

		let lastTime = 0;
		const deltaTime = 1/60 * 1000;

		const gameLoop = (time = 0) => {

			if (!this.paused && !this.startScreen
				&& !this.endGame && !this.finalStats) {
				this.update(deltaTime, time / 10);
			} 

			this.levelSelect(deltaTime);
			this.gameRecap(deltaTime);
			this.player.calcFinalStats(deltaTime);
			this.music(deltaTime);
			this.tetrisScore();
			this.pauseScreen(deltaTime);
			this.resetBlockDropCounter(deltaTime);
			this.drawMatrix2(this.arena.matrix, {x: 0, y: 0}, this.context, time);

			requestAnimationFrame(gameLoop);
			lastTime = time;
		}

		gameLoop();

		//Flash Animation Loop------------------

		const flashLoop = (millis) => {
			this.tetrisFlash(millis / 10);
			this.menuFlash(millis / 8);
			this.slowFlash(millis / 700);
			this.slowFlash2(millis/ 700);
			requestAnimationFrame(flashLoop);
		}

		flashLoop();
	}

	blockDropCounter(deltaTime) {
		this.counterDelay(deltaTime);

		if (this.dropCounter > this.dropInterval) {
			this.player.drop(this, this.arena);
		}
		
		if (this.arena.rC === true ||
			this.player.dD === true) {
			this.dropCounter = 0;
			let that = this;
			setTimeout(function() {
				that.arena.rC = false;
				that.arena.tRC = false;
				that.dropCounter += (deltaTime - deltaTime);
			}, 450);
		}
	}

	clearFillFlash(x, y, offset, time) {
		context.fillStyle = animRgb(255, 255, 255, time, 2);
		context.fillRect(x + offset.x, 
						 y + offset.y, 	
						 1, 1);
		context.strokeStyle = animRgb(255, 255, 255, time, 2);
		context.lineWidth = 0.1;
		context.strokeRect(x + offset.x, 
						   y + offset.y, 	
						   1, 1);
	}

	clearFillBlack(x, y, offset) {
		context.fillStyle = 'black';
		context.fillRect(x + offset.x, 
						 y + offset.y, 	
						 1, 1);
		context.strokeStyle = 'black';
		context.lineWidth = 0.1;
		context.strokeRect(x + offset.x, 
						   y + offset.y, 	
						   1, 1);
	}

	counterDelay(deltaTime) {
		let that = this;
		setTimeout(function() {
			that.dropCounter += deltaTime; 
		}, 1500);
	}

	curtain(x, y, offset) {
		context.fillStyle = 'rgb(30, 30, 30)';
		context.fillRect(x + offset.x, 
							  y + offset.y, 1, 1);

		context.fillStyle = 'rgb(60, 60, 60)';
		context.fillRect(x + offset.x, 
							  y + offset.y, 1, 0.5);

		context.fillStyle = 'rgb(95, 95, 95)';
		context.fillRect(x + offset.x, 
							  y + offset.y, 1, 0.15);

		context.fillStyle = 'rgb(10, 10, 10)';
		context.fillRect(x + offset.x, 
							  y + 0.8 + offset.y, 1, 0.15);
	}

	draw(time) {
		//Draw Game Board and Player Block------------------------

		this.gameBgColor();
		context.fillRect(0, 1, width, height - 1);

		if (!this.startScreen) {
			this.drawMatrix(this.player.matrix, this.player.pos, context, time);
		}

		this.drawMatrix(this.arena.matrix, {x: 0, y: 0}, context, time);

		context.fillStyle = 'rgb(25, 25, 25)';
		context.fillRect(0, 0, width, 1);

		//Draw Next Block--------------------------------------------

		context_next.fillStyle = 'black';
		context_next.fillRect(0, 0, width_n, height_n);

		if (!this.startScreen) {
			this.drawMatrix(this.player.upNext.matrix, this.player.upNext.pos, context_next);
		}

		//Draw Statistics---------------------------------------------

		context_stat.fillStyle = 'black';
		context_stat.fillRect(0, 0, width_s, height_s);
		
		this.player.drawStatBoard(this);
		
	}

	drawMatrix(matrix, offset, context, time) {
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					context.fillStyle = this.colors[value];
					context.fillRect(x + offset.x, 
									 y + offset.y, 	
									 1, 1);

					context.strokeStyle = '#000';
					context.lineWidth = 0.1;
					context.strokeRect(x + offset.x, 
									   y + offset.y, 	
									   1, 1);

					context.strokeStyle = this.colorsA[value];
					context.lineWidth = 0.1;
					context.strokeRect(x + 0.1 + offset.x, 
									   y + 0.1 + offset.y, 	
									   0.8, 0.8);

					context.strokeStyle = '#fff';
					context.lineWidth = 0.1;
					context.strokeRect(x + 0.15 + offset.x, 
									   y + 0.15 + offset.y, 	
									   0.03, 0.03);
					if (value === 9) {
						if (this.arena.tRC === true) {
							this.clearFillFlash(x, y, offset, time);
						} else {
							this.clearFillBlack(x, y, offset);
						}
						
					}
				}
			});
		});
	}

	drawMatrix2(matrix, offset, context, time) {
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
					if (value === 8) {
						this.curtain(x, y, offset);
					}
			});
		});
	}

	gameBgColor() {
		context.fillStyle = 'black';
	}

	gameOver() {
		if (this.endGame === true) {
			dom.g_o.innerText = 'GAMEOVER';
		} else {
			dom.g_o.innerText = '';
		}
	}

	gameRecap() {
		if (this.finalStats === true) {

			this.arena.clear();

			let that = this;

			context.fillStyle = 'rgb(0, 0, 0)';
			context.fillRect(0, 1, width, height - 1);

			dom.recap_head.innerText = `~ Recap ~`;

			setTimeout(function() {
				dom.single_clr.innerText = `SINGLE: ${that.singleRowClear}`;
			}, 500);
			setTimeout(function() {
				dom.double_clr.innerText = `DOUBLE: ${that.doubleRowClear}`;
			}, 1000);
			setTimeout(function() {
				dom.triple_clr.innerText = `TRIPLE: ${that.tripleRowClear}`;
			}, 1500);
			setTimeout(function() {
				dom.tetris_clr.innerText = `TETRIS: ${that.tetrisClear}`;
			}, 2000);
			setTimeout(function() {
				dom.tet_rate.innerText = `TET RT: ${that.arena.tetrisRate}%`;
			}, 2500);
			setTimeout(function() {
				dom.d_total.innerText = `DT TOT: ${that.player.totalDroughts}`;
			}, 3000);
			setTimeout(function() {
				dom.d_avg.innerText = `DT AVG: ${that.player.avgDrought}`;
			}, 3500);
			setTimeout(function() {
				dom.d_max.innerText = `DT MAX: ${that.player.maxDrought}`;
			}, 4000);
			setTimeout(function() {
				if (that.gamePadConnected === true) {
					dom.press_start.innerText = `PRESS START`;
				} else {
					dom.press_start.innerText = `PRESS SPACE`;
				}
				
				that.slowFlash();
			}, 4500);		
		}

		if (!this.finalStats) {
			dom.recap_head.innerText = ``;
			dom.single_clr.innerText = ``;
			dom.double_clr.innerText = ``;
			dom.triple_clr.innerText = ``;
			dom.tetris_clr.innerText = ``;
			dom.tet_rate.innerText = ``;
			dom.d_total.innerText = ``;
			dom.d_avg.innerText = ``;
			dom.d_max.innerText = ``;
			dom.press_start.innerText = ``;
		}
	}

	gpDetect() {
		if (this.gamePadConnected === true) {
			dom.gp_connect.innerText = 'A gamepad connected...';
			setTimeout(function() {
				dom.gp_connect.innerText = '';
			}, 7000)
		} else if (this.gamePadConnected === false) {
			dom.gp_connect.innerText = 'A gamepad disconnected...';
			setTimeout(function() {
				dom.gp_connect.innerText = '';
			}, 7000)
		}
	}

	levelUp() {
		if (this.levelUpCounter >= 10 && this.lineCounter >= (this.level * 10 + 10)) {
			setTimeout(function() {
				sounds.playLevelUpAlert();
			}, 300);
			
			this.level = this.level + 1;
			this.levelColorCycle = this.levelColorCycle + 1;
			this.levelUpCounter = this.levelUpCounter - 10;

			if (this.levelColorCycle > 19) {
				this.levelColorCycle = 0;
			}
		}
	}

	levelColor() {
		this.colors = lvl_color.colors[this.levelColorCycle][0];
		this.colorsA = lvl_color.colors[this.levelColorCycle][1];
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
			return (frameRate - (this.level * speedDec)) * 16.66666666666667;
		}	
	}

	levelSelect(deltaTime) {
		if (this.startScreen === true) {
			this.gameBgColor();
			context.fillRect(0, 1, width, height - 1);
			context_next.fillStyle = 'black';
			context_next.fillRect(0, 0, width_n, height_n);
			context_stat.fillStyle = 'black';
			context_stat.fillRect(0, 0, width_s, height_s);

			dom.levelNum.innerText = `${this.level}`.padStart(2, '0');
			dom.levelHeading.innerText = 'SELECT LEVEL:';
			this.menuFlash();
		}
		

		if (!this.startScreen) {
			dom.levelNum.innerText = '';
			dom.levelHeading.innerText = '';
		}

		if (this.endGame === true) {
			let that = this;
			context.fillStyle = 'rgb(30, 0, 0)';
			context.fillRect(0, 1, width, height - 1);

			setTimeout(function() {
				that.arena.curtainDrop();
			}, 300)
				
			setTimeout(function() {
				that.gameOver();
			}, 2500);
		}
	}

	menuFlash(time) {
		if (this.startScreen) {
			dom.levelNum.style.color = animRgb(255, 50, 0, time, 3);
		}
	}

	//-------------------------------------

	music() {
		if(!this.startScreen && !this.paused
			&& !this.endGame && !this.finalStats) {
			this.gameMusic.playTrack(this.gameMusic.trackList[this.n])
		} 

		if (this.paused) {
			this.gameMusic.pauseTrack(this.gameMusic.trackList[this.n])
		}

		if (this.startScreen || this.endGame || this.finalStats) {
			this.gameMusic.stopTrack(this.gameMusic.trackList[this.n])
		}
	}

	//-------------------------------------

	pauseScreen(deltaTime) {
		if (this.paused === true && !this.endGame
		&& !this.finalStats && !this.startScreen) {

				dom.pausedGame.innerText = 'PAUSED';
				
				this.blockDropCounter = function() {
					
					if (this.firstPause === true) {
						this.dropCounter += (deltaTime - (deltaTime));
						let that = this;
						setTimeout(function() {
							that.firstPause = false;
						}, 1000);

					} else if (this.firstPause === false) {
						this.dropCounter += deltaTime;
					}

					if (this.dropCounter > this.dropInterval) {
						this.player.drop(this, this.arena);
					}
					
					if (this.arena.rC === true 
						|| this.player.dD === true) {
						this.dropCounter = 0;
						let that = this;
						setTimeout(function() {
							that.arena.rC = false;
							that.arena.tRC = false;
							that.dropCounter += (deltaTime - deltaTime);
						}, 450);
					}
				}
			} else {

				dom.pausedGame.innerText = '';
			}
	}

	resetBlockDropCounter(deltaTime) {
		if (this.startScreen === true) {
			this.blockDropCounter = function() {
				this.counterDelay(deltaTime);
				
				if (this.dropCounter > this.dropInterval) {
					this.player.drop(this, this.arena);
				}
				
				if (this.arena.rC === true
					|| this.player.dD === true) {
					this.dropCounter = 0;
					let that = this;
					setTimeout(function() {
						that.arena.rC = false;
						that.arena.tRC = false;
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
			context.fillStyle = 'black';
			}
		}, 350)
	}

	slowFlash(time) {
		dom.press_start.style.color = animRgb(255, 255, 255, time, 2);	
	}

	slowFlash2(time) {
		dom.gp_connect.style.color = animRgb(255, 255, 255, time, 2.5);
	}

	tetrisFlash(time) {
		context.fillStyle = animRgb(255, 255, 255, time, 2);
	}

	tetrisScore() {
		if (!this.endGame) {
			this.arena.updateScore(this, this.player);
		}
	}

	update(deltaTime, time) {
	
		this.blockDropCounter(deltaTime);
		this.player.update(deltaTime);
		
		this.levelUp();
		this.levelColor()
		this.draw(time);

		this.dropInterval = this.levelSpeed(48);

		this.tetrisFlash();

		console.log(this.player.totalDroughts)
	}
}