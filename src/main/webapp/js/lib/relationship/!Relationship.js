class Relationship extends Actor {
	constructor(person, other) {
		super();
		this.person = person;
		this.other = other;
		this.createFillStyle();
	}

	createFillStyle(imgsrc = null) {
		let ctx = FlexibleView.Instance.ctx;

		this.height = 16;
		this.fillStyle = 'rgba(200, 200, 255, 0.7)';
		this.img = new Image();
		this.img.onload = ()=> {
			this.height = this.img.height;
			this.fillStyle = ctx.createPattern(this.img, 'repeat-x');
		};
		if (imgsrc) {
			this.img.src = imgsrc;
		}
	}

	calculatePosition() {
		this.bx = this.person.x;
		this.by = this.person.y;
		this.ex = this.other.x;
		this.ey = this.other.y;
		let diffX = this.ex - this.bx;
		let diffY = this.ey - this.by;
		this.cx = this.bx + diffX / 2;
		this.cy = this.by + diffY / 2;
		this.radian = Math.atan2(diffY, diffX);
		this.length = Math.sqrt(diffX * diffX + diffY * diffY);
		this.width = this.length - (this.person.radius + this.other.radius);
	}

	isHit(x, y) {
		let tx = this.cx - x;
		let ty = this.cy - y;
		let rad = -this.radian;
		let rx = Math.cos(rad) * tx - Math.sin(rad) * ty;
		let ry = Math.sin(rad) * tx + Math.cos(rad) * ty;
		let left = -this.length / 2 + this.person.radius;
		let top = -this.height / 2;
		let right = this.width + left;
		let bottom = this.height + top;

		this.hit = left <= rx && rx <= right && top <= ry && ry <= bottom;
		return this.hit;
	}

	drawAuxiliary(ctx) {
		ctx.save();
		ctx.strokeStyle = 'blue';
		ctx.beginPath();
		ctx.moveTo(this.bx, this.by);
		ctx.lineTo(this.ex, this.ey);
		ctx.stroke();

		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.arc(this.bx, this.by, 4, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.ex, this.ey, 4, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.cx, this.cy, 4, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
	}

	draw(ctx) {
		this.calculatePosition();
		let x = -this.length / 2 + this.person.radius;
		let y = -this.height / 2;

		ctx.save();
		ctx.translate(this.cx, this.cy);
		ctx.rotate(this.radian);
		ctx.translate(x, y);
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(0, 0, this.width, this.height);
		if (this.hit) {
			ctx.fillStyle = 'rgba(100, 255, 255, 0.7)';
			ctx.fillRect(0, 0, this.width, this.height);
		}
		ctx.restore();
//this.drawAuxiliary(ctx);
	}
}
Relationship.create = (emotion, person, other)=> {
	let relation;
	//<label>融合<input name="emotion" type="radio" value="fused"/></label>
	//<label>親密<input name="emotion" type="radio" value="close"/></label>
	//<label>疎遠<input name="emotion" type="radio" value="distant"/></label>
	//<label>敵対<input name="emotion" type="radio" value="hostile"/></label>
	//<label>融合し敵対<input name="emotion" type="radio" value="fusedHostile"/></label>
	//<label>親密で敵対<input name="emotion" type="radio" value="close-hostile"/></label>
	//<label>遮断<input name="emotion" type="radio" value="cutOff"/></label>
	//<label>強い関心/干渉<input name="emotion" type="radio" value="focused"/></label>
	//<label>性的虐待<input name="emotion" type="radio" value="sexualAbuse"/></label>
	//<label>身体的虐待<input name="emotion" type="radio" value="physicalAbuse"/></label>
	if (emotion == 'fused') {
		relation = new FusedRelation(person, other);
	} else if (emotion == 'close') {
		relation = new CloseRelation(person, other);
	} else {
		relation = new Relationship(person, other);
	}
	relation.emotion = emotion;
	return relation
}
