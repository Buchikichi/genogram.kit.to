class RelationPanel {
	constructor() {
		this.panel = document.getElementById('relationPanel');
		this.from = null;
		this.to = null;
		this.setupEvents();
	}

	setupEvents() {
		let createButton = this.panel.querySelector('[name="createButton"]');
//		let fChildButton = document.getElementById('fChildButton');
//		let addChild = gender => {
//			let child = new Person(null, gender);
//
//			this.relation.mother.addChild(this.relation.father, child);
//			Field.Instance.addActor(child);
//		}
//
		createButton.addEventListener('click', ()=> {
			let relationship = new Relationship(this.from, this.to);

			Field.Instance.addActor(relationship);
		});
//		fChildButton.addEventListener('click', ()=> {
//			addChild('f');
//		});
		$(this.panel).panel({close: () => {
			Field.Instance.clearSelection();
		}});
	}

	setupForm() {
		let from = this.panel.querySelector('[name="from"]');
		let to = this.panel.querySelector('[name="to"]');

		from.value = this.from.name;
		to.value = this.to.name;
	}

	open(from, to) {

		this.from = from;
		this.to = to;
		this.setupForm();
		$(this.panel).panel('open');
	}
}
