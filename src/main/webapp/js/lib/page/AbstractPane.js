class AbstractPane {
	constructor(paneId, isPanel) {
		this.pane = document.getElementById(paneId);
		this.form = this.pane.querySelector('form');
		this.isPanel = isPanel;
	}

	setupEvents() {
		if (this.isPanel) {
			$(this.pane).panel({beforeclose: () => {
//				Field.Instance.clearSelection();
			}});
		}
	}

	enableButton(button, enable = true) {
		FormUtils.enableButton(button, enable);
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
