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

export {
	getOccurrences,
	filterByOccurance,
	getPairs,
	getThreeOfKind,
	getFourOfKind,
	getFullHouse,
	getStraight,
	getYatzy,
};
