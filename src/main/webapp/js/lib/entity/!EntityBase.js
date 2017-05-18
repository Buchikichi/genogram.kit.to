class EntityBase {
	constructor(base) {
		this.base = base;
	}

	/**
	 * 一覧取得.
	 */
	list(data = {}) {
		return AjaxUtils.post('/' + this.base + '/list', data);
	}

	/**
	 * レコード取得.
	 */
	select(id) {
		let formData = new FormData();

		formData.append('id', id);
		return AjaxUtils.post('/' + this.base + '/select', formData);
	}

	save(formData) {
		return AjaxUtils.post('/' + this.base + '/save', formData);
	}
}
