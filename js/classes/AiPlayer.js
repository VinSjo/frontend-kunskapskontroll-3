import Player from './Player.js';
import ScoreTableCell from './ScoreTableCell.js';
import {
	calculateDiceScore,
	getMaxDiceScore,
} from '../functions/calculations.js';

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

	// /**
	//  * @param {HTMLButtonElement} rollButton
	//  * @param {Function} onCellSelect
	//  * @param {Function} onRoll
	//  * @param {Number} rollInterval
	//  * @param {Number} timeout
	//  */
	// async automateTurn(rollButton, timeout = 1000) {
	// 	await new Promise(resolve => {
	// 		let intervalID = setInterval(() => {
	// 			if (this.isRolling) return;
	// 			if (rollButton.disabled || this.rollsLeft < 1) {
	// 				clearInterval(intervalID);
	// 				intervalID = null;
	// 				resolve();
	// 				return;
	// 			}
	// 			rollButton.dispatchEvent(new Event('click'));
	// 		}, timeout);
	// 	});
	// 	const selectedCell = this.getBestOption();

	// 	return await new Promise(resolve =>
	// 		setTimeout(() => {
	// 			resolve(selectedCell.element.dispatchEvent(new Event('click')));
	// 		}, timeout * 0.5)
	// 	);
	// }

	/**
	 * @param {Function} onRollClick
	 * @param {Function} onDieClick
	 *@param {Function} onCellSelect
	 */
	async automateTurn(onRollClick, onDieClick, onCellSelect) {
		await onRollClick();
		const score = this.scoreData;
		const selectedCell = this.getBestOption();
		const key = selectedCell.scoreKey;
		const diff = score.diff[key];
		const max = score.max[key];
		if (diff > max * 0.2 && this.rollsLeft >= 1) {
			return await this.automateTurn(onRollClick, onDieClick);
		}
		return await new Promise(resolve =>
			setTimeout(() => {
				if (selectedCell.clickListener) {
					resolve(selectedCell.clickListener());
					return;
				}

				const diceScore = score.diceScore[key];
				selectedCell.value = diceScore || selectedCell.disabledValue;
				this.resetColumnState();
				resolve(onCellSelect ? onCellSelect(this) : true);
			}, 50)
		);
	}
}
