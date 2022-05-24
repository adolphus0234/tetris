const canvas = document.querySelector('.pop-up');
const context = canvas.getContext('2d');

const session = document.querySelector('.session');
const game_count = document.querySelector('.game-count');
const b_score = document.querySelector('.b-score');
const b_t_rate = document.querySelector('.b-t-rate');
const avg_score = document.querySelector('.avg-score');
const avg_t_rate = document.querySelector('.avg-t-rate');
const avg_lines = document.querySelector('.avg-lines');
const tendencies_1 = document.querySelector('.tendencies_1');

export default class PopUp {
	constructor(tetris) {
		this.tetris = tetris;

		this._canvas = canvas;
		this._context = context;
		this.width = this._canvas.width;
		this.height = this._canvas.height;

		this.x = 50;
		this.y = 50;

		this.open = false;
	}

	currentSession() {
		let bestSession = `${this.tetris.bestSessionScore}`.padStart(7, '0');
		let avgSession = `${this.tetris.avgScore}`.padStart(7, '0');
		let _gameCount = `${this.tetris.player.gameCount}`.padStart(2, '0');
		let bestRate = `${this.tetris.arena.bestTetrisRate}`.padStart(2, '0');
		let avgRate = `${this.tetris.arena.avgTetrisRate}`.padStart(2, '0');
		let avgLinesCleared = `${this.tetris.avgLines}`.padStart(3, '0');

		let that = this;

			setTimeout(function() {
				session.innerText = '~ Current Session ~';

				game_count.innerText = `Games Played:\xa0 \xa0 ${_gameCount}`;
				b_score.innerText = `Best Score: ${bestSession}`;
				b_t_rate.innerText = `Best Tet Rate: \xa0 ${bestRate}%`;
				avg_score.innerText = `Avg Score:\xa0 ${avgSession}`;
				avg_t_rate.innerText = `Avg Tet Rate: \xa0 \xa0${avgRate}%`;
				avg_lines.innerText = `Line Clear Avg: ${avgLinesCleared}`;
				tendencies_1.innerText = 'Board Play: --';
				that.checkTendencies();
			}, 1000);
	}

	draw() {
		this.grow();
		this._context.fillStyle = 'rgb(5, 5, 5)';
		this._context.fillRect(0, 0, this._canvas.width + this.x, this._canvas.height + this.y);
		// this._canvas.style.marginTop = `${(document.documentElement.clientHeight / 2) - this._canvas.height / 2}px`;
		this._canvas.style.marginTop = `${(350) - this._canvas.height / 2}px`;
	}

	grow() {
		this._canvas.width = this.x;
		this._canvas.height = this.y;

		if (this.x < 900) {
			this.x += 15;
		}

		if (this.y < 480) {
			this.y += 7.5;
		}
	}

	checkTendencies() {
		let diff_left_right = this.tetris.arena.playerTendencies[2] - this.tetris.arena.playerTendencies[0];
		let diff_center_sides = this.tetris.arena.playerTendencies[1] - ((this.tetris.arena.playerTendencies[0] + this.tetris.arena.playerTendencies[2]) / 2);

		if (diff_left_right <= -5 && diff_left_right > -10) {
			tendencies_1.innerText = 'Board Play: Slight Left Bias';
		}

		if (diff_left_right <= -10) {
			tendencies_1.innerText = 'Board Play: Left Dominant';
		}

		if (diff_left_right >= 5 && diff_left_right < 10) {
			tendencies_1.innerText = 'Board Play: Slight Right Bias';
		}

		if (diff_left_right >= 10) {
			tendencies_1.innerText = 'Board Play: Right Dominant';
		}

		if (diff_left_right > -5 && diff_left_right < 5 
			&& diff_center_sides > -10 && diff_center_sides < 10) {
			tendencies_1.innerText = 'Board Play: Balanced';
		}

		if (diff_center_sides >= 10 && diff_center_sides < 20) {
			tendencies_1.innerText = 'Board Play: Slight Center Bias';
		}

		if (diff_center_sides >= 20) {
			tendencies_1.innerText = 'Board Play: Center Piling';
		}
	}

	update() {
		if (this.open === true) {
			this.draw();
			this.currentSession();
			this._canvas.style.visibility = 'visible';
		} else if (this.open === false) {
			session.innerText = '';
			game_count.innerText = '';
			b_score.innerText = '';
			b_t_rate.innerText = '';
			avg_score.innerText = '';
			avg_t_rate.innerText = '';
			avg_lines.innerText = '';
			tendencies_1.innerText = '';

			this.x = 50;
			this.y = 50;
			this._canvas.style.visibility = 'hidden';
		}

		if (this.tetris.paused === false) {
			this.open = false;
		}
	}
}