class Chain extends Actor {
	constructor() {
		super();
		this.rx = 0;
		this.ry = 0;
		this.prevActor = null;
		this.nextActor = []; // 複数ある
		this.generation  = 0;
	}

	/**
	 * 目標の位置X.
	 */
	get ax() {
		if (this.prevActor) {
			return this.prevActor.ax + this.rx;
		}
		return this.x;
	}

	/**
	 * 目標の位置Y.
	 */
	get ay() {
		if (this.prevActor) {
			return this.prevActor.ay + this.ry;
		}
		return this.y;
	}

	/**
	 * 静止中.
	 */
	get rest() {
		if (!this.prevActor) {
			return true;
		}
		return this.x == this.ax && this.y == this.ay;
	}

	copyChainProperties(other) {
		this.x = other.x;
		this.y = other.y;
		this.rx = other.rx;
		this.ry = other.ry;
		this.prevActor = other.prevActor;
		this.nextActor = other.nextActor;
		if (this instanceof Person) {
			this.nextActor.forEach(next => {
				if (next.generation < this.generation) {
//console.log(this.info + ':next:' + next.info);
//console.log(this);
					next.prevActor = this;
				}
			});
		}
	}

	/**
	 * 目標の位置へすぐに移動。
	 */
	moveQuickly() {
		if (!this.prevActor) {
			return;
		}
		this.x = this.ax;
		this.y = this.ay;
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

	descendantOccupancy(occupancy = new Occupancy(), depth = 0) {
		let oc = occupancy;
		let partnerList = [];

		if (oc.isDone(this)) {
			return oc;
		}
		oc.merge(new Occupancy(this));
		this.listPartner(partnerList);
		partnerList.forEach(partner => {
			partner.descendantOccupancy(oc);
		});
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
	leave(other, dist = 1) {
		if (!this.rest || !other.rest) {
			return;
		}
		let diff = other.x - this.x;

		if (this.prevActor == other) {
//console.log('leave:this:' + diff);
			if (diff < 0) {
				this.rx++;
			} else if (0 < diff) {
				this.rx--;
			}
			if (8 < Math.abs(this.rx)) {
				// TODO 固定値 8 をどうにかする
console.log('**error** #leave.this/rx:' + this.rx);
				this.rx %= 8;
			}
		} else if (other.prevActor == this) {
//console.log('leave:other:' + dist);
			if (diff < 0) {
				other.rx--;
			} else if (0 < diff) {
				other.rx++;
			}
		} else {
console.log('**error** #leave.else');
console.log(this);
		}
	}

	/**
	 * (自分の側に)配置する.
	 */
	assignActor(other, rx = 0, ry = 0) {
		if (this.prevActor == other || other.prevActor == this) {
			return;
		}
console.log('[assignActor]');
		other.prevActor = this;
		other.x = this.x + rx;
		other.y = this.y;
		other.rx = rx;
		other.ry = ry;
		other.generation = this.generation;
		if (ry < 0) {
			other.generation--;
		} else if (0 < ry) {
			other.generation++;
		}
console.log(this.info + ':G' + this.generation + ' -> ' + other.info + ':G' + other.generation);
		this.nextActor.push(other);
	}

	addActor(other, rx, ry = 0) {
console.log('[addActor]');
		let next = this.getNextPartner();

		other.prevActor = this;
		other.rx = rx;
		other.ry = ry;
		other.x = this.x;
		other.y = this.y;
		if (next) {
			let ix = this.nextActor.indexOf(next);

console.log('nextあり!');
			next.prevActor = other;
			next.rx = rx;
			next.ry = ry;
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
console.log(this.info + ':G' + this.generation + ' -> ' + other.info + ':G' + other.generation);
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
		let prev = this.prevActor;

		if (!(prev instanceof Person)) {
			return null;
		}
		if (prev.generation != this.generation) {
			return null;
		}
		if (this.isSibling(prev)) {
			return null;
		}
		return prev;
	}

	getNextPartner() {
		let result = null;

		this.nextActor.forEach(next => {
//console.log('generation:' + next.generation + ':' + this.generation);
			if (next.generation == this.generation && !this.isSibling(next)) {
				result = next;
			}
		});
		return result;
	}

	addPartner(partner) {
console.log('[addPartner]');
		let prev = this.getPrevPartner();
		let next = this.getNextPartner();

		if (this.isMale) {
			this.addActor(partner, 2);
			// TODO
			return;
		}
		// Female
		if (prev) {
console.log('prevあり');
console.log(prev);
			this.insertActor(partner, 2);
		} else {
console.log('prevなし');
// TODO nextありの判定
			if (next) {
console.log('nextあり');
			}
			this.assignActor(partner, this.isMale ? 2 : -2);
		}
	}
}

class Ties extends Chain {
	constructor(gender) {
		super();
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
	 * 兄弟関係にあるか.
	 */
	isSibling(other) {
		if (this.parents && other.parents) {
			return this.parents == other.parents;
		}
		return false;
	}

	addParents(relation) {
console.log('== addParents ==');
		let parent = relation.leftSide;

		if (parent.prevActor == null) {
			this.assignActor(parent, 0, -2);
		}
		parent.addPartner(relation);
		relation.addChild(this);
		this.reserve(relation, relation.leftSide, relation.rightSide);
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
			return false;
		}
		let ax = this.ax;
		let ay = this.ay;
		let diffX = ax - this.x;
		let diffY = ay - this.y;
		let absX = Math.abs(diffX);
		let absY = Math.abs(diffY);

		if (absX == 0 && absY == 0) {
			return false;
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
		return true;
	}
}
Ties.MOVING_STEP = .9;
