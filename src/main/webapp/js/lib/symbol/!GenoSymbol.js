class GenoSymbol {
	constructor(person) {
		this.person = person;
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
		let y = -(this.fontSize / 2 + this.radius + 2);

		ctx.fillText(text, 0, y);
	}

	drawAge(ctx) {
		let text = this.person.age;

		if (!text) {
			return;
		}
//text = this.person.count + ':' + text;
		ctx.strokeText(text, 0, 0);
		ctx.fillText(text, 0, 0);
	}

	drawName(ctx) {
		let text = this.person.name;
//text = this.person.count + ':' + text;
		let y = this.fontSize / 2 + this.radius + 2;

		ctx.fillText(text, 0, y);
	}

	resetProperties() {
		this.radius = this.person.radius;
		this.width = this.radius * 2;
		this.ir = this.radius * .8;
		this.fontSize = this.person.fontSize;
	}

	draw(ctx) {
		this.resetProperties();
		ctx.save();
		ctx.strokeStyle = this.person.strokeStyle;
		ctx.textAlign = 'center';
		this.drawSymbol(ctx);
		if (this.person.dod) {
			this.drawCross(ctx);
		}
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'black';
		this.drawAge(ctx);
		this.drawYears(ctx);
		this.drawName(ctx);
		ctx.restore();
	}
}
