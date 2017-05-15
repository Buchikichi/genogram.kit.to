class Chain extends Actor {
	constructor(id = null, gender) {
		super();
		if (id == null) {
			this.id = UUID.toString();
//console.log('UUID:' + this.id);
		} else {
			this.id = id;
		}
		this.gender = gender;
		this.parents = null; // 誰の子か
		this.relationList = [];
		this.partnerOrder = 0; // 相手から見ての順序
	}

	get gender() {
		return this._gender;
	}

	set gender(val) {
		this._gender = val;
		this.attributeChanged();
	}

	attributeChanged() {
		// abstract
	}

	get isMale() {
		return this.gender == 'm';
	}

	get mother() {
		if (!this.parents) {
			return null;
		}
		return this.parents.mother;
	}

	get father() {
		if (!this.parents) {
			return null;
		}
		return this.parents.father;
	}

	get numOfPartner() {
		return this.relationList.length;
	}

	get partnerList() {
		let list = [];

		this.relationList.forEach(relation => {
			list.push(relation.getPartner(this));
		});
		return list;
	}

	get hasChild() {
		let result = false;

		this.relationList.forEach(relation => {
			if (0 < relation.children.length) {
				result = true;
			}
		});
		return result;
	}

	/**
	 * 占める領域を求める.
	 * @return {left, right}
	 */
	listOccupancy(depth = 1) {
		let left = 1;
		let right = 1;
		let pl = 1;
		let pr = 1;

		this.relationList.forEach(relation => {
			let children = relation.children;

//			if (!childrenList) {
//				
//			}
		});
		return {left: left, right: right};
	}

	addParents(relation) {
		let father = relation.father;
		let mother = relation.mother;

		mother.addPartner(relation);
		relation.addChild(this);
		this.parents = relation;
	}

	addPartner(relation) {
		if (this.relationList.indexOf(relation) != -1) {
			return this.relationList.length;
		}
		let len = this.relationList.push(relation);
		let partner = relation.getPartner(this);

		partner.partnerOrder = len;
		partner.addPartner(relation);
		return len;
	}

	remove() {
		if (this.parents) {
			this.parents.removeChild(this);
		}
		this.eject();
	}
}
