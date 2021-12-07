import DiceIcon from "./DiceIcon.js";

export default class Dice extends DiceIcon {
	constructor() {
		super();
		this.value = 1;
		this.disabled = false;
		this.hidden = false;
		this.update();
	}
	get disabled() {
		return this._disabled;
	}
	set disabled(disabled) {
		this._disabled = disabled;
		this._disabled
			? this.element.classList.add("disabled")
			: this.element.classList.remove("disabled");
	}
	get hidden() {
		return this._hidden;
	}
	set hidden(hidden) {
		this._hidden = hidden;
		this._hidden
			? this.element.classList.remove("show")
			: this.element.classList.add("show");
	}
	roll() {
		if (this._disabled) return;
		this.value = Math.ceil(Math.random() * 6);
		this.update();
	}
	update() {
		if (this.value < 1 || this.value > 6) {
			this.hidden = true;
			return;
		}
		this.hidden = false;
		this.element.setAttribute("value", `${this.value}`);
		const dotIndexes = [];

		if (this.value % 2 !== 0) dotIndexes.push(3);
		if (this.value > 1) dotIndexes.push(1, 5);
		if (this.value > 3) dotIndexes.push(0, 6);
		if (this.value === 6) dotIndexes.push(2, 4);

		this.dots.forEach((dot, i) =>
			dotIndexes.includes(i)
				? dot.classList.add("show")
				: dot.classList.remove("show")
		);
	}
}
