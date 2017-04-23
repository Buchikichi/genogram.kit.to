class UUID {
	static toString() {
		return UUID.Format.replace(/X|Y/g, c => {
			let rnd = Math.random() * 16 | 0;
			let val = c === 'X' ? rnd : rnd & 3 | 8;

			return val.toString(16);
		});
	}
}
UUID.Format = 'XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX';
