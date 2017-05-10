class HostileRelation extends Relationship {
	constructor(person, other) {
		super(person, other);
		this.createFillStyle('img/relation.hostile.png');
	}
}
