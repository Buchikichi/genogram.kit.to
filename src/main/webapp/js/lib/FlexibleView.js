class FlexibleView {
	constructor(width, height) {
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.view = document.getElementById('view');
		this.scale = 1;
		this.init();
		this.setSize(width, height);
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		this.resize();
	}

	init() {
		let header = document.querySelector('[data-role="header"]');
		let footer = document.querySelector('[data-role="footer"]');
		let headerHeight = header ? header.offsetHeight : 0;
		let footerHeight = footer ? footer.offsetHeight : 0;

		this.margin = headerHeight + footerHeight;
//console.log('headerH:' + headerHeight);
		window.addEventListener('resize', ()=> {
			this.resize();
		});
	}

	resize() {
		let scaleW = document.body.clientWidth / this.width;
		let scaleH = (window.innerHeight - this.margin) / this.height;

		this.scale = scaleH < scaleW ? scaleH : scaleW;
//console.log('scale:' + this.scale);
		// transform: scale(2);
		this.view.setAttribute('style', 'transform: scale(' + this.scale + ');');
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
}
