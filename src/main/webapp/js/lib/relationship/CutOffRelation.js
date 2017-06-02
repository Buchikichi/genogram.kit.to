class CutOffRelation extends Relationship {
	constructor(person, other) {
		super(person, other);
		this.createFillStyle('img/relation.cutOff.png', 'no-repeat');
	}

	drawLine(ctx, width, height) {
		let spacing = Field.Instance.spacing;
		let hH = height / 2;
		let left = this.left * spacing;
		let right = this.right * spacing;

		ctx.save();
		ctx.translate(-hH, -hH);
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(0, 0, width, height);
		ctx.restore();

		ctx.beginPath();
		ctx.moveTo(left, 0);
		ctx.lineTo(-hH * .8, 0);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(right, 0);
		ctx.lineTo(hH * .8, 0);
		ctx.stroke();
	}
}
