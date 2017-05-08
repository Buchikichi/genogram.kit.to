class FemaleSymbol extends GenoSymbol {
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
