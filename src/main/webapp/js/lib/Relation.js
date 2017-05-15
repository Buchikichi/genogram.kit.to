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
		this.children = [];
		this.hit = false;
	}

	get partnerOrder() {
		return Math.max(this.father.partnerOrder, this.mother.partnerOrder);
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
		let marginBottom = (this.partnerOrder - 1) * 4;
		let height = half / 4 + marginBottom;
		let center = father.partnerOrder < mother.partnerOrder ? mother.x - half: father.x + half;

		// TODO GenoRect でも作るか
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

	drawNormal(ctx) {
		let rect = this.rect;

		ctx.beginPath();
		ctx.moveTo(rect.left, rect.top);
		ctx.lineTo(rect.left, rect.bottom);
		ctx.lineTo(rect.right, rect.bottom);
		ctx.lineTo(rect.right, rect.top);
		ctx.stroke();
	}

	drawHighlight(ctx) {
		ctx.strokeStyle = 'aqua';
		ctx.lineWidth = 5;
		this.drawNormal(ctx);
	}

	drawText(ctx) {
		let rect = this.rect;

		ctx.fillText(this.partnerOrder, rect.center, rect.top);
	}

	draw(ctx, cnt = 0) {
		ctx.save();
		if (this.hit) {
			this.drawHighlight(ctx);
this.drawText(ctx);
		} else {
			this.drawNormal(ctx);
		}
		ctx.restore();
	}
}
