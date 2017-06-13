class MiscarriageSymbol extends GenoSymbol {
	isHit(x, y) {
		let person = this.person;
		let diffX = person.x - x;
		let diffY = person.y - .25 - y;
		let distance = Math.sqrt(diffX * diffX + diffY * diffY);

		return distance <= .25;
	}

	drawSymbol(ctx) {
		let r = this.radius / 2;

		ctx.beginPath();
		ctx.arc(0, -r, r, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.arc(0, -r, r, 0, Math.PI * 2, false);
		ctx.fill();
	}
}
