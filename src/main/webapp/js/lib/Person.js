class Person extends Chain {
	constructor(id = null, gender = '') {
		super(id, gender);
		this.name = '';
		this.description = '';
		this.dob = ''; // Date of birth
		this.dod = ''; // Date of death
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

	get radius() {
		return Field.Instance.spacing / 2;
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

	calculateChildren(relation) {
		let spacing = 2;
		let realChildren = relation.children;
		let onlyChild = realChildren.length == 1; // 一人っ子
		let allChildren = relation.allChildren;
		let len = onlyChild ? 0 : allChildren.length - 1;
		let width = spacing * len;
		let cx = relation.rect.center - width / 2;
		let cy = this.y + spacing;

		realChildren.forEach(child => {
			let margin = child.numOfPartner * spacing;
//console.log('child#' + child.count + ' cx:' + cx);
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
	}

	calculate() {
		if (this.fixed) {
			return;
		}
		let spacing = 2;
		let half = 1;

		if (this.mother && !this.mother.fixed) {
			this.mother.x = this.x + half;
			this.mother.y = this.y - spacing;
			this.mother.calculate();
			return;
		}
		let occupancyList = [];
		let px = 1;

		this.count = Tally.increment();
		this.fixed = true;
		this.relationList.forEach((relation, rx) => {
			let partner = relation.getPartner(this);
			let occupancy = relation.occupancy;

console.log('#' + this.count + ' ch:' + relation.children.length + '/' + relation.allChildren.length);
			if (!partner.fixed) {
				let dir = this.isMale ? 1 : -1;
				let diff = 0;

				if (0 < occupancy.left) {
					occupancyList.forEach((oc, cnt) => {
						if (oc.left == 0) {
							return;
						}
						let sum = 0;
						let dist = (rx - cnt) * 2;

//console.log('dist:' + dist);
						if (this.isMale) {
							sum = occupancy.left + oc.right - dist;
						} else {
							sum = occupancy.right + oc.left - dist;
console.log('sum:' + sum + '/right:' + occupancy.right + '/left:' + oc.left);
						}
						diff = Math.max(diff, sum);
//console.log('diff:' + diff + '/' + px);
					});
				}
px += partner.partnerList.length - 1;
				px += diff / 2;
				partner.x = this.x + px * dir * spacing;
				partner.y = this.y;
				partner.calculate();
				px++;
			}
			occupancyList.push(occupancy);
			this.calculateChildren(relation);
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
		ctx.strokeStyle = this.strokeStyle;
		if (this.touched) {
			ctx.strokeStyle = 'red';
		}
		this.symbol.draw(ctx);
	}

	drawChildLine(ctx) {
		let spacing = Field.Instance.spacing;
		let my = (this.y + 1.25) * spacing;
		let first = true;
		let last = null;

		ctx.strokeStyle = Field.Instance.lineStyle;
		this.relationList.forEach(relation => {
			if (relation.children.length == 0) {
				return;
			}
			let rect = relation.rect;
			let tx = rect.center * spacing;
			let ty = rect.bottom * spacing;

			ctx.beginPath();
			ctx.moveTo(tx, ty);
			ctx.lineTo(tx, my);
			relation.children.forEach(child => {
				let cx = child.x * spacing;
				let cy = (child.y - .5) * spacing;

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
			ctx.lineTo(last.x * spacing, my);
			ctx.stroke();
		});
	}

	draw(ctx) {
		let spacing = Field.Instance.spacing;
		let x = this.x * spacing;
		let y = this.y * spacing;

		ctx.save();
//console.log('[' + this.x + ',' + this.y + ']' + this.id);
		this.drawChildLine(ctx);
		ctx.translate(x, y);
		this.drawSymbol(ctx);
//ctx.strokeStyle = 'green';
//ctx.strokeText(this.x + '/' + this.y, 0, 10);
		ctx.restore();
	}
}
