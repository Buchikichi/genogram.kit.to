class GenoCalendar {
	constructor(text) {
		this.year = null;
		this.month = null;
		this.day = null;
		if (text) {
			this.setupDate(new String(text));
		}
	}

	setupDate(text) {
		let elem = text.split(/[-/]/g);
		let nextYear = new Date().getFullYear() + 1;
		let year = parseInt(elem[0]);
		let month = null;
		let day = null;

		if (!Number.isFinite(year)) {
			year = null;
		} else if (year + 1900 < nextYear) {
			year += 1900;
		}
		this.year = year;
		if (1 < elem.length) {
			month = parseInt(elem[1]);
			if (2 < elem.length) {
				let date = new Date(year, month - 1, parseInt(elem[2]));

				year = date.getFullYear();
				month = date.getMonth() + 1;
				day = date.getDate();
				this.day = day;
			} else if (month < 0 || 12 < month) {
				month = 1;
			}
			this.month = month;
		}
	}

	get age() {
		if (!this.year) {
			return null;
		}
		let date = new Date();
		let yy = date.getFullYear();

		if (!this.month) {
			return yy - this.year;
		}
		let mm = date.getMonth() + 1;
		if (!this.dd) {
			let yymm = yy * 100 + mm;
			let diff = yymm - (this.year * 100 + this.month);

			return Math.floor(diff / 100);
		}
		let dd = date.getDate();
		let full = yy * 10000 + mm * 100 + dd;
		let diff = full - (this.year * 10000 + this.month * 100 + this.day);

		return Math.floor(diff / 10000);
	}

	toString() {
		let list = [];

		if (this.year) {
			list.push(this.year);
			if (this.month) {
				list.push(this.month);
				if (this.day) {
					list.push(this.day);
				}
			}
		}
		return list.join('-');
	}
}
