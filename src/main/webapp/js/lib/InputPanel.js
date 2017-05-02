class InputPanel {
	constructor() {
		this.panel = document.getElementById('inputPanel');
		this.person = null;
		this.setupEvents();
	}

	setupEvents() {
		let name = this.panel.querySelector('[name="name"]');
		let genderList = $('[name="gender"]');
		let parentsButton = document.getElementById('parentsButton');
		let partnerButton = document.getElementById('partnerButton');

		name.addEventListener('change', ()=> {
			this.person.name = name.value;
		});
		genderList.click(e => {
			let radio = e.target;
			let gender = radio.value;

			this.person.gender = gender;
			this.refreshControls();
		});
		parentsButton.addEventListener('click', ()=> {
			let father = new Person();
			let mother = new Person();

			this.person.addParents(father, mother);
			this.refreshControls();
			Field.Instance.addActor(father, mother);
		});
		partnerButton.addEventListener('click', ()=> {
			let partner = new Person();

			this.person.addPartner(partner);
			this.refreshControls();
			Field.Instance.addActor(partner);
		});
		$(this.panel).panel({close: () => {
			Field.Instance.scan(Number.MAX_VALUE, Number.MAX_VALUE);
		}});
		$(partnerButton).addClass('ui-state-disabled');
	}

	refreshControls() {
		let mother = this.person.mother;
		let gender = this.person.gender;
		let plen = this.person.partnerList.length;
		let clen = Object.keys(this.person.childrenMap).length;
		let parentsButton = document.getElementById('parentsButton');
		let partnerButton = document.getElementById('partnerButton');
		let deleteButton = document.getElementById('deleteButton');

		if (plen == 0) {
			$('[name="gender"]').checkboxradio('enable');
		} else {
			$('[name="gender"]').checkboxradio('disable');
		}
		if (mother) {
			$(parentsButton).addClass('ui-state-disabled');
		} else {
			$(parentsButton).removeClass('ui-state-disabled');
		}
		if (gender == null || gender == '') {
			$(partnerButton).addClass('ui-state-disabled');
		} else {
			$(partnerButton).removeClass('ui-state-disabled');
		}
		if (plen == 0 && clen == 0) {
			$(deleteButton).removeClass('ui-state-disabled');
		} else {
			$(deleteButton).addClass('ui-state-disabled');
		}
		Field.Instance.dirty = true;
	}

	setupForm() {
		$('#inputPanel form :input').each((ix, element) => {
			let name = element.getAttribute('name');
			let type = element.getAttribute('type');
			let val = this.person[name];

			if (type == 'radio') {
				$(element).val([val]).checkboxradio('refresh');
			} else {
console.log(name + ':' + val);
//				element.setAttribute('value', val);
				$(element).val(val);
			}
		});
		this.refreshControls();
	}

	open(person) {
		this.person = person;
		this.setupForm();
		$(this.panel).panel('open');
	}
}
