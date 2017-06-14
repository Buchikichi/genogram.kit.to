class AbstractPane {
	constructor(paneId, isPanel) {
		this.pane = document.getElementById(paneId);
		this.form = this.pane.querySelector('form');
		this.isPanel = isPanel;
	}

	setupEvents() {
		if (this.isPanel) {
			$(this.pane).panel({beforeclose: () => {
				Field.Instance.clearSelection();
			}});
		}
	}

	enableButton(button, enable = true) {
		if (enable) {
			$(button).removeClass('ui-state-disabled');
			button.removeAttribute('disabled');
		} else {
			$(button).addClass('ui-state-disabled');
			button.setAttribute('disabled', 'disabled');
		}
	}

	disableButton(button) {
		this.enableButton(button, false);
	}

	showPane() {
		if (this.isPanel) {
			$(this.pane).panel('open');
		} else {
			$(this.pane).show();
		}
	}

	hidePane() {
		if (!this.isPanel) {
			$(this.pane).hide();
		}
	}
}
