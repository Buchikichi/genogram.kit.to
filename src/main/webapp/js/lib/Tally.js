class Tally {
	static reset() {
		Tally.val = 0;
	}

	static increment() {
		return ++Tally.val;
	}
}
Tally.val = 0;
