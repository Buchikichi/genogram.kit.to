class PhysicalAbuseRelation extends Relationship {
	constructor(person, other) {
		super(person, other);
		this.createFillStyle('img/relation.hostile.png');
	}

	draw(ctx) {
		super.draw(ctx);
		this.drawTriangle(ctx);
	}
}
