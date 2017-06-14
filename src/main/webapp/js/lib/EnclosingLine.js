class EnclosingLine extends Actor {
	constructor() {
		super(-2, -2, 110);
		this.holdable = true;
		this.root = this.addHandle(this.x, this.y);
		this.addHandle(-2, 2);
		this.addHandle(2, 2);
		this.addHandle(2, -2);
		this.spawnList = this.root.listAll;
	}

	addHandle(x, y) {
		let handle = new ActorHandle(x, y, this.z + 1);

		handle.parent = this;
		if (this.root) {
			this.root.add(handle);
		}
		return handle;
	}

	delHandle(handle) {
		this.root = handle.prev;
		handle.eject();
	}

	eject() {
		super.eject();
		this.root.listAll.forEach(node => {
			node.eject();
		});
	}

	isHit(px, py) {
		let spacing = Field.Instance.spacing;
		let x = px / spacing;
		let y = py / spacing;

		this.root.listAll.forEach(node => {
			if (node.isLineHit(x, y)) {
				this.hit = true;
			}
		});
		return this.hit;
	}

	move(dx, dy) {
		super.move(dx, dy);
		this.root.listAll.forEach(handle => {
			handle.move(dx, dy);
		});
	}
}
