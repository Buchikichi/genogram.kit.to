class Actor {
	constructor(x = 0, y = 0, z = 0) {
		this.id = UUID.toString();
		this.x = x;
		this.y = y;
		this.z = z;
		this.radius = 0;
		this.holdable = false;
		this.spawnList = [];
	}

	get spawn() {
		let result = this.spawnList;

		this.spawnList = [];
		return result;
	}

	reserve(...actors) {
		this.spawnList = this.spawnList.concat(actors);
	}

	getDistance(target) {
		let diffX = this.x - target.x;
		let diffY = this.y - target.y;

		return Math.sqrt(diffX * diffX + diffY * diffY);
	}

	getRadian(target) {
		let diffX = this.x - target.x;
		let diffY = this.y - target.y;

		return Math.atan2(diffY, diffX);
	}

	getMidpoint(target) {
		return new Actor((this.x + target.x) / 2, (this.y + target.y) / 2);
	}

	getInterimPoint(target, step = 1, max = 1) {
		let diffX = this.x - target.x;
		let diffY = this.y - target.y;
		let len = Math.sqrt(diffX * diffX + diffY * diffY) * step / max;
		let rad = Math.atan2(diffY, diffX);
		let x = this.x - Math.cos(rad) * len;
		let y = this.y - Math.sin(rad) * len;

		return new Actor(x, y);
	}

	includes(x, y, radius = null) {
		let diffX = this.x - x;
		let diffY = this.y - y;
		let r = radius ? radius : this.radius;

//console.log('includes:' + r);
		return Math.sqrt(diffX * diffX + diffY * diffY) < r;
	}

	isHit(x, y) {
		return this.includes(x, y);
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}

	eject() {
		this.isGone = true;
	}

	react() {
		return [];
	}

	draw(ctx) {
	}
}
