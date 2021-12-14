import { firstCharToUpper } from '../functions/helpers.js';

export default class PlayerScoreCell {
	/**
	 * @param {HTMLTableCellElement} tdElement
	 * @param {String} rowName
	 * @param {String} sectionName
	 * @param {String} playerID
	 */
	constructor(tdElement, rowName, sectionName, playerID) {
		this.element = tdElement;
		this.row = rowName;
		this.section = sectionName;
		this.playerID = playerID;
		this.clickListener = null;
		this.tempValue = null;
		this.disabledValue = '-';
	}
	get disabled() {
		return this.value !== null;
	}
	get value() {
		const text = this.element.textContent;
		return this.tempValue !== null || !text.length
			? null
			: text === this.disabledValue
			? false
			: parseInt(text) || text;
	}
	set value(value) {
		this.clearTempValue();
		this.element.textContent = value || null;
	}
	get camelCaseRow() {
		return this.row
			.split('-')
			.map((str, i) => {
				if (i === 0) return str.toLowerCase();
				return firstCharToUpper(str);
			})
			.join('');
	}
	setTempValue(value) {
		this.tempValue = value;
		this.element.textContent = value;
	}
	clearTempValue() {
		if (this.tempValue === null) return;
		this.tempValue = null;
		this.element.textContent = null;
	}
	setClickListener(clickListener) {
		if (this.clickListener) this.removeClickListener();
		this.clickListener = clickListener;
		this.element.addEventListener('click', this.clickListener);
	}
	removeClickListener() {
		if (!this.clickListener) return;
		this.element.removeEventListener('click', this.clickListener);
	}
}
