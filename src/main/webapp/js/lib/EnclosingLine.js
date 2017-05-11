class EnclosingLine extends ActorHandle {
	constructor() {
		super(100, 100);
		this.addPoint(200, 100);
		this.addPoint(200, 200);
		this.addPoint(100, 200);
		this.addPoint(50, 150);
		this.addPoint(50, 120);
		this.spawnList = this.list;
	}

	addPoint(x, y) {
		let handle = new ActorHandle(x, y);

		this.add(handle);
	}

	drawLine(ctx) {
		ctx.lineWidth = .5;
		ctx.strokeStyle = 'lightglay';
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		this.list.forEach(pt => {
			ctx.lineTo(pt.x, pt.y);
		});
		ctx.stroke();
	}

	drawAll(ctx) {
//		this.drawLine(ctx);
		this.list.forEach(node => {
			ctx.fillText(node.count, node.x, node.y);
//			node.drawGuide(ctx);
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
