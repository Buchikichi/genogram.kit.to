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

	get list() {
		return this.points.concat(this);
	}

	addPoint(x, y) {
		this.points.push({x:x, y:y});
	}

	isHit(x, y) {
		let hit = false;

		this.list.forEach(point => {
			point.hit = false;
			if (hit) {
				return;
			}
			let diffX = point.x - x;
			let diffY = point.y - y;
			let distance = Math.sqrt(diffX * diffX + diffY * diffY);

			if (distance < this.radius) {
				hit = true;
				point.hit = this;
			}
		});
	}

	draw(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		this.points.forEach(pt => {
			ctx.lineTo(pt.x, pt.y);
		});
		ctx.lineTo(this.x, this.y);
		ctx.strokeStyle = 'lightglay';
		ctx.stroke();
		this.list.forEach(point => {
			if (point.hit) {
				ctx.beginPath();
				ctx.strokeStyle = 'aqua';
				ctx.arc(point.x, point.y, this.radius, 0, Math.PI * 2, false);
				ctx.stroke();
			}
		});
		ctx.restore();
	}
}
