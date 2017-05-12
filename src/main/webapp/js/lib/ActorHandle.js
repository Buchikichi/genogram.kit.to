class ActorHandle extends Actor {
	constructor(x, y) {
		super(x, y);
		this.radius = 4;
		this.logicalRadius = this.radius * 2;
		this.prev = this;
		this.next = this;
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

	draw(ctx) {
		if (!this.parent.selected) {
			return;
		}
		ctx.save();
		ctx.beginPath();
		if (this.hit) {
			ctx.fillStyle = 'aqua';
		} else {
			ctx.fillStyle = 'gray';
		}
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
	}

	drawGuide(ctx) {
		let prevCp = this.prevCp;
		let nextCp = this.nextCp;

		ctx.save();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'cyan';
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(prevCp.x, prevCp.y);
		ctx.stroke();

		ctx.strokeStyle = 'lime';
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(nextCp.x, nextCp.y);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * 自作の曲線.
	 */
	drawSelfCurve(ctx) {
		let fCp = this.nextCp;
		let sCp = this.next.prevCp;
		let dist = this.getDistance(this.next);
		let max = dist / this.radius;

		ctx.save();
		for (let cnt = 0; cnt < max; cnt++) {
			let fpt = this.getInterimPoint(fCp, cnt, max);
			let spt = sCp.getInterimPoint(this.next, cnt, max);
			let cpt = fCp.getInterimPoint(sCp, cnt, max);
			let mpt = fpt.getInterimPoint(cpt, cnt, max);
			let npt = cpt.getInterimPoint(spt, cnt, max);
			let ppt = mpt.getInterimPoint(npt, cnt, max);

			ctx.strokeStyle = 'pink';
			ctx.beginPath();
			ctx.arc(ppt.x, ppt.y, this.radius, 0, Math.PI * 2, false);
			ctx.stroke();
		}
		ctx.restore();
	}

	/**
	 * 曲線を描画.
	 */
	drawCurve(ctx) {
		let fCp = this.nextCp;
		let sCp = this.next.prevCp;

		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.bezierCurveTo(fCp.x, fCp.y, sCp.x, sCp.y, this.next.x, this.next.y);
		ctx.stroke();
	}
}
