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
		this.mother = null;
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

	get father() {
		if (!this.mother) {
			return;
		}
	}

	get numOfPartner() {
		return this.partnerList.length;
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

	addParents(father, mother) {
		mother.addPartner(father);
		mother.addChild(father, this);
		this.mother = mother;
	}

	addPartner(partner) {
		this.partnerList.push(partner);
		partner.partnerList.push(this);
	}

	addChild(partner, child) {
		let key = partner.id;
		let list = this.childrenMap[key];

		if (!list) {
			list = [];
			this.childrenMap[key] = list;
		}
		child.mother = this;
		list.push(child);
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
}
