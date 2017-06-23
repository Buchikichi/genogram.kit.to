class GenoSymbol {
	constructor(person) {
		this.person = person;
	}

	drawIllness(ctx) {
		// abstract
	}

	drawAbuse(ctx) {
		// abstract
	}

	drawSymbol(ctx) {
		let bx = -this.radius;
		let by = -this.radius;
		let width = this.width;

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
		// abstract
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
		let y = -this.radius;

		ctx.save();
		ctx.textBaseline = 'bottom';
		ctx.fillText(text, 0, y);
		ctx.restore();
	}

	drawAge(ctx) {
		let text = this.person.age;

		if (text == null || text < 0) {
			return;
		}
//text = this.person.count + ':' + text;
		ctx.strokeText(text, 0, 0);
		ctx.fillText(text, 0, 0);
	}

	drawName(ctx) {
		let showName = Field.Instance.showName;

		if (showName == 'Off') {
			return;
		}
		let text = this.person.name;
		let y = 0;

		ctx.save();
		if (showName == 'Top') {
			y = -this.radius * .8;
			ctx.textBaseline = 'top';
		} else if (showName == 'Middle') {
			y = this.radius * .8;
			ctx.textBaseline = 'bottom';
		} else if (showName == 'Bottom') {
			ctx.textBaseline = 'top';
			y = this.radius * 1.1;
		}
		if (EditorMain.DEBUG) {
			text = '#' + this.person.generation + ':' + text;
		}
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'rgba(220, 220, 220, .8)';
		ctx.strokeText(text, 1, y + 1);
		ctx.fillText(text, 0, y);
		ctx.restore();
	}

	drawAttr(ctx) {
		let showName = Field.Instance.showName;
		let text = this.person.attr;
		let y = 0;

		ctx.save();
		if (showName == 'Middle') {
			y = -this.radius * .8;
			ctx.textBaseline = 'top';
		} else {
			y = this.radius * .8;
			ctx.textBaseline = 'bottom';
		}
		ctx.fillText(text, 0, y);
		ctx.restore();
	}

	resetProperties() {
		this.radius = this.person.radius;
		this.width = this.radius * 2;
		this.ir = this.radius * .85;
		this.fontSize = this.person.fontSize;
		this.textMargin = this.fontSize * .2;
		this.textHh = this.fontSize / 2 + this.textMargin;
	}

	draw(ctx) {
		this.resetProperties();
		ctx.save();
		this.drawIllness(ctx);
		this.drawAbuse(ctx);
		ctx.strokeStyle = this.person.strokeStyle;
		this.drawSymbol(ctx);
		if (this.person.dod) {
			ctx.lineWidth = .5;
			this.drawCross(ctx);
		}
		ctx.textAlign = 'center';
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'black';
		this.drawAge(ctx);
		this.drawYears(ctx);
		this.drawName(ctx);
		this.drawAttr(ctx);
		ctx.restore();
	}
}
GenoSymbol.ColorIllness = 'rgba(200, 200, 200, .6)';
GenoSymbol.ColorAbuse = 'rgba(200, 200, 200, .6)';
