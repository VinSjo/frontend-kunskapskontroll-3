import DiceView from "./view.js";

export default class Dice {
	constructor() {
		this.view = new DiceView();
		this.element = this.view.element;
		this.value = 1;
		this.visible = true;
	}
	get value() {
		return this._value;
	}
	set value(num) {
		if (typeof num !== "number" || Number.isNaN(num)) return;
		this._value = Math.max(Math.min(num, 6), 1);
		this.view.value = this._value;
	}
	get disabled() {
		return this.element.classList.contains("disabled");
	}
	set disabled(disabled) {
		disabled
			? this.element.classList.add("disabled")
			: this.element.classList.remove("disabled");
	}
	get visible() {
		return this.element.classList.contains("show");
	}
	set visible(visible) {
		visible
			? this.element.classList.add("show")
			: this.element.classList.remove("show");
	}
	roll() {
		return (this.value = Math.ceil(Math.random() * 6));
	}
	addEventListener(type, listener) {
		this.element.addEventListener(type, listener);
	}
}
