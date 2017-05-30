document.addEventListener('DOMContentLoaded', ()=> {
	new AppMain();
});

class AppMain {
	constructor() {
		this.listDiagram();
	}

	listDiagram(keyword = '') {
		let entity = new DiagramEntity();
		let ul = document.getElementById('listView');

		entity.list().then(list => {
			list.forEach(rec => {
				rec.name = rec.documentId;
				let row = new ListviewRow(rec, rec.image);
				let li = row.li;
				let anchor = row.anchor;
				let editButton = document.createElement('a');

				anchor.addEventListener('click', ()=> {
					window.open('diagram/image/' + rec.documentId);
				});
				editButton.addEventListener('click', ()=> {
					window.open('diagram/edit/' + rec.documentId);
				});
				li.appendChild(editButton);
				ul.appendChild(li);
			});
			$(ul).listview('refresh');
		});
	}
}
