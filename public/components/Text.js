export default class Text {
	constructor(text, x, y, color, fontSize, context, 
				font = "Ponderosa", url = "url(./fonts/ponde_.ttf)") {
		
		this.text = text;
		this.x = x;
		this.y = y;

		this.color = color;
		this.font = font;
		this.url = url;
		this.fontSize = fontSize;
		this.stringFontSize = `${this.fontSize.toString()}px`;
		this.context = context;

		this.yOffset = this.fontSize * 3/4;

		this.loading = true;
	}

	show() {
		let f = new FontFace(this.font, this.url);

		let that = this;

		if (this.loading) {
			f.load().then(function() {
			  // Ready to use the font in a canvas context
			  	document.fonts.add(f);

			  	that.stringFontSize = `${that.fontSize.toString()}px`;

				that.context.fillStyle = that.color;
				that.context.font = `${that.stringFontSize} ${f.family}`;
				that.context.fillText(that.text, that.x, that.y + that.yOffset);
			});

			this.loading = false;

		} else {

			this.stringFontSize = `${this.fontSize.toString()}px`;

			this.context.fillStyle = this.color;
			this.context.font = `${this.stringFontSize} ${this.font}`;
			this.context.fillText(this.text, this.x, this.y + this.yOffset);	
		}		
	}
}