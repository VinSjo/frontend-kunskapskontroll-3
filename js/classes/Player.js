import Die from './Die.js';
import ScoreTableCell from './ScoreTableCell.js';
import { calculateDiceScore } from '../functions/calculations.js';

/**
 * Class used for the game's players
 */
export default class Player {
	/**
	 * @param {String} id
	 * @param {String} name
	 * @param {ScoreTableCell[]} tableColumn
	 * @param {Die[]} dice
	 */
	constructor(id, name, tableColumn, dice) {
		this.id = id;
		this.name = name;
		this.column = tableColumn;
		this.rollsLeft = 3;
		this.dice = dice;
		this.type = 'human';
		this.isRolling = false;
		/**
		 * @param {ScoreTableCell[]} section
		 * @returns {Number}
		 */
		const reduceSection = section => {
			return section.reduce((sum, cell) => {
				const val = cell.value;
				return sum + (typeof val === 'number' ? val : 0);
			}, 0);
		};
		const sections = {
			upper: this.column.filter(cell => cell.section === 'upper'),
			lower: this.column.filter(cell => cell.section === 'lower'),
			sum: this.column.filter(cell => cell.section === 'sum'),
			total: this.column.filter(cell => cell.row === 'total'),
		};
		const score = {
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
		this.sections = sections;
		this.score = score;
	}

	get availableCells() {
		return this.column.filter(
			cell =>
				cell.value === null &&
				cell.section !== 'sum' &&
				cell.row !== 'total'
		);
	}

	get diceValues() {
		return this.dice.map(die => die.value);
	}

	get diceScore() {
		const available = this.availableCells;
		const diceScore = calculateDiceScore(this.diceValues);
		const options = available.filter(cell => {
			return diceScore[cell.scoreKey] !== 0;
		});
		return [diceScore, options];
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
			if (cell.row === 'upper-sum') {
				cell.element.textContent = this.score.upper;
				return;
			}
			cell.element.textContent = this.score.bonus;
		});
	}
	displayTotal() {
		this.sections.total[0].element.textContent = this.score.total;
	}
	roll() {
		return this.dice.map(die => die.roll());
	}
	/**
	 * @param {Function} [onCellSelect]
	 */
	async animatedRoll(onCellSelect = null, interval = 60, timeout = 500) {
		const dice = this.dice.filter(die => !die.isLocked);
		if (!dice.length || this.isRolling || this.rollsLeft < 1) {
			return this.diceValues;
		}
		this.rollsLeft--;
		this.isRolling = true;

		const randomOffset = max => {
			return Math.round(Math.random() * max * 2) - max;
		};

		let intervalID = setInterval(() => {
			dice.forEach(die => {
				const x = randomOffset(4),
					y = randomOffset(4),
					deg = randomOffset(8);
				die.element.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
				die.roll();
			});
		}, interval);

		await new Promise(resolve => {
			setTimeout(() => {
				clearInterval(intervalID);
				dice.forEach(die => {
					die.element.style.transform = null;
					die.element.style.transition = null;
				});
				this.isRolling = false;
				resolve(this.roll());
			}, timeout);
		});

		this.resetColumnState();
		this.setCurrent();
		const [diceScore, options] = this.diceScore;

		const getListener = (cell, value) => {
			return () => {
				cell.value = value;
				this.resetColumnState();
				if (onCellSelect) return onCellSelect(this, cell);
			};
		};
		if (!options.length && this.rollsLeft < 1) {
			this.availableCells.forEach(cell => {
				cell.setTempValue(cell.disabledValue);
				cell.element.classList.add('disable');
				cell.setClickListener(getListener(cell, cell.disabledValue));
			});
		} else {
			options.forEach(cell => {
				const value = diceScore[cell.scoreKey];
				cell.setTempValue(value);
				cell.element.classList.add('option');
				cell.setClickListener(getListener(cell, value));
			});
		}
		return [diceScore, options];
	}
}
