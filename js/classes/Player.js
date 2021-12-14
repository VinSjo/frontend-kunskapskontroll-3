import Die from './Die.js';
import PlayerScoreCell from './PlayerScoreCell.js';
import { calculateDiceScore } from '../functions/calculations.js';
export default class Player {
	/**
	 * @param {String} id
	 * @param {String} name
	 * @param {PlayerScoreCell[]} tableColumn
	 * @param {Die[]} dice
	 */
	constructor(id, name, tableColumn, dice) {
		this.id = id;
		this.name = name;
		this.column = tableColumn;
		this.rollsLeft = 3;
		this.currentDiceValues = [0, 0, 0, 0, 0];
		this.dice = dice;

		const reduceSection = section => {
			return section.reduce((sum, cell) => {
				const value = cell.value;
				return value && typeof value === 'number' ? sum + value : sum;
			}, 0);
		};
		const sections = {
			upper: tableColumn.filter(cell => cell.section === 'upper'),
			lower: tableColumn.filter(cell => cell.section === 'lower'),
			sum: tableColumn.filter(cell => cell.section === 'sum'),
			total: tableColumn.filter(cell => cell.row === 'total'),
		};
		this.sections = sections;
		this.score = {
			get upper() {
				return reduceSection(sections.upper);
			},
			get lower() {
				return reduceSection(sections.lower);
			},
			get bonus() {
				return this.upper >= 63 ? 50 : 0;
			},
			get total() {
				return this.upper + this.lower + this.bonus;
			},
		};
	}

	get availableCells() {
		return this.column.filter(
			cell =>
				cell.value === null &&
				cell.section !== 'sum' &&
				cell.row !== 'total'
		);
	}
	resetColumnState() {
		this.column.forEach(cell => {
			cell.element.classList.remove('current');
			cell.element.classList.remove('option');
			cell.element.classList.remove('disable');
			cell.removeClickListener();
			if (!cell.disabled) {
				cell.value = null;
			}
		});
	}
	setCurrent() {
		this.column.forEach(cell => {
			cell.element.classList.add('current');
		});
	}

	setWinner() {
		this.column.forEach(cell => {
			cell.element.classList.add('winner');
		});
	}

	displaySum() {
		const cells = this.sections.sum;
		cells.forEach(cell => {
			if (cell.row === 'sum') {
				return (cell.value = this.score.upper);
			}
			cell.value = this.score.bonus;
		});
	}

	displayTotal() {
		this.sections.total[0].value = this.score.total;
	}
	/**
	 * @param {Function} [onCellSelect]
	 */
	async roll(onCellSelect = null) {
		if (this.rollsLeft >= 1) this.rollsLeft--;
		this.currentDiceValues = await this.dice.animateRoll();
		this.resetColumnState();
		this.setCurrent();
		const diceScore = calculateDiceScore(this.currentDiceValues);
		const cells = this.availableCells;
		if (!cells.length) return;
		const options = cells.filter(cell => {
			return diceScore[cell.camelCaseRow] !== 0;
		});
		const getListener = (cell, value) => {
			return () => {
				cell.value = value;
				this.resetColumnState();
				if (onCellSelect) return onCellSelect(this, cell);
			};
		};
		if (!options.length && this.rollsLeft < 1) {
			cells.forEach(cell => {
				cell.setTempValue(cell.disabledValue);
				cell.element.classList.add('disable');
				cell.setClickListener(getListener(cell, cell.disabledValue));
			});
			return;
		}
		options.forEach(cell => {
			const value = diceScore[cell.camelCaseRow];
			cell.setTempValue(value);
			cell.element.classList.add('option');
			cell.setClickListener(getListener(cell, value));
		});
	}
}
