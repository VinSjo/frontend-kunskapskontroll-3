// This file contains functions used to calculate yatzy-score

/**
 * Creates a template for holding yatzy-scores
 */
function scoreTemplate() {
	return {
		one: 0,
		two: 0,
		three: 0,
		four: 0,
		five: 0,
		six: 0,
		pair: 0,
		twoPair: 0,
		threeOfKind: 0,
		fourOfKind: 0,
		fullHouse: 0,
		smallStraight: 0,
		largeStraight: 0,
		chance: 0,
		yatzy: 0,
	};
}

/**
 * Get number of occurrences in an array of numbers for each integer between
 * 1 and 6
 *
 * @param {Number[]} diceValues - array of dice values
 * @returns {Number[]}
 */
function getOccurrences(diceValues) {
	const occurrences = [0, 0, 0, 0, 0, 0];
	diceValues.forEach(value => {
		const i = value - 1;
		occurrences[i]++;
	});
	return occurrences;
}

/**
 * Calculates score based on 5 dice values, returns a scoreTemplate with
 * the result
 *
 * @param {Number[]} diceValues
 * @returns {Object} - scoreTemplate with the result
 * @see {@link scoreTemplate}
 */
function calculateDiceScore(diceValues) {
	const occ = getOccurrences(diceValues);
	function getSameNumber(minCount) {
		const max = Math.max(...occ);
		const num = max < minCount ? 0 : occ.indexOf(max) + 1;
		return num;
	}
	function getStraight(first) {
		let points = 0;
		for (let i = first; i < first + diceValues.length; i++) {
			if (!diceValues.includes(i)) return 0;
			points += i;
		}
		return points;
	}

	const score = scoreTemplate();
	score.one = occ[0];
	score.two = occ[1] * 2;
	score.three = occ[2] * 3;
	score.four = occ[3] * 4;
	score.five = occ[4] * 5;
	score.six = occ[5] * 6;
	score.smallStraight = getStraight(diceValues, 1);
	score.largeStraight = getStraight(diceValues, 2);
	score.chance = diceValues.reduce((sum, value) => sum + value, 0);
	if (Math.max(...occ) < 2) return score;
	const pairs = [];

	occ.forEach((count, i) => {
		if (count < 2) return;
		const num = i + 1;
		pairs.push(num);
	});

	score.pair = Math.max(...pairs) * 2;
	score.threeOfKind = getSameNumber(occ, 3) * 3;
	score.fourOfKind = getSameNumber(occ, 4) * 4;
	score.yatzy = Math.max(...occ) === 5 ? 50 : 0;

	if (pairs.length > 1) {
		score.twoPair = (pairs[0] + pairs[1]) * 2;
		if (score.threeOfKind) {
			const roof = getSameNumber(occ, 3);
			const base = pairs.reduce((num, current) => {
				return num === roof ? current : num;
			});
			score.fullHouse = roof * 3 + base * 2;
		}
	}

	return score;
}

/**
 * Get the maximum possible yatzy score for all fields
 *
 * @returns {Object} - scoreTemplate with the max possible score for each field
 * @see {@link scoreTemplate}
 */
function getMaxDiceScore() {
	const score = scoreTemplate();
	score.one = 5;
	score.two = 2 * 5;
	score.three = 3 * 5;
	score.four = 4 * 5;
	score.five = 5 * 5;
	score.six = 6 * 5;
	score.pair = 6 * 2;
	score.twoPair = 6 * 2 + 5 * 2;
	score.threeOfKind = 6 * 3;
	score.fourOfKind = 6 * 4;
	score.fullHouse = 6 * 3 + 5 * 2;
	score.smallStraight = [1, 2, 3, 4, 5].reduce((sum, num) => sum + num);
	score.largeStraight = [2, 3, 4, 5, 6].reduce((sum, num) => sum + num);
	score.chance = 6 * 5;
	score.yatzy = 50;
	return score;
}

export { getOccurrences, scoreTemplate, calculateDiceScore, getMaxDiceScore };
