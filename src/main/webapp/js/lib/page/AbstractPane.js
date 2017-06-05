class AbstractPane {
	constructor(paneId, isPanel) {
		this.pane = document.getElementById(paneId);
		this.isPanel = isPanel;
	}

	setupEvents() {
		if (this.isPanel) {
			$(this.pane).panel({beforeclose: () => {
				Field.Instance.clearSelection();
			}});
		}
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
