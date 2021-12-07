import DiceIcon from "./DiceIcon.js";
export default class Dice {
	constructor() {
		this.value = 0;
		this.disabled = false;
		this.icon = new DiceIcon();
	}

	roll() {
		if (this.disabled) return this.value;
		this.value = Math.ceil(Math.random() * 6);
		this.update();
		return this.value;
	}

	update() {
		if (this.value < 1 || this.value > 6) {
			this.icon.hide();
			return;
		}
		this.icon.show();
		this.icon.displayValue(this.value);
	}

	enable() {
		this.disabled = false;
		this.icon.enable();
	}
	disable() {
		this.disabled = true;
		this.icon.disable();
	}
}
