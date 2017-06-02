class FocusedRelation extends Relationship {
	constructor(person, other) {
		super(person, other);
		this.createFillStyle('img/relation.focused.png');
	}

	draw(ctx) {
		super.draw(ctx);
		this.drawTriangle(ctx);
	}
}
