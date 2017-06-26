class EnclosurePopup {
	constructor() {
		this.popup = document.getElementById('enclosurePopup');
		this.form = this.popup.querySelector('form');
		this.plusButton = this.popup.querySelector('.ui-icon-plus');
		this.minusButton = this.popup.querySelector('.ui-icon-minus');
		this.setupEvents();
	}

	setupEvents() {
		let deleteButton = this.popup.querySelector('.ui-icon-delete:not(.ui-btn-icon-notext)');
		let lineStyle = $('[name=lineStyle]');

		lineStyle.click(e=> {
			let radio = e.target;

			this.target.parent.lineStyle = radio.value;
		});
		this.plusButton.addEventListener('click', ()=> {
			this.target.increase();
		});
		this.minusButton.addEventListener('click', ()=> {
			let parent = this.target.parent;

			parent.delHandle(this.target);
			$(this.popup).popup('close');
		});
		deleteButton.addEventListener('click', ()=> {
			this.target.parent.eject();
			$(this.popup).popup('close');
		});
		$(this.popup).popup({afterclose: () => {
			Field.Instance.clearSelection();
		}});
	}

	setupForm() {
		let length = this.target.listAll.length;

		FormUtils.load(this.form, this.target);
		FormUtils.enableButton(this.minusButton, 3 < length);
	}

	open(target) {
		let field = Field.Instance;

		field.addTarget(target.parent);
		this.target = target;
		this.setupForm();
		$(this.popup).popup('open', {});
	}
}
