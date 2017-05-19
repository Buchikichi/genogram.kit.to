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
		this.generation  = 0;
		// 相対位置
		this.prevActor = null;
		this.rx = 0;
		this.ry = 0;
		this.nextActor = null;
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
		let oc = occupancy;
		let partnerList = [];

		if (0 < depth) {
			this.listPartner(partnerList);

			let pos = partnerList.indexOf(this);
			let left = -pos * 2;
			let right = left + partnerList.length * 2;

			oc.merge(new Occupancy(0, left, right, 0));
		}
		if (this.parents) {
			this.parents.father.ancestorOccupancy(oc, depth + 1);
		}
		return oc;
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

	/**
	 * 距離を置く.
	 */
	leave(other) {
	}

	/**
	 * (自分の側に)配置する.
	 */
	assign(other, rx, ry = 0) {
		if (this.prevActor == other) {
			return;
		}
		other.prevActor = this;
		other.x = this.x;
		other.y = this.y;
		other.rx = rx;
		other.ry = ry;
		other.generation = this.generation;
		if (ry < 0) {
			other.generation--;
		} else if (0 < ry) {
			other.generation++;
		}
		this.nextActor = other;
	}

	reassign(other, rx, ry = 0) {
		if (this.prevActor == other) {
			this.rx = -rx;
			this.ry = -ry;
		}
		if (other.prevActor == this) {
			other.rx = rx;
			other.ry = ry;
		}
	}

	addParents(relation) {
		let father = relation.father;
		let mother = relation.mother;

		this.assign(mother, 1, -2);
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
		let next = this.relationList.length < 1 ? null : this.relationList[0].getPartner(this);
		let len = this.relationList.unshift(relation);

		this.relationList.forEach((rel, ix) => {
			rel.order = ix;
			rel.orderMax = len;
		});
		// 位置決め
		let partner = relation.getPartner(this);

		if (next && next.prevActor == this) {
			next.prevActor = partner;
		}
		this.assign(partner, this.isMale ? 2 : -2);
		partner.addPartner(relation);
		if (this.parents) {
			this.parents.reassign();
		}
		return len;
	}

	remove() {
		if (this.parents) {
			this.parents.removeChild(this);
		}
		this.eject();
	}

	move() {
		if (!this.prevActor) {
			return;
		}
		let ax = this.prevActor.x + this.rx;
		let ay = this.prevActor.y + this.ry;
		let diffX = ax - this.x;
		let diffY = ay - this.y;
		let absX = Math.abs(diffX);
		let absY = Math.abs(diffY);

		if (absX == 0 && absY == 0) {
			return;
		}
		if (absX <= Chain.MOVING_STEP) {
			this.x = ax;
		} else {
			if (diffX < 0) {
				this.x -= Chain.MOVING_STEP;
			} else if (0 < diffX) {
				this.x += Chain.MOVING_STEP;
			}
		}
		if (absY <= Chain.MOVING_STEP) {
			this.y = ay;
		} else {
			if (diffY < 0) {
				this.y -= Chain.MOVING_STEP;
			} else if (0 < diffY) {
				this.y += Chain.MOVING_STEP;
			}
		}
	}
}
Chain.MOVING_STEP = .9;
