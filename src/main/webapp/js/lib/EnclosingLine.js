class EnclosingLine extends Actor {
	constructor() {
		super();
		this.x = 100;
		this.y = 100;
		this.radius = 10;
		this.points = [];
		this.addPoint(200, 100);
		this.addPoint(200, 200);
		this.addPoint(100, 200);
	}

	addPoint(x, y) {
		this.points.push({x:x, y:y});
	}

	isHit(x, y) {
		let list = [];
	}

	draw(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		this.points.forEach(pt => {
			ctx.lineTo(pt.x, pt.y);
		});
		ctx.lineTo(this.x, this.y);
		ctx.strokeStyle = 'green';
		ctx.stroke();
		ctx.restore();
	}
}
