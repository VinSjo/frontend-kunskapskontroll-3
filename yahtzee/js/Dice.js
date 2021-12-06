class Dice {
	constructor(sideCount = 6) {
		this.value = null;
		this.sideCount = sideCount;
		this.locked = false;
		this.roll();
	}
	roll() {
		if (this.locked) return null;
		return (this.value = Math.ceil(Math.random() * this.sideCount));
	}
	lock() {
		this.locked = true;
	}
	unlock() {
		this.locked = false;
	}
}

class DiceCollection extends Array {
	constructor(diceCount = 5, sideCount = 6) {
		super();
		while (this.length < diceCount) this.push(new Dice(sideCount));
	}
	get values() {
		return this.map(die => die.value);
	}
	rollAll() {
		this.forEach(die => die.roll());
	}
	unlockAll() {
		this.forEach(die => die.unlock());
	}
}

export default Dice;
export { DiceCollection };
