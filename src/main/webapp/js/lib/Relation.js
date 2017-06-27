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
		this.divorceImage.src = 'img/relation.divorce.png';
		this.separateImage = new Image();
		this.separateImage.src = 'img/relation.separate.png';
		this.dottedImage = new Image();
		this.dottedImage.src = 'img/relation.dotted.png';
		this.dottedImage.onload = ()=> {
			let ctx = FlexibleView.Instance.ctx;

			this.dottedStyle = ctx.createPattern(this.dottedImage, 'repeat');
		};
	}

	get father() {
		return this.leftSide.isMale ? this.leftSide : this.rightSide;
	}

	get mother() {
		return this.leftSide.isMale ? this.rightSide : this.leftSide;
	}

	get info() {
		return this.leftSide.info + '_' + this.rightSide.info;
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
		this.z = Chain.Z - val;
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
	 * @return left, right
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

	isPair(person, other) {
		if (this.leftSide == person && this.rightSide == other) {
			return true;
		}
		if (this.leftSide == other && this.rightSide == person) {
			return true;
		}
		return false;
	}

	getPartner(person) {
		if (person == this.father) {
			return this.mother;
		}
		return this.father;
	}

	addChild(child, chain = true) {
console.log('Relation#addChild:' + child.info);
		let len = this.children.length;

		child.parents = this;
		this.children.push(child);
		this.reserve(child);
		if (!chain) {
			return;
		}
		if (child.prevActor) {
//console.log('child.assign father');
			child.assignActor(this.father, -1, -2);
			this.mother.generation = this.father.generation;
		} else {
			let rx = 1;
			let prevSibling = child.prevSibling;

//console.log('father.assign child');
			if (prevSibling) {
				let diff = prevSibling.ax - this.father.ax;
				let oc = prevSibling.descendantOccupancy();

				rx = diff + oc.right - prevSibling.ax + 2;
			}
			this.father.assignActor(child, rx, 2);
		}
	}

	getPrevChild(child) {
		let ix = this.children.indexOf(child);

		if (ix < 1) {
			return null;
		}
		return this.children[ix - 1];
	}

	getNextChild(child) {
		let ix = this.children.indexOf(child);
		let nx = ix + 1;

		if (this.children.length <= nx) {
			return null;
		}
		return this.children[nx];
	}

	/** bornOrderを振りなおす. */
	reorder() {
		this.children.forEach((child, ix) => {
			child.bornOrder = ix + 1;
		});
	}

	narrowly() {
		this.leftSide.separate(this.rightSide, -1);
	}

	widely() {
		this.leftSide.separate(this.rightSide, 1);
	}

	reassignOccupancy() {
		let hasBothParents = this.father.parents && this.mother.parents;

		if (!hasBothParents) {
			return false;
		}
		if (!this.leftSide.rest || !this.rightSide.rest) {
			return false;
		}
console.log('Relation#reassignOccupancy');
		let leftOc = this.leftSide.ancestorOccupancy(new Occupancy(this.leftSide));
		let rightOc = this.rightSide.ancestorOccupancy(new Occupancy(this.rightSide));
		let desired = leftOc.right - rightOc.left + 2;

		if (desired != 0) {
console.log('desired:' + desired + '/' + leftOc.right + '|' + rightOc.left);
			this.leftSide.separate(this.rightSide, desired);
			return true;
		}
		return false;
	}

	reassignChildren() {
		let result = false;

		if (this.children.length == 0) {
			return result;
		}
//console.log('==reassignChildren==');
		let rect = this.rect;
		let reverse = null;
		let width = 0;
		let list = [0];
		let right = 0;

		// 相対位置と幅を求める
		this.children.forEach((child, ix) => {
			let oc = child.getOccupancy();
			let left = child.ax - oc.left + 1;

			if (child == this.leftSide.prevActor || child == this.rightSide.prevActor) {
				reverse = child;
			}
			if (0 < ix) {
				width += right + left;
				list.push(width);
			}
			right = oc.right - child.ax + 1;
//console.log(child.info + '|left:' + left + '/right:' + right);
		});
		// 位置決め
		if (reverse == null) {
			let bx = rect.center - width / 2;

			this.children.forEach((child, ix) => {
				if (child.reassignAbsolute(bx + list[ix])) {
					result = true;
				}
			});
			return result;
		}
//		if (this.children.length <= 1) {
//			return result;
//		}
//console.log('==reassignChildren==');
		let cx = this.children.indexOf(reverse);
		let bx = reverse.ax - list[cx];
		let px = bx + width / 2 - (rect.center - rect.left);

		if (this.leftSide.reassignAbsolute(px)) {
			result = true;
		}
		this.children.forEach((child, ix) => {
			if (child.reassignAbsolute(bx + list[ix])) {
				result = true;
			}
		});
		return result;
	}

	reassign() {
//		if (this.reassignOccupancy()) {
//			return true;
//		}
		return this.reassignChildren();
	}

	removeChild(target) {
		let ix = this.children.indexOf(target);

		this.children.splice(ix, 1);
		target.eject();
	}

	isHit(x, y) {
		let rect = this.rect;

		this.hit = false;
		if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom) {
			this.hit = true;
		}
		return this.hit;
	}

	eject() {
		super.eject();
		this.children.forEach(child => {
			child.parents = null;
		});
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

		ctx.save();
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
		ctx.restore();
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
		ctx.lineWidth = 2;
		this.drawChildLine(ctx);
		if (this.type == 'c') {
			ctx.strokeStyle = this.dottedStyle;
		} else {
			ctx.strokeStyle = Field.Instance.lineStyle;
		}
		this.drawNormal(ctx);
		if (this.hit || this.selected) {
			ctx.lineWidth = 6;
			ctx.strokeStyle = Field.Instance.hitStyle;
			this.drawNormal(ctx);
			if (EditorMain.DEBUG) {
				this.drawText(ctx);
			}
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
