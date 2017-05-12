class EnclosingLine extends ActorHandle {
	constructor() {
		super(100, 100);
		this.parent = this;
		this.addHandle(200, 100);
		this.addHandle(200, 200);
		this.addHandle(100, 200);
		this.addHandle(50, 150);
		this.addHandle(50, 120);
		this.spawnList = this.list;
	}

	addHandle(x, y) {
		let handle = new ActorHandle(x, y);

		handle.parent = this;
		this.add(handle);
	}

	isHit(x, y) {
		let hit = super.isHit(x, y);

		this.hit = hit;
		this.lineHit = false;
		this.listAll.forEach(node => {
			if (node.isLineHit(x, y)) {
				this.lineHit = true;
			}
		});
		return hit | this.lineHit;
	}

	drawLine(ctx) {
		ctx.lineWidth = .5;
		ctx.strokeStyle = 'lightglay';
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		this.listAll.forEach(pt => {
			ctx.lineTo(pt.x, pt.y);
		});
		ctx.stroke();
	}

	drawAll(ctx) {
//this.drawLine(ctx);
		if (this.selected) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'navy';
		} else if (this.lineHit) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'aqua';
		} else {
			ctx.lineWidth = 1;
		}
		this.listAll.forEach(node => {
//node.drawGuide(ctx);
//node.drawSelfCurve(ctx);
			node.drawCurve(ctx);
		});
	}

	draw(ctx) {
		super.draw(ctx);
		ctx.save();
		this.drawAll(ctx);
		ctx.restore();
	}
}
