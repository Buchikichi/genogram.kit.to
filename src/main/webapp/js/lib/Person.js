class Person extends Chain {
	constructor(id = null) {
		super(id);
		this.name = '';
		this.description = '';
		this.dob = ''; // Date of birth
		this.dod = ''; // Date of death
		this.radius = 32;
		this.principal = false; // 本人(主役?)かどうか
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
		this.partnerList.forEach(partner => {
			let childrenList = this.listChildren(partner);
			let width = spacing * (childrenList.length - 1);
			let cx = this.x - half - width / 2;

console.log('#' + this.count + ' childrenList:' + childrenList.length);
			if (!partner.fixed) {
				partner.x = this.x + spacing * (partner.gender == 'm' ? -1 : 1);
				partner.y = this.y;
console.log('partner#' + partner.count + ':' + partner.x);
				partner.calculate();
			}
			childrenList.forEach(child => {
console.log('child#' + child.count + ' cx:' + cx);
				child.x = cx;
				child.y = this.y + spacing;
				child.calculate();
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
		let diffX = this.x - x;
		let diffY = this.y - y;

//console.log('distance:' + distance + '[' + x + ',' + y + ']');
		this.hit = null;
		if (this.isMale) {
			if (Math.abs(diffX) < this.radius && Math.abs(diffY) < this.radius) {
				this.hit = this;
				return this.hit;
			}
		} else {
			let distance = Math.sqrt(diffX * diffX + diffY * diffY);

			if (distance < this.radius) {
				this.hit = this;
				return this.hit;
			}
		}
		if (this.isMale || this.numOfPartner == 0) {
			return null;
		}
		this.partnerList.forEach(partner => {
			let relation = new Relation(partner, this);

			if (relation.isHit(x, y)) {
				this.hit = relation;
			}
		});
		return this.hit;
	}

	drawSymbol(ctx) {
		if (this.hit == this) {
			ctx.lineWidth = 5;
		} else {
			ctx.lineWidth = 2;
		}
		ctx.strokeStyle = this.strokeStyle;
		if (this.touched) {
			ctx.strokeStyle = 'red';
		}
		// 図形描画
		let symbol;

		if (this.gender == 'm') {
			symbol = new MaleSymbol(this);
		} else {
			symbol = new FemaleSymbol(this);
		}
		symbol.draw(ctx);
	}

	drawName(ctx) {
		let text = this.name;
//text = this.count + ':' + text;
		let metrics = ctx.measureText(text);
		let x = -metrics.width / 2;
		let y = 20 + this.radius;

		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.strokeText(text, x, y);
	}

	/**
	 * パートナー.
	 */
	drawPartnerLine(ctx) {
		if (!this.isMale) {
			return;
		}
//console.log('drawPartnerLine:' + this.gender);
		let plen = this.partnerList.length;
		let x = 1 < plen ? 0 : this.radius;
		let y = 1 < plen ? this.radius : 0;
		let height = 4;

		this.partnerList.forEach((target, ix) => {
			let relation = new Relation(this, target);
			let cx = target.x + (1 < plen ? 0 : -target.radius) - this.x;
			let width = cx - x;

			y += 4;
			relation.draw(ctx);
		});
	}

	drawChildLine(ctx) {
		if (Object.keys(this.childrenMap).length == 0) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let half = spacing / 2;
		let partners = this.numOfPartner;
		let my = this.y + half;
		let tx;
		let ty;

		if (partners == 1) {
			tx = this.x - half;
			ty = this.y;
		} else {
			tx = this.x - half;
			ty = this.y;
		}
		// top
		ctx.beginPath();
		ctx.moveTo(tx, ty);
		ctx.lineTo(tx, my);
		ctx.stroke();
		// bottom
		let first = true;
		let last = null;
		Object.keys(this.childrenMap).forEach(key => {
			let childrenList = this.childrenMap[key];

			childrenList.forEach(target => {
				let cx = target.x
				let cy = target.y - this.radius;
	
				ctx.beginPath();
				if (first) {
					ctx.moveTo(tx, my);
					ctx.lineTo(cx, my);
					first = false;
				}
				ctx.moveTo(cx, my);
				ctx.lineTo(cx, cy);
				ctx.stroke();
				last = target;
			});
		});
		ctx.beginPath();
		ctx.moveTo(tx, my);
		ctx.lineTo(last.x, my);
		ctx.stroke();
	}

	drawLine(ctx) {
		this.drawPartnerLine(ctx);
		this.drawChildLine(ctx);
	}

	draw(ctx) {
		if (this.hit == this) {
			this.strokeStyle = 'aqua';
		} else {
			this.strokeStyle = 'black';
		}
		ctx.save();
//console.log('[' + this.x + ',' + this.y + ']' + this.id);
		if (this.hit instanceof Relation) {
			this.hit.drawHighlight(ctx);
		}
		this.drawLine(ctx);
		ctx.translate(this.x, this.y);
		this.drawSymbol(ctx);
		this.drawName(ctx);
		ctx.restore();
	}
}
