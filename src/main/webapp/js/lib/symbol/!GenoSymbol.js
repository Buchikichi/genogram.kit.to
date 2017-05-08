class GenoSymbol {
	constructor(person) {
		this.person = person;
		this.radius = this.person.radius;
		this.width = this.radius * 2;
		this.ir = this.radius * .8;
	}

	drawSymbol(ctx) {
		let bx = -this.radius;
		let by = -this.radius;
		let width = this.radius * 2;

		ctx.strokeRect(bx, by, width, width);
		if (this.person.principal) {
			let ir = this.ir;
			let ix = -ir;
			let iy = -ir;
			let iw = ir * 2;

			ctx.strokeRect(ix, iy, iw, iw);
		}
	}

	drawCross(ctx) {
		let top = -this.radius;
		let left = -this.radius;
		let right = this.radius;
		let bottom = this.radius;

		ctx.beginPath();
		ctx.moveTo(left, top);
		ctx.lineTo(right, bottom);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(right, top);
		ctx.lineTo(left, bottom);
		ctx.stroke();
	}

	drawYears(ctx) {
		let dob = new GenoCalendar(this.person.dob);
dob = new GenoCalendar(null); // 誕生年を表示しない
		let dod = new GenoCalendar(this.person.dod);
		let list = [dob.year, dod.year];
		let text = list.join('-');

		if (text.length <= 1) {
			return;
		}
//text = this.count + ':' + text;
		let metrics = ctx.measureText(text);
		let x = -metrics.width / 2;
		let y = -(20 + this.radius); // TODO 正しく調整

		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.strokeText(text, x, y);
	}

	drawAge(ctx) {
		let text = this.person.age;

		if (!text) {
			return;
		}
//text = this.count + ':' + text;
		let metrics = ctx.measureText(text);
		let x = -metrics.width / 2;
		let y = 16 / 2; // TODO 正しく調整

		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.strokeText(text, x, y);
	}

	draw(ctx) {
		ctx.strokeStyle = this.person.strokeStyle;
		this.drawSymbol(ctx);
		if (this.person.dod) {
			this.drawCross(ctx);
		}
		this.drawAge(ctx);
		this.drawYears(ctx);
	}
}
