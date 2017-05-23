class Chain extends Actor {
	constructor() {
		super();
		this.prevActor = null;
		this.rx = 0;
		this.ry = 0;
		this.nextActor = []; // 複数ある
		this.generation  = 0;
	}

	ancestorOccupancy(occupancy = new Occupancy(), depth = 0) {
		let oc = occupancy;
		let origin = oc.origin;
		let partnerList = [];

		if (0 < depth) {
			this.listPartner(partnerList);
			partnerList.forEach(partner => {
				oc.merge(new Occupancy(partner));
			});
		}
		if (this.parents) {
			this.parents.father.ancestorOccupancy(oc, depth + 1);
			this.parents.mother.ancestorOccupancy(oc, depth + 1);
//			if (0 < depth) {
//				this.parents.children.forEach(child => {
//				});
//			}
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
	assignActor(other, rx = 0, ry = 0) {
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
		this.nextActor.push(other);
	}

	addActor(other, rx, ry = 0) {
		let next = this.getNextPartner();

		other.prevActor = this;
		other.x = this.x;
		other.y = this.y;
		other.rx = rx;
		other.ry = ry;
		if (next) {
			let ix = this.nextActor.indexOf(next);
			let nx = next.x;
			let ny = next.y;

console.log('nextあり');
			next.prevActor = other;
			next.x = other.x;
			next.y = other.y;
			next.rx = rx;
			next.ry = ry;
			other.x = nx;
			other.y = ny;
			other.rx = next.rx;
			other.ry = next.ry;
			other.nextActor.push(other);
			this.nextActor.splice(ix, 1);
		}
		other.generation = this.generation;
		if (ry < 0) {
			other.generation--;
		} else if (0 < ry) {
			other.generation++;
		}
//console.log('generation:' + other.generation);
		this.nextActor.push(other);
	}

	insertActor(other, rx, ry = 0) {
		let prev = this.prevActor;
		let ix = prev.nextActor.indexOf(this);

		prev.nextActor.splice(ix, 1);
		prev.nextActor.push(other);
		other.prevActor = prev;
		other.x = prev.x;
		other.y = prev.y;
		other.rx = this.rx;
		other.ry = this.ry;
		other.generation = this.generation;
		if (ry < 0) {
			other.generation--;
		} else if (0 < ry) {
			other.generation++;
		}
		other.nextActor.push(this);
		this.prevActor = other;
		this.rx = rx;
		this.ry = ry;
	}

	reassignActor(other, rx, ry = 0) {
		if (this.prevActor == other) {
			this.rx = -rx;
			this.ry = -ry;
		}
		if (other.prevActor == this) {
			other.rx = rx;
			other.ry = ry;
		}
	}

	getPrevPartner() {
		if (!this.prevActor || this.prevActor.generation != this.generation) {
			return null;
		}
		return this.prevActor;
	}

	getNextPartner() {
		let result = null;

		this.nextActor.forEach(next => {
//console.log('generation:' + next.generation + ':' + this.generation);
			if (next.generation == this.generation) {
				result = next;
			}
		});
		return result;
	}

	addPartner(partner) {
		let prev = this.prevActor && this.generation == this.prevActor.generation ? this.prevActor : null;
		let next = this.getNextPartner();

		if (this.isMale) {
			this.addActor(partner, 2);
		} else {
			this.insertActor(partner, 2);
		}
	}
}

class Ties extends Chain {
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

	addParents(relation) {
		let father = relation.father;
		let mother = relation.mother;

		this.assignActor(mother, 0, -2);
		relation.addChild(this);
		mother.addPartner(relation);
		relation.reassign();
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

	hasRelation(relation) {
		return this.relationList.indexOf(relation) != -1;
	}

	/**
	 * パートナー追加。
	 */
	addPartner(relation) {
		if (this.hasRelation(relation)) {
			return this.relationList.length;
		}
		let len = this.relationList.unshift(relation);
		let partner = relation.getPartner(this);
		let isRev = partner.hasRelation(relation);

		this.relationList.forEach((rel, ix) => {
			rel.order = ix;
			rel.orderMax = len;
		});
//console.log('isRev:' + isRev);
		if (!isRev) {
			if (1 < len) {
				this.relationList[1].type = 'd';
			}
			super.addPartner(partner);
		}
		partner.addPartner(relation);
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
		if (absX <= Ties.MOVING_STEP) {
			this.x = ax;
		} else {
			if (diffX < 0) {
				this.x -= Ties.MOVING_STEP;
			} else if (0 < diffX) {
				this.x += Ties.MOVING_STEP;
			}
		}
		if (absY <= Ties.MOVING_STEP) {
			this.y = ay;
		} else {
			if (diffY < 0) {
				this.y -= Ties.MOVING_STEP;
			} else if (0 < diffY) {
				this.y += Ties.MOVING_STEP;
			}
		}
	}
}
Ties.MOVING_STEP = .9;
