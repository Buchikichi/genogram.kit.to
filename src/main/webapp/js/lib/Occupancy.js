class Occupancy {
	constructor(person = null, top = Number.MAX_SAFE_INTEGER, left = Number.MAX_SAFE_INTEGER, right = Number.MIN_SAFE_INTEGER, bottom = Number.MIN_SAFE_INTEGER) {
		this.top = top;
		this.left = left;
		this.right = right;
		this.bottom = bottom;
		this.personList = [];
		if (person) {
			let x = person.ax;

			this.left = x;
			this.right = x;
			this.personList.push(person);
		}
	}

	get width() {
		return this.right - this.left;
	}

	isDone(person) {
		return this.personList.indexOf(person) != -1;
	}

	merge(other) {
		this.top = Math.min(this.top, other.top);
		this.left = Math.min(this.left, other.left);
		this.right = Math.max(this.right, other.right);
		this.bottom = Math.max(this.bottom, other.bottom);
		this.personList = this.personList.concat(other.personList);
	}
}
