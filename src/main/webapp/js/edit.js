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
		this.partnerPanel = new PartnerPanel();
		this.relationPanel = new RelationPanel();
		this.setupEvents();
		this.init();
	}

	setupEvents() {
		let view = document.getElementById('view');
		let gridSpacing = $('[name="gridSpacing"]');
		let saveButton = document.getElementById('saveButton');

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
					this.partnerPanel.open(target);
					return;
				}
				if (target instanceof Relationship) {
					this.relationPanel.open(target);
					return;
				}
			}
			if (2 <= this.field.targetList.length) {
				let other = this.field.targetList[1];
				let relationship = this.field.getRelationship(target, other);

				if (relationship) {
					this.relationPanel.open(relationship);
					return;
				}
				this.relationPanel.open(target, other);
			}
		});
		gridSpacing.change(()=> {
			this.field.dirty = true;
		});
		saveButton.addEventListener('click', ()=> {this.save()});
	}

	init() {
		let newPerson = new Person();

		newPerson.name = 'principal(本人)';
		newPerson.principal = true;
		this.field.setFocus(newPerson);
		this.field.actorList.push(newPerson);
//this.field.actorList.push(new EnclosingLine());
	}

	draw() {
		this.field.arrange();
		this.field.draw();
	}

	save() {
		let settingPanel = document.getElementById('settingPanel');
		let description = settingPanel.querySelector('[name="description"]');
		let canvas = FlexibleView.Instance.canvas;
		let formData = new FormData(this.form);
		let entity = new DiagramEntity();
		let messagePopup = document.getElementById('messagePopup');
		let content = messagePopup.querySelector('p');

		formData.append('id', 'test');
		formData.append('documentId', 'test');
		formData.append('personId', 'test');
		formData.append('description', description.value);
		formData.append('image', canvas.toDataURL());
		$.mobile.loading('show', {text: 'Save...', textVisible: true});
		entity.save(formData).then(data => {
			$.mobile.loading('hide');
			if (data.ok) {
				$(settingPanel).panel('close');
				content.textContent = 'Stage saved.';
			} else {
				content.textContent = 'Save failed.';
			}
			$(messagePopup).popup('open', {});
		});
	}
}
