class FemaleSymbol extends GenoSymbol {
	isHit(x, y) {
		let person = this.person;
		let diffX = person.x - x;
		let diffY = person.y - y;
		let distance = Math.sqrt(diffX * diffX + diffY * diffY);

		return distance <= .5;
	}

	drawIllness(ctx) {
		if (!this.person.illness) {
			return;
		}
		let qt = Math.PI / 2;

		ctx.save();
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, qt, -qt, false);
		ctx.fillStyle = GenoSymbol.ColorIllness;
		ctx.fill();
		ctx.restore();
	}

	drawAbuse(ctx) {
		if (!this.person.abuse) {
			return;
		}
		ctx.save();
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, -Math.PI, false);
		ctx.fillStyle = GenoSymbol.ColorAbuse;
		ctx.fill();
		ctx.restore();
	}

	drawSymbol(ctx) {
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
		ctx.stroke();
		if (this.person.principal) {
			ctx.beginPath();
			ctx.arc(0, 0, this.ir, 0, Math.PI * 2, false);
			ctx.stroke();
		}
	}

	drawCross(ctx) {
		let sq = Math.PI / 2;
		let qt = sq / 2;
		let top = Math.cos(qt + sq) * this.radius;
		let left = -Math.sin(qt + sq) * this.radius;
		let right = Math.sin(qt) * this.radius;
//		let right = this.radius;
		let bottom = Math.cos(-qt) * this.radius;

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
