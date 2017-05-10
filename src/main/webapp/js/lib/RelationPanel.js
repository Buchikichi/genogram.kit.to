class RelationPanel {
	constructor() {
		this.panel = document.getElementById('relationPanel');
		this.createButton = this.panel.querySelector('[name="createButton"]');
		this.updateButton = this.panel.querySelector('[name="updateButton"]');
		this.deleteButton = this.panel.querySelector('[name="deleteButton"]');
		this.from = null;
		this.to = null;
		this.isNew = true;
		this.setupEvents();
	}

	setupEvents() {
		this.createButton.addEventListener('click', ()=> {
			this.relationship = this.createRelationship();
		});
		this.updateButton.addEventListener('click', ()=> {
			this.relationship.eject();
			this.relationship = this.createRelationship();
		});
		this.deleteButton.addEventListener('click', ()=> {
			this.relationship.eject();
			this.relationship = null;
			this.isNew = true;
		});
		$(this.panel).panel({close: () => {
			Field.Instance.clearSelection();
		}});
	}

	createRelationship() {
		let emotion = $('[name="emotion"]:checked');
		let relationship = Relationship.create(emotion.val(), this.from, this.to);

		Field.Instance.addActor(relationship);
		return relationship;
	}

	resetControls() {
		if (this.isNew) {
			$(this.createButton).show();
			$(this.updateButton).hide();
			$(this.deleteButton).hide();
		} else {
			$(this.createButton).hide();
			$(this.updateButton).show();
			$(this.deleteButton).show();
		}
	}

	setupForm() {
		let from = this.panel.querySelector('[name="from"]');
		let to = this.panel.querySelector('[name="to"]');

		from.value = this.from.name;
		to.value = this.to.name;
		if (this.relationship) {
			let emotion = this.relationship.emotion;

			$('[name="emotion"]').val([emotion]).checkboxradio('refresh');
		}
		this.resetControls();
	}

	open(from, to = null) {
		if (to) {
			this.from = from;
			this.to = to;
			this.isNew = true;
		} else {
			// Relationship
			this.from = from.person;
			this.to = from.other;
			this.relationship = from;
			this.isNew = false;
		}
		this.setupForm();
		$(this.panel).panel('open');
	}
}
