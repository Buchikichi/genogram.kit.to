class GenoSymbol {
	constructor(person) {
		this.person = person;
		this.radius = this.person.radius;
		this.width = this.radius * 2;
		this.ir = this.radius * .8;
	}

	drawSymbol(ctx) {
		let bx = -this.radius;
		let by = -this.radius;
		let width = this.radius * 2;

		ctx.strokeRect(bx, by, width, width);
		if (this.person.principal) {
			let ir = this.ir;
			let ix = -ir;
			let iy = -ir;
			let iw = ir * 2;

			ctx.strokeRect(ix, iy, iw, iw);
		}
	}

	drawAge(ctx) {
		let text = this.person.age;

		if (!text) {
			return;
		}
//text = this.count + ':' + text;
		let metrics = ctx.measureText(text);
		let x = -metrics.width / 2;
		let y = 16 / 2; // TODO 正しく調整

		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.strokeText(text, x, y);
	}

	draw(ctx) {
		ctx.strokeStyle = this.person.strokeStyle;
		this.drawSymbol(ctx);
		this.drawAge(ctx);
	}
}
