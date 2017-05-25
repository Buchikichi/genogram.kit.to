class Person extends Ties {
	constructor(id = null, gender = '') {
		super(id, gender);
		this.name = AlphabeticalTally.increment();
		this._description = null;
		this.dob = ''; // Date of birth
		this.dod = ''; // Date of death
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
		let occupancyList = [];
		let px = 1;
		let partnerList = [];
		let relationList = [];
		this.listPartner(partnerList);
		let pos = partnerList.indexOf(this);
		let bx = -pos * 2;
//console.log('pos:' + pos);
//console.log(partnerList);

		partnerList.forEach(person => {
			if (person != this && !person.fixed) {
				person.x = this.x + bx;
				person.y = this.y;
			}
			person.count = Tally.increment();
			person.fixed = true;
			bx += 2;
		});
		partnerList.forEach(person => {
			person.relationList.forEach(relation => {
				if (relationList.indexOf(relation) == -1) {
					relationList.push(relation);
				}
			});
			if (person.mother && !person.mother.fixed) {
				person.mother.x = person.x + half;
				person.mother.y = person.y - spacing;
				person.mother.calculate();
				return;
			}
		});
		this.relationList.forEach((relation, rx) => {
			this.calculateChildren(relation);
		});

//		this.relationList.forEach((relation, rx) => {
//			let partner = relation.getPartner(this);
//			let occupancy = relation.occupancy;
//
//console.log('#' + this.count + ' ch:' + relation.children.length + '/' + relation.allChildren.length);
//			if (!partner.fixed) {
//				let dir = this.isMale ? 1 : -1;
//				let diff = 0;
//
//				if (0 < occupancy.left) {
//					occupancyList.forEach((oc, cnt) => {
//						if (oc.left == 0) {
//							return;
//						}
//						let sum = 0;
//						let dist = (rx - cnt) * 2;
//
////console.log('dist:' + dist);
//						if (this.isMale) {
//							sum = occupancy.left + oc.right - dist;
//						} else {
//							sum = occupancy.right + oc.left - dist;
//console.log('sum:' + sum + '/right:' + occupancy.right + '/left:' + oc.left);
//						}
//						diff = Math.max(diff, sum);
////console.log('diff:' + diff + '/' + px);
//					});
//				}
//				px += partner.partnerList.length - 1;
//				px += diff / 2;
//				partner.x = this.x + px * dir * spacing;
//				partner.y = this.y;
//				partner.calculate();
//				px++;
//			}
//			occupancyList.push(occupancy);
//			this.calculateChildren(relation);
//		});
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
//		this.drawAncestorOccupancy(ctx);
		this.drawDescendantOccupancy(ctx);
	}

	drawChain(ctx) {
		if (!this.prevActor) {
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
//this.drawOccupancy(ctx);
		ctx.translate(x, y);
//this.drawChain(ctx);
		this.drawSymbol(ctx);
		ctx.restore();
	}
}
