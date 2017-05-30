class Tally {
	static reset(val = 0) {
		Tally.val = val;
	}

	static increment() {
		return ++Tally.val;
	}
}
Tally.val = 0;

class AlphabeticalTally {
	static increment() {
		let result = '';
		let val = AlphabeticalTally.val++;
		let max = AlphabeticalTally.Max;

		for (let digit = 0; digit < 2; digit++) {
			let cd = val % max;
			let ch = String.fromCharCode(65 + cd);

			val = Math.floor(val / max);
			result = ch + result;
		}
		return result;
	}
}
AlphabeticalTally.val = 0;
AlphabeticalTally.Max = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
