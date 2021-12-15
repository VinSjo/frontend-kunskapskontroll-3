import Player from './Player.js';
import { getMaxDiceScore } from '../functions/calculations.js';

/**
 * A subclass of Player that adds methods used to automate gameplay
 * @see {@link Player}
 */
export default class AiPlayer extends Player {
	/**
	 * @param {String} id
	 * @param {String} name
	 * @param {PlayerScoreCell[]} tableColumn
	 * @param {Die[]} dice
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
	 */
	async automateTurn(onRollClick, onCellSelect, selectTimeout = 500) {
		await onRollClick();
		const score = this.scoreData;
		const selectedCell = this.getBestOption();
		const key = selectedCell.scoreKey;
		const threshold =
			this.availableCells.length / Object.keys(score.dice).length || 1;
		console.log('threshold: ' + threshold);
		if (
			score.dice[key] < score.max[key] * threshold &&
			this.rollsLeft >= 1
		) {
			const newRoll = await this.automateTurn(
				onRollClick,
				onDieClick,
				onCellSelect
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
