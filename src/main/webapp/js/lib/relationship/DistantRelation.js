class DistantRelation extends Relationship {
	constructor(person, other) {
		super(person, other);
		this.createFillStyle('img/relation.distant.png');
	}
}
