class ChainRoot extends Chain {
	constructor() {
		super();
		this.id = 'root';
		this.radius = 5;
	}

	get info() {
		return this.id + '(' + this.x + ',' + this.y + ')';
	}

	draw(ctx) {
//		ctx.save();
//		ctx.beginPath();
//		ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
//		ctx.fillStyle = 'green';
//		ctx.fill();
//		ctx.restore();
	}
}
