export default class Animation {
	constructor() {
	}

	clearAnimation(matrix, y) {
		const INTERVAL = 40

		matrix[y][0] = 9;
	
		setTimeout(function() {
			matrix[y][1] = 9;
		}, INTERVAL);
		setTimeout(function() {
			matrix[y][2] = 9;
		}, INTERVAL * 2);
		setTimeout(function() {
			matrix[y][3] = 9;
		}, INTERVAL * 3);
		setTimeout(function() {
			matrix[y][4] = 9;
		}, INTERVAL * 4);
		setTimeout(function() {
			matrix[y][5] = 9;
		}, INTERVAL * 5);
		setTimeout(function() {
			matrix[y][6] = 9;
		}, INTERVAL * 6);
		setTimeout(function() {
			matrix[y][7] = 9;
		}, INTERVAL * 7);
		setTimeout(function() {
			matrix[y][8] = 9;
		}, INTERVAL * 8);
		setTimeout(function() {
			matrix[y][9] = 9;
		}, INTERVAL * 9);
	}

	curtainAnime(matrix) {
		matrix[1].fill(8);

		let int = 100;

		setTimeout(function() {
			matrix[2].fill(8);
		}, int)

		setTimeout(function() {
			matrix[3].fill(8);
		}, int * 2)

		setTimeout(function() {
			matrix[4].fill(8);
		}, int * 3)

		setTimeout(function() {
			matrix[5].fill(8);
		}, int * 4)

		setTimeout(function() {
			matrix[6].fill(8);
		}, int * 5)

		setTimeout(function() {
			matrix[7].fill(8);
		}, int * 6)

		setTimeout(function() {
			matrix[8].fill(8);
		}, int * 7)

		setTimeout(function() {
			matrix[9].fill(8);
		}, int * 8)

		setTimeout(function() {
			matrix[10].fill(8);
		}, int * 9)


		setTimeout(function() {
			matrix[11].fill(8);
		}, int * 10)

		setTimeout(function() {
			matrix[12].fill(8);
		}, int * 11)

		setTimeout(function() {
			matrix[13].fill(8);
		}, int * 12)

		setTimeout(function() {
			matrix[14].fill(8);
		}, int * 13)

		setTimeout(function() {
			matrix[15].fill(8);
		}, int * 14)

		setTimeout(function() {
			matrix[16].fill(8);
		}, int * 15)

		setTimeout(function() {
			matrix[17].fill(8);
		}, int * 16)

		setTimeout(function() {
			matrix[18].fill(8);
		}, int * 17)

		setTimeout(function() {
			matrix[19].fill(8);
		}, int * 18)

		setTimeout(function() {
			matrix[20].fill(8);
		}, int * 19)
	}
}