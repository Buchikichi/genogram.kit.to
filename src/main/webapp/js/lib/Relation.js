class Relation {
	constructor(people, other) {
		if (people.isMale) {
			this.father = people;
			this.mother = other;
		} else {
			this.father = other;
			this.mother = people;
		}
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

		if (rect.left < x && x < right) {
			let bottom = rect.top + rect.height;

			if (rect.top < y && y < bottom) {
				return true;
			}
		}
		return false;
	}

	draw(ctx, cnt = 0) {
		let rect = this.rect;

		ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
	}
	drawHighlight(ctx) {
		ctx.save();
		ctx.strokeStyle = 'aqua';
		ctx.lineWidth = 5;
		this.draw(ctx);
		ctx.restore();
	}
}
