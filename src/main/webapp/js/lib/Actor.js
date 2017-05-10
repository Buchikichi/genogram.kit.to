class Actor {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
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
