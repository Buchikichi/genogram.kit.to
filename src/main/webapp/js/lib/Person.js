class Person extends Chain {
	constructor(id = null, gender = '') {
		super(id, gender);
		this.name = '';
		this.description = '';
		this.dob = ''; // Date of birth
		this.dod = ''; // Date of death
		this.radius = 32;
		this.principal = false; // 本人(主役?)かどうか
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

	attributeChanged() {
		if (this.isMale) {
			this.symbol = new MaleSymbol(this);
		} else {
			this.symbol = new FemaleSymbol(this);
		}
	}

	scanAll(list, depth = 0) {
		if (list.indexOf(this) !== -1) {
			// すでに自分が含まれる
			return;
		}
		this.depth = depth;
		this.fixed = false;
		this.touched = false;
		list.push(this);
		if (this.mother) {
			this.mother.scanAll(list, depth - 1);
		}
		this.relationList.forEach(relation => {
			let partner = relation.getPartner(this);

			partner.scanAll(list, depth);
			relation.children.forEach(child => {
				child.scanAll(list, depth + 1);
			});
		});
	}

	calculate() {
		if (this.fixed) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let half = spacing / 2;

		if (this.mother && !this.mother.fixed) {
			this.mother.x = this.x + half;
			this.mother.y = this.y - spacing;
			this.mother.calculate();
			return;
		}
		this.count = Tally.increment();
		this.fixed = true;
		this.relationList.forEach((relation, px) => {
			let partner = relation.getPartner(this);
			let realChildren = relation.children;
			let onlyChild = realChildren.length == 1; // 一人っ子
			let allChildren = relation.allChildren;
			let len = onlyChild ? 0 : allChildren.length - 1;
			let width = spacing * len;

console.log('#' + this.count + ' ch:' + realChildren.length + '/' + allChildren.length);
			if (!partner.fixed) {
				partner.x = this.x + spacing * (px + 1) * (this.isMale ? 1 : -1);
				partner.y = this.y;
				partner.calculate();
			}
			let cx = relation.rect.center - width / 2;
			let cy = this.y + spacing;
			realChildren.forEach(child => {
				let margin = child.numOfPartner * spacing;
console.log('child#' + child.count + ' cx:' + cx);
				if (!child.isMale && !onlyChild) {
					cx += margin;
				}
				child.x = cx;
				child.y = cy;
				child.calculate();
				if (child.isMale) {
					cx += margin;
				}
				cx += spacing;
			});
		});
	}

	touch(target) {
		let diffX = this.x - target.x;
		let diffY = this.y - target.y;
		let distance = Math.sqrt(diffX * diffX + diffY * diffY);
		let spacing = Field.Instance.spacing;

		if (distance < spacing) {
			this.touched = true;
		}
		return this.touched;
	}

	isHit(x, y) {
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
		ctx.strokeStyle = this.strokeStyle;
		if (this.touched) {
			ctx.strokeStyle = 'red';
		}
		this.symbol.draw(ctx);
	}

	drawChildLine(ctx) {
		let spacing = Field.Instance.spacing;
		let half = spacing / 2;
		let my = this.y + half + half / 4;
		let first = true;
		let last = null;

		this.relationList.forEach(relation => {
			if (relation.children.length == 0) {
				return;
			}
			let rect = relation.rect;
			let tx = rect.center;
			let ty = rect.bottom;

			ctx.beginPath();
			ctx.moveTo(tx, ty);
			ctx.lineTo(tx, my);
			relation.children.forEach(child => {
				let cx = child.x
				let cy = child.y - this.radius;

				if (first) {
					ctx.lineTo(cx, my);
					ctx.stroke();
					first = false;
				}
				ctx.beginPath();
				ctx.moveTo(cx, my);
				ctx.lineTo(cx, cy);
				ctx.stroke();
				last = child;
			});
			ctx.beginPath();
			ctx.moveTo(tx, my);
			ctx.lineTo(last.x, my);
			ctx.stroke();
		});
	}

	draw(ctx) {
		ctx.save();
//console.log('[' + this.x + ',' + this.y + ']' + this.id);
		this.drawChildLine(ctx);
		ctx.translate(this.x, this.y);
		this.drawSymbol(ctx);
		ctx.restore();
	}
}
