class InputPanel {
	constructor() {
		this.panel = document.getElementById('inputPanel');
		this.person = null;
		this.setupEvents();
	}

	setupEvents() {
		let name = this.panel.querySelector('[name="name"]');
		let genderList = $('[name="gender"]');
		let dob = this.panel.querySelector('[name="dob"]');
		let dod = this.panel.querySelector('[name="dod"]');
		let age = this.panel.querySelector('[name="age"]');
		let parentsButton = document.getElementById('parentsButton');
		let partnerButton = document.getElementById('partnerButton');
		let deleteButton = this.panel.querySelector('[name="deleteButton"]');

		name.addEventListener('change', ()=> {
			this.person.name = name.value;
		});
		genderList.click(e => {
			let radio = e.target;
			let gender = radio.value;

			this.person.gender = gender;
			this.refreshControls();
		});
		dob.addEventListener('keyup', ()=> {
			let cal = new GenoCalendar(dob.value);
			let val = cal.toString();

			this.person.dob = val;
			age.value = this.person.age;
		});
		dob.addEventListener('change', ()=> {
			let cal = new GenoCalendar(dob.value);

			dob.value = cal.toString();
		});
		dod.addEventListener('keyup', ()=> {
			let cal = new GenoCalendar(dod.value);
			let val = cal.toString();

			this.person.dod = val;
			age.value = this.person.age;
		});
		dod.addEventListener('change', ()=> {
			let cal = new GenoCalendar(dod.value);

			dod.value = cal.toString();
		});
		age.addEventListener('keyup', ()=> this.ageChanged());
		parentsButton.addEventListener('click', ()=> this.addParents());
		partnerButton.addEventListener('click', ()=> this.addPartner());
		deleteButton.addEventListener('click', ()=> this.person.remove());
		$(this.panel).panel({close: () => {
			Field.Instance.clearSelection();
		}});
	}

	ageChanged() {
		let dob = this.panel.querySelector('[name="dob"]');
		let dod = this.panel.querySelector('[name="dod"]');
		let age = this.panel.querySelector('[name="age"]');
		let val = parseInt(age.value);

		this.person.age = null;
		if (!val) {
			return;
		}
		let currentYear = new Date().getFullYear();
		let year = currentYear - val;

		dob.value = year;
		this.person.dob = year;
		this.person.age = val;
	}

	addParents() {
		let father = new Person(null, 'm');
		let mother = new Person(null, 'f');
		let relation = new Relation(father, mother);

		this.person.addParents(relation);
		this.refreshControls();
		Field.Instance.addActor(father, mother, relation);
	}

	addPartner() {
		let gender = this.person.isMale ? 'f' : 'm';
		let partner = new Person(null, gender);
		let relation = new Relation(this.person, partner);

		this.person.addPartner(relation);
		this.refreshControls();
		Field.Instance.addActor(partner, relation);
	}

	refreshControls() {
		let gender = this.person.gender;
		let plen = this.person.relationList.length;
		let parentsButton = document.getElementById('parentsButton');
		let partnerButton = document.getElementById('partnerButton');
		let deleteButton = this.panel.querySelector('[name="deleteButton"]');

		if (plen == 0) {
			$('[name="gender"]').checkboxradio('enable');
		} else {
			$('[name="gender"]').checkboxradio('disable');
		}
		if (this.person.parents) {
			$(parentsButton).addClass('ui-state-disabled');
		} else {
			$(parentsButton).removeClass('ui-state-disabled');
		}
		if (gender == null || gender == '') {
			$(partnerButton).addClass('ui-state-disabled');
		} else {
			$(partnerButton).removeClass('ui-state-disabled');
		}
		if (this.person.principal || this.person.hasChild) {
			$(deleteButton).addClass('ui-state-disabled');
		} else {
			$(deleteButton).removeClass('ui-state-disabled');
		}
//		Field.Instance.dirty = true;
	}

	setupForm() {
		$('#inputPanel form :input').each((ix, element) => {
			let name = element.getAttribute('name');
			let type = element.getAttribute('type');
			let val = this.person[name];

			if (type == 'radio') {
				$(element).val([val]).checkboxradio('refresh');
			} else {
//console.log(name + ':' + val);
//				element.setAttribute('value', val);
				element.value = val;
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
