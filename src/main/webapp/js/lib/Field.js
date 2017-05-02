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
		this.actorList = [];
		this.dirty = false;
		this.setupEvents();
		Field.Instance = this;
	}

	setupEvents() {
		let view = this.view.view;

		view.addEventListener('mousedown', e => {
			let pt = this.view.convert(e.clientX, e.clientY);

			this.hold = this.scan(pt.x, pt.y);
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
			let hit = actor.isHit(px, py);

			if (hit) {
				result = hit;
			}
		});
		this.target = result;
		return result;
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

	draw() {
		let ctx = this.view.ctx;

		this.view.clear();
		this.actorList.sort(function(a, b) {
			return a.z - b.z;
		});
		ctx.save();
		ctx.font = "16px 'Times New Roman'";
		ctx.translate(this.tx, this.ty);
		this.actorList.forEach(actor => {
			actor.draw(ctx);
		});
		ctx.restore();
	}
}
