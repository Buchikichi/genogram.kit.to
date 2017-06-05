class RelationPanel extends AbstractPane {
	constructor(isPanel) {
		super('relationPanel', isPanel);
		this.deleteButton = this.pane.querySelector('[name="deleteButton"]');
		this.from = null;
		this.to = null;
		this.setupEvents();
	}

	setupEvents() {
		super.setupEvents();
		$('[name="emotion"]').click(()=> {
			this.deleteRelationship();
			this.relationship = this.createRelationship();
			this.resetControls();
		});
		this.deleteButton.addEventListener('click', ()=> {
			this.deleteRelationship();
			this.resetControls();
		});
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
			$(this.deleteButton).removeClass('ui-state-disabled');
		} else {
			$(this.deleteButton).addClass('ui-state-disabled');
		}
	}

	setupForm() {
		let from = this.pane.querySelector('[name="from"]');
		let to = this.pane.querySelector('[name="to"]');
		let emotion = $('[name="emotion"]');

		from.value = this.from.info;
		to.value = this.to.info;
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
			this.from.hit = true;
			this.to = from.other;
			this.to.hit = true;
			this.relationship = from;
			this.isNew = false;
		}
		this.setupForm();
		this.showPane();
		window.getSelection().collapse(document.body, 0);
	}
}
