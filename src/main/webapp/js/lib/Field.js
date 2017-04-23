/**
 * Field.
 */
class Field {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.tx = 0;
		this.ty = 0;
		this.spacing = 128;
		this.focus = null;
		this.actorList = [];
		this.setup();
		Field.Instance = this;
	}

	setup() {
		let canvas = document.getElementById('canvas');

		canvas.width = this.width;
		canvas.height = this.height;
		this.ctx = canvas.getContext('2d');
		this.resize();
	}

	resize() {
		let header = document.querySelector('[data-role="header"]');
		let headerH = header.offsetHeight;
//console.log('headerH:' + headerH);
		let scaleW = document.body.clientWidth / this.width;
		let scaleH = (window.innerHeight - headerH) / this.height;
		let view = document.getElementById('view');

		this.scale = scaleH < scaleW ? scaleH : scaleW;
//console.log('scale:' + this.scale);
		// transform: scale(2);
		view.setAttribute('style', 'transform: scale(' + this.scale + ');');
	}

	scan(x, y) {
		let px = x - this.tx;
		let py = y - this.ty;

		this.target = null;
		this.actorList.forEach(actor => {
			let hit = actor.isHit(px, py);

			if (hit) {
				this.target = hit;
			}
		});
	}

	arrange() {
		let minX = 0;
		let minY = 0;
		let maxX = 0;
		let maxY = 0;
		let list = [];

		this.focus.scanAll(list);
		this.actorList = list;
		list.forEach(people => {
			let x = people.x;
			let y = people.y;

			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.min(maxX, x);
			maxY = Math.min(maxY, y);
		});
		let hx = (maxX - minX) / 2;
		this.tx = this.width / 2;
		this.ty = this.height / 2;
	}

	draw() {
		let field = this;
		let ctx = this.ctx;

		ctx.clearRect(0, 0, this.width, this.height);
		this.actorList.sort(function(a, b) {
			return a.z - b.z;
		});
		ctx.font = "16px 'Times New Roman'";
		ctx.save();
		ctx.translate(this.tx, this.ty);
		this.actorList.forEach(actor => {
			actor.draw(ctx);
		});
		ctx.restore();
	}
}
