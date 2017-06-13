class FormUtils {
	static listInputElements(form) {
		let list = [];
		let input = form.querySelectorAll('input');
		let textarea = form.querySelectorAll('textarea');

		Array.prototype.forEach.call(input, element => {
			list.push(element);
		});
		Array.prototype.forEach.call(textarea, element => {
			list.push(element);
		});
		return list;
	}

	static load(form, rec) {
		let list = FormUtils.listInputElements(form);

		list.forEach(element => {
			let name = element.getAttribute('name');
			let type = element.getAttribute('type');
			let val = rec[name];

			if (type == 'radio') {
				$(element).val([val]).checkboxradio('refresh');
			} else if (type == 'checkbox') {
				element.checked = 0 < val;
				$(element).flipswitch('refresh');
			} else {
//console.log(name + ':' + val);
				element.value = val;
			}
		});
		//$(form).trigger('create');
	}
}
