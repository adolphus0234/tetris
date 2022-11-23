export default class Box {
	constructor(x, y, width, height, context, lineWidth = 4) {

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.context = context;
		this.lineWidth = lineWidth;

		this.scale = 1;	
	}

	show() {
		this.context.fillStyle = "black";
		this.context.strokeStyle = "rgb(150, 220, 255)";
		this.context.lineWidth = this.lineWidth;
		this.context.lineJoin = "round";

		this.context.shadowColor = "black";
		this.context.shadowBlur = 15;
		this.context.shadowOffsetX = 5;
		this.context.shadowOffsetY = 5;

		this.context.fillRect(this.x, this.y, 
							  this.width * this.scale, 
							  this.height * this.scale);

		this.context.strokeRect(this.x, this.y, 
							    this.width * this.scale, 
							    this.height * this.scale);

		this.context.shadowColor;
		this.context.shadowBlur = 0;
		this.context.shadowOffsetX = 0;
		this.context.shadowOffsetY = 0;
	}
}