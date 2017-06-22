class RelationPanel extends AbstractPane {
	constructor(isPanel) {
		super('relationPanel', isPanel);
		this.flipButton = this.pane.querySelector('[name="flipButton"]');
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
		this.flipButton.addEventListener('click', ()=> this.flip());
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

	flip() {
		this.relationship.flip();
		this.from = this.relationship.person;
		this.to = this.relationship.other;
		this.resetControls();
	}

	resetControls() {
		let from = this.pane.querySelector('[name="from"]');
		let to = this.pane.querySelector('[name="to"]');

		from.value = this.from.info;
		to.value = this.to.info;
		this.enableButton(this.flipButton, this.relationship);
		this.enableButton(this.deleteButton, this.relationship);
	}

	setupForm() {
		let emotion = $('[name="emotion"]');

		if (this.relationship) {
			emotion.val([this.relationship.emotion]).checkboxradio('refresh');
		} else {
			emotion.removeAttr('checked').checkboxradio('refresh');
		}
		this.resetControls();
	}

	open(from, to = null) {
		let field = Field.Instance;
		let position = null;

		if (to) {
			let cx = from.ax + (to.ax - from.ax) / 2;

			this.from = from;
			this.to = to;
			this.relationship = null;
			this.isNew = true;
			position = field.center < cx ? 'left' : 'right'
		} else {
			// Relationship
			this.from = from.person;
			this.from.hit = true;
			this.to = from.other;
			this.to.hit = true;
			this.relationship = from;
			this.isNew = false;
			field.addTarget(this.from, this.to);
			position = field.center < this.relationship.cx ? 'left' : 'right'
		}
		this.setupForm();
		this.showPane(position);
		window.getSelection().collapse(document.body, 0);
	}
}
