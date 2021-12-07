import Dice from "./Dice.js";

export default class DiceCollection extends Array {
	constructor(diceCount = 5) {
		super();
		while (this.length < diceCount) this.push(new Dice());
	}
	get values() {
		return this.map(die => die.value);
	}
	get elements() {
		return this.map(die => die.icon.element);
	}
	roll() {
		this.forEach(die => die.roll());
	}
	shuffle(interval = 100, timeout = 1000, onTimeout = null) {
		let intervalID = setInterval(() => {
			this.forEach(die => die.roll());
		}, interval);
		setTimeout(() => {
			clearInterval(intervalID);
			onTimeout && onTimeout();
		}, timeout);
	}
	disable(index) {
		this[index].disable();
	}
	enable(index) {
		this[index].enable();
	}
	reset() {
		this.forEach(die => {
			die.value = 1;
			die.update();
		});
	}
}
