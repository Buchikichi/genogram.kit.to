class FetusSymbol extends GenoSymbol {
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
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(0, -this.radius);
		ctx.lineTo(-this.radius, this.radius);
		ctx.lineTo(0, this.radius);
		ctx.lineTo(0, -this.radius);
		ctx.fillStyle = GenoSymbol.ColorIllness;
		ctx.fill();
		ctx.restore();
	}

	drawAbuse(ctx) {
		if (!this.person.abuse) {
			return;
		}
		let len = Math.sqrt(this.width * this.width / 2);
		let top = len - this.radius;
		let left = -len / 2;
		let right = -left;

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(right, top);
		ctx.lineTo(left, top);
		ctx.lineTo(-this.radius, this.radius);
		ctx.lineTo(this.radius, this.radius);
		ctx.lineTo(right, top);
		ctx.fillStyle = GenoSymbol.ColorAbuse;
		ctx.fill();
		ctx.restore();
	}

	drawSymbol(ctx) {
		ctx.beginPath();
		ctx.moveTo(0, -this.radius);
		ctx.lineTo(-this.radius, this.radius);
		ctx.lineTo(this.radius, this.radius);
		ctx.lineTo(0, -this.radius);
		ctx.stroke();
	}

	drawCross(ctx) {
		let left = -this.radius / 2;
		let right = this.radius / 2;

		ctx.beginPath();
		ctx.moveTo(left, 0);
		ctx.lineTo(this.radius, this.radius);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(right, 0);
		ctx.lineTo(-this.radius, this.radius);
		ctx.stroke();
	}
}
