class Relationship extends Actor {
	constructor(person, other) {
		super();
		this.person = person;
		this.other = other;
		this.createFillStyle();
	}

	createFillStyle() {
		let ctx = FlexibleView.Instance.ctx;

		this.fillStyle = 'rgba(200, 200, 255, 0.7)';
		this.img = new Image();
		this.img.onload = ()=> {
			let hH = this.img.height / 2;

			ctx.save();
			ctx.translate(0, -hH);
			this.fillStyle = ctx.createPattern(this.img, 'repeat-x');
			ctx.restore();
		};
		this.img.src = 'img/fused.png';
	}

	drawAuxiliary(ctx) {
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
		ctx.restore();
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
		ctx.translate(cx, cy);
		ctx.rotate(radian);
		ctx.translate(0, -8);
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(-width / 2, 0, width, 16);
		ctx.restore();
//		this.drawAuxiliary(ctx);
	}
}
