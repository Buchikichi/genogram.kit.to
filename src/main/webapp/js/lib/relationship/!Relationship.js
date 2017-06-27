class Relationship extends Actor {
	constructor(person, other) {
		super(0, 0, Chain.Z + 2);
		this.person = person;
		this.other = other;
		this.createFillStyle();
	}

	createFillStyle(imgsrc = null, repeat = 'repeat-x') {
		let spacing = Field.Instance.spacing;
		let ctx = FlexibleView.Instance.ctx;

		this.height = 16 / spacing;
		this.fillStyle = 'rgba(200, 200, 255, 0.7)';
		this.img = new Image();
		this.img.onload = ()=> {
			this.height = this.img.height / spacing;
			this.fillStyle = ctx.createPattern(this.img, repeat);
		};
		if (imgsrc) {
			this.img.src = imgsrc;
		}
	}

	calculatePosition() {
		if (this.person.isGone || this.other.isGone) {
			this.eject();
			return;
		}
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
		this.width = this.length - 1.1;
		this.left = -this.width / 2;
		this.right = this.width / 2;
	}

	flip() {
		let person = this.person;

		this.person = this.other;
		this.other = person;
	}

	isHit(x, y) {
		let tx = this.cx - x;
		let ty = this.cy - y;
		let rad = -this.radian;
		let rx = Math.cos(rad) * tx - Math.sin(rad) * ty;
		let ry = Math.sin(rad) * tx + Math.cos(rad) * ty;
		let height = this.height;
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

	drawTriangle(ctx) {
		let spacing = Field.Instance.spacing;
		let cx = this.cx * spacing;
		let cy = this.cy * spacing;
		let x = this.width / 2 * spacing;

		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(this.radian);
//ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
//ctx.beginPath();
//ctx.arc(this.width / 2 * spacing, 0, this.height, 0, Math.PI * 2, false);
//ctx.fill();
		ctx.translate(x, 0);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0 - 16, -8);
		ctx.lineTo(0 - 16, 8);
		ctx.lineTo(0, 0);
		ctx.fill();
		ctx.restore();
	}

	drawLine(ctx, width, height) {
		let spacing = Field.Instance.spacing;
		let x = this.left * spacing;
		let y = -height / 2;

		ctx.save();
		ctx.translate(x, y);
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(0, 0, width, height);
		ctx.restore();
	}

	drawRect(ctx, width, height) {
		let spacing = Field.Instance.spacing;
		let x = this.left * spacing;
		let y = -height / 2;

		ctx.save();
		ctx.translate(x, y);
		ctx.fillRect(0, 0, width, height);
		ctx.restore();
	}

	draw(ctx) {
		this.calculatePosition();
		let spacing = Field.Instance.spacing;
		let width = this.width * spacing;
		let height = this.height * spacing + 1;
		let cx = this.cx * spacing;
		let cy = this.cy * spacing;

		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(this.radian);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
		this.drawRect(ctx, width, height / 2);
		this.drawLine(ctx, width, height);
		if (this.hit) {
			ctx.fillStyle = Field.Instance.hitStyle;
			this.drawRect(ctx, width, height);
		}
		ctx.restore();
//this.drawAuxiliary(ctx);
	}

	static create(emotion, person, other) {
		let relation;

		if (emotion == 'Fused') {
			// 融合
			relation = new FusedRelation(person, other);
		} else if (emotion == 'Close') {
			// 親密
			relation = new CloseRelation(person, other);
		} else if (emotion == 'Distant') {
			// 疎遠
			relation = new DistantRelation(person, other);
		} else if (emotion == 'Hostile') {
			// 敵対
			relation = new HostileRelation(person, other);
		} else if (emotion == 'FusedHostile') {
			// 融合し敵対
			relation = new FusedHostileRelation(person, other);
		} else if (emotion == 'CloseHostile') {
			// 親密で敵対
			relation = new CloseHostileRelation(person, other);
		} else if (emotion == 'CutOff') {
			// 遮断
			relation = new CutOffRelation(person, other);
		} else if (emotion == 'Focused') {
			// 強い関心/干渉
			relation = new FocusedRelation(person, other);
		} else if (emotion == 'SexualAbuse') {
			// 性的虐待
			relation = new SexualAbuseRelation(person, other);
		} else if (emotion == 'PhysicalAbuse') {
			// 身体的虐待
			relation = new PhysicalAbuseRelation(person, other);
		} else {
			// ?
			relation = new Relationship(person, other);
		}
		relation.emotion = emotion;
		return relation
	}
}
