import Tetris from './tetris.js';
import GamePad from './gamePad.js';
import KeyBoard from './keyBoard.js';
import PopUp from './popupWindow.js';
import MusicBoard from './music.js';

const music = new MusicBoard();
const tetris = new Tetris(music);
const pop_up = new PopUp(tetris);
const game_pad = new GamePad(tetris, pop_up);
const key_board = new KeyBoard(tetris);

//KeyBoard Events Listeners---------------------

document.addEventListener('click', event => {
	console.log(event)
	tetris.arena.curtainDrop(1);
})

document.addEventListener('keydown', event => {
	key_board.startGame(event);
});
document.addEventListener('keydown', event => {
	key_board.tetrisControls(event);
});
document.addEventListener('keydown', event => {
	key_board.pause(event);
});
document.addEventListener('keydown', event => {
	key_board.resetGame(event);
});
document.addEventListener('keydown', event => {
	key_board.toggleFullscreen(event);
});

//GamePad Event Listeners----------------------

window.addEventListener("gamepadconnected", event => {
	game_pad.gamepadMove(event);
});
window.addEventListener("gamepadconnected", event => {
	game_pad.gamepadDrop(event);
});
window.addEventListener("gamepadconnected", event => {
	game_pad.gamepadRotate(event);
});
window.addEventListener("gamepadconnected", event => {
	game_pad.gamepadPause(event);
});
window.addEventListener("gamepadconnected", event => {
	game_pad.toggleFullscreen(event);
});
window.addEventListener("gamepadconnected", event => {
	game_pad.togglePopUp(event);
});

window.addEventListener("gamepadconnected", event => {
	// console.log(event.gamepad)
  if (event.gamepad.connected === true) {
  	tetris.gamePadConnected = true;
  	tetris.gpDetect();
  }
});

window.addEventListener("gamepaddisconnected", event => {
  if (event.gamepad.connected === false) {
  	tetris.gamePadConnected = false;
  	tetris.gpDetect();
  }
});