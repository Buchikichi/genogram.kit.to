class Relation extends Actor {
	constructor(person, other) {
		super();
		if (person.isMale) {
			this.leftSide = person;
			this.rightSide = other;
		} else {
			this.leftSide = other;
			this.rightSide = person;
		}
		this.type = 'm';
		this.children = [];
		this.hit = false;
		this.initImage();
	}

	initImage() {
		this.divorceImage = new Image();
		this.divorceImage.src = 'img/ralation.divorce.png';
		this.separateImage = new Image();
		this.separateImage.src = 'img/ralation.separate.png';
	}

	get father() {
		return this.leftSide.isMale ? this.leftSide : this.rightSide;
	}

	get mother() {
		return this.leftSide.isMale ? this.rightSide : this.leftSide;
	}

	get x() {
		let width = Math.abs(this.leftSide.x - this.rightSide.x);

		return this.left + width / 2;
	}

	get y() {
		return this.leftSide.y + 1;
	}

	get top() {
		return this.leftSide.y + .5;
	}

	get left() {
		return Math.min(this.leftSide.x, this.rightSide.x);
	}

	get partnerOrder() {
		return Math.max(this.father.partnerOrder, this.mother.partnerOrder);
	}

	get fatherOrder() {
		return this.mother.getOrder(this.father);
	}

	get motherOrder() {
		return this.father.getOrder(this.mother);
	}

	get order() {
		return this.relationOrder;
	}
	set order(val) {
		this.z = val;
		this.relationOrder = val;
	}

	get firstChild() {
		// 子が存在するときだけ使う
		return this.children[0];
	}

	get lastChild() {
		// 子が存在するときだけ使う
		return this.children[this.children.length - 1];
	}

	get rect() {
		let half = 1;
		let father = this.father;
		let mother = this.mother;
		let top = father.y + .5;
		let left = Math.min(father.x, mother.x);
		let width = Math.abs(father.x - mother.x);
		let marginBottom = (this.order - 1) * 0.1;
		let height = half / 4 + marginBottom;
		let center = this.father.numOfPartner == 1 && this.mother.numOfPartner == 1 ?
			this.father.x + (this.mother.x - this.father.x) / 2 :
			this.fatherOrder < this.motherOrder ? mother.x - 1 : father.x + 1;

		// TODO GenoRect でも作るか
		this.x = center;
		this.y = top + height;
		return {
			top: top,
			left: left,
			right: left + width,
			bottom: top + height,
			center: center,
			width: width,
			height: height,
		};
	}

	/**
	 * 子(嫁・婿含む)の一覧.
	 */
	get allChildren() {
		let list = [];

		this.children.forEach(child => {
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

	/**
	 * 占める領域を求める.
	 * @return {left, right}
	 */
	get occupancy() {
		let left = 0;
		let right = 0;
//		let pl = 1;
//		let pr = 1;
		let onlyChild = this.children.length == 1; // 一人っ子
		let allChildren = this.allChildren;
		let len = allChildren.length;

		if (onlyChild) {
			let child = this.children[0];
			let width = len * 2 - 1;

			if (child.isMale) {
				left = 1;
				right = width;
			} else {
				left = width;
				right = 1;
			}
		} else {
			left = len;
			right = left;
		}
		return {left: left, right: right};
	}

	getPartner(person) {
		if (person == this.father) {
			return this.mother;
		}
		return this.father;
	}

	addChild(child) {
		let len = this.children.length;

		child.parents = this;
		this.children.push(child);
		if (0 < len) {
			let older = this.children[len - 1];

			if (older.isMale) {
				let shift = older.numOfPartner + 1;

				older.assignActor(child, shift * 2);
			} else {
				older.assignActor(child, 2);
			}
		} else {
console.log('father.assignActor');
			this.father.assignActor(child, 0, 2);
		}
		this.reassign();
	}

	reassignOccupancy() {
		let hasBothParents = this.father.parents && this.mother.parents;

		if (!hasBothParents) {
			return false;
		}
		if (!this.leftSide.rest || !this.rightSide.rest) {
			return false;
		}
//console.log('[reassignOccupancy]');
		let leftOc = this.leftSide.ancestorOccupancy(new Occupancy(this.leftSide));
		let rightOc = this.rightSide.ancestorOccupancy(new Occupancy(this.rightSide));
		let diff = rightOc.left - leftOc.right - 2;

//console.log('diff:' + diff);
		if (diff) {
			this.mother.rx -= diff;
			return true;
		}
		return false;
	}

	reassignChildren() {
		let result = false;

		if (this.children.length == 0) {
			return result;
		}
		let margin = 0;

		this.children.forEach((child, ix) => {
			let oc = child.descendantOccupancy();

//console.log(child.info + ': width:' + oc.width + ',' + oc.left + '|' + oc.right);
			if (child.isMale) {
				if (0 < ix && child.rx != margin) {
					child.rx = margin;
					result = true;
				}
				margin = 2 + oc.width;
			} else {
				let rx = oc.width + margin;

				if (0 < ix && child.rx != rx) {
					child.rx = rx;
					result = true;
				}
				margin = 2;
			}
		});
		return result;
	}

	reassign() {
		if (this.reassignOccupancy()) {
			return true;
		}
		if (this.reassignChildren()) {
			return true;
		}
		if (this.children.length == 0) {
			return false;
		}
		let result = false;
		let first = this.firstChild;
		let last = this.lastChild;
		let right = last.prevActor.x + last.rx;
		let left = right;
		let prev = last;

		while (prev != first) {
			prev = prev.prevActor;
			left = prev.prevActor.x + prev.rx;
//console.log('left:' + left);
		}
		let half = (right - left) / 2;

//console.log('left:' + left + '/half:' + half + '/right:' + right);
		if (first == this.leftSide.prevActor || first == this.rightSide.prevActor) {
			let diff = half - this.rect.center + this.leftSide.x;

			if (first.rest && this.leftSide.rx != diff) {
				this.leftSide.rx = diff;
				result = true;
//console.log('reassign:親移動');
			}
		} else {
			let diff = this.rect.center - first.prevActor.x - half;

			if (first.prevActor.rest && first.rx != diff) {
				first.rx = diff;
				result = true;
//console.log('reassign:子移動');
			}
		}
		return result;
	}

	removeChild(target) {
		let ix = this.children.indexOf(target);

		this.children.splice(ix, 1);
		target.eject();
	}

	isHit(px, py) {
		let spacing = Field.Instance.spacing;
		let x = px / spacing;
		let y = py / spacing;
		let rect = this.rect;

		this.hit = false;
		if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom) {
			this.hit = true;
		}
		return this.hit;
	}

	drawOccupancy(ctx) {
		let occupancy = this.occupancy;

		if (occupancy.left == 0) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let half = spacing / 2;
		let rect = this.rect;
		let bx = rect.center - occupancy.left * half;
		let by = rect.bottom;
		let width = (occupancy.left + occupancy.right) * half;

		ctx.strokeStyle = 'green';
		ctx.strokeRect(bx, by, width, spacing);
	}

	drawNormal(ctx) {
		let spacing = Field.Instance.spacing;
		let rect = this.rect;
		let top = rect.top * spacing;
		let left = rect.left * spacing;
		let right = rect.right * spacing;
		let bottom = rect.bottom * spacing;
		let center = rect.center * spacing;

		ctx.beginPath();
		ctx.moveTo(left, top);
		ctx.lineTo(left, bottom);
		ctx.lineTo(right, bottom);
		ctx.lineTo(right, top);
		ctx.stroke();
		ctx.translate(-8, -8);
		if (this.type == 'd') {
			ctx.drawImage(this.divorceImage, center, bottom);
		} else if (this.type == 's') {
			ctx.drawImage(this.separateImage, center, bottom);
		}
	}

	drawText(ctx) {
		let spacing = Field.Instance.spacing;
		let rect = this.rect;
		let top = this.top * spacing;
		let center = rect.center * spacing;
		let text = this.fatherOrder + '/' + this.motherOrder;

//text += '/f:' + this.fatherOrder + '/m:' + this.motherOrder;
		ctx.fillText(text, center, top);
	}

	drawChildLine(ctx) {
		if (this.children.length == 0) {
			return;
		}
		let spacing = Field.Instance.spacing;
		let my = (this.y + .25) * spacing;
		let first = true;
		let last = null;
		let rect = this.rect;
		let tx = rect.center * spacing;
		let ty = rect.bottom * spacing;

		ctx.strokeStyle = Field.Instance.lineStyle;
		ctx.beginPath();
		ctx.moveTo(tx, ty);
		ctx.lineTo(tx, my);
		this.children.forEach(child => {
			let cx = child.x * spacing;
			let cy = (child.y - .5) * spacing;

			if (first) {
				ctx.lineTo(cx, my);
				ctx.stroke();
				first = false;
			}
			ctx.beginPath();
			ctx.moveTo(cx, my);
			ctx.lineTo(cx, cy);
			ctx.stroke();
			last = child;
		});
		ctx.beginPath();
		ctx.moveTo(tx, my);
		ctx.lineTo(last.x * spacing, my);
		ctx.stroke();
	}

	draw(ctx, cnt = 0) {
		let spacing = Field.Instance.spacing;
		let x = this.x * spacing;
		let y = this.y * spacing;

		ctx.save();
		this.drawChildLine(ctx);
		if (this.hit) {
			ctx.strokeStyle = 'aqua';
			ctx.lineWidth = 5;
			this.drawNormal(ctx);
this.drawText(ctx);
		} else {
			ctx.strokeStyle = Field.Instance.lineStyle;
			this.drawNormal(ctx);
		}
//this.drawOccupancy(ctx);
		ctx.restore();
	}

	createEntity() {
		return {
			id: this.id,
		};
	}
}
