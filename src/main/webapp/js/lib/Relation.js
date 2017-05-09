class Relation extends Actor {
	constructor(person, other) {
		super();
		if (person.isMale) {
			this.father = person;
			this.mother = other;
		} else {
			this.father = other;
			this.mother = person;
		}
		this.hit = false;
	}

	get rect() {
		let father = this.father;
		let radius = father.radius;
		let left = Math.min(father.x, this.mother.x) + radius;
		let width = Math.abs(father.x - this.mother.x) - radius * 2;
		let height = radius / 5;
		let hw = height / 2;
		let top = father.y - hw;

		return {
			top: top,
			left: left,
			width: width,
			height: height,
		};
	}

	isHit(x, y) {
		let rect = this.rect;
		let right = rect.left + rect.width;

		this.hit = false;
		if (rect.left < x && x < right) {
			let bottom = rect.top + rect.height;

			if (rect.top <= y && y <= bottom) {
				this.hit = true;
			}
		}
		return this.hit;
	}

	drawNormal(ctx) {
		let rect = this.rect;

		ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
	}

	drawHighlight(ctx) {
		ctx.strokeStyle = 'aqua';
		ctx.lineWidth = 5;
		this.drawNormal(ctx);
	}

	draw(ctx, cnt = 0) {
		ctx.save();
		if (this.hit) {
			this.drawHighlight(ctx);
		} else {
			this.drawNormal(ctx);
		}
		ctx.restore();
	}
}
