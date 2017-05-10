class RelationPanel {
	constructor() {
		this.panel = document.getElementById('relationPanel');
		this.deleteButton = this.panel.querySelector('[name="deleteButton"]');
		this.from = null;
		this.to = null;
		this.setupEvents();
	}

	setupEvents() {
		$('[name="emotion"]').click(()=> {
			this.deleteRelationship();
			this.relationship = this.createRelationship();
			this.resetControls();
		});
		this.deleteButton.addEventListener('click', ()=> {
			this.deleteRelationship();
			this.resetControls();
		});
		$(this.panel).panel({close: () => {
			Field.Instance.clearSelection();
		}});
	}

	createRelationship() {
		let emotion = $('[name="emotion"]:checked');
		let relationship = Relationship.create(emotion.val(), this.from, this.to);

		relationship.hit = true;
		Field.Instance.addActor(relationship);
		return relationship;
	}

	deleteRelationship() {
		if (this.relationship) {
			this.relationship.eject();
			this.relationship = null;
		}
	}

	resetControls() {
		if (this.relationship) {
			$(this.deleteButton).show();
		} else {
			$(this.deleteButton).hide();
		}
	}

	setupForm() {
		let from = this.panel.querySelector('[name="from"]');
		let to = this.panel.querySelector('[name="to"]');
		let emotion = $('[name="emotion"]');

		from.value = this.from.name;
		to.value = this.to.name;
		if (this.relationship) {
			emotion.val([this.relationship.emotion]).checkboxradio('refresh');
		} else {
			emotion.removeAttr('checked').checkboxradio('refresh');
		}
		this.resetControls();
	}

	open(from, to = null) {
		if (to) {
			this.from = from;
			this.to = to;
			this.relationship = null;
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
