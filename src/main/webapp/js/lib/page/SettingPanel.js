class SettingPanel {
	constructor(appMain) {
		this.appMain = appMain;
		this.panel = document.getElementById('settingPanel');
		this.saveButton = document.getElementById('saveButton');
		this.setupEvents();
	}

	setupEvents() {
		let encloseButton = document.getElementById('encloseButton');
		let printButton = document.getElementById('printButton');

		encloseButton.addEventListener('click', () => {this.addEnclosure()});
		printButton.addEventListener('click', () => {this.print()});
		if (0 < this.appMain.documentId.length) {
			this.saveButton.classList.remove('ui-state-disabled');
			this.saveButton.addEventListener('click', ()=> {this.save()});
		}
		if (Field.DEBUG) {
			let grid = document.querySelector('[name="grid"]');

			grid.checked = true;
		}
	}

	addEnclosure() {
		this.appMain.addEnclosure();
	}

	print() {
		let iframe = document.getElementById('printFrame');
		let description = document.querySelector('[name="description"]');
		let win = iframe.contentWindow;
		let title = win.document.querySelector('title');
		let img = win.document.querySelector('img');
		let canvas = FlexibleView.Instance.canvas;

		iframe.style.position = 'fixed';
		iframe.style.right = '0';
		iframe.style.bottom = '0';
		title.textContent = description.value;
		img.src = canvas.toDataURL();
		img.addEventListener('load', () => {
			win.focus();
			win.print();
		});
	}

	createPersonList(formData) {
		let field = this.appMain.field;
		let personList = field.personList;
		let parentsList = [];

		personList.sort((a, b) => {
			return a.generation - b.generation;
		});
		personList.forEach((person, ix) => {
			let parents = person.parents;
			let prefix = 'personList[' + ix + '].';

			if (person.principal) {
				formData.append('personId', person.id);
			}
			person.appendTo(formData, prefix);
console.log(ix + ':' + person.id);
			if (parents) {
//console.log('親:' + parents.father.id + '|' + parents.mother.id);
				let pp = prefix + 'parents.';
				let parentsId = parents.id;

				if (parentsList.indexOf(parents) == -1) {
					parentsList.push(parents);
				} else {
					parentsId = UUID.toString();
				}
				formData.append(pp + 'id', parentsId);
				formData.append(pp + 'type', parents.type);
				formData.append(pp + 'person.id', parents.father.id);
				formData.append(pp + 'other.id', parents.mother.id);
			}
		});
	}

	createPartnerList(formData) {
		let field = this.appMain.field;
		let pairList = field.pairList;
		let ix = 0;

		pairList.forEach(partner => {
			if (0 < partner.children.length) {
				return;
			}
			let prefix = 'partnerList[' + ix + '].';

			formData.append(prefix + 'id', partner.id);
			formData.append(prefix + 'type', partner.type);
			formData.append(prefix + 'person.id', partner.father.id);
			formData.append(prefix + 'other.id', partner.mother.id);
			ix++;
		});
	}

	createRelationshipList(formData) {
		let field = this.appMain.field;
		let relationshipList = field.relationshipList;

		relationshipList.forEach((rel, ix) => {
			let prefix = 'relationshipList[' + ix + '].';

			formData.append(prefix + 'id', rel.id);
			formData.append(prefix + 'emotion', rel.emotion);
			formData.append(prefix + 'person.id', rel.person.id);
			formData.append(prefix + 'other.id', rel.other.id);
		});
	}

	save() {
		let settingPanel = document.getElementById('settingPanel');
		let description = settingPanel.querySelector('[name="description"]');
		let canvas = FlexibleView.Instance.canvas;
		let formData = new FormData(this.form);
		let entity = new DiagramEntity();
		let messagePopup = document.getElementById('messagePopup');
		let content = messagePopup.querySelector('p');

		formData.append('id', this.appMain.diagramId);
		formData.append('documentId', this.appMain.documentId);
		formData.append('description', description.value);
		formData.append('image', canvas.toDataURL());
		this.createPersonList(formData);
		this.createPartnerList(formData);
		this.createRelationshipList(formData);
		$.mobile.loading('show', {text: 'Save...', textVisible: true});
		entity.save(formData).then(data => {
			$.mobile.loading('hide');
			if (data.ok) {
				$(settingPanel).panel('close');
				content.textContent = '保存しました。';
			} else {
				content.textContent = 'Save failed.';
			}
			$(messagePopup).popup('open', {});
		});
	}

	open() {
		$(this.panel).panel('open');
	}
}
