class InputPanel extends AbstractPane {
	constructor(editor) {
		super('inputPanel', editor);
		this.partnerView = document.getElementById('partnerView');
		this.person = null;
		this.setupEvents();
	}

	setupEvents() {
		super.setupEvents();
		let name = this.pane.querySelector('[name="name"]');
		let description = this.pane.querySelector('[name="description"]');
		let genderList = $('[name="gender"]');
		let dob = this.pane.querySelector('[name="dob"]');
		let dod = this.pane.querySelector('[name="dod"]');
		let age = this.pane.querySelector('[name="age"]');

		name.addEventListener('keyup', ()=> {
			this.person.name = name.value;
		});
		description.addEventListener('keyup', ()=> {
			this.person.description = description.value;
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
		this.setupAttrEvents();
		this.setupButtonEvents();
	}

	setupAttrEvents() {
		let illness = this.pane.querySelector('[name="illness"]');
		let abuse = this.pane.querySelector('[name="abuse"]');
		let attr = this.pane.querySelector('[name="attr"]');

		$(illness).bind('change', ()=> {
			this.person.illness = illness.checked ? 1 : 0;
		});
		$(abuse).bind('change', ()=> {
			this.person.abuse = abuse.checked ? 1 : 0;
		});
		attr.addEventListener('keyup', ()=> {
			this.person.attr = attr.value;
		});
	}

	setupButtonEvents() {
		this.parentsButton = document.getElementById('parentsButton');
		this.partnerButton = document.getElementById('partnerButton');
		this.parentsButton.addEventListener('click', ()=> this.addParents());
		this.partnerButton.addEventListener('click', ()=> this.addPartner());

		this.upButton = document.getElementById('upButton');
		this.upButton.addEventListener('click', ()=> this.moveUp());
		this.downButton = document.getElementById('downButton');
		this.downButton.addEventListener('click', ()=> this.moveDown());
//		this.leftButton = document.getElementById('leftButton');
//		this.leftButton.addEventListener('click', ()=> this.moveLeft());
//		this.rightButton = document.getElementById('rightButton');
//		this.rightButton.addEventListener('click', ()=> this.moveRight());

		this.deleteButton = this.pane.querySelector('[name="deleteButton"]');
		this.deleteButton.addEventListener('click', ()=> {
			this.person.remove();
			this.editor.closePane();
		});
	}

	ageChanged() {
		let dob = this.pane.querySelector('[name="dob"]');
		let dod = this.pane.querySelector('[name="dod"]');
		let age = this.pane.querySelector('[name="age"]');
		let val = parseInt(age.value);

		this.person.age = null;
		if (isNaN(val)) {
			dob.value = null;
			this.person.dob = null;
			this.refreshControls();
			return;
		}
		let currentYear = new Date().getFullYear();
		let year = currentYear - val;

		dob.value = year;
		this.person.dob = year;
		this.person.age = val;
		this.refreshControls();
	}

	addParents() {
		let field = Field.Instance;

//console.log(field.numOfGeneration + '/min:' + field.minGeneration + '/max:' + field.maxGeneration);
//console.log('person.generation:' + this.person.generation);
		if (this.person.generation == field.minGeneration && field.numOfGeneration == Field.MAX_GENERATION) {
			MessagePopup.open('msg.generations');
			return;
		}
		let father = new Person('m');
		let mother = new Person('f');
		let relation = field.createPair(father, mother);

		this.person.addParents(relation);
		this.refreshControls();
	}

	addPartner() {
		let field = Field.Instance;
		let gender = this.person.isMale ? 'f' : 'm';
		let partner = new Person(gender);
		let relation = field.createPair(this.person, partner);

		this.person.addPartner(relation);
		this.setupPartner();
		this.refreshControls();
	}

	moveUp() {
		this.person.moveUp();
		this.refreshControls();
		Field.Instance.dirty = true;
	}

	moveDown() {
		this.person.moveDown();
		this.refreshControls();
		Field.Instance.dirty = true;
	}

	moveLeft() {
		this.person.moveLeft();
		this.refreshControls();
		Field.Instance.dirty = true;
	}

	moveRight() {
		this.person.moveRight();
		this.refreshControls();
		Field.Instance.dirty = true;
	}

	refreshControls() {
		let gender = this.person.gender;
		let age = this.person.age;
		let parents = this.person.parents;
		let canUp = parents && parents.leftSide.ay + 2 < this.person.ay; 
		let marriageable = (gender == 'f' || gender == 'm') && age == null || Person.MarriageableAge < age;
		let plen = this.person.relationList.length;
		let deleteButton = this.pane.querySelector('[name="deleteButton"]');

		if (plen == 0) {
			$('[name="gender"]').checkboxradio('enable');
		} else {
			$('[name="gender"]').checkboxradio('disable');
		}
		this.enableButton(this.parentsButton, !this.person.parents);
		this.enableButton(this.partnerButton, marriageable);
		this.enableButton(this.upButton, canUp);
		this.enableButton(this.downButton, parents);
//		this.enableButton(this.leftButton, false);
//		this.enableButton(this.rightButton, false);
		this.enableButton(this.deleteButton, this.person.removable);
	}

	setupPartner() {
		let ul = this.partnerView;

		ul.textContent = null;
		this.person.relationList.forEach(relation => {
			let partner = relation.getPartner(this.person);
			let name = document.createElement('span');
			let anchor = document.createElement('a');
			let li = document.createElement('li');

			name.textContent = partner.info;
			anchor.appendChild(name);
			li.appendChild(anchor);
			li.setAttribute('data-id', partner.id);
			li.setAttribute('data-icon', false);
			ul.appendChild(li);
		});
		$(ul).listview('refresh');
	}

	setupForm() {
		let field = Field.Instance;

		FormUtils.load(this.form, this.person);
		this.setupPartner();
		this.refreshControls();
		field.addTarget(this.person);
	}

	open(person) {
		let center = Field.Instance.center;
		let position = center < person.ax ? 'left' : 'right';

		this.person = person;
		this.setupForm();
		this.showPane(position);
	}
}
