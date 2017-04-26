document.addEventListener('DOMContentLoaded', ()=> {
	let app = new AppMain();
	let activate = ()=> {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		app.draw();
		requestAnimationFrame(activate);
	};

	activate();
});

class AppMain {
	constructor() {
		this.field = new Field(1024, 768);
		this.inputPanel = new InputPanel();
		this.relationPanel = new RelationPanel();
		this.setupEvents();
		this.init();
	}

	setupEvents() {
		let view = document.getElementById('view');

		view.addEventListener('mousemove', e => {
			let x = e.layerX;
			let y = e.layerY;
//console.log(e);
			this.field.scan(x, y);
		});
		view.addEventListener('click', () => {
			let target = this.field.target;

			if (target instanceof Actor) {
				this.inputPanel.open(target);
			} else if (target instanceof Relation) {
				this.relationPanel.open(target);
			}
		});
		window.addEventListener('resize', ()=> {
			this.field.resize();
		});
	}

	init() {
		let newActor = new Actor();

		newActor.principal = true;;
		this.field.focus = newActor;
		this.field.dirty = true;
	}

	draw() {
		this.field.focus.x = 0;
		this.field.focus.y = 0;
		this.field.arrange();
		this.field.draw();
	}
}
