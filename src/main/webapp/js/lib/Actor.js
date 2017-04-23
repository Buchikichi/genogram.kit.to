class Actor extends People {
	constructor(id = null) {
		super(id);
		this.x = 0;
		this.y = 0;
		this.radius = 32;
	}

	scanChildren(list) {
		let spacing = Field.Instance.spacing;
		let childrenKeys = Object.keys(this.childrenMap);
		let cy = this.y + spacing;

		childrenKeys.forEach(key => {
			let childrenList = this.childrenMap[key];
			let clen = childrenList.length;
			let width = ((clen - 1) * spacing);
			let cx = this.x - width / 2;

			cx -= spacing / 2;
//console.log('childrenList:' + childrenList.length);
			childrenList.forEach(target => {
//console.log('cx:' + cx);
				target.x = cx;
				target.y = cy;
				cx += spacing;
				if (list.indexOf(target) === -1) {
					target.scanAll(list);
				}
			});
		});
	}

	scanAll(list) {
		if (list.indexOf(this) !== -1) {
			// すでに自分が含まれる
console.log('*WARN*');
			return;
		}
		let spacing = Field.Instance.spacing;
		let half = spacing / 2;
		let px = this.x;
		let plen = this.partnerList.length;

		list.push(this);
		if (this.mother && list.indexOf(this.mother) === -1) {
			this.mother.x = this.x + half;
			this.mother.y = this.y - spacing;
			this.mother.scanAll(list);
		}
		this.partnerList.forEach(target => {
			if (list.indexOf(target) !== -1) {
				return;
			}
			px += spacing * (this.isMale ? 1 : -1);
			target.x = px;
			target.y = this.y;
			target.scanAll(list);
		});
		this.scanChildren(list);
	}

	addParents() {
		let father = new Actor();
		let mother = new Actor();

		father.gender = 'm';
		mother.gender = 'f';
		mother.addPartner(father);
		mother.addChild(father, this);
		this.mother = mother;
	}

	addPartner(partner = null) {
		let newPartner = partner;

		if (!partner) {
			let gender = this.gender;

			newPartner = new Actor();
			newPartner.gender = gender == 'm' ? 'f' : gender == 'f' ? 'm' : '';
		}
		this.partnerList.push(newPartner);
		newPartner.partnerList.push(this);
	}

	addChild(partner, child) {
		let key = partner.id;
		let list = this.childrenMap[key];

		if (!list) {
			list = [];
			this.childrenMap[key] = list;
		}
		list.push(child);
	}

	isHit(x, y) {
		let diffX = this.x - x;
		let diffY = this.y - y;
		let distance = Math.sqrt(diffX * diffX + diffY * diffY);

//console.log('distance:' + distance + '[' + x + ',' + y + ']');
		this.hit = null;
		if (distance < this.radius) {
			this.hit = this;
			return this.hit;
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
		if (this.gender == 'm') {
			let bx = -this.radius;
			let by = -this.radius;
			let width = this.radius * 2;

			ctx.strokeRect(bx, by, width, width);
			return;
		}
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
		ctx.stroke();
	}

	drawName(ctx) {
		let text = this.name;
		let metrics = ctx.measureText(text);
		let x = -metrics.width / 2;
		let y = 0 + this.radius;

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
ctx.strokeStyle = 'red';
					ctx.moveTo(tx, my);
					ctx.lineTo(cx, my);
					first = false;
				}
ctx.strokeStyle = 'navy';
				ctx.moveTo(cx, my);
				ctx.lineTo(cx, cy);
				ctx.stroke();
				last = target;
			});
		});
//		ctx.beginPath();
//		ctx.moveTo(tx, my);
//		ctx.lineTo(last.x - this.x, my);
//		ctx.stroke();
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
