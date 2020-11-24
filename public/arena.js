import Animation from './animation.js';
import { animRgb } from './tetris.js';

const animation = new Animation();

//Global Variables----------

let rowCounter = 0;
let rowsCleared = 0;

export default class Arena {
	constructor(w, h, context, sound_board, dom) {
		const matrix = [];
		while (h--) {
			matrix.push(new Array(w).fill(0));
		}
		this.matrix = matrix;
		this.sounds = sound_board;
		this.dom = dom;
		this.rC = false;
		this.tRC = false;

		this.tetrisRate = 0;
		this.bestTetrisRate = 0;
		this.avgTetrisRate = 0;

		this.tetRateArray = [];

		this.playerTendencies = [0, 0, 0];

		const slowFlashLoop = (time = 0) => {
			this.droughtFlash(time / 500);
			requestAnimationFrame(slowFlashLoop);
		}

		slowFlashLoop();
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

	clearAnim(y) {
		animation.clearAnimation(this.matrix, y);
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
		animation.curtainAnime(this.matrix);
	}

	droughtFlash(time) {
		this.dom.i_drought.style.color = animRgb(255, 50, 0, time, 3);
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
			this.rC = true;
			this.clearAnim(y);
		}

		if (rowCounter === 4) {	
			this.tRC = true;
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

		let that = this;

		setTimeout(that.rowCapture, 200);
	}

	updateInGameStatus(tetris, player) {
		if (!tetris.startScreen) {
			this.dom.current_level.innerText = `LEVEL: `;
			this.dom.current_level_num.innerText = `${tetris.level}`.padStart(2, '0');
			this.dom.t_rate.innerText = `TET RATE: ${this.tetrisRate}%`;
			this.dom.i_drought.innerText = `'I' DROUGHT: ${player.droughtCount}`;
		} else if (tetris.startScreen) {
			this.dom.current_level.innerText = `LEVEL: `;
			this.dom.current_level_num.innerText = `--`;
			this.dom.t_rate.innerText = `TET RATE: 0%`;
			this.dom.i_drought.innerText = `'I' DROUGHT: 0`;
		}

		if (player._droughtCount === 14) {
			player.totalDroughts = player.totalDroughts + 1;
		}
	
		if (player.droughtCount >= 14) {
			this.dom.i_drought.style.color = this.droughtFlash();
			player._droughtCount = 0;
		} else {
			this.dom.i_drought.style.color = 'green';
		}

		if (this.tetrisRate >= 25) {
			this.dom.t_rate.style.color = 'green';
		} else {
			this.dom.t_rate.style.color = 'red';
		}
	}

	updateScore(tetris, player) {
		if (rowsCleared === 4) {
			this.rC = true;
			tetris.score = tetris.score + (1200 * (tetris.level + 1));
			tetris.tetrisClear = tetris.tetrisClear + 1;
			tetris.totalRowClears = tetris.totalRowClears + 4;
			tetris.totalTetrisLines = tetris.totalTetrisLines + 4;
			this.resetRowCount();
		} else if (rowsCleared === 3) {
			this.rC = true;
			tetris.score = tetris.score + (300 * (tetris.level + 1));
			tetris.totalRowClears = tetris.totalRowClears + 3;
			tetris.tripleRowClear = tetris.tripleRowClear + 1;
			this.resetRowCount();
		} else if (rowsCleared === 2) {
			this.rC = true;
			tetris.score = tetris.score + (100 * (tetris.level + 1));
			tetris.totalRowClears = tetris.totalRowClears + 2;
			tetris.doubleRowClear = tetris.doubleRowClear + 1;
			this.resetRowCount();
		} else if (rowsCleared === 1) {
			this.rC = true;
			tetris.score = tetris.score + (40 * (tetris.level + 1));
			tetris.totalRowClears = tetris.totalRowClears + 1;
			tetris.singleRowClear = tetris.singleRowClear + 1;
			this.resetRowCount();
		}

		this.tetrisRate = (tetris.totalTetrisLines / tetris.totalRowClears) * 100 | 0;

		this.dom.game_score.innerText = `${tetris.score}`.padStart(7, '0');
		this.dom.top_score.innerText = `${tetris.topScore}`.padStart(7, '0');
		this.dom.line_total.innerText = `LINES: ${tetris.lineCounter}`;

		fetch('http://localhost:3001/topscore', {
			method: 'get',
			headers: {'Content-Type': 'application/json'},
		})
		.then(res => res.json())
		.then(score => {
			tetris.topScore = score;
		});

		this.updateInGameStatus(tetris, player);
	}
}