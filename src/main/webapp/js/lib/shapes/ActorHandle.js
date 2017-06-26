class ActorHandle extends Actor {
	constructor(x, y, z) {
		super(x, y, z);
		this.type = 'EnclosureHandle';
		this.holdable = true;
		this.radius = .15;
		this.logicalRadius = this.radius * 2;
		this.prev = this;
		this.next = this;
		this.initImage();
	}

	initImage() {
		let ctx = FlexibleView.Instance.ctx;

		if (typeof ctx.setLineDash === 'function') {
			return;
		}
		this.dottedImage = new Image();
		this.dottedImage.src = 'img/relation.dotted.png';
		this.dottedImage.onload = ()=> {
			this.dottedStyle = ctx.createPattern(this.dottedImage, 'repeat');
		};
	}

	get isRoot() {
		return this.parent.root == this;
	}

	/** 保存用ID. */
	get regId() {
		return this.isRoot ? this.parent.id : this.id;
	}
	get parentId() {
		return this.isRoot ? null : this.parent.id;
	}
	get lineStyle() {
		return this.parent.lineStyle;
	}

	/**
	 * 自分を含まないリスト.
	 */
	get list() {
		let list = [];

		for (let target = this.next; target != this;) {
			list.push(target);
			target = target.next;
		}
		return list;
	}

	/**
	 * 自分が最後になるリスト.
	 */
	get listAll() {
		let list = [];

		for (let target = this.next;;) {
			list.push(target);
			if (target == this) {
				break;
			}
			target = target.next;
		}
		return list;
	}

	get radian() {
		let prev = this.prev;
		let next = this.next;
		let diffX = next.x - prev.x;
		let diffY = next.y - prev.y;

		return Math.atan2(diffY, diffX);
	}

	get prevCp() {
		let radian = this.radian;
		let len = this.getDistance(this.prev) * .2;
		let x = this.x - Math.cos(radian) * len;
		let y = this.y - Math.sin(radian) * len;

		return new Actor(x, y);
	}

	get nextCp() {
		let radian = this.radian;
		let len = this.getDistance(this.next) * .2;
		let x = this.x + Math.cos(radian) * len;
		let y = this.y + Math.sin(radian) * len;

		return new Actor(x, y);
	}

	add(node) {
		let prev = this.prev;
		let next = this.next;

		this.next = node;
		node.prev = this;
		node.next = next;
		next.prev = node;
	}

	isHit(x, y) {
		if (!this.parent.selected) {
			return false;
		}
		this.hit = this.includes(x, y, this.logicalRadius);
		return this.hit;
	}

	isLineHit(x, y) {
		if (this.includes(x, y, this.logicalRadius)) {
			return false;
		}
		let hit = false;
		let fCp = this.nextCp;
		let sCp = this.next.prevCp;
		let dist = this.getDistance(this.next);
		let max = dist / this.radius;

		for (let cnt = 0; cnt < max; cnt++) {
			let fpt = this.getInterimPoint(fCp, cnt, max);
			let spt = sCp.getInterimPoint(this.next, cnt, max);
			let cpt = fCp.getInterimPoint(sCp, cnt, max);
			let mpt = fpt.getInterimPoint(cpt, cnt, max);
			let npt = cpt.getInterimPoint(spt, cnt, max);
			let ppt = mpt.getInterimPoint(npt, cnt, max);
			let diffX = ppt.x - x;
			let diffY = ppt.y - y;

			if (Math.sqrt(diffX * diffX + diffY * diffY) < this.radius) {
				hit = true;
			}
		}
		return hit;
	}

	increase() {
		let node = new ActorHandle(this.x + .1, this.y + .1, this.z);

		node.parent = this.parent;
		this.add(node);
		this.reserve(node);
	}

	eject() {
		super.eject();
		let prev = this.prev;
		let next = this.next;

		prev.next = next;
		next.prev = prev;
	}

	move(dx, dy) {
		super.move(dx, dy);
		Field.Instance.addTarget(this.parent);
	}

	drawGuide(ctx) {
		let spacing = Field.Instance.spacing;
		let x = this.x * spacing;
		let y = this.y * spacing;
		let prevCp = this.prevCp;
		let nextCp = this.nextCp;
		let px = prevCp.x * spacing;
		let py = prevCp.y * spacing;
		let nx = nextCp.x * spacing;
		let ny = nextCp.y * spacing;

		ctx.save();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'cyan';
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(px, py);
		ctx.stroke();

		ctx.strokeStyle = 'lime';
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(nx, ny);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * 自作の曲線.
	 */
	drawSelfCurve(ctx) {
		let spacing = Field.Instance.spacing;
		let fCp = this.nextCp;
		let sCp = this.next.prevCp;
		let dist = this.getDistance(this.next);
		let max = dist / this.radius;
		let radius = this.radius * spacing;

		ctx.save();
		for (let cnt = 0; cnt < max; cnt++) {
			let fpt = this.getInterimPoint(fCp, cnt, max);
			let spt = sCp.getInterimPoint(this.next, cnt, max);
			let cpt = fCp.getInterimPoint(sCp, cnt, max);
			let mpt = fpt.getInterimPoint(cpt, cnt, max);
			let npt = cpt.getInterimPoint(spt, cnt, max);
			let ppt = mpt.getInterimPoint(npt, cnt, max);
			let x = ppt.x * spacing;
			let y = ppt.y * spacing;

			ctx.strokeStyle = 'pink';
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2, false);
			ctx.stroke();
		}
		ctx.restore();
	}

	drawSimpleCurve(ctx) {
		let spacing = Field.Instance.spacing;
		let x = this.x * spacing;
		let y = this.y * spacing;
		let ex = this.next.x * spacing;
		let ey = this.next.y * spacing;
		let fCp = this.nextCp;
		let sCp = this.next.prevCp;
		let fx = fCp.x * spacing;
		let fy = fCp.y * spacing;
		let sx = sCp.x * spacing;
		let sy = sCp.y * spacing;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.bezierCurveTo(fx, fy, sx, sy, ex, ey);
		ctx.stroke();
	}

	/**
	 * 曲線を描画.
	 */
	drawCurve(ctx) {
		ctx.save();
		if (this.lineStyle == 'Dotted') {
			if (typeof ctx.setLineDash === 'function') {
				ctx.setLineDash([4]);
			} else {
				ctx.strokeStyle = this.dottedStyle;
			}
		}
		ctx.lineWidth = 1;
		this.drawSimpleCurve(ctx);
		if (this.parent.selected) {
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#4178be';
			this.drawSimpleCurve(ctx);
		} else if (this.parent.hit) {
			ctx.lineWidth = 3;
			ctx.strokeStyle = Field.Instance.hitStyle;
			this.drawSimpleCurve(ctx);
		}
		ctx.restore();
		if (EditorMain.DEBUG) {
//			this.drawGuide(ctx);
			this.drawSelfCurve(ctx);
		}
	}

	drawArc(ctx) {
		let spacing = Field.Instance.spacing;
		let x = this.x * spacing;
		let y = this.y * spacing;

		ctx.save();
		ctx.beginPath();
		if (this.hit) {
			ctx.fillStyle = 'aqua';
		} else {
			ctx.fillStyle = 'gray';
		}
		ctx.arc(x, y, this.radius * spacing, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
	}

	draw(ctx) {
		this.drawCurve(ctx);
		if (!this.parent.selected) {
			return;
		}
		this.drawArc(ctx);
		// 曲線に対しハンドルを上書き
		this.next.drawArc(ctx);
	}
}
