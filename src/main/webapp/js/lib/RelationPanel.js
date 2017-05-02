class RelationPanel {
	constructor() {
		this.panel = document.getElementById('relationPanel');
		this.relation = null;
		this.setupEvents();
	}

	setupEvents() {
		let childButton = document.getElementById('childButton');

		childButton.addEventListener('click', ()=> {
			let child = new Person();

			this.relation.mother.addChild(this.relation.father, child);
			Field.Instance.addActor(child);
		});
	}

	setupForm() {
		let father = this.panel.querySelector('[name="father"]');
		let mother = this.panel.querySelector('[name="mother"]');

		father.value = this.relation.father.name;
		mother.value = this.relation.mother.name;
	}

	open(relation) {
		this.relation = relation;
		this.setupForm();
		$(this.panel).panel('open');
	}
}
