import Text from './components/Text.js';
import Box from './components/Box.js';
import { animRgb } from './animation.js';

export default class GUI {
	constructor(tetris) {
		this.tetris = tetris;

		this.canvas_g1 =  document.querySelector(".gui_1");
		this.context_g1 = this.canvas_g1.getContext("2d");

		this.canvas_g2 =  document.querySelector(".gui_2");
		this.context_g2 = this.canvas_g2.getContext("2d");

		//DRAW SCREEN - STATIC
			
		this.selectLevelText = new Text("SELECT LEVEL:", 10, 300, 
									    "white", 32, this.context_g1);

		this.leftArrow = new Text("<", 60, 355, "white", 36, this.context_g1);		
		this.rightArrow = new Text(">", 260, 355, "white", 36, this.context_g1);

		this.gameControlsText_1 = new Text("Choose Level: ◀/▶", 
							55, 600, "rgb(212, 252, 250)", 18, this.context_g1);
		this.gameControlsText_2 = new Text("PRESS SPACE to Start", 
							30, 630, "rgb(212, 252, 250)", 18, this.context_g1);


		this.pausedText = new Text("PAUSED", 77, 326, 
								   "white", 40, this.context_g1);

		this.gameOverText = new Text("", 44, 350, 
								   "white", 40, this.context_g1);


		this.controlsHeading = new Text("CONTROLS", 60, 53, 
								   "white", 36, this.context_g1);
		this.controlsLine_1 = new Text("Rotate: Q/W", 30, 170, 
								   "rgb(212, 252, 250)", 24, this.context_g1);
		this.controlsLine_2 = new Text("Left/Right:◀/▶", 30, 220, 
								   "rgb(212, 252, 250)", 24, this.context_g1);
		this.controlsLine_3 = new Text("Drop: ▼", 30, 270, 
								   "rgb(212, 252, 250)", 24, this.context_g1);
		this.controlsLine_4 = new Text("Pause: Space", 30, 320, 
								   "rgb(212, 252, 250)", 24, this.context_g1);
		this.controlsLine_5 = new Text("Reset: Spc+Shft", 30, 370, 
								   "rgb(212, 252, 250)", 24, this.context_g1);
		this.controlsLine_6 = new Text("Compatible with Xbox", 30, 470, 
								   "rgb(212, 252, 250)", 18, this.context_g1);
		this.controlsLine_7 = new Text("360 Controller.", 30, 500, 
								   "rgb(212, 252, 250)", 18, this.context_g1);
		this.controlsLine_8 = new Text("PRESS SPACE", 66, 620, 
								   "rgb(212, 252, 250)", 24, this.context_g1);


		this.recapHeading = new Text("", 94, 53, 
								   "white", 24, this.context_g1);
		this.recapLine_1 = new Text("", 45, 120, 
								   "rgb(212, 252, 250)", 32, this.context_g1);
		this.recapLine_2 = new Text("", 45, 170, 
								   "rgb(212, 252, 250)", 32, this.context_g1);
		this.recapLine_3 = new Text("", 45, 220, 
								   "rgb(212, 252, 250)", 32, this.context_g1);
		this.recapLine_4 = new Text("", 45, 270, 
								   "rgb(212, 252, 250)", 32, this.context_g1);
		this.recapLine_5 = new Text("", 45, 320, 
								   "rgb(212, 252, 250)", 32, this.context_g1);
		this.recapLine_6 = new Text("", 45, 370, 
								   "rgb(212, 252, 250)", 32, this.context_g1);
		this.recapLine_7 = new Text("", 45, 420, 
								   "rgb(212, 252, 250)", 32, this.context_g1);
		this.recapLine_8 = new Text("", 45, 470, 
								   "rgb(212, 252, 250)", 32, this.context_g1);
		this.press_space = new Text("", 54, 578, 
								   "white", 27, this.context_g1);

		this.gp_detect = new Text("", 45, 670, 
								  "white", 26, this.context_g1);
		this.gp_detect.font = "Arcade";

		//DRAW GUI - STATIC

		this.topScoreBox = new Box(783, 3, 295, 85, this.context_g2, 6);
		this.topScoreLabel = new Text("TOP:", 794, 14, "white", 30, this.context_g2);
		this.topScoreText = new Text("0000000", 794, 48, "white", 30, this.context_g2);

		this.scoreBox = new Box(783, 115, 295, 85, this.context_g2, 6);
		this.scoreLabel = new Text("SCORE:", 794, 126, "white", 30, this.context_g2);
		this.scoreText = new Text("0000000", 794, 160, "white", 30, this.context_g2);

		this.lineCountBox = new Box(783, 226, 295, 70, this.context_g2, 6);
		this.lineCountLabel = new Text("LINES: 0", 794, 249, "white", 32, this.context_g2);

		this.nextPieceBox = new Box(783, 340, 190, 190, this.context_g2, 8);
		this.nextPieceLabel = new Text("NEXT", 811, 355, "white", 66, this.context_g2, 
									   "Arcade", "url(./fonts/arcade_classic.ttf)");
		// this.nextPieceLabel.font = "Arcade";

		this.levelBox = new Box(783, 546, 190, 85, this.context_g2, 6);
		this.levelLabel = new Text("LEVEL:", 794, 557, "white", 30, this.context_g2);
		this.levelText = new Text("--", 853, 591, "white", 30, this.context_g2);

		this.statsBox = new Box(50, 3, 282, 515, this.context_g2, 8);
		this.statsLabel = new Text("STATISTICS", 62, 23, "white", 32, this.context_g2);

		this.tetrisRateBox = new Box(50, 532, 282, 65, this.context_g2, 6);
		this.tetrisRateLabel = new Text("TET RATE: 0%", 58, 553, "red", 23, this.context_g2);

		this.droughtBox = new Box(50, 611, 282, 65, this.context_g2, 6);
		this.droughtLabel = new Text("′I′ DROUGHT: 0", 58, 632, "green", 23, this.context_g2);

		//DRAW GUI - ANIMATED

	}

	clearGUI() {
		this.context_g2.clearRect(0, 0, this.canvas_g2.width, this.canvas_g2.height);
	}

	clearScreen() {
		if (this.tetris.startScreen) {
			this.context_g1.clearRect(0, 0, this.canvas_g1.width, this.canvas_g1.height - 50);
		} else {
			this.context_g1.clearRect(0, 0, this.canvas_g1.width, this.canvas_g1.height);
		}
		
	}

	drawStaticGUI() {
		this.clearGUI();

		this.context_g2.fillStyle = 'rgb(30, 30, 30)';
		this.context_g2.fillRect(0, 0, 395, this.canvas_g2.height);
		this.context_g2.fillRect(this.canvas_g2.width - 395, 0, 
								 395, this.canvas_g2.height);

		this.topScoreBox.show();
		this.topScoreLabel.show();
		this.topScoreText.show();

		this.scoreBox.show();
		this.scoreLabel.show();
		this.scoreText.show();

		this.lineCountBox.show();
		this.lineCountLabel.show();

		this.nextPieceBox.show();
		this.nextPieceLabel.show();

		//NEXT PIECE BOX
		
		if (!this.tetris.paused && !this.tetris.startScreen
		&&  !this.tetris.endGame && !this.tetris.finalStats) {

			if (!this.tetris.hideNextBox) {

				this.tetris.drawMatrix(this.tetris.player.upNext.matrix, 
							   		   {x: 817, y: 405}, 30, this.context_g2);
			}		
		}

		this.levelBox.show();
		this.levelLabel.show();
		this.levelText.show();

		this.statsBox.show();
		this.statsLabel.show();

		//STATISTICS

		if (!this.tetris.paused && !this.tetris.startScreen
		&&  !this.tetris.endGame && !this.tetris.finalStats) {
			this.drawStatBoard();
		}
		
		this.tetrisRateBox.show();
		this.tetrisRateLabel.show();

		this.droughtBox.show();
		
		if (this.tetris.player.droughtCount < 14) {
			this.droughtLabel.color = "green";
		}
		
		this.droughtLabel.show();
	}

	drawStatBoard() {
		const player = this.tetris.player;

		this.tetris.drawMatrix(player.createPiece('T'), {x: 75, y:60}, 20, this.context_g2);
		this.tetris.drawMatrix(player.createPiece('J'), {x: 75, y:120}, 20, this.context_g2);
		this.tetris.drawMatrix(player.createPiece('Z'), {x: 75, y:180}, 20, this.context_g2);
		this.tetris.drawMatrix(player.createPiece('O'), {x: 75, y:240}, 20, this.context_g2);
		this.tetris.drawMatrix(player.createPiece('S'), {x: 75, y:300}, 20, this.context_g2);
		this.tetris.drawMatrix(player.createPiece('L'), {x: 75, y:360}, 20, this.context_g2);
		this.tetris.drawMatrix(player.createPiece('I'), {x: 75, y:440}, 20, this.context_g2);

		this.context_g2.fillStyle = 'rgb(200, 0, 0)';
		this.context_g2.font = '40px Georgia';
		this.context_g2.fillText(`${player.countT}`.padStart(3, '0'), 200, 120);
		this.context_g2.fillText(`${player.countJ}`.padStart(3, '0'), 200, 180);
		this.context_g2.fillText(`${player.countZ}`.padStart(3, '0'), 200, 240);
		this.context_g2.fillText(`${player.countO}`.padStart(3, '0'), 200, 300);
		this.context_g2.fillText(`${player.countS}`.padStart(3, '0'), 200, 360);
		this.context_g2.fillText(`${player.countL}`.padStart(3, '0'), 200, 420);
		this.context_g2.fillText(`${player.countI}`.padStart(3, '0'), 200, 480);
	}

	drawGUIAnimated(time) {		

		if (!this.startScreen && !this.endGame 
		&&  !this.finalStats) {

			if (this.tetris.player.droughtCount >= 14) {

				this.context_g2.fillStyle = "black";
				this.context_g2.fillRect(55, 618, 270, 50);

				this.droughtLabel.show();
				this.droughtLabel.color = this.droughtFlash(time / 500);
			}
		}
	}

	drawStaticScreen() {

		this.clearScreen();

		if (this.tetris.paused) {
			this.pausedText.show();
		}
		
		if (this.tetris.startScreen) {

			if (this.tetris.level === 0) {
				this.leftArrowColor = 'rgb(40, 40, 40)';
			} else {
				this.leftArrowColor = 'white';
			}

			if (this.tetris.level === 29) {
				this.rightArrowColor = 'rgb(40, 40, 40)';
			} else {
				this.rightArrowColor = 'white';
			}

			this.selectLevelText.show();

			this.leftArrow.color = this.leftArrowColor;
			this.leftArrow.show();
			
			this.rightArrow.color = this.rightArrowColor;
			this.rightArrow.show();

			if (!this.tetris.gamePadConnected) {
				this.gameControlsText_1.show();
				this.gameControlsText_2.show();
			}
			
		}

		if (this.tetris.endGame) {
			
			this.tetris.drawMatrix2(this.tetris.arena.matrix_2, {x: 4, y: -5}, 34, this.context_g1);

			this.gameOverText.show();	
		}

		if (this.tetris.finalStats) {

			if (this.tetris.arena.tetrisRate === 100) {
				this.recapLine_5.x = 20;
			} else {
				this.recapLine_5.x = 45;
			}

			if (this.tetris.player.avgDrought % 1 > 0) {
				this.recapLine_7.x = 20;
			} else {
				this.recapLine_7.x = 45;
			}
			
			this.recapHeading.show();
			this.recapLine_1.show();
			this.recapLine_2.show();
			this.recapLine_3.show();
			this.recapLine_4.show();
			this.recapLine_5.show();
			this.recapLine_6.show();
			this.recapLine_7.show();
			this.recapLine_8.show();
		}		
	}

	drawScreenAnimated(time) {
		if (this.tetris.startScreen) {
			
			//DRAW SCREEN - ANIMATED
			this.context_g1.clearRect(125, 345, 100, 40);
			
			this.context_g1.fillStyle = this.levelNumFlash(time / 8);
			this.context_g1.font = `40px Ponderosa`;
			this.context_g1.fillText(`${this.tetris.level}`.padStart(2, '0'), 142, 380);

			this.context_g1.fillStyle = "black";
			this.context_g1.fillRect(9, 675, 333, 25);

			if (!this.tetris.gamePadConnected) {
				this.gp_detect.x = 20;
			} else {
				this.gp_detect.x = 22;
			}

			this.gp_detect.show();
			this.gp_detect.color = this.slowFlash2(time / 700);
		}

		if (this.tetris.controlsScreen && this.tetris.firstPlay) {

			// Show Keyboard Inputs for game
			
			this.clearScreen();

			this.controlsHeading.show();
			this.controlsLine_1.show();
			this.controlsLine_2.show();
			this.controlsLine_3.show();
			this.controlsLine_4.show();
			this.controlsLine_5.show();
			this.controlsLine_6.show();
			this.controlsLine_7.show();

			this.controlsLine_8.show();
			this.controlsLine_8.color = this.slowFlash(time / 700);
		}

		if (this.tetris.finalStats) {

			this.context_g1.fillStyle = "black";
			this.context_g1.fillRect(50, 565, 250, 45);
			
			this.press_space.show();
			this.press_space.color = this.slowFlash(time / 700);
		}
	}

	levelNumFlash(time) {
		return animRgb(255, 50, 0, time, 3);
	}

	droughtFlash(time) {
		return animRgb(255, 50, 0, time, 3);
	}

	slowFlash(time) {
		return animRgb(255, 255, 255, time, 2);	
	}

	slowFlash2(time) {
		return animRgb(255, 255, 255, time, 2.5);
	}
}