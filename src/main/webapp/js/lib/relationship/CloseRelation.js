class CloseRelation extends Relationship {
	constructor(person, other) {
		super(person, other);
		this.createFillStyle('img/relation.close.png');
	}
}
