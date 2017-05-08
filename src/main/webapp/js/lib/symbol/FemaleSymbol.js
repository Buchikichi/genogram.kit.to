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
}
