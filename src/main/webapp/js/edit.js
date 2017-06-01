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
target.nextActor.forEach(nx => {
	console.log('(' + target.info + '->' + nx.info + ')');
});
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
		this.loadDiagram(root);
//this.field.actorList.push(new EnclosingLine());
	}

	initSandbox(root) {
		let newPerson = new Person();

		if (Field.DEBUG) {
			newPerson.name = 'principal(本人)';
		}
		newPerson.principal = true;
		root.assignActor(newPerson);
		this.field.addActor(newPerson);
	}

	makePersonMap(personList) {
		let map = {};

		personList.forEach(rec => {
			map[rec.id] = Person.createFromEntity(rec);
		});
		return map;
	}

	loadDiagram(root) {
		let entity = new DiagramEntity();

		entity.select(this.diagramId).then(diagram => {
			let personMap = this.makePersonMap(diagram.personList);

			this.loadPersons(root, diagram, personMap);
			this.loadRelationship(diagram, personMap);
		});
	}

	loadPersons(root, diagram, personMap) {
		let seq = 0;

		personMap[diagram.personId].principal = true;
		diagram.personList.forEach(rec => {
			let person = personMap[rec.id];

console.log('*** #' + rec.seq + '.' + person.info + ' ***');
			seq = rec.seq;
			if (rec.prevId == null) {
				root.assignActor(person);
			} else {
				person.prevActor = personMap[rec.prevId];
			}
			if (rec.parents) {
				let parents = rec.parents;
				let father = personMap[parents.person.id];
				let mother = personMap[parents.other.id];
console.log('  *  father:' + father.info + '/mother:' + mother.info);
				let relation = this.field.createPair(father, mother);

				relation.id = parents.id;
				relation.type = parents.type;
				person.addParents(relation);
			}
			this.field.addActor(person);
		});
		Tally.reset(seq);
	}

	loadRelationship(diagram, personMap) {
		diagram.relationshipList.forEach(rel => {
//console.log('rel type:' + rel.type);
//console.log(rel);
			let person = personMap[rel.person.id];
			let other = personMap[rel.other.id];
			let relationship = Relationship.create(rel.emotion, person, other);

			this.field.addActor(relationship);
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
		let parentsList = [];

		personList.sort((a, b) => {
			return a.generation - b.generation;
		});
		personList.forEach((person, ix) => {
			let parents = person.parents;
			let prefix = 'personList[' + ix + '].';

			if (person.principal) {
				formData.append('personId', person.id);
			}
			person.appendTo(formData, prefix);
console.log(ix + ':' + person.id);
			if (parents) {
//console.log('親:' + parents.father.id + '|' + parents.mother.id);
				let pp = prefix + 'parents.';
				let parentsId = parents.id;

				if (parentsList.indexOf(parents) == -1) {
					parentsList.push(parents);
				} else {
					parentsId = UUID.toString();
				}
				formData.append(pp + 'id', parentsId);
				formData.append(pp + 'type', parents.type);
				formData.append(pp + 'person.id', parents.father.id);
				formData.append(pp + 'other.id', parents.mother.id);
			}
		});
	}

	createRelationshipList(formData) {
		let field = this.appMain.field;
		let relationshipList = field.relationshipList;

		relationshipList.forEach((rel, ix) => {
			let prefix = 'relationshipList[' + ix + '].';

			formData.append(prefix + 'id', rel.id);
			formData.append(prefix + 'emotion', rel.emotion);
			formData.append(prefix + 'person.id', rel.person.id);
			formData.append(prefix + 'other.id', rel.other.id);
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
		formData.append('description', description.value);
		formData.append('image', canvas.toDataURL());
		this.createPersonList(formData);
		this.createRelationshipList(formData);
		$.mobile.loading('show', {text: 'Save...', textVisible: true});
		entity.save(formData).then(data => {
			$.mobile.loading('hide');
			if (data.ok) {
				$(settingPanel).panel('close');
				content.textContent = '保存しました。';
			} else {
				content.textContent = 'Save failed.';
			}
			$(messagePopup).popup('open', {});
		});
	}
}
