class MessagePopup {
	static open(msgId) {
		let popup = document.getElementById('messagePopup');
		let msgList = popup.querySelectorAll('pre');

		Array.prototype.forEach.call(msgList, element => {
			if (element.id == msgId) {
				$(element).show();
			} else {
				$(element).hide();
			}
		});
		$(messagePopup).popup('open', {});
	}
}
