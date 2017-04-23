class People {
	constructor(id = null) {
		if (id == null) {
			this.id = UUID.toString();
//console.log('UUID:' + this.id);
		} else {
			this.id = id;
		}
		this.name = '';
		this.description = '';
		this.gender = '';
		this.dob = '';
		this.mother = null;
		this.partnerList = [];
		this.childrenMap = {};
	}

	get isMale() {
		return this.gender == 'm';
	}

	get father() {
		if (!this.mother) {
			return;
		}
	}

	get numOfPartner() {
		return this.partnerList.length;
	}
}
