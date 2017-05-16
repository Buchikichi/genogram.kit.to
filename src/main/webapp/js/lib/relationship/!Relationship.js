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
		this.left = (-this.length + 1) / 2;
		this.width = this.length - 1;
	}

	isHit(px, py) {
		let spacing = Field.Instance.spacing;
		let x = px / spacing;
		let y = py / spacing;
		let tx = this.cx - x;
		let ty = this.cy - y;
		let rad = -this.radian;
		let rx = Math.cos(rad) * tx - Math.sin(rad) * ty;
		let ry = Math.sin(rad) * tx + Math.cos(rad) * ty;
		let height = this.height / spacing;
		let top = -height / 2;
		let left = this.left;
		let right = this.width + left;
		let bottom = top + height;

		this.hit = left <= rx && rx <= right && top <= ry && ry <= bottom;
		return this.hit;
	}

	drawAuxiliary(ctx) {
		let spacing = Field.Instance.spacing;
		let bx = this.bx * spacing;
		let by = this.by * spacing;
		let ex = this.ex * spacing;
		let ey = this.ey * spacing;
		let cx = this.cx * spacing;
		let cy = this.cy * spacing;

		ctx.save();
		ctx.strokeStyle = 'blue';
		ctx.beginPath();
		ctx.moveTo(bx, by);
		ctx.lineTo(ex, ey);
		ctx.stroke();

		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.arc(bx, by, 4, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(ex, ey, 4, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(cx, cy, 4, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
	}

	draw(ctx) {
		this.calculatePosition();
		let spacing = Field.Instance.spacing;
		let x = this.left * spacing;
		let y = -this.height / 2;
		let cx = this.cx * spacing;
		let cy = this.cy * spacing;
		let width = this.width * spacing;

		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(this.radian);
		ctx.translate(x, y);
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(0, 0, width, this.height);
		if (this.hit) {
			ctx.fillStyle = 'rgba(140, 255, 255, 0.5)';
			ctx.fillRect(0, 0, width, this.height);
		}
		ctx.restore();
//this.drawAuxiliary(ctx);
	}

	static create(emotion, person, other) {
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
		} else if (emotion == 'distant') {
			relation = new DistantRelation(person, other);
		} else if (emotion == 'hostile') {
			relation = new HostileRelation(person, other);
		} else {
			relation = new Relationship(person, other);
		}
		relation.emotion = emotion;
		return relation
	}
}
