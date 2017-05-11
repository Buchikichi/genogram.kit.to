class Actor {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
		this.z = 0;
		this.spawnList = [];
	}

	get spawn() {
		let result = this.spawnList;

		this.spawnList = [];
		return result;
	}

	getDistance(target) {
		let diffX = this.x - target.x;
		let diffY = this.y - target.y;

		return Math.sqrt(diffX * diffX + diffY * diffY);
	}

	isHit(x, y) {
		return false;
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
