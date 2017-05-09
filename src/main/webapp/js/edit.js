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
		this.controller = new Controller();
		this.field = new Field(1024, 768);
		this.inputPanel = new InputPanel();
		this.relationPanel = new RelationPanel();
		this.setupEvents();
		this.init();
	}

	setupEvents() {
		let view = document.getElementById('view');

		view.addEventListener('click', () => {
			if (this.field.targetList.length == 0) {
				return;
			}
			let target = this.field.targetList[0];
			let keys = this.controller.keys;
			let ctrlKey = keys['Control'] || keys['Shift'] || keys['k16'] || keys['k17'];

			if (!ctrlKey) {
				if (target instanceof Person) {
					this.inputPanel.open(target);
					return;
				}
				if (target instanceof Relation) {
					this.relationPanel.open(target);
					return;
				}
			}
		});
	}

	init() {
		let newPerson = new Person();

		newPerson.principal = true;
		this.field.setFocus(newPerson);
		this.field.actorList.push(newPerson);
//this.field.actorList.push(new EnclosingLine());
	}

	draw() {
		this.field.arrange();
		this.field.draw();
	}
}
