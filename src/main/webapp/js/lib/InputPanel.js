class InputPanel {
	constructor() {
		this.panel = document.getElementById('inputPanel');
		this.people = null;
		this.setupEvents();
	}

	setupEvents() {
		let name = this.panel.querySelector('[name="name"]');
		let genderList = $('[name="gender"]');
		let parentsButton = document.getElementById('parentsButton');
		let partnerButton = document.getElementById('partnerButton');

		name.addEventListener('change', ()=> {
			this.people.name = name.value;
		});
		genderList.click(e => {
			let radio = e.target;
			let gender = radio.value;

			this.people.gender = gender;
			this.refreshControls();
		});
		parentsButton.addEventListener('click', ()=> {
			this.people.addParents(new Actor(), new Actor());
			this.refreshControls();
		});
		partnerButton.addEventListener('click', ()=> {
			this.people.addPartner(new Actor());
			this.refreshControls();
		});
		$(partnerButton).addClass('ui-state-disabled');
	}

	refreshControls() {
		let mother = this.people.mother;
		let gender = this.people.gender;
		let plen = this.people.partnerList.length;
		let clen = Object.keys(this.people.childrenMap).length;
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
			let val = this.people[name];

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

	open(people) {
		this.people = people;
		this.setupForm();
		$(this.panel).panel('open');
	}
}
