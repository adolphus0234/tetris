//Constants------------------

const pieces = 'ILJOTSZ';

//Global Variables-------------

let x = 4;
let o = 1.5;
let y = 0;

let type_next_2;

let firstMove = true;
let secondMove = false;

let gridCount = 0;
let delay = 400;

export default class Player {
	constructor(tetris, canvas_n, canvas_s, sound_board) {

		this.type = pieces[pieces.length * Math.random() | 0];
		this.type_next = pieces[pieces.length * Math.random() | 0];
		this.cur_type = this.type;

		//Initial Offsets-------------------------------

		if (this.type === "O" || this.type === "I") {
			x = 3;
		} else {
			x = 4;
		}

		if (this.type_next === "O" || this.type_next === "I") {
			o = 2;
		} else {
			o = 1.5;
		}

		//----------------------------------------------

		this.canvas_next = canvas_n;
		this.context_next = this.canvas_next.getContext('2d');
		this.width_n = this.canvas_next.width;

		this.canvas_stat = canvas_s;
		this.context_stat = this.canvas_stat.getContext('2d');

		this.tetris = tetris;
		this.arena = tetris.arena;
		
		this.pos = {x: x, y: y};
		this.matrix = this.createPiece(this.type);

		this.nextPiece;
		this.upNext = {
			pos: {x: (this.width_n / 2) / 30 - o , y: 2},
			matrix: this.createPiece(this.type_next),
		}

		this.sounds = sound_board;

		this.statCounts = [0, 0, 0, 0, 0, 0, 0];

		this.countT = 0;
		this.countJ = 0;
		this.countZ = 0;
		this.countO = 0;
		this.countS = 0;
		this.countL = 0;
		this.countI = 0;

		this.gameCount = 0;

		this.droughtCount = 0;
		this._droughtCount = 0;
		this.totalDroughts = 0; 
		this.avgDrought = 0; 
		this.maxDrought = 0; 

		this.droughtArray = [];

		this.dD = false;
		this.i_stat = true;
	}

	calcFinalStats(deltaTime) {
		if (this.tetris.endGame === true) {
			if (this.droughtArray.length > 0) {
				const num = this.droughtArray.reduce((a, b) => a + b, 0);
				this.avgDrought = Number((num / this.droughtArray.length).toFixed(1));
			}
		}
	}

	createPiece(type) {
		if (type === "T") {
			return [
				[0, 0, 0],
				[1, 1, 1],
				[0, 1, 0],
			];
		} else if (type === 'O') {
			return [
				[0, 0, 0, 0],
				[0, 2, 2, 0],
				[0, 2, 2, 0],
				[0, 0, 0, 0],
			];
		} else if (type === 'J') {
			return [
				[0, 0, 0],
				[3, 3, 3],
				[0, 0, 3],
			];
		} else if (type === 'L') {
			return [
				[0, 0, 0],
				[4, 4, 4],
				[4, 0, 0],
			];
		} else if (type === 'I') {
			return [
				[0, 0, 0, 0],
				[5, 5, 5, 5],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
			];
		} else if (type === 'S') {
			return [
				[0, 0, 0],
				[0, 6, 6],
				[6, 6, 0],
			];
		} else if (type === 'Z') {
			return [
				[0, 0, 0],
				[7, 7, 0],
				[0, 7, 7],
			];
		}
	}

	drawStatBoard(tetris) {
		tetris.drawMatrix(this.createPiece('T'), {x: 2, y:3}, this.context_stat);
		tetris.drawMatrix(this.createPiece('J'), {x: 2, y:6}, this.context_stat);
		tetris.drawMatrix(this.createPiece('Z'), {x: 2, y:9}, this.context_stat);
		tetris.drawMatrix(this.createPiece('O'), {x: 2, y:12}, this.context_stat);
		tetris.drawMatrix(this.createPiece('S'), {x: 2, y:15}, this.context_stat);
		tetris.drawMatrix(this.createPiece('L'), {x: 2, y:18}, this.context_stat);
		tetris.drawMatrix(this.createPiece('I'), {x: 2, y:22}, this.context_stat);

		this.context_stat.fillStyle = 'red';
		this.context_stat.font = '2px Georgia';
		this.context_stat.fillText(`${this.countT}`.padStart(3, '0'), 7, 6);
		this.context_stat.fillText(`${this.countJ}`.padStart(3, '0'), 7, 9);
		this.context_stat.fillText(`${this.countZ}`.padStart(3, '0'), 7, 12);
		this.context_stat.fillText(`${this.countO}`.padStart(3, '0'), 7, 15);
		this.context_stat.fillText(`${this.countS}`.padStart(3, '0'), 7, 18);
		this.context_stat.fillText(`${this.countL}`.padStart(3, '0'), 7, 21);
		this.context_stat.fillText(`${this.countI}`.padStart(3, '0'), 7, 24);
	}

	drop(tetris, arena) {
		let that = this;
		
		function delayedSweep() {
			setTimeout(function() {
				arena.sweep(tetris);
			}, delay);
		}

		function dropDelay() {
			if (arena.rC === true) {
				setTimeout(function() {
					that.dD = false;
					that.reset(arena, arena.matrix, tetris);
				}, 400);
			} else {
				setTimeout(function() {
					that.dD = false;
					that.reset(arena, arena.matrix, tetris);
				}, 150);
			}
		}

		this.pos.y++;
		if (arena.collide(this)) {
			this.dD = true;
			this.pos.y--;
			arena.merge(this);
			this.sounds.playPieceDrop();
			arena.rowClearState(tetris);
			dropDelay();
			delayedSweep();
			// this.reset(arena, arena.matrix, tetris);
			gridCount = 0;
		}
		tetris.dropCounter = 0;
	}

	dropDown() {
		this.drop(this.tetris, this.arena);
		gridCount = gridCount + 1;
		if (gridCount === 2) {
			this.tetris.score = this.tetris.score + 1;
			gridCount = 0;
		}
	}

	firstMoveCond_1(_type) {
		if (firstMove === true) {
			type_next_2 = _type;
		}
	}

	firstMoveCond_2 (_type) {
		if (!firstMove) {
			this.type_next = _type;
		} else {
			this.type_next = type_next_2;
		}

		firstMove = false;
	}

	move(dir, arena) {
		this.pos.x += dir;

		if (this.arena.collide(this)) {
			this.pos.x -= dir;
		}
	}

	moveLeft() {
		this.move(-1, this.arena);
		this.sounds.playPieceMove();
	}

	moveRight() {
		this.move(1, this.arena);
		this.sounds.playPieceMove();
	}

	reset(arena, ar_matrix, tetris) {
		
		let _type = pieces[pieces.length * Math.random() | 0];

		this.firstMoveCond_1(_type);

		this.matrix = this.nextPiece;
		this.pos.y = y;
		this.pos.x = (ar_matrix[0].length / 2 | 0)	
							- (this.matrix[0].length / 2 | 0);

		if (_type === "O" || _type === "I") {
			this.upNext.pos.x = 1;
		} else {
			this.upNext.pos.x = 1.5;
		}

		//firstMove conditons apply------------	

		this.updateStatistics();
		this.updateDroughtCount();

		//------------------------------------
		
		this.upNext.matrix = this.createPiece(_type);

		this.firstMoveCond_2(_type);

		this.topOutCheck(tetris);
	}

	rotate(dir, arena) {
		let offset = 1;
		const pos = this.pos.x
		this._rotateMatrix(this.matrix, dir);

		while (this.arena.collide(this)) {
			this.pos.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));

			if (offset > this.matrix[0].length) {
				this._rotateMatrix(this.matrix, -dir);
				this.pos.x = pos;
				return;
			}
		}
	}

	_rotateMatrix(matrix, dir) {
		for (let y = 0; y < this.matrix.length; y++) {
			for (let x = 0; x < y; x++) {
				[
					this.matrix[x][y],
					this.matrix[y][x],
				] = [
					this.matrix[y][x],
					this.matrix[x][y],
				];
			}
		}

		if (dir > 0) {
			this.matrix.forEach(row => row.reverse());
		} else {
			this.matrix.reverse();
		}
	}

	rotateLeft() {
		this.rotate(-1, this.arena);
		this.sounds.playPieceRotate();
	}

	rotateRight() {
		this.rotate(1, this.arena);
		this.sounds.playPieceRotate();
	}

	statCounter() {
		this.countT = this.statCounts[0];
		this.countJ = this.statCounts[1];
		this.countZ = this.statCounts[2];
		this.countO = this.statCounts[3];
		this.countS = this.statCounts[4];
		this.countL = this.statCounts[5];
		this.countI = this.statCounts[6];

		if (this.i_stat === true &&
			this.droughtCount < 1) {
			if (this.cur_type !== 'I') {
				this.droughtCount = this.droughtCount + 1
			} else if (this.cur_type === 'I') {
				this.droughtCount = 0;
			} 
			this.i_stat = false;
		}
	}

	y_pos() {
		this.pos.y = 0;
		let that = this;
		setTimeout(function() {
			that.update = function() {
				this.nextPiece = this.upNext.matrix;
				this.statCounter();
			}
		}, 100);
	}

	topOutCheck(tetris) {
		if (this.arena.collide(this)) {
			this.sounds.playTopOut();
			this.arena.clear();

			if (tetris.score > tetris.topScore) {
				fetch('http://localhost:3001/new-topscore', {
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						score: tetris.score
					})
				});
			}

			this.updateSessionStats(tetris);

			tetris.endGame = true;

			tetris.lineCounter = 0;
			tetris.levelUpCounter = 0;
			tetris.dropCounter = 0;
			tetris.dropInterval = tetris.levelSpeed(48);

			this.droughtCount = 0;
			this._droughtCount = 0;
			tetris.player.i_stat = true;

			setTimeout(function() {
				tetris.endGame = false;
				tetris.finalStats = true;
				tetris.gameStart = false;
			}, 5000);

			this.update = function() {
				this.nextPiece = this.upNext.matrix;
				this.statCounter();
				this.y_pos();
			}
		}
	}

	updateDroughtCount() {
		this.cur_type = this.type_next;

		if (this.cur_type !== 'I') {
			this.droughtCount = this.droughtCount + 1;
			this._droughtCount = this._droughtCount + 1;
		} else if (this.cur_type === 'I') {
			if (this.droughtCount > 13) {
				this.droughtArray.push(this.droughtCount);
			}
			this.droughtCount = 0;
			this._droughtCount = 0;
		}

		if (this.droughtCount > this.maxDrought &&
			this.droughtCount > 13) {
			this.maxDrought = this.droughtCount;
		}
	}

	updateStatistics() {
		if (this.cur_type === 'T') {
			this.statCounts[0] = this.statCounts[0] + 1;
		} else if (this.cur_type === 'J') {
			this.statCounts[1] = this.statCounts[1] + 1;
		} else if (this.cur_type === 'Z') {
			this.statCounts[2] = this.statCounts[2] + 1;
		} else if (this.cur_type === 'O') {
			this.statCounts[3] = this.statCounts[3] + 1;
		} else if (this.cur_type === 'S') {
			this.statCounts[4] = this.statCounts[4] + 1;
		} else if (this.cur_type === 'L') {
			this.statCounts[5] = this.statCounts[5] + 1;
		} else if (this.cur_type === 'I') {
			this.statCounts[6] = this.statCounts[6] + 1;
		}
	}

	updateSessionStats(tetris) {
			if (tetris.score > tetris.bestSessionScore) {
				tetris.bestSessionScore = tetris.score;
			}

			if (this.arena.tetrisRate > this.arena.bestTetrisRate &&
				tetris.lineCounter >= 10) {
				this.arena.bestTetrisRate = this.arena.tetrisRate;
			}

			//Calculate Score Average------------------------

			tetris.scoreArray.push(tetris.score);

			if (tetris.scoreArray.length > 0) {
				const num = tetris.scoreArray.reduce((a, b) => a + b, 0);
				tetris.avgScore = Number((num / tetris.scoreArray.length).toFixed(0));
			}

			//Calculate Tetris Rate Average------------------

			if (tetris.lineCounter >= 10) {
				this.arena.tetRateArray.push(this.arena.tetrisRate);

			}
			if (this.arena.tetRateArray.length > 0) {
				const num = this.arena.tetRateArray.reduce((a, b) => a + b, 0);
				this.arena.avgTetrisRate = Number((num / this.arena.tetRateArray.length).toFixed(1));
			}

			//Calculate Line Clear Average------------------

			tetris.lineArray.push(tetris.lineCounter);

			if (tetris.lineArray.length > 0) {
				const num = tetris.lineArray.reduce((a, b) => a + b, 0);
				tetris.avgLines = Number((num / tetris.lineArray.length).toFixed(0));
			}

			//----------------------------------------------

			this.gameCount = this.gameCount + 1;	
	}

	update(deltaTime) {
		this.nextPiece = this.upNext.matrix;
		this.statCounter();
		this.y_pos();
	}
}