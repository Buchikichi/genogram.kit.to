class Occupancy {
	constructor(origin, top = 0, left = 0, right = 0, bottom = 0) {
		let x = origin.x;

		this.origin = origin;
		this.top = top;
		this.left = x - 1;
		this.right = x + 1;
		this.bottom = bottom;
	}

	merge(other) {
		this.top = Math.min(this.top, other.top);
		this.left = Math.min(this.left, other.left);
		this.right = Math.max(this.right, other.right);
		this.bottom = Math.max(this.bottom, other.bottom);
	}
}
