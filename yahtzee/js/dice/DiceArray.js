import Dice from "./Dice.js";

export default class DiceArray extends Array {
	constructor(diceCount = 5) {
		super();
		while (this.length < diceCount) this.push(new Dice());
		this.shuffling = false;
	}
	get values() {
		return this.map(dice => dice.value);
	}
	get elements() {
		return this.map(dice => dice.element);
	}
	get available() {
		return this.filter(dice => dice.disabled === false);
	}
	roll() {
		this.forEach(dice => dice.roll());
	}
	shuffle(interval = 100, timeout = 1000, onTimeout = null) {
		let intervalID = setInterval(() => {
			this.roll();
			this.shuffling = true;
		}, interval);
		setTimeout(() => {
			clearInterval(intervalID);
			this.shuffling = false;
			onTimeout && onTimeout();
		}, timeout);
	}
	disable(index) {
		this[index].disabled = true;
	}
	enable(index) {
		this[index].disabled = false;
	}
	reset() {
		this.forEach(dice => {
			dice.value = 1;
			dice.disabled = false;
			dice.update();
		});
	}
}
