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
			let child = new Person(gender);

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

	makeChainList() {
		let list = [];

		this.relation.children.forEach(child => {
			let chain = new Chain();

			chain.copyChainProperties(child);
			list.push(chain);
		});
		return list;
	}

	makeNewList() {
		let list = [];
		let idMap = {};
		let children = this.childrenView.querySelectorAll('li');

		this.relation.children.forEach(child => {
			idMap[child.id] = child;
		});
		Array.prototype.forEach.call(children, (li, ix) => {
			let id = li.getAttribute('data-id');
			let child = idMap[id];

			list.push(child);
		});
		return list;
	}

	reorganizeChildren() {
		let chainList = this.makeChainList();
		let children = this.makeNewList();
		let prev = this.relation.children[0].prevActor;
		let prevList = [prev].concat(children);

console.log('prev:');
console.log(prev);
		this.relation.children = [];
		children.forEach((child, ix) => {
			child.copyChainProperties(chainList[ix]);
			child.prevActor = prevList[ix];
console.log('ix:' + ix + '|' + child.info + ' <-prev:' + child.prevActor.info);
			this.relation.children.push(child);
		});
		$(this.childrenView).listview('refresh');
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
			li.setAttribute('data-id', child.id);
			li.setAttribute('data-icon', false);
			ul.appendChild(li);
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
