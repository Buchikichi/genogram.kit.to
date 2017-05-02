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
		let header = document.querySelector('[data-role="header"]');
		let headerH = header.offsetHeight;
		let view = document.getElementById('view');

		view.addEventListener('mousemove', e => {
			let x = e.clientX;
			let y = e.clientY - headerH;
//console.log(e);
			this.field.scan(x, y);
		});
		view.addEventListener('click', () => {
			let target = this.field.target;

			if (target instanceof Person) {
				this.inputPanel.open(target);
			} else if (target instanceof Relation) {
				this.relationPanel.open(target);
			}
		});
	}

	init() {
		let newPerson = new Person();

		newPerson.principal = true;
		this.field.setFocus(newPerson);
		this.field.actorList.push(newPerson);
//		this.field.actorList.push(new EnclosingLine());
	}

	draw() {
		this.field.arrange();
		this.field.draw();
	}
}
