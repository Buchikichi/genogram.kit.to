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
	 * 相手から見て何番目か.
	 */
	getOrder(partner) {
		let result = -1;

		this.relationList.forEach((relation, ix) => {
			if (this.isMale) {
				if (relation.mother == partner) {
					result = ix;
				}
				return;
			}
			if (relation.father == partner) {
				result = ix;
			}
		});
		return result;
	}

	/**
	 * 自分を含む全てのパートナー.
	 */
	listPartner(list) {
		if (list.indexOf(this) != -1) {
			return;
		}
		let partnerList = this.partnerList;

		if (this.isMale) {
			list.push(this);
		} else {
			partnerList.reverse();
		}
		partnerList.forEach(partner => {
			partner.listPartner(list);
		});
		if (!this.isMale && list.indexOf(this) == -1) {
			list.push(this);
		}
	}

	ancestorOccupancy(occupancy = new Occupancy(), depth = 0) {
//		if (0 < depth) {
//		}
		if (!this.parents) {
			return occupancy;
		}
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
		if (0 < this.relationList.length) {
			this.relationList[0].type = 'd';
		}
		let len = this.relationList.unshift(relation);
		let partner = relation.getPartner(this);

		partner.addPartner(relation);
		this.relationList.forEach((rel, ix) => {
			rel.order = ix;
			rel.orderMax = len;
		});
		return len;
	}

	remove() {
		if (this.parents) {
			this.parents.removeChild(this);
		}
		this.eject();
	}
}
