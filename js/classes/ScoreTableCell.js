import { firstCharToUpper } from '../functions/helpers.js';
import { scoreTemplate } from '../functions/calculations.js';

export default class ScoreTableCell {
	/**
	 * @param {HTMLTableCellElement} element
	 * @param {String} rowName
	 * @param {String} sectionName
	 * @param {String} playerID
	 */
	constructor(element, rowName, sectionName, playerID) {
		this.element = element;
		this.row = rowName;
		this.section = sectionName;
		this.playerID = playerID;
		this.clickListener = null;
		this.tempValue = null;
		this.disabledValue = '𐄂';
	}
	/**
	 * @property {Boolean} - if cell's value is empty or not
	 */
	get disabled() {
		return this.value !== null;
	}
	/**
	 * @property {null|false|Number} - gets value in cell
	 * if cell is empty: null
	 * if cell is disabled: false
	 * else: Number
	 */
	get value() {
		const text = this.element.textContent;
		return this.tempValue !== null || !text.length
			? null
			: text === this.disabledValue
			? false
			: parseInt(text);
	}
	set value(value) {
		this.clearTempValue();
		this.element.textContent = value || null;
	}
	/**
	 * @property {String} - conversion of className to match keys in scoreTemplate
	 * @see {@link scoreTemplate}
	 */
	get scoreKey() {
		return this.row
			.split('-')
			.map((str, i) => {
				if (i === 0) return str.toLowerCase();
				return firstCharToUpper(str);
			})
			.join('');
	}
	/**
	 * Set a temporary value in cell to display options
	 * @param {Number | String} value
	 */
	setTempValue(value) {
		this.tempValue = value;
		this.element.textContent = value;
	}
	/**
	 * removes the temporary value
	 */
	clearTempValue() {
		if (this.tempValue === null) return;
		this.tempValue = null;
		this.element.textContent = null;
	}
	/**
	 * Add an click-listener to cell-element and store it in
	 * ScoreTableCell.clickListener
	 * @param {Function} clickListener
	 * @see {@link ScoreTableCell.clickListener}
	 */
	setClickListener(clickListener) {
		if (this.clickListener) this.removeClickListener();
		this.clickListener = clickListener;
		this.element.addEventListener('click', this.clickListener);
	}
	/**
	 * Removes the click-listener from cell
	 * @see {@link ScoreTableCell.setClickListener}
	 */
	removeClickListener() {
		if (!this.clickListener) return;
		this.element.removeEventListener('click', this.clickListener);
	}
}
