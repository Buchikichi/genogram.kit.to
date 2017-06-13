class MaleSymbol extends GenoSymbol {
	isHit(x, y) {
		let person = this.person;
		let diffX = person.x - x;
		let diffY = person.y - y;

		return Math.abs(diffX) <= .5 && Math.abs(diffY) <= .5;
	}

	drawIllness(ctx) {
		if (!this.person.illness) {
			return;
		}
		let bx = -this.radius;
		let by = -this.radius;

		ctx.save();
		ctx.fillStyle = GenoSymbol.ColorIllness;
		ctx.fillRect(bx, by, this.radius, this.width);
		ctx.restore();
	}

	drawAbuse(ctx) {
		if (!this.person.abuse) {
			return;
		}
		let bx = -this.radius;

		ctx.save();
		ctx.fillStyle = GenoSymbol.ColorAbuse;
		ctx.fillRect(bx, 0, this.width, this.radius);
		ctx.restore();
	}

	drawCross(ctx) {
		let top = -this.radius;
		let left = -this.radius;
		let right = this.radius;
		let bottom = this.radius;

		ctx.beginPath();
		ctx.moveTo(left, top);
		ctx.lineTo(right, bottom);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(right, top);
		ctx.lineTo(left, bottom);
		ctx.stroke();
	}
}
