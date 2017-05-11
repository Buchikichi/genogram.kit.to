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
		this.partnerList = [];
		this.childrenMap = {};
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
		return this.partnerList.length;
	}

	get hasChild() {
		if (!this.isMale) {
			return 0 < Object.keys(this.childrenMap).length;
		}
		let result = false;

		this.partnerList.forEach(partner => {
			if (partner.hasChild) {
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

		this.partnerList.forEach(partner => {
			let childrenList = this.childrenMap[partner.id];

//			if (!childrenList) {
//				
//			}
		});
		return {left: left, right: right};
	}

	addParents(relation) {
		let father = relation.father;
		let mother = relation.mother;

		mother.addPartner(father);
		relation.addChild(this);
		this.parents = relation;
	}

	addPartner(partner) {
		this.partnerList.push(partner);
		partner.partnerList.push(this);
	}

	/**
	 * 子の一覧.
	 */
	listRealChildren(partner) {
		let children = this.childrenMap[partner.id];

		if (!children) {
			return [];
		}
		return children;
	}

	/**
	 * 子(嫁・婿含む)の一覧.
	 */
	listChildren(partner) {
		let list = [];
		let children = this.childrenMap[partner.id];

		if (!children) {
			return list;
		}
		children.forEach(child => {
			let partnerList = child.partnerList;

			if (child.isMale) {
				list.push(child);
				list = list.concat(partnerList);
			} else {
				list = list.concat(partnerList);
				list.push(child);
			}
		});
		return list;
	}

	remove() {
		if (this.parents) {
			this.parents.removeChild(this);
		}
		this.eject();
	}
}
