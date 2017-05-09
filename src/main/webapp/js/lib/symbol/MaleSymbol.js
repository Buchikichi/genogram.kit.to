class MaleSymbol extends GenoSymbol {
	isHit(x, y) {
		let person = this.person;
		let diffX = person.x - x;
		let diffY = person.y - y;
		let radius = person.radius;

		return Math.abs(diffX) < radius && Math.abs(diffY) < radius;
	}
}
