class Occupancy {
	constructor(top = 0, left = 0, right = 0, bottom = 0) {
		this.top = top;
		this.left = left;
		this.right = right;
		this.bottom = bottom;
	}

	merge(other) {
		this.top = Math.max(this.top, other.top);
		this.left = Math.max(this.left, other.left);
		this.right = Math.max(this.right, other.right);
		this.bottom = Math.max(this.bottom, other.bottom);
	}
}
