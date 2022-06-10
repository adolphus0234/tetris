let firstMove = true;
let secondMove = false;

export default class Player {
	constructor(tetris, gui, sound_board) {
		
		//OBJECTS

		this.tetris = tetris;
		this.arena = tetris.arena;
		this.sounds = sound_board;

		this.gUI = gui;

		//VARIABLES----------------------------

		this.pieces = 'ILJOTSZ';

		this.type = this.pieces[this.pieces.length * Math.random() | 0];
		this.type_next = this.pieces[this.pieces.length * Math.random() | 0];
		this.cur_type = this.type;
		this.type_next_2;

		this.gridCount = 0;

		//PLAYER/NEXT PIECES-------------------------
		
		this.matrix = this.createPiece(this.type);
		this.pos = {x: (this.arena.matrix[0].length / 2 | 0) 
					    - (this.matrix[0].length / 2 | 0), y: 0};

		this.nextPiece;
		this.upNext = {
			matrix: this.createPiece(this.type_next),
		}

		//STAT VARIABLES-------------------------------

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

		//RENAME vvv

		this.dD = false;
		this.i_stat = true;
	}

	calcFinalStats() {
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

	drop() {
		let that = this;
		
		function delayedSweep() {
			setTimeout(function() {
				that.arena.sweep(that.tetris);
			}, 400);
		}

		function dropDelay() {
			if (that.arena.rowClear === true) {
				setTimeout(function() {
					that.dD = false;
					that.reset();
				}, 400);
			} else {
				setTimeout(function() {
					that.dD = false;
					that.reset();
				}, 150);
			}
		}

		this.pos.y++;

		if (this.arena.collide(this)) {
			if (this.dD === false) {
				
				this.pos.y--;
				this.arena.merge(this);
				this.sounds.playPieceDrop();
				this.arena.rowClearState(this.tetris);
				dropDelay();
				delayedSweep();
				this.gridCount = 0;	
				this.dD = true;
			}	
		}
		this.tetris.dropCounter = 0;	
	}

	dropDown() {
		this.drop();

		this.gridCount = this.gridCount + 1;

		if (this.gridCount === 2) {
			this.tetris.score = this.tetris.score + 1;
			this.tetris.tetrisScore();
			this.gridCount = 0;
		}
	}

	dropDownScoreOnly() {
		this.gridCount = this.gridCount + 1;

		if (this.gridCount === 2) {
			this.tetris.score = this.tetris.score + 1;
			this.tetris.tetrisScore();
			this.gridCount = 0;
		}
	}

	firstMoveCond_1(_type) {
		if (firstMove === true) {
			this.type_next_2 = _type;
		}
	}

	firstMoveCond_2 (_type) {
		if (!firstMove) {
			this.type_next = _type;
		} else {
			this.type_next = this.type_next_2;
		}

		firstMove = false;
	}

	move(dir) {
		this.pos.x += dir;

		if (this.arena.collide(this)) {
			this.pos.x -= dir;
		}
	}

	moveLeft() {
		this.move(-1);
		if (!this.dD) {
			this.sounds.playPieceMove();
		}		
	}

	moveRight() {
		this.move(1);
		if (!this.dD) {
			this.sounds.playPieceMove();
		}
	}

	reset() {	
		let _type = this.pieces[this.pieces.length * Math.random() | 0];

		this.firstMoveCond_1(_type);

		this.matrix = this.nextPiece;
		this.pos.y = 0;
		this.pos.x = (this.arena.matrix[0].length / 2 | 0)	
							- (this.matrix[0].length / 2 | 0);

		//firstMove conditons apply------------	

		this.updateStatistics();
		this.updateDroughtCount();

		if (this._droughtCount === 14) {
			this.totalDroughts = this.totalDroughts + 1;
		}

		//------------------------------------
		
		this.upNext.matrix = this.createPiece(_type);

		this.firstMoveCond_2(_type);

		this.topOutCheck(this.tetris, this.arena);

		let that = this;

		setTimeout(function() {
			that.gUI.drawStaticGUI();
		}, 30);	
	}

	rotate(dir) {
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
		this.rotate(-1);
		this.sounds.playPieceRotate();
	}

	rotateRight() {
		this.rotate(1);
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

		if (this.i_stat === true && this.droughtCount < 1) {

			if (this.cur_type !== 'I') {
				this.droughtCount = this.droughtCount + 1;

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

	topOutCheck(tetris, arena) {
		if (arena.collide(this)) {
			this.sounds.playTopOut();
			arena.clear();

			if (tetris.score > tetris.topScore) {
				localStorage.clear();
				localStorage.setItem('tetrisTopScore', JSON.stringify(tetris.score));
				// fetch('http://localhost:3001/new-topscore', {
				// 	method: 'put',
				// 	headers: {'Content-Type': 'application/json'},
				// 	body: JSON.stringify({
				// 		score: tetris.score
				// 	})
				// });
				tetris.topScore = tetris.score;
			}

			this.updateSessionStats(tetris, arena);

			tetris.endGame = true;
			this.calcFinalStats();
			tetris.levelSelect();

			tetris.lineCounter = 0;
			tetris.levelUpCounter = 0;
			tetris.dropCounter = 0;
			tetris.dropInterval = tetris.levelSpeed(47);

			this.droughtCount = 0;
			this._droughtCount = 0;
			tetris.player.i_stat = true;

			setTimeout(function() {
				tetris.endGame = false;
				tetris.gameOver();
				tetris.finalStats = true;
				tetris.gameRecap();
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

	updateSessionStats(tetris, arena) {
			if (tetris.score > tetris.bestSessionScore) {
				tetris.bestSessionScore = tetris.score;
			}

			if (arena.tetrisRate > arena.bestTetrisRate &&
				tetris.lineCounter >= 10) {
				arena.bestTetrisRate = arena.tetrisRate;
			}

			//Calculate Score Average------------------------

			tetris.scoreArray.push(tetris.score);

			if (tetris.scoreArray.length > 0) {
				const num = tetris.scoreArray.reduce((a, b) => a + b, 0);
				tetris.avgScore = Number((num / tetris.scoreArray.length).toFixed(0));
			}

			//Calculate Tetris Rate Average------------------

			if (tetris.lineCounter >= 10) {
				arena.tetRateArray.push(arena.tetrisRate);

			}

			if (arena.tetRateArray.length > 0) {
				const num = arena.tetRateArray.reduce((a, b) => a + b, 0);
				arena.avgTetrisRate = Number((num / arena.tetRateArray.length).toFixed(1));
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