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
			let age = cal.age;
			let val = cal.toString();

			this.person.dob = val;
			this.person.age = age;
			age.value = age;
		});
		dod.addEventListener('keyup', ()=> {
			let cal = new GenoCalendar(dod.value);
			let val = cal.toString();

			this.person.dod = val;
			this.refreshControls();
		});
		dod.addEventListener('change', ()=> {
			let cal = new GenoCalendar(dod.value);

			dod.value = cal.toString();
		});
		age.addEventListener('keyup', ()=> {
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
		});
		parentsButton.addEventListener('click', ()=> this.addParents());
		partnerButton.addEventListener('click', ()=> this.addPartner());
		$(this.panel).panel({close: () => {
			Field.Instance.clearSelection();
		}});
		$(partnerButton).addClass('ui-state-disabled');
	}

	addParents() {
		let father = new Person(null, 'm');
		let mother = new Person(null, 'f');
		let relation = new Relation(father, mother);

		this.person.addParents(father, mother);
		this.refreshControls();
		Field.Instance.addActor(father, mother, relation);
	}

	addPartner() {
		let gender = this.person.isMale ? 'f' : 'm';
		let partner = new Person(null, gender);
		let relation = new Relation(this.person, partner);

		this.person.addPartner(partner);
		this.refreshControls();
		Field.Instance.addActor(partner, relation);
	}

	refreshControls() {
		let mother = this.person.mother;
		let gender = this.person.gender;
		let plen = this.person.partnerList.length;
		let clen = Object.keys(this.person.childrenMap).length;
		let dod = this.panel.querySelector('[name="dod"]');
		let age = this.panel.querySelector('[name="age"]');
		let parentsButton = document.getElementById('parentsButton');
		let partnerButton = document.getElementById('partnerButton');
		let deleteButton = document.getElementById('deleteButton');

		if (plen == 0) {
			$('[name="gender"]').checkboxradio('enable');
		} else {
			$('[name="gender"]').checkboxradio('disable');
		}
		if (this.person.dod) {
			$(age).prop('disabled', true);
		} else {
			$(age).removeProp('disabled');
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
