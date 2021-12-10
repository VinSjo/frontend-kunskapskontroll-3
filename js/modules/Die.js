import DieView from "./DieView.js";

export default class Die {
	constructor() {
		this.view = new DieView();
		this.value = 1;
		this.locked = false;
	}
	/**
	 * @param {Number} value
	 */
	setValue(value) {
		if (this.locked) return;
		if (typeof value !== "number" || Number.isNaN(value)) return;
		if (value % 1 !== 0) value = Math.round(value);
		if (value < 1 || value > 6) value = Math.max(Math.min(value, 6), 1);
		this.value = value;
		this.view.updateValue(value);
	}
	/**
	 * @param {Boolean} locked
	 */
	setLocked(locked) {
		this.locked = !!locked;
		if (!this.view.element) return;
		if (this.locked) {
			this.view.element.classList.add("locked");
			this.view.element.setAttribute("title", "Unlock Dice");
			return;
		}
		this.view.element.classList.remove("locked");
		this.view.element.setAttribute("title", "Lock Dice");
	}
	/**
	 * @param {Number} interval
	 * @param {Number} duration
	 * @param {Function} onTimeout
	 */
	async roll(animate, interval, duration) {
		if (this.locked) return this.value;
		this.value = Math.ceil(Math.random() * 6);

		if (!animate || !this.view.element) {
			this.view.element && this.view.updateValue(this.value);
			return this.value;
		}
		await this.view.animatedUpdateValue(this.value, interval, duration);
		return this.value;
	}
}
