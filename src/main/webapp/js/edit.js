document.addEventListener('DOMContentLoaded', ()=> {
	let app = new EditorMain();
	let activate = ()=> {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		app.control();
		app.draw();
		requestAnimationFrame(activate);
	};

	activate();
});

class EditorMain {
	constructor() {
		this.diagramId = document.querySelector('[name="id"]').value;
		this.documentId = document.querySelector('[name="documentId"]').value;
		this.controller = new Controller();
		this.field = new Field(1024, 768);
		this.pane = document.getElementById('pane');
		this.isPanel = this.pane.getAttribute('data-draggable') != 'true';
		this.settingPanel = new SettingPanel(this);
		this.inputPanel = new InputPanel(this);
		this.partnerPanel = new PartnerPanel(this);
		this.relationPanel = new RelationPanel(this);
		this.paneList = [this.inputPanel, this.partnerPanel, this.relationPanel];
		this.enclosurePopup = new EnclosurePopup();
		this.init();
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

	closePane() {
		if (this.isPanel) {
			this.paneList.forEach(pane => {
				pane.hidePane();
			});
		} else {
			$(this.pane).hide();
		}
		this.settingPanel.close();
	}

	init() {
		if (!this.isPanel) {
			this.pane.style.position = 'absolute';
			this.pane.style.opacity = .97;
			$(this.pane).draggable();
			$(this.pane).hide();
		}
		if (this.diagramId.length == 0 || this.documentId.length == 0) {
			this.initSandbox();
			return;
		}
		this.loadDiagram();
	}

	initSandbox() {
		Tally.reset();
		let newPerson = this.field.clearAll();

		if (EditorMain.DEBUG) {
			newPerson.name = 'principal(本人)';
		}
	}

	addEnclosure() {
		this.field.actorList.push(EnclosingLine.createDefault());
	}

	makePersonMap(personList) {
		let map = {};

		personList.forEach(rec => {
			map[rec.id] = Person.createFromEntity(rec);
		});
		return map;
	}

	loadDiagram() {
		let entity = new DiagramEntity();

console.log('[loadDiagram]:BEGIN');
		entity.select(this.diagramId).then(diagram => {
			let personMap = this.makePersonMap(diagram.personList);

			this.settingPanel.loadDiagram(diagram);
			this.loadPersons(diagram, personMap);
			this.loadPartner(diagram, personMap);
			this.loadRelationship(diagram, personMap);
			this.loadShapes(diagram);
console.log('[loadDiagram]:END');
		});
	}

	loadPersons(diagram, personMap) {
		let seq = 0;
		let parentList = [];

		personMap[diagram.personId].principal = true;
		diagram.personList.forEach(rec => {
			let person = personMap[rec.id];

console.log('*** #' + rec.seq + '.' + person.info + ' ***');
			seq = rec.seq;
			if (rec.prevId == null) {
				this.field.root.assignActor(person);
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
				person.addParents(relation, false);
				parentList.push(relation);
			}
			this.field.addActor(person);
		});
		Tally.reset(seq);
		// 兄弟の順序を正しく並び替える
		parentList.forEach(relation => {
			relation.children.sort((a, b) => {
				return a.bornOrder - b.bornOrder;
			});
		});
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
			father.addPartner(relation, false);
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

	loadShapes(diagram) {
		let parentMap = {};

		// 先に親だけ処理
		diagram.shapesList.forEach(obj => {
			if (obj.parentId == null) {
				let shape = new EnclosingLine(obj.x, obj.y);

				shape.lineStyle = obj.lineStyle;
				parentMap[obj.id] = shape;
			}
		});
		// 後で子だけを処理
		diagram.shapesList.forEach(obj => {
			if (obj.parentId == null) {
				return;
			}
			let parent = parentMap[obj.parentId];

			parent.addHandle(obj.x, obj.y);
		});
		Object.keys(parentMap).forEach(key => {
			this.field.addActor(parentMap[key]);
		});
	}

	onSingleSelection() {
		let keys = this.controller.keys;
		let ctrlKey = keys['Control'] || keys['Shift'] || keys['k16'] || keys['k17'];

		if (ctrlKey) {
			return;
		}
		let target = this.field.targetList[0];
		let dummy = null;

		if (target instanceof Person) {
			this.openPane(this.inputPanel, target);
			return;
		}
		if (target instanceof Relation) {
			this.openPane(this.partnerPanel, target);
			dummy = this.field.targetChanged;
			dummy = this.field.targetChanged;
			return;
		}
		if (target instanceof Relationship) {
			this.openPane(this.relationPanel, target);
			return;
		}
	}

	onMultiSelection() {
		let target = this.field.targetList[0];
		let other = this.field.targetList[1];

		if (!(target instanceof Person) || !(other instanceof Person)) {
			return;
		}
		let relationship = this.field.getRelationship(target, other);

		if (relationship) {
			this.openPane(this.relationPanel, relationship);
			return;
		}
		this.openPane(this.relationPanel, target, other);
	}

	control() {
		this.field.control();
		this.field.arrange();
		//
		let ctrl = Controller.Instance;
		let targetList = this.field.targetList;
		let len = targetList.length;

		if (ctrl.contextmenu) {
			let target = targetList[0];
			let hold = this.field.hold;

			if (target || hold) {
				if (hold instanceof ActorHandle) {
					this.enclosurePopup.open(hold);
				}
			} else if (len == 0) {
				this.settingPanel.open();
			}
		}
		if (!this.field.targetChanged) {
			return;
		}
		// 選択状態に変化あり
		if (len == 1) {
			this.onSingleSelection();
		} else if (2 <= len) {
			this.onMultiSelection();
		} else if (len == 0) {
			this.closePane();
		}
	}

	draw() {
		this.field.draw();
	}
}
EditorMain.DEBUG = false;
EditorMain.PANEL_DODGE = false;
