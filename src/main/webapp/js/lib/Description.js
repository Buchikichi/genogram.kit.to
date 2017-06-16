class Description extends Actor {
	constructor(person, text, dx, dy = 0) {
		super(0, 0, Chain.Z + 1);
		this.holdable = true;
		this.person = person;
		this.dx = dx; // 相対位置
		this.dy = dy; // 相対位置
		this.text = text;
	}

	get x() {
		return this.person.x + this.dx;
	}
	set x(val) {
		if (this.person) {
			this.dx = val - this.person.x;
		}
	}
	get y() {
		return this.person.y + this.dy;
	}
	set y(val) {
		if (this.person) {
			this.dy = val - this.person.y;
		}
	}

	get lines() {
		return this.text.split(/\r\n|\r|\n/);
	}

	calculate(ctx) {
		let spacing = Field.Instance.spacing;
		let fontSize = Field.Instance.fontSize;
		let half = fontSize / spacing / 2;
		let width = 0;
		let height = 0;
		let empty = true;

		this.lines.reverse().forEach(str => {
			let metrics = ctx.measureText(str);

			width = Math.max(width, metrics.width / spacing);
			if (empty && str.length == 0) {
				return;
			}
			empty = false;
			height++;
		});
		this.width = width;
		this.height = height * fontSize / spacing;
		this.hW = width / 2;
		this.hH = this.height / 2;
	}

	isHit(px, py) {
		let spacing = Field.Instance.spacing;
		let x = px / spacing;
		let y = py / spacing;
		let top = this.y - this.hH;
		let left = this.x - this.hW;
		let right = this.x + this.hW;
		let bottom = this.y + this.hH;

		this.hit = left <= x && x <= right && top <= y && y <= bottom;
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
		let top = -this.hH  * spacing;
		let left = -this.hW * spacing;
		let width = this.width * spacing;
		let height = this.height * spacing;

		ctx.strokeRect(left, top, width, height);
		ctx.fillStyle = 'rgba(0, 255, 255, .1)';
		ctx.fillRect(left, top, width, height);
//ctx.fillStyle = 'red';
//ctx.beginPath();
//ctx.arc(0, 0, 4, 0, Math.PI * 2, false);
//ctx.fill();
	}

	drawLine(ctx) {
		if (!this.selected && !this.hit) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let rad = this.getRadian(this.person);
		let bx = -this.x + this.person.x + Math.cos(rad) * .5;
		let by = -this.y + this.person.y + Math.sin(rad) * .5;
		let ex = 0;
		let ey = 0;

		ctx.beginPath();
		ctx.moveTo(bx * spacing, by * spacing);
		ctx.lineTo(ex * spacing, ey * spacing);
		ctx.stroke();
	}

	drawText(ctx) {
		let spacing = Field.Instance.spacing;
		let fontSize = Field.Instance.fontSize;
		let top = -this.hH * spacing + fontSize / 2;
		let left = -this.hW * spacing;

		ctx.fillStyle = 'black';
		this.lines.forEach(str => {
			ctx.fillText(str, left, top);
			top += fontSize;
		});
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
		this.drawText(ctx);
		ctx.restore();
	}
}
