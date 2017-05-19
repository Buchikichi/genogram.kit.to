class PartnerPanel {
	constructor() {
		this.panel = document.getElementById('partnerPanel');
		this.childrenView = document.getElementById('childrenView');
		this.relation = null;
		this.setupEvents();
	}

	setupEvents() {
		let mChildButton = document.getElementById('mChildButton');
		let fChildButton = document.getElementById('fChildButton');
		let addChild = gender => {
			let child = new Person(null, gender);

			this.relation.addChild(child);
			Field.Instance.addActor(child);
			this.setupChildren();
		}

		$('[name="relationType"]').click(()=> {
			let val = $('[name="relationType"]:checked').val();

			this.relation.type = val;
		});
		mChildButton.addEventListener('click', ()=> {
			addChild('m');
		});
		fChildButton.addEventListener('click', ()=> {
			addChild('f');
		});
		$(this.childrenView).sortable({
			stop: (event, ui)=> {
				// ソート終了時
				this.reorganizeChildren();
			}
		});
		$(this.panel).panel({close: () => {
			Field.Instance.clearSelection();
		}});
	}

	reorganizeChildren() {
		let children = this.childrenView.querySelectorAll('li');

		this.relation.children = [];
		Array.prototype.forEach.call(children, li => {
			let child = $(li).prop('child');

			if (child) {
				this.relation.addChild(child);
			}
		});
		this.relation.reassign();
		$(this.childrenView).listview('refresh');
		Field.Instance.dirty = true;
	}

	setupChildren() {
		let ul = this.childrenView;

		ul.textContent = null;
		this.relation.children.forEach(child => {
			let name = document.createElement('span');
			let description = document.createElement('p');
			let anchor = document.createElement('a');
			let li = document.createElement('li');

			name.textContent = child.info;
			description.textContent = child.description;
			anchor.appendChild(name);
			anchor.appendChild(description);
//			if (child.age) {
//				let count = document.createElement('span');
//
//				count.classList.add('ui-li-count');
//				count.textContent = child.age;
//				anchor.appendChild(count);
//			}
			li.appendChild(anchor);
			li.setAttribute('data-icon', false);
			ul.appendChild(li);
			$(li).prop('child', child);
		});
		$(ul).listview('refresh');
	}

	setupForm() {
		let father = this.panel.querySelector('[name="father"]');
		let mother = this.panel.querySelector('[name="mother"]');

		father.value = this.relation.father.info;
		mother.value = this.relation.mother.info;
		$('[name="relationType"]').val([this.relation.type]).checkboxradio('refresh');
	}

	open(relation) {
		this.relation = relation;
		this.setupForm();
		this.setupChildren();
		$(this.panel).panel('open');
	}
}
