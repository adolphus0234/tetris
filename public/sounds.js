const levelUpAlert = new Audio('./SFX/next_level.mp3');
const select_pause = new Audio('./SFX/select_sound.mp3');
const pieceDrop = new Audio('./SFX/tetris_drop.mp3');
const pieceMove = new Audio('./SFX/tetris_pc_move.mp3');
const pieceRotate = new Audio('./SFX/tetris_pc_rotate.mp3');
const rowClear = new Audio('./SFX/row_clear.wav');
const rowTetris = new Audio('./SFX/tetris_clear.mp3');
const selectLevel = new Audio('./SFX/tetris_select.mp3');
const topOut = new Audio('./SFX/top_out.mp3');

export default class SoundBoard {
	constructor() {

	}

	playLevelUpAlert() {
		levelUpAlert.play();
	}

	playSelectPause() {
		select_pause.play();
		setTimeout(function() {trimAudio(select_pause)}, 200);
	}

	playPieceDrop() {
		pieceDrop.play();
		setTimeout(function() {trimAudio(pieceDrop)}, 100);
	}

	playPieceMove() {
		pieceMove.play();
		setTimeout(function() {trimAudio(pieceMove)}, 100);
	}

	playPieceRotate() {
		pieceRotate.play();
		setTimeout(function() {trimAudio(pieceRotate)}, 100);
	}

	playRowClear() {
		rowClear.play();
	}

	playRowTetris() {
		rowTetris.play();
	}

	playSelectLevel() {
		selectLevel.play();
		setTimeout(function() {trimAudio(selectLevel)}, 100);
	}

	playTopOut() {
		topOut.play();
	}
}

function trimAudio(audio) {
	audio.pause();
	audio.currentTime = 0;
}