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
		this.spacing = 128;
		this.focus = null;
		this.targetList = [];
		this.actorList = [];
		this.dirty = false;
		this.setupEvents();
		Field.Instance = this;
	}

	get showGrid() {
		let check = document.querySelector('[name="grid"]');

		return check.checked;
	}

	get fontSize() {
		let element = document.querySelector('[name="fontSize"]');
		let fontSize = parseFloat(element.value);

		if (!fontSize) {
			fontSize = 12;
		}
		return fontSize;
	}

	setupEvents() {
		let view = this.view.view;
		let keys = Controller.Instance.keys;

		view.addEventListener('mousedown', e => {
			let pt = this.view.convert(e.clientX, e.clientY);
			let target = this.scan(pt.x, pt.y);
			let ctrlKey = keys['Control'] || keys['Shift'] || keys['k16'] || keys['k17'];

			if (!ctrlKey) {
				this.targetList = [];
			}
			if (target) {
				this.targetList.push(target);
			}
			this.hold = target;
		});
		view.addEventListener('mouseup', e => {
			this.hold = null;
		});
		view.addEventListener('mousemove', e => {
			let pt = this.view.convert(e.clientX, e.clientY);

//console.log(e);
			if (this.hold) {
				let px = pt.x - this.tx;
				let py = pt.y - this.ty;
				this.hold.x = px;
				this.hold.y = py;
				return;
			}
			this.scan(pt.x, pt.y);
		});
	}

	setFocus(actor) {
		this.focus = actor;
		this.dirty = true;
	}

	addActor(...actors) {
		actors.forEach(act => {
			this.actorList.push(act);
		});
		this.dirty = true;
	}

	scan(x, y) {
		let result = null;
		let px = x - this.tx;
		let py = y - this.ty;

		this.actorList.forEach(actor => {
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
console.log('dirty.');
		this.dirty = false;
		let minX = 0;
		let minY = 0;
		let maxX = 0;
		let maxY = 0;
		let list = [];

		this.focus.x = 0;
		this.focus.y = 0;
		this.focus.scanAll(list);
console.log('list:' + list.length);
		Tally.reset();
		this.focus.calculate();
		list.forEach(person => {
			list.forEach(target => {
				if (person == target) {
					return;
				}
				person.touch(target);
			});
		});
		list.forEach(person => {
			let x = person.x;
			let y = person.y;

			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		});
		let hw = (this.width - (maxX - minX)) / 2;
		let hh = (this.height - (maxY - minY)) / 2;

		this.tx = hw - minX;
		this.ty = hh - minY;
	}

	choiceActor() {
		let list = [];

		this.actorList.forEach(actor => {
			if (!actor.isGone) {
				list.push(actor);
			}
		});
		list.sort((a, b) => {
			return a.z - b.z;
		});
		this.actorList = list;
	}

	drawGrid(ctx) {
		if (!this.showGrid) {
			return;
		}
		let hW = this.width / 2;
		let hH = this.height / 2;
		let spacing = this.spacing / 2;
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

		this.view.clear();
		this.choiceActor();
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
