import Tetris from './tetris.js';
import GamePad2 from './gamePad2.js';
import KeyBoard from './keyBoard.js';
import MusicBoard from './music.js';

const music = new MusicBoard();
const tetris = new Tetris(music);

tetris.run();
tetris.levelSelect();

const game_pad2 = new GamePad2(tetris);
const key_board = new KeyBoard(tetris);

//KeyBoard Events Listeners---------------------

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
	game_pad2.gamepadAPI(event);
});

window.addEventListener("gamepadconnected", event => {
  if (event.gamepad.connected === true) {
  	tetris.gamePadConnected = true;
  	tetris.gpDetect();
  }
});

window.addEventListener("gamepaddisconnected", event => {
  if (event.gamepad.connected === false) {
  	tetris.gamePadConnected = false;
    cancelAnimationFrame(game_pad2._gameLoop);
  	tetris.gpDetect();
  }
});











//UI BUILDER - TEMP

function TextBuilder(text) {
	let placeText = false;

	document.addEventListener('mousemove', event => {
	    if (!placeText) {
	    	console.clear();

	        tetris.gUI.clearScreen();
	        text.x = event.offsetX;
	        text.y = event.offsetY;
	        text.show();
	        tetris.gUI.drawStaticGUI();
	        tetris.gUI.drawStaticScreen();

	        console.log("X", text.x,
	                    "Y", text.y,
	                    "Size", text.stringFontSize);
	    }
	});

	document.addEventListener('click', event => {
		placeText = !placeText;
	});

	document.addEventListener('keydown', event => {

		if (event.code === "KeyS") {
			console.clear();
			
			tetris.gUI.clearScreen();
			text.fontSize += 1;
			text.show();
			tetris.gUI.drawStaticGUI();
			tetris.gUI.drawStaticScreen();

			console.log("X", text.x,
	                    "Y", text.y,
	                    "Size", text.stringFontSize);

		}

		if (event.code === "KeyA") {
			console.clear();
	
			tetris.gUI.clearScreen();
			text.fontSize -= 1;
			text.show();
			tetris.gUI.drawStaticGUI();
			tetris.gUI.drawStaticScreen();

			console.log("X", text.x,
	                    "Y", text.y,
	                    "Size", text.stringFontSize);
		}
	});
}

 function BoxBuilder(box) {
	let placeBox = false;

	document.addEventListener('mousemove', event => {
	    if (!placeBox) {
	    	console.clear();

	        tetris.clearScreen();
	        box.x = event.offsetX - 28;
	        box.y = event.offsetY - 22;
	        box.show();
	        tetris.drawStaticScreen();
	        tetris.drawStaticGUI();

	        console.log("X", box.x,
	                    "Y", box.y,
	                    "Width", box.width * box.scale,
	                    "Height", box.height * box.scale);
	    }
	});

	document.addEventListener('click', event => {
		placeBox = !placeBox;
	});

	document.addEventListener('keydown', event => {

		if (event.code === "KeyS") {
			console.clear();
			
			tetris.clearScreen();
			box.scale += 0.005;
			box.show();
			tetris.drawStaticGUI();
			tetris.drawStaticScreen();

			console.log("X", box.x,
	                    "Y", box.y,
	                    "Width", box.width * box.scale,
	                    "Height", box.height * box.scale);

		}

		if (event.code === "KeyA") {
			console.clear();
	
			tetris.clearScreen();
			box.scale -= 0.005;
			box.show();
			tetris.drawStaticGUI();
			tetris.drawStaticScreen();

			console.log("X", box.x,
	                    "Y", box.y,
	                    "Width", box.width * box.scale,
	                    "Height", box.height * box.scale);
		}

		if (event.code === "KeyW") {
			console.clear();
	
			tetris.clearScreen();
			box.width += 5;
			box.show();
			tetris.drawStaticGUI();
			tetris.drawStaticScreen();

			console.log("X", box.x,
	                    "Y", box.y,
	                    "Width", box.width * box.scale,
	                    "Height", box.height * box.scale);
		}

		if (event.code === "KeyQ") {
			console.clear();
	
			tetris.clearScreen();
			box.width -= 5;
			box.show();
			tetris.drawStaticGUI();
			tetris.drawStaticScreen();

			console.log("X", box.x,
	                    "Y", box.y,
	                    "Width", box.width * box.scale,
	                    "Height", box.height * box.scale);
		}

		if (event.code === "KeyX") {
			console.clear();
	
			tetris.clearScreen();
			box.height += 5;
			box.show();
			tetris.drawStaticGUI();
			tetris.drawStaticScreen();

			console.log("X", box.x,
	                    "Y", box.y,
	                    "Width", box.width * box.scale,
	                    "Height", box.height * box.scale);
		}

		if (event.code === "KeyZ") {
			console.clear();
	
			tetris.clearScreen();
			box.height -= 5;
			box.show();
			tetris.drawStaticGUI();
			tetris.drawStaticScreen();

			console.log("X", box.x,
	                    "Y", box.y,
	                    "Width", box.width * box.scale,
	                    "Height", box.height * box.scale);
		}
	});
}


//TextBuilder(tetris.gUI.gp_detect);

//BoxBuilder(tetris.tetrisRateBox);