class MaleSymbol extends GenoSymbol {
	isHit(x, y) {
		let person = this.person;
		let diffX = person.x - x;
		let diffY = person.y - y;

		return Math.abs(diffX) <= .5 && Math.abs(diffY) <= .5;
	}
}
