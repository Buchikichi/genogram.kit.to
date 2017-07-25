class FormUtils {
	static listInputElements(form) {
		let list = [];
		let input = form.querySelectorAll('input, select, textarea');

		Array.prototype.forEach.call(input, element => {
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

			if (!(name in rec)) {
				return;
			}
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

	static enableButton(button, enable = true) {
		if (button == null) {
			return;
		}
		if (enable) {
			$(button).removeClass('ui-state-disabled');
			button.removeAttribute('disabled');
		} else {
			$(button).addClass('ui-state-disabled');
			button.setAttribute('disabled', 'disabled');
		}
	}
}
