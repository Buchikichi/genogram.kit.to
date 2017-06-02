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
		let y = -(this.textHh + this.radius);

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
		let showName = Field.Instance.showName;

		if (showName == '0') {
			return;
		}
		let text = this.person.name;
		let y = this.radius;

		if (showName == 'm') {
			y -= this.textHh;
		} else if (showName == 'b') {
			y += this.textHh;
		}
		if (Field.DEBUG) {
			text = '#' + this.person.generation + ':' + text;
		}
		ctx.save();
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'rgba(220, 220, 220, .7)';
		ctx.strokeText(text, 1, y + 1);
		ctx.restore();
		ctx.fillText(text, 0, y);
	}

	resetProperties() {
		this.radius = this.person.radius;
		this.width = this.radius * 2;
		this.ir = this.radius * .8;
		this.fontSize = this.person.fontSize;
		this.textMargin = this.fontSize * .2;
		this.textHh = this.fontSize / 2 + this.textMargin;
	}

	draw(ctx) {
		this.resetProperties();
		ctx.save();
		ctx.strokeStyle = this.person.strokeStyle;
		ctx.textAlign = 'center';
		this.drawSymbol(ctx);
		if (this.person.dod) {
			ctx.lineWidth = 1;
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
