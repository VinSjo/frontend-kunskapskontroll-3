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
	return Math.max(...occurrences) < 2 ? 0 : filterByOccurance(occurrences, 2);
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

function calculateUpperSection(occurrences) {
	const output = scoreCardTemplate().upper;
	Object.keys(output).forEach(key => {
		const number = parseInt(key);
		const index = number - 1;
		output[key] = occurrences[index] * number;
	});
	return output;
}

function scoreCardTemplate() {
	return {
		upper: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
		},
		lower: {
			pair: 0,
			twoPair: 0,
			threeOfKind: 0,
			fourOfKind: 0,
			smallStraight: 0,
			largeStraight: 0,
			fullHouse: 0,
			chance: 0,
			yatzy: 0,
		},
	};
}

/**
 * @param {Number[]} values
 */
function calculateDiceScore(values) {
	const score = scoreCardTemplate();
	score.lower.chance = values.reduce((sum, value) => sum + value, 0);
	score.lower.smallStraight = getStraight(values, 1);
	score.lower.largeStraight = getStraight(values, 2);
	const occurrences = getOccurrences(values);
	score.upper = calculateUpperSection(occurrences);

	const pairs = getPairs(occurrences);

	if (!pairs.length) return score;

	score.lower.pair = Math.max(...pairs);
	score.lower.threeOfKind = getThreeOfKind(occurrences);

	if (pairs.length > 1) {
		score.lower.twoPair = (pairs[0] + pairs[1]) * 2;
		score.lower.pair = Math.max(...pairs);
		score.lower.fullHouse = getFullHouse(occurrences);
	}
	score.lower.fourOfKind = getFourOfKind(occurrences);
	score.lower.yatzy = getYatzy(occurrences);
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
	scoreCardTemplate,
	calculateUpperSection,
	calculateDiceScore,
};
