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
		this.diagramId = document.querySelector('[name="id"]').value;
		this.documentId = document.querySelector('[name="documentId"]').value;
		this.controller = new Controller();
		this.field = new Field(1024, 768);
		this.settingPanel = new SettingPanel(this);
		this.inputPanel = new InputPanel();
		this.partnerPanel = new PartnerPanel();
		this.relationPanel = new RelationPanel();
		this.setupEvents();
		this.init();
	}

	setupEvents() {
		let view = document.getElementById('view');
		let gridSpacing = $('[name="gridSpacing"]');

		view.addEventListener('click', () => {
			if (this.field.targetList.length == 0) {
				return;
			}
			let target = this.field.targetList[0];
			let keys = this.controller.keys;
			let ctrlKey = keys['Control'] || keys['Shift'] || keys['k16'] || keys['k17'];

			if (!ctrlKey) {
				if (target instanceof Person) {
if (target.prevActor) console.log('G' + target.generation + '|prevActor:' + target.prevActor.info);
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
	}

	init() {
		let root = new ChainRoot();

		this.field.setFocus(root);
		this.field.addActor(root);
		if (this.diagramId.length == 0 || this.documentId.length == 0) {
			this.initSandbox(root);
			return;
		}
		this.loadPersons(root);
//this.field.actorList.push(new EnclosingLine());
	}

	initSandbox(root) {
		let newPerson = new Person();

		newPerson.name = 'principal(本人)';
		newPerson.principal = true;
		root.assignActor(newPerson);
		this.field.addActor(newPerson);
	}

	makePersonMap(personList) {
		let map = {};

		personList.forEach(rec => {
			let person = Person.createFromEntity(rec);

			map[person.id] = person;
		});
		return map;
	}

	loadPersons(root) {
		let entity = new DiagramEntity();

		entity.select(this.diagramId).then(diagram => {
			let personMap = this.makePersonMap(diagram.personList);

			diagram.personList.forEach((rec, ix) => {
				let person = personMap[rec.id];

console.log('person[G' + person.generation + ']:' + person.info);
//console.log(person);
				if (ix == 0) {
//					person.principal = true;
					root.assignActor(person);
				}
				if (rec.parents) {
					let parents = rec.parents;
//console.log('parents:');
//console.log(parents);
					let father = personMap[parents.person.id];
					let mother = personMap[parents.other.id];
					let relation = new Relation(father, mother);

					relation.id = parents.id;
					relation.type = parents.type;
//					father.addPartner(relation);
//console.log('father:');
//console.log(father);
//console.log('mother:');
//console.log(mother);
					person.addParents(relation);
					this.field.addActor(relation);
				}
				this.field.addActor(person);
			});
		});
	}

	draw() {
		this.field.arrange();
		this.field.draw();
	}
}

class SettingPanel {
	constructor(appMain) {
		this.appMain = appMain;
		this.panel = document.getElementById('settingPanel');
		this.saveButton = document.getElementById('saveButton');
		this.setupEvents();
	}

	setupEvents() {
		if (0 < this.appMain.documentId.length) {
			this.saveButton.classList.remove('ui-state-disabled');
			this.saveButton.addEventListener('click', ()=> {this.save()});
		}
	}

	createPersonList(formData) {
		let field = this.appMain.field;
		let personList = field.personList;
		let ix = 0;

		personList.sort((a, b) => {
			return a.generation - b.generation;
		});
		personList.forEach(actor => {
			let parents = actor.parents;
			let prefix = 'personList[' + ix + '].';

			Person.Properties.forEach(prop => {
				formData.append(prefix + prop, actor[prop]);
			});
console.log('person:' + actor.id);
			if (parents) {
				let pp = prefix + 'parents.';
console.log('親:' + parents.father.id + '|' + parents.mother.id);
				formData.append(pp + 'id', parents.id);
				formData.append(pp + 'type', parents.type);
				formData.append(pp + 'person.id', parents.father.id);
				formData.append(pp + 'other.id', parents.mother.id);
			}
			ix++;
		});
	}

	save() {
		let settingPanel = document.getElementById('settingPanel');
		let description = settingPanel.querySelector('[name="description"]');
		let canvas = FlexibleView.Instance.canvas;
		let formData = new FormData(this.form);
		let entity = new DiagramEntity();
		let messagePopup = document.getElementById('messagePopup');
		let content = messagePopup.querySelector('p');

		formData.append('id', this.appMain.diagramId);
		formData.append('documentId', this.appMain.documentId);
		formData.append('personId', 'test');
		formData.append('description', description.value);
		formData.append('image', canvas.toDataURL());
		this.createPersonList(formData);
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
