export default class DomRef {
	constructor() {
		this.canvas = document.querySelector('.tetris');
		this.canvas_next = document.querySelector('.next');
		this.canvas_stat = document.querySelector('.statistics');

		this.levelNum = document.querySelector('.lvl-num');
		this.levelHeading = document.querySelector('.level-select');

		this.g_o = document.querySelector('.g-o');

		this.pausedGame = document.querySelector('.pause');

		this.recap_head = document.querySelector('.recap');
		this.single_clr = document.querySelector('.single-clr');
		this.double_clr = document.querySelector('.double-clr');
		this.triple_clr = document.querySelector('.triple-clr');
		this.tetris_clr = document.querySelector('.tetris-clr');
		this.tet_rate = document.querySelector('.tet-rate');
		this.d_total = document.querySelector('.d-1');
		this.d_avg = document.querySelector('.d-2');
		this.d_max = document.querySelector('.d-3');

		this.press_start = document.querySelector('.press-start');

		this.gp_connect = document.querySelector('.gp-connect');

		this.game_score = document.querySelector('.score');
		this.top_score = document.querySelector('.top-score')
		this.line_total = document.querySelector('.lines');
		this.current_level = document.querySelector('.level');
		this.current_level_num = document.querySelector('.level-num');
		this.i_drought = document.querySelector('.i-d');
		this.t_rate = document.querySelector('.t-r');
	}
}