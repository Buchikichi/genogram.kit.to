class ActorHandle extends Actor {
	constructor(x, y) {
		super(x, y);
		this.radius = 10;
		this.prev = this;
		this.next = this;
	}

	/**
	 * 自分が最後になるリスト
	 */
	get list() {
		let list = [];
		let target = this.next;
		let cnt = 0;

		for (;;) {
			target.count = ++cnt;
			list.push(target);
			if (target == this) {
				target.count = 0;
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

		return {x:x, y:y};
	}

	get nextCp() {
		let radian = this.radian;
		let len = this.getDistance(this.next) * .2;
		let x = this.x + Math.cos(radian) * len;
		let y = this.y + Math.sin(radian) * len;

		return {x:x, y:y};
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
		let diffX = this.x - x;
		let diffY = this.y - y;
		let distance = Math.sqrt(diffX * diffX + diffY * diffY);

		this.hit = distance < this.radius;
		return this.hit;
	}

	draw(ctx) {
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

	drawCurve(ctx) {
		let fCp = this.nextCp;
		let sCp = this.next.prevCp;

		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.bezierCurveTo(fCp.x, fCp.y, sCp.x, sCp.y, this.next.x, this.next.y);
		ctx.stroke();
	}
}
