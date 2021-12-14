/**
 * @param {Number[]} values
 * @returns {Number[]}
 */
function getOccurrences(values) {
	const occurrences = [0, 0, 0, 0, 0, 0];
	values.forEach(value => {
		const i = value - 1;
		occurrences[i]++;
	});
	return occurrences;
}

/**
 * @param {Number[]} occurrences
 * @param {Number} minCount
 * @returns {Number[]}
 */
function filterByOccurance(occurrences, minCount) {
	return occurrences.reduce((arr, count, index) => {
		if (count >= minCount) arr.push(index + 1);
		return arr;
	}, []);
}

/**
 *
 * @param {Number[]} occurrences
 * @returns {Number[]}
 */
function getPairs(occurrences) {
	return Math.max(...occurrences) < 2
		? []
		: filterByOccurance(occurrences, 2);
}

/**
 * @param {Number[]} occurrences
 * @returns {Number}
 */
function getThreeOfKind(occurrences) {
	return Math.max(...occurrences) < 3
		? 0
		: filterByOccurance(occurrences, 3)[0] * 3;
}
/**
 * @param {Number[]} occurrences
 * @returns {Number}
 */
function getFourOfKind(occurrences) {
	return Math.max(...occurrences) < 4
		? 0
		: filterByOccurance(occurrences, 4)[0] * 4;
}
/**
 * @param {Number[]} occurrences
 * @returns {Number}
 */
function getYatzy(occurrences) {
	return occurrences.includes(5) ? 50 : 0;
}

/**
 * @param {Number[]} occurrences
 * @returns {Number}
 */
function getFullHouse(occurrences) {
	const pairs = getPairs(occurrences);
	const threeOfKind = getThreeOfKind(occurrences);
	const uniquePair = pairs.filter(pair => pair !== threeOfKind / 3);
	if (!pairs.length || !threeOfKind || !uniquePair.length) return 0;
	return uniquePair[0] * 2 + threeOfKind;
}
/**
 * @param {Number[]} values
 * @param {Number} start
 * @returns {Number}
 */
function getStraight(values, start = 1) {
	let points = 0;
	for (let i = start; i < start + 5; i++) {
		if (!values.includes(i)) return 0;
		points += i;
	}
	return points;
}

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
 *
 * @param {Number[]} diceValues
 */
function calculateDiceScore(diceValues) {
	const occurrences = getOccurrences(diceValues);
	const score = scoreTemplate();
	score.one = occurrences[0];
	score.two = occurrences[1] * 2;
	score.three = occurrences[2] * 3;
	score.four = occurrences[3] * 4;
	score.five = occurrences[4] * 5;
	score.six = occurrences[5] * 6;
	score.smallStraight = getStraight(diceValues, 1);
	score.largeStraight = getStraight(diceValues, 2);
	score.chance = diceValues.reduce((sum, value) => sum + value, 0);
	const pairs = getPairs(occurrences);
	if (pairs.length < 1) return score;

	score.pair = Math.max(...pairs) * 2;
	score.threeOfKind = getThreeOfKind(occurrences);
	score.fourOfKind = getFourOfKind(occurrences);
	score.yatzy = getYatzy(occurrences);

	if (pairs.length > 1) {
		score.twoPair = (pairs[0] + pairs[1]) * 2;
		score.fullHouse = getFullHouse(occurrences);
	}
	return score;
}

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
	score.smallStraight = getStraight([1, 2, 3, 4, 5], 1);
	score.largeStraight = getStraight([1, 2, 3, 4, 5], 1);
	score.chance = 6 * 5;
	score.yatzy = 50;
	return score;
}

export {
	getOccurrences,
	filterByOccurance,
	getPairs,
	getThreeOfKind,
	getFourOfKind,
	getFullHouse,
	getStraight,
	getYatzy,
	scoreTemplate,
	calculateDiceScore,
	getMaxDiceScore,
};
