class CloseHostileRelation extends Relationship {
	constructor(person, other) {
		super(person, other);
		this.createFillStyle('img/relation.closeHostile.png');
	}
}
