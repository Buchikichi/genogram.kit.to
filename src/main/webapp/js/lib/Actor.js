class Actor extends People {
	constructor(id = null) {
		super(id);
		this.x = 0;
		this.y = 0;
		this.radius = 32;
	}

	get left() {
		return this.x - this.radius;
	}

	get right() {
		return this.x + this.radius;
	}

	get top() {
		return this.y - this.radius;
	}

	get bottom() {
		return this.y + this.radius;
	}

	scanAll(list) {
		let spacing = Field.Instance.spacing;
		let px = this.x;
		let plen = this.partnerList.length;
		let clen = this.childrenList.length;
		let cx = this.x - ((clen - 1) * spacing) / 2;
		let y = this.y;

		list.push(this);
		this.partnerList.forEach(target => {
			px += spacing;
			target.x = px;
			target.y = this.y;
			if (list.indexOf(target) == -1) {
				target.scanAll(list);
			}
		});
		if (0 < plen) {
			cx += spacing / 2;
		}
		this.childrenList.forEach(target => {
			target.x = cx;
			target.y = y + spacing;
			cx += spacing;
			if (list.indexOf(target) == -1) {
				target.scanAll(list);
			}
		});
	}

	addPartner(partner = null) {
		if (partner) {
			this.partnerList.push(partner);
		} else {
			this.partnerList.push(new Actor());
		}
	}

	addChild(child = null) {
		if (child) {
			this.childrenList.push(child);
		} else {
			this.childrenList.push(new Actor());
		}
	}

	isHit(x, y) {
		let diffX = this.x - x;
		let diffY = this.y - y;
		let distance = Math.sqrt(diffX * diffX + diffY * diffY);

//console.log('distance:' + distance + '[' + x + ',' + y + ']');
		this.hit = distance < this.radius;
		return this.hit;
	}

	drawSymbol(ctx) {
		if (this.hit) {
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

	drawPartnerLine(ctx) {
		this.partnerList.forEach(target => {
			let cx = target.left - this.x;
			let cy = target.y - this.y;

			ctx.beginPath();
			ctx.moveTo(this.right, 0);
			ctx.lineTo(cx, cy);
			ctx.stroke();
		});
	}

	drawChildLine(ctx) {
		if (this.childrenList.length == 0) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let half = spacing / 2;
		let partners = this.partnerList.length;
		let my = this.y + half;
		let tx;
		let ty;

		if (partners == 0) {
			tx = this.x;
			ty = this.bottom;
		} else if (partners == 1) {
			tx = this.x + half;
			ty = this.y;
		} else {
			tx = this.x + half;
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
		this.childrenList.forEach(target => {
			let cx = target.x - this.x;
			let cy = target.top - this.y;

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
		ctx.beginPath();
		ctx.moveTo(tx, my);
		ctx.lineTo(last.x - this.x, my);
		ctx.stroke();
	}

	drawLine(ctx) {
		this.drawPartnerLine(ctx);
		this.drawChildLine(ctx);
	}

	draw(ctx) {
		if (this.hit) {
			this.strokeStyle = 'white';
		} else {
			this.strokeStyle = 'black';
		}
		ctx.save();
		ctx.translate(this.x, this.y);
//console.log('[' + this.x + ',' + this.y + ']' + this.id);
		this.drawLine(ctx);
		this.drawSymbol(ctx);
		this.drawName(ctx);
		ctx.restore();
	}
}
