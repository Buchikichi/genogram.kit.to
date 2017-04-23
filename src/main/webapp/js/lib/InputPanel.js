class InputPanel {
	constructor() {
		this.panel = document.getElementById('inputPanel');
		this.people = null;
		this.setupEvents();
	}

	setupEvents() {
		let name = this.panel.querySelector('[name="name"]');
		let genderList = $('[name="gender"]');
		let partnerButton = document.getElementById('partnerButton');
		let childButton = document.getElementById('childButton');

		name.addEventListener('change', ()=> {
			this.people.name = name.value;
		});
		genderList.click(e => {
			let radio = e.target;
			let gender = radio.value;

			this.people.gender = gender;
			this.refreshControls();
		});
		partnerButton.addEventListener('click', ()=> {
			let gender = this.people.gender;
			let partner = new Actor();

			partner.gender = gender == 'm' ? 'f' : gender == 'f' ? 'm' : '';
			this.people.addPartner(partner);
		});
		$(partnerButton).addClass('ui-state-disabled');
		childButton.addEventListener('click', ()=> {
			this.people.addChild();
		});
	}

	refreshControls() {
		let gender = this.people.gender;
		let plen = this.people.partnerList.length;
		let clen = this.people.childrenList.length;
		let partnerButton = document.getElementById('partnerButton');
		let deleteButton = document.getElementById('deleteButton');

		if (gender == null || gender == '') {
			$(partnerButton).addClass('ui-state-disabled');
		} else {
			$(partnerButton).removeClass('ui-state-disabled');
		}
		if (0 < plen || 0 < clen) {
			$(deleteButton).addClass('ui-state-disabled');
		} else {
			$(deleteButton).removeClass('ui-state-disabled');
		}
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
