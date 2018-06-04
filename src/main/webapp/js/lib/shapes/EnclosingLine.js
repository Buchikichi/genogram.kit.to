class EnclosingLine extends Actor {
	constructor(x = -2, y = -2) {
		super(x, y, 110);
		this.type = 'Enclosure';
		this.lineColor = '#000';
		this.lineStyle = 'Solid';
		this.holdable = true;
		this.root = this.addHandle(this.x, this.y);
	}

	addHandle(x, y) {
		let handle = new ActorHandle(x, y, this.z + 1);

		handle.parent = this;
		if (this.root) {
			this.root.add(handle);
		}
		this.reserve(handle);
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

	isHit(x, y) {
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

	createFormData() {
		return this.root.listAll;
	}

	static createDefault() {
		let obj = new EnclosingLine();

		obj.addHandle(-2, 2);
		obj.addHandle(2, 2);
		obj.addHandle(2, -2);
		return obj;
	}
}
