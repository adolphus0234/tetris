import Tetris from './js/tetris.js';
import GamePad from './js/controls/GamePad.js';
import KeyBoard from './js/controls/KeyBoard.js';
import MusicBoard from './js/music.js';

// GAME SCREEN AUTO SCALE

const BODY = document.getElementById("_body");
const MAIN_CONT = document.getElementById("main-cont");

let str = getComputedStyle(BODY).height;
let bodyScreenHeight = parseInt(str.substring(0, str.length-2))

if (bodyScreenHeight > 1100) {
	MAIN_CONT.style.transform = "scale(1.4)";
}

// ==============================

const music = new MusicBoard();
const tetris = new Tetris(music);

tetris.run();
tetris.levelSelect();

const game_pad = new GamePad(tetris);
const key_board = new KeyBoard(tetris, document);


//UI BUILDER - TEMP

// function TextBuilder(text) {
// 	let placeText = false;

// 	document.addEventListener('mousemove', event => {
// 	    if (!placeText) {
// 	    	console.clear();

// 	        tetris.gUI.clearScreen();
// 	        text.x = event.offsetX;
// 	        text.y = event.offsetY;
// 	        text.show();
// 	        tetris.gUI.drawStaticGUI();
// 	        tetris.gUI.drawStaticScreen();

// 	        console.log("X", text.x,
// 	                    "Y", text.y,
// 	                    "Size", text.stringFontSize);
// 	    }
// 	});

// 	document.addEventListener('click', event => {
// 		placeText = !placeText;
// 	});

// 	document.addEventListener('keydown', event => {

// 		if (event.code === "KeyS") {
// 			console.clear();
			
// 			tetris.gUI.clearScreen();
// 			text.fontSize += 1;
// 			text.show();
// 			tetris.gUI.drawStaticGUI();
// 			tetris.gUI.drawStaticScreen();

// 			console.log("X", text.x,
// 	                    "Y", text.y,
// 	                    "Size", text.stringFontSize);

// 		}

// 		if (event.code === "KeyA") {
// 			console.clear();
	
// 			tetris.gUI.clearScreen();
// 			text.fontSize -= 1;
// 			text.show();
// 			tetris.gUI.drawStaticGUI();
// 			tetris.gUI.drawStaticScreen();

// 			console.log("X", text.x,
// 	                    "Y", text.y,
// 	                    "Size", text.stringFontSize);
// 		}
// 	});
// }

//  function BoxBuilder(box) {
// 	let placeBox = false;

// 	document.addEventListener('mousemove', event => {
// 	    if (!placeBox) {
// 	    	console.clear();

// 	        tetris.clearScreen();
// 	        box.x = event.offsetX - 28;
// 	        box.y = event.offsetY - 22;
// 	        box.show();
// 	        tetris.drawStaticScreen();
// 	        tetris.drawStaticGUI();

// 	        console.log("X", box.x,
// 	                    "Y", box.y,
// 	                    "Width", box.width * box.scale,
// 	                    "Height", box.height * box.scale);
// 	    }
// 	});

// 	document.addEventListener('click', event => {
// 		placeBox = !placeBox;
// 	});

// 	document.addEventListener('keydown', event => {

// 		if (event.code === "KeyS") {
// 			console.clear();
			
// 			tetris.clearScreen();
// 			box.scale += 0.005;
// 			box.show();
// 			tetris.drawStaticGUI();
// 			tetris.drawStaticScreen();

// 			console.log("X", box.x,
// 	                    "Y", box.y,
// 	                    "Width", box.width * box.scale,
// 	                    "Height", box.height * box.scale);

// 		}

// 		if (event.code === "KeyA") {
// 			console.clear();
	
// 			tetris.clearScreen();
// 			box.scale -= 0.005;
// 			box.show();
// 			tetris.drawStaticGUI();
// 			tetris.drawStaticScreen();

// 			console.log("X", box.x,
// 	                    "Y", box.y,
// 	                    "Width", box.width * box.scale,
// 	                    "Height", box.height * box.scale);
// 		}

// 		if (event.code === "KeyW") {
// 			console.clear();
	
// 			tetris.clearScreen();
// 			box.width += 5;
// 			box.show();
// 			tetris.drawStaticGUI();
// 			tetris.drawStaticScreen();

// 			console.log("X", box.x,
// 	                    "Y", box.y,
// 	                    "Width", box.width * box.scale,
// 	                    "Height", box.height * box.scale);
// 		}

// 		if (event.code === "KeyQ") {
// 			console.clear();
	
// 			tetris.clearScreen();
// 			box.width -= 5;
// 			box.show();
// 			tetris.drawStaticGUI();
// 			tetris.drawStaticScreen();

// 			console.log("X", box.x,
// 	                    "Y", box.y,
// 	                    "Width", box.width * box.scale,
// 	                    "Height", box.height * box.scale);
// 		}

// 		if (event.code === "KeyX") {
// 			console.clear();
	
// 			tetris.clearScreen();
// 			box.height += 5;
// 			box.show();
// 			tetris.drawStaticGUI();
// 			tetris.drawStaticScreen();

// 			console.log("X", box.x,
// 	                    "Y", box.y,
// 	                    "Width", box.width * box.scale,
// 	                    "Height", box.height * box.scale);
// 		}

// 		if (event.code === "KeyZ") {
// 			console.clear();
	
// 			tetris.clearScreen();
// 			box.height -= 5;
// 			box.show();
// 			tetris.drawStaticGUI();
// 			tetris.drawStaticScreen();

// 			console.log("X", box.x,
// 	                    "Y", box.y,
// 	                    "Width", box.width * box.scale,
// 	                    "Height", box.height * box.scale);
// 		}
// 	});
// }


//TextBuilder(tetris.gUI.gp_detect);

//BoxBuilder(tetris.tetrisRateBox);