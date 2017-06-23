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

	showPane(position = 'right') {
		if (this.isPanel) {
			let idSelector = '#' + this.pane.id;
			let pane = $(idSelector);

//console.log('showPane[' + idSelector + ']:' + position);
			if (EditorMain.PANEL_DODGE) {
				pane.panel('destroy');
				pane.panel({'position': position});
			}
			pane.panel('open');
		} else {
			$(this.pane).show();
		}
	}

	hidePane() {
		if (this.isPanel) {
			$(this.pane).panel('close');
		} else {
			$(this.pane).hide();
		}
	}
}
