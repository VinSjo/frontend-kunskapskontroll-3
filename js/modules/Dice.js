/**
 * @module Dice
 */

const template = {
	src: document.querySelector("template#dice"),
	clone() {
		return this.src.content.cloneNode(true).querySelector("svg");
	},
};

class DiceView {
	constructor() {
		const icon = template.clone();
		this.element = icon;
		this.dots = [...icon.querySelectorAll("circle")];
	}
	get disabled() {
		return this.element.classList.contains("disabled");
	}
	set disabled(disabled) {
		disabled
			? this.element.classList.add("disabled")
			: this.element.classList.remove("disabled");
	}
	get value() {
		return parseInt(this.element.dataset.value);
	}
	set value(value) {
		this.element.dataset.value = value;
		const visibleDots = [];
		if (value % 2 !== 0) visibleDots.push(3);
		if (value > 1) visibleDots.push(1, 5);
		if (value > 3) visibleDots.push(0, 6);
		if (value === 6) visibleDots.push(2, 4);
		this.dots.forEach((dot, index) => {
			visibleDots.includes(index)
				? (dot.style.opacity = 1)
				: (dot.style.opacity = 0);
		});
	}
}
class Dice {
	constructor() {
		this.view = new DiceView();
		this.value = 1;
	}
	get value() {
		return this._value;
	}
	set value(value) {
		if (typeof value !== "number" || Number.isNaN(value)) return;
		this._value = value;
		this.view.value = this._value;
	}
	get disabled() {
		return this.view.disabled;
	}
	set disabled(disabled) {
		this.view.disabled = !!disabled;
	}
	roll() {
		if (this.disabled) return;
		this.value = Math.ceil(Math.random() * 6);
	}
	addEventListener(type, listener) {
		this.view.element.addEventListener(type, listener);
	}
}

class DiceArray extends Array {
	constructor(diceCount = 5) {
		super();
		while (this.length < diceCount) this.push(new Dice());
		this.isAnimating = false;
	}
	get values() {
		return this.map(dice => dice.value);
	}
	get elements() {
		return this.map(dice => dice.view.element);
	}
	get fullyDisabled() {
		return this.filter(dice => !dice.disabled).length === 0;
	}
	reset() {
		this.forEach(dice => {
			dice.disabled = false;
			dice.value = 1;
		});
	}
	roll() {
		this.forEach(dice => dice.roll());
	}
	animatedRoll(interval = 100, timeout = 500, onTimeOut = null) {
		let intervalID = setInterval(() => {
			this.isAnimating = true;
			this.roll();
		}, interval);
		setTimeout(() => {
			clearInterval(intervalID);
			this.isAnimating = false;
			if (onTimeOut) onTimeOut();
		}, timeout);
	}
}

export default Dice;
export { DiceArray, DiceView };
