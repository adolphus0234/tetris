const tetrisTrack_1 = new Audio('./SFX/music_1.mp3');
const tetrisTrack_2 = new Audio('./SFX/music_2.mp3');
const tetrisTrack_3 = new Audio('./SFX/music_3.mp3');
const tetrisTrack_4 = new Audio('./SFX/gb_atype_music.mp3');
const tetrisTrack_5 = new Audio('./SFX/gb_ctype_music.mp3');

export default class MusicBoard {
	constructor() {
		this.trackList = [ tetrisTrack_1,
						   tetrisTrack_2,
						   tetrisTrack_3,
						   tetrisTrack_4,
						   tetrisTrack_5 
						];

		this.songLength = [ 180000, //track 1
							180000, //track 2
							180000, //track 3
							180000, //track 4 
							180000 	//track 5 
						];
						   
		this.totalTracks = this.trackList.length;
	}

	playTrack(music) {
		music.play();
	}


	pauseTrack(music) {
		music.pause();
	}


	stopTrack(music) {
		music.pause();
		music.currentTime = 0;
	}
}