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
		this.pane = document.getElementById('pane');
		this.isPanel = this.pane.getAttribute('data-draggable') != 'true';
		this.settingPanel = new SettingPanel(this);
		this.inputPanel = new InputPanel(this.isPanel);
		this.partnerPanel = new PartnerPanel(this.isPanel);
		this.relationPanel = new RelationPanel(this.isPanel);
		this.paneList = [this.inputPanel, this.partnerPanel, this.relationPanel];
		this.setupEvents();
		this.init();
	}

	setupEvents() {
		let view = document.getElementById('view');
		let gridSpacing = $('[name="gridSpacing"]');

		$(this.pane).hide();
		view.addEventListener('mouseup', () => {
			if (this.field.targetList.length == 0) {
				$(this.pane).hide();
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
					this.openPane(this.inputPanel, target);
					return;
				}
				if (target instanceof Relation) {
					this.openPane(this.partnerPanel, target);
					return;
				}
				if (target instanceof Relationship) {
					this.openPane(this.relationPanel, target);
					return;
				}
			}
			if (2 <= this.field.targetList.length) {
				let other = this.field.targetList[1];
				let relationship = this.field.getRelationship(target, other);

				if (relationship) {
					this.openPane(this.relationPanel, relationship);
					return;
				}
				this.openPane(this.relationPanel, target, other);
			}
		});
		gridSpacing.change(()=> {
			this.field.dirty = true;
		});
		window.addEventListener('contextmenu', event => {
			if (this.field.targetList.length == 0) {
				this.settingPanel.open();
			}
		});
		if (!this.isPanel) {
			this.pane.style.position = 'absolute';
			$(this.pane).draggable();
		}
	}

	openPane(targetPane, target, other = null) {
		this.paneList.forEach(pane => {
			if (pane == targetPane) {
				pane.open(target, other);
			} else {
				pane.hidePane();
			}
		});
		$(this.pane).show();
	}

	init() {
		let root = new ChainRoot();

//this.field.actorList.push(new EnclosingLine());
		this.field.addActor(root);
		if (this.diagramId.length == 0 || this.documentId.length == 0) {
			this.initSandbox(root);
			return;
		}
		this.loadDiagram(root);
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

console.log('[loadDiagram]:BEGIN');
		entity.select(this.diagramId).then(diagram => {
			let personMap = this.makePersonMap(diagram.personList);

			this.loadPersons(root, diagram, personMap);
			this.loadPartner(diagram, personMap);
			this.loadRelationship(diagram, personMap);
console.log('[loadDiagram]:END');
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

	loadPartner(diagram, personMap) {
		// 子のないパートナーを追加
		diagram.partnerList.forEach(rec => {
			let father = personMap[rec.person.id];
			let mother = personMap[rec.other.id];
			let relation = this.field.createPair(father, mother);

			if (0 < relation.children.length) {
				return;
			}
			relation.id = rec.id;
			relation.type = rec.type;
			father.addPartner(relation);
			this.field.addActor(relation);
		});
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
