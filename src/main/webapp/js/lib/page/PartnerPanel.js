class PartnerPanel extends AbstractPane {
	constructor(isPanel) {
		super('partnerPanel', isPanel);
		this.childrenView = document.getElementById('childrenView');
		this.relation = null;
		this.setupEvents();
	}

	setupEvents() {
		super.setupEvents();
		let widelyButton = document.getElementById('widelyButton');
		let mChildButton = document.getElementById('mChildButton');
		let fChildButton = document.getElementById('fChildButton');

		$('[name="relationType"]').click(()=> {
			let val = $('[name="relationType"]:checked').val();

			this.relation.type = val;
		});
		this.narrowlyButton = document.getElementById('narrowlyButton');
		this.narrowlyButton.addEventListener('click', ()=> {
			this.relation.narrowly();
			this.relation.reassignChildren();
			this.refreshControls();
			Field.Instance.dirty = true;
		});
		widelyButton.addEventListener('click', ()=> {
			this.relation.widely();
			this.relation.reassignChildren();
			this.refreshControls();
			Field.Instance.dirty = true;
		});
		mChildButton.addEventListener('click', ()=> {
			this.addChild('m');
		});
		fChildButton.addEventListener('click', ()=> {
			this.addChild('f');
		});
		$(this.childrenView).sortable({
			stop: (event, ui)=> {
				// ソート終了時
				this.reorganizeChildren();
			}
		});
	}

	addChild(gender) {
		let field = Field.Instance;
		let father = this.relation.father;

//console.log(field.numOfGeneration + '/min:' + field.minGeneration + '/max:' + field.maxGeneration);
		if (field.maxGeneration <= father.generation && field.numOfGeneration == Field.MAX_GENERATION) {
			MessagePopup.open('msg.generations');
			return;
		}
		let child = new Person(gender);

		this.relation.addChild(child);
		this.relation.reassignChildren();
		this.setupChildren();
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

		this.relation.children = [];
		children.forEach((child, ix) => {
//			child.copyChainProperties(chainList[ix]);
//			child.prevActor = prevList[ix];
//console.log('ix:' + ix + '|' + child.info + ' <-prev:' + child.prevActor.info);
			this.relation.children.push(child);
		});
		$(this.childrenView).listview('refresh');
		this.relation.reassignChildren();
		Field.Instance.dirty = true;
	}

	refreshControls() {
		let diff = this.relation.leftSide.ax - this.relation.rightSide.ax;
		let canNarrow = 2 < Math.abs(diff);

		this.enableButton(this.narrowlyButton, canNarrow);
	}

	setupChildren() {
		let ul = this.childrenView;

		ul.textContent = null;
		this.relation.children.forEach(child => {
			let name = document.createElement('span');
			let anchor = document.createElement('a');
			let li = document.createElement('li');

			name.textContent = child.info;
			anchor.appendChild(name);
			li.appendChild(anchor);
			li.setAttribute('data-id', child.id);
			li.setAttribute('data-icon', false);
			ul.appendChild(li);
		});
		$(ul).listview('refresh');
	}

	setupForm() {
		let father = this.pane.querySelector('[name="father"]');
		let mother = this.pane.querySelector('[name="mother"]');

		father.value = this.relation.father.info;
		mother.value = this.relation.mother.info;
		$('[name="relationType"]').val([this.relation.type]).checkboxradio('refresh');
	}

	open(relation) {
		let field = Field.Instance;
		let center = field.center;
		let position = center < relation.x ? 'left' : 'right';

		field.addTarget(relation.father, relation.mother);
		this.relation = relation;
		this.setupForm();
		this.setupChildren();
		this.refreshControls();
		this.showPane(position);
	}
}
