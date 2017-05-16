class Relation extends Actor {
	constructor(person, other) {
		super();
		if (person.isMale) {
			this.father = person;
			this.mother = other;
		} else {
			this.father = other;
			this.mother = person;
		}
		this.type = 'm';
		this.divorceImage = new Image();
		this.divorceImage.src = 'img/ralation.divorce.png';
		this.children = [];
		this.hit = false;
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

	get rect() {
		let spacing = Field.Instance.spacing;
		let half = spacing / 2;
		let father = this.father;
		let mother = this.mother;
		let radius = father.radius;
		let top = father.y + father.radius;
		let left = Math.min(father.x, mother.x);
		let width = Math.abs(father.x - mother.x);
		let marginBottom = (this.order - 1) * 4;
		let height = half / 4 + marginBottom;
		let center = this.fatherOrder < this.motherOrder ? mother.x - half : father.x + half;

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
		child.parents = this;
		this.children.push(child);
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
		let rect = this.rect;

		ctx.beginPath();
		ctx.moveTo(rect.left, rect.top);
		ctx.lineTo(rect.left, rect.bottom);
		ctx.lineTo(rect.right, rect.bottom);
		ctx.lineTo(rect.right, rect.top);
		ctx.stroke();
		if (this.type == 'd') {
			ctx.drawImage(this.divorceImage, rect.center - 8, rect.bottom - 8);
		}
	}

	drawText(ctx) {
		let rect = this.rect;
		let text = this.fatherOrder + '/' + this.motherOrder;

//text += '/f:' + this.fatherOrder + '/m:' + this.motherOrder;
		ctx.fillText(text, rect.center, rect.top);
	}

	draw(ctx, cnt = 0) {
		ctx.save();
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
}
