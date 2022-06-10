import Animation from './animation.js';
import { animRgb } from './animation.js'; 

//Global Variables----------

let rowCounter = 0;
let rowsCleared = 0;

export default class Arena {
	constructor(width, height, sound_board, gui) {

		//ARENA MATRICES---------------------------

		const matrix = [];
		const matrix_2 = [];
		while (height--) {
			matrix.push(new Array(width).fill(0));
			matrix_2.push(new Array(width).fill(0));
		}

		this.matrix = matrix;
		this.matrix_2 = matrix_2;

		//OBJECTS----------------------------------

		this.sounds = sound_board;
		this.animation = new Animation();
		this.gUI = gui;

		//VARIABLES--------------------------------

		this.rowClear = false;
		this.tetrisRowClear = false;

		this.tetrisRate = 0;
		this.bestTetrisRate = 0;
		this.avgTetrisRate = 0;

		this.tetRateArray = [];

		this.playerTendencies = [0, 0, 0];
	}

	checkPlayerTendency(player) {
		//Left board-------------
		if (player.pos.x <= 2) {
			this.playerTendencies[0] = this.playerTendencies[0] + 1 / 4;
		} 

		//Center board-----------
		if (player.pos.x >= 2 && player.pos.x <= 5) {
			this.playerTendencies[1] = this.playerTendencies[1] + 1 / 4;
		}  

		//Right board------------
		if (player.pos.x > 4) {
			this.playerTendencies[2] = this.playerTendencies[2] + 1 / 4;
		}
	}

	clear() {
		this.matrix.forEach(row => row.fill(0));
	}

	clear_2() {
		this.matrix_2.forEach(row => row.fill(0));
	}

	clearAnim(y) {
		this.animation.clearAnimation(this.matrix, y);
	}

	collide(player) {
		const [m, o] = [player.matrix, player.pos];

		for (let y = 0; y < m.length; y++) {
			for (let x = 0; x < m[y].length; x++) {
				if (m[y][x] !== 0 && 
				   (this.matrix[y + o.y] &&
					this.matrix[y + o.y][x + o.x]) !== 0) {
					return true;
				}
			}
		}
		return false;
	}

	curtainDrop() {
		this.animation.curtainAnime(this.matrix_2, this.gUI);
	}

	merge(player) {
		player.matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					this.matrix[y + player.pos.y][x + player.pos.x] = value;
					this.checkPlayerTendency(player);
				}
			});
		});
	}

	resetRowCount() {
		rowCounter = 0;
		rowsCleared = 0;
	}

	rowCapture() {
		rowsCleared = rowCounter;
	}

	rowClearState(tetris) {
		outer: for (let y = this.matrix.length - 1; y > 0; y--) {
					for (let x = 0; x < this.matrix[y].length; x++) {
						if (this.matrix[y][x] === 0) {
							continue outer;
						}
					}

			rowCounter++		
			this.rowClear = true;
			this.clearAnim(y);
		}

		if (rowCounter === 4) {	
			this.tetrisRowClear = true;
			this.sounds.playRowTetris();
			tetris.runTetrisFlash();	
		} else if (rowCounter > 0 && rowCounter < 4) {
			let that = this;
			setTimeout(function() {
				that.sounds.playRowClear();
			}, 100);
		}
	}

	sweep(tetris) {
		outer: for (let y = this.matrix.length - 1; y > 0; y--) {
					for (let x = 0; x < this.matrix[y].length; x++) {
						if (this.matrix[y][x] === 0) {
							continue outer;
						}
					}
			const row = this.matrix.splice(y, 1)[0].fill(0);
			this.matrix.unshift(row);
			y++
			// rowCounter++
			tetris.lineCounter++
			tetris.levelUpCounter++
		}

		this.rowCapture();
		tetris.tetrisScore();
		tetris.levelUp();
	}

	updateInGameStatus(tetris, player) {

		this.tetrisRate = (tetris.totalTetrisLines / tetris.totalRowClears) * 100 | 0;
		this.gUI.lineCountLabel.text = `LINES: ${tetris.lineCounter}`;

		if (!tetris.startScreen) {
			this.gUI.levelText.text = `${tetris.level}`.padStart(2, '0');
			this.gUI.tetrisRateLabel.text = `TET RATE: ${this.tetrisRate}%`;
			this.gUI.droughtLabel.text = `′I′ DROUGHT: ${player.droughtCount}`;		
			
		} else if (tetris.startScreen) {
			this.gUI.levelText.text = `--`;
			this.gUI.tetrisRateLabel.text = `TET RATE: 0%`;
			this.gUI.droughtLabel.text = `′I′ DROUGHT: 0`;
		}

		this.gUI.tetrisRateLabel.color = this.tetrisRate >= 25 ? 'green' : 'red';

		this.gUI.drawStaticGUI();

	}

	updateScore(tetris, player) {
		if (rowsCleared === 4) {
			this.rowClear = true;
			tetris.score = tetris.score + (1200 * (tetris.level + 1));
			tetris.tetrisClear = tetris.tetrisClear + 1;
			tetris.totalRowClears = tetris.totalRowClears + 4;
			tetris.totalTetrisLines = tetris.totalTetrisLines + 4;
			this.resetRowCount();
		} else if (rowsCleared === 3) {
			this.rowClear = true;
			tetris.score = tetris.score + (300 * (tetris.level + 1));
			tetris.totalRowClears = tetris.totalRowClears + 3;
			tetris.tripleRowClear = tetris.tripleRowClear + 1;
			this.resetRowCount();
		} else if (rowsCleared === 2) {
			this.rowClear = true;
			tetris.score = tetris.score + (100 * (tetris.level + 1));
			tetris.totalRowClears = tetris.totalRowClears + 2;
			tetris.doubleRowClear = tetris.doubleRowClear + 1;
			this.resetRowCount();
		} else if (rowsCleared === 1) {
			this.rowClear = true;
			tetris.score = tetris.score + (40 * (tetris.level + 1));
			tetris.totalRowClears = tetris.totalRowClears + 1;
			tetris.singleRowClear = tetris.singleRowClear + 1;
			this.resetRowCount();
		}	

		this.gUI.scoreText.text = `${tetris.score}`.padStart(7, '0');
		this.gUI.topScoreText.text = `${tetris.topScore}`.padStart(7, '0');

		// fetch('http://localhost:3001/topscore', {
		// 	method: 'get',
		// 	headers: {'Content-Type': 'application/json'},
		// })
		// .then(res => res.json())
		// .then(score => {
		// 	tetris.topScore = score;
		// });
		
		this.updateInGameStatus(tetris, player);
	}
}