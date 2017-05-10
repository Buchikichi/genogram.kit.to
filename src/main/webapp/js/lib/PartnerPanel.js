class PartnerPanel {
	constructor() {
		this.panel = document.getElementById('partnerPanel');
		this.relation = null;
		this.setupEvents();
	}

	setupEvents() {
		let mChildButton = document.getElementById('mChildButton');
		let fChildButton = document.getElementById('fChildButton');
		let addChild = gender => {
			let child = new Person(null, gender);

			this.relation.addChild(child);
			Field.Instance.addActor(child);
		}

		mChildButton.addEventListener('click', ()=> {
			addChild('m');
		});
		fChildButton.addEventListener('click', ()=> {
			addChild('f');
		});
		$(this.panel).panel({close: () => {
			Field.Instance.clearSelection();
		}});
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
