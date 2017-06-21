class SettingPanel {
	constructor(appMain) {
		this.appMain = appMain;
		this.panel = document.getElementById('settingPanel');
		this.form = this.panel.querySelector('form');
		this.saveButton = document.getElementById('saveButton');
		this.setupEvents();
	}

	setupEvents() {
		let gridSize = $('[name="gridSize"]');
		let nameSize = $('[name="nameSize"]');
		let encloseButton = document.getElementById('encloseButton');

		gridSize.change(()=> {
			if (!gridSize.val()) {
				gridSize.val(gridSize.attr('value'));
				gridSize.slider('refresh');
			}
		});
		nameSize.change(()=> {
			if (!nameSize.val()) {
				nameSize.val(nameSize.attr('value'));
				nameSize.slider('refresh');
			}
		});
		encloseButton.addEventListener('click', () => {this.addEnclosure()});
		if (0 < this.appMain.documentId.length) {
			this.saveButton.classList.remove('ui-state-disabled');
			this.saveButton.addEventListener('click', ()=> {this.save()});
		}
		if (Field.DEBUG) {
			let showGrid = document.querySelector('[name="showGrid"]');

			showGrid.checked = true;
		}
		this.setupPrinting();
	}

	setupPrinting() {
		let description = document.querySelector('[name="description"]');
		let printButton = document.getElementById('printButton');
		let iframe = document.getElementById('printFrame');
		let win = iframe.contentWindow;

		iframe.style.visibility = 'hidden';
		iframe.style.position = 'fixed';
		iframe.style.right = '0';
		iframe.style.bottom = '0';
		win.addEventListener('DOMContentLoaded', ()=> {
			let title = win.document.querySelector('title');
			let img = win.document.querySelector('img');

			title.textContent = description.value;
			img.addEventListener('load', () => {
				iframe.focus();
				win.focus();
console.log('execCommand.');
				if (!win.document.execCommand('print', false, null)) {
console.log('win.print()');
					win.print();
				}
			});
			printButton.addEventListener('click', () => {
				let canvas = FlexibleView.Instance.canvas;

				img.src = canvas.toDataURL();
			});
		});
	}

	loadDiagram(diagram) {
		FormUtils.load(this.form, diagram);
	}

	addEnclosure() {
		this.appMain.addEnclosure();
	}

	createDiagramInfo(formData) {
		let canvas = FlexibleView.Instance.canvas;

		formData.append('image', canvas.toDataURL());
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

	createShapesList(formData) {
		let field = this.appMain.field;
		let ix = 0;

		field.shapesList.forEach(shape => {
			shape.createFormData().forEach(obj => {
				let prefix = 'shapesList[' + ix + '].';

				formData.append(prefix + 'id', obj.regId);
				if (obj.parentId) {
					formData.append(prefix + 'parentId', obj.parentId);
				}
				formData.append(prefix + 'type', obj.type);
				formData.append(prefix + 'x', obj.x);
				formData.append(prefix + 'y', obj.y);
				formData.append(prefix + 'lineStyle', 'Solid');
				ix++;
			});
		});
	}

	save() {
		let formData = new FormData(this.form);
		let entity = new DiagramEntity();
		let messagePopup = document.getElementById('messagePopup');
		let content = messagePopup.querySelector('p');

		this.createDiagramInfo(formData);
		this.createPersonList(formData);
		this.createPartnerList(formData);
		this.createRelationshipList(formData);
		this.createShapesList(formData);
		$.mobile.loading('show', {text: 'Save...', textVisible: true});
		entity.save(formData).then(data => {
			$.mobile.loading('hide');
			if (data.ok) {
				$(this.panel).panel('close');
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
