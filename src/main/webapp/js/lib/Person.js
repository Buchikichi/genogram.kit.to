class Person extends Ties {
	constructor(gender = 'u') {
		super(gender);
		this.seq = Tally.increment();
		if (Field.DEBUG) {
			this.name = AlphabeticalTally.increment();
		} else {
			this.name = '';
		}
		this._description = null;
		this._dob = ''; // Date of birth
		this._dod = ''; // Date of death
		this.illness = 0;
		this.abuse = 0;
		this.attr = '';
		this.principal = false; // 本人(主役?)かどうか
	}

	get description() {
		if (this._description == null) {
			return '';
		}
		return this._description.text;
	}
	set description(text) {
		if (text == null || text.length == 0) {
			if (this._description != null) {
				this._description.eject();
				this._description = null;
			}
		} else {
			if (this._description != null) {
				this._description.text = text;
			} else {
				this._description = new Description(this, text, 1);
				this.spawnList.push(this._description);
			}
		}
	}
	get dx() {
		if (this._description == null) {
			return 0;
		}
		return this._description.dx;
	}
	set dx(val) {
		if (this._description == null) {
			return;
		}
		this._description.dx = val;
	}
	get dy() {
		if (this._description == null) {
			return 0;
		}
		return this._description.dy;
	}
	set dy(val) {
		if (this._description == null) {
			return;
		}
		this._description.dy = val;
	}

	get dob() {
		return this._dob;
	}
	set dob(val) {
		this._dob = val;
		this.attributeChanged();
	}
	get dod() {
		return this._dod;
	}
	set dod(val) {
		this._dod = val;
		this.attributeChanged();
	}

	get age() {
		let cal = new GenoCalendar(this.dob);

		return cal.age;
	}

	get info() {
		let info = this.name;
		let age = this.age;

		if (age) {
			info += '(' + age + ')';
		}
		return info;
	}

	get radius() {
		return Field.Instance.spacing / 2;
	}

	attributeChanged() {
		let age = this.age;

		if (age != null && age < 0) {
			if (this.dod) {
				this.symbol = new MiscarriageSymbol(this);
			} else {
				this.symbol = new FetusSymbol(this);
			}
		} else if (this.isMale) {
			this.symbol = new MaleSymbol(this);
		} else {
			this.symbol = new FemaleSymbol(this);
		}
	}

	touch(target) {
		let diffX = this.x - target.x;
		let diffY = this.y - target.y;
		let distance = Math.sqrt(diffX * diffX + diffY * diffY);

		if (distance <= 1) {
			this.touched = true;
		}
		return this.touched;
	}

	isHit(px, py) {
		let spacing = Field.Instance.spacing;
		let x = px / spacing;
		let y = py / spacing;

		this.hit = this.symbol.isHit(x, y);
		return this.hit;
	}

	drawSymbol(ctx) {
		if (this.selected) {
			this.strokeStyle = 'navy';
			ctx.lineWidth = 5;
		} else if (this.hit) {
			this.strokeStyle = 'aqua';
			ctx.lineWidth = 5;
		} else {
			this.strokeStyle = 'black';
			ctx.lineWidth = 3;
		}
if (this.touched) {
	this.strokeStyle = 'red';
}
		this.symbol.draw(ctx);
	}

	drawAncestorOccupancy(ctx) {
		if (!this.parents) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let oc = this.ancestorOccupancy(new Occupancy(this));
		let left = oc.left + .1;
		let right = oc.right - .1;
		let y = (this.y - .1) * spacing;

		ctx.strokeStyle = 'purple';
		ctx.beginPath();
		ctx.moveTo(left * spacing, y);
		ctx.lineTo(right * spacing, y);
		ctx.stroke();
	}

	drawDescendantOccupancy(ctx) {
		let spacing = Field.Instance.spacing;
		let oc = this.descendantOccupancy();
		let left = oc.left + .2;
		let right = oc.right - .2;
		let y = (this.y + .1) * spacing;

		ctx.lineWidth = 3;
		ctx.strokeStyle = 'green';
		ctx.beginPath();
		ctx.moveTo(left * spacing, y);
		ctx.lineTo(right * spacing, y);
		ctx.stroke();
	}

	drawOccupancy(ctx) {
		if (!Field.DEBUG) {
			return;
		}
		this.drawAncestorOccupancy(ctx);
//		this.drawDescendantOccupancy(ctx);
	}

	drawChain(ctx) {
		if (!this.prevActor || !Field.DEBUG) {
			return;
		}
		let keys = Controller.Instance.keys;
		if (!this.hit && !keys['Control']) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let prev = this.prevActor;
		let isSibling = this.isSibling(prev);
		let bx = prev.x - this.x;
		let by = prev.y - this.y;
		let ex = 0;
		let ey = 0;

		if (bx < 0) {
			by -= .2;
			ex -= .1 * spacing;
			ey -= .2 * spacing;
		} else {
			by += .2;
			ex += .1 * spacing;
			ey += .2 * spacing;
		}
		bx *= spacing;
		by *= spacing;
		ctx.lineWidth = .6;
		ctx.strokeStyle = 'lime';
		ctx.beginPath();
		ctx.arc(bx, by, 4, 0, Math.PI * 2, false);
		ctx.moveTo(bx, by);
		if (isSibling) {
			let cx = bx + (ex - bx) / 2;
			let cy = by - spacing * .5;

			ctx.quadraticCurveTo(cx, cy, ex, ey);
		} else {
			ctx.lineTo(ex, ey);
		}
		ctx.stroke();
	}

	draw(ctx) {
		let spacing = Field.Instance.spacing;
		let x = this.x * spacing;
		let y = this.y * spacing;

		ctx.save();
//console.log('[' + this.x + ',' + this.y + ']' + this.id);
		this.drawOccupancy(ctx);
		ctx.translate(x, y);
		this.drawChain(ctx);
		this.drawSymbol(ctx);
		ctx.restore();
	}

	/**
	 * フォームに値をセット.(保存用)
	 */
	appendTo(form, prefix) {
		Person.Properties.forEach(prop => {
			let val = this[prop];

			if (val) {
				form.append(prefix + prop, val);
			}
		});
	}

	static createFromEntity(rec) {
		let person = new Person();

		Person.Properties.forEach(prop => {
			let val = rec[prop];

			if (val) {
				person[prop] = val;
			}
		});
		return person;
	}
}
Person.MarriageableAge = 10;
Person.Properties = [
	'id', 'seq', 'name', 'description', 'dx', 'dy',
	'gender', 'dob', 'dod', 'illness', 'abuse', 'attr',
	'bornOrder', 'generation',
	'prevId', 'rx', 'ry',
];
