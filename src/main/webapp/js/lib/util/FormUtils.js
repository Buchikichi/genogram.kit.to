class FormUtils {
	static load(form, rec) {
		$(form).find(':input').each((ix, element) => {
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
	}
}
