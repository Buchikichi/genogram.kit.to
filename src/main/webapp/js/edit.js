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

			if (target) {
				this.inputPanel.open(target);
			}
		});
		window.addEventListener('resize', ()=> {
			this.field.resize();
		});
	}

	init() {
		this.field.focus = new Actor();
	}

	draw() {
		this.field.arrange();
		this.field.draw();
	}
}
