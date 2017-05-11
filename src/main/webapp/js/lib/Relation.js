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
this.ranking = 0;
		this.hit = false;
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
		let height = half / 4;

		// TODO GenoRect でも作るか
		return {
			top: top,
			left: left,
			right: left + width,
			bottom: top + height,
			center: left + width / 2,
			width: width,
			height: height,
		};
	}

	addChild(child) {
		let father = this.father;
		let mother = this.mother;
		let key = father.id;
		let list = mother.childrenMap[key];

		if (!list) {
			list = [];
			mother.childrenMap[key] = list;
		}
		child.parents = this;
		list.push(child);
	}

	removeChild(target) {
		let father = this.father;
		let mother = this.mother;
		let key = father.id;
		let children = mother.childrenMap[key];
		let ix = children.indexOf(target);

		children.splice(ix, 1);
		if (children.length == 0) {
			delete mother.childrenMap[key];
		}
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

	draw(ctx, cnt = 0) {
		ctx.save();
		if (this.hit) {
			this.drawHighlight(ctx);
		} else {
			this.drawNormal(ctx);
		}
		ctx.restore();
	}
}
