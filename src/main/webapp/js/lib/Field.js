/**
 * Field.
 */
class Field {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.view = new FlexibleView(width, height);
		this.tx = 0;
		this.ty = 0;
		this.targetList = [];
		this.actorList = [];
		this.dirty = false;
		this.setupEvents();
		this.minGeneration = 0;
		this.maxGeneration = 0;
		Field.Instance = this;
	}

	get showGrid() {
		let check = document.querySelector('[name="showGrid"]');

		return check.checked;
	}

	get showName() {
		let result = '0';
		let radio = document.querySelectorAll('[name="showName"]');

		Array.prototype.forEach.call(radio, element => {
			if (element.checked) {
				result = element.value;
			}
		});
		return result;
	}

	get spacing() {
		let element = document.querySelector('[name="gridSize"]');
		let gridSize = parseFloat(element.value);

		if (!gridSize) {
			gridSize = 80;
		}
		return gridSize;
	}

	get fontSize() {
		let element = document.querySelector('[name="nameSize"]');
		let fontSize = parseFloat(element.value);

		if (!fontSize) {
			fontSize = 12;
		}
		return fontSize;
	}

	get lineStyle() {
		return 'gray';
	}

	get hitStyle() {
		return 'rgba(100, 255, 255, 0.6)';
	}

	get personList() {
		let list = [];

		this.actorList.forEach(actor => {
			if (actor instanceof Person) {
				list.push(actor);
			}
		});
		return list;
	}

	get pairList() {
		let list = [];

		this.actorList.forEach(actor => {
			if (actor instanceof Relation) {
				list.push(actor);
			}
		});
		return list;
	}

	get relationshipList() {
		let list = [];

		this.actorList.forEach(actor => {
			if (actor instanceof Relationship) {
				list.push(actor);
			}
		});
		return list;
	}

	get numOfGeneration() {
		return this.maxGeneration - this.minGeneration + 1;
	}

	createPair(person, other) {
		let result = null;

		this.pairList.forEach(pair => {
			if (pair.isPair(person, other)) {
				result = pair;
			}
		});
		if (result == null) {
			result = new Relation(person, other);
			this.addActor(result);
		}
		return result;
	}

	getRelationship(person, other) {
		let result = null;

		this.actorList.forEach(actor => {
			if (result || !(actor instanceof Relationship)) {
				return;
			}
			if (actor.person == person && actor.other == other
					|| actor.person == other && actor.other == person) {
				result = actor;
			}
		});
		return result;
	}

	allowTarget(target) {
		return target instanceof Person || target instanceof Relation
			|| target instanceof Relationship || target instanceof EnclosingLine;
	}

	setupEvents() {
		let view = this.view.view;
		let keys = Controller.Instance.keys;
		let beginPt = null;

		view.addEventListener('mousedown', e => {
			beginPt = this.view.convert(e.clientX, e.clientY);
			let target = this.scan(beginPt.x, beginPt.y);
			let ctrlKey = keys['Control'] || keys['Shift'] || keys['k16'] || keys['k17'];

			if (!ctrlKey) {
				this.targetList = [];
			}
			if (this.allowTarget(target)) {
				this.targetList.push(target);
			}
			if (target && target.holdable) {
				this.hold = target;
			}
		});
		view.addEventListener('mouseup', e => {
			this.dirty = true;
			this.hold = null;
		});
		view.addEventListener('mousemove', e => {
			let pt = this.view.convert(e.clientX, e.clientY);

//console.log(e);
			if (this.hold) {
				let spacing = this.spacing;
				let dx = pt.x - beginPt.x;
				let dy = pt.y - beginPt.y;
				let px = pt.x - this.tx;
				let py = pt.y - this.ty;

				this.hold.move(dx / spacing, dy / spacing);
				beginPt = pt;
//				return;
			}
			this.scan(pt.x, pt.y);
		});
	}

	addActor(...actors) {
		actors.forEach(act => {
			if (this.actorList.indexOf(act) != -1) {
				// 既に存在
				return;
			}
			this.actorList.push(act);
			if (act instanceof Person) {
				this.minGeneration = Math.min(this.minGeneration, act.generation);
				this.maxGeneration = Math.max(this.maxGeneration, act.generation);
			}
		});
		this.dirty = true;
	}

	scan(x, y) {
		let result = null;
		let px = x - this.tx;
		let py = y - this.ty;

		// zの降順にスキャン
		this.actorList.sort((a, b) => {
			return b.z - a.z;
		});
		this.actorList.forEach(actor => {
			actor.hit = false;
			if (result) {
				return;
			}
			if (actor.isHit(px, py)) {
				result = actor;
			}
		});
		return result;
	}

	clearSelection() {
		this.scan(Number.MAX_VALUE, Number.MAX_VALUE);
		this.targetList = [];
	}

	arrange() {
		if (!this.dirty) {
			return;
		}
console.log('*dirty* ' + this.actorList.length);
		this.dirty = false;
		let minX = 0;
		let minY = 0;
		let maxX = 0;
		let maxY = 0;
		let list = [];
		let relationList = [];

		this.actorList.forEach(actor => {
			if (actor instanceof Relation) {
				relationList.push(actor);
			}
		});
		this.personList.forEach(person => {
			let moved = person.move();
			let x = person.x;
			let y = person.y;

			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
			if (moved) {
				this.dirty = true;
			}
		});
		if (!this.dirty) {
//console.log('*** !this.dirty ***');
			relationList.forEach(relation => {
				if (relation.reassign()) {
					this.dirty = true;
				}
			});
		}
		let spacing = this.spacing;
		let left = minX * spacing;
		let top = minY * spacing;
		let hw = (this.width - (maxX * spacing - left)) / 2;
		let hh = (this.height - (maxY * spacing - top)) / 2;

		this.tx = hw - left;
		this.ty = hh - top;
	}

	choiceActor() {
		let list = [].concat(this.actorList);

		this.actorList = [];
		list.forEach(actor => {
			if (!actor.isGone) {
				this.actorList.push(actor);
				actor.spawn.forEach(roe => {
					if (list.indexOf(roe) == -1 && this.actorList.indexOf(roe) == -1) {
						this.addActor(roe);
					}
				});
			}
		});
		if (this.actorList.length != list.length) {
			this.dirty = true;
		}
		// zの昇順に描画
		this.actorList.sort((a, b) => {
			return a.z - b.z;
		});
	}

	drawGrid(ctx) {
		if (!this.showGrid) {
			return;
		}
		let hW = this.width / 2;
		let hH = this.height / 2;
		let spacing = this.spacing;
		let top = -hH;
		let left = -hW;
		let right = hW;
		let bottom = hH;

		ctx.save();
		ctx.lineWidth = 0.2;
		ctx.strokeStyle = 'aqua';
		ctx.translate(hW, hH);
		for (let x = 0; x < hW; x+= spacing) {
			ctx.beginPath();
			ctx.moveTo(x, top);
			ctx.lineTo(x, bottom);
			ctx.stroke();
			if (0 < x) {
				ctx.beginPath();
				ctx.moveTo(-x, top);
				ctx.lineTo(-x, bottom);
				ctx.stroke();
			}
		}
		for (let y = 0; y < hH; y+= spacing) {
			ctx.beginPath();
			ctx.moveTo(left, y);
			ctx.lineTo(right, y);
			ctx.stroke();
			if (0 < y) {
				ctx.beginPath();
				ctx.moveTo(left, -y);
				ctx.lineTo(right, -y);
				ctx.stroke();
			}
		}
		ctx.restore();
	}

	draw() {
		let ctx = this.view.ctx;
		let fontSize = this.fontSize;

		this.choiceActor();
		this.view.clear();
		this.drawGrid(ctx);
		ctx.save();
		ctx.font = fontSize + "px 'Times New Roman'";
		ctx.textBaseline = 'middle';
		ctx.translate(this.tx, this.ty);
		this.actorList.forEach(actor => {
			actor.fontSize = fontSize;
			actor.selected = this.targetList.indexOf(actor) != -1;
			actor.draw(ctx);
		});
		ctx.restore();
	}
}
Field.DEBUG = false;
Field.MAX_GENERATION = Field.DEBUG ? 99 : 5;
