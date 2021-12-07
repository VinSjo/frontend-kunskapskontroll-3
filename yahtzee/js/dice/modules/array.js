import Dice from "./class.js";

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
		return this.filter(dice => !dice.disabled);
	}
	roll() {
		this.available.forEach(dice => dice.roll());
	}
	disable(index) {
		this[index].disabled = true;
	}
	enable(index) {
		this[index].disabled = false;
	}
	reset() {
		this.forEach(dice => {
			dice.disabled = false;
			dice.value = 1;
		});
	}
	shuffle(interval = 100, timeout = 1000, onTimeout = null) {
		let intervalID = setInterval(() => {
			this.shuffling = true;
			this.roll();
		}, interval);
		setTimeout(() => {
			clearInterval(intervalID);
			this.shuffling = false;
			onTimeout && onTimeout();
		}, timeout);
	}
}
