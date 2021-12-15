import Player from './Player.js';
import Die from './Die.js';
import ScoreTableCell from './ScoreTableCell.js';
import { getMaxDiceScore } from '../functions/calculations.js';

/**
 * A subclass of Player that adds some sketchy methods used to automate gameplay
 * Doesn't have include the logic needed to "lock" the dice, so should be pretty
 * easy to beat
 *
 * @see {@link Player}
 */
export default class AiPlayer extends Player {
	/**
	 * @param {String} id
	 * @param {String} name
	 * @param {PlayerScoreCell[]} tableColumn
	 * @param {Die[]} dice
	 *
	 * @see {@link ScoreTableCell}
	 * @see {@link Die}
	 */
	constructor(id, name, tableColumn, dice) {
		super(id, name, tableColumn, dice);
		this.type = 'cpu';
		this.isPlaying = false;
	}

	get scoreData() {
		const [diceScore, options] = this.diceScore;
		const maxScore = getMaxDiceScore();
		const scoreDiff = { ...diceScore };
		for (const [key, value] of Object.entries(scoreDiff)) {
			scoreDiff[key] = maxScore[key] - value;
		}
		return {
			dice: diceScore,
			options: options,
			max: maxScore,
			diff: scoreDiff,
		};
	}

	/**
	 * Compares each available cell in players column and returns the one that
	 * will result in the highest score compared to the maximum possible score
	 * If no cells are available it returns the cell that has the lowest maximum
	 * score, which will be "crossed" out
	 *
	 * @returns {ScoreTableCell} - returns the cell that should be the best choice
	 * to maximize score
	 * @see {@link ScoreTableCell}
	 */
	getBestOption() {
		const score = this.scoreData;
		const cells = !score.options.length
			? this.availableCells
			: score.options;
		return cells.reduce((previous, current) => {
			const prevMax = score.max[previous.scoreKey];
			const currMax = score.max[current.scoreKey];
			if (!score.options.length) {
				return prevMax > currMax ? current : previous;
			}
			const prevDiff = score.diff[previous.scoreKey];
			const currDiff = score.diff[current.scoreKey];
			return prevDiff > currDiff ? current : previous;
		});
	}

	/**
	 * Auto-play a turn
	 *
	 * @param {Function} onRollClick - callback to simulate click on rollbutton
	 * @param {Function} onCellSelect - callback to simulate click on cell in
	 * scoreTable
	 * @param {Number} [selectTimeout] - timeout used to limit the speed,
	 * default is 500
	 */
	async automateTurn(onRollClick, onCellSelect, selectTimeout = 500) {
		await onRollClick();
		const score = this.scoreData;
		const selectedCell = this.getBestOption();
		const key = selectedCell.scoreKey;
		const threshold =
			this.availableCells.length / Object.keys(score.dice).length || 1;
		if (
			score.dice[key] < score.max[key] * threshold &&
			this.rollsLeft >= 1
		) {
			const newRoll = await this.automateTurn(
				onRollClick,
				onCellSelect,
				selectTimeout
			);
			return await new Promise(resolve => {
				setTimeout(() => {
					resolve(newRoll);
				}, selectTimeout);
			});
		}
		return await new Promise(resolve =>
			setTimeout(() => {
				if (selectedCell.clickListener) {
					resolve(selectedCell.clickListener());
					return;
				}
				selectedCell.value =
					score.dice[key] || selectedCell.disabledValue;
				this.resetColumnState();
				resolve(onCellSelect ? onCellSelect(this) : true);
			}, selectTimeout)
		);
	}
}
