class Description extends Actor {
	constructor(person, text) {
		super();
		this.person = person;
		this.x = person.x;
		this.y = person.y;
		this.text = text;
	}

	calculate(ctx) {
		this.width = 1;
		this.height = 0.25;
	}

	isHit(px, py) {
		let spacing = Field.Instance.spacing;
		let x = px / spacing;
		let y = py / spacing;
		let right = this.x + this.width;
		let bottom = this.y + this.height;

		this.hit = this.x <= x && x <= right && this.y <= y && y <= bottom;
		return this.hit;
	}

	drawFrame(ctx) {
		if (this.selected) {
			this.strokeStyle = 'navy';
			ctx.lineWidth = 5;
		} else if (this.hit) {
			this.strokeStyle = 'aqua';
			ctx.lineWidth = 5;
		} else {
			return;
		}
		ctx.strokeStyle = this.strokeStyle;
		let spacing = Field.Instance.spacing;
		let width = this.width * spacing;
		let height = this.height * spacing;

		ctx.strokeRect(0, 0, width, height);
	}

	drawLine(ctx) {
		let spacing = Field.Instance.spacing;
		let rad = this.getRadian(this.person);
		let x = -this.x + this.person.x + Math.cos(rad) * .5;
		let y = -this.y + this.person.y + Math.sin(rad) * .5;

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(x * spacing, y * spacing);
		ctx.stroke();
	}

	draw(ctx) {
		this.calculate(ctx);
		let spacing = Field.Instance.spacing;
		let x = this.x * spacing;
		let y = this.y * spacing;

		ctx.save();
		ctx.translate(x, y);
		this.drawFrame(ctx);
		this.drawLine(ctx);
		ctx.fillText(this.text, 0, 0);
		ctx.restore();
	}
}
