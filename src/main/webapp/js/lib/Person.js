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
		this.partnerList.forEach(partner => {
			let childrenList = this.listChildren(partner);

			partner.scanAll(list, depth);
			childrenList.forEach(child => {
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
		this.partnerList.forEach((partner, px) => {
			let realChildren = this.listRealChildren(partner);
			let onlyChild = realChildren.length == 1; // 一人っ子
			let childrenList = this.listChildren(partner);
			let len = onlyChild ? 0 : childrenList.length - 1;
			let width = spacing * len;
			let cx = this.x - half - width / 2;
			let cy = this.y + spacing;

console.log('#' + this.count + ' ch:' + realChildren.length + '/' + childrenList.length);
			if (!partner.fixed) {
				partner.x = this.x + spacing * (px + 1) * (this.isMale ? 1 : -1);
				partner.y = this.y;
				partner.calculate();
			}
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
		if (Object.keys(this.childrenMap).length == 0) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let half = spacing / 2;
		let partners = this.numOfPartner;
		let my = this.y + half + half / 4;
		let first = true;
		let last = null;

		Object.keys(this.childrenMap).forEach(key => {
			let childrenList = this.childrenMap[key];

			childrenList.forEach(target => {
				let rect = target.parents.rect;
				let tx = target.mother.x - half; //rect.center;
				let ty = rect.bottom;
				let cx = target.x
				let cy = target.y - this.radius;

				ctx.beginPath();
				if (first) {
					ctx.moveTo(tx, ty);
					ctx.lineTo(tx, my);
					ctx.lineTo(cx, my);
					first = false;
				}
				ctx.moveTo(cx, my);
				ctx.lineTo(cx, cy);
				ctx.stroke();
				last = target;
			});
			ctx.beginPath();
			ctx.moveTo(last.mother.x - half, my);
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
