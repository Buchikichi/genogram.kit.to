class Relationship extends Actor {
	constructor(person, other) {
		super();
		this.person = person;
		this.other = other;
		this.createFillStyle();
	}

	createFillStyle() {
		this.fillStyle = 'rgba(200, 200, 255, 0.7)';
	}

	draw(ctx) {
		let bx = this.person.x;
		let by = this.person.y;
		let ex = this.other.x;
		let ey = this.other.y;
		let diffX = ex - bx;
		let diffY = ey - by;
		let width = Math.sqrt(diffX * diffX + diffY * diffY);
		let radian = Math.atan2(diffY, diffX);
		let cx = bx + diffX / 2;
		let cy = by + diffY / 2;

		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = 'blue';
		ctx.moveTo(bx, by);
		ctx.lineTo(ex, ey);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.arc(cx, cy, 4, 0, Math.PI * 2, false);
		ctx.stroke();

		ctx.translate(cx, cy);
		ctx.rotate(radian);
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(-width / 2, -10, width, 20);
		ctx.restore();
	}
}
