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
		this.motherId = null;
		this.partnerList = [];
		this.childrenList = [];
	}
}
